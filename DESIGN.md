# Tayoca Flagship Website Design Specification

Status: implementation specification for `feat/tayoca-flagship-home-20260911`
Date: 2026-09-11
Canonical source: Forgejo `temitayocharles/tayoca`
Production target: `tayoca.com`

## 1. Product intent

Tayoca.com is the public front door to an engineering-led technology company, not a consulting template and not a portfolio microsite. The homepage must explain the company quickly, establish commercial relevance, demonstrate that Tayoca builds real things, preserve evidence discipline, and create multiple monetizable visitor paths without turning the page into a directory.

Primary business goal: qualified commercial movement into assessments and consultations.
Secondary goals: product revenue, Operator Brief subscriber growth, software/product discovery, trust, and community participation.

## 2. Audiences

Primary:
- CTO, VP Engineering, Head of Platform, SRE/DevOps lead
- CFO, FinOps lead, cloud/platform owner
- COO, operations leader, AI/automation owner

Secondary:
- technical operators buying publications
- partners and collaborators
- readers and newsletter subscribers
- community website applicants

## 3. Surface archetype

Hybrid corporate platform + evidence-led commercial site + editorial/product surface.

The homepage is not a long catalogue. It is a routing and confidence-building layer with five clear jobs:
1. state the business value
2. expose the three core operating problems
3. show what Tayoca can sell or deliver now
4. show that Tayoca actually builds and publishes
5. route the visitor to one measurable next action

## 4. Conversion architecture

Primary CTA: `Start an Assessment` -> `/assessments.html`
Secondary commercial CTA: `Explore Services` -> `/services.html`
Direct conversation CTA: consultation link from canonical site settings
Product path: `/products.html`
Owned software/build path: `/work.html` and `/sivanta.html`
Nurture path: `/operator-brief.html`
Trust path: `/results.html` and `/trust.html`
Community path: `/community/websites`

No new offer, price, testimonial, customer, metric, certification, availability claim, or social proof may be invented.

## 5. Information architecture

### Header
Locked canonical primary navigation, with one primary CTA. The secondary utility rail is retained but visually quieter.

### Homepage sequence
1. Hero: concise company proposition + two primary actions + evidence note
2. Decision rail: three core operating problems, expressed as questions
3. Commercial offers: concrete current engagement anchors with existing approved prices
4. Build proof: Sivanta, SiteSupply, publications and community initiative using existing real assets
5. Evidence standard: explain how claims are handled
6. Operator Brief: editorial/nurture surface and subscription form
7. Products: a compact publication strip rather than a second store homepage
8. Final conversion: assessment, consultation, email

The long explanatory `seven kinds of work` block is removed from the homepage and delegated to About/Work, where visitors who want taxonomy can explore it without forcing every first-time visitor through it.

## 6. Visual system

Art direction: **industrial editorial / operating ledger**.

The interface should feel like a modern engineering company with an editorial discipline: dark ink, warm paper, measured orange signal, steel-blue secondary signal, strong rules, real photography and real product artwork. Avoid decorative AI tropes, fake dashboards, glassmorphism and repetitive rounded cards.

### Color
- Ink: `#0b0c0d`
- Ink raised: `#141619`
- Warm paper: `#f2eee6`
- White: `#fffdf8`
- Text dark: `#17191c`
- Text light: `#f4f1ea`
- Muted dark: `#706b63`
- Muted light: `#a7a29a`
- Tayoca orange: `#f97316`
- Orange dark: `#c65308`
- Steel signal: `#5b8ca8`
- Hairline dark: `#2b2d30`
- Hairline paper: `#d9d1c4`

### Typography
Fresh system for this project:
- Display/headings: `Archivo`
- Body: `Source Sans 3`
- Technical labels: `IBM Plex Mono`

No Inter, no generic system-font-first stack, no oversized AI-style hero type. Homepage H1 caps at approximately 64px desktop and 42px mobile.

### Spacing
8px base rhythm.
- compact: 8 / 12 / 16
- content: 24 / 32
- sectional: 64 / 80 / 96

### Radius
Mostly squared or small radii, 6-10px. Large rounded containers and excessive pills are avoided.

### Motion
Motion is optional and comprehension-led only:
- subtle image zoom on hover
- short 120-180ms focus/hover transitions
- existing reduced-motion behavior remains authoritative

## 7. Composition rules

- Prefer rails, ruled rows, editorial splits, media-led panels and tabular offer layouts over identical card grids.
- Use real repository assets before external imagery.
- Keep paragraphs under roughly 70 characters per line where practical.
- Every section must have a clear visual hierarchy and one job.
- CTAs should not compete. Each section gets one primary action, with secondary actions visually quieter.
- Avoid fake numerical metrics. Existing pricing and counts may be shown only where already approved in canonical content.

## 8. Accessibility

- Preserve skip link, landmark structure, locked navigation semantics and mobile menu behavior.
- Maintain visible focus states.
- Minimum target size 44px for principal interactive controls on touch layouts.
- Do not encode meaning by color alone.
- Decorative images use empty alt; content images retain meaningful alt.
- Respect `prefers-reduced-motion`.
- Maintain WCAG AA text contrast.

## 9. Responsive behavior

Desktop: editorial split layouts and 12-column composition.
Tablet: reduce to two-column sections where content remains legible.
Mobile: single-column flow, no horizontal content overflow, sticky header remains compact, CTA hierarchy preserved.

Product cover strip may horizontally scroll on mobile but must remain keyboard accessible.

## 10. Performance

- Static HTML remains the delivery model.
- Existing image assets are reused.
- Hero image remains locally hosted and explicitly dimensioned.
- No UI framework or client-side rendering dependency is introduced.
- JavaScript remains progressive enhancement.
- Google Fonts are the only new network dependency, using preconnect and three families only.

## 11. SEO and trust

Preserve:
- canonical URL
- robots indexing policy
- Open Graph/Twitter metadata
- Organization/WebSite JSON-LD
- sitemap/internal-link validity
- blocked-claim enforcement
- evidence language

Homepage title and description should emphasize technology value, reliability and governed automation while remaining faithful to canonical positioning.

## 12. Implementation boundaries

The locked primary nav is not renamed or reordered because `scripts/validate_static_site.py` enforces it.
The Tayoca public shell and `tayoca-site.js` remain loaded.
Stage 10 product ecosystem contracts are not renamed or modified.
No Control Center, CMS, n8n workflow, revenue authority, private evidence, or authentication plane is replaced.

## 13. Design-system research fallback

The requested canonical `ui-ux-pro-max` and 21st.dev Magic MCP tools are not exposed in this execution environment. Their intent is preserved through a formal design-system pass, repo-native component reuse, visual-reference research, and explicit typography/color/spacing/motion specifications before implementation. No claim is made that those unavailable tools were used.

## 14. Acceptance criteria

- Homepage presents Tayoca as a broad engineering-led technology company within the first viewport.
- Primary commercial path is unambiguous.
- Real work and products appear above low-priority explanatory content.
- No unsupported claim is added.
- Locked primary navigation passes unchanged.
- Existing analytics hooks remain intact for principal CTAs.
- Desktop and mobile layouts have no intended horizontal overflow.
- Source remains static, maintainable, and deployable through the existing Vercel project.
