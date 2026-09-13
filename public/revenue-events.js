(function(){
  'use strict';

  // Product-detail pages load this shared adapter, so keep the v9 visual/theme
  // controller available here as a bounded compatibility bridge.
  function ensureV9Assets(){
    if(!document.querySelector('link[href="/assets/css/tayoca-v9.css"],link[data-tayoca-v9-style]')){
      var css=document.createElement('link');
      css.rel='stylesheet';
      css.href='/assets/css/tayoca-v9.css';
      css.setAttribute('data-tayoca-v9-style','true');
      document.head.appendChild(css);
    }
    if(!document.querySelector('script[src="/tayoca-v9.js"],script[data-tayoca-v9]')){
      var js=document.createElement('script');
      js.src='/tayoca-v9.js';
      js.defer=true;
      js.setAttribute('data-tayoca-v9','true');
      document.head.appendChild(js);
    }
  }
  ensureV9Assets();

  // Stage 12 compatibility adapter. The canonical measurement contract lives in /ga4.js.
  // Keep only interaction coverage that is not already emitted by growth-os.js.
  function emit(name,props){
    try{
      if(window.TayocaAnalytics&&typeof window.TayocaAnalytics.emit==='function')return window.TayocaAnalytics.emit(name,props||{});
      if(typeof window.gtag==='function')window.gtag('event',name,props||{});
    }catch(e){}
  }

  document.addEventListener('click',function(e){
    var link=e.target.closest&&e.target.closest('a[href]');
    if(!link)return;

    // Product-detail pages do not load growth-os.js, so emit the explicit CTA event
    // and the canonical product conversion event here. ga4.js independently emits
    // gumroad_click for the same outbound destination.
    if(link.getAttribute('data-event')==='product_purchase_click'){
      var props={
        link_url:link.href,
        link_text:(link.textContent||'').trim().slice(0,120),
        product:link.getAttribute('data-product')||''
      };
      emit('product_purchase_click',props);
      emit('product_click',props);
    }

    var wa=link.matches('a[href*="wa.me/"]')?link:null;
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
