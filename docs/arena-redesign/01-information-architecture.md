# Tayoca Arena Redesign — Information Architecture & Content Model

## 1. Visitor questions → navigation mapping

The brief defines ten questions a first-time visitor must be able to answer. Mapping:

| # | Question | Primary surface |
|---|---|---|
| 1 | What kind of company is Tayoca? | Home hero + About |
| 2 | What does Tayoca build for organizations? | Services (+ Assessments as entry) |
| 3 | What software/projects/ventures has Tayoca built? | **Work** (new portfolio page) |
| 4 | What can I buy today? | Products (catalogue + product pages) |
| 5 | What expertise can I hire Tayoca for? | Services + segment paths |
| 6 | What has Tayoca written/published? | Insights (blog) + Operator Playbooks |
| 7 | What community/public-interest work? | Community |
| 8 | Where is current thinking + newsletter? | Insights + Operator Brief (nav-level) |
| 9 | What evidence/proof exists? | Results & Trust Center (calm, not dominant) |
| 10 | What do I do next? | Persistent CTAs: Start an Assessment / Book a call / Subscribe / Apply (community) / Buy |

## 2. Proposed public IA

**Primary navigation (desktop & mobile):**

`Services · Work · Products · Insights · Community · About` + CTA `Start an Assessment`

- **Services** — `/services.html` (practice areas, fixed-scope offers, segment paths, assessments). Assessments remain a dedicated page (`/assessments.html`) as the primary conversion surface per the certified operating plan, linked from services and from the header CTA.
- **Work** — `/work.html` (new): what Tayoca builds — owned products, ventures/client builds, community initiatives, publications — each entry tagged with its true kind and linked to canonical evidence.
- **Products** — `/products.html` (buy today: Sivanta + 8 operator playbooks; assessments as engagement products are presented under Services).
- **Insights** — `/blog/` (articles, categories, featured reading, Operator Brief promotion). URL unchanged (canonical `/blog/`; `/insights.html` already 301s there).
- **Community** — `/community/websites` (initiative page; nav label "Community").
- **About** — `/about.html` (story, builder identity, philosophy, founder, evidence standard, evolution).
- Footer: full directory (Company / Services / Build & Buy / Publishing / Community / Connect) — identical on every page.

**Keep canonical URLs** (contract C12): `/services.html`, `/assessments.html`, `/results.html`, `/products.html`, `/about.html`, `/trust.html`, `/operator-brief.html`, `/operator-brief-archive.html`, `/reviews.html`, `/sivanta.html`, `/blog/`, `/blog/*.html`, `/products/*.html`, `/segments/*.html`, `/community/websites`, `/work.html` (new).

**Where assessments live:** kept at `/assessments.html`; nav CTA "Start an Assessment" preserved (`data-event="header_assessment"`).

## 3. Company-level content model

`public/data/company-ecosystem.json` — new, additive, Git-backed, CI-validated registry. Entity kinds (per control-plane brief, not forced into the commercial taxonomy):

```
company          → identity, positioning, practices, founder, location
practices[]      → service areas (3) with scope and offer references
services[]       → commercial offers (fixed-scope engagements)
segments[]       → operating contexts (3 segment paths)
portfolio[]      → items with kind ∈ {owned_product, venture, client_build,
                   community_initiative, publication, experiment, internal_system}
                   status ∈ {active, in_market, open_intake, published, staged}
                   + canonical source refs (page/article/product)
products[]       → mirror of commercial catalogue (references product-ecosystem.json)
publications[]   → books/playbooks/lab packs (8 Gumroad items)
insights[]       → articles with category, url, excerpt, featured flag
newsletter       → Operator Brief: cadence, archive url, issue count
community[]      → initiatives with intake contract reference
evidence[]       → trust surfaces: results standard, trust center, reviews endpoint
ctas[]           → canonical conversion surfaces (assessment, book, buy, subscribe, apply)
```

Ownership: this file is the **company-level registry** (system-of-record for portfolio/community/insights metadata). `product-ecosystem.json` remains the locked **commercial catalogue** (system-of-record for products). Blog article bodies remain canonical HTML under `public/blog/**`; the registry stores metadata only (no content duplication).

New validator: `scripts/validate_company_ecosystem.py` (added to the Forgejo static-quality gate alongside the existing three validators).

## 4. Page-level IA changes

| Page | Change |
|---|---|
| Home | Identity-first hero; sections: practices → what we build (portfolio strip) → products (covers) → insights + Operator Brief → community → evidence (compact) → contact. All existing data-event CTAs retained. |
| About | Full company story: who we are, what we build, practices, operating philosophy (evidence standard), founder, evolution timeline (from repo evidence: learning products → services → Sivanta → control plane → community), credentials section (moved from footers), no unsupported metric tiles. |
| Work (new) | Portfolio index with four groups: Owned products (Sivanta), Ventures & builds (SiteSupply), Community initiatives (Websites Round 01), Publications (8 playbooks). Each entry carries kind + status + evidence link. |
| Products | Catalogue redesigned with cover imagery; retains stage-10 ecosystem rendering (contract C7). |
| Services | Practice areas + fixed-scope offers + segment paths + engagement ladder; assessments cross-linked. |
| Results | Evidence standard, trust controls, reviews flywheel; **no citation of the withdrawn $216K narrative**; corrected description. |
| Insights (blog index) | Categories (FinOps · Kubernetes & Platform · AI & Automation · GitOps & Delivery · Company & Community), featured reading, Operator Brief promotion, newsletter CTA. |
| Operator Brief | First-class publishing property: hero, issue anatomy, archive, subscribe/unsubscribe (contracts C2/C3 preserved). |
| Community | Initiative page redesigned; Google Form + `data-google-form-cta` preserved (C6). |
| Segments ×3 | Shell + layout updated; copy preserved. |
| Sivanta | Shell-styled product page (own header removed); stage-10 renderer preserved (C9); pricing facts from `sivanta-offers.md`/registry only. |
| Trust / Reviews / Review / Analytics / 404 / temitayo | Shell-consistent styling; endpoints and noindex states preserved. |
| Blog articles + product pages | Header/footer/nav swapped to canonical shell; article bodies untouched. |

## 5. Journey cross-linking (new)

- Reader → article → related articles → Operator Brief subscribe → product (playbook CTA in article footers already exist).
- Product buyer → product page → catalogue → reviews (verified) → more products.
- Client → services → segment path → assessment → book call.
- Community participant → community page → Google Form → initiative updates (newsletter cross-link).
- Portfolio visitor → work → Sivanta/ SiteSupply article / community / publications.

## 6. Post-discovery reassessment (2026-08-27)

After the expanded GitHub ecosystem scan (`10-company-discovery-inventory.md`), the company model was reassessed:

- **No new public categories were added to the site.** The scan confirmed breadth (agent/automation platforms, storage tooling, e-commerce experiments, community builds) but every discovered project outside the published Tayoca model sits in `owner_confirmation_required` / `client_disclosure_unknown` states. The site's IA remains correct for what Tayoca can truthfully present today.
- **Classification states** were added to the company registry so the CMS and the owner can distinguish `public_verified` portfolio items from founder-ecosystem projects that must not be published without confirmation.
- **SiteSupply** remains the only discovery-scan project with enough public evidence to stay on the portfolio; its canonical surface is the launch article, corroborated by the public repo and live sites.
- The portfolio `kind` taxonomy (owned product / venture / client build / community initiative / publication / experiment / internal system / archived) already accommodates any project the owner later approves for publication — no taxonomy change needed.
