# Tayoca Arena Redesign — Discovery & Audit

Status: reviewable · Prepared for the `arena/01a04553-tayoca` workspace branch
Scope: public site (`public/**`), control-plane contracts (n8n / Growth OS / Forgejo), content model
Date: 2026-08-27

## 1. Company reality (from repository evidence)

Tayoca is a single engineering-led technology company with several business expressions, all documented in the repository:

| Expression | Evidence in repo | Public state |
|---|---|---|
| Client technology delivery & application development | `services.html`, `docs/positioning.md`, SiteSupply article | Active offers |
| AI / agents / workflow automation / RAG-LLMOps | `services.html`, `assessments.html`, blog articles | Active offers |
| Cloud economics / FinOps / technology value | `services.html`, `products/aws-cost-optimization-playbook.html`, docs | Active offers |
| Platform engineering / reliability / DevSecOps / Kubernetes / GitOps / observability | `services.html`, 8 operator playbooks, blog | Active offers |
| Owned software: **Sivanta** (conversation-led commerce platform) | `sivanta.html`, `product-ecosystem.json`, `data/sivanta-offers.md` | Active product, subscription |
| Venture/client build: **SiteSupply** (B2B construction procurement marketplace) | `blog/sitesupply-construction-procurement-marketplace.html` | In market, only surfaced as an article |
| Publications & learning products | 8 Gumroad operator playbooks (`product-ecosystem.json`), `products-feed.csv` | Active catalogue |
| Technical writing / editorial | 15 blog articles under `public/blog/**` | Active, inconsistently navigated |
| Newsletter: **The Operator Brief** | `operator-brief.html`, `operator-brief-archive.html` (1 approved issue, 2026-08-17), n8n workflow `Ug7hA8cXrrCIVYkI` | Buried in footer only |
| Community: **Free Website Initiative** (Round 01, 10 Ontario spots) | `community/websites/index.html`, n8n intake + Google Form bridge | Isolated page, not linked from main nav |
| Internal operating system (control plane) | `automation/n8n/workflow-registry.yaml`, `docs/workflow-reliability-and-recovery.yaml`, 5 active n8n workflows | Internal |

A candidate portfolio (Sivanta, SiteSupply, community initiative, Operator Brief, 8 publications) exists in the repository but has **no public portfolio surface** — the brief's "what Tayoca builds" question cannot be answered from the current homepage.

## 2. Live-site audit (tayoca.com, 2026-08-27)

The live site matches the repository snapshot. Verified live: homepage, robots.txt, sitemap; local snapshot used for deep audit.

### 2.1 Page inventory (canonical, in sitemap)

- Home `index.html` · Services · Assessments · Results · Products · About · Trust Center · Operator Brief · Operator Brief Archive · Reviews · Sivanta · Community Websites · Blog index + 15 articles · 8 product detail pages · 3 segment pages = 34 canonical URLs.
- Auxiliary (noindex): 404, review form, analytics, temitayo (digital business card), landing/l pages, functions.

### 2.2 Findings

**Structural / IA**
1. **Assessment-funnel-first homepage.** The homepage leads with three "decisions" and a "start an assessment" CTA; company identity, portfolio, publications, community and newsletter are absent or buried. The company is not identifiable as a builder.
2. **Three different navigation systems.** (a) `growth-os.css` shell (Services · Assessments · Results · Products · Insights · About) on home/services/assessments/results/trust/operator-brief/segments; (b) inline-styled header on `about.html` (Services · Products · Writing · About); (c) inline-styled headers on `sivanta.html`, `products.html`, `reviews.html`, `review.html` (own CSS, `nav-brand`/`nav-links`). Footers differ across all three groups.
3. **Broken/inconsistent internal nav targets.** Blog index header links `Insights → /insights.html` (301s to `/blog/`); its footer links `Writing`; other pages' nav has no blog entry at all; community and Operator Brief exist only in footers.
4. **No portfolio/work surface.** SiteSupply exists only as a blog article. Sivanta is filed under "Products". No category for ventures, community initiatives, experiments or internal systems.
5. **About page is thin** and contains unsupported metric claims ("Deploy to prod ≤15 min", "MTTR ≤5 min", "Cloud bill ≤80% baseline") that are not traceable to any evidence ledger — these should not survive the redesign (see owner-confirmation list).
6. **Results page cites the withdrawn case narrative.** Homepage discloses that the quantified AWS case-study narrative "has been withdrawn from proof use while that evidence is re-verified", yet `results.html` links to `blog/how-we-saved-216k-on-aws-in-90-days.html` as a result. This contradicts the evidence standard.
7. **Duplicate/legacy content**: two "$216K" articles (one withdrawn from proof use), two `landing_ai-made-simple*` landers, four `l/*` Tailwind-CDN landing pages, legacy product landers (redirected). `landing_ai-made-simple.html` and `l/*` are indexable-without-canonical (validator does not flag them, but they are stale surfaces).
8. **No structured company-level content model.** Only `product-ecosystem.json` (commercial taxonomy, stage-10 locked). Portfolio, publications, community, services and insights have no structured registry; the CMS cannot reason about them as entities.

**Visual / design**
9. Two conflicting visual systems (growth-os shell vs. inline legacy pages); `about.html`, `sivanta.html`, `products.html`, `reviews.html` each style their own header/footer.
10. No photography/imagery anywhere on canonical pages (all text cards); product covers exist (8 × 512px PNG) but are used only on legacy landers, not on products/portfolio surfaces.
11. Typography system is sound (Sora/Inter/JetBrains Mono) and the amber-on-near-black identity is defensible; it is applied inconsistently.

**Technical / contract health**
12. CI validators pass locally (static-site, analytics coverage, product ecosystem) — verified by running all three scripts (see QA report).
13. Forms: assessment and Operator Brief post JSON to n8n webhooks through `growth-os.js` (contract detailed in §4). Reviews page GETs `n8n.tca-infraforge.site/webhook/tayoca/reviews/public`. Community intake uses a Google Form (bridged by n8n).
14. `operator-brief-archive.html` has a hard CMS marker contract: `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->` inside `<section class="section"><div class="container">`; the Operator Brief workflow inserts approved issue HTML at that marker. Redesign must preserve marker, wrapper and the `card`/`eyebrow`/`button` classes used by generated markup.
15. `product-ecosystem.json` is stage-10 locked by `scripts/validate_product_ecosystem.py` (exact families/counts/markers in `tayoca-site.js` and `site-shell.css`). It cannot be reshaped casually; a company-level model must be additive.
16. No secrets found in tracked files (validators enforce `.env` exclusion; n8n exports are sanitized and bind credentials at runtime). No production n8n credentials requested or used.
17. `vercel.json` CSP: `base-uri 'self'; object-src 'none'; frame-ancestors 'none'` — keep; images/scripts from self are fine; Google Fonts/gtag are allowlisted by absence of `default-src` (no default-src restriction exists).
18. Every sitemap page must include GA4 measurement ID `G-G4QC90QNXW` and `/ga4.js` (CI-enforced).

## 3. Content and product model gaps

- `product-ecosystem.json` models only commercial families (Operator Tools, Operator Playbooks, Executive Assessments, Managed Operations). It explicitly cannot hold client builds, ventures, community initiatives, publications-as-portfolio or internal systems without mislabelling them.
- Blog articles carry no category/type metadata beyond free-text tags; the blog index is a flat 15-card list with duplicate-sounding cards (two $216K articles, two readiness checklists).
- Newsletter issues are plain HTML inserted into the archive; no machine-readable issue index exists.
- Community initiative has no structured record (slots, round, status, intake).
- SiteSupply has no product/portfolio record; its only canonical source is the article.

## 4. Website ↔ control-plane dependency map (contracts to preserve)

| # | Surface | Contract | Owner workflow | Redesign rule |
|---|---|---|---|---|
| C1 | `/assessments.html` form | POST JSON → `https://n8n.tca-infraforge.site/webhook/tayoca/growth/assessment`; fields `email, company, role, segment, assessment, urgency, evidence_readiness, context` + `source_page`, `utm_*`, `referrer` appended by `growth-os.js`; `data-tayoca-form="assessment_request"` | Growth OS \| Assessment & Operator Brief Intake (`V28T575q7GSRFOti`) | Preserve exact form action, field names, `data-tayoca-form`, consent semantics |
| C2 | `/operator-brief.html` subscribe form | POST JSON → `.../webhook/tayoca/growth/operator-brief`; fields `email, interest, consent, website` (honeypot) | same intake workflow | Preserve exact action/fields incl. honeypot + consent checkbox |
| C3 | `/operator-brief.html` unsubscribe form | POST JSON → `.../webhook/tayoca/growth/operator-brief/unsubscribe` | same intake workflow | Preserve |
| C4 | `/reviews.html` | GET `https://n8n.tca-infraforge.site/webhook/tayoca/reviews/public` (JSON list; verification hold upstream) | Verified Review & Trust Flywheel (`ZZDXWFKiPnzeKtNr`) | Preserve endpoint; keep fail-closed rendering |
| C5 | `/operator-brief-archive.html` | `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->` inside `<section class="section"><div class="container">`; inserted markup uses `card`, `eyebrow`, `button small`, `data-section`, `data-issue-id` classes | Growth OS \| Operator Brief (`Ug7hA8cXrrCIVYkI`) | Preserve marker + wrapper + class contract |
| C6 | `community/websites` | Google Form URL `https://docs.google.com/forms/d/e/1FAIpQLSeTyWlIZzI8uz4zNRiLXaNdIAw3NuPDIRxnuemwIb7c-IW64Q/viewform` with `data-google-form-cta` markers | Community Website Initiative Intake + Google Form Bridge | Keep the same form URL; keep `data-google-form-cta` event markers |
| C7 | `product-ecosystem.json` + `tayoca-site.js` + `site-shell.css` | Stage-10 registry + renderer + styles (markers enforced by CI) | Growth OS products catalogue / editorial generation references | Do not reshape; add company-level registry separately |
| C8 | `/products/*.html` pages | Must load `/tayoca-site.js` and `/assets/css/site-shell.css` (CI); Gumroad `next_action` links | Verified Review flywheel (Gumroad sale verification) | Preserve page set (8 files) and links |
| C9 | Shared runtime pages (`products.html`, `assessments.html`, `services.html`, `sivanta.html`) | Must load `/tayoca-site.js` (CI) | — | Preserve |
| C10 | Analytics | Every sitemap page must contain `G-G4QC90QNXW` and `/ga4.js` (CI); `data-event` taxonomy consumed by `growth-os.js`/`revenue-events.js` | Executive reporting (GSC + first-party) | Keep GA4 markers and `data-event` names on retained CTAs |
| C11 | `products-feed.csv` | Machine-readable product feed (robots-disallowed) | Growth OS (feed consumption) | Keep file and format |
| C12 | Paths/URLs | Canonical URLs and sitemap; `vercel.json` permanent redirects (`/blog.html`, `/writing.html`, `/insights.html`, `/assessment`, legacy landers, `/l/*`) | Search Console / editorial distribution (canonical + UTM contracts) | Do not move canonical paths; redirects unchanged |

## 5. Control-plane inventory (from `workflow-registry.yaml` + docs)

**Active production workflows (5):** Assessment & Operator Brief Intake; Verified Review & Trust Flywheel; Demand Engine & Revenue Command Center; Operator Brief; Infobip Inbound & Delivery Correlation — plus the Ops Production Failure & Dead Letter monitor (`iX0ehWNElYUfdCQZ`, 5-minute scan of exactly those five).

**Inactive/legacy (4):** WhatsApp Assistant (`GnOCF3gFqMqM6UxF`, legacy_inactive), Reputation Planning Kernel (`XbDHeVK66snphcYV`, inactive_library_validated), Tayoca Core Event Ingress (inactive_library_validated), Reputation Due Campaign Scheduler (inactive_library_validated). These are library assets, not production architecture.

**Ledgers (documented in Growth OS docs):** editorial opportunity ledger, campaign ledger, content queue, sales, reviews, review requests, revenue pipeline, proposals, objections, attribution, KPI history, workflow reliability ledger.

**Gateway:** "Tayoca Control Center | Unified Gateway v6.1" — bounded n8n gateway for workflow reads/writes and canonical Forgejo content reads/writes (list/get/create/update/delete on selected `public/**` paths; controlled image upload paths).

## 6. Benchmark research (market scan, Aug 2026)

Studied: thoughtbot (studio: portfolio + open source + playbooks), Thoughtworks (consultancy: insights as first-class property), Fly.io (warm near-black canvas, mono chrome, editorial-as-brand, evidence via real shell snippets), Tailscale (warm paper + restrained accent, technical labels), Framework (mission + product transparency), TRC / Dimensional Innovations (portfolio-first discovery, quantified results engine), Engineers Without Borders (human/community-led trust), plus generic SaaS-template anti-patterns (dark navy + gradient blobs).

**Principles extracted:**
1. Identity statement first; catalogue second (homepage must answer "what kind of company is this" before "buy").
2. Portfolio-first discovery: real things the company made, with imagery, as the credibility engine.
3. Editorial/publication properties are brand assets (blog + newsletter at nav level, not footer).
4. Community work is identity, not CSR decoration.
5. Numbers only where traceable; absence of numbers is a feature when disclosed ("we publish results only when traceable").
6. Warm near-black + a single hot accent + mono technical labels reads "engineering company", not "AI SaaS template".
7. Evidence (real covers, real article counts, real issue archives, real open intake) beats decorative dashboards.

## 7. Mandate for the redesign

- Introduce a company-level IA and content model **additively** (no contract breakage).
- One coherent visual system across all public surfaces.
- Build a portfolio surface from verifiable evidence only.
- Fix the results/evidence contradiction.
- Keep the control plane working: forms, webhooks, archive insert, feeds, analytics, canonical URLs.
- Document every change and anything needing owner confirmation.

## 8. Expanded company discovery (GitHub ecosystem scan, 2026-08-27)

A broader scan of `github.com/temitayocharles` and related accounts/orgs (`Emife1`, `zenhosta`, `zernio-dev`) was performed after the initial audit. Full inventory with classification states: `10-company-discovery-inventory.md`.

### Key findings

1. **Account landscape**: `temitayocharles` has 4 public repos — all forks or community builds: `9drive` (fork of `zenhosta/9drive`), `zernflow` (fork of `zernio-dev/zernflow`), `tayoca-control-center` (fork of `janmaaarc/n8n-ops`), `abiding-place-fellowship-cms` — plus the private `tayoca` site mirror. Related accounts: `Emife1` (SiteSupply repo; Hermes agent workspace crediting the founder; n8n Render runtime; portfolio sites), `zenhosta` (9Drive source + Indonesian e-commerce apps), `zernio-dev` (Zernio: social/messaging API company, 26 repos).
2. **SiteSupply corroborated**: public repo (`Emife1/sitesupply`) with production surfaces (quote intake, supplier onboarding, workspace), Neon Postgres + Vercel serverless, and live sites `sitesupply.cois.site` (already referenced in Tayoca's article) and `sitesupply.vercel.app` (README). README explicitly marks workspace pricing/supplier-fit values as demonstration data.
3. **Zernio and 9Drive are separate ecosystems**, mirrored on the founder's account as forks — not evidence of Tayoca ownership. They are inventoried as `owner_confirmation_required` and are **not** published on tayoca.com.
4. **Creator Prompter**: named in the company brief; no repository or public surface found in any accessible account. Owner confirmation required; nothing published.
5. **Sivanta and n8n-control-plane repositories**: not found under accessible accounts (probes 404). Sivanta remains published from its page + offers doc only.
6. **Hermes Agent workspace**: public but empty placeholder repo crediting `@temitayocharles`; no content to publish.
7. **Abiding Place Fellowship website**: public repo + live site; likely community/client work (Shelburne is inside the Free Website Initiative geography) — `client_disclosure_unknown`, church context requires explicit consent before any reference.
8. **Control-plane reality check**: `automation/n8n/workflow-registry.yaml` is a repository-declared snapshot, not the authoritative runtime state; the live n8n estate is materially broader (see `04` and `10`). A live Control Center inspection found authorization material embedded in workflow code — remediation is documented in `05-control-plane-migration-plan.md` §5; the value is never reproduced.

### Privacy/disclosure firewall applied

- Only public repos are named in the inventory; the only private repo referenced is `temitayocharles/tayoca` itself.
- No customer, employer, credential, token, topology or personal data from any private surface is published.
- Nothing from the founder-ecosystem scan was added to the public website; every candidate outside the published Tayoca model is in the owner-confirmation register (`09`).
