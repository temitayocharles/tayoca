'use strict';
const fs=require('fs'), http=require('http'), path=require('path');
const { chromium }=require('playwright');
const ROOT=path.resolve(__dirname,'..'), PUBLIC=path.join(ROOT,'public');
const ROUTES=['/','/work.html','/about.html','/services.html','/products.html','/results.html','/trust.html','/sivanta.html'];
const MODES=[
 {name:'desktop',viewport:{width:1440,height:1000},isMobile:false,hasTouch:false},
 {name:'mobile',viewport:{width:390,height:844},isMobile:true,hasTouch:true}
];
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.webp':'image/webp'};
function server(){return http.createServer((req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);if(p==='/')p='/index.html';let f=path.resolve(PUBLIC,`.${p}`);if(!f.startsWith(PUBLIC+path.sep)&&f!==PUBLIC)return res.writeHead(403).end('Forbidden');if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)||!fs.statSync(f).isFile())return res.writeHead(404).end('Not found');res.writeHead(200,{'Content-Type':MIME[path.extname(f).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(f).pipe(res);}catch(e){res.writeHead(500).end('Server error')}})}
async function check(browser,base,mode,route){
 const ctx=await browser.newContext({viewport:mode.viewport,isMobile:mode.isMobile,hasTouch:mode.hasTouch});
 const page=await ctx.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(String(e.message||e)));
 try{
   const r=await page.goto(base+route,{waitUntil:'networkidle',timeout:30000}); if(!r||r.status()!==200)throw new Error(`${mode.name} ${route}: HTTP ${r?r.status():0}`);
   const arenaCss=await page.locator('link[href="/assets/css/site-shell.css"]').count();
   const v9Css=await page.locator('link[href="/assets/css/tayoca-v9.css"]').count();
   const v9Js=await page.locator('script[src="/tayoca-v9.js"]').count();
   if(arenaCss!==1)throw new Error(`${mode.name} ${route}: Arena site-shell.css missing`);
   if(v9Css!==0||v9Js!==0)throw new Error(`${mode.name} ${route}: post-Arena v9 override present css=${v9Css} js=${v9Js}`);
   const main=await page.locator('main').count(); if(main!==1)throw new Error(`${mode.name} ${route}: main landmark missing`);
   const header=await page.locator('.site-header').count(); if(header<1)throw new Error(`${mode.name} ${route}: site header missing`);
   if(errors.length)throw new Error(`${mode.name} ${route}: page errors: ${errors.join(' | ')}`);
   return {route,mode:mode.name,arenaCss,v9Css,v9Js};
 } finally {await ctx.close();}
}
(async()=>{const s=server();await new Promise((ok,no)=>{s.once('error',no);s.listen(0,'127.0.0.1',ok)});const base=`http://127.0.0.1:${s.address().port}`;const b=await chromium.launch({headless:true});const results=[];try{for(const m of MODES)for(const r of ROUTES)results.push(await check(b,base,m,r));}finally{await b.close();await new Promise(ok=>s.close(ok));}console.log(JSON.stringify({checks:results.length,passed:results.length,results}));})().catch(e=>{console.error(e.stack||e.message||e);process.exit(1)});
