'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const MODES = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];
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

async function fillAssessment(form) {
  await form.locator('input[name="email"]').fill('phase2-error-test@example.com');
  await form.locator('input[name="company"]').fill('Stage 12 Error Harness');
  await form.locator('select[name="role"]').selectOption({ label: 'Engineering / platform leader' });
  await form.locator('select[name="segment"]').selectOption({ label: 'Growth-stage technology company' });
  await form.locator('select[name="assessment"]').selectOption({ label: 'Cloud & AI Cost Assessment' });
  await form.locator('select[name="urgency"]').selectOption({ label: 'Within 30 days' });
  await form.locator('select[name="evidence_readiness"]').selectOption({ label: 'Some evidence is available' });
  await form.locator('textarea[name="context"]').fill('Local intercepted error-path regression; no production request must be sent.');
}

async function checkAssessmentError(browser, base, mode) {
  const context = await browser.newContext({ viewport: mode.viewport, isMobile: mode.isMobile, hasTouch: mode.hasTouch, colorScheme: 'light' });
  const page = await context.newPage();
  let intercepted = 0;
  try {
    await page.route('https://n8n.tca-infraforge.site/webhook/tayoca/growth/assessment', async route => {
      intercepted += 1;
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'simulated-browser-regression' }) });
    });
    await goto200(page, `${base}/assessments.html`, `${mode.name} assessment error state`);
    const form = page.locator('form[data-tayoca-form="assessment_request"]');
    await fillAssessment(form);
    await form.locator('button[type="submit"]').click();
    const error = form.locator('.form-error');
    await error.waitFor({ state: 'visible', timeout: 5000 });
    const text = (await error.textContent() || '').trim();
    if (!text.includes('support@tayoca.com')) throw new Error(`${mode.name}: assessment error recovery path missing`);
    if (intercepted !== 1) throw new Error(`${mode.name}: expected exactly one intercepted assessment request, got ${intercepted}`);
    if (await form.locator('.form-success').count()) throw new Error(`${mode.name}: success state rendered during simulated assessment failure`);
    return { mode: mode.name, intercepted, text };
  } finally {
    await context.close();
  }
}

async function checkOperatorBriefError(browser, base, mode) {
  const context = await browser.newContext({ viewport: mode.viewport, isMobile: mode.isMobile, hasTouch: mode.hasTouch, colorScheme: 'light' });
  const page = await context.newPage();
  let intercepted = 0;
  try {
    await page.route('https://n8n.tca-infraforge.site/webhook/tayoca/growth/operator-brief', async route => {
      intercepted += 1;
      await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'simulated-browser-regression' }) });
    });
    await goto200(page, `${base}/operator-brief.html`, `${mode.name} Operator Brief error state`);
    const form = page.locator('form[data-tayoca-form="operator_brief"]');
    await form.locator('input[name="email"]').fill('phase2-brief-error@example.com');
    await form.locator('select[name="interest"]').selectOption({ label: 'Technology value and FinOps' });
    await form.locator('input[name="consent"]').check();
    await form.locator('button[type="submit"]').click();
    const error = form.locator('.form-error');
    await error.waitFor({ state: 'visible', timeout: 5000 });
    const text = (await error.textContent() || '').trim();
    if (!text.includes('support@tayoca.com')) throw new Error(`${mode.name}: Operator Brief error recovery path missing`);
    if (intercepted !== 1) throw new Error(`${mode.name}: expected exactly one intercepted Operator Brief request, got ${intercepted}`);
    if (await form.locator('.form-success').count()) throw new Error(`${mode.name}: success state rendered during simulated Operator Brief failure`);
    return { mode: mode.name, intercepted, text };
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
  const results = [];
  try {
    for (const mode of MODES) {
      results.push({ journey: 'assessment-error', ...(await checkAssessmentError(browser, base, mode)) });
      results.push({ journey: 'operator-brief-error', ...(await checkOperatorBriefError(browser, base, mode)) });
    }
  } finally {
    await browser.close();
    await new Promise(resolve => staticServer.close(resolve));
  }
  console.log(JSON.stringify({ checks: results.length, passed: results.length, results }));
}

main().catch(error => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
