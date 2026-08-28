# Tayoca Automated Literature Revenue Engine

> **Stage 8 authority:** This document now describes a capability inside the unified Tayoca editorial operating system. It is **not** authority for a separate production literature workflow.
>
> Active editorial-generation authority: n8n workflow `MRaoY2aHm85q3QWG` — **Tayoca Growth OS | Demand Engine & Revenue Command Center**.
>
> Canonical policy: `editorial/editorial-policy.yaml`  
> Opportunity contract: `editorial/editorial-opportunity.schema.json`

## Consolidation rule
Tayoca must not run a parallel literature-production engine beside the Demand Engine. All newsletters, technical articles, executive briefs, case studies, product updates, LinkedIn posts, short-form social content, and sales-enablement assets originate from the **Editorial Opportunities** ledger in the existing Tayoca Growth OS spreadsheet.

A channel adaptation may change framing, length, or presentation, but it may not introduce a new factual claim that is absent from the approved opportunity's fact/evidence record.

Stage 7 repository intelligence may enter the opportunity ledger only as an internal editorial signal. Restricted repository intelligence is recorded as `no_publication`, remains `review_required`, is blocked from automatic LLM input, and cannot become public copy unless a human separately approves disclosure and supplies an approved public fact source.

## Goal
Turn verified commercial and editorial opportunities into evidence-bound channel assets, route them through human approval, and connect approved assets to measurable revenue paths without fabricating evidence or automatically publishing restricted information.

## Operating stages
1. Ingest or curate a canonical editorial opportunity containing source, fact, evidence, commercial significance, audience, story angle, format, disclosure classification, redaction requirements, approval state, CTA, campaign association, and performance record.
2. Fail closed unless the opportunity is `public_verified`, has disclosure safety of at least 80, is eligible for drafting, and is in `review_required` state.
3. Request explicit human **editorial approval** before any LLM drafting.
4. Generate one primary asset in the approved recommended format and channel adaptations from the same factual boundary.
5. Persist campaign/content rows with the originating `opportunity_id`, evidence, disclosure classification, redaction rules, approval state, source fact/reference, and revision.
6. Request a separate human **distribution approval** before a package is marked ready for distribution.
7. Keep paid-media spend at zero unless a later explicit spending approval authorizes a controlled test.
8. Record publication/performance through the existing Growth OS measurement system.
9. Feed verified performance back into opportunity prioritization without silently rewriting source facts.

## Supported formats
- newsletter
- technical article
- executive brief
- case study
- product update
- LinkedIn post
- short-form social content
- sales-enablement asset
- no publication

## Corrections
Corrections are append-only requests in **Editorial Corrections**. A valid correction creates a new opportunity revision, resets editorial approval to `review_required`, clears inherited campaign/approval state, marks the previous opportunity `superseded`, and records which revision replaced it. Previously approved or published content is never silently rewritten by the correction workflow.

## Guardrails
- No fabricated customer evidence, statistics, outcomes, popularity, scarcity, rankings, traffic, savings, or performance claims.
- No automatic public drafting from private/restricted repository intelligence.
- No automatic production publishing without explicit human approval.
- Editorial approval and distribution approval are separate decisions.
- No duplicate cross-posting without canonical attribution where applicable.
- Every asset retains one primary CTA and its evidence/traceability fields.
- Provider or generation failure is fail-closed: no campaign/content rows, publication, or paid spend are released.

## Historical note
The earlier design target of producing a fixed bundle of 18+ assets per campaign is superseded. Stage 8 uses **format routing from the approved opportunity** and channel adaptation from one evidence record instead of forcing every opportunity into the same asset count.
