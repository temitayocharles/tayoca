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
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

function server() {
  return http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url, 'http://127.0.0.1');
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname === '/') pathname = '/index.html';
      let file = path.resolve(PUBLIC, `.${pathname}`);
      if (!file.startsWith(PUBLIC + path.sep) && file !== PUBLIC) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      fs.createReadStream(file).pipe(res);
    } catch (error) {
      res.writeHead(500).end('Server error');
    }
  });
}

function attachErrorCapture(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(String(error.message || error)));
  return errors;
}

async function goto200(page, url, label) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response || response.status() !== 200) {
    throw new Error(`${label}: HTTP ${response ? response.status() : 0}`);
  }
}

async function checkAssessmentJourney(browser, base, mode) {
  const context = await browser.newContext({
    viewport: mode.viewport,
    isMobile: mode.isMobile,
    hasTouch: mode.hasTouch,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const errors = attachErrorCapture(page);
  try {
    await goto200(page, `${base}/services.html`, `${mode.name} services`);
    const serviceHref = '/assessments.html?assessment=Cloud%20%26%20AI%20Cost%20Assessment#assessment-form';
    const deepLink = new URL(serviceHref, base);
    deepLink.searchParams.set('utm_source', 'tayoca_site');
    deepLink.searchParams.set('utm_medium', 'internal');
    deepLink.searchParams.set('utm_campaign', 'pgc1_cloud_ai_cost');
    deepLink.searchParams.set('utm_content', 'phase2_browser_gate');
    deepLink.searchParams.set('tayoca_test', 'stage12');
    deepLink.hash = 'assessment-form';
    await goto200(page, deepLink.toString(), `${mode.name} assessment`);

    const assessment = page.locator('form[data-tayoca-form="assessment_request"] select[name="assessment"]');
    if ((await assessment.inputValue()) !== 'Cloud & AI Cost Assessment') {
      throw new Error(`${mode.name}: assessment deep link did not preselect Cloud & AI Cost Assessment`);
    }

    const analyticsContext = await page.evaluate(() => {
      if (!window.TayocaAnalytics || typeof window.TayocaAnalytics.context !== 'function') return null;
      return window.TayocaAnalytics.context({});
    });
    if (!analyticsContext) throw new Error(`${mode.name}: TayocaAnalytics context unavailable`);
    if (analyticsContext.last_touch_source !== 'tayoca_site') throw new Error(`${mode.name}: attribution source not preserved`);
    if (analyticsContext.last_touch_medium !== 'internal') throw new Error(`${mode.name}: attribution medium not preserved`);
    if (analyticsContext.last_touch_campaign !== 'pgc1_cloud_ai_cost') throw new Error(`${mode.name}: attribution campaign not preserved`);
    if (analyticsContext.test_traffic !== 'stage12') throw new Error(`${mode.name}: Stage 12 test traffic not marked`);

    const form = page.locator('form[data-tayoca-form="assessment_request"]');
    await form.locator('input[name="email"]').fill('phase2-stage12@example.com');
    await form.locator('input[name="company"]').fill('Stage 12 Safe Test');
    await form.locator('select[name="role"]').selectOption({ label: 'Engineering / platform leader' });
    await form.locator('select[name="segment"]').selectOption({ label: 'Growth-stage technology company' });
    await form.locator('select[name="urgency"]').selectOption({ label: 'Within 30 days' });
    await form.locator('select[name="evidence_readiness"]').selectOption({ label: 'Some evidence is available' });
    await form.locator('textarea[name="context"]').fill('Stage 12 browser regression only; no production lead should be created.');
    await form.locator('button[type="submit"]').click();

    const success = form.locator('.form-success');
    await success.waitFor({ state: 'visible', timeout: 5000 });
    const successText = (await success.textContent() || '').trim();
    if (!successText.includes('No lead was created')) throw new Error(`${mode.name}: Stage 12 assessment did not prove no lead creation`);

    const next = form.locator('.form-next-action a');
    await next.waitFor({ state: 'visible', timeout: 5000 });
    const nextHref = await next.getAttribute('href');
    if (nextHref !== 'https://cal.com/tayoca/finops-audit') {
      throw new Error(`${mode.name}: assessment next action incorrect: ${nextHref}`);
    }
    if ((await next.getAttribute('data-event')) !== 'assessment_schedule_click') {
      throw new Error(`${mode.name}: assessment scheduling event contract missing`);
    }

    if (errors.length) throw new Error(`${mode.name}: assessment page errors: ${errors.join(' | ')}`);
    return { mode: mode.name, serviceHref, successText, nextHref, attribution: analyticsContext };
  } finally {
    await context.close();
  }
}

async function checkOperatorBrief(browser, base, mode) {
  const context = await browser.newContext({
    viewport: mode.viewport,
    isMobile: mode.isMobile,
    hasTouch: mode.hasTouch,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const errors = attachErrorCapture(page);
  try {
    const url = `${base}/operator-brief.html?tayoca_test=stage12&utm_source=phase2_cert&utm_medium=internal&utm_campaign=phase2_conversion`;
    await goto200(page, url, `${mode.name} operator brief`);
    const form = page.locator('form[data-tayoca-form="operator_brief"]');
    if (await form.count() !== 1) throw new Error(`${mode.name}: Operator Brief signup form missing`);
    await form.locator('input[name="email"]').fill('phase2-brief-stage12@example.com');
    await form.locator('select[name="interest"]').selectOption({ label: 'Technology value and FinOps' });
    await form.locator('input[name="consent"]').check();
    await form.locator('button[type="submit"]').click();

    const success = form.locator('.form-success');
    await success.waitFor({ state: 'visible', timeout: 5000 });
    const successText = (await success.textContent() || '').trim();
    if (!successText.includes('No subscription was created')) {
      throw new Error(`${mode.name}: Stage 12 signup did not prove no subscription creation`);
    }
    if (errors.length) throw new Error(`${mode.name}: Operator Brief page errors: ${errors.join(' | ')}`);
    return { mode: mode.name, successText };
  } finally {
    await context.close();
  }
}

async function checkStaticJourneyContracts(browser, base, mode) {
  const context = await browser.newContext({
    viewport: mode.viewport,
    isMobile: mode.isMobile,
    hasTouch: mode.hasTouch,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const errors = attachErrorCapture(page);
  try {
    await goto200(page, `${base}/work.html`, `${mode.name} work`);
    const workCta = page.locator('main a', { hasText: 'Start an Assessment' }).first();
    if (await workCta.count() !== 1) throw new Error(`${mode.name}: Work assessment CTA missing`);
    await Promise.all([
      page.waitForURL(url => url.pathname === '/assessments.html', { timeout: 5000 }),
      workCta.click(),
    ]);

    await goto200(page, `${base}/products/aws-cost-optimization-playbook.html`, `${mode.name} product`);
    const productCtas = page.locator('a[data-event="product_purchase_click"]');
    const productCount = await productCtas.count();
    if (productCount < 2) throw new Error(`${mode.name}: expected both product purchase CTAs`);
    for (let i = 0; i < productCount; i += 1) {
      const link = productCtas.nth(i);
      const href = await link.getAttribute('href');
      if (href !== 'https://tayoca.gumroad.com/l/aws-cost-optimization') {
        throw new Error(`${mode.name}: product CTA destination mismatch: ${href}`);
      }
      if ((await link.getAttribute('target')) !== '_blank') throw new Error(`${mode.name}: product CTA should open externally`);
    }

    await goto200(page, `${base}/community/websites`, `${mode.name} community`);
    const communityCtas = page.locator('a[href*="docs.google.com/forms/d/e/"]');
    const communityCount = await communityCtas.count();
    if (communityCount < 2) throw new Error(`${mode.name}: community application CTAs missing`);
    const destinations = new Set();
    for (let i = 0; i < communityCount; i += 1) {
      const link = communityCtas.nth(i);
      destinations.add(await link.getAttribute('href'));
      if ((await link.getAttribute('target')) !== '_blank') throw new Error(`${mode.name}: community CTA should open externally`);
    }
    if (destinations.size !== 1) throw new Error(`${mode.name}: community CTAs do not share one governed intake destination`);

    if (errors.length) throw new Error(`${mode.name}: static journey page errors: ${errors.join(' | ')}`);
    return { mode: mode.name, productCtas: productCount, communityCtas: communityCount, communityDestination: [...destinations][0] };
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
      results.push({ journey: 'service-assessment', ...(await checkAssessmentJourney(browser, base, mode)) });
      results.push({ journey: 'operator-brief', ...(await checkOperatorBrief(browser, base, mode)) });
      results.push({ journey: 'work-product-community-contracts', ...(await checkStaticJourneyContracts(browser, base, mode)) });
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
