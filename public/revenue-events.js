(function(){
  'use strict';
  var cfg=window.TAYOCA_REVENUE_CONFIG||{};
  var webhook=typeof cfg.webhookUrl==='string'&&/^https:\/\//i.test(cfg.webhookUrl)?cfg.webhookUrl:'';
  var sessionKey='tayoca_revenue_session';
  function id(){return 'tyc_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);}
  function getSession(){try{var s=localStorage.getItem(sessionKey);if(!s){s=id();localStorage.setItem(sessionKey,s);}return s;}catch(e){return id();}}
  function utm(){var p=new URLSearchParams(location.search),o={};['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k){if(p.get(k))o[k]=p.get(k);});return o;}
  function emit(name,props){var event={event:name,session_id:getSession(),path:location.pathname,referrer:document.referrer||'',utm:utm(),timestamp:new Date().toISOString(),properties:props||{}};window.dataLayer=window.dataLayer||[];window.dataLayer.push(event);try{localStorage.setItem('tayoca_last_event',JSON.stringify(event));}catch(e){}if(webhook){fetch(webhook,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(event),keepalive:true}).catch(function(){});}return event;}
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('[data-event]');
    if(el)emit(el.getAttribute('data-event')||'cta_click',{label:(el.textContent||'').trim().slice(0,120),href:el.getAttribute('href')||''});
    var wa=e.target.closest&&e.target.closest('a[href*="wa.me/"]');
    if(wa)emit('whatsapp_click',{event_key:wa.getAttribute('data-revenue-event')||'whatsapp_click',destination:wa.href,source_platform:new URLSearchParams(location.search).get('utm_source')||document.referrer||'direct'});
  });
  document.addEventListener('DOMContentLoaded',function(){emit('page_view',{});});
})();