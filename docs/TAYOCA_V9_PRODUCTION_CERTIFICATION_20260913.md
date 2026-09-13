# Tayoca v9 Production Certification

Status: **CERTIFIED / CLOSED**

Certification date: **2026-09-13**

Roadmap phase: **Phase 1 — Production certification and cleanup**

## Certified production line

- Canonical Forgejo `main`: `2c2a9d4f14222c8de3f64259bfd866f686b58397`
- Canonical tree recorded by downstream mirror: `6e9dd33ce948bcb1f1d420631fbe07f4c7dcc5ed`
- GitHub deployment mirror: `89cc9c8f2d5f348f2cd9d6c30c889d95febbc8a6`
- Vercel production deployment: `dpl_8KXm2MuLxGggg2KVEiCHnqgRuoNA`
- Vercel state: `READY / PROMOTED`
- Production aliases verified on the deployment: `tayoca.com`, `www.tayoca.com`, project production alias, main-branch alias
- `www.tayoca.com` redirects to `tayoca.com`

## Canonical CI evidence

Current-main Forgejo runs for `2c2a9d4f14222c8de3f64259bfd866f686b58397`:

- run `#30559` / action `1357` — success
- run `#30560` / action `1358` — success
- run `#30561` / action `1359` — success
- deployment parity run `#30669` / action `1360` — success

## Scrapling live-browser certification

The previously blocked browser gate was re-run successfully through the first-class Scrapling connection in Composio on 2026-09-13.

Verified against `https://tayoca.com/` and representative production routes:

- homepage loaded successfully in an interactive browser
- initial theme state: `html[data-theme="light"]`
- theme control ARIA label initially: `Switch to dark theme`
- clicking `.theme-switch` changed the theme to `dark`
- ARIA label changed to `Switch to light theme`
- the dark preference persisted when navigating to `/services.html`
- `/assessments.html` rendered successfully
- `/operator-brief.html` rendered successfully
- `/products/aws-cost-optimization-playbook.html` rendered successfully
- dark theme remained persisted on the product detail route
- the disposable browser session was restored to light and closed after certification

No browser-tool security control, production protection setting, or Vercel protection setting was weakened to complete this certification.

## Route / public-shell observations

The live homepage exposed the expected v9 runtime assets and metadata, including:

- `/assets/css/tayoca-v9.css`
- `/tayoca-v9.js`
- `/v9-runtime-fixes.js`
- canonical metadata and social metadata
- live theme switch

The current public surface includes the privacy and terms routes added after the original roadmap lock. Their parent canonical revision is included in this certification line rather than treating the older roadmap-lock revision as the final production baseline.

## Cleanup status

The v9 migration-specific temporary branches and diagnostics previously identified in the rebrand state were removed. This certification does not classify unrelated historical operational branches as v9 migration residue.

## Phase verdict

All Phase 1 exit gates are satisfied:

- canonical revision identified
- downstream mirror identified
- promoted production deployment identified
- production aliases verified
- required current-main CI green
- representative live browser certification green
- no known v9 migration residue remains
- durable certification committed through canonical Forgejo

**Phase 1 is CLOSED. Phase 2 — Conversion and customer journey — becomes the active rebrand phase.**
