(function(){
  'use strict';
  if(window.__tayocaV9RuntimeFixes)return;
  window.__tayocaV9RuntimeFixes=true;

  if(!document.querySelector('script[src="/tayoca-v9.js"],script[data-tayoca-v9]')){
    var v9=document.createElement('script');
    v9.src='/tayoca-v9.js';
    v9.defer=true;
    v9.setAttribute('data-tayoca-v9','true');
    document.head.appendChild(v9);
  }

  var style=document.createElement('style');
  style.setAttribute('data-tayoca-v9-runtime-fixes','true');
  style.textContent='\
:root{--annotation:#4f7369}\
html[data-theme="dark"]{--annotation:#8db1a6}\
.section h2{font-family:var(--display);color:var(--ink)}\
.header-map .utility-nav .utility-nav__label{color:var(--muted)}\
.flagship-home .site-header{background:color-mix(in srgb,var(--bg) 96%,transparent);border-bottom-color:var(--line)}\
.flagship-home .header-map{background:var(--surface-2);border-top-color:var(--line)}\
.flagship-home .site-header .header-cta{background:var(--accent);border-color:var(--accent);color:#fff!important;font-family:var(--body)}\
.flagship-home .site-header .header-cta:hover,.flagship-home .site-header .header-cta:focus-visible{background:var(--accent-2);border-color:var(--accent-2)}\
html[data-theme="dark"] .flagship-home .site-header .header-cta{color:#07131a!important}\
.flagship-home .site-footer{background:var(--surface-2);border-top-color:var(--line)}\
.flagship-home .button.secondary,.flagship-home .button.ghost{background:var(--surface);border-color:var(--line-2);color:var(--ink)}\
.flagship-home .button.secondary:hover,.flagship-home .button.ghost:hover{background:var(--surface-2);border-color:var(--accent);color:var(--ink)}\
.flagship-home .publication{border-color:var(--line)}\
.flagship-home .publication h3{color:var(--ink)}\
.flagship-home .publication span{color:var(--accent);font-family:var(--body);letter-spacing:0;text-transform:none}\
.flagship-home .publication:hover{border-color:var(--accent)}\
.flagship-home .brief-form input,.flagship-home .brief-form select{background:var(--surface);color:var(--ink);border-color:var(--line-2)}\
.stage10-ecosystem,.stage10-commercial,.stage10-managed-operations{font-family:var(--body)}\
.stage10-family-card,.stage10-commercial,.stage10-managed-card,.stage10-managed-operations>.stage10-managed-inner{background:var(--surface);border-color:var(--line)}\
.stage10-ecosystem h2,.stage10-commercial h2,.stage10-managed-operations h2,.stage10-family-card h3,.stage10-managed-card h3,.stage10-playbook-heading h2{font-family:var(--display);color:var(--ink)}\
.stage10-family-label,.stage10-family-card h3,.stage10-managed-card h3,.stage10-control dt{color:var(--accent)}\
.stage10-family-label:before{background:var(--accent)}\
.stage10-ecosystem-intro,.stage10-role,.stage10-family-card p,.stage10-managed-card p,.stage10-playbook-heading p{color:var(--muted)}\
.stage10-role strong{color:var(--ink)}\
.stage10-control,.stage10-assessment-control .stage10-control{background:var(--surface-2);border-color:var(--line)}\
.stage10-control dd,.stage10-next-copy{color:var(--ink-2)}\
.stage10-assessment-control{border-top-color:var(--line)}\
.stage10-next{background:var(--accent);color:#fff!important}\
.stage10-next:hover,.stage10-next:focus-visible{background:var(--accent-2)}\
html[data-theme="dark"] .stage10-next{color:#07131a!important}\
';
  document.head.appendChild(style);

  document.querySelectorAll('pre').forEach(function(pre){
    if(!pre.hasAttribute('tabindex'))pre.setAttribute('tabindex','0');
  });
})();
