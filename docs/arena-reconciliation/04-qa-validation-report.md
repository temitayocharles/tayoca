# QA and validation report

Run on the reconciled branch before pull request. Workspace: GitHub external design
workspace; no production access, no live n8n access, no Control Center access.

> GitHub is the external design workspace. Final acceptance and production
> reconciliation must occur through canonical Forgejo.

---

## 1. Automated gates — all pass

| Gate | Command | Result |
|---|---|---|
| Tracked secrets | `python3 scripts/scan_tracked_secrets.py` | **PASS** — "Tracked-secret gate passed: no high-confidence tracked secret material found." |
| Static site | `python3 scripts/validate_static_site.py` | **PASS** — "Validated 36 canonical pages, 219 tracked files, Stage 4 blocked-claim exclusions, Stage 5 shell conformance, and internal links." |
| Analytics coverage | `python3 scripts/validate_analytics_coverage.py` | **PASS** — "Validated GA4 coverage for 36 canonical sitemap URLs." |
| Product ecosystem (Stage 10) | `python3 scripts/validate_product_ecosystem.py` | **PASS** — "4 families, 16 products, 8 commercial controls per product, 8/8 playbook pages governed, shared runtime/style contract present." |
| **Company ecosystem (new, schema 2)** | `python3 scripts/validate_company_ecosystem.py` | **PASS** — "identity, 3 practices, services, segments, 7 portfolio items, 8 publications, 12 insights, 7 related-ecosystem items classified, newsletter, community and evidence surfaces resolve; disclosure firewall, withdrawn-proof isolation, runtime-inventory wording and the control-center security boundary all hold." |
| Editorial copy quality | `python3 scripts/validate_editorial_copy_quality.py` | **PASS** (pre-existing legacy notices only) |
| Media distribution policy | `python3 scripts/validate_media_distribution_policy.py` | **PASS** |
| Production parity | `python3 scripts/verify_production_parity.py` | **Not run — by design.** The script fetches `https://tayoca.com` and its own docstring states it is "not run on pull requests because Vercel propagation can legitimately lag source merges". This branch is not deployed, so parity is undefined. Belongs to the canonical deployment pipeline. |

The new company-ecosystem validator has been added to the py_compile list and the run
list in `.forgejo/workflows/static-quality.yml` (two lines). That is a **proposed CI
addition** to be accepted by Forgejo.

---

## 2. Static QA matrix

### 2.1 Links, fragments and assets

| Check | Method | Result |
|---|---|---|
| Internal page links resolve | `validate_static_site` link stage | PASS (36 canonical pages) |
| Internal fragment links resolve | `validate_static_site` fragment stage | PASS |
| Skip-link targets resolve | `validate_static_site` shell stage | PASS — `public/blog/n8n-mcp-kubernetes.html` uses `id="main-content"`, and its skip link targets `#main-content` accordingly |
| Runtime-only fragments not linked | Manual review | PASS — no page links to `#managed-operations` / `#operator-playbooks` |
| Image assets exist | Custom scan of 50 HTML files, 64 `<img>` elements | PASS — all 10 files in `public/assets/img/` are referenced; **zero orphaned images, zero missing images** |
| Redirect rules intact | `public/_redirects` | PASS — 18 rules, including the newer `/blog/devops-incident-response-runbook.html → /products/devops-incident-runbook-template.html` rule the old branch had dropped |
| Sitemap | `public/sitemap.xml` | PASS — 36 canonical, indexable URLs (35 + `/work.html`) |

### 2.2 Navigation and shell

| Check | Result |
|---|---|
| Locked primary nav (exact six routes) on every canonical page | PASS — `scripts/validate_static_site.py` asserts this |
| Company-map utility rail present and labelled (`aria-label="Company map"`) | PASS |
| Header CTA `Start an Assessment → /assessments.html` with `header-cta`/`button` | PASS |
| Canonical `<header class="site-header">`, `.menu-toggle`, `<main>`, skip link, meta description, `og:title`, `twitter:card`, `/tayoca-site.js` | PASS on all 36 canonical pages |
| Canonical URL + `robots` directives | PASS |
| Shell applied across the whole site | 47 pages link `site-shell.css`; 44 carry the canonical header. The remainder are non-canonical artefact pages (email signature fragment, landers) |
| `404.html` retains `noindex` | PASS |

### 2.3 Responsive

| Check | Result |
|---|---|
| `.grid`, `.grid.two`, `.grid.four`, `.grid.auto`, `.products-grid`, `.steps`, `.stat-row`, `.metrics`, `.mosaic`, `.split`, `.rail`, `.hero-split`, `.newsletter-panel`, `.footer-inner` all collapse | PASS — 1080px breakpoint collapses multi-column layouts to 2 columns; 680px collapses to 1 |
| Fixed-column grids covered | Added at this pass: `.grid`, `.grid.three`, `.steps`, `.metrics` now fold to 2 columns at ≤1080px; hero `h1` sizes step down at ≤1080px and ≤680px |
| Fluid grids | `.grid.auto` and `.products-grid` use `auto-fit` / `auto-fill` with `minmax()`, so they reflow without breakpoints |
| Stage 10 blocks | Padding and control grids collapse at ≤680px |
| Mobile menu | `.menu-toggle` appears ≤1080px; nav and company map become vertical panels; header CTA becomes full-width at ≤680px |
| Viewport meta | Present on every page (one exempt artefact: the email signature fragment) |

**Not verified:** real-device rendering. See §4.

### 2.4 Accessibility (static)

| Check | Result |
|---|---|
| Exactly one `<h1>` per page | PASS on all pages; the only exception is `public/assets/email/tayoca-founder-signature.html`, an email-signature fragment that is deliberately not a page |
| No heading-level skips | **Fixed at this pass.** Five pages jumped `h1 → h3` (`404.html`, `results.html`, `trust.html`, and the two withdrawn-narrative articles). Those leading card headings are now `h2`, with CSS added so `.card h2` / `.article-card h2` inherit the `h3` type scale |
| `alt` on every image | PASS — 64 images, 0 missing `alt` |
| Language declared | PASS — `lang` present on every page except the email fragment |
| Form controls labelled | PASS — 22 controls across 6 forms; every control is either wrapped by its `<label>`, has `aria-label`, or is a submit button whose `value` is its accessible name. **Fixed at this pass:** the newsletter email input on `blog/n8n-mcp-kubernetes.html` now has `aria-label="Email address for the Operator Brief"` |
| Menu toggle | `aria-expanded`, `aria-controls` and a dynamic `aria-label`; outside-click and Escape close added |
| Reduced motion | `@media(prefers-reduced-motion:reduce)` disables transitions and animations and forces revealed content visible |
| Progressive enhancement | The reveal observer only hides content when JS is running (`html.has-reveal`); if `tayoca-site.js` fails, all content stays visible |
| Focus visibility | `:focus-visible` styles defined in the shell |
| Colour contrast | **Fixed:** an inherited dark-on-dark defect on `public/community/websites/index.html` (the application card carried dark-scoped copy on a dark surface). The card is now warm paper with dark ink. Otherwise the palette is the near-black/warm-paper system with ink-on-paper and light-on-dark pairings |

### 2.5 Preserved contracts

| Contract | Result |
|---|---|
| Operator Brief archive wrapper, `data-operator-brief-archive`, `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->`, approved issue text | PASS — marker count `1`, attribute count `1`; the archive body is byte-identical to canonical `main` |
| Operator Brief subscribe + unsubscribe webhooks, honeypot `website`, consent field | PASS |
| Assessment form and `data-assessment` cards | PASS (untouched) |
| Community Google Form URL and `data-google-form-cta` markers (`home`, `work`, `hero`, `apply_section`) | PASS |
| Review endpoint and fail-closed empty state | PASS (untouched) |
| `data-event` / `data-revenue-event` analytics hooks | PASS; one **additive** hook added: `operator_brief_archive_view` |
| GA4 + `/ga4.js` | PASS — 46 pages carry the measurement id; all 36 sitemap URLs covered |
| `product-ecosystem.json` | Untouched. The Stage 10 `stage10-*` CSS block is byte-identical to `main`; `products.html` hero copy matches the runtime-injected strings so there is no content jump |
| Global Site Settings | See §3 |
| Secrets | PASS — no high-confidence tracked secret material; no authorization material entered this workspace or any committed file |

### 2.6 Registries and claims

| Check | Result |
|---|---|
| `company-ecosystem.json` schema 2 | PASS — classification tuple present on every classified item; the disclosure firewall prevents `internal_only` / `not_published` items rendering publicly; withdrawn proof is isolated; live-runtime wording is enforced; the Control Center security finding is asserted `open` with no value present |
| `site-settings.json` schema 1 | PASS — values only; both arrays within the ≤12 limit (navigation 8, explore 8, connect 5) |
| Blocked-claim scan | PASS — the withdrawn `$216K` narrative stays withdrawn and is now labelled as such on `results.html`; no ROI/acceptance/money-back guarantee; no credential badges rendered on About |
| No invented customers, testimonials, revenue, uptime, headcount or partnerships | PASS by review; no such claim was introduced |

---

## 3. Global Site Settings — runtime behaviour verified

`public/tayoca-site.js` retains, unchanged:

- `safeHref()` (`http:`, `https:`, `mailto:`, `tel:`, root-relative; rejects `//` and `\`)
- `validLink()` (label + `href` required)
- `buildLinks()` / `buildFooterGroup()` (limit 12, invalid entries dropped)
- `applyFooter()` (replaces the first two `.footer-links` groups, removes extras)
- `applySiteSettings()` (validates `schemaVersion === 1`, applies brand/nav/CTA/footer)
- the `tayoca:site-settings` event
- the fail-safe path: if fetch fails, or status ≠ 200, or `schemaVersion` is wrong, or
  validation fails, the **static shell remains**

Verified structurally: the v3 footer uses `.footer-links` for exactly the two managed
groups and `.footer-col` for the three static directories, so a settings edit swaps the
managed groups and leaves the directories intact. The static shell is a complete,
valid, self-sufficient page in its own right.

**Not verified:** live load of the published blob through the Control Center. That is
runtime behaviour requiring the production environment.

---

## 4. What could not be checked in this workspace

| Item | Blocker | Where it must be run |
|---|---|---|
| Browser-rendered visual QA | No browser binary is installable here — Playwright/Chromium downloads are network-blocked and `apt-get` is unavailable | Canonical integrator, locally or in CI with a browser |
| `scripts/accessibility_browser_audit.cjs` (axe-core) | Same blocker | Canonical integrator |
| Real-device / viewport rendering | Same blocker | Canonical integrator |
| Production parity | Requires the deployed site | Canonical deployment pipeline, post-merge |
| Live Control Center settings round-trip | Requires production access | Canonical integration agent |
| Live n8n estate | No access, no credentials, and out of scope by instruction | Canonical Forgejo / n8n integration agent |

---

## 5. Fixes made during this QA pass

1. Heading-level skips on 5 pages → leading card headings promoted to `h2`; `.card h2`
   and `.article-card h2` added to the type scale.
2. `landing_ai-made-simple-page.html` had **no `h1`**, a duplicated skip link and a
   non-canonical `main` id → single skip link, `id="main"`, real `h1`.
3. Newsletter email input on `blog/n8n-mcp-kubernetes.html` → `aria-label`.
4. `public/assets/img/ontario-main-street.jpg` was orphaned → now used on the Work
   community section (all 10 editorial images are now referenced).
5. Responsive: `.grid`, `.grid.three`, `.steps`, `.metrics` collapse at ≤1080px; hero
   `h1` steps down at ≤1080px.
6. `scripts/validate_company_ecosystem.py` — three self-inflicted defects fixed so the
   validator tests the registry rather than its own wording: fragment-bearing evidence
   refs now resolve; directory-style public paths resolve to `index.html`; the Creator
   Prompter Studio "must not be described as nonexistent" guard now matches only the
   narrative fields so the literal value `not_found_on_github` is not mistaken for a
   "does not exist" claim.
