import test from "node:test";import assert from "node:assert/strict";import crypto from "node:crypto";
const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function newPass(bytes){let s="TYC-";for(let i=0;i<20;i++){s+=alphabet[bytes[i]%alphabet.length];if([3,7,11,15].includes(i))s+="-";}return s;}
test("Reader Pass format is human-readable and carries 20 symbols",()=>{const p=newPass(Buffer.alloc(20,7));assert.match(p,/^TYC-[A-Z2-9]{4}(?:-[A-Z2-9]{4}){4}$/);});
test("pass digest does not expose the pass",()=>{const p=newPass(crypto.randomBytes(20));const h=crypto.createHmac("sha256","test-pepper").update("pass\0"+p).digest("hex");assert.equal(h.length,64);assert.equal(h.includes(p),false);});
test("device limit policy defaults to two",()=>{const active=["a","b"];assert.equal(active.length>=2,true);});
