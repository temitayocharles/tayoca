'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const COLLECTOR = 'https://v7mhrspk.function2.insforge.app/analytics-event';
const MIME = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.webp':'image/webp' };

function staticServer() {
  return http.createServer((req,res) => {
    try {
      const u = new URL(req.url, 'http://127.0.0.1');
      let pathname = decodeURIComponent(u.pathname);
      if (pathname === '/') pathname = '/index.html';
      let file = path.resolve(PUBLIC, `.${pathname}`);
      if (!file.startsWith(PUBLIC + path.sep) && file !== PUBLIC) return res.writeHead(403).end('Forbidden');
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end('Not found');
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-store' });
      fs.createReadStream(file).pipe(res);
    } catch (e) { res.writeHead(500).end('Server error'); }
  });
}

async function interceptCollector(page) {
  const payloads = [];
  await page.route(COLLECTOR, async route => {
    const req = route.request();
    if (req.method() === 'OPTIONS') {
      await route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin':'*', 'Access-Control-Allow-Headers':'content-type', 'Access-Control-Allow-Methods':'POST, OPTIONS' } });
      return;
    }
    try {
      const body = JSON.parse(req.postData() || 'null');
      if (body) payloads.push(body);
    } catch (_) {}
    await route.fulfill({ status: 200, contentType:'application/json', headers:{ 'Access-Control-Allow-Origin':'*' }, body:'{}' });
  });
  return payloads;
}

function events(payloads, name) { return payloads.filter(x => x && x.name === name); }
async function goto200(page, url, label) {
  const r = await page.goto(url, { waitUntil:'networkidle', timeout:30000 });
  if (!r || r.status() !== 200) throw new Error(`${label}: HTTP ${r ? r.status() : 0}`);
}

async function assessment(browser, base) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:1000}, colorScheme:'light' });
  const page = await ctx.newPage();
  const payloads = await interceptCollector(page);
  try {
    const url = `${base}/assessments.html?assessment=${encodeURIComponent('Cloud & AI Cost Assessment')}&utm_source=tayoca_site&utm_medium=internal&utm_campaign=pgc1_cloud_ai_cost&utm_content=phase2_event_gate&tayoca_test=stage12#assessment-form`;
    await goto200(page, url, 'assessment');
    const form = page.locator('form[data-tayoca-form="assessment_request"]');
    if (await form.locator('select[name="assessment"]').inputValue() !== 'Cloud & AI Cost Assessment') throw new Error('assessment: preselection failed');
    await form.locator('input[name="email"]').fill('phase2-event-stage12@example.com');
    await form.locator('input[name="company"]').fill('Stage 12 Event Gate');
    await form.locator('select[name="role"]').selectOption({ label:'Engineering / platform leader' });
    await form.locator('select[name="segment"]').selectOption({ label:'Growth-stage technology company' });
    await form.locator('select[name="urgency"]').selectOption({ label:'Within 30 days' });
    await form.locator('select[name="evidence_readiness"]').selectOption({ label:'Some evidence is available' });
    await form.locator('textarea[name="context"]').fill('Stage 12 event-contract regression only; no production lead should be created.');
    await form.locator('button[type="submit"]').click();
    await form.locator('.form-success').waitFor({ state:'visible', timeout:5000 });
    await page.waitForTimeout(150);

    const lead = events(payloads, 'generate_lead');
    if (lead.length !== 1) throw new Error(`assessment: generate_lead count ${lead.length}`);
    const p = lead[0].props || {};
    if (p.form_name !== 'assessment_request' || p.assessment !== 'Cloud & AI Cost Assessment') throw new Error('assessment: lead properties incomplete');
    if (p.last_touch_source !== 'tayoca_site' || p.last_touch_medium !== 'internal' || p.last_touch_campaign !== 'pgc1_cloud_ai_cost') throw new Error('assessment: attribution incomplete');
    if (p.test_traffic !== 'stage12') throw new Error('assessment: test marker missing');

    const next = form.locator('.form-next-action a');
    await next.waitFor({ state:'visible', timeout:5000 });
    await next.evaluate(node => node.addEventListener('click', e => e.preventDefault(), { once:true }));
    await next.click();
    await page.waitForTimeout(150);
    const schedule = events(payloads, 'assessment_schedule_click');
    if (schedule.length !== 1 || (schedule[0].props || {}).test_traffic !== 'stage12') throw new Error('assessment: schedule event contract failed');
    return { generate_lead:1, assessment_schedule_click:1 };
  } finally { await ctx.close(); }
}

async function operatorBrief(browser, base) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:1000}, colorScheme:'light' });
  const page = await ctx.newPage();
  const payloads = await interceptCollector(page);
  try {
    await goto200(page, `${base}/operator-brief.html?tayoca_test=stage12&utm_source=operator_brief&utm_medium=email&utm_campaign=phase2_event_gate&utm_content=signup`, 'operator brief');
    const form = page.locator('form[data-tayoca-form="operator_brief"]');
    await form.locator('input[name="email"]').fill('phase2-brief-event-stage12@example.com');
    await form.locator('select[name="interest"]').selectOption({ label:'Technology value and FinOps' });
    await form.locator('input[name="consent"]').check();
    await form.locator('button[type="submit"]').click();
    await form.locator('.form-success').waitFor({ state:'visible', timeout:5000 });
    await page.waitForTimeout(150);
    const lead = events(payloads, 'generate_lead');
    const signup = events(payloads, 'operator_brief_signup');
    if (lead.length !== 1 || signup.length !== 1) throw new Error(`operator brief: lead/signup counts ${lead.length}/${signup.length}`);
    const p = signup[0].props || {};
    if (p.interest !== 'Technology value and FinOps') throw new Error('operator brief: interest missing');
    if (p.newsletter_source !== 'operator_brief' || p.newsletter_issue !== 'phase2_event_gate') throw new Error('operator brief: newsletter attribution missing');
    if (p.test_traffic !== 'stage12') throw new Error('operator brief: test marker missing');
    return { generate_lead:1, operator_brief_signup:1 };
  } finally { await ctx.close(); }
}

async function product(browser, base) {
  const ctx = await browser.newContext({ viewport:{width:1440,height:1000}, colorScheme:'light' });
  const page = await ctx.newPage();
  const payloads = await interceptCollector(page);
  try {
    await goto200(page, `${base}/products/aws-cost-optimization-playbook.html?tayoca_test=stage12`, 'product');
    const cta = page.locator('a[data-event="product_purchase_click"]').first();
    await cta.evaluate(node => { node.removeAttribute('target'); node.addEventListener('click', e => e.preventDefault(), { once:true }); });
    await cta.click();
    await page.waitForTimeout(150);
    const explicit = events(payloads, 'product_purchase_click');
    const conversion = events(payloads, 'product_click');
    const gumroad = events(payloads, 'gumroad_click');
    if (explicit.length !== 1 || conversion.length !== 1 || gumroad.length !== 1) throw new Error(`product: event counts ${explicit.length}/${conversion.length}/${gumroad.length}`);
    if ((conversion[0].props || {}).test_traffic !== 'stage12') throw new Error('product: test marker missing');
    return { product_purchase_click:1, product_click:1, gumroad_click:1 };
  } finally { await ctx.close(); }
}

async function main() {
  const server = staticServer();
  await new Promise((resolve,reject) => { server.once('error', reject); server.listen(0,'127.0.0.1',resolve); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless:true });
  try {
    const results = [
      { journey:'assessment-events', ...(await assessment(browser, base)) },
      { journey:'operator-brief-events', ...(await operatorBrief(browser, base)) },
      { journey:'product-events', ...(await product(browser, base)) },
    ];
    console.log(JSON.stringify({ checks:results.length, passed:results.length, results }));
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

main().catch(err => { console.error(err.stack || err.message || err); process.exit(1); });
