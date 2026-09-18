import {readJson,json,rateLimit,hashIp,hashActivation,clientIp,hashPass,pool,audit,newReaderPass} from "./_lib/reader-pass.js";

const ACTIVATIONS=()=>JSON.parse(process.env.PAPERBACK_ACTIVATION_MAP||"{}");

export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"method_not_allowed"});
 try{
  const ipKey=hashIp(clientIp(req));
  if(!await rateLimit("paperback-ip:"+ipKey,5,3600))return json(res,429,{error:"rate_limited"});
  const b=await readJson(req);
  const product=String(b.product||""),edition=String(b.edition||""),code=String(b.activation_code||"");
  if(!product||!edition||!code)return json(res,400,{error:"invalid_request"});
  const cfg=ACTIVATIONS()[product];
  if(!cfg?.edition||!cfg?.activation_hash)return json(res,503,{error:"paperback_activation_unavailable"});
  const supplied=hashActivation(code);
  if(cfg.edition!==edition||supplied!==String(cfg.activation_hash)){
    await audit(null,product,"paperback_claim_denied",req);
    return json(res,403,{error:"paperback_not_verified"});
  }
  if(!await rateLimit("paperback-code-ip:"+supplied+":"+ipKey,4,3600))return json(res,429,{error:"rate_limited"});
  const c=await pool().connect();
  try{
   await c.query("begin");
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
     await c.query("insert into reader_entitlements(reader_pass_id,product_slug,edition,source,source_reference_hash) values($1,$2,$3,'paperback',null)",[passId,product,edition]);
   }
   await c.query("commit");
   await audit(passId,product,alreadyAttached?"paperback_entitlement_existing":attached?"paperback_entitlement_attached":"paperback_claim_issued",req);
   return json(res,201,{reader_pass:pass,attached,already_attached:alreadyAttached,product,edition,device_limit:2});
  }catch(e){await c.query("rollback").catch(()=>{});throw e;}finally{c.release();}
 }catch{return json(res,503,{error:"paperback_claim_unavailable"});}
}
