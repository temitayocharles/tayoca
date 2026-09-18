import {readJson,json,clientIp,deviceId,rateLimit,getPass,entitlement,bindDevice,issueSession,cookie,audit,hashIp,hashPass,sql} from "./_lib/reader-pass.js";
export default async function handler(req,res){
 if(req.method!=="POST")return json(res,405,{error:"method_not_allowed"});
 try{
  const body=await readJson(req), pass=String(body.pass||""), product=String(body.product||""), edition=String(body.edition||""), dev=deviceId(req);
  if(!pass||!product||!edition||!dev)return json(res,400,{error:"invalid_request"});
  if(!await rateLimit("ip:"+hashIp(clientIp(req)),12,900))return json(res,429,{error:"rate_limited"});
  if(!await rateLimit("pass:"+hashPass(pass),20,900))return json(res,429,{error:"rate_limited"});
  const rec=await getPass(pass); if(!rec||rec.status!=="active"){await audit(rec?.id,product,"session_denied",req);return json(res,401,{error:"invalid_pass"});}
  const ent=await entitlement(rec.id,product,edition);if(!ent){await audit(rec.id,product,"entitlement_denied",req);return json(res,403,{error:"not_entitled"});}
  const dh=await bindDevice(rec,dev);if(!dh){await audit(rec.id,product,"device_limit",req);return json(res,403,{error:"device_limit"});}
  const token=await issueSession({sub:rec.id,product,edition,device:dh});await sql("update reader_passes set last_used_at=now() where id=$1",[rec.id]);await audit(rec.id,product,"session_issued",req,dh);
  return json(res,200,{ok:true},{"set-cookie":cookie("tayoca_reader",token)});
 }catch(e){return json(res,503,{error:"reader_pass_unavailable"});}
}