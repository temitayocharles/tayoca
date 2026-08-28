# Tayoca Arena Redesign — Company Discovery Inventory (expanded GitHub scan)

Date: 2026-08-27 · Scope: `github.com/temitayocharles` + related public accounts/orgs (Emife1, zenhosta, zernio-dev) discovered during the scan
Method: GitHub REST API (repo metadata, READMEs, fork/parent relationships, org membership, global repo search)

> Classification states used: `public_verified` · `public_candidate` · `owner_confirmation_required` · `private_internal` · `client_disclosure_unknown` · `archived` · `superseded`
> Firewall rule applied: private repos are never named in this document beyond the Tayoca site repository itself; only public evidence is cited.

## 1. Account landscape

| Account / org | Type | Repos | Relationship evidence |
|---|---|---|---|
| `temitayocharles` | user | 4 public (`9drive` fork, `zernflow` fork, `tayoca-control-center` fork, `abiding-place-fellowship-cms`) + private `tayoca` (site mirror) | Founder's GitHub identity (per `docs/brand-founder-identity.md` and site repo) |
| `Emife1` (olufunkeemife) | user | 9 public | `hermes-agent-workspace` description explicitly credits `@temitayocharles`; `sitesupply` repo hosts the SiteSupply build described in Tayoca's blog |
| `zenhosta` (zenhosta.com) | user | 4 public (`9drive` source, `niagakita-digital`, `niagakita-toko-online`, `zen-content-api`) | `temitayocharles/9drive` is a fork of `zenhosta/9drive`; same-person or close-collaborator ecosystem (unconfirmed) |
| `zernio-dev` (Zernio, zernio.com) | org | 26 public | `temitayocharles/zernflow` is a fork of `zernio-dev/zernflow`; founder is not a public org member (membership status unconfirmed) |
| `janmaaarc` (n8n-ops) | user | — | `temitayocharles/tayoca-control-center` is a fork of `janmaaarc/n8n-ops`, customized for Tayoca |

## 2. Inventory

### 2.1 Tayoca-owned / published surfaces (already modelled on tayoca.com)

| Project | Repo/source | What it does | Status | Classification | Public evidence |
|---|---|---|---|---|---|
| Sivanta | No GitHub repo found under accessible accounts; canonical evidence = `sivanta.html`, `data/sivanta-offers.md`, `sivanta-agent-platform.vercel.app` (referenced in offers doc) | Conversation-led commerce automation (WhatsApp/Telegram/Web flows, skill registry, policy layer, checkout, human handoff) | Active product; deployments sandboxed pending channel verification + Paystack approval | `public_verified` (offer) / `owner_confirmation_required` (deployment + tenant evidence) | `/sivanta.html`, product-ecosystem.json |
| SiteSupply | `Emife1/sitesupply` (public); live sites `sitesupply.cois.site` (article) and `sitesupply.vercel.app` (README) | Early-access Ontario construction sourcing and supplier-matching platform: quote intake (`/compare`), supplier onboarding (`/suppliers`), workspace (`/workspace`); Neon Postgres + Vercel serverless | Early access; public request/supplier/contact flows production-connected; workspace pricing/supplier-fit values are demonstration data (per README) | `public_verified` (existence) / `owner_confirmation_required` (ownership split: repo under Emife1, Tayoca article says Tayoca "helping bring to market") | `/blog/sitesupply-construction-procurement-marketplace.html`, public repo, live sites |
| Operator Brief | Site archive + n8n workflow (repo-declared `Ug7hA8cXrrCIVYkI`) | Weekly eight-section briefing; human-approved publication | 1 approved issue (2026-08-17) | `public_verified` | `/operator-brief.html`, `/operator-brief-archive.html` |
| Free Website Initiative | `/community/websites` + Google Form intake | Round 01: 10 free Ontario small-business website builds | Open intake | `public_verified` | `/community/websites` |
| Operator Playbooks (8) | `public/products/*` + Gumroad | Books/labs/checklists for K8s, AI automation, FinOps, GitOps, DevOps | Published | `public_verified` | `/products.html`, Gumroad |
| Tayoca control plane (internal) | `temitayocharles/tayoca` (site repo automation), n8n runtime (live estate), `temitayocharles/tayoca-control-center` (public UI fork of `janmaaarc/n8n-ops`, deployed as authenticated preview) | CMS gateway, Growth OS workflows, intake, editorial, trust, revenue ops, monitoring | Active; runtime estate is materially broader than the repository registry snapshot | `private_internal` (operating internals); UI repo itself is `public` but the deployment is an authenticated preview — do not link from the public site | `automation/n8n/workflow-registry.yaml` (snapshot), public control-center repo README |

### 2.2 Founder-ecosystem public projects (NOT Tayoca-branded; not published on tayoca.com)

| Project | Repo | What it does | Status | Classification | Owner decision needed |
|---|---|---|---|---|---|
| 9Drive | `zenhosta/9drive` (source), `temitayocharles/9drive` (fork) | Storage gateway web app: connect multiple Google Drive accounts into one virtual dashboard; S3-compatible endpoints; upload routing policies; API-key upload API; MySQL/Prisma; Express+TS, React+Vite | Live preview `9drive.zenhosta.com`; active | `owner_confirmation_required` | Is this a Tayoca product, a personal venture, or a zenhosta product? May it be referenced on tayoca.com? |
| Zernio / ZernFlow | `zernio-dev/*` (26 repos incl. `zernflow`, `zernio-api`/CLI/SDKs, `latewiz`, `unified-inbox`, `ads-dashboard`, `n8n-nodes-zernio`, `crisp-mcp`, plugins), `temitayocharles/zernflow` (fork) | "Social & messaging for developers and AI agents": social scheduling API (16 platforms), visual chatbot/flow builder (ManyChat alternative), unified inbox, SDKs, MCP servers, n8n nodes | Live: `zernio.com`, `zernflow.com`; active org (created 2026-01) | `owner_confirmation_required` | Separate company or founder venture? Never present as a Tayoca product without explicit confirmation |
| zenhosta products | `zenhosta/niagakita-digital`, `niagakita-toko-online` (Indonesian e-commerce, PHP), `zenhosta/zen-content-api` (WordPress JSON API plugin) | Indonesian-market e-commerce/marketplace apps + WordPress content API | Active repos | `owner_confirmation_required` | Relationship to Tayoca unknown; likely separate venture |
| Abiding Place Fellowship website | `Emife1/abiding-place-fellowship-cms` (public) | Shelburne fellowship (church) website with verified content layer from legacy site, Town of Shelburne records and dated local reporting; Decap CMS; Vercel | Live `abidingplace.vercel.app`; editorial safeguards documented in README | `client_disclosure_unknown` | Is this Tayoca community-initiative work or a personal/client build? May Tayoca reference it? (Church context needs explicit consent) |
| Hermes Agent workspace | `Emife1/hermes-agent-workspace` (public, **empty** repo; description: "curated collection of AI agent projects, research, and automation tools developed by @temitayocharles"), `Emife1/hermes-cloud-agent` (public, no README content) | AI-agent workspace/lab concept; no published content | Placeholder/early | `owner_confirmation_required` | What is Hermes? No content to publish; confirm before any mention |
| n8n Render Python runtime | `Emife1/n8n-render-python-runtime` (public) | Custom n8n Docker image (2.15.0 + Python 3.12) used by the "n8n-5" Render service; multi-stage build without apt | Used by a live n8n service | `owner_confirmation_required` (public infra tooling; internal by purpose) | Demonstrates internal capability; not needed on the public site |
| Portfolio sites | `Emife1/emife-portfolio`, `Emife1/emife-victoria-portfolio`, `Emife1/victoria-emife-portfolio` | Personal/career portfolio sites ("Cinematic AI-powered career portfolio for Victoria Emife") | Live (unconfirmed URLs) | `client_disclosure_unknown` | Third-party personal sites; do not reference without consent |
| ALX learning repos | `Emife1/alx-pre_course`, `Emife1/alx-zero_day` | Early full-stack training repositories (2023) | Historic | `archived` | Not publishable; learning only |

### 2.3 Explicitly unresolved (owner confirmation required; nothing published)

| Item | Evidence found | What is needed |
|---|---|---|
| **Creator Prompter** | Named in `LM_ARENA_COMPANY_PLATFORM_BRIEF.md`; no repository or public surface found under `temitayocharles`, `Emife1`, `zenhosta`, `zernio-dev`, or global search | Confirm what it is, where it lives, and its disclosure status |
| **Sivanta repository** | No repo found under accessible accounts (probed `sivanta*` names → 404); only the public page + offers doc + referenced demo URL | Confirm repo location/name and what may be published about deployments |
| **n8n-control-plane repository** | Referenced in `docs/final-certification/rollback-report.json` (`temitayocharles/n8n-control-plane`); probe → 404 under all scanned accounts | Confirm whether it was renamed, made private under another name, or retired |
| **Other private repositories** | PAT-visible private repos under `temitayocharles`: `tayoca` (site mirror) only confirmed; scope of further private repos unknown (token cannot list them) | Owner to confirm any additional private projects and their disclosure status |

## 3. What this means for tayoca.com

- **Published additions: none.** All founder-ecosystem projects above remain off the public site. They strengthen the *understanding* of the company (breadth, agent/automation capability, community work) but every one of them needs an explicit owner decision before it can appear, because:
  - branding/ownership relationship to Tayoca is unconfirmed (9Drive, Zernio, zenhosta, Hermes);
  - third-party or community consent is unconfirmed (Abiding Place, portfolio sites);
  - content does not exist yet (Hermes workspace is empty; Creator Prompter not found).
- **Registry**: `public/data/company-ecosystem.json` gains a `classification` state per portfolio item and a `related_ecosystem` section (public repos only, `published_on_site: false`) so the CMS can distinguish publishable from owner-confirmed material.
- **SiteSupply** stays on `/work.html` as a venture, with the article as canonical source; its public repo and live sites corroborate the story (no new claims added).

## 4. Control-plane corrections (from live runtime inspection)

1. `automation/n8n/workflow-registry.yaml` is a **repository-declared snapshot**, not authoritative current runtime state. The live n8n estate is materially broader. This document never asserts the registry is complete, and no workflow rationalisation is proposed from it alone.
2. **Live-runtime reconciliation is required** (authorised control plane): produce a canonical runtime inventory (workflows, versions, activation state, owners) and reconcile the registry against it.
3. A live Control Center inspection identified **authorization material embedded in workflow code**. Per the security boundary, the value is not reproduced here. Remediation (authorised control plane only): migrate to n8n credential store; rotate the value; identify affected callers; migrate callers safely; test authentication; provide rollback; certify the old value is no longer accepted. See `05-control-plane-migration-plan.md` §5.
4. `temitayocharles/tayoca-control-center` (public fork of `janmaaarc/n8n-ops`) is the real control-console UI: React/TS/Tailwind dashboard for n8n execution tracking, schedules, webhooks, backups, with a server-side-only gateway (browser never receives n8n/Forgejo/gateway tokens; `ALLOW_PRODUCTION_CONTROL_CENTER` fail-closed). Its deployment is an **authenticated preview** — not a public showcase.
