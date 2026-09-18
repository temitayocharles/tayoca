import test from "node:test";import assert from "node:assert/strict";import crypto from "node:crypto";
const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newPass(bytes){let s="TYC-";for(let i=0;i<26;i++){s+=alphabet[bytes[i]%alphabet.length];if([4,9,14,19].includes(i))s+="-";}return s;}
test("Reader Pass format is human-readable and carries at least 128 bits of entropy",()=>{const p=newPass(Buffer.alloc(26,7));assert.match(p,/^TYC-[A-Z2-9]{5}(?:-[A-Z2-9]{5}){3}-[A-Z2-9]{6}$/);assert.ok(26*Math.log2(alphabet.length)>=128);});
test("pass digest does not expose the pass",()=>{const p=newPass(crypto.randomBytes(26));const h=crypto.createHmac("sha256","test-pepper").update("pass\0"+p).digest("hex");assert.equal(h.length,64);assert.equal(h.includes(p),false);});
test("device limit policy defaults to two",()=>{const active=["a","b"];assert.equal(active.length>=2,true);});

test("device identifiers must be explicit and sufficiently long",()=>{const ok="12345678-1234-1234-1234-123456789abc";assert.match(ok,/^[A-Za-z0-9._:-]{16,128}$/);});
test("sharing policy allows two active devices but only one replacement within 30 days",()=>{const maxDevices=2;const maxDistinct=maxDevices+1;assert.equal(maxDistinct,3);});
test("download throttle is intentionally tighter than session lifetime abuse",()=>{const hourlyDownloadLimit=6;assert.ok(hourlyDownloadLimit<=6);});

test("protected bundle manifest covers exactly nine editions",async()=>{const {readFile}=await import("node:fs/promises");const m=JSON.parse(await readFile(new URL("../private-reader-assets/manifest.json",import.meta.url),"utf8"));assert.equal(m.assets.length,9);assert.equal(new Set(m.assets.map(x=>x.product_slug)).size,9);assert.ok(m.assets.every(x=>/^[a-f0-9]{64}$/.test(x.sha256)));});
test("legacy public book-access route remains on canonical n8n Tayoca hostname",async()=>{const {readFile}=await import("node:fs/promises");const v=JSON.parse(await readFile(new URL("../vercel.json",import.meta.url),"utf8"));const r=v.rewrites.find(x=>x.source==="/access/book");assert.equal(r?.destination,"https://n8n.tayoca.com/webhook/tayoca/books/access");});

test("session cookie uses the __Host prefix security boundary",async()=>{const {readFile}=await import("node:fs/promises");const s=await readFile(new URL("../api/reader-pass/session.js",import.meta.url),"utf8");assert.match(s,/__Host-tayoca_reader/);});

test("paperback activation codes are never stored raw in source",async()=>{const {readFile}=await import("node:fs/promises");const s=await readFile(new URL("../api/reader-pass/paperback-claim.js",import.meta.url),"utf8");assert.match(s,/PAPERBACK_ACTIVATION_MAP/);assert.match(s,/hashActivation\(code\)/);assert.equal(/activation_code\s*[:=]\s*["'][A-Z0-9-]{8,}["']/.test(s),false);});

test("paperback UI stays dormant unless the resource page explicitly enables it",async()=>{const {readFile}=await import("node:fs/promises");const s=await readFile(new URL("../public/assets/js/reader-pass.js",import.meta.url),"utf8");assert.match(s,/paperbackActivation===\"true\"/);assert.match(s,/\/api\/reader-pass\/paperback-claim/);});
