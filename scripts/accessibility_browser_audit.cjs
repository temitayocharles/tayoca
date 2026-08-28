'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');
const { AxeBuilder } = require('@axe-core/playwright');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OUTPUT_ARG = process.argv.indexOf('--output');
const OUTPUT = OUTPUT_ARG >= 0 && process.argv[OUTPUT_ARG + 1]
  ? path.resolve(process.argv[OUTPUT_ARG + 1])
  : path.join(ROOT, 'docs', 'w10-selfhosted-browser-accessibility-audit.json');

const PAGES = [
  '/',
  '/services.html',
  '/assessments.html',
  '/operator-brief.html',
  '/blog/gitops-beyond-hello-world.html',
];

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

function createStaticServer() {
  return http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url, 'http://127.0.0.1');
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname === '/') pathname = '/index.html';
      const candidate = path.resolve(PUBLIC, `.${pathname}`);
      if (!candidate.startsWith(PUBLIC + path.sep) && candidate !== PUBLIC) {
        res.writeHead(403).end('Forbidden');
        return;
      }
      let file = candidate;
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

function summarizeAxe(violations) {
  return violations.map(v => ({
    id: v.id,
    impact: v.impact || 'unknown',
    help: v.help,
    helpUrl: v.helpUrl,
    nodeCount: v.nodes.length,
    targets: v.nodes.slice(0, 5).map(n => n.target.join(' > ')),
  }));
}

async function customDomAudit(page) {
  return page.evaluate(() => {
    const visible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const name = el => (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 160);
    const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id).filter(Boolean);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(el => ({ level: Number(el.tagName.slice(1)), text: name(el) }));
    const headingSkips = [];
    for (let i = 1; i < headings.length; i += 1) {
      if (headings[i].level - headings[i - 1].level > 1) {
        headingSkips.push({ from: headings[i - 1], to: headings[i] });
      }
    }
    const controls = Array.from(document.querySelectorAll('input,select,textarea,button')).filter(visible).filter(el => el.getAttribute('type') !== 'hidden');
    const unlabeledControls = controls.filter(el => {
      if (el.tagName === 'BUTTON' && name(el)) return false;
      const id = el.id || '';
      return !(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) || el.closest('label'));
    }).map(el => ({ tag: el.tagName.toLowerCase(), type: el.getAttribute('type') || '', id: el.id || '', name: el.getAttribute('name') || '' }));
    const skipLinks = Array.from(document.querySelectorAll('a[href^="#"]')).filter(a => /skip/i.test(name(a))).map(a => {
      const href = a.getAttribute('href');
      let targetExists = false;
      try { targetExists = !!document.querySelector(href); } catch {}
      return { text: name(a), href, targetExists };
    });
    const nestedInteractive = Array.from(document.querySelectorAll('a button, a input, a select, a textarea, button a, button button, button input, button select, button textarea')).filter(visible).map(el => ({ tag: el.tagName.toLowerCase(), name: name(el) })).slice(0, 20);
    const imagesMissingAlt = Array.from(document.images).filter(img => !img.hasAttribute('alt')).map(img => img.getAttribute('src') || '').slice(0, 20);
    const overflow = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const landmarks = {
      main: document.querySelectorAll('main,[role="main"]').length,
      nav: document.querySelectorAll('nav,[role="navigation"]').length,
      header: document.querySelectorAll('header,[role="banner"]').length,
      footer: document.querySelectorAll('footer,[role="contentinfo"]').length,
    };
    const menuToggles = Array.from(document.querySelectorAll('[aria-expanded][aria-controls]')).filter(visible).map(el => ({
      tag: el.tagName.toLowerCase(),
      name: name(el),
      expanded: el.getAttribute('aria-expanded'),
      controls: el.getAttribute('aria-controls'),
    }));
    return { duplicateIds, headings, headingSkips, unlabeledControls, skipLinks, nestedInteractive, imagesMissingAlt, horizontalOverflowPx: overflow, landmarks, menuToggles };
  });
}

async function keyboardAudit(page) {
  await page.evaluate(() => {
    if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur();
  });
  const sequence = [];
  for (let i = 0; i < 18; i += 1) {
    await page.keyboard.press('Tab');
    const item = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 120);
      const outlineVisible = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth || '0') > 0;
      const shadowVisible = style.boxShadow && style.boxShadow !== 'none';
      return {
        tag: el.tagName.toLowerCase(), id: el.id || '', text,
        href: el.getAttribute('href') || '',
        visible: !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length),
        focusVisiblePseudo: (() => { try { return el.matches(':focus-visible'); } catch { return false; } })(),
        visibleFocusIndicator: Boolean(outlineVisible || shadowVisible),
      };
    });
    if (item) sequence.push(item);
  }
  const hiddenFocused = sequence.filter(item => !item.visible);
  const missingIndicator = sequence.filter(item => item.visible && item.focusVisiblePseudo && !item.visibleFocusIndicator);
  return { sequence, hiddenFocused, missingIndicator };
}

async function menuAudit(page) {
  const toggle = page.locator('[aria-expanded][aria-controls]:visible').first();
  if (await toggle.count() === 0) return { present: false };
  const before = await toggle.getAttribute('aria-expanded');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(100);
  const after = await toggle.getAttribute('aria-expanded');
  const controls = await toggle.getAttribute('aria-controls');
  let controlledVisible = null;
  if (controls) {
    const controlled = page.locator(`#${controls}`);
    if (await controlled.count()) controlledVisible = await controlled.isVisible();
  }
  if (after !== before) {
    await page.keyboard.press('Enter');
    await page.waitForTimeout(50);
  }
  return { present: true, before, after, controls, controlledVisible, keyboardToggleChangedState: before !== after };
}

function buildFailures(result) {
  const failures = [];
  if (result.httpStatus !== 200) failures.push(`http_status_${result.httpStatus}`);
  for (const violation of result.axeViolations) failures.push(`axe:${violation.id}:${violation.impact}`);
  if (result.dom.landmarks.main !== 1) failures.push(`main_landmark_count:${result.dom.landmarks.main}`);
  if (result.dom.duplicateIds.length) failures.push(`duplicate_ids:${result.dom.duplicateIds.join(',')}`);
  if (result.dom.headingSkips.length) failures.push(`heading_level_skips:${result.dom.headingSkips.length}`);
  if (result.dom.unlabeledControls.length) failures.push(`unlabeled_controls:${result.dom.unlabeledControls.length}`);
  if (result.dom.nestedInteractive.length) failures.push(`nested_interactive:${result.dom.nestedInteractive.length}`);
  if (result.dom.imagesMissingAlt.length) failures.push(`images_missing_alt:${result.dom.imagesMissingAlt.length}`);
  if (result.dom.horizontalOverflowPx > 1) failures.push(`horizontal_overflow_px:${result.dom.horizontalOverflowPx}`);
  if (!result.dom.skipLinks.length) failures.push('skip_link_missing');
  if (result.dom.skipLinks.some(link => !link.targetExists)) failures.push('skip_link_target_missing');
  if (result.keyboard.hiddenFocused.length) failures.push(`keyboard_focus_hidden:${result.keyboard.hiddenFocused.length}`);
  if (result.keyboard.missingIndicator.length) failures.push(`keyboard_focus_indicator_missing:${result.keyboard.missingIndicator.length}`);
  if (result.menu.present && !result.menu.keyboardToggleChangedState) failures.push('menu_not_keyboard_toggleable');
  if (result.pageErrors.length) failures.push(`page_errors:${result.pageErrors.length}`);
  return failures;
}

async function main() {
  const server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const mode of MODES) {
      for (const route of PAGES) {
        const context = await browser.newContext({ viewport: mode.viewport, isMobile: mode.isMobile, hasTouch: mode.hasTouch });
        const page = await context.newPage();
        const pageErrors = [];
        page.on('pageerror', error => pageErrors.push(String(error.message || error).slice(0, 500)));
        const response = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(400);
        const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        const dom = await customDomAudit(page);
        const keyboard = await keyboardAudit(page);
        const menu = await menuAudit(page);
        const result = {
          route, mode: mode.name, viewport: mode.viewport,
          httpStatus: response ? response.status() : 0,
          title: await page.title(),
          axeViolations: summarizeAxe(axe.violations),
          dom, keyboard, menu, pageErrors,
        };
        result.failures = buildFailures(result);
        result.pass = result.failures.length === 0;
        results.push(result);
        await context.close();
      }
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }

  const summary = {
    generated_at: new Date().toISOString(),
    source: 'canonical_forgejo_branch_local_static_server',
    browser: 'chromium_playwright',
    pages: PAGES.length,
    modes: MODES.length,
    checks: results.length,
    passed: results.filter(r => r.pass).length,
    failed: results.filter(r => !r.pass).length,
    axe_violation_count: results.reduce((sum, r) => sum + r.axeViolations.length, 0),
    limitations: [
      'Automated Chromium/Axe and keyboard checks do not constitute full WCAG certification.',
      'Manual screen-reader testing with VoiceOver/NVDA/JAWS remains a separate assistive-technology activity.',
      'Audit serves canonical static files locally and therefore does not validate the currently rate-limited stale Vercel deployment.',
    ],
    results,
  };
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify({ checks: summary.checks, passed: summary.passed, failed: summary.failed, axeViolations: summary.axe_violation_count }));
  process.exit(summary.failed ? 1 : 0);
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exit(2);
});
