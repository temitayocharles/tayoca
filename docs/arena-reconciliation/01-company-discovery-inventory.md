# Updated company / project discovery inventory

Companion to `00-reconciliation-report.md`.
Machine-readable source of truth: `public/data/company-ecosystem.json` (schema 2),
enforced by `scripts/validate_company_ecosystem.py`.

## 0. Two corrections to the previous discovery

### 0.1 Creator Prompter Studio — CORRECTION

The previous Arena discovery recorded this project as **not found**. That conclusion
was **incomplete** and is corrected here.

| Field | Value |
|---|---|
| Canonical location | Forgejo — `temitayocharles/creator-prompter-studio` |
| Canonical main | `e7299c284d2fb5ca4f69df8b4aa47c902d963261` |
| Nature | macOS application project — Swift Package Manager manifest, source, tests, documentation |
| Evidence | Canonical Forgejo repository evidence supplied by the owner / integrator |
| GitHub mirror | **None located** (`not_found_on_github`) |
| Verification basis | Canonical Forgejo repository evidence, not a GitHub search |
| Publication | **RECORDED, NOT PUBLISHED.** It does not appear on any public surface of this redesign. |

Existence and publication are recorded as **separate** fields, and the validator
enforces that separation:

- `owner_relationship_confidence` — `owner_confirmed`
- `disclosure_permission` — `unresolved_public_disclosure_classification`
- `public_classification` — `unclassified_pending_owner_decision`
- `publication_status` — `recorded_not_published`
- `recommended_destination_if_approved` — a product entry under
  `Deliver → Products` (`/products.html`), or `/work.html` under
  `Owned product / venture` if it is to be framed as a build rather than a
  purchasable product.

It is **not** published merely because it exists. Publishing it is a separate decision
that requires the owner to set a public classification first.

### 0.2 n8n live estate — CORRECTION

Previous framing: "5 active workflows". That framing is **not** used.

Binding wording adopted everywhere, and enforced by the validator:

> The repository workflow registry represents a **declared subset/snapshot** and is
> **not** authoritative for current live runtime inventory.

No live n8n workflow count, activation state, version, or credential was queried in
this workspace. Live reconciliation is handed to the canonical Forgejo / n8n
integration agent.

---

## 1. What the inventory covers

1. **Business expressions** — the 10 distinct kinds of work Tayoca does (advises and
   delivers, builds software, operates platforms, creates automation and AI, publishes,
   teaches, creates products, supports community, integration systems, back-office
   automation), each with its own asset taxonomy.
2. **Portfolio** — every company surface, classified with the tuple below.
3. **Publications** — 8 operator publications with real covers and fixed prices.
4. **Insights** — 12 canonical articles; 2 withdrawn/superseded, isolated.
5. **Community** — the Local Business Website Initiative intake contract.
6. **Newsletter** — Operator Brief subscribe + unsubscribe contracts.
7. **Runtime inventory** — declared snapshot, with the live-estate disclaimer.
8. **Related ecosystem (founder-adjacent)** — 7 items, all classified, none published
   without a decision.

## 2. The classification model

Every asset carries the same nine fields. No field is inferred; unknown means
`unresolved`, never a friendly guess.

| Field | Meaning |
|---|---|
| `asset_type` | What kind of thing this is (advisory engagement, managed service, product, publication, teaching programme, community, internal system, venture) |
| `existence` | `verified_in_repository` / `verified_canonical_evidence` / `reported_unverified` / `not_located` |
| `technical_nature` | What it actually is, technically |
| `source` | `this_repository` / `canonical_forgejo` / `production_deployment` / `not_located` / `unresolved` |
| `owner_relationship_confidence` | `canonical_tayoca` / `owner_confirmed` / `owner_confirmation_required` / `unresolved` |
| `tayoca_relationship` | `canonical_tayoca_asset` / `founder_affiliated` / `third_party` / `unresolved` |
| `disclosure_permission` | `approved_for_publication` / `internal_only` / `permission_required` / `consent_required` / `unresolved` |
| `public_classification` | The neutral public wording, e.g. `Project / build · In market` |
| `publication_status` | `published` / `recorded_not_published` / `not_published` / `withdrawn` / `unresolved` |
| `recommended_destination_if_approved` | Where it goes **if** the owner approves |

Two firewall rules are machine-enforced:

1. `internal_only` and `not_published` items are **never** rendered on a public page.
2. Withdrawn proof is rendered as a **withdrawn** notice, never as evidence.

## 3. Portfolio — generated from the registry

| id | title | asset type | existence | source | owner relationship confidence | tayoca relationship | disclosure permission | public classification | publication status |
|---|---|---|---|---|---|---|---|---|---|
| sivanta | — | — | verified | public site surface + product ecosystem registry | confirmed | owned | granted | owned_product | published |
| sitesupply | — | — | verified | public repository under a third-party account; referenced in canonical Forgejo policy files | unconfirmed | unrelated_pending_confirmation | unresolved | venture_build | published_neutral |
| operator-brief | — | — | verified | site surfaces + editorial policy | confirmed | owned | granted | publication | published |
| operator-playbooks-catalogue | — | — | verified | site surfaces + registry | confirmed | owned | granted | publication | published |
| community-websites | — | — | verified | site surface + community intake bridge | confirmed | owned | granted | community_initiative | published |
| tayoca-control-center | — | — | verified | canonical handoff document; production line checkpoint 6cae0f71d7b60cec62c783de925780835075e96c | confirmed | internal | not_required | internal_system | published_descriptive_only |
| tayoca-control-plane | — | — | verified | repository registry (declared snapshot) + reliability policy | confirmed | internal | not_required | internal_system | published_descriptive_only |

## 4. Related founder-ecosystem items — generated from the registry

| id | title | existence | technical nature | source | owner relationship confidence | tayoca relationship | disclosure permission | public classification | publication status | recommended destination if approved |
|---|---|---|---|---|---|---|---|---|---|---|
| creator-prompter-studio | — | verified | macOS application project with source, tests and documentation | temitayocharles/creator-prompter-studio (canonical Forgejo; verified main e7299c284d2fb5ca4f69df8b4aa47c902d963261) | unconfirmed | unrelated_pending_confirmation | unresolved | unclassified | recorded_not_published | product / application surface under /work.html, with its own product page only if a public offer, pricing and support boundary exist |
| zernio | — | verified | social and messaging API platform for developers and AI agents, with a visual flow builder, SDKs, CLI, MCP servers and n8n nodes | https://github.com/zernio-dev/zernflow (and the wider zernio-dev org); mirrored as a fork on the founder's GitHub account | unconfirmed | unrelated_pending_confirmation | unresolved | unclassified | recorded_not_published | only if confirmed as a Tayoca venture — portfolio entry under /work.html, never as a Tayoca product without written confirmation |
| 9drive | — | verified | storage gateway web application unifying multiple Google Drive accounts behind one dashboard with S3-compatible endpoints | https://github.com/zenhosta/9drive (live preview 9drive.zenhosta.com); mirrored as a fork on the founder's GitHub account | unconfirmed | unrelated_pending_confirmation | unresolved | unclassified | recorded_not_published | portfolio entry under /work.html if confirmed as a Tayoca build; otherwise not referenced |
| zenhosta-storefronts | — | verified | regional e-commerce applications and a WordPress content API plugin | https://github.com/zenhosta/niagakita-digital, niagakita-toko-online, zen-content-api | unconfirmed | unrelated_pending_confirmation | unresolved | unclassified | recorded_not_published | not referenced on tayoca.com unless a Tayoca delivery relationship is confirmed |
| abiding-place-fellowship | — | verified | community organisation website with a managed content layer | public repository and live site; located within the Free Website Initiative geography | unconfirmed | unrelated_pending_confirmation | unresolved | unclassified | recorded_not_published | community initiative context only, with explicit consent — never as an unnamed client logo or case study |
| hermes-agent-workspace | — | verified_as_placeholder | placeholder/lab repository with no published content | public placeholder repositories crediting the founder as an AI-agent project collection | unconfirmed | unrelated_pending_confirmation | unresolved | experiment | recorded_not_published | experiments area of /work.html once something publishable exists |
| n8n-render-python-runtime | — | verified | custom container image used by a live automation service | public infrastructure repository | unconfirmed | internal_or_infrastructure | not_required | internal_system | recorded_not_published | infrastructure evidence only; not a public showcase |

## 5. Insufficient-evidence / unresolved items (decision needed, none published)

| Item | What is known | What is missing | Conservative public behaviour |
|---|---|---|---|
| Creator Prompter Studio | Verified existing Forgejo project (`e7299c28…`) | Public disclosure classification | Recorded in the registry. Not published anywhere on tayoca.com. |
| Zernio / ZernFlow | Named as founder-adjacent work in prior discovery | `tayoca_relationship` unconfirmed; disclosure unconfirmed | Not published. Listed as an open decision. |
| 9Drive / Zenhosta | Named as founder-adjacent work in prior discovery | `tayoca_relationship` unconfirmed; disclosure unconfirmed | Not published. Listed as an open decision. |
| Abiding Place Fellowship | Community affiliation | Personal/community consent not on record | No third-party or community affiliation is published without consent. |
| Hermes Agent workspace | Referenced internal workspace | Status unresolved, disclosure unconfirmed | Not published. |
| `n8n-control-plane` repo | Referenced in prior discovery | `not_located` at the referenced GitHub path; canonical location unconfirmed | Not published; no link emitted. |
| Sivanta source | Sivanta is published as a product/programme page | Dedicated source repository unconfirmed | The public Sivanta page makes no repository claim. |
| Control Center embedded authorization material | Production security finding | Requires live integration and certification | Requirement preserved and documented only. Not claimed fixed. No value reproduced or searched for. |
| AI Made Simple staged landers | Landers exist behind redirects | Canonical intent not confirmed | Redirects preserved; no new claim made. |
| Production gateway path allowlist | Gateway routing exists | Live path/header allowlist not reconciled | Flagged for the integration agent. |
| `products-feed.csv` generation | Feed file is committed | Which system regenerates it in production is unconfirmed | Flagged for the integration agent. |

## 6. Asset taxonomy — why the IA does not flatten everything

The redesign deliberately separates the ten business expressions into three public
families so that "advises", "builds", "operates", "publishes", "teaches", "creates
products" and "supports community" are not implied to be the same kind of asset:

- **Deliver** (advise / build / operate / automate / integrate) —
  `Services · Assessments · Results · Segments · Sivanta`
- **Build & Read** (products / publications / teaching / insights / brief) —
  `Products · Insights · Operator Brief · Archive`
- **Company** — `Work · Community · About · Trust · Reviews`

`/work.html` states the taxonomy in prose as well: owned product / venture,
publication, client or community project, internal system, and research — with the
five-step classification rule used to place each one.
