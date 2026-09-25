(function(){
  'use strict';

  // Stage 12 compatibility adapter. The canonical measurement contract lives in /ga4.js.
  // Keep only legacy interaction coverage that is not already emitted by growth-os.js.
  function emit(name,props){
    try{
      if(window.TayocaAnalytics&&typeof window.TayocaAnalytics.emit==='function')return window.TayocaAnalytics.emit(name,props||{});
      if(typeof window.gtag==='function')window.gtag('event',name,props||{});
    }catch(e){}
  }

  document.addEventListener('click',function(e){
    var wa=e.target.closest&&e.target.closest('a[href*="wa.me/"]');
    if(!wa)return;
    var source='direct';
    try{source=new URLSearchParams(location.search).get('utm_source')||document.referrer||'direct';}catch(err){}
    emit('whatsapp_click',{
      event_key:wa.getAttribute('data-revenue-event')||'whatsapp_click',
      destination:wa.href,
      source_platform:String(source).slice(0,240)
    });
  });
})();