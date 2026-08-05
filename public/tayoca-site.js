(function(){
  'use strict';
  var header=document.querySelector('.site-header');
  var toggle=document.querySelector('.menu-toggle');
  var nav=document.querySelector('.primary-nav');
  function closeMenu(){if(!header||!toggle)return;header.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');}
  if(header&&toggle&&nav){
    toggle.addEventListener('click',function(){var open=header.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',String(open));});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  }
  document.querySelectorAll('[data-assessment]').forEach(function(card){
    card.addEventListener('click',function(){
      var select=document.querySelector('select[name="assessment"]');
      if(select){select.value=card.getAttribute('data-assessment')||select.value;}
    });
  });
  document.querySelectorAll('[data-current-year]').forEach(function(el){el.textContent=String(new Date().getFullYear());});
})();
