# Tayoca Control Plane — Integration Migration Plan & CMS Architecture Proposal

## 1. Migration principle

**Additive, not disruptive.** No canonical public path, form action, field name, webhook, feed format or archive marker changes in this redesign. Every integration contract in `00-discovery-audit.md` §4 (C1–C12) is preserved byte-identical where it touches automation.

## 2. What changes (and what does not)

### Changes (all additive)
| Change | Integration impact | Validation | Rollback |
|---|---|---|---|
| New page `/work.html` (portfolio) | None (new URL; added to sitemap + GA4) | static validator | remove file + sitemap entry |
| New registry `public/data/company-ecosystem.json` | None (no workflow consumes it yet; proposed gateway entity source) | new validator | remove file + validator |
| New validator + gate step | Forgejo CI gains one check | local run PASS | revert commit |
| Header/footer/nav markup on all pages | None (no workflow parses header markup) | link checker | per-page revert |
| `results.html` no longer links the withdrawn $216K narrative | None (no workflow dependency) | manual + link check | revert page |
| `about.html` metric tiles removed | None | manual | revert page |
| Visual system CSS (`site-shell.css` v2) | None (stage-10 classes preserved; `.card`, `.eyebrow`, `.button`, `.form*` contracts kept for operator-brief archive inserts and growth-os.js) | validators + archive contract test | revert CSS |

### Unchanged (contracts, byte-identical where automation-touching)
- `assessments.html` form → `webhook/tayoca/growth/assessment` (fields, `data-tayoca-form`, consent)
- `operator-brief.html` subscribe/unsubscribe forms (incl. `website` honeypot field and consent checkbox)
- `reviews.html` → `webhook/tayoca/reviews/public` GET
- `operator-brief-archive.html` → `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->` marker + `<section class="section"><div class="container">` wrapper + `card/eyebrow/button` classes in generated issue markup
- Community Google Form URL + `data-google-form-cta` markers
- `product-ecosystem.json` stage-10 registry; `tayoca-site.js` markers; `site-shell.css` stage-10 classes
- All canonical URLs, `vercel.json` redirects, `_redirects`, `products-feed.csv`, `robots.txt` sitemap reference
- GA4 measurement ID + `/ga4.js` on every sitemap page; `data-event` taxonomy on retained CTAs

## 3. Content-domain & source-of-truth model (proposed end state)

| Domain | Entities | Source of truth | Consumed by |
|---|---|---|---|
| Company | company, practices, founder | `public/data/company-ecosystem.json` | public site, RAG, editorial desk |
| Portfolio | owned products, ventures, client builds, community initiatives, publications, experiments, internal systems | `company-ecosystem.json` (metadata) + canonical pages/articles (bodies) | public site, growth reporting |
| Commercial catalogue | products, offers, pricing, next actions | `product-ecosystem.json` (locked stage-10) | products/services/assessments/sivanta pages, verified-review flywheel |
| Editorial | articles, categories, featured flags | blog HTML + `company-ecosystem.json` insights metadata | blog index, editorial campaign selection |
| Newsletter | issues, archive, corrections | archive HTML (marker insert) + issue metadata (future: `data/operator-brief-issues.json`) | Operator Brief workflow, archive page |
| Community | initiatives, rounds, slots, intake | `company-ecosystem.json` + Google Form | community page, intake bridge |
| Trust/evidence | standards, verification status, reviews | trust/results pages + reviews webhook | trust surfaces, review flywheel |
| Media | covers, previews, OG images, editorial imagery | `public/assets/**` + (proposed) `data/media.json` | all surfaces, gateway image uploads |
| Navigation/SEO | nav, footer, meta, OG | per-page HTML (today) → proposed `data/site-config.json` | all surfaces, CMS gateway |

## 4. CMS/content architecture proposal (file-backed, Git-backed — no DB required)

The gateway should evolve from "arbitrary HTML file mutations" to **entity-aware, schema-validated operations** while remaining file-backed:

1. **Entity registry layer**: the new `company-ecosystem.json` (and existing `product-ecosystem.json`) become the gateway's entity index. Gateway actions become `entity:list/get/create/update` keyed by entity kind + slug, validated against JSON Schema before any Forgejo write.
2. **Schema files**: add JSON Schemas under `platform/contracts/` for `company-ecosystem` (mirroring existing `event-envelope.schema.json` pattern).
3. **Rendered pages stay canonical**: pages remain static HTML in Git; the registry is metadata + state, not a second render source. No divergence risk by construction.
4. **Previewability**: every gateway write lands on a branch/PR in Forgejo; preview via branch deployment before merge (existing branch/PR flow).
5. **Media**: gateway image uploads remain confined to controlled paths (`public/assets/**`), with a `data/media.json` index entry per upload (alt text, kind, usage) so images become entities too.
6. **Navigation/footer**: migrate to `data/site-config.json` consumed by a tiny static generator OR keep per-page HTML + gateway bulk-edit action for nav/footer blocks (single-file edit, committed, reviewable). Recommend the latter for now (zero build step), with `site-config.json` as the evolution path.
7. **Migration path**: (a) ship registries + validators; (b) gateway reads registries (no write); (c) gateway entity-write actions behind approval; (d) optional renderer later. Each step independently reversible.

## 5. Secret/authentication remediation plan

### 5.1 Repository posture (already in place, continue)
- No secrets in the site repository; `.env*` tracked-file ban is CI-enforced; n8n workflow exports are sanitized and bind logical credential names at runtime; the public site has zero write access to n8n.
- Add: workflow-export hygiene check in `automation/n8n/tests` (reject exports containing credential IDs, `apiKey`-like values or token patterns) to prevent regressions.

### 5.2 Runtime remediation (documented requirement — authorised control plane only)
A live Control Center inspection identified **authorization material embedded in workflow code**. This workspace does not reproduce, retrieve or expose the value. Required remediation, executed through the authorised control plane:

1. **Migrate** the value to n8n credential storage (or the designated secret manager); reference it by credential name only.
2. **Rotate** the existing value; the old value must stop being accepted.
3. **Identify affected callers**: every workflow, webhook, script or integration that consumes the value or its credential.
4. **Migrate callers safely** to the credential reference; no embedded-value fallback.
5. **Test authentication** on every affected path, including approval-gated and dead-letter paths.
6. **Rollback**: retain the prior credential version in the credential store with a documented recovery procedure.
7. **Certify**: record a negative test proving the old value is no longer accepted, and a scan proving no workflow code contains embedded authorization material.

### 5.3 Gateway
- Continue: gateway writes via bounded token scoped to the `public/**` allowlist; browser never holds gateway/n8n/Forgejo tokens (as implemented by the public `tayoca-control-center` console — server-side gateway only, fail-closed production control).
- The exact gateway path allowlist lives in the runtime gateway workflow; request the owner confirm it so `company-ecosystem.json` and `work.html` can be added to CMS-managed entities deliberately.

## 6. Observability & failure-handling recommendations

- Extend dead-letter allowlist whenever a workflow becomes active (explicit owner field).
- Add a `content_mutation` event (envelope schema) emitted by the gateway on every Forgejo content write → lands in the workflow-reliability ledger → visible in the control-plane view.
- Archive insert health check: CI validator asserts the marker exists exactly once in `operator-brief-archive.html` (added to `validate_static_site.py`-style checks in the new validator) so a workflow-generated page can never silently break the contract.

## 7. Execution boundary

All changes above that touch production n8n require the authorised control plane. This workspace delivers: repository-side contracts, schemas, validators, documentation and the UI proposal — nothing executes against production n8n.
