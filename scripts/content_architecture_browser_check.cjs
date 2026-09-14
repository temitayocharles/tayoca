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

async function checkWork(page) {
  await page.goto(`http://127.0.0.1:${PORT}/work.html`, {waitUntil: 'networkidle'});
  const state = await page.evaluate(() => ({
    hero: document.querySelector('main .hero-cinema .lede')?.textContent.trim(),
    heading: document.querySelector('main .section .work-intro h2')?.textContent.trim(),
    intro: document.querySelector('main .section .work-intro p')?.textContent.trim(),
    main: document.querySelector('main')?.innerText || '',
    description: document.querySelector('meta[name="description"]')?.content || '',
    ogDescription: document.querySelector('meta[property="og:description"]')?.content || '',
  }));
  assert(state.hero.includes('documents selected project work alongside client delivery'), `Work hero authority wording missing: ${state.hero}`);
  assert(state.heading === 'Products, publications, programmes and selected project work', `Work heading incorrect: ${state.heading}`);
  assert(state.intro.includes('other projects stay neutral unless the relationship has been confirmed'), `Work disclosure boundary missing: ${state.intro}`);
  assert(!state.main.includes('Things we are building and operating ourselves'), 'Work page still implies all projects are owned/operated');
  assert(!state.hero.includes('Tayoca builds software, marketplaces'), 'Work hero still overstates portfolio ownership');
  assert(state.main.includes('SiteSupply'), 'SiteSupply record disappeared from Work page');
  assert(state.main.includes('Project / build · in market'), 'SiteSupply neutral public label missing');
  assert(state.main.includes('It is an owned Tayoca product'), 'Sivanta owned-product classification missing');
  assert(!state.description.includes('built and operated by Tayoca'), `Work meta description overstates authority: ${state.description}`);
  assert(!state.ogDescription.includes('built and operated by Tayoca'), `Work OG description overstates authority: ${state.ogDescription}`);
}

async function checkAbout(page) {
  await page.goto(`http://127.0.0.1:${PORT}/about.html`, {waitUntil: 'networkidle'});
  const text = await page.locator('main').innerText();
  ['client delivery', 'owned software', 'editorial work', 'community projects'].forEach(term =>
    assert(text.toLowerCase().includes(term), `About taxonomy missing: ${term}`));
  assert(!text.includes('Everything Tayoca shows is client work'), 'About page collapses distinct company work types');
}

async function checkSegment(page, route, expectedAssessment) {
  await page.goto(`http://127.0.0.1:${PORT}${route}`, {waitUntil: 'networkidle'});
  const text = await page.locator('main').innerText();
  assert(text.includes('The assessment is a diagnostic starting point.'), `${route} diagnostic boundary missing`);
  assert(text.includes('Scope, evidence access and acceptance criteria are confirmed before implementation.'), `${route} implementation boundary missing`);
  assert(text.includes('Start with evidence, then choose the smallest useful intervention.'), `${route} evidence-first decision path missing`);
  assert(text.includes('Tayoca separates diagnosis from implementation'), `${route} diagnosis/implementation separation missing`);
  assert(text.includes(expectedAssessment), `${route} expected assessment missing: ${expectedAssessment}`);
}

async function checkResults(page) {
  await page.goto(`http://127.0.0.1:${PORT}/results.html`, {waitUntil: 'networkidle'});
  const text = await page.locator('main').innerText();
  assert(text.includes('Tayoca does not turn estimates into proof.'), 'Results evidence boundary missing');
  assert(text.includes('Quantified AWS case-study narrative withdrawn from proof use'), 'withdrawn AWS evidence notice missing');
  assert(text.includes('It is not used as a headline result, proof statistic or sales guarantee anywhere on the site.'), 'withdrawn AWS usage boundary missing');
  assert(text.includes('Baseline') && text.includes('Intervention') && text.includes('Measurement') && text.includes('Approval') && text.includes('Limits'), 'Results evidence model incomplete');
}

async function checkInsights(page) {
  await page.goto(`http://127.0.0.1:${PORT}/blog/`, {waitUntil: 'domcontentloaded'});
  const state = await page.evaluate(() => ({
    canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    title: document.title,
    h1: document.querySelector('main h1')?.textContent.trim() || '',
    main: document.querySelector('main')?.innerText || '',
  }));
  assert(state.canonical === 'https://tayoca.com/blog/', `Insights canonical incorrect: ${state.canonical}`);
  assert(state.title.startsWith('Insights | Tayoca'), `Insights document identity missing: ${state.title}`);
  assert(state.h1 === 'Field notes for people who have to keep technology working.', `Insights authored hero changed: ${state.h1}`);
  assert(state.main.includes('Operator Brief'), 'Insights library does not expose Operator Brief');
  assert(state.main.includes('Withdrawn evidence narratives are not promoted as public proof'), 'Insights withdrawal boundary missing');
}

async function checkWithdrawnEvidence(page, route) {
  await page.goto(`http://127.0.0.1:${PORT}${route}`, {waitUntil: 'domcontentloaded'});
  const state = await page.evaluate(() => ({
    robots: document.querySelector('meta[name="robots"]')?.content || '',
    title: document.title,
    main: document.querySelector('main')?.innerText || '',
    footer: document.querySelector('footer')?.innerText || '',
    links: Array.from(document.querySelectorAll('footer a')).map(a => ({text: a.textContent.trim(), href: a.getAttribute('href')})),
  }));
  assert(state.robots === 'noindex,follow', `${route} robots policy changed: ${state.robots}`);
  assert(state.title === 'Case Study Under Evidence Review | Tayoca', `${route} evidence-review title changed`);
  assert(state.main.toLowerCase().includes('withdrawn'), `${route} no longer states withdrawal`);
  assert(state.main.toLowerCase().includes('public proof'), `${route} no longer states proof boundary`);
  assert(state.footer.includes('An engineering-led technology company: software, platforms, automation and publications for technology that has to be reliable, accountable and economically understood.'), `${route} rendered company description missing`);
  assert(!state.footer.includes('Technology Value & FinOps'), `${route} superseded service taxonomy returned`);
  assert(state.links.some(x => x.text === 'Insights' && x.href === '/insights.html'), `${route} rendered Insights link missing`);
  assert(state.links.some(x => x.text === 'Operator Brief' && x.href === '/operator-brief.html'), `${route} Operator Brief link missing`);
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
      await checkWork(page);
      await checkAbout(page);
      await checkSegment(page, '/segments/growth-stage-technology.html', 'Technology Value Assessment');
      await checkSegment(page, '/segments/regulated-operations.html', 'Platform Reliability Assessment');
      await checkSegment(page, '/segments/ai-enabled-engineering.html', 'Cloud & AI Cost Assessment');
      await checkResults(page);
      await checkInsights(page);
      await checkWithdrawnEvidence(page, '/blog/how-we-saved-216k-aws.html');
      await checkWithdrawnEvidence(page, '/blog/how-we-saved-216k-on-aws-in-90-days.html');
      assert(errors.length === 0, `page errors: ${errors.join(' | ')}`);
      await page.close();
    }
    console.log('Phase 3 content architecture browser check PASSED on desktop and mobile across offer taxonomy, editorial authority, portfolio disclosure, company story, all segment journeys, evidence governance, canonical Insights and withdrawn-evidence routes.');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(err => { console.error(err); process.exit(1); });
