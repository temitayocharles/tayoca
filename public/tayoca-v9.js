(function(){
  'use strict';

  if(!document.querySelector('script[data-v9-runtime-fixes],script[src="/v9-runtime-fixes.js"]')){
    var fixes=document.createElement('script');
    fixes.src='/v9-runtime-fixes.js';
    fixes.defer=true;
    fixes.setAttribute('data-v9-runtime-fixes','true');
    document.head.appendChild(fixes);
  }

  var root=document.documentElement;
  var storageKey='tayoca-theme';

  function preferredTheme(){
    try{
      var saved=localStorage.getItem(storageKey);
      if(saved==='light'||saved==='dark')return saved;
      if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)return 'dark';
    }catch(e){}
    return 'light';
  }

  function icon(theme){
    return theme==='dark'
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>';
  }

  function syncButtons(){
    var dark=root.dataset.theme==='dark';
    document.querySelectorAll('.theme-switch').forEach(function(button){
      button.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
      button.setAttribute('title',dark?'Use light theme':'Use dark theme');
      button.innerHTML=icon(dark?'dark':'light');
    });
  }

  function setTheme(theme,persist){
    var next=theme==='dark'?'dark':'light';
    root.dataset.theme=next;
    if(persist){try{localStorage.setItem(storageKey,next);}catch(e){}}
    syncButtons();
  }

  function ensureThemeSwitch(){
    var header=document.querySelector('.site-header .header-inner');
    if(!header||header.querySelector('.theme-switch'))return;
    var button=document.createElement('button');
    button.className='theme-switch';
    button.type='button';
    var cta=header.querySelector('.header-cta');
    if(cta)header.insertBefore(button,cta);else header.appendChild(button);
  }

  ensureThemeSwitch();
  setTheme(root.dataset.theme||preferredTheme(),false);

  document.addEventListener('click',function(event){
    var button=event.target.closest&&event.target.closest('.theme-switch');
    if(!button)return;
    setTheme(root.dataset.theme==='dark'?'light':'dark',true);
  });

  try{
    var media=window.matchMedia('(prefers-color-scheme: dark)');
    var onChange=function(event){
      var saved=null;
      try{saved=localStorage.getItem(storageKey);}catch(e){}
      if(saved!=='light'&&saved!=='dark')setTheme(event.matches?'dark':'light',false);
    };
    if(media.addEventListener)media.addEventListener('change',onChange);
  }catch(e){}

  var path=location.pathname.replace(/\/$/,'')||'/';
  if(path==='/operator-brief.html'||path==='/operator-brief-archive.html'||path.indexOf('/blog/')===0){
    document.body.classList.add('operator-editorial');
  }
})();
