# Company information architecture

Deliverable: an IA that shows Tayoca **advises and delivers**, **builds software**,
**operates platforms**, **creates automation and AI**, **publishes**, **teaches**,
**creates products** and **supports community** — **without implying that all of these
are the same kind of asset**.

## 1. The problem with a flat IA

A single "Products" or "What we do" list flattens fundamentally different commitments:

- a **client engagement** you buy from us (scope, evidence, acceptance criteria),
- an **owned product or venture** we build and operate ourselves,
- a **publication or teaching pack** you buy and use yourself,
- a **newsletter/briefing** you subscribe to,
- a **community programme** we run at no cost,
- an **internal system** that runs the company and is not a public offer.

These have different evidence behind them, different promises, and different
disclosure rules. The IA therefore separates them structurally, not just with labels.

## 2. Three public families

```
DELIVER — work you engage us for
  Services            /services.html        advisory + delivery engagements
  Assessments         /assessments.html     fixed-scope diagnostic engagements
  Results             /results.html         the evidence standard, and what counts as proof
  Segments            /segments/*.html      the same practices, framed per audience
                        ├ growth-stage-technology
                        ├ regulated-operations
                        └ ai-enabled-engineering
  Sivanta             /sivanta.html         an operated platform/programme, not a consulting line

BUILD & READ — things we make that you use yourself
  Products            /products.html        owned publications, playbooks, lab packs (8)
  Insights            /insights.html → /blog/   field notes and articles (12)
  Operator Brief      /operator-brief.html       the weekly briefing + newsletter contracts
  Brief archive       /operator-brief-archive.html   approved issues

COMPANY — who we are and how we are accountable
  Work                /work.html            everything we build, each with its kind and status
  Community           /community/websites   a community programme, not a lead funnel
  About               /about.html           the builder's-company story and principles
  Trust               /trust.html           evidence, disclosure, automation and security boundaries
  Reviews             /reviews.html         verified buyer reviews, fail-closed
```

## 3. Navigation

**Locked primary nav** (required by `scripts/validate_static_site.py`, unchanged):
`Services · Assessments · Results · Products · Insights · About`.

**Company-map rail** (new, secondary, `aria-label="Company map"`, collapses into the
mobile menu): `Work · Operator Brief · Community · Trust · Reviews · Sivanta`.

This is how the IA is broadened **without** breaking the locked contract: the primary
six remain exactly as enforced, and the additional company surfaces get a separate,
explicitly-labelled rail plus footer directories plus managed settings entries.

**Footer** — five directories, three static and two managed by Global Site Settings:

| Directory | Contents | Managed by Control Center |
|---|---|---|
| Explore | Services, Assessments, Results, Products, Insights, About | **Yes** |
| Connect | Operator Brief, Trust Center, support@, temitayo@ | **Yes** |
| Company | About, Work, Results, Trust, Reviews | No |
| Deliver | Services, Assessments, three segment pages | No |
| Build & Read | Products, Sivanta, Insights, Brief archive, Community | No |

## 4. Asset taxonomy — the anti-flattening mechanism

Every entry in `public/data/company-ecosystem.json` carries an `asset_type` and the
full classification tuple (see `01-company-discovery-inventory.md §2`). The public
rendering of that taxonomy is on `/work.html`, which states the five kinds explicitly:

| Kind | Meaning |
|---|---|
| **Owned product / venture** | We build it, we operate it, we carry the risk. Example: Sivanta (operated platform), SiteSupply (market build, neutral status) |
| **Publication / teaching** | You buy it and use it yourself. Example: the eight operator playbooks and lab packs |
| **Client or community project** | Engagements and programmes delivered for others |
| **Internal system** | Runs Tayoca. Not a public offer, not a case study |
| **Research / briefing** | The Operator Brief and the insight library |

The five-step classification rule, also stated on `/work.html`:
1. kind → 2. technical nature → 3. source → 4. disclosure permission → 5. public
classification. Step 4 is a hard gate: without consent, an item stays out of the public
IA regardless of merit.

The home page states the same idea in prose: *"a client engagement you buy from us and
a marketplace we are building are different commitments with different evidence behind
them."*

## 5. The seven business expressions, and where each one lives

| Expression | Surface | Asset type | Why it is not folded into "products" |
|---|---|---|---|
| **Advises and delivers** | `/services.html`, `/assessments.html`, segment pages | client engagement | Scope, acceptance and evidence are engagement-specific |
| **Builds software** | `/work.html` (owned software), Sivanta | owned product / venture | We carry build and operating risk ourselves |
| **Operates platforms** | Sivanta, internal control plane | operated platform | An operated platform is an ongoing commitment, not a deliverable |
| **Creates automation and AI** | `/services.html` automation practice, Sivanta, internal systems | engagement + internal system | Internal automation is not for sale; client automation is scoped work |
| **Publishes** | `/products.html`, `/blog/`, Operator Brief + archive | publication / research | Self-serve, fixed price, no engagement |
| **Teaches** | Lab packs, course kits, teaching packs | publication / teaching | Same as publications, but the destination is learning, not a runbook |
| **Creates products** | `/products.html` (8 real products with real covers) | owned product | Distinct from engagements and from ventures |
| **Supports community** | `/community/websites` | community programme | Free, no sales obligation, consent-gated disclosure |

Eight expressions, three families, and **no single list that implies they are the same
kind of thing**.

## 6. Items deliberately not placed in the public IA

Recorded in the registry with `publication_status: recorded_not_published` or
`not_published`, and rendered nowhere:

- Creator Prompter Studio (verified to exist; disclosure classification unresolved)
- Zernio / ZernFlow, 9Drive / Zenhosta (relationship unconfirmed)
- Abiding Place Fellowship (consent required)
- Hermes Agent workspace (status unresolved)
- `n8n-control-plane` repository (not located; no link emitted)
- Internal control-plane systems (internal by definition)

## 7. Routes that must keep working

All 18 `_redirects` rules preserved, including:
`/insights.html → /blog/`, `/assessment → /assessments.html`, all `/l/*` product
short links, legacy lander redirects, and
`/blog/devops-incident-response-runbook.html → /products/devops-incident-runbook-template.html`.

`/work.html` is new and is the only addition to `sitemap.xml` (36 canonical URLs).
