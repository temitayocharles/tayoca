(function(){
  'use strict';
  function interactiveTarget(event){return event.target.closest('a,button,input,select,textarea,label');}
  function openTarget(card){
    var explicit=card.getAttribute('data-card-href');
    var link=card.querySelector('a[href]');
    var href=explicit||(link&&link.getAttribute('href'));
    if(!href)return;
    if(link&&link.getAttribute('target')==='_blank'){
      window.open(href,'_blank','noopener,noreferrer');
      return;
    }
    window.location.href=href;
  }
  document.querySelectorAll('.card,.product-card').forEach(function(card){
    if(card.tagName==='A')return;
    if(!card.getAttribute('data-card-href')&&!card.querySelector('a[href]'))return;
    card.classList.add('is-clickable');
    card.setAttribute('role','link');
    card.setAttribute('tabindex','0');
    var heading=card.querySelector('h2,h3,h4');
    if(heading&&!card.getAttribute('aria-label'))card.setAttribute('aria-label',heading.textContent.trim());
    card.addEventListener('click',function(event){if(interactiveTarget(event))return;openTarget(card);});
    card.addEventListener('keydown',function(event){
      if(event.key!=='Enter'&&event.key!==' ')return;
      if(interactiveTarget(event))return;
      event.preventDefault();openTarget(card);
    });
  });
})();
