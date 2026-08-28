(function(){
  'use strict';
  var header=document.querySelector('.site-header');
  var toggle=document.querySelector('.menu-toggle');
  var nav=document.querySelector('.primary-nav');
  function closeMenu(){if(!header||!toggle)return;header.classList.remove('nav-open');toggle.setAttribute('aria-expanded','false');}
  if(header&&toggle&&nav){
    toggle.addEventListener('click',function(){var open=header.classList.toggle('nav-open');toggle.setAttribute('aria-expanded',String(open));});
    nav.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('a'))closeMenu();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  }
  document.querySelectorAll('[data-assessment]').forEach(function(card){
    card.addEventListener('click',function(){
      var select=document.querySelector('select[name="assessment"]');
      if(select){select.value=card.getAttribute('data-assessment')||select.value;}
    });
  });
  document.querySelectorAll('[data-current-year]').forEach(function(el){el.textContent=String(new Date().getFullYear());});

  var path=(location.pathname.replace(/\/$/,'')||'/');
  function safeHref(value){
    if(typeof value!=='string'||!value.trim())return '';
    var v=value.trim();
    if(v.charAt(0)==='/'||v.indexOf('https://')===0||v.indexOf('http://')===0||v.indexOf('mailto:')===0)return v;
    return '';
  }
  function validLink(item){return !!item&&typeof item.label==='string'&&item.label.trim().length>0&&!!safeHref(item.href);}
  function externalize(anchor,href){if(/^https?:\/\//.test(href)){anchor.target='_blank';anchor.rel='noopener noreferrer';}}
  function activeFor(href){
    if(href===path||href===path+'/')return true;
    if(href==='/insights.html'&&path.indexOf('/blog/')===0)return true;
    return false;
  }
  function buildLinks(container,items){
    if(!container||!Array.isArray(items))return;
    var valid=items.filter(function(item){return item&&item.visible!==false&&validLink(item);}).slice(0,12);
    if(!valid.length)return;
    while(container.firstChild)container.removeChild(container.firstChild);
    valid.forEach(function(item){
      var a=document.createElement('a');
      var href=safeHref(item.href);
      a.textContent=item.label.trim();a.href=href;
      if(activeFor(href))a.setAttribute('aria-current','page');
      externalize(a,href);container.appendChild(a);
    });
  }
  function buildFooterGroup(title,items){
    var group=document.createElement('div');group.className='footer-links';
    var strong=document.createElement('strong');strong.textContent=title;group.appendChild(strong);
    (Array.isArray(items)?items:[]).filter(validLink).slice(0,12).forEach(function(item){
      var a=document.createElement('a');var href=safeHref(item.href);a.textContent=item.label.trim();a.href=href;externalize(a,href);group.appendChild(a);
    });
    return group;
  }
  function applyFooter(data){
    var footer=document.querySelector('footer');if(!footer||!data)return;
    var brandName=(data.brand&&typeof data.brand.name==='string'&&data.brand.name.trim())||'TAYOCA';
    var box=footer.querySelector('.footer-brand');
    if(box){
      var nested=box.querySelector(':scope > div:first-child');
      if(nested)nested.textContent=brandName;else box.textContent=brandName;
      var copy=nested?box.querySelector('p'):(box.parentElement?box.parentElement.querySelector('p'):null);
      if(copy&&data.footer){
        while(copy.firstChild)copy.removeChild(copy.firstChild);
        if(typeof data.footer.description==='string'&&data.footer.description.trim()){copy.appendChild(document.createTextNode(data.footer.description.trim()));copy.appendChild(document.createElement('br'));}
        if(typeof data.footer.location==='string'&&data.footer.location.trim()){copy.appendChild(document.createTextNode(data.footer.location.trim()));copy.appendChild(document.createElement('br'));}
        var year=document.createElement('span');year.setAttribute('data-current-year','');year.textContent=String(new Date().getFullYear());
        copy.appendChild(document.createTextNode('© '));copy.appendChild(year);copy.appendChild(document.createTextNode(' '+String(data.footer.copyrightName||brandName)+'.'));
      }
    }
    if(data.footer){
      var groups=footer.querySelectorAll('.footer-links');
      var explore=buildFooterGroup('Explore',data.footer.explore);
      var connect=buildFooterGroup('Connect',data.footer.connect);
      if(groups[0])groups[0].replaceWith(explore);else footer.appendChild(explore);
      groups=footer.querySelectorAll('.footer-links');
      if(groups[1])groups[1].replaceWith(connect);else footer.appendChild(connect);
      groups=footer.querySelectorAll('.footer-links');
      for(var i=2;i<groups.length;i++)groups[i].remove();
    }
  }
  function applySiteSettings(data){
    if(!data||data.schemaVersion!==1||!data.brand||!Array.isArray(data.navigation)||!data.footer)return;
    var brandName=typeof data.brand.name==='string'?data.brand.name.trim():'';
    var home=safeHref(data.brand.homeHref||'/')||'/';
    if(brandName){
      document.querySelectorAll('.brand,.nav-brand').forEach(function(a){a.textContent=brandName;a.href=home;});
    }
    buildLinks(document.querySelector('.primary-nav'),data.navigation);
    var cta=document.querySelector('.header-cta');
    if(cta&&data.headerCta){
      var href=safeHref(data.headerCta.href);
      if(data.headerCta.visible===false){cta.hidden=true;}
      else if(typeof data.headerCta.label==='string'&&data.headerCta.label.trim()&&href){cta.hidden=false;cta.textContent=data.headerCta.label.trim();cta.href=href;externalize(cta,href);}
    }
    applyFooter(data);
    window.tayocaSiteSettings=data;
    document.dispatchEvent(new CustomEvent('tayoca:site-settings',{detail:data}));
  }
  fetch('/data/site-settings.json',{headers:{'Accept':'application/json'},cache:'no-store'})
    .then(function(response){if(!response.ok)throw new Error('Site settings unavailable: '+response.status);return response.json();})
    .then(applySiteSettings)
    .catch(function(error){console.warn('[Tayoca Site Settings] Static shell retained.',error);});

  var ecosystemPages=path==='/products.html'||path==='/assessments.html'||path==='/services.html'||path==='/sivanta.html'||path.indexOf('/products/')===0;
  if(!ecosystemPages)return;
  function ensureStage10Styles(){
    if(document.querySelector('link[href="/assets/css/site-shell.css"]'))return;
    var link=document.createElement('link');link.rel='stylesheet';link.href='/assets/css/site-shell.css';link.setAttribute('data-stage10-styles','true');document.head.appendChild(link);
  }
  ensureStage10Styles();

  function el(tag,className,text){
    var node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined&&text!==null)node.textContent=String(text);
    return node;
  }
  function append(parent,children){children.forEach(function(child){if(child)parent.appendChild(child);});return parent;}
  function actionLink(action,productId){
    if(!action||!action.href)return null;
    var a=el('a','stage10-next',action.label||'Continue');
    a.href=action.href;
    a.setAttribute('data-event','product_ecosystem_next_action');
    if(productId)a.setAttribute('data-product-id',productId);
    if(/^https?:\/\//.test(action.href)){a.target='_blank';a.rel='noopener noreferrer';}
    return a;
  }
  function controlGrid(product,includeNextLink){
    var labels={buyer:'Buyer',problem:'Problem',deliverable:'Deliverable',time_to_value:'Time to value',evidence:'Evidence',pricing_method:'Pricing method',boundaries:'Boundaries'};
    var grid=el('dl','stage10-control-grid');
    Object.keys(labels).forEach(function(key){
      var item=el('div','stage10-control');
      append(item,[el('dt','',labels[key]),el('dd','',product[key]||'')]);
      grid.appendChild(item);
    });
    if(includeNextLink){
      var next=el('div','stage10-control');
      append(next,[el('dt','','Next action'),el('dd','',product.next_action&&product.next_action.label?product.next_action.label:'Continue')]);
      grid.appendChild(next);
    }
    return grid;
  }
  function findFamily(data,id){return (data.families||[]).find(function(f){return f.id===id;});}
  function flatten(data){
    var rows=[];
    (data.families||[]).forEach(function(f){(f.products||[]).forEach(function(p){rows.push({family:f,product:p});});});
    return rows;
  }
  function findByPage(data,page){return flatten(data).find(function(row){return row.product.page===page;});}
  function commercialSection(row){
    if(!row||!row.product||document.querySelector('[data-product-control]'))return null;
    var p=row.product,f=row.family;
    var section=el('section','stage10-commercial');
    section.setAttribute('data-product-control',p.id);
    append(section,[el('p','stage10-family-label',f.name),el('h2','',p.name+' in the Tayoca product ecosystem')]);
    var role=el('p','stage10-role');
    role.appendChild(el('strong','','Commercial role: '));
    role.appendChild(document.createTextNode(p.commercial_role));
    section.appendChild(role);
    section.appendChild(controlGrid(p,true));
    section.appendChild(actionLink(p.next_action,p.id));
    return section;
  }
  function renderDetail(data){
    var row=findByPage(data,path);
    if(!row)return;
    var hero=document.querySelector('main .hero');
    var section=commercialSection(row);
    if(hero&&section)hero.insertAdjacentElement('afterend',section);
  }
  function renderSivanta(data){
    var family=findFamily(data,'operator-tools');
    var product=family&&family.products&&family.products[0];
    if(!product)return;
    var hero=document.querySelector('main .hero');
    var section=commercialSection({family:family,product:product});
    if(hero&&section)hero.insertAdjacentElement('afterend',section);
    document.querySelectorAll('li,td').forEach(function(node){
      var text=(node.textContent||'').replace(/\s+/g,' ').trim();
      if(text==='24/7 basic support')node.textContent='Community support';
      if(text==='24/7 support (chat + email)'||text==='24/7 chat + email')node.textContent='Plan-level chat + email support';
      if(text==='SLA-backed SLAs including uptime')node.textContent='Support and SLA terms defined in the signed plan';
    });
  }
  function renderAssessments(data){
    var family=findFamily(data,'executive-assessments');
    if(!family)return;
    var byName={};
    (family.products||[]).forEach(function(p){byName[p.name]=p;});
    document.querySelectorAll('[data-assessment]').forEach(function(card){
      if(card.querySelector('.stage10-assessment-control'))return;
      var p=byName[card.getAttribute('data-assessment')];
      if(!p)return;
      var box=el('div','stage10-assessment-control');
      box.setAttribute('data-product-control',p.id);
      box.appendChild(el('p','stage10-family-label',family.name));
      var role=el('p','stage10-role');
      role.appendChild(el('strong','','Commercial role: '));
      role.appendChild(document.createTextNode(p.commercial_role));
      box.appendChild(role);
      box.appendChild(controlGrid(p,true));
      box.appendChild(el('p','stage10-next-copy','Next action: select this assessment and complete the request form below.'));
      card.appendChild(box);
    });
  }
  function renderManaged(data){
    if(document.querySelector('#managed-operations'))return;
    var family=findFamily(data,'managed-operations');
    if(!family)return;
    var section=el('section','stage10-managed-operations');section.id='managed-operations';
    var inner=el('div','stage10-managed-inner');
    append(inner,[el('p','stage10-family-label',family.name),el('h2','','Operate the improvement, not just the project.'),el('p','stage10-ecosystem-intro',family.summary)]);
    var grid=el('div','stage10-managed-grid');
    (family.products||[]).forEach(function(p){
      var card=el('article','stage10-managed-card');card.setAttribute('data-product-control',p.id);
      append(card,[el('h3','',p.name),el('p','stage10-role',p.commercial_role),controlGrid(p,true),actionLink(p.next_action,p.id)]);
      grid.appendChild(card);
    });
    inner.appendChild(grid);section.appendChild(inner);
    var firstBand=document.querySelector('main .section.band');
    if(firstBand)firstBand.insertAdjacentElement('beforebegin',section);else document.querySelector('main').appendChild(section);
  }
  function renderCatalog(data){
    if(document.querySelector('[data-product-ecosystem]'))return;
    var main=document.querySelector('main');var grid=document.querySelector('#productsContainer');if(!main||!grid)return;
    var h1=main.querySelector('h1');if(h1)h1.textContent='Choose the commercial path that fits the problem';
    var intro=h1&&h1.nextElementSibling;if(intro&&intro.tagName==='P')intro.textContent='Tayoca products form one operating ladder: use a tool, apply a playbook, diagnose with an assessment, or retain an ongoing operating capability.';
    var section=el('section','stage10-ecosystem');section.setAttribute('data-product-ecosystem','true');
    append(section,[el('p','stage10-family-label','Product ecosystem'),el('h2','','Four families. One operating system.'),el('p','stage10-ecosystem-intro','Every offer has a defined buyer, problem, deliverable, time to value, evidence boundary, pricing method, limits and next action.')]);
    var familyGrid=el('div','stage10-family-grid');
    (data.families||[]).forEach(function(f){
      var card=el('article','stage10-family-card');card.id='family-'+f.id;
      append(card,[el('p','stage10-family-label',f.name),el('h3','',f.name),el('p','',f.summary)]);
      var list=el('ul');(f.products||[]).forEach(function(p){list.appendChild(el('li','',p.name));});card.appendChild(list);card.appendChild(actionLink(f.next_action,f.id));familyGrid.appendChild(card);
    });
    section.appendChild(familyGrid);
    grid.insertAdjacentElement('beforebegin',section);
    var heading=el('section','stage10-playbook-heading');heading.id='operator-playbooks';
    append(heading,[el('p','stage10-family-label','Operator Playbooks'),el('h2','','Books, labs, workbooks and implementation resources'),el('p','','Use these when the team can execute the work itself and needs a proven operating structure rather than a consulting engagement.')]);
    grid.insertAdjacentElement('beforebegin',heading);
  }
  function render(data){
    if(!data||data.stage!==10)return;
    if(path.indexOf('/products/')===0)renderDetail(data);
    if(path==='/sivanta.html')renderSivanta(data);
    if(path==='/assessments.html')renderAssessments(data);
    if(path==='/services.html')renderManaged(data);
    if(path==='/products.html')renderCatalog(data);
  }
  fetch('/data/product-ecosystem.json',{headers:{'Accept':'application/json'}})
    .then(function(response){if(!response.ok)throw new Error('Product ecosystem registry unavailable: '+response.status);return response.json();})
    .then(render)
    .catch(function(error){console.error('[Tayoca Stage 10]',error);});
})();
