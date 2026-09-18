import { Redis } from "@upstash/redis";
import crypto from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

const enc = new TextEncoder();
const required = (name) => { const v=process.env[name]; if(!v) throw new Error("missing_"+name); return v; };
const hmac=(label,value)=>crypto.createHmac("sha256",required("READER_PASS_PEPPER")).update(label+"\0"+value).digest("hex");
const redis=()=>Redis.fromEnv();
export const hashPass=(v)=>hmac("pass",v.trim().toUpperCase());
export const hashDevice=(v)=>hmac("device",v);
export const hashIp=(v)=>hmac("ip",v);
export async function rateLimit(key,limit,seconds){
 const r=redis(), k="rp:rl:"+key, n=await r.incr(k); if(n===1) await r.expire(k,seconds); return n<=limit;
}
export async function issueSession(payload){
 return new SignJWT(payload).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30m").sign(enc.encode(required("READER_SESSION_SECRET")));
}
export async function readSession(token){
 return (await jwtVerify(token,enc.encode(required("READER_SESSION_SECRET")))).payload;
}
export function cookie(name,value,maxAge=1800){return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;}
export function json(res,status,body,headers={}){res.statusCode=status;res.setHeader("content-type","application/json");res.setHeader("cache-control","no-store");for(const[k,v]of Object.entries(headers))res.setHeader(k,v);res.end(JSON.stringify(body));}
export async function readJson(req){let s="";for await(const c of req){s+=c;if(s.length>8192)throw new Error("too_large");}return JSON.parse(s||"{}");}
export function clientIp(req){return String(req.headers["x-forwarded-for"]||"").split(",")[0].trim()||"unknown";}
export function deviceId(req){return String(req.headers["x-tayoca-device"]||req.headers["user-agent"]||"unknown").slice(0,512);}
export function dbHeaders(){return {"apikey":required("SUPABASE_SERVICE_ROLE_KEY"),"authorization":"Bearer "+required("SUPABASE_SERVICE_ROLE_KEY"),"content-type":"application/json"};}
export async function db(path,init={}){
 const base=required("SUPABASE_URL")+"/rest/v1/"; const r=await fetch(base+path,{...init,headers:{...dbHeaders(),...(init.headers||{})}}); if(!r.ok)throw new Error("db_"+r.status);const t=await r.text();return t?JSON.parse(t):null;
}
export async function getPass(raw){
 const rows=await db("reader_passes?select=id,status,max_devices&pass_hash=eq."+hashPass(raw));return rows?.[0]||null;
}
export async function entitlement(passId,product,edition){
 const q=`reader_entitlements?select=id,status&reader_pass_id=eq.${encodeURIComponent(passId)}&product_slug=eq.${encodeURIComponent(product)}&edition=eq.${encodeURIComponent(edition)}&status=eq.active`;return (await db(q))?.[0]||null;
}
export async function bindDevice(pass,rawDevice){
 const dh=hashDevice(rawDevice);const active=await db(`reader_devices?select=id,device_hash,revoked_at&reader_pass_id=eq.${pass.id}&revoked_at=is.null`);
 if(active?.some(x=>x.device_hash===dh)){await db(`reader_devices?reader_pass_id=eq.${pass.id}&device_hash=eq.${dh}`,{method:"PATCH",body:JSON.stringify({last_seen_at:new Date().toISOString()})});return dh;}
 if((active?.length||0)>=pass.max_devices) return null;
 await db("reader_devices",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({reader_pass_id:pass.id,device_hash:dh})});return dh;
}
export async function audit(passId,product,event,req,dh=null){
 try{await db("reader_access_events",{method:"POST",headers:{Prefer:"return=minimal"},body:JSON.stringify({reader_pass_id:passId||null,product_slug:product||null,event_type:event,ip_hash:hashIp(clientIp(req)),device_hash:dh})});}catch{}
}
