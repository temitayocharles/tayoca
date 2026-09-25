# Tayoca Sitewide Design System

Status: **LM Arena v2 is the current public-site presentation authority** as of 2026-09-25.
Canonical source: Forgejo `temitayocharles/tayoca`
Production target: `tayoca.com`

## Current authority

The complete LM Arena v2 presentation is authoritative for the public site. Its layout, imagery, content architecture and visual primitives must not be filtered, selectively replaced or reinterpreted without an explicit later design decision.

Current Arena primitives include `hero-cinema`, `paper-band`, `ledger-label`, `portfolio-card`, the near-black / orange / warm-paper palette in `public/assets/css/site-shell.css`, and the official founder-supplied Tayoca logo at `public/assets/tayoca-logo-official.svg`.

Post-Arena additions may restore required routes, analytics, campaign surfaces, integrations, accessibility, SEO metadata, reliability controls and official brand assets, but should preserve Arena composition unless a later approved design change explicitly supersedes it.

The v9 specification below is retained as historical design lineage. It is **not** the implementation authority where it conflicts with LM Arena v2.

## Historical v9 specification

Status at the time: **locked implementation specification** for `feat/tayoca-sitewide-figma-v9-20260911`
Date: 2026-09-11

## 1. Design decision

The approved v9 direction is now the sitewide Tayoca visual system, not a homepage-only concept.

The public site must feel deliberately art-directed, as if composed in Figma by a strong product/brand designer, while remaining static, accessible, fast, maintainable and truthful. AI may assist implementation, but the result must not expose common AI-site defaults through oversized hero type, eyebrow labels on every section, repeated three-card grids, decorative numbering, excessive pills, generic SaaS gradients, fake dashboards, or interchangeable marketing copy.

LAFABAH Houston was reviewed as a quality/process benchmark. Tayoca must not copy its visual identity. The transferable lesson is specificity: real content, real imagery, coherent typography, strong cultural/brand signals, varied composition and deliberate page-by-page art direction.

## 2. Company and audience

Tayoca is an engineering-led technology company and builder spanning:
- technology value / FinOps
- platform reliability / DevSecOps / GitOps
- AI, RAG, LLMOps and workflow automation
- owned software and project builds
- publications and operator education
- Operator Brief editorial work
- community initiatives

Primary audience:
- CTO, VP Engineering, Head of Platform, SRE/DevOps leads
- CFO, FinOps and cloud owners
- COO and automation owners

Secondary audience:
- technical operators and learners
- product/publication buyers
- partners and collaborators
- community participants

## 3. Customer-facing voice

The website talks directly to people. It explains recognizable problems and useful outcomes instead of performing technical sophistication.

Preferred language:
- “Your cloud bill keeps growing and nobody can clearly explain why.”
- “If your team repeats the same work every week, we can automate the repeatable part.”
- “Before we recommend a fix, we first find out what is actually happening.”

Avoid:
- manifesto copy
- defensive comparisons such as “not a slide deck”
- ambiguous punchlines
- unnecessary internal terminology
- generic AI phrases such as “from complexity to capability” unless a page genuinely needs them
- repeated eyebrow/flag headings such as “PROOF IN PRACTICE”, “SELECTED ENGAGEMENTS”, “EVIDENCE STANDARD”

## 4. Sitewide information architecture

The approved system applies across:
- Home
- Services
- Assessments
- Results / evidence
- Work / projects
- individual project/product surfaces such as Sivanta
- Products and product-detail pages
- Operator Brief and archive/editorial pages
- About
- Trust
- Community pages
- Reviews
- blog/article pages
- contact/conversion flows
- 404 and supporting utility surfaces

Shared brand language does **not** mean identical page composition. Each archetype must have its own layout logic:
- Home: orientation + problem recognition + selected proof + routing
- Services: customer problems + engagement choices + process + scope
- Work: visual project catalogue + project narratives
- Editorial: reading-first, typographically distinct
- Product detail: product evaluation and purchase/use path
- Trust/results: evidence-first, quieter and more structured
- Community: human/local visual language
- About: company story, breadth and operating principles

## 5. Locked v9 visual system

### 5.1 Color

Light:
- Canvas: `#FFFFFF`
- Surface soft: `#F4F7FA`
- Surface cool: `#EDF2F7`
- Ink: `#18242D`
- Strong ink: `#0B1620`
- Muted: `#53616C`
- Soft text: `#7B8790`
- Deep navy: `#102B3A`
- Deepest navy: `#081923`
- Cobalt primary: `#3157D5`
- Cobalt deep: `#203FA5`
- Coral signal: `#EF6A4B`
- Sage annotation: `#74948A`
- Hairline: `#DCE3E8`
- Strong hairline: `#AEBAC2`

Dark:
- Canvas: `#09131A`
- Surface: `#0E1C25`
- Surface soft: `#132630`
- Surface cool: `#182F3A`
- Ink: `#E8EEF2`
- Strong ink: `#FFFFFF`
- Muted: `#B7C1C8`
- Soft text: `#8E9AA3`
- Cobalt: `#6F8CFF`
- Coral: `#FF8466`
- Sage: `#8DB1A6`

Rules:
- Cobalt is the primary interaction/action colour.
- Coral is a signal/accent, not a page wash.
- Sage is for annotation/drafting detail only.
- Do not reintroduce petrol/orange as the dominant system.
- Do not use generic blue/purple glow blobs.

### 5.2 Typography

Primary interface family: **Spline Sans**
Editorial family: **Newsreader**

Usage:
- Spline Sans: navigation, UI, headings, service copy, project copy, forms, controls
- Newsreader: Operator Brief, long-form editorial moments and selective reading-led headings

Typography rules:
- No giant AI-style hero type.
- Desktop H1 target: roughly 36–48px on common screens, responsive by content.
- H2 target: roughly 28–40px.
- Body: approximately 16–18px with 1.6–1.75 line-height.
- Favor line length and placement over scale for hierarchy.
- Do not use uppercase micro-labels as default section headings.
- No automatic all-caps tracking treatment for every metadata element.

### 5.3 Shape and controls

- Small controlled radii: 6px controls, 12–18px selected media/sheets.
- Buttons are compact rectangular controls, not oversized pills.
- Pills/chips are reserved for actual status semantics only.
- Shadows are subtle and depth-specific; avoid floating-card wallpaper.

### 5.4 Annotation language

The earlier hand-sketched direction is retained only as a restrained drafting/annotation system.

Use:
- occasional offset border
- short field-note annotation
- route/flow marks
- measured imperfect line
- selected image/project framing

Do not use:
- faux-handwritten headings everywhere
- double scribble borders around every card
- cartoon doodles
- decorative arrows without information value

## 6. Composition rules

1. Content determines composition; page templates do not force all content into one grid.
2. Use asymmetry deliberately.
3. Prefer editorial splits, ruled rows, image-led narratives, working sheets, flow diagrams and staggered media.
4. Do not repeat identical section grammar three or more times in sequence.
5. Avoid default 3-up feature/service grids when a row, story, comparison or split is more natural.
6. Real imagery appears early enough to establish identity.
7. Project pages explain what the project does; they do not defend it against hypothetical criticism.
8. Customer problems are described in recognizable language before implementation jargon.
9. Page endings should feel conversational rather than like generic SaaS CTA banners.
10. Every section must have one clear job.

## 7. Imagery

Priority order:
1. verified real repository/project imagery
2. actual product/interface artefacts
3. documentary-style generated scenario imagery where disclosure is not misrepresented
4. diagrams built from real system concepts

Generated scenario imagery must feel documentary rather than synthetic:
- ordinary working environments
- believable lighting
- non-perfect composition
- real-world clutter where appropriate
- no cinematic “AI engineer looking at holograms” scenes
- no invented client/team implication

Approved study scenarios include:
- cloud-spend review
- operations/reliability work
- repetitive administrative work
- construction supplier/buyer context for SiteSupply
- local-business collaboration for the community initiative

## 8. Motion

Motion is restrained and functional:
- 150–600ms entrance/reveal where useful
- slight image movement on hover
- quiet line/flow animation for diagrams
- subtle moving grid only where it communicates an active working surface
- no heavy parallax
- no constant decorative motion across the whole page

`prefers-reduced-motion` must fully suppress nonessential animation.

## 9. Theme architecture

Light and dark modes must be complete theme states. No section may remain permanently dark or permanently light unless it is a deliberate media asset with sufficient contrast.

All major surfaces, text, borders, forms, controls and annotations derive from theme tokens.

First visit may respect system preference. User choice must persist locally.

## 10. Navigation and shared shell

The locked canonical primary navigation order remains unchanged because `scripts/validate_static_site.py` enforces it.

Existing analytics hooks, form contracts, `tayoca-site.js`, Stage 10 product ecosystem contracts and public routes must remain intact.

The design system may restyle the shell but must not silently rename or remove validated navigation routes.

## 11. Page-specific art direction

### Home
Problem recognition, real-work imagery, selected services, projects, editorial and a human final question.

### Services
Use customer-problem narratives and distinct engagement compositions. Pricing is retained only where already canonical. Avoid three equal service cards as the primary presentation.

### Assessments
Decision-support interface. Explain when each assessment is useful and what the visitor needs to provide. Keep forms calm and legible.

### Work
Image-led project catalogue. SiteSupply, Sivanta and community work should explain the real use case directly.

### Operator Brief / blog
Reading-first. Newsreader may carry titles/decks. The interface should feel editorial, not like a SaaS dashboard.

### Products
Real covers/artifacts. Product detail pages should feel like carefully designed publishing/product pages, not repeated store cards.

### About
Human company story and operating breadth. Avoid a wall of capability taxonomy.

### Results / Trust
Quiet, structured, evidence-led layouts. Do not turn evidence policy into marketing theatre.

### Community
Warmer and more local/human in composition while still unmistakably Tayoca.

## 12. Accessibility

- Preserve skip links and landmarks.
- Visible focus states.
- Principal touch targets at least 44px.
- WCAG AA contrast.
- Meaning must not depend on colour alone.
- Content imagery has useful alt text; decorative imagery has empty alt.
- Mobile menu remains keyboard/screen-reader operable.
- Reduced-motion is authoritative.

## 13. Responsive behavior

Desktop: varied editorial compositions, not a universal 12-column grid exposed everywhere.
Tablet: compositions simplify without losing hierarchy.
Mobile: single-column reading order, compact header, clear CTA priority, no horizontal overflow.

## 14. Performance

- Static HTML remains the delivery model.
- No frontend framework is introduced for the redesign.
- JavaScript stays progressive enhancement.
- Images are locally hosted or intentionally optimized before production use.
- Font loading is limited to the locked Spline Sans + Newsreader system unless a later documented brand decision changes it.

## 15. Truth and safety boundaries

Never invent or imply unsupported:
- clients
- testimonials
- revenue
- savings
- uptime
- partnerships
- employees/team members
- certifications
- project ownership
- production screenshots
- project outcomes

Existing approved prices may remain:
- Cloud Cost Optimization Engagement: `$5,000 flat fee`
- GitOps & DevSecOps Platform Engagement: `$8,000+ fixed scope`
- AI Automation / RAG / LLMOps Pilot: `From $5,000`

## 16. Implementation order

1. Lock this design specification.
2. Introduce sitewide design tokens and typography.
3. Restyle canonical header/footer/shared shell.
4. Rebuild Home from approved v9 direction.
5. Recompose Services, Assessments, Work and About.
6. Recompose Operator Brief/editorial and Products/product detail.
7. Recompose Results, Trust, Community and supporting surfaces.
8. Replace synthetic-looking imagery with approved real/documentary assets.
9. Run static validation, route parity, editorial/claim validation and accessibility audit.
10. Browser-test desktop and mobile.
11. Deploy preview, review visually, correct composition before cosmetic details.
12. Merge through protected main only after required checks pass.
13. Verify production aliases, runtime assets, analytics hooks and live responsive behavior.

## 17. Acceptance criteria

- The whole site feels like one designed brand system without every page sharing one template.
- No major route still looks like an older Tayoca design era.
- No common AI-slop composition dominates the site.
- Customer-facing language is human and specific.
- Real work and imagery are visible.
- Typography and color match this specification.
- Header/footer/theme behavior is consistent sitewide.
- Existing routes, analytics, forms and validated contracts remain functional.
- Desktop and mobile pass visual and accessibility review.
- No unsupported claim is introduced.
