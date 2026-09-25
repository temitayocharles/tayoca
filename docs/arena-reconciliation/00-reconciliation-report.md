# Tayoca company-platform redesign v2 — reconciliation report

Status: **review candidate for the canonical Forgejo integration agent**
Branch: `arena/tayoca-company-platform-v2-reconciled` (session branch `arena/01a04a44-tayoca`)
Prepared: 2026-08-28
Workspace: GitHub external design workspace (`temitayocharles/tayoca`)

> GitHub is the external design workspace. Final acceptance and production
> reconciliation must occur through canonical Forgejo. Nothing in this branch
> claims production authority, mutates live n8n, or certifies a security fix.

---

## 1. Source verification performed at the start of this task

| Item | Value found | Note |
|---|---|---|
| GitHub `main` SHA | `d13dd28ef0dba6695bf1140221dab287a53ac970` | Read live from GitHub before any change |
| Its mirror commit message | `mirror: sync canonical Forgejo 917bbb733c87` | |
| Its `Canonical-Forgejo-Commit` | `917bbb733c877bbdf4e64e3fac91cc8e07131fab` | |
| Expected in the task brief | `0813ef1aca650d3a580869821c32a7e633216016` | **GitHub main has advanced again since the brief was written.** The brief's SHA is stale; the live value above is the baseline used. |
| Old Arena branch | `arena/01a04553-tayoca` | |
| Old Arena head | `942e4a57f61c66337adef2b851f5bd4b18096e3e` | Matches the previously reviewed head |
| GitHub PR | #13 — OPEN, 76 changed files, +4,377 / −1,625 | Not merged; not used as a base |
| Merge base between old branch and current `main` | **none** (`git merge-base --all` returns nothing, exit 1) | The old branch history was re-authored, so a mechanical rebase/merge is not possible. This independently confirms the "reconstruct by intent" instruction. |

New branch created from **current** `main` (`d13dd28`), not from the old branch.

## 2. Program authority read before any change

Read in this order, as required:

1. `AGENTS.md`
2. `docs/TAYOCA_PROGRAM_AUTHORITY.md`
3. `docs/tayoca-program-state.yaml`
4. `docs/site-settings-policy.yaml`
5. `docs/control-center-status-note.yaml`
6. `docs/control-center-production-handoff-20260828.md`
7. `docs/production-growth-operating-plan.yaml` (referenced), `editorial/operator-brief/operator-brief-policy.yaml` (referenced), `intelligence/project-intelligence-hub-policy.yaml`, `docs/evidence-policy.md`

Where the old Arena documentation conflicted with these, **current `main` wins** for
facts and contracts. The old Arena direction remains the **visual baseline**.

Two authority corrections were applied against the older program text:

- `docs/tayoca-program-state.yaml` still records `control_center_cms: partial` and
  "continue as structured operating product". `docs/control-center-status-note.yaml`
  and `docs/control-center-production-handoff-20260828.md` are **newer evidence** and
  record the Control Center as `completed_production_deployed`. This redesign treats
  the Control Center as **closed**, per the newer documents.
- `docs/TAYOCA_PROGRAM_AUTHORITY.md` was **not rewritten** by this branch. It is a
  canonical anchor; status changes are listed here for the integrator to fold in.

---

## 3. Feature / intention matrix

Legend — **PORT**: carried into this branch · **SUPERSEDED**: replaced by newer `main`
behaviour or by a better v2 design · **CONFLICT**: contract collision, resolved as noted ·
**NEW**: added in this branch · **DROPPED**: deliberately not carried.

### 3.1 Design system

| Old Arena artefact | Disposition | Detail |
|---|---|---|
| `public/assets/css/site-shell.css` v2 ("night workshop" tokens) | **PORT + EVOLVE** | Rebuilt as v3. All tokens retained and warmed (`--bg #0b0a09`, `--surface #171513`, warm paper `#faf6ef`, single amber accent). |
| `.stage10-*` locked block | **PORT verbatim** | The Stage 10 CSS block is byte-identical to current `main` (spliced programmatically), so `scripts/validate_product_ecosystem.py` markers are preserved exactly. |
| Hero split with framed media | **PORT + EVOLVE** | Kept `.hero-media` frame. Added `.hero-cinema` full-bleed treatment with warm scrim and a mono meta rail. |
| Ledger label / numbered section motif | **PORT** | `01 / Practices`, `02 / Build`, … retained and extended across home, work, about, services, blog. |
| Card system (practice / portfolio / product / article) | **PORT + EVOLVE** | Portfolio cards became image-led with hover zoom; product cards are cover-led with real covers. |
| Newsletter panel | **PORT** | Preserved `.form-card` / `.form` classes so `growth-os.js` behaviour is untouched. |
| Footer directories | **PORT + RECONCILE** | Rebuilt to remain compatible with the Global Site Settings footer runtime (see §5). |

### 3.2 New in v3 (not present in the old Arena branch)

| Addition | Why |
|---|---|
| `.paper-band` warm-paper section | The program authority explicitly asks for **light/dark contrast moments** so the near-black palette does not become "another uniform dark-card system". Used on home (`02 / The whole company`), about (principles), services (boundary), work (classification), results (checks), blog (brief). |
| `.hero-cinema` full-bleed hero + `.hero-meta` | Stronger hero treatment, requested by the authority. |
| `.rail` sticky editorial rail | Long-form copy without another card grid. |
| `.split` / `.mosaic` compositions | Sectional variety. |
| `.coverstrip` | Real publication covers get a real surface instead of a text list. |
| `.device` browser/device frame | Honest framing for the Sivanta system diagram. |
| `.diagram` inline-SVG system | Real diagrams (services operating loop) instead of decorative graphics. |
| `.chip--*` truthful status chips | `active` / `neutral` / `open` / `hold` / `internal` — status is always truthful. |
| `.notice` | Withdrawn-narrative and disclosure notices that read as notices. |
| `.reveal` scroll reveal | Subtle motion, opt-in from JS, disabled under `prefers-reduced-motion`. |
| `.segment-hero` per-page hero imagery | The three segment pages no longer look like one template. |

### 3.3 Pages

| Page | Disposition | Notes |
|---|---|---|
| `public/index.html` | **PORT + EVOLVE** | Cinematic hero, 8 numbered sections, warm-paper "seven kinds of work" company-IA block, build mosaic, cover strip, Operator Brief form, community split, evidence, contact. |
| `public/work.html` | **PORT + EVOLVE** | Recreated. Now classifies owned product / venture / publication / community / internal systems, with an explicit 5-step classification model. |
| `public/about.html` | **PORT + EVOLVE** | Builder's-company narrative, six-step evolution, founder section. |
| `public/services.html` | **PORT + EVOLVE** | Added inline-SVG operating-loop diagram and a warm-paper "what we will and will not claim" rail. |
| `public/products.html` | **PORT + RECONCILE** | Hero `h1` text is written to **exactly** match the string the Stage 10 runtime injects, so there is no content jump. Grid rebuilt around real covers. |
| `public/blog/index.html` | **PORT + EVOLVE** | Cinematic hero, twelve article cards, warm-paper Brief rail, cover strip. |
| `public/operator-brief.html` | **PORT + EVOLVE** | Cinematic hero, eight-section grid, both form contracts preserved. |
| `public/operator-brief-archive.html` | **PORT + RECONCILE** | Archive wrapper, `data-operator-brief-archive`, `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->` and the approved issue are preserved byte-for-byte; only the surrounding shell changed. |
| `public/community/websites/index.html` | **PORT (light) + FIX** | Its own composition language kept; canonical shell applied. Fixed an inherited contrast defect (dark-on-dark application card) and gave the hero a real local-Ontario photograph. |
| `public/trust.html` | **PORT + EVOLVE** | Added project-disclosure rail and security-boundary panels. |
| `public/results.html` | **PORT + EVOLVE** | Added a prominent withdrawn-narrative notice and a four-checks warm-paper band. |
| `public/sivanta.html` | **PORT + EVOLVE** | Legacy in-main footer moved out; hero rebuilt with the flow diagram in a device frame; new "how it works" section. Pricing/comparison preserved. |
| `public/reviews.html`, `public/review.html` | **PORT (shell)** | Review endpoint, `#reviewsGrid`, `#summary`, `#reviewSchema`, fail-closed empty state all untouched. |
| `public/assessments.html` | **PORT + EVOLVE** | Split hero added; the assessment form and `data-assessment` cards untouched. |
| `public/segments/*.html` | **PORT (shell) + EVOLVE** | Canonical shell, per-page hero photography, ledger labels. |
| `public/404.html` | **PORT** | Canonical shell, noindex retained, helpful recovery routes. |
| 11 blog articles + 8 product pages + landers | **PORT (shell normalisation)** | One coherent shell across every page so the site no longer "looks like separate eras". |
| `public/analytics.html`, `public/temitayo.html` | **PORT (shell)** | Utility pages brought into the same shell. |

### 3.4 Model, contracts and tooling

| Artefact | Disposition | Notes |
|---|---|---|
| `public/data/company-ecosystem.json` | **PORT + UPGRADE to schema 2** | Adds the classification tuple, Creator Prompter Studio, runtime-inventory wording and the Control Center security block. |
| `scripts/validate_company_ecosystem.py` | **PORT + UPGRADE** | Enforces the disclosure firewall, withdrawn-proof isolation, runtime-inventory wording, the Control Center security boundary and the Creator Prompter correction. Added to `.forgejo/workflows/static-quality.yml`. |
| `scripts/check_links.py` (old) | **SUPERSEDED** | `scripts/validate_static_site.py` on current `main` is materially stronger (canonical, sitemap, shell, fragments, blocked claims). Not restored. |
| `docs/arena-redesign/*` (old 00–10) | **SUPERSEDED** | Replaced by this `docs/arena-reconciliation/` set. The old docs are not copied forward because they contain the two errors this task corrects (Creator Prompter "not found"; five-active-workflow framing). |
| `LM_ARENA_*_BRIEF.md` (root) | **DROPPED** | Already absent from current `main`; the briefs live on the canonical `lm-arena/company-platform-rebuild` branch. |

---

## 4. Conflicts and how they were resolved

### 4.1 Locked primary navigation vs. "broaden the IA"

`scripts/validate_static_site.py` enforces an exact static primary nav:

```
Services /services.html · Assessments /assessments.html · Results /results.html
Products /products.html · Insights /insights.html · About /about.html
```

The old Arena branch replaced it with `Services · Work · Products · Insights(/blog/) · Community · About`,
which **fails** the current validator.

Resolution (satisfies both goals):

- The static `.primary-nav` keeps the **exact locked six**, so the contract and the
  validator both hold.
- A **second, separate** `<nav class="utility-nav">` "company map" rail adds
  `Work · Operator Brief · Community · Trust · Reviews · Sivanta`. It is not
  `.primary-nav`, so the validator's nav assertion is unaffected, and it collapses
  into the mobile menu.
- `Work` and `Community` are also added to the **managed** `navigation` and
  `footer.explore` arrays in `public/data/site-settings.json`, so the Control Center
  can publish and edit them through the existing Global Site Settings contract.

### 4.2 Global Site Settings must not be overwritten

The old Arena `tayoca-site.js` predates Global Site Settings and had **deleted** the
whole GSS runtime. Resolution: `public/tayoca-site.js` starts from **current `main`**
and receives only **additive** changes:

- `aria-label` on the menu toggle (open/close), outside-click and Escape close;
- sticky-header `is-scrolled` class that collapses the company-map rail;
- an opt-in IntersectionObserver scroll-reveal that only hides content when JS is
  running, so a failed script never blanks a page.

Every GSS function (`safeHref`, `validLink`, `activeFor`, `buildLinks`,
`buildFooterGroup`, `applyFooter`, `applySiteSettings`, the `tayoca:site-settings`
event, the fail-safe static-shell fallback) and the entire Stage 10 renderer are
unchanged.

### 4.3 Footer vs. the GSS footer runtime

`applyFooter()` replaces the **first two** `.footer-links` groups with the managed
Explore/Connect lists and **removes** any further `.footer-links` groups. The old
Arena footer used `.footer-col` for every column, so the managed groups would have
been appended rather than swapped.

Resolution: the v3 footer uses `.footer-links` for exactly the two managed groups
(Explore, Connect) and `.footer-col` for the three static directories (Company,
Deliver, Build & Read). Settings changes swap the managed groups and leave the static
directories intact.

### 4.4 `products.html` hero vs. the Stage 10 renderer

`tayoca-site.js` overwrites `main h1` and the paragraph after it. Resolution: the
hero is authored with the **identical** strings the runtime injects, so there is no
visible jump and the locked behaviour is preserved.

### 4.5 Blocked-claim list

Current `main` blocks `$216k`, `series b fintech`, `production clusters by day 15`,
platform-SLA promises, `$0 saved → $0 paid`, money-back/acceptance/ROI guarantees and
the credential strings `>pmp<`, `>csm<`, `terraform associate`,
`aws solutions architect`.

Two consequences applied:

- Footer copy was rewritten because a draft phrase ("…and pay for itself") tripped the
  ROI-guarantee rule.
- **Credential badges are not displayed.** The old Arena `about.html` rendered
  `PMP`/`CSM`/`Terraform Associate`/`AWS Solutions Architect` as attestations, which
  fails the current gate and contradicts "display only where current/verifiable".
  About now states the rule instead of the badges. This is the conservative public
  behaviour; restoring badges requires a verification record.

### 4.6 Fragment links to runtime-created ids

`#managed-operations` and `#operator-playbooks` are injected at runtime on
`services.html` / `products.html`, so static fragment validation cannot see them.
Resolution: no page links to those fragments; plain page links are used instead.

### 4.7 `#main` id drift

`public/blog/n8n-mcp-kubernetes.html` uses `id="main-content"`. Its skip link now
targets `#main-content` so the skip target resolves.

---

## 5. Newer-`main` behaviour explicitly preserved

- `public/tayoca-site.js` — full GSS runtime + Stage 10 renderer (see §4.2).
- `public/data/site-settings.json` — schema `1`, managed-field set, link allowlist,
  ≤12 limits, fail-safe fallback semantics. Only *values* changed, within limits.
- `public/data/product-ecosystem.json` — untouched. 4 families / 16 products / 8
  controls / 8 playbook pages.
- Operator Brief archive wrapper, `data-operator-brief-archive`, and
  `<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->`.
- Operator Brief subscribe **and** unsubscribe webhooks, honeypot field, consent field.
- Assessment form, `data-assessment` cards, `data-tayoca-form` names.
- Community Google Form URL and `data-google-form-cta` markers (`home`, `work`, and
  the initiative page's own `hero` / `apply_section`).
- Review data endpoint `https://n8n.tayoca.com/webhook/tayoca/reviews/public`
  and fail-closed rendering.
- `data-event` / `data-revenue-event` names; GA4 measurement id `G-G4QC90QNXW` and
  `/ga4.js` on every canonical page.
- Canonical URLs, sitemap membership, `_redirects` (including the newer
  `/blog/devops-incident-response-runbook.html → /products/devops-incident-runbook-template.html`
  rule the old branch had dropped), `vercel.json` redirects and security headers.
- `products-feed.csv`, `robots.txt`, `404.html` noindex.

---

## 6. Intentionally left out

1. **No Control Center redesign, rebuild, replacement, second CMS, or authentication
   work.** It is production-deployed and closed. See `02-control-plane-compatibility.md`.
2. **No live n8n access, credential request, workflow change or workflow count.** See §8.
3. **No claim that the Control Center embedded-authorization-material issue is fixed.**
4. **The SiteSupply launch article is not restored** (see §7).
5. **No credential badges** on About (§4.5).
6. **No unsupported About metric tiles** — the old "Deploy to prod ≤15 min / MTTR ≤5 min /
   Cloud bill ≤80% baseline" tiles stay removed.
7. **The withdrawn `$216K` narrative stays withdrawn** and is now explicitly labelled
   as withdrawn on the Results page.
8. **No fabricated team photos, client logos, testimonials, dashboards or production
   screenshots.**
9. **Creator Prompter Studio is recorded, not published.**
10. **No change to `docs/TAYOCA_PROGRAM_AUTHORITY.md`** — it is canonical; proposed
    status updates are listed in §9 for the integrator.

---

## 7. GitHub-only source drift register (for the canonical integrator)

Identified by comparing current `main` with older/divergent GitHub history. Nothing
below was silently restored.

| Item | Where it lives now | Classification | Recommendation |
|---|---|---|---|
| `public/blog/sitesupply-construction-procurement-marketplace.html` | Divergent GitHub history only (lineage: PR #12 "Add SiteSupply market-entry acquisition funnel"). **Absent from current canonical `main`.** | Useful, but not canonical, and it asserts a SiteSupply ownership/relationship position that is still `owner_confirmation_required` | **Do not auto-restore.** If the owner confirms the relationship and naming, re-create it as a canonical Forgejo page and link it from `/work.html`. Until then `/work.html` classifies SiteSupply neutrally (`Project / build · In market`) and does not link to a non-existent URL. |
| Community-initiative intake surface | Canonical `main` already replaced the on-site form with the Google Form; `community-websites.js` retains the legacy path | Canonical | No action. |
| AI/DevOps script-debugging and "Production Interview" lead-magnet commits | Historical GitHub-only content/funnel work | Not canonical | Reconcile intent through Forgejo before reuse. Not restored. |
| Legacy `/l/*` landers and superseded product landers | Present behind 301s | Canonical redirects | Keep redirects. |

---

## 8. Unresolved live-runtime items (handed back explicitly)

| Item | Status | Owner |
|---|---|---|
| Live n8n estate inventory, activation/version/owner state | **Not queried.** No production n8n access or credentials were used in this workspace. | Canonical Forgejo / n8n integration agent |
| Reconciliation of live workflows against backup ledger and snapshots | Not attempted | Canonical integration agent |
| Control Center embedded authorization material | **Open / needs live certification.** The value was never reproduced, searched for or stored. Remediation sequence preserved in `public/data/company-ecosystem.json → security`. | Canonical integration agent |
| Project Intelligence Hub, Growth OS, Operator Brief, community and trust runtime re-checks | Not queried | Canonical integration agent |
| Public production site vs canonical Forgejo vs GitHub mirror parity | Not queried (no production access) | Canonical integration agent |
| Browser-based visual/accessibility QA | **Not possible in this workspace** — no browser binary could be installed (Playwright/Chromium downloads are network-blocked and `apt-get` is unavailable). Static QA was substituted; see `04-qa-validation-report.md`. | Canonical integrator should run `scripts/accessibility_browser_audit.cjs` |

---

## 9. Proposed status updates for the canonical program anchor

For the integrator to fold into `docs/TAYOCA_PROGRAM_AUTHORITY.md` /
`docs/tayoca-program-state.yaml` (not applied by this branch):

- `control_center_cms`: `partial` → `completed_production_deployed` (already stated by
  the newer handoff note; the state file is stale).
- `lm_arena`: add the reconciled branch as the current review candidate; mark PR #13
  as superseded-for-merge (keep open as history).
- `known_project_discovery_correction.creator_prompter_studio`: add
  `github_mirror_status: not_found_on_github` and
  `publication_status: recorded_not_published`.
- `workflow_live_estate_reconciliation`: keep `open_needs_current_live_pass`; add the
  binding sentence "The repository workflow registry represents a declared
  subset/snapshot and is not authoritative for current live runtime inventory."

---

## 10. Validation summary

All repository validators pass, plus the new company-ecosystem validator. Full detail
and the manual QA matrix are in `04-qa-validation-report.md`.

```
scan_tracked_secrets .................. PASS
validate_static_site ................. PASS (36 canonical pages)
validate_analytics_coverage .......... PASS (36 canonical sitemap URLs)
validate_product_ecosystem ........... PASS (locked Stage 10 contract)
validate_company_ecosystem ........... PASS (new, schema 2)
validate_editorial_copy_quality ...... PASS
validate_media_distribution_policy ... PASS
```
