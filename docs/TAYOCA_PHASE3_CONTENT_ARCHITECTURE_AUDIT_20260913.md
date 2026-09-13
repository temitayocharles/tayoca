# Tayoca Phase 3 — Content Architecture and Authority

Status: **IN PROGRESS — first remediation implemented**

Date: **2026-09-13**

## Scope

Phase 3 establishes a coherent public information architecture for Tayoca without collapsing materially different offer types into one generic catalogue.

## First verified defect

The public Products page loaded a Stage 10 runtime catalogue that described four internal registry families as one set of product families. This made software, publications, diagnostic assessments and ongoing managed services appear to be the same kind of offer.

The underlying Stage 10 registry remains useful as a governed commercial metadata source and is intentionally retained. The Phase 3 remediation changes the public semantics rather than deleting that governance model.

## Remediation

The Products page now presents an explicit offer map:

- **Software product** — Sivanta
- **Operator publications** — workbooks, playbooks, lab packs and checklists
- **Diagnostic engagements** — executive assessments
- **Ongoing services** — managed operations

The authored Products hero remains publication-led rather than being replaced at runtime by the generic Stage 10 heading.

## Regression gates

Permanent controls added in this phase:

- `scripts/validate_content_architecture.py`
- `scripts/content_architecture_browser_check.cjs`
- `.forgejo/workflows/content-architecture.yml`

The browser gate checks the rendered Products taxonomy at desktop 1440×1000 and mobile 390×844, while retaining the existing product/company/editorial validators.

## Safety and continuity

- The Stage 10 product ecosystem registry remains intact.
- Existing service, assessment, product-detail and Sivanta runtime behavior remains in place.
- No unsupported client, outcome, credential or proof claim is introduced.
- No external purchase, form submission or production customer record is created by this remediation.

## Next Phase 3 work

Continue the content-authority audit across segment pages, editorial surfaces, portfolio/project classifications, duplicated or stale public copy, and cross-route navigation language. Only evidence-backed or explicitly governed claims should survive the Phase 3 exit gate.
