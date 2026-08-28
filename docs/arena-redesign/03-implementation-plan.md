# Tayoca Arena Redesign — Implementation Plan (staged, reviewable)

All work on branch `arena/01a04553-tayoca`. Nothing merges into GitHub `main`; the branch is the review vehicle for reconciliation into canonical Forgejo.

## Stage 0 — Discovery (done)
Repository audit, live-site audit, contract mapping, market research. → `00-discovery-audit.md`, `01-information-architecture.md`, `02-visual-direction.md`.

## Stage 1 — Foundation: design system + data model
1. Extend `public/assets/css/site-shell.css` → canonical v2 system (tokens, header, footer, components) while preserving every stage-10 marker class.
2. Extend `public/tayoca-site.js` (menu, year, active states) preserving all stage-10 markers.
3. Add `public/data/company-ecosystem.json` (company-level registry).
4. Add `scripts/validate_company_ecosystem.py`; register it in `.forgejo/workflows/static-quality.yml` (extending the existing gate, not replacing it).
5. Validate: all three existing validators + new validator pass locally.

**Rollback:** revert Stage-1 commits; site remains on current shell (new CSS is additive; pages not yet converted).

## Stage 2 — Flagship surfaces (hand-built)
Home, About, Work (new), Products, Services, Assessments, Results, Trust, Operator Brief, Operator Brief Archive, Insights (blog index), Community, Sivanta, Segments ×3, Reviews, Review, Analytics, 404, temitayo.

**Contracts enforced while building:** C1–C12 from the discovery doc (forms untouched, archive insert marker preserved, GA4 + canonical + data-event retention, stage-10 renderer intact).

## Stage 3 — Long-tail surfaces (scripted shell swap)
15 blog articles + 8 product detail pages + 4 `/l/` pages: swap header/footer/nav to the canonical shell; article/product bodies untouched.

## Stage 4 — Assets
Generate editorial/artefact imagery into `public/assets/img/**` (hero desk, about workshop, community storefront, Sivanta concept diagram, SiteSupply motif, Operator Brief motif, work-page category artwork). Reuse existing covers/previews/OG images.

## Stage 5 — QA & documentation
1. Run all validators; run a full internal-link/fragment/metadata checker over every HTML page.
2. Check desktop/mobile layouts, keyboard focus, contrast, overflow, duplicate sections, broken assets, OG/JSON-LD, sitemap coverage.
3. Write `08-qa-report.md`, `07-migration-notes.md`, `09-owner-confirmation.md`, control-plane docs (`04`, `05`, `06`).
4. Coherent commits per stage; final branch push for review.

## Validation criteria
- `python3 scripts/validate_static_site.py` → PASS
- `python3 scripts/validate_analytics_coverage.py` → PASS
- `python3 scripts/validate_product_ecosystem.py` → PASS
- `python3 scripts/validate_company_ecosystem.py` → PASS
- Custom link checker → 0 broken internal links/fragments on canonical pages
- All n8n form actions/field names byte-identical; archive insert marker present exactly once
- Sitemap covers every indexable canonical page (incl. new `/work.html`)

## Change control & rollback
- Every stage is a separate commit series; each commit keeps the site deployable (validators green per stage).
- If a contract breaks: revert that stage's commits (git revert), re-run validators, confirm live surfaces unaffected.
- Production reconciliation: owner reviews branch, merges into canonical Forgejo (certified there), mirrors to GitHub, Vercel deploys from GitHub `main`. No direct merge into GitHub `main` from this workspace.
