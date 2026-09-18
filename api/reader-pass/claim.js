import crypto from "node:crypto";
import {readJson,json,rateLimit,hashIp,clientIp,db,hashPass} from "./_lib/reader-pass.js";

const PRODUCT_MAP=()=>JSON.parse(process.env.GUMROAD_PRODUCT_MAP||"{}");
const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newPass(){let s="TYC-";const b=crypto.randomBytes(20);for(let i=0;i<20;i++){s+=alphabet[b[i]%alphabet.length];if([3,7,11,15].includes(i))s+="-";}return s;}
async function verifyGumroad(productId,key){
 const body=new URLSearchParams({product_id:productId,license_key:key,increment_uses_count:"false"});
 const r=await fetch("https://api.gumroad.com/v2/licenses/verify",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body});
 if(!r.ok)return null;const x=await r.json();if(!x.success)return null;
 const p=x.purchase||{};if(p.refunded||p.disputed||p.chargebacked||p.subscription_ended_at||p.subscription_failed_at)return null;
 return x;
}
export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"method_not_allowed"});
 try{
  if(!await rateLimit("claim:"+hashIp(clientIp(req)),6,3600))return json(res,429,{error:"rate_limited"});
  const b=await readJson(req);if(b.source!=="gumroad"||!b.license_key||!b.product)return json(res,400,{error:"invalid_request"});
  const map=PRODUCT_MAP(),m=map[b.product];if(!m?.product_id||!m?.edition)return json(res,503,{error:"product_mapping_unavailable"});
  const g=await verifyGumroad(m.product_id,String(b.license_key));if(!g)return json(res,403,{error:"purchase_not_verified"});
  const sale=String(g.purchase?.sale_id||g.purchase?.id||"");if(!sale)return json(res,403,{error:"purchase_not_verified"});
  const saleHash=hashIp("gumroad-sale:"+sale);
  const existing=await db("reader_entitlements?select=reader_pass_id&source=eq.gumroad&source_reference_hash=eq."+saleHash);
  if(existing?.length)return json(res,409,{error:"purchase_already_claimed"});
  const pass=newPass(),ph=hashPass(pass),hint=pass.slice(-4);
  const created=await db("reader_passes?select=id",{method:"POST",headers:{Prefer:"return=representation"},body:JSON.stringify({pass_hash:ph,pass_hint:hint,max_devices:2})});
  const id=created?.[0]?.id;if(!id)throw new Error("pass_create_failed");
  await db("reader_entitlements",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({reader_pass_id:id,product_slug:b.product,edition:m.edition,source:"gumroad",source_reference_hash:saleHash})});
  return json(res,201,{reader_pass:pass,product:b.product,edition:m.edition,device_limit:2});
 }catch{return json(res,503,{error:"claim_unavailable"});}
}