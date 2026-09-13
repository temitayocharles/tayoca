'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const COLLECTOR = 'https://v7mhrspk.function2.insforge.app/analytics-event';
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp',
};

function server() {
  return http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url, 'http://127.0.0.1');
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname === '/') pathname = '/index.html';
      let file = path.resolve(PUBLIC, `.${pathname}`);
      if (!file.startsWith(PUBLIC + path.sep) && file !== PUBLIC) return res.writeHead(403).end('Forbidden');
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return res.writeHead(404).end('Not found');
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(file).pipe(res);
    } catch (error) {
      res.writeHead(500).end('Server error');
    }
  });
}

async function goto200(page, url, label) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response || response.status() !== 200) throw new Error(`${label}: HTTP ${response ? response.status() : 0}`);
}

async function captureCollector(page) {
  const payloads = [];
  await page.route(COLLECTOR, async route => {
    let body = null;
    try { body = JSON.parse(route.request().postData() || 'null'); } catch (error) {}
    if (body) payloads.push(body);
    await route.fulfill({ status: 204, body: '' });
  });
  return payloads;
}

function byName(payloads, name) {
  return payloads.filter(item => item && item.name === name);
}

async function checkAssessment(browser, base) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage();
  const payloads = await captureCollector(page);
  try {
    const url = `${base}/assessments.html?assessment=${encodeURIComponent('Cloud & AI Cost Assessment')}&utm_source=tayoca_site&utm_medium=internal&utm_campaign=pgc1_cloud_ai_cost&utm_content=phase2_event_gate&tayoca_test=stage12#assessment-form`;
    await goto200(page, url, 'assessment event contract');
    const form = page.locator('form[data-tayoca-form="assessment_request"]');
    await form.locator('input[name="email"]').fill('phase2-event-stage12@example.com');
    await form.locator('input[name="company"]').fill('Stage 12 Event Gate');
    await form.locator('select[name="role"]').selectOption({ label: 'Engineering / platform leader' });
    await form.locator('select[name="segment"]').selectOption({ label: 'Growth-stage technology company' });
    await form.locator('select[name="urgency"]').selectOption({ label: 'Within 30 days' });
    await form.locator('select[name="evidence_readiness"]').selectOption({ label: 'Some evidence is available' });
    await form.locator('textarea[name="context"]').fill('Stage 12 event-contract regression.');
    await form.locator('button[type="submit"]').click();
    await form.locator('.form-success').waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(100);

    const leads = byName(payloads, 'generate_lead');
    if (leads.length !== 1) throw new Error(`assessment: expected one generate_lead collector event, got ${leads.length}`);
    const lead = leads[0].props || {};
    if (lead.form_name !== 'assessment_request') throw new Error('assessment: generate_lead form_name mismatch');
    if (lead.assessment !== 'Cloud & AI Cost Assessment') throw new Error('assessment: assessment property missing');
    if (lead.last_touch_source !== 'tayoca_site' || lead.last_touch_medium !== 'internal' || lead.last_touch_campaign !== 'pgc1_cloud_ai_cost') {
      throw new Error('assessment: attributed generate_lead properties are incomplete');
    }
    if (lead.test_traffic !== 'stage12') throw new Error('assessment: generate_lead test traffic marker missing');

    const next = form.locator('.form-next-action a');
    await next.waitFor({ state: 'visible', timeout: 5000 });
    await next.evaluate(node => node.addEventListener('click', event => event.preventDefault(), { once: true }));
    await next.click();
    await page.waitForTimeout(100);
    const schedule = byName(payloads, 'assessment_schedule_click');
    if (schedule.length !== 1) throw new Error(`assessment: expected one assessment_schedule_click collector event, got ${schedule.length}`);
    if ((schedule[0].props || {}).test_traffic !== 'stage12') throw new Error('assessment: schedule event test traffic marker missing');

    return { generate_lead: leads.length, assessment_schedule_click: schedule.length };
  } finally {
    await context.close();
  }
}

async function checkOperatorBrief(browser, base) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage();
  const payloads = await captureCollector(page);
  try {
    const url = `${base}/operator-brief.html?tayoca_test=stage12&utm_source=operator_brief&utm_medium=email&utm_campaign=phase2_event_gate&utm_content=signup`;
    await goto200(page, url, 'Operator Brief event contract');
    const form = page.locator('form[data-tayoca-form="operator_brief"]');
    await form.locator('input[name="email"]').fill('phase2-brief-event-stage12@example.com');
    await form.locator('select[name="interest"]').selectOption({ label: 'Technology value and FinOps' });
    await form.locator('input[name="consent"]').check();
    await form.locator('button[type="submit"]').click();
    await form.locator('.form-success').waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(100);

    const leads = byName(payloads, 'generate_lead');
    const signups = byName(payloads, 'operator_brief_signup');
    if (leads.length !== 1) throw new Error(`Operator Brief: expected one generate_lead, got ${leads.length}`);
    if (signups.length !== 1) throw new Error(`Operator Brief: expected one operator_brief_signup, got ${signups.length}`);
    const props = signups[0].props || {};
    if (props.interest !== 'Technology value and FinOps') throw new Error('Operator Brief: signup interest missing');
    if (props.newsletter_source !== 'operator_brief' || props.newsletter_issue !== 'phase2_event_gate') {
      throw new Error('Operator Brief: newsletter attribution missing');
    }
    if (props.test_traffic !== 'stage12') throw new Error('Operator Brief: test traffic marker missing');
    return { generate_lead: leads.length, operator_brief_signup: signups.length };
  } finally {
    await context.close();
  }
}

async function checkProduct(browser, base) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await context.newPage();
  const payloads = await captureCollector(page);
  try {
    await goto200(page, `${base}/products/aws-cost-optimization-playbook.html?tayoca_test=stage12`, 'product event contract');
    const cta = page.locator('a[data-event="product_purchase_click"]').first();
    await cta.evaluate(node => {
      node.removeAttribute('target');
      node.addEventListener('click', event => event.preventDefault(), { once: true });
    });
    await cta.click();
    await page.waitForTimeout(100);
    const explicit = byName(payloads, 'product_purchase_click');
    const conversion = byName(payloads, 'product_click');
    const outbound = byName(payloads, 'gumroad_click');
    if (explicit.length !== 1 || conversion.length !== 1 || outbound.length !== 1) {
      throw new Error(`product: expected product_purchase_click/product_click/gumroad_click once each, got ${explicit.length}/${conversion.length}/${outbound.length}`);
    }
    if ((conversion[0].props || {}).test_traffic !== 'stage12') throw new Error('product: product_click test traffic marker missing');
    return { product_purchase_click: explicit.length, product_click: conversion.length, gumroad_click: outbound.length };
  } finally {
    await context.close();
  }
}

async function main() {
  const staticServer = server();
  await new Promise((resolve, reject) => {
    staticServer.once('error', reject);
    staticServer.listen(0, '127.0.0.1', resolve);
  });
  const base = `http://127.0.0.1:${staticServer.address().port}`;
  const browser = await chromium.launch({ headless: true });
  try {
    const results = [
      { journey: 'assessment-events', ...(await checkAssessment(browser, base)) },
      { journey: 'operator-brief-events', ...(await checkOperatorBrief(browser, base)) },
      { journey: 'product-events', ...(await checkProduct(browser, base)) },
    ];
    console.log(JSON.stringify({ checks: results.length, passed: results.length, results }));
  } finally {
    await browser.close();
    await new Promise(resolve => staticServer.close(resolve));
  }
}

main().catch(error => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
