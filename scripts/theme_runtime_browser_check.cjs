'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const ROUTES = [
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

async function checkRoute(browser, base, mode, route) {
  const context = await browser.newContext({
    viewport: mode.viewport,
    isMobile: mode.isMobile,
    hasTouch: mode.hasTouch,
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error.message || error)));
  const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
  if (!response || response.status() !== 200) throw new Error(`${mode.name} ${route}: HTTP ${response ? response.status() : 0}`);

  const toggle = page.locator('.theme-switch:visible').first();
  if (await toggle.count() !== 1) throw new Error(`${mode.name} ${route}: visible theme switch missing`);

  const root = page.locator('html');
  const before = await root.getAttribute('data-theme');
  const beforeLabel = await toggle.getAttribute('aria-label');
  if (before !== 'light') throw new Error(`${mode.name} ${route}: expected initial light theme, got ${before}`);
  if (beforeLabel !== 'Switch to dark theme') throw new Error(`${mode.name} ${route}: unexpected initial theme label ${beforeLabel}`);

  await toggle.click();
  await page.waitForTimeout(100);
  const after = await root.getAttribute('data-theme');
  const afterLabel = await toggle.getAttribute('aria-label');
  const storedDark = await page.evaluate(() => localStorage.getItem('tayoca-theme'));
  if (after !== 'dark') throw new Error(`${mode.name} ${route}: click did not switch light -> dark`);
  if (afterLabel !== 'Switch to light theme') throw new Error(`${mode.name} ${route}: dark-state aria-label did not update`);
  if (storedDark !== 'dark') throw new Error(`${mode.name} ${route}: dark preference was not persisted`);

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(100);
  const reloadedTheme = await page.locator('html').getAttribute('data-theme');
  const reloadedLabel = await page.locator('.theme-switch:visible').first().getAttribute('aria-label');
  if (reloadedTheme !== 'dark') throw new Error(`${mode.name} ${route}: persisted dark theme did not survive reload`);
  if (reloadedLabel !== 'Switch to light theme') throw new Error(`${mode.name} ${route}: reloaded dark-state aria-label incorrect`);

  await page.locator('.theme-switch:visible').first().click();
  await page.waitForTimeout(100);
  const restored = await page.locator('html').getAttribute('data-theme');
  const storedLight = await page.evaluate(() => localStorage.getItem('tayoca-theme'));
  if (restored !== 'light' || storedLight !== 'light') throw new Error(`${mode.name} ${route}: dark -> light restore failed`);
  if (errors.length) throw new Error(`${mode.name} ${route}: page errors: ${errors.join(' | ')}`);

  await context.close();
  return { route, mode: mode.name, before, after, reloadedTheme, restored };
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
      for (const route of ROUTES) results.push(await checkRoute(browser, base, mode, route));
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
