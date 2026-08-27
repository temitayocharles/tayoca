# LM Arena Brief: Rebuild Tayoca as a Living Company Platform

## Mission

Treat Tayoca as a real technology company with a growing body of work, not as a single consulting funnel and not as a DevOps-only website.

Your job is to study the existing repository and live site, independently research how strong modern technology companies present a similarly broad business, then redesign and implement the Tayoca web experience so visitors can quickly understand who the company is, what it builds, what it sells, what it publishes, what it contributes to communities, and how to work with it.

Do not begin by rewriting headings. Begin with discovery, information architecture, product/company modeling, visual direction, and evidence from the existing system.

## Company reality you must represent

Tayoca is an engineering-led technology company and builder. Its work spans several business expressions that should feel connected under one company rather than piled together:

- client technology delivery and application development
- AI, AI agents, workflow automation, integration, RAG/LLMOps and operational automation
- cloud economics, FinOps and technology-value work
- platform engineering, reliability, DevSecOps, Kubernetes, GitOps, observability and recovery
- owned software/products and experiments, including Sivanta and other applications/projects that must be verified from canonical sources before publication
- project and venture work such as SiteSupply and other products/builds that may currently be hidden in articles or repositories rather than represented as a portfolio
- books, playbooks, workbooks, labs, guides and educational products
- technical writing, blog/editorial publishing and the Operator Brief newsletter
- community projects, including the community website initiative
- practical teaching, enablement and technical content
- reusable internal automation and operating systems that support company delivery

Important: distinguish commercial products, client work, experiments, portfolio projects, community initiatives, publications and internal systems. Do not mislabel everything as a product or service just to simplify navigation.

## Current problem

The present public experience over-indexes on formal assessment/governance language. It makes Tayoca look primarily like an evidence-controlled consulting funnel around FinOps, reliability and automation.

That is a legitimate part of the company, but it is not the whole company.

The current site has valuable material, yet much of the company is difficult to discover:

- products and publications exist but feel secondary
- the Operator Brief newsletter exists but is buried
- the blog has useful material, including company/project stories, but its navigation and positioning are inconsistent with the main site
- community activity exists but is not central to the company story
- software/products/builds are not presented as a coherent portfolio of things Tayoca actually makes
- the About page is too thin to explain the company, its builder identity, operating philosophy, breadth of work or evolution
- visual storytelling is weak relative to the amount of real work available
- the site relies too heavily on formal text and not enough on product imagery, screenshots, editorial imagery, book covers, project visuals, human context and visual hierarchy
- navigation and footer language vary across parts of the site, making the business feel fragmented

The redesign must solve this structural problem, not merely make the existing funnel prettier.

## Existing system you must respect

### Source authority

Forgejo is canonical. GitHub exists as a downstream mirror/workspace for external tooling. Do not treat GitHub `main` as an independent production authority.

This branch is an external-agent workspace. Work here, make coherent commits, and do not merge directly into GitHub `main`. Final accepted work must be reconciled back into canonical Forgejo and certified there before production.

### Public application

The public site is largely in `public/**`, with static quality, analytics, editorial and product-ecosystem validation around it. Inspect the entire repository before changing architecture.

### Product model

`public/data/product-ecosystem.json` currently models several commercial families, including operator software, operator playbooks, executive assessments and managed operations. It is useful commercial data, but it is not a complete model of the company portfolio.

Do not force portfolio projects, community work, experiments and client builds into that commercial taxonomy. Propose an appropriate company-level content model where needed.

### CMS/control center

Tayoca has an active n8n-based Control Center/CMS that can read and mutate selected `public/**` content in canonical Forgejo, plus company automation for publishing, newsletter generation, community intake, growth/revenue operations, trust/reviews and distribution.

Treat those integration contracts as part of the platform. Before changing paths, content formats, page structure or content ownership, identify what automation depends on them. Do not casually break CMS or workflow contracts.

Do not give an external design/coding agent direct production CMS credentials or broad n8n control.

## Design direction

The redesign should feel like a confident, modern, human technology company that builds things.

It may use:

- strong editorial photography where appropriate
- generated but believable company/product imagery
- application screenshots and device/browser mockups
- product UI previews
- diagrams only when they genuinely clarify a system
- book and publication covers
- project artwork and case-study visuals
- community imagery and locally relevant photography where appropriate
- subtle motion and interaction where it improves comprehension
- varied page composition rather than endless identical cards

### Visual patterns to avoid

Do not default to:

- navy-blue or near-black generic AI landing-page backgrounds
- glowing blue/purple gradient blobs
- generic neural-network/network-node graphics
- meaningless circuit-board imagery
- fake dashboards created only as decoration
- excessive glassmorphism
- endless icon-card grids
- generic stock-team imagery that implies employees or clients who do not exist
- visual claims that cannot be supported

Do not make the site look like an AI-generated SaaS template.

The existing brand may evolve, but preserve recognizable Tayoca identity unless research produces a defensible reason to change it. Build a coherent visual system rather than independently styling every page.

## Experience goals

A first-time visitor should be able to answer these questions quickly:

1. What kind of company is Tayoca?
2. What does Tayoca build for organizations?
3. What software, projects or ventures has Tayoca built or is building?
4. What can I buy today?
5. What expertise can I hire Tayoca for?
6. What has Tayoca written or published?
7. What community or public-interest work is Tayoca doing?
8. Where can I see current thinking, articles and the newsletter?
9. What evidence or proof exists without the entire site sounding like a compliance document?
10. What should I do next if I want to become a client, customer, reader, partner, community participant or subscriber?

## Information architecture

Do not assume the existing IA should survive. Research and propose a better hierarchy.

The final system will likely need concepts similar to the following, but these are functional categories, not mandatory labels or hard-coded menu text:

- Company
- Solutions / Services
- What We Build / Portfolio / Ventures / Projects
- Products / Shop / Publications
- Client work / Results / Case studies where evidence permits
- Insights / Blog
- Newsletter / Operator Brief
- Community
- About / Story
- Contact / Work with us

You may combine or rename these after research. Optimize for comprehension and company identity, not for preserving old labels.

## Portfolio and project discovery

The owner has specifically identified work such as Sivanta, SiteSupply, Creator Prompter and other active application initiatives. The repository and connected systems may contain additional projects.

Do not publish unverified names, statuses, screenshots, client relationships or claims. Instead:

1. discover canonical references in the repository and available public sources;
2. determine whether each item is a Tayoca-owned product, a project, a client build, a community initiative, an experiment, an internal tool or something else;
3. determine whether it is appropriate for public disclosure;
4. then model and present it correctly.

A portfolio should show that Tayoca builds real things without disclosing private repositories, credentials, client-confidential information or unsupported claims.

## Content strategy

The site should have multiple visitor journeys, not one assessment funnel.

Examples:

- prospective client -> understand capability -> inspect work/evidence -> contact or book
- product buyer -> discover software/publication -> evaluate -> purchase/use
- reader -> discover article -> related article/project/product -> newsletter subscription
- community participant -> understand initiative -> participate through a trusted low-friction intake
- partner/collaborator -> understand company/projects -> contact
- engineer/learner -> discover books, labs, guides, teaching material and technical writing

Cross-link these journeys intelligently. Avoid hiding valuable content in footers or isolated pages.

The newsletter and blog should feel like active publishing properties of the company, not compliance appendices.

## Voice

Keep technical credibility and precise terminology. Do not dumb the company down.

However, write like humans at a capable company speaking to humans. Governance, evidence, security and operational rigor should support trust, not dominate every headline.

Use concrete examples and plain explanations alongside technical language where useful.

Do not hard-code new marketing copy merely because this brief contains examples. Derive final messaging from the company model, repository evidence, owner context and market research.

## Commercial intent

The redesign must support revenue without turning every section into a sales form.

Design clear pathways for:

- service/consulting leads
- software/product conversion
- publication sales
- newsletter audience growth
- community relationship building
- future product/project discovery

Make monetization legible while preserving company credibility and long-term brand value.

## Required research before implementation

Before choosing a design or IA:

1. audit the complete Tayoca repository and live site;
2. inventory all current public pages, products, articles, project references, media assets and CTAs;
3. identify inconsistent navigation, duplicate positioning and orphan pages;
4. inspect the existing content/product data models and static validators;
5. identify CMS/automation-sensitive paths and contracts from repository evidence;
6. research a current set of high-quality technology companies, studios, product companies and engineering firms with comparable breadth;
7. study how they balance services, products, portfolio, thought leadership, company story and conversion;
8. extract principles rather than copying layouts or wording;
9. produce an architecture and visual rationale before large-scale implementation.

Your benchmark set should include different business models, not only DevOps consultancies and not only AI SaaS startups.

## Implementation expectations

Work end to end, like a publisher, product designer, UX architect and senior frontend engineer.

Inspect every changed page at realistic desktop and mobile sizes. Check:

- page-to-page consistency
- responsive behavior
- navigation and mobile menu
- typography and readable line length
- image crop and loading behavior
- accessibility
- keyboard focus
- contrast
- link/CTA correctness
- page jumps and anchors
- overflow
- layout shifts
- duplicated sections
- broken assets
- metadata, Open Graph and structured data where relevant
- internal linking
- sitemap/discoverability
- performance
- visual repetition
- empty or placeholder states
- CMS-sensitive content paths

Reuse and improve existing assets where they are good. Add new assets where the experience needs them.

## Safety and truthfulness

Never invent:

- customers
- testimonials
- revenue
- savings
- certifications
- team members
- partnerships
- project ownership
- uptime
- client results
- screenshots presented as real production screens when they are fabricated

Existing evidence controls exist for a reason. Keep them, but place them where trust decisions require them rather than making them the whole brand personality.

## Deliverables

Produce, in the repository:

1. a concise discovery/audit document;
2. proposed company information architecture and content model;
3. visual/design-system rationale with references and principles;
4. an implementation plan split into safe, reviewable stages;
5. the actual redesign across the necessary pages/components/assets;
6. migration notes for changed paths/content contracts;
7. a final QA report covering desktop, mobile, accessibility, performance and broken-link checks;
8. a clear list of anything that requires owner confirmation because evidence or public-disclosure status could not be established.

Do not stop after making the homepage attractive. The assignment is complete only when the website feels like one coherent company across its major public surfaces.
