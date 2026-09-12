'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const PRODUCT_DIR = path.join(PUBLIC, 'products');
const ROUTES = fs.readdirSync(PRODUCT_DIR)
  .filter(name => name.endsWith('.html'))
  .sort()
  .map(name => `/products/${name}`);
const MODES = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 }, isMobile: false, hasTouch: false },
  { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon', '.webp': 'image/webp',
};

function createStaticServer() {
  return http.createServer((req, res) => {
    try {
      const requestUrl = new URL(req.url, 'http://127.0.0.1');
      let pathname = decodeURIComponent(requestUrl.pathname);
      if (pathname === '/') pathname = '/index.html';
      let file = path.resolve(PUBLIC, `.${pathname}`);
      if (!file.startsWith(PUBLIC + path.sep) && file !== PUBLIC) return res.writeHead(403).end('Forbidden');
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
        return res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      fs.createReadStream(file).pipe(res);
    } catch {
      res.writeHead(500).end('Server error');
    }
  });
}

async function checkRoute(browser, base, mode, route) {
  const context = await browser.newContext({
    viewport: mode.viewport, isMobile: mode.isMobile, hasTouch: mode.hasTouch, colorScheme: 'light',
  });
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error.message || error)));
  try {
    const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 30000 });
    if (!response || response.status() !== 200) throw new Error(`HTTP ${response ? response.status() : 0}`);

    const toggle = page.locator('.theme-switch:visible').first();
    await toggle.waitFor({ state: 'visible', timeout: 5000 });
    const root = page.locator('html');
    const initial = await root.getAttribute('data-theme');
    const initialLabel = await toggle.getAttribute('aria-label');
    const v9Css = await page.locator('link[href="/assets/css/tayoca-v9.css"]').count();
    const v9Js = await page.locator('script[src="/tayoca-v9.js"]').count();
    if (initial !== 'light') throw new Error(`expected initial light theme, got ${initial}`);
    if (initialLabel !== 'Switch to dark theme') throw new Error(`unexpected initial label: ${initialLabel}`);
    if (v9Css !== 1 || v9Js !== 1) throw new Error(`v9 asset counts css=${v9Css} js=${v9Js}`);

    await toggle.click();
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
    const darkLabel = await toggle.getAttribute('aria-label');
    const storedDark = await page.evaluate(() => localStorage.getItem('tayoca-theme'));
    if (darkLabel !== 'Switch to light theme' || storedDark !== 'dark') throw new Error('dark theme state did not persist');

    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('.theme-switch:visible').first().waitFor({ state: 'visible', timeout: 5000 });
    const reloadTheme = await page.locator('html').getAttribute('data-theme');
    if (reloadTheme !== 'dark') throw new Error(`dark theme did not survive reload: ${reloadTheme}`);

    await page.locator('.theme-switch:visible').first().click();
    await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
    const storedLight = await page.evaluate(() => localStorage.getItem('tayoca-theme'));
    if (storedLight !== 'light') throw new Error('light theme state did not persist');
    if (pageErrors.length) throw new Error(`page errors: ${pageErrors.join(' | ')}`);
    return { route, mode: mode.name, pass: true };
  } finally {
    await context.close();
  }
}

async function main() {
  if (!ROUTES.length) throw new Error('No product detail routes found');
  const server = createStaticServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true });
  const results = [];
  try {
    for (const mode of MODES) {
      for (const route of ROUTES) results.push(await checkRoute(browser, base, mode, route));
    }
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(JSON.stringify({ routes: ROUTES.length, checks: results.length, passed: results.length, results }));
}

main().catch(error => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
