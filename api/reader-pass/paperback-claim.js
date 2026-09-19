import {readJson,json,rateLimit,hashIp,hashActivation,hashReference,clientIp,hashPass,pool,audit,newReaderPass} from "./_lib/reader-pass.js";

const ACTIVATIONS=()=>JSON.parse(process.env.PAPERBACK_ACTIVATION_MAP||"{}");
const normalizeOrder=(v)=>String(v||"").trim().toUpperCase().replace(/\s+/g,"");
const validAmazonOrder=(v)=>/^\d{3}-\d{7}-\d{7}$/.test(v);

export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"method_not_allowed"});
 try{
  const ip=clientIp(req),ipKey=hashIp(ip);
  if(!await rateLimit("paperback-ip:"+ipKey,5,3600))return json(res,429,{error:"rate_limited"});
  const b=await readJson(req);
  const product=String(b.product||""),edition=String(b.edition||""),code=String(b.activation_code||""),order=normalizeOrder(b.order_reference);
  if(!product||!edition||!code||!order)return json(res,400,{error:"invalid_request"});
  if(!validAmazonOrder(order))return json(res,400,{error:"invalid_order_reference"});
  const cfg=ACTIVATIONS()[product];
  if(!cfg?.edition||!cfg?.activation_hash)return json(res,503,{error:"paperback_activation_unavailable"});
  const supplied=hashActivation(code);
  if(cfg.edition!==edition||supplied!==String(cfg.activation_hash)){
    await audit(null,product,"paperback_claim_denied",req);
    return json(res,403,{error:"paperback_not_verified"});
  }
  if(!await rateLimit("paperback-code-ip:"+supplied+":"+ipKey,4,3600))return json(res,429,{error:"rate_limited"});
  if(!await rateLimit("paperback-title-ip:"+product+":"+ipKey,3,2592000))return json(res,429,{error:"activation_limit"});
  const orderHash=hashReference("amazon-order:"+order);
  const c=await pool().connect();
  try{
   await c.query("begin");
   const prior=await c.query("select reader_pass_id from paperback_claims where order_reference_hash=$1 limit 1",[orderHash]);
   if(prior.rowCount){await c.query("rollback");return json(res,409,{error:"order_already_claimed"});}
   let passId,pass=null,attached=false,alreadyAttached=false;
   if(b.reader_pass){
     const p=await c.query("select id,status from reader_passes where pass_hash=$1 for update",[hashPass(String(b.reader_pass))]);
     if(!p.rowCount||p.rows[0].status!=="active"){await c.query("rollback");return json(res,403,{error:"invalid_reader_pass"});}
     passId=p.rows[0].id;attached=true;
     const ex=await c.query("select 1 from reader_entitlements where reader_pass_id=$1 and product_slug=$2 and edition=$3 and status='active' limit 1",[passId,product,edition]);
     alreadyAttached=ex.rowCount===1;
   }else{
     pass=newReaderPass();
     const p=await c.query("insert into reader_passes(pass_hash,pass_hint,max_devices) values($1,$2,2) returning id",[hashPass(pass),pass.slice(-4)]);
     passId=p.rows[0].id;
   }
   if(!alreadyAttached){
     await c.query("insert into reader_entitlements(reader_pass_id,product_slug,edition,source,source_reference_hash) values($1,$2,$3,'paperback',$4)",[passId,product,edition,orderHash]);
   }
   await c.query("insert into paperback_claims(reader_pass_id,product_slug,edition,order_reference_hash,activation_hash,claim_ip_hash) values($1,$2,$3,$4,$5,$6)",[passId,product,edition,orderHash,supplied,ipKey]);
   await c.query("commit");
   await audit(passId,product,alreadyAttached?"paperback_entitlement_existing":attached?"paperback_entitlement_attached":"paperback_claim_issued",req);
   return json(res,201,{reader_pass:pass,attached,already_attached:alreadyAttached,product,edition,device_limit:2});
  }catch(e){await c.query("rollback").catch(()=>{});throw e;}finally{c.release();}
 }catch{return json(res,503,{error:"paperback_claim_unavailable"});}
}
