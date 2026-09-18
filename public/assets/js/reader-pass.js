(()=> {
  const form=document.querySelector("[data-reader-pass-form]");
  if(!form)return;
  const product=form.dataset.product, edition=form.dataset.edition;
  const msg=form.querySelector("[data-reader-pass-message]");
  const gumroadProducts=new Set([
    "ai-automation-career-playbook",
    "n8n-mcp-kubernetes-teaching-pack",
    "build-break-fix",
    "cloud-cost-kubernetes-finops",
    "devops-incident-runbook",
    "kubernetes-production-readiness",
    "gitops-field-guide"
  ]);
  function getDevice(){
    const k="tayoca_reader_device";
    let v=localStorage.getItem(k);
    if(!v){v=(crypto.randomUUID?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,"0")).join(""));localStorage.setItem(k,v);}
    return v;
  }
  async function entitlement(){
    const r=await fetch("/api/reader-pass/entitlements",{credentials:"same-origin",cache:"no-store",headers:{"x-tayoca-device":getDevice()}});
    return r.ok;
  }
  function filenameFrom(r){
    const h=r.headers.get("content-disposition")||"";
    const m=h.match(/filename="?([^";]+)"?/i);return m?m[1]:"tayoca-companion-resources.zip";
  }
  function addDownload(){
    if(document.querySelector("[data-reader-download]"))return;
    const b=document.createElement("button");b.type="button";b.dataset.readerDownload="";b.textContent="Download companion bundle";
    b.addEventListener("click",async()=>{
      b.disabled=true;const old=b.textContent;b.textContent="Preparing secure download…";
      try{
        const r=await fetch("/api/reader-pass/download",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json","x-tayoca-device":getDevice()},body:JSON.stringify({product,edition})});
        if(!r.ok){let e={};try{e=await r.json();}catch{};throw new Error(e.error||"download_failed");}
        const blob=await r.blob(),u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=filenameFrom(r);document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
        msg.textContent="Download issued. Your Reader Pass remains limited to your own devices.";
      }catch(e){msg.textContent=e.message==="resource_not_staged"?"This edition's companion bundle is being synchronized.":"The secure download could not be issued. Try again shortly.";}
      finally{b.disabled=false;b.textContent=old;}
    });
    form.appendChild(b);
  }
  async function addDevices(){
    if(document.querySelector("[data-reader-devices]"))return;
    const wrap=document.createElement("details");wrap.dataset.readerDevices="";wrap.style.marginTop="1rem";
    wrap.innerHTML="<summary><strong>Manage my Reader Pass devices</strong></summary><div data-device-list class='resource-note' style='margin-top:.75rem'>Loading devices…</div>";
    form.appendChild(wrap);
    try{
      const r=await fetch("/api/reader-pass/devices",{credentials:"same-origin",cache:"no-store",headers:{"x-tayoca-device":getDevice()}});if(!r.ok)throw new Error();
      const d=await r.json(),list=wrap.querySelector("[data-device-list]");list.innerHTML="";
      for(const x of d.devices){
        const row=document.createElement("div");row.style.cssText="display:flex;gap:.7rem;align-items:center;justify-content:space-between;padding:.55rem 0;border-bottom:1px solid var(--line)";
        const t=document.createElement("span");t.textContent=(x.current?"This device · ":"")+x.label+(x.revoked?" · revoked":"");
        row.appendChild(t);
        if(!x.revoked){
          const b=document.createElement("button");b.type="button";b.textContent="Revoke";b.addEventListener("click",async()=>{b.disabled=true;const rr=await fetch("/api/reader-pass/devices",{method:"POST",credentials:"same-origin",headers:{"content-type":"application/json","x-tayoca-device":getDevice()},body:JSON.stringify({id:x.id})});if(rr.ok){const out=await rr.json();row.remove();if(out.current){msg.textContent="This device was revoked. Enter the Reader Pass again on an allowed device.";}}else b.disabled=false;});row.appendChild(b);
        }
        list.appendChild(row);
      }
    }catch{wrap.querySelector("[data-device-list]").textContent="Device management is temporarily unavailable.";}
  }
  function unlocked(){msg.textContent="Reader Pass verified for this edition.";addDownload();addDevices();}
  async function openSession(pass){
    const r=await fetch("/api/reader-pass/session",{method:"POST",headers:{"content-type":"application/json","x-tayoca-device":getDevice()},credentials:"same-origin",body:JSON.stringify({pass,product,edition})});
    if(!r.ok){const e=await r.json().catch(()=>({}));return {ok:false,status:r.status,error:e.error};}
    unlocked();return {ok:true};
  }
  form.addEventListener("submit",async e=>{
    e.preventDefault();msg.textContent="Checking your Reader Pass…";
    const pass=new FormData(form).get("reader_pass");
    try{
      const r=await openSession(pass);
      if(r.ok)return;
      msg.textContent=r.status===429?"Too many attempts. Try again later.":r.error==="device_limit"?"This Reader Pass has reached its active-device or recent replacement limit. Revoke an old device if appropriate, or try again after the replacement window.":"That pass cannot unlock this edition.";
    }catch{msg.textContent="Reader Pass verification is temporarily unavailable.";}
  });
  if(gumroadProducts.has(product)){
    const box=document.createElement("details");box.style.marginTop="1.25rem";
    box.innerHTML='<summary><strong>Bought this edition on Gumroad?</strong> Claim or add it to your Reader Pass</summary><form data-reader-claim autocomplete="off" style="margin-top:1rem"><label>Gumroad license key</label><div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.55rem"><input name="license_key" required autocomplete="off" spellcheck="false" placeholder="Paste your Gumroad license key" style="min-width:18rem;padding:.8rem;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--ink)"></div><label style="display:block;margin-top:.8rem">Existing Reader Pass <span class="resource-note">(optional)</span></label><div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.55rem"><input name="reader_pass" type="password" autocomplete="off" spellcheck="false" placeholder="Use one pass across your Tayoca books" style="min-width:18rem;padding:.8rem;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--ink)"><button type="submit">Verify purchase</button></div><p data-reader-claim-message class="resource-note" aria-live="polite">A verified purchase can create a Reader Pass or add this edition to your existing pass. Access is for your own devices only.</p></form>';
    form.parentElement.appendChild(box);
    const cf=box.querySelector("[data-reader-claim]"),cm=box.querySelector("[data-reader-claim-message]");
    cf.addEventListener("submit",async e=>{
      e.preventDefault();cm.textContent="Verifying purchase…";const fd=new FormData(cf),license_key=fd.get("license_key"),reader_pass=String(fd.get("reader_pass")||"").trim();
      try{
        const r=await fetch("/api/reader-pass/claim",{method:"POST",headers:{"content-type":"application/json"},credentials:"same-origin",body:JSON.stringify({source:"gumroad",license_key,product,...(reader_pass?{reader_pass}:{})})});
        const d=await r.json().catch(()=>({}));
        if(!r.ok){cm.textContent=d.error==="purchase_already_claimed"?"That purchase has already claimed a Reader Pass. Use the pass you received when it was claimed.":"The Gumroad purchase could not be verified for this edition.";return;}
        if(d.attached){cm.textContent="This edition is now attached to your existing Reader Pass.";await openSession(reader_pass);}else{cm.innerHTML='Reader Pass created: <strong style="user-select:all">'+d.reader_pass+'</strong><br>Save it in your password manager. It will not be shown again.';await openSession(d.reader_pass);}
      }catch{cm.textContent="Purchase verification is temporarily unavailable.";}
    });
  }
  entitlement().then(ok=>{if(ok)unlocked();}).catch(()=>{});
})();