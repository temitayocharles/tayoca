# Control-plane compatibility report

Scope: **compatibility only.** This branch contains **no** Control Center redesign,
rebuild, replacement, second CMS, authentication work, production n8n change, or
credential request.

> GitHub is the external design workspace. Final acceptance and production
> reconciliation must occur through canonical Forgejo.

---

## 1. Current state (as recorded on canonical `main`)

| Field | Value |
|---|---|
| Status | `completed_production_deployed` |
| URL | `https://control.tayoca.com` |
| Production line | `6cae0f71d7b60cec62c783de925780835075e96c` |
| Deployment | `dpl_5xGR3Lm58YdNKU3vUJD5Ds8ZudsJ` — `READY_PROMOTED` |
| Gateway workflow | `gif5P0MDI6WrceAP` — "Tayoca Control Center | Unified Gateway v6.1" |
| Authentication | Cloudflare Access only; no browser credentials exposed |
| Recovery | Global Site Settings restore exercised; exact original blob restored |
| Program rule | `do_not_reopen_without_specific_defect_or_new_feature` |
| Arena rule | `preserve_compatibility_but_do_not_redesign_or_replace_control_center` |

Source: `docs/control-center-status-note.yaml`,
`docs/control-center-production-handoff-20260828.md`.

**This branch complies.** No Control Center file was redesigned, renamed or removed.
The program rule "do not reopen without a specific defect or new feature" means this
branch reports compatibility findings rather than opening work.

Note on authority: `docs/tayoca-program-state.yaml` still says
`control_center_cms: partial`, which is **stale** relative to the status note above.
The status note is newer evidence; a status correction is proposed in
`00-reconciliation-report.md §9` but **not applied** here because the program anchor is
canonical to Forgejo.

---

## 2. The one compatibility contract this branch touches

The Control Center edits site-wide configuration at runtime through:

- `public/data/site-settings.json` — the published settings blob.
- `public/tayoca-site.js` — the reader/editor runtime.
- `docs/site-settings-policy.yaml` — the contract and the field rules.

That is the **only** control-plane surface the redesign interacts with, and the
contract is preserved exactly.

### 2.1 What is preserved

- `schemaVersion: 1`.
- `brand` (`name`, `homeHref`) — untouched.
- `headerCta` — untouched (`Start an Assessment` → `/assessments.html`).
- `navigation` — same schema, managed array, ≤12 items, `href`/`label`/`visible`.
- `footer` — `description`, `location`, `copyrightName`, `explore`, `connect`.
- `contact` — untouched.
- Every runtime safety property: `safeHref()` allowlist (`http:`, `https:`, `mailto:`,
  `tel:`, root-relative, and no `//` or `\` escapes), `validLink()` label+`href`
  requirement, `activeFor()` matching, the `tayoca:site-settings` event, and the
  fail-safe behaviour that **keeps the static shell** when settings are unavailable,
  malformed or rejected.

### 2.2 What is proposed — additive, within the existing limits

Both changes are **value-only** edits to managed arrays. No schema change, no new
field, no new reader behaviour.

| Managed array | Before | Proposed | Limit check |
|---|---|---|---|
| `navigation` | 6 items | 8 items — adds `Work → /work.html` and `Community → /community/websites` | ≤12 ✔ |
| `footer.explore` | 6 items | 8 items — same two additions | ≤12 ✔ |
| `footer.connect` | 3 items | 5 items — adds `Brief Archive → /operator-brief-archive.html`, `temitayo@tayoca.com → mailto:temitayo@tayoca.com` | ≤12 ✔ |
| `footer.description` | older funnel copy | Neutral engineering-led company sentence | text field ✔ |

Two routes are now managed by the Control Center that were previously static-only, and
`Work` remains reachable from the header through the company-map rail even if settings
fail to load.

### 2.3 What is proposed but NOT done (needs a canonical decision)

- Adding `Work` and `Community` to the **locked static primary nav** inside
  `public/*.html`. This is **blocked by the contract**: `scripts/validate_static_site.py`
  asserts the primary nav is exactly the current six routes. The redesign therefore
  kept the locked six and added `Work`/`Community` through (a) the separate
  company-map utility rail and (b) the managed settings arrays. Changing the locked nav
  is a canonical decision that also requires updating the validator.
- Any new managed field (for example a per-page hero image or a publications feed).
  That would be a `schemaVersion` change and a policy change, and must be proposed to
  Forgejo, not made on the GitHub design branch.

---

## 3. Runtime inventory — the compatibility question this branch will not answer

The control-plane estate (production gateway, Project Intelligence Hub, Growth OS,
Operator Brief automation, community intake, review endpoint, `products-feed.csv`
regeneration) is **live runtime**.

This branch did **not** query it. No production n8n access, credential, workflow count
or activation state was read.

Binding statement, now encoded in `public/data/company-ecosystem.json → runtime_inventory`
and enforced by `scripts/validate_company_ecosystem.py`:

> The repository workflow registry represents a declared subset/snapshot and is not
> authoritative for current live runtime inventory.

The registry records `not_queried` for every live estate field, with
`forbidden_actions` listing what must not be done from a design branch (mutate n8n,
request or use production credentials, reopen the Control Center without a specific
defect or new feature).

Live reconciliation is handed to the canonical Forgejo / n8n integration agent.

---

## 4. Historical security finding — superseded by the completed handoff

A prior live inspection identified shared authorization material in an earlier Control Center workflow implementation. The later canonical production handoff supersedes the old **open implementation workstream** classification.

| | |
|---|---|
| Current status | **Superseded operationally by the completed production handoff** |
| Production boundary | Server-side credential handling; Cloudflare Access is the sole authentication boundary; browser credentials are not exposed |
| Evidence | `docs/control-center-production-handoff-20260828.md`, `docs/control-center-status-note.yaml` |
| Reopen rule | Do not reopen the Control Center broadly. Revisit only for a specific evidenced defect or an explicitly scoped security audit. |
| Secret handling | No historical/current authorization value is reproduced in this branch or registry. |

The redesign therefore preserves compatibility with the completed Control Center and does **not** assign LM Arena or the website-integration workstream a live credential-remediation task.

---

## 5. Compatibility checklist

| Contract | Preserved | Evidence |
|---|---|---|
| Global Site Settings runtime in `tayoca-site.js` | ✔ | Full GSS block present; only additive JS appended |
| Fail-safe static fallback | ✔ | Both code paths intact; the static shell remains valid on its own |
| `site-settings.json` schema version 1 | ✔ | Value-only edits |
| Managed-field and link allowlist rules | ✔ | All proposed links are root-relative or `mailto:` |
| Stage 10 product registry + renderer | ✔ | `product-ecosystem.json` untouched; `stage10-*` markers byte-identical |
| Operator Brief subscribe + unsubscribe webhooks | ✔ | Both contracts present in the registry and in the page |
| Assessment form + `data-assessment` cards | ✔ | Untouched |
| Community Google Form intake | ✔ | URL and `data-google-form-cta` markers preserved, plus the new `work` marker |
| Review public endpoint + fail-closed rendering | ✔ | Untouched |
| GA4 + `/ga4.js` coverage | ✔ | `validate_analytics_coverage` passes on all 36 canonical URLs |
| Redirects, security headers, robots, sitemap | ✔ | Untouched except the added `/work.html` sitemap entry |
| Control Center files themselves | ✔ (not touched) | No redesign, no second CMS, no auth work |
