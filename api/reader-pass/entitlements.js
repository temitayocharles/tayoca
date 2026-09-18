import {json,readSession,entitlement,activeDevice,sessionDeviceMatches} from "./_lib/reader-pass.js";
export default async function handler(req,res){
 if(req.method!=="GET")return json(res,405,{error:"method_not_allowed"});
 try{
  const raw=(req.headers.cookie||"").match(/(?:^|; )tayoca_reader=([^;]+)/)?.[1];if(!raw)return json(res,401,{error:"unauthorized"});
  const s=await readSession(raw);
  if(!sessionDeviceMatches(req,s))return json(res,401,{error:"device_mismatch"});
  if(!await activeDevice(s.sub,s.device))return json(res,403,{error:"device_revoked"});
  const e=await entitlement(s.sub,s.product,s.edition);if(!e)return json(res,403,{error:"not_entitled"});
  return json(res,200,{ok:true,product:s.product,edition:s.edition});
 }catch{return json(res,401,{error:"unauthorized"});}
}
