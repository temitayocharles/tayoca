import {readJson,json,rateLimit,hashIp,hashReference,clientIp,hashPass,pool,audit,newReaderPass} from "./_lib/reader-pass.js";
const PRODUCT_MAP=()=>JSON.parse(process.env.GUMROAD_PRODUCT_MAP||"{}");
async function verifyGumroad(productId,key){
 const body=new URLSearchParams({product_id:productId,license_key:key,increment_uses_count:"false"});
 const r=await fetch("https://api.gumroad.com/v2/licenses/verify",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body});
 if(!r.ok)return null;const x=await r.json();if(!x.success)return null;
 const p=x.purchase||{};if(p.refunded||p.disputed||p.chargebacked||p.subscription_ended_at||p.subscription_failed_at)return null;return x;
}
export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"method_not_allowed"});
 try{
  if(!await rateLimit("claim:"+hashIp(clientIp(req)),6,3600))return json(res,429,{error:"rate_limited"});
  const b=await readJson(req);if(b.source!=="gumroad"||!b.license_key||!b.product)return json(res,400,{error:"invalid_request"});
  const m=PRODUCT_MAP()[b.product];if(!m?.product_id||!m?.edition)return json(res,503,{error:"product_mapping_unavailable"});
  const g=await verifyGumroad(m.product_id,String(b.license_key));if(!g)return json(res,403,{error:"purchase_not_verified"});
  const sale=String(g.purchase?.sale_id||g.purchase?.id||"");if(!sale)return json(res,403,{error:"purchase_not_verified"});
  const saleHash=hashReference("gumroad-sale:"+sale),c=await pool().connect();
  try{
   await c.query("begin");
   const ex=await c.query("select reader_pass_id from reader_entitlements where source='gumroad' and source_reference_hash=$1 limit 1",[saleHash]);
   if(ex.rowCount){await c.query("rollback");return json(res,409,{error:"purchase_already_claimed"});}
   let passId,pass=null,attached=false;
   if(b.reader_pass){
     const p=await c.query("select id,status from reader_passes where pass_hash=$1 for update",[hashPass(String(b.reader_pass))]);
     if(!p.rowCount||p.rows[0].status!=="active"){await c.query("rollback");return json(res,403,{error:"invalid_reader_pass"});}
     passId=p.rows[0].id;attached=true;
   }else{
     pass=newReaderPass();
     const p=await c.query("insert into reader_passes(pass_hash,pass_hint,max_devices) values($1,$2,2) returning id",[hashPass(pass),pass.slice(-4)]);
     passId=p.rows[0].id;
   }
   await c.query("insert into reader_entitlements(reader_pass_id,product_slug,edition,source,source_reference_hash) values($1,$2,$3,'gumroad',$4)",[passId,b.product,m.edition,saleHash]);
   await c.query("commit");await audit(passId,b.product,attached?"gumroad_entitlement_attached":"gumroad_claim_issued",req);
   return json(res,201,{reader_pass:pass,attached,product:b.product,edition:m.edition,device_limit:2});
  }catch(e){await c.query("rollback").catch(()=>{});throw e;}finally{c.release();}
 }catch{return json(res,503,{error:"claim_unavailable"});}
}