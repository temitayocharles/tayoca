# Tayoca Arena Redesign — Migration Notes (paths, content contracts)

Applies to the `arena/01a04553-tayoca` branch. Reconcile into canonical Forgejo after review.

## 1. Path & URL changes

| Item | Change | Migration/rollback |
|---|---|---|
| `/work.html` | **New** portfolio page (indexable; added to sitemap; GA4 markers included) | Additive. Rollback: delete file + sitemap entry |
| `/` (home) | Redesigned content; canonical URL unchanged | Revert commit |
| `/about.html` | Redesigned; unsupported metric tiles removed; nav/CTA consistent | Revert commit |
| `/results.html` | No longer cites the withdrawn $216K narrative as evidence | Revert commit |
| All other canonical paths | **Unchanged** | — |

No redirects changed; `vercel.json` and `_redirects` untouched.

## 2. Content contracts (must be preserved — verified in this branch)

- Assessment form → `https://n8n.tca-infraforge.site/webhook/tayoca/growth/assessment`; fields `email, company, role, segment, assessment, urgency, evidence_readiness, context`; `data-tayoca-form="assessment_request"`; JSON POST via `growth-os.js` (which appends `source_page`, `utm_*`, `referrer`). **Unchanged.**
- Operator Brief subscribe → `.../webhook/tayoca/growth/operator-brief`; fields `email, interest, consent, website` (honeypot). **Unchanged.**
- Operator Brief unsubscribe → `.../webhook/tayoca/growth/operator-brief/unsubscribe`; field `email`. **Unchanged.**
- Reviews → GET `https://n8n.tca-infraforge.site/webhook/tayoca/reviews/public`. **Unchanged.**
- Archive insert marker `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->` inside `<section class="section"><div class="container">` — **present exactly once**, wrapper preserved; generated issue markup classes (`card`, `eyebrow`, `button small`, `data-section`, `data-issue-id`) still styled (growth-os.css retained on that page).
- Community Google Form URL + `data-google-form-cta="hero|apply_section"` markers. **Unchanged.**
- `product-ecosystem.json` (stage 10), `tayoca-site.js` markers, `site-shell.css` stage-10 classes, `products-feed.csv`. **Unchanged.**
- GA4 `G-G4QC90QNXW` + `/ga4.js` on every sitemap page. **Retained.**
- `data-event` attribute names on retained CTAs (header_assessment, hero_*, product_detail_click, operator_brief_*, assessment_request_submit, etc.). **Retained.**

## 3. New repository objects

- `public/data/company-ecosystem.json` — company-level registry (portfolio, publications, insights, community, services metadata). Not consumed by any n8n workflow yet; proposed as the CMS gateway's entity index (see `05`).
- `scripts/validate_company_ecosystem.py` — new CI step added to `.forgejo/workflows/static-quality.yml`.
- `public/assets/img/**` — new editorial/artefact imagery.
- `public/assets/css/site-shell.css` — extended to the canonical v2 system (stage-10 classes intact).
- Product detail pages (8): twitter:card meta added (missing pre-redesign); analytics.html: dark-theme contrast fixes applied to the pre-existing light-text/dark-card mismatch; landers (`l/*`, `landing_ai-made-simple*`) now `noindex` and use the canonical shell — no automation depends on their indexing or markup.
- Google Fonts links added to article/lander pages that lacked them (visual consistency only).
- `public/data/company-ecosystem.json` gains a `classification` state on every portfolio item and a `related_ecosystem` section (public founder-ecosystem projects, `published_on_site: false`). Validator enforces both. No CMS workflow consumes the registry yet; it is additive.
- **Discovery-scan note:** `automation/n8n/workflow-registry.yaml` is a repository-declared snapshot, not authoritative runtime state; no workflow changes were made from it. Embedded-authorization-material remediation is documented in `05-control-plane-migration-plan.md` §5.2 (authorised control plane executes; nothing in this branch touches production n8n).

## 4. Validation & rollback procedure (for the authorised control plane)

1. Run: `python3 scripts/validate_static_site.py && python3 scripts/validate_analytics_coverage.py && python3 scripts/validate_product_ecosystem.py && python3 scripts/validate_company_ecosystem.py` → all PASS.
2. Confirm archive marker count == 1 and form actions/fields byte-identical (grep checks in QA report).
3. Forgejo CI green on the reconciled branch; mirror to GitHub; Vercel deploy from GitHub `main`; verify `READY/PROMOTED` + production aliases (existing change flow).
4. **Rollback:** revert the branch merge in Forgejo (or revert individual commits); re-run validators; redeploy. Pre-merge snapshot = `main` tip; no destructive migrations run (all additive).
