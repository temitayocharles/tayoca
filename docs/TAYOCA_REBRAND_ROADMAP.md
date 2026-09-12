# Tayoca Rebrand and Growth Roadmap

Status: **authoritative execution roadmap**

Version: **1.0**

Locked: **2026-09-12**

Canonical repository: `temitayocharles/tayoca` on Forgejo

Program authority: `docs/TAYOCA_PROGRAM_AUTHORITY.md`

Machine-readable rebrand state: `docs/TAYOCA_REBRAND_STATE.yaml`

Cross-program state: `docs/tayoca-program-state.yaml`

Growth operating plan: `docs/production-growth-operating-plan.yaml`

## 1. Purpose

This document is the durable driver for the Tayoca rebrand and the post-rebrand program that follows it.

A future chat, agent, or operator must be able to resume by saying **"continue Tayoca rebrand"**, **"resume Tayoca rebrand"**, or equivalent language without reconstructing the plan from conversational history.

The required behavior is:

1. read `AGENTS.md`;
2. read `docs/TAYOCA_PROGRAM_AUTHORITY.md`;
3. read this roadmap;
4. read `docs/TAYOCA_REBRAND_STATE.yaml` for the current phase/checkpoint;
5. query current canonical Forgejo `main`, open pull requests, relevant CI, deployment state, and live runtime evidence;
6. reconcile the documented checkpoint with current evidence;
7. continue the **highest-priority incomplete phase whose dependencies are satisfied**;
8. update this roadmap/rebrand state only when a phase boundary, completion verdict, dependency, or material operating decision changes.

Conversation history is context, not execution authority.

## 2. Precedence and scope

This roadmap governs the **Tayoca public-company rebrand and its follow-on customer, content, discoverability, quality, measurement, trust, and design-governance work**.

It does not supersede security, incident response, verified-revenue, private-source, recovery, or other source-of-truth policies. If a production incident interrupts this roadmap, resolve the incident, document the interruption, and resume this roadmap at the current phase afterward.

Where evidence disagrees, use the precedence in `docs/TAYOCA_PROGRAM_AUTHORITY.md`.

## 3. Locked baseline

The v9 sitewide visual direction is the accepted Tayoca design system baseline.

The rebrand is **sitewide**, not homepage-only. The system applies to company pages, services, projects/work, products, product detail pages, Operator Brief, editorial/Insights, community, assessments, trust/reviews, analytics, forms, navigation, footer, responsive states, and supporting/utility surfaces.

The design principles remain binding:

- authored, Figma-quality composition rather than generic AI-template styling;
- Spline Sans for primary interface/body typography and Newsreader for editorial emphasis;
- purposeful typography, hierarchy, spacing and asymmetry;
- compact controls rather than pill-heavy UI;
- no giant generic SaaS hero treatment;
- no decorative eyebrow/kicker spam;
- no repeated card-grid monoculture;
- no glow blobs, glassmorphism, purple/blue AI-template clichés, or meaningless motion;
- no fabricated metrics, clients, reviews, savings, partnerships, screenshots, certifications or outcomes;
- use real imagery, product assets and operational artefacts where truthful;
- customer-facing clarity over internal engineering manifesto language;
- every page may have its own composition while remaining unmistakably Tayoca.

## 4. Phase model

### Phase 1 — Production certification and cleanup

**Goal:** close the v9 migration as a certified production baseline and remove migration residue.

Scope:

- confirm protected-main CI after the final v9 residual fixes;
- verify Forgejo -> GitHub mirror parity;
- verify the promoted Vercel production deployment and aliases;
- verify representative live routes and theme/runtime behavior with Scrapling through Composio as the first-class browser when available;
- verify sitemap/indexability/public-shell integrity;
- remove temporary diagnostic branches/workflows/artifacts after their evidence is captured;
- create a durable v9 production certification/checkpoint;
- update program authority/state to point at the certified line.

Exit gate:

- canonical Forgejo revision identified;
- downstream mirror and production deployment identified;
- production aliases verified;
- required CI green;
- representative live browser certification green;
- no known temporary migration residue;
- certification committed to canonical Forgejo.

### Phase 2 — Conversion and customer journey

**Goal:** make the redesigned site convert qualified visitors rather than merely look better.

Primary journeys:

- visitor -> service understanding -> assessment -> qualified conversation;
- visitor -> Operator Brief -> recurring reader -> service/product interest;
- visitor -> product detail -> external purchase/use path;
- visitor -> work/evidence -> assessment/contact;
- community visitor -> initiative -> governed intake.

Scope:

- CTA hierarchy and consistency;
- assessment entry, form friction, success states and scheduling handoff;
- mobile conversion paths;
- product CTA clarity and destination integrity;
- Operator Brief signup and archive journey;
- dead-end detection;
- confirmation/error states;
- conversion instrumentation and attribution preservation;
- cross-page journey continuity.

Exit gate:

- every primary journey has a documented path and owner;
- no known dead-end or broken conversion route;
- forms and handoffs are tested without creating fake production records;
- meaningful conversion events are emitted and attributable;
- representative desktop/mobile journey tests pass.

### Phase 3 — Content architecture and authority

**Goal:** make Tayoca immediately understandable to a new visitor while increasing useful technical and commercial depth.

Scope:

- services and individual service narratives;
- customer-problem clarity;
- segment/audience pages;
- work/project/case-study structure;
- product vs service vs publication vs community taxonomy;
- About/company story;
- Operator Brief positioning;
- editorial/Insights quality and internal linking;
- terminology consistency;
- duplicate/weak copy removal;
- evidence-aware claims and disclosure classification.

Exit gate:

- an unfamiliar visitor can distinguish Tayoca's services, products, publications, projects and community work;
- major commercial pages answer problem, approach, evidence, engagement and next-action questions;
- content taxonomy is consistent across navigation, copy and data models;
- unsupported claims remain blocked by policy/validation.

### Phase 4 — Search, discoverability and structured data

**Goal:** make high-value Tayoca surfaces technically discoverable without SEO spam.

Scope:

- canonical/indexability audit;
- sitemap and robots governance;
- metadata and social previews;
- Schema.org Organization, Product, Article, Breadcrumb and applicable structured data;
- internal-link graph;
- Search Console coverage and sitemap health;
- content clusters around commercial service areas;
- crawlability and redirect integrity;
- technical SEO and search-performance baselines.

Exit gate:

- all intended canonical/indexable pages are represented correctly;
- no accidental indexable orphan or hidden canonical surface;
- structured data validates where used;
- Search Console and sitemap state are reconciled;
- discoverability changes preserve truthful content and user value.

### Phase 5 — Performance and accessibility hardening

**Goal:** make the site fast, accessible and reliable across the full public estate.

Scope:

- full canonical-route browser/a11y coverage, not only representative routes;
- keyboard traversal and focus behavior;
- light/dark contrast;
- reduced-motion behavior;
- responsive/mobile layouts;
- font loading and removal of legacy payloads;
- image sizing/compression/lazy loading where appropriate;
- unused CSS/JS and third-party request weight;
- slow-network/degraded behavior;
- Lighthouse/Core Web Vitals baselines and remediation.

Exit gate:

- full-route automated accessibility gate defined and green within agreed thresholds;
- no known horizontal overflow or blocking responsive regression;
- no known legacy font/design payloads outside explicitly approved exceptions;
- performance baselines documented with prioritized remediation complete.

### Phase 6 — Measurement and Growth OS

**Goal:** turn site and journey data into operational decisions.

Scope:

- verify critical journey events;
- funnel definitions;
- assessment conversion;
- Operator Brief growth and assisted conversion;
- product interest/outbound purchase intent;
- test-traffic separation;
- attribution integrity;
- executive analytics usefulness;
- integration with the existing Growth OS and governed commercial evidence.

Exit gate:

- measurement answers actionable business questions rather than only reporting page traffic;
- funnel definitions and event contracts are documented;
- test traffic is isolated;
- executive reporting has provenance and freshness rules;
- no fabricated zeroes, conversions, pipeline, revenue or outcomes.

### Phase 7 — Trust, evidence and commercial readiness

**Goal:** make Tayoca commercially credible using verifiable evidence and clear engagement boundaries.

Scope:

- Trust Center quality;
- evidence/provenance presentation;
- privacy/data-handling disclosures;
- service scope boundaries;
- pricing/engagement language;
- assessment-to-proposal workflow;
- verified reviews only;
- future case-study intake and approval;
- product/support expectations;
- disclosure decisions for unresolved projects/relationships.

Exit gate:

- public trust claims map to evidence or explicit disclosure status;
- commercial handoff from assessment to proposal is coherent;
- verified-review controls remain fail-closed;
- no unresolved disclosure item is silently upgraded into a stronger public claim.

### Phase 8 — Continuous design governance

**Goal:** prevent Tayoca from drifting back into inconsistent or generic design/content over time.

Scope:

- reusable page patterns and tokens;
- typography and composition rules;
- design-system documentation;
- theme/runtime tests;
- public-shell and metadata tests;
- anti-regression checks for legacy fonts/styles;
- content standards;
- periodic Scrapling production sweeps;
- rules for new pages, products, articles and experiments;
- explicit exceptions process.

Exit gate:

- new public surfaces can be added without recreating a second visual era;
- automated tests detect common v9 regressions;
- design/content governance is part of normal PR review;
- exceptions are documented rather than silently introduced.

## 5. Current checkpoint

Checkpoint date: **2026-09-12**

Current canonical production line before this roadmap document is merged:

- Forgejo `main`: `f9387d0eb8306f6e05134baceef627c94961bb8e`
- final v9 analytics residual repair: PR `#84`
- promoted GitHub mirror observed: `98af3353e93938980018f82ceee9805d9f63dc2a`
- promoted Vercel deployment observed: `dpl_DZukkTLPJgdRwar4qMyjM6UyVxLk`
- production aliases observed on that deployment: `tayoca.com`, `www.tayoca.com`

Phase status at lock time:

- Phase 1: **IN PROGRESS — final certification closeout**
- Phase 2: **NEXT**
- Phases 3-8: **PLANNED / LOCKED**

The first action when resuming is to reconcile Phase 1 against current CI/runtime evidence. If Phase 1 exit gates are satisfied, mark it complete in `docs/TAYOCA_REBRAND_STATE.yaml` and immediately begin Phase 2. Do not restart the v9 visual redesign unless a specific production defect or an explicitly approved new design requirement exists.

## 6. Resume protocol

When the user says **"continue Tayoca rebrand"**, **"resume Tayoca rebrand"**, **"continue Tayoca"** in the context of this program, or equivalent:

1. do not ask the user to restate these phases;
2. inspect canonical Forgejo `main` and this document;
3. inspect `docs/TAYOCA_REBRAND_STATE.yaml` for `current_phase` and `current_checkpoint`;
4. inspect open PRs and recent CI for that phase;
5. verify external/live state only where necessary for the current gate;
6. use Scrapling connected through Composio as the first-class browser for web inspection and production verification when available; use another browser only when Scrapling cannot perform the required capability or is unavailable;
7. continue autonomously from the checkpoint;
8. finish the current phase before advancing unless dependencies justify bounded parallel work;
9. update rebrand state/checkpoint evidence at every phase transition;
10. clean up temporary workflows/branches once their work is complete and evidence is retained.

A new chat must treat the repository documentation as the continuity mechanism. Cross-chat memory may help discovery but must not be required for correctness.

## 7. Change control

These phases are **locked as the default execution sequence**.

They may be changed only when one of the following is true:

- the user explicitly changes priorities or scope;
- a production incident/security issue requires interruption;
- a discovered dependency makes the current order unsafe or impossible;
- verified evidence shows that a phase is already complete or no longer applicable.

Any material change to the sequence must be documented in this file and `docs/TAYOCA_REBRAND_STATE.yaml` through canonical Forgejo. A chat-only decision is not sufficient.

## 8. Completion rule

The rebrand program is not complete when the website merely looks polished.

It is complete when the visual system, conversion journeys, content architecture, discoverability, accessibility/performance, measurement, trust/commercial systems, and ongoing design governance all meet their phase exit gates with verifiable evidence.
