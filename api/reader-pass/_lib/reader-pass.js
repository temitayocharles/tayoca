import crypto from "node:crypto";
import pg from "pg";
import { SignJWT, jwtVerify } from "jose";
const { Pool } = pg;
const enc = new TextEncoder();
const required = (name) => { const v=process.env[name]; if(!v) throw new Error("missing_"+name); return v; };
const hmac=(label,value)=>crypto.createHmac("sha256",required("READER_PASS_PEPPER")).update(label+"\0"+value).digest("hex");
let _pool;
export const pool=()=>_pool||(_pool=new Pool({connectionString:required("DATABASE_URL"),max:3,idleTimeoutMillis:10000,connectionTimeoutMillis:5000}));
export const sql=(text,params=[])=>pool().query(text,params);
export const hashPass=(v)=>hmac("pass",String(v).trim().toUpperCase());
export const hashDevice=(v)=>hmac("device",String(v));
export const hashIp=(v)=>hmac("ip",String(v));
export const hashReference=(v)=>hmac("source-ref",String(v));
export async function activeDevice(passId,deviceHash){const q=await sql("select 1 from reader_devices where reader_pass_id=$1 and device_hash=$2 and revoked_at is null limit 1",[passId,deviceHash]);return q.rowCount===1;}
export async function rateLimit(key,limit,seconds){
 const kh=hmac("ratelimit",key);
 const q=await sql(`insert into reader_rate_limits(key_hash,count,window_started_at) values($1,1,now())
 on conflict(key_hash) do update set
 count=case when reader_rate_limits.window_started_at < now()-($2::text||' seconds')::interval then 1 else reader_rate_limits.count+1 end,
 window_started_at=case when reader_rate_limits.window_started_at < now()-($2::text||' seconds')::interval then now() else reader_rate_limits.window_started_at end
 returning count`,[kh,seconds]);
 return q.rows[0].count<=limit;
}
export async function issueSession(payload){return new SignJWT(payload).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30m").sign(enc.encode(required("READER_SESSION_SECRET")));}
export async function readSession(token){return (await jwtVerify(token,enc.encode(required("READER_SESSION_SECRET")))).payload;}
export function cookie(name,value,maxAge=1800){return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;}
export function json(res,status,body,headers={}){res.statusCode=status;res.setHeader("content-type","application/json");res.setHeader("cache-control","no-store");for(const[k,v]of Object.entries(headers))res.setHeader(k,v);res.end(JSON.stringify(body));}
export async function readJson(req){let s="";for await(const c of req){s+=c;if(s.length>8192)throw new Error("too_large");}return JSON.parse(s||"{}");}
export function clientIp(req){return String(req.headers["x-forwarded-for"]||"").split(",")[0].trim()||"unknown";}
export function deviceId(req){
 const v=String(req.headers["x-tayoca-device"]||"").trim();
 return /^[A-Za-z0-9._:-]{16,128}$/.test(v)?v:"";
}
export function sessionDeviceMatches(req,session){const raw=deviceId(req);return !!raw&&hashDevice(raw)===session.device;}
export async function getPass(raw){const q=await sql("select id,status,max_devices from reader_passes where pass_hash=$1 limit 1",[hashPass(raw)]);return q.rows[0]||null;}
export async function entitlement(passId,product,edition){const q=await sql("select id,status from reader_entitlements where reader_pass_id=$1 and product_slug=$2 and edition=$3 and status='active' limit 1",[passId,product,edition]);return q.rows[0]||null;}
export async function bindDevice(pass,rawDevice){
 const dh=hashDevice(rawDevice),c=await pool().connect();
 try{
  await c.query("begin"); await c.query("select pg_advisory_xact_lock(hashtext($1))",[String(pass.id)]);
  const a=await c.query("select id,device_hash from reader_devices where reader_pass_id=$1 and revoked_at is null",[pass.id]);
  if(a.rows.some(x=>x.device_hash===dh)){await c.query("update reader_devices set last_seen_at=now() where reader_pass_id=$1 and device_hash=$2",[pass.id,dh]);await c.query("commit");return dh;}
  if(a.rowCount>=pass.max_devices){await c.query("rollback");return null;}
  const recent=await c.query("select count(distinct device_hash)::int as n from reader_devices where reader_pass_id=$1 and first_seen_at > now()-interval '30 days'",[pass.id]);
  if((recent.rows[0]?.n||0)>=pass.max_devices+1){await c.query("rollback");return null;}
  await c.query("insert into reader_devices(reader_pass_id,device_hash) values($1,$2) on conflict(reader_pass_id,device_hash) do update set revoked_at=null,last_seen_at=now()",[pass.id,dh]);
  await c.query("commit");return dh;
 }catch(e){await c.query("rollback").catch(()=>{});throw e;}finally{c.release();}
}
export async function audit(passId,product,event,req,dh=null){try{await sql("insert into reader_access_events(reader_pass_id,product_slug,event_type,ip_hash,device_hash) values($1,$2,$3,$4,$5)",[passId||null,product||null,event,hashIp(clientIp(req)),dh]);}catch{}}
