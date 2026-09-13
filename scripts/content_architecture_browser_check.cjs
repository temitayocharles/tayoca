const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = '/public';
const PORT = 4317;

function contentType(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8';
  if (file.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.png')) return 'image/png';
  if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent(new URL(req.url, `http://127.0.0.1:${PORT}`).pathname);
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/blog') pathname = '/blog/index.html';
  let file = path.normalize(path.join(ROOT, pathname));
  if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }
  try {
    const stat = fs.statSync(file);
    if (stat.isDirectory()) file = path.join(file, 'index.html');
    const body = fs.readFileSync(file);
    res.writeHead(200, {'Content-Type': contentType(file), 'Cache-Control': 'no-store'});
    res.end(body);
  } catch (_) { res.writeHead(404); res.end('not found'); }
});

function assert(condition, message) { if (!condition) throw new Error(message); }

async function checkProducts(page) {
  await page.goto(`http://127.0.0.1:${PORT}/products.html`, {waitUntil: 'networkidle'});
  await page.waitForSelector('[data-product-ecosystem]');
  const state = await page.evaluate(() => ({
    h1: document.querySelector('main h1')?.textContent.trim(),
    offerLabel: document.querySelector('[data-product-ecosystem] > .stage10-family-label')?.textContent.trim(),
    offerTitle: document.querySelector('[data-product-ecosystem] > h2')?.textContent.trim(),
    offerCopy: document.querySelector('[data-product-ecosystem] > .stage10-ecosystem-intro')?.textContent.trim(),
    labels: Array.from(document.querySelectorAll('[id^="family-"] .stage10-family-label')).map(n => n.textContent.trim()),
    assessmentSummary: document.querySelector('#family-executive-assessments p:not(.stage10-family-label)')?.textContent.trim(),
  }));
  assert(state.h1 === 'Useful material for people who want to do the work themselves.', `unexpected H1: ${state.h1}`);
  assert(state.offerLabel === 'Offer map', `unexpected offer label: ${state.offerLabel}`);
  assert(state.offerTitle === 'Different ways to work with Tayoca.', `unexpected offer title: ${state.offerTitle}`);
  assert(state.offerCopy.includes('Assessments are diagnostic engagements.'), 'assessment taxonomy missing');
  assert(state.offerCopy.includes('Managed Operations are ongoing services.'), 'managed-operations taxonomy missing');
  const expected = ['Software product','Operator publications','Diagnostic engagements','Ongoing services'];
  assert(expected.every(x => state.labels.includes(x)), `family labels incomplete: ${JSON.stringify(state.labels)}`);
  assert(state.assessmentSummary?.startsWith('Three diagnostic engagements that turn cost, reliability and technology-value uncertainty'), `assessment summary incorrect: ${state.assessmentSummary}`);
  assert(!state.assessmentSummary?.includes('diagnostic products'), `assessment summary still uses product wording: ${state.assessmentSummary}`);
}

async function checkArchive(page) {
  await page.goto(`http://127.0.0.1:${PORT}/operator-brief-archive.html`, {waitUntil: 'networkidle'});
  const text = await page.locator('main').innerText();
  const forbidden = ['Opportunity pgc1:', 'Opportunity product:', 'public_verified', 'pgc1_cloud_ai_cost', 'pgc1_ai_automation_operations', 'Tayoca Growth OS Products catalogue', 'measurable product CTA'];
  forbidden.forEach(term => assert(!text.includes(term), `editorial implementation term leaked: ${term}`));
  assert(text.includes('Practical operating intelligence for people responsible for cloud'), 'public issue lede not normalized');
  assert(text.includes('Source: AWS Cost Optimization Playbook'), 'AWS public source label missing');
  assert(text.includes('Source: Kubernetes Production Readiness Checklist'), 'readiness public source label missing');
  assert(text.includes('Source: GitOps Field Guide'), 'GitOps public source label missing');
}

(async () => {
  await new Promise(resolve => server.listen(PORT, '127.0.0.1', resolve));
  const browser = await chromium.launch({headless: true});
  try {
    for (const viewport of [{width: 1440, height: 1000}, {width: 390, height: 844}]) {
      const page = await browser.newPage({viewport});
      const errors = [];
      page.on('pageerror', err => errors.push(String(err)));
      await checkProducts(page);
      await checkArchive(page);
      assert(errors.length === 0, `page errors: ${errors.join(' | ')}`);
      await page.close();
    }
    console.log('Phase 3 content architecture browser check PASSED on desktop and mobile for offer taxonomy and Operator Brief editorial authority.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(err => { console.error(err); process.exit(1); });
