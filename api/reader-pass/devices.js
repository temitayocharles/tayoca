import {json,readJson,readSession,sql,activeDevice} from "./_lib/reader-pass.js";

function token(req){return (req.headers.cookie||"").match(/(?:^|; )tayoca_reader=([^;]+)/)?.[1]||"";}

export default async function handler(req,res){
 try{
  const s=await readSession(token(req)); if(!s?.sub)return json(res,401,{error:"unauthorized"});
  if(!await activeDevice(s.sub,s.device))return json(res,403,{error:"device_revoked"});
  if(req.method==="GET"){
   const q=await sql("select id,device_hash,first_seen_at,last_seen_at,revoked_at from reader_devices where reader_pass_id=$1 order by last_seen_at desc",[s.sub]);
   return json(res,200,{devices:q.rows.map(x=>({id:x.id,label:"Device …"+x.device_hash.slice(-6),first_seen_at:x.first_seen_at,last_seen_at:x.last_seen_at,revoked:!!x.revoked_at,current:x.device_hash===s.device}))});
  }
  if(req.method==="POST"){
   const b=await readJson(req);if(!b.id)return json(res,400,{error:"invalid_request"});
   const q=await sql("update reader_devices set revoked_at=now() where id=$1 and reader_pass_id=$2 and revoked_at is null returning device_hash",[b.id,s.sub]);
   if(!q.rowCount)return json(res,404,{error:"device_not_found"});
   const current=q.rows[0].device_hash===s.device;
   return json(res,200,{ok:true,current});
  }
  return json(res,405,{error:"method_not_allowed"});
 }catch{return json(res,401,{error:"unauthorized"});}
}
