(function(){
  if(!document.querySelector('script[data-v9-runtime-fixes]')){
    var fixes=document.createElement('script');
    fixes.src='/v9-runtime-fixes.js';
    fixes.defer=true;
    fixes.setAttribute('data-v9-runtime-fixes','true');
    document.head.appendChild(fixes);
  }

  function track(name,props){
    try{
      if(window.TayocaAnalytics&&typeof window.TayocaAnalytics.emit==='function')return window.TayocaAnalytics.emit(name,props||{});
      if(typeof window.gtag==='function')window.gtag('event',name,props||{});
    }catch(e){}
  }

  document.querySelectorAll('#current-year').forEach(function(el){el.textContent=new Date().getFullYear()});
  var header=document.querySelector('header');
  if(header){var links=header.classList.contains('site-header')?header.querySelector('nav'):header.querySelector('.nav-links');if(links&&!header.querySelector('.nav-toggle,.menu-toggle')){var toggle=document.createElement('button');toggle.type='button';toggle.className='nav-toggle';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');toggle.textContent='Menu';links.parentNode.insertBefore(toggle,links);toggle.addEventListener('click',function(){var open=header.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close':'Menu'});}}
  var path=(location.pathname.replace(/\/$/,'')||'/');document.querySelectorAll('header a[href]').forEach(function(a){var href=a.getAttribute('href');if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('mailto:'))return;var ap=(new URL(href,location.origin)).pathname.replace(/\/$/,'')||'/';if(ap===path)a.classList.add('active')});
  document.querySelectorAll('.card,.product-card').forEach(function(card){var link=card.querySelector('a[href]');if(!link)return;card.classList.add('is-clickable');card.tabIndex=0;card.setAttribute('role','link');card.setAttribute('aria-label',link.textContent.trim()||'Open');function go(){if(link.target==='_blank')window.open(link.href,'_blank','noopener');else location.href=link.href}card.addEventListener('click',function(e){if(e.target.closest('a,button,input,select,textarea,label'))return;if(window.getSelection&&String(window.getSelection()))return;go()});card.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&!e.target.closest('a,button,input,select,textarea')){e.preventDefault();go()}})});

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    var href=a.getAttribute('href')||'';
    var named=a.getAttribute('data-event');
    if(named)track(named,{link_url:href,link_text:(a.textContent||'').trim().slice(0,120)});
    if(href.includes('gumroad.com'))track('product_click',{link_url:href,link_text:(a.textContent||'').trim().slice(0,120)});
    if(href.includes('assessments'))track('assessment_cta_click',{link_url:href});
    if(href.startsWith('mailto:'))track('contact_click',{method:'email'});
  });

  var q=new URLSearchParams(location.search),wanted=q.get('assessment'),segment=q.get('segment');
  var stage12Test=q.get('tayoca_test')==='stage12';
  if(wanted){document.querySelectorAll('select[name="assessment"]').forEach(function(sel){Array.from(sel.options).some(function(o){if(o.value===wanted||o.textContent.toLowerCase().includes(wanted.toLowerCase())){sel.value=o.value;return true}return false})})}
  if(segment){document.querySelectorAll('select[name="segment"]').forEach(function(sel){Array.from(sel.options).some(function(o){if(o.value===segment){sel.value=o.value;return true}return false})})}

  function assessmentSchedulingUrl(assessment){
    if(assessment==='Cloud & AI Cost Assessment')return 'https://cal.com/tayoca/finops-audit';
    if(assessment==='Platform Reliability Assessment'||assessment==='Technology Value Assessment')return 'https://cal.com/tayoca/platform-engineering-consultation';
    return '';
  }

  function governAssessmentResponse(data,payload){
    var status=String(data&&data.status||'').toLowerCase();
    if(status==='qualified'){
      data.next='Your request is qualified. Choose a consultation time to continue.';
      data.schedulingUrl=assessmentSchedulingUrl(payload.assessment);
    }else if(status==='review'){
      data.next='Your request has been recorded for fit and evidence review. We will follow up with the appropriate next step.';
      if(data.schedulingUrl)delete data.schedulingUrl;
    }
    return data;
  }

  function stage12Response(formName,payload){
    if(formName==='assessment_request'){
      return {status:'test',next:'Stage 12 test traffic accepted locally. No lead was created.',schedulingUrl:assessmentSchedulingUrl(payload.assessment)};
    }
    if(formName==='operator_brief')return {status:'test',next:'Stage 12 test traffic accepted locally. No subscription was created.'};
    if(formName==='operator_brief_unsubscribe')return {status:'test',next:'Stage 12 test traffic accepted locally. No subscription record was changed.'};
    return {status:'test',next:'Stage 12 test traffic accepted locally.'};
  }

  document.querySelectorAll('form[data-tayoca-form]').forEach(function(f){f.addEventListener('submit',async function(e){
    e.preventDefault();f.querySelectorAll('.form-success,.form-error,.form-next-action').forEach(function(x){x.remove()});
    var b=f.querySelector('button[type=submit]');var old=b?b.textContent:'';if(b){b.disabled=true;b.textContent='Sending…'}
    try{
      var payload=Object.fromEntries(new FormData(f).entries());payload.source_page=location.pathname;
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){var v=q.get(k);if(v)payload[k]=String(v).slice(0,240)});payload.referrer=String(document.referrer||'').slice(0,1000);
      var formName=f.dataset.tayocaForm||'unknown';
      var data;
      if(stage12Test){
        data=stage12Response(formName,payload);
      }else{
        var r=await fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
        data=await r.json().catch(function(){return{}});
        if(!r.ok)throw new Error(data.error||data.message||'Request failed');
        if(formName==='assessment_request')data=governAssessmentResponse(data,payload);
      }

      if(formName==='assessment_request')track('generate_lead',{form_name:formName,lead_status:data.status||'accepted',assessment:payload.assessment||'',segment:payload.segment||''});
      if(formName==='operator_brief'){
        track('generate_lead',{form_name:formName,lead_status:data.status||'accepted'});
        track('operator_brief_signup',{interest:payload.interest||'',source_page:payload.source_page});
      }
      if(formName==='operator_brief_unsubscribe')track('operator_brief_unsubscribe',{source_page:payload.source_page});

      f.reset();
      var p=document.createElement('p');p.className='form-success';p.setAttribute('role','status');p.textContent=data.next||'Thank you. Your request has been recorded.';f.appendChild(p);
      if(data.schedulingUrl){
        var wrap=document.createElement('div');wrap.className='form-next-action actions';
        var a=document.createElement('a');a.className='button';a.href=data.schedulingUrl;a.target='_blank';a.rel='noopener';a.textContent='Choose a consultation time';a.setAttribute('data-event','assessment_schedule_click');
        wrap.appendChild(a);f.appendChild(wrap);
      }
    }catch(err){
      var p=document.createElement('p');p.className='form-error';p.setAttribute('role','alert');p.textContent='We could not record this request. Email support@tayoca.com.';f.appendChild(p)
    }finally{if(b){b.disabled=false;b.textContent=old}}
  })});
})();