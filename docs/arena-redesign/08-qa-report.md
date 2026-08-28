# Tayoca Arena Redesign — QA Report

Date: 2026-08-27 · Branch: `arena/01a04553-tayoca` · Scope: public site + contract integrity

## 1. Automated gates (all PASS)

| Check | Command | Result |
|---|---|---|
| Static package + sitemap integrity | `python3 scripts/validate_static_site.py` | PASS — 40 sitemap URLs, all resolve, unique, canonical-origin; every indexable canonical page present; 404 noindex; robots sitemap reference OK |
| Analytics coverage | `python3 scripts/validate_analytics_coverage.py` | PASS — GA4 `G-G4QC90QNXW` + `/ga4.js` on all 40 canonical pages |
| Stage-10 product ecosystem | `python3 scripts/validate_product_ecosystem.py` | PASS — 4 families / 16 products / 8 controls each / 8 playbook pages / renderer + shell markers intact |
| Company ecosystem (new) | `python3 scripts/validate_company_ecosystem.py` | PASS — identity, 3 practices, 6 portfolio items, 8 publications, 15 insights, newsletter, community, evidence; withdrawn-proof isolation holds |
| Syntax | `python3 -m py_compile` on all four validators + new checker | PASS |

## 2. Contract checks (PASS)

`python3 scripts/check_links.py` — 51 HTML files checked:

- **Internal links**: every internal `href` resolves to a real file (query strings handled — assessment prefill/campaign contract); **0 broken links**.
- **Fragments**: every in-page fragment target exists on the target page.
- **Assets**: every `img/link/script` source resolves; 0 missing assets.
- **Forms (n8n contracts)**: `assessment_request`, `operator_brief`, `operator_brief_unsubscribe` — actions and required field sets byte-stable (verified per contract in `00-discovery-audit.md` §4 C1–C3).
- **Archive insert**: `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->` present exactly once, inside the `<section class="section band"><div class="container">` wrapper; the approved 2026-08-17 issue markup retained verbatim.
- **Community intake**: Google Form URL present with `data-google-form-cta="hero"` and `"apply_section"` markers.
- **Reviews**: public endpoint `webhook/tayoca/reviews/public` present in `reviews.html`; fail-closed rendering preserved.
- **Duplicate IDs**: none (attribute-aware scan across all pages).
- **Metadata sweep**: all 40 canonical URLs have title, meta description, canonical, og:title, og:image, twitter:card, GA4 markers, and matching canonical URLs. (twitter:card was missing on the 8 product pages — added. `/community/websites` resolves as directory index — OK.)

## 3. Truthfulness / evidence posture

- Homepage proof section retains the disclosure that the quantified AWS case-study narrative is withdrawn from proof use.
- `results.html` no longer cites either $216K article as evidence; both blog cards now carry a "Narrative withdrawn from proof use" tag.
- `/work.html` portfolio entries carry kind + status from `company-ecosystem.json`; nothing unverified is presented; SiteSupply carries a disclosure note.
- Sivanta visual is labelled "Interface concept — not a production screenshot".
- No invented customers, testimonials, revenue, savings, certifications, partners or uptime claims added anywhere.
- About-page metric tiles ("Deploy ≤15 min" etc.) removed as untraceable (owner list item 2).

## 4. Visual / UX review (static, by component)

- **One shell everywhere**: canonical header (Services · Work · Products · Insights · Community · About) + CTA and 5-column footer now on every page including all 15 articles, 8 product pages, landers.
- **Contrast**: amber `#f97316` on `#0d0d0d` ≈ 6.6:1; body `#d8d5d0` ≈ 12:1; buttons dark-text-on-amber ≈ 8:1. Analytics dashboard dark-text-on-dark-card mismatch (pre-existing) fixed with dark-theme overrides.
- **Responsive**: breakpoints 1020px / 680px carried through the shell (header wraps, menu toggles, grids stack, hero-split and newsletter panels collapse to one column, stat rows 4→2→1, footer stacks).
- **Keyboard/AT**: skip-link on all pages, `aria-current="page"` on nav, focus-visible outlines, labelled forms, `role="status"/"alert"` form responses via unchanged `growth-os.js`.
- **Motion**: hover lifts + focus rings only; `prefers-reduced-motion: reduce` disables transitions globally.
- **Images**: all editorial images generated in-repo (`public/assets/img/**`) with `alt` text, aspect-ratio boxes, `loading="lazy"` except hero.
- **Known limitation**: no headless browser in the sandbox — layout was verified by component/CSS review, contract checks and served-HTML inspection, not by pixel screenshots. A browser pass of the live preview is recommended before reconciliation (see §6).

## 5. Performance notes

- Zero new JS/CSS frameworks; two stylesheets + existing deferred scripts; images sized/compressed via generator; Google Fonts preconnected.
- New pages add ~1 image each (lazy-loaded below the fold); home hero image is 16:10 with `loading="eager"`.
- No third-party blockers; CSP in `vercel.json` unchanged.

## 6. Discovery-scan QA (expanded GitHub ecosystem scan)

- **No private-repository leakage**: every repository named in `10-company-discovery-inventory.md`, the audit and the registry's `related_ecosystem` is **public**. The only private repo referenced is `temitayocharles/tayoca` (the site repository itself). No credentials, tokens, env values, customer/employer data or private topology appear anywhere in the branch.
- **No unsupported claims added**: SiteSupply card on `/work.html` unchanged (article = canonical source; repo + live sites corroborate only what the article already states). Nothing from the founder-ecosystem scan (Zernio, 9Drive, zenhosta, Abiding Place, Hermes) was published on tayoca.com.
- **Registry classification**: every portfolio item now carries a `classification` state; `related_ecosystem` entries are validated to be `published_on_site: false` and https-evidenced (firewall rule enforced by `validate_company_ecosystem.py`).
- **Control-plane truthfulness**: docs now distinguish repository-declared workflow state from live runtime state; no rationalisation is proposed from the stale registry; the embedded-authorization-material remediation is documented without reproducing the value.
- Re-ran all five checks after the discovery edits: PASS (see §1).

## 7. Residual items for owner/control plane

1. Browser-level visual pass on preview (desktop + mobile) before reconciliation.
2. Confirm the items in `00-discovery-audit.md` about gateway allowlist / feed provenance (owner list items 8–10).
3. `l/*` landers and `landing_ai-made-simple*` are now noindex with the canonical shell; recommend permanent removal after 301 health confirmation (owner list item 7).
4. Execute owner decisions for discovery items 12–24 in `09-owner-confirmation.md` before any of the inventoried founder-ecosystem projects appear on tayoca.com.
5. Authorised control plane: live-runtime workflow reconciliation (`04` §6) and embedded-authorization-material remediation (`05` §5.2).
