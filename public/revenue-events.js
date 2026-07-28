(function(){
  'use strict';
  var cfg=window.TAYOCA_REVENUE_CONFIG||{};
  var webhook=typeof cfg.webhookUrl==='string'&&/^https:\/\//i.test(cfg.webhookUrl)?cfg.webhookUrl:'';
  var sessionKey='tayoca_revenue_session';
  var intentKey='tayoca_lead_intent';
  function id(){return 'tyc_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
  function getSession(){try{var s=localStorage.getItem(sessionKey);if(!s){s=id();localStorage.setItem(sessionKey,s);}return s;}catch(e){return id();}}
  function utm(){var p=new URLSearchParams(location.search),o={};['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k){if(p.get(k))o[k]=p.get(k);});return o;}
  function emit(name,props){var event={event:name,session_id:getSession(),path:location.pathname,referrer:document.referrer||'',utm:utm(),timestamp:new Date().toISOString(),properties:props||{}};window.dataLayer=window.dataLayer||[];window.dataLayer.push(event);try{localStorage.setItem('tayoca_last_event',JSON.stringify(event));}catch(e){}if(webhook){fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event),keepalive:true}).catch(function(){});}return event;}
  document.addEventListener('click',function(e){var el=e.target.closest&&e.target.closest('[data-event]');if(!el)return;emit(el.getAttribute('data-event')||'cta_click',{label:(el.textContent||'').trim().slice(0,120),href:el.getAttribute('href')||''});});
  document.addEventListener('DOMContentLoaded',function(){emit('page_view',{});var form=document.getElementById('lead-intent-form');if(!form)return;form.addEventListener('submit',function(e){e.preventDefault();var email=(form.elements.email&&form.elements.email.value||'').trim();var problem=(form.elements.problem&&form.elements.problem.value||'').trim();var status=document.getElementById('lead-form-status');if(!email||!problem){if(status)status.textContent='Enter your email and choose the problem you want to solve.';return;}var intent={email:email,problem:problem,updated_at:new Date().toISOString()};try{localStorage.setItem(intentKey,JSON.stringify(intent));}catch(err){}emit('lead_intent_submitted',intent);if(status)status.textContent=webhook?'Your request has been recorded. Tayoca will use it to route you to the right starting point.':'Your interest is saved in this browser. Direct delivery is being connected, so please use the consultation or email option for immediate contact.';});});
})();

// Normalize WhatsApp conversion events for CRM and n8n routing.
document.addEventListener('click', function (event) {
  var link = event.target.closest('a[href*="wa.me/"]');
  if (!link) return;
  emitRevenueEvent('whatsapp_click', {
    event_key: link.getAttribute('data-revenue-event') || 'whatsapp_click',
    destination: link.href,
    source_platform: new URLSearchParams(window.location.search).get('utm_source') || document.referrer || 'direct'
  });
});
