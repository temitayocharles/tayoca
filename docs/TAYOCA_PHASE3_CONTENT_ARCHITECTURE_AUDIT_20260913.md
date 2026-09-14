# Tayoca Phase 3 — Content Architecture and Authority

Status: **IN PROGRESS — multiple authority remediations implemented**

Date: **2026-09-13**

## Scope

Phase 3 establishes a coherent public information architecture for Tayoca without collapsing materially different offer types into one generic catalogue.

## Verified defect 1 — public offer taxonomy

The public Products page loaded a Stage 10 runtime catalogue that described four internal registry families as one set of product families. This made software, publications, diagnostic assessments and ongoing managed services appear to be the same kind of offer.

The underlying Stage 10 registry remains useful as a governed commercial metadata source and is intentionally retained. The Phase 3 remediation changes the public semantics rather than deleting that governance model.

### Remediation

The Products page now presents an explicit offer map:

- **Software product** — Sivanta
- **Operator publications** — workbooks, playbooks, lab packs and checklists
- **Diagnostic engagements** — executive assessments
- **Ongoing services** — managed operations

The authored Products hero remains publication-led rather than being replaced at runtime by the generic Stage 10 heading.

## Verified defect 2 — Work portfolio authority

The Work page previously implied that every listed project was built and operated by Tayoca. That wording was stronger than the governed source authority for every portfolio item.

### Remediation

The Work page now distinguishes:

- owned Tayoca products such as Sivanta;
- publications and community programmes;
- selected project work whose relationship is presented neutrally unless the source authority confirms ownership or another stronger relationship.

SiteSupply remains visible as `Project / build · in market` while its registry authority remains unconfirmed. The page no longer describes all portfolio entries as things Tayoca is building and operating itself.

## Verified defect 3 — withdrawn evidence routes carried stale taxonomy

The two retained legacy AWS case-study URLs were already correctly withdrawn from proof use and marked `noindex,follow`, but their footer copy still used superseded service-category language. That created a Phase 3 taxonomy inconsistency on routes intentionally retained for link continuity.

### Remediation

Both withdrawn-evidence routes now:

- remain `noindex,follow`;
- remain explicit that the quantitative narrative is withdrawn and must not be used as public proof;
- use the current plain-language Tayoca company description;
- link Insights to the canonical `/blog/` library;
- expose Operator Brief and Trust Center as current publication/trust destinations;
- no longer carry the superseded `Technology Value & FinOps / Platform Reliability & DevSecOps / Agentic Operations & Automation` footer taxonomy.

The compatibility alias `/insights.html -> /blog/` remains an explicit 301 redirect, so existing navigation links can resolve without creating a second Insights content authority.

The remaining legacy visual/font payload on these withdrawn routes is not being treated as a Phase 3 content-authority blocker; full visual/performance normalization belongs to the locked performance/accessibility and design-governance phases unless it creates a content or trust defect.

## Regression gates

Permanent controls added or extended in this phase:

- `scripts/validate_content_architecture.py`
- `scripts/content_architecture_browser_check.cjs`
- `.forgejo/workflows/content-architecture.yml`

The browser gate checks rendered public taxonomy and authority semantics at desktop 1440×1000 and mobile 390×844. The static gate now also fails if the withdrawn evidence routes lose their noindex/proof-withdrawal safeguards, regain superseded service taxonomy, or if the `/insights.html` compatibility redirect stops resolving to the canonical `/blog/` library.

## Safety and continuity

- The Stage 10 product ecosystem registry remains intact.
- Existing service, assessment, product-detail and Sivanta runtime behavior remains in place.
- No unsupported client, outcome, credential or proof claim is introduced.
- Withdrawn AWS quantitative narratives remain withdrawn from proof use.
- No external purchase, form submission or production customer record is created by these remediations.

## Next Phase 3 work

Continue the content-authority audit across the remaining segment pages, editorial surfaces, duplicated or stale public copy, company/about language and cross-route navigation semantics. Only evidence-backed or explicitly governed claims should survive the Phase 3 exit gate.
