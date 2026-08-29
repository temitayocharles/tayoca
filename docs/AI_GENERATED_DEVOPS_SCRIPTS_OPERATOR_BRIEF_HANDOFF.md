# AI-Generated DevOps Scripts / Operator Brief Handoff

Status: **handoff scope for canonical Forgejo reconciliation and global Tayoca control**

Date: 2026-08-28

## Purpose

This document preserves the book + newsletter scope that must be absorbed by the global Tayoca workstream. It is intentionally limited to the commercial publication and Operator Brief subscriber-entitlement workflow.

The public website redesign, site information architecture, visual redesign, and general Tayoca web experience are owned by the separate global website/company-platform workstream and are outside this handoff.

## Commercial book identity

Canonical public title: **AI-Generated DevOps Scripts**

Subtitle: **Python & Bash Practice Pack for Testing, Hardening, and Defending AI-Written Automation**

Canonical hook:

> **AI can write the script. Can you tell when it will fail or when it's doing too much?**

Historical/internal continuity:

- book source workspace: `temitayocharles/my-books/ai-to-engineer-python-bash-practice-pack`;
- historical `AI-to-Engineer` slug remains for provenance;
- historical release certification must remain immutable;
- executable labs must not be changed merely to perform the commercial title migration.

## Commercial status

The book is **not a free product**.

It is intended for commercial distribution through Amazon KDP, Gumroad, and other approved retail/direct storefronts. Storefront price, identifiers, metadata, territories, categories, and edition configuration must be established through the relevant publishing workflow and must not be invented.

The canonical book-repository policy is `COMMERCIAL_DISTRIBUTION.md` in the book workspace.

## Operator Brief entitlement model

The newsletter relationship is an entitlement, not a free-product classification.

Qualifying Tayoca Operator Brief subscribers may receive **complimentary access to the commercial digital edition** as a subscriber benefit. That entitlement must not:

- set the retail product price to zero;
- classify the title as permanently free;
- grant resale or redistribution rights;
- silently subscribe an address without explicit Operator Brief consent;
- bypass unsubscribe/suppression controls;
- create duplicate subscriber or entitlement records on repeat requests.

Preferred subscriber-facing concept: **Operator Brief subscribers receive complimentary access to the commercial digital edition.**

## Newsletter automation scope to preserve

The global Tayoca workstream must reconcile this feature into the existing Operator Brief / Growth OS / n8n architecture rather than create a parallel subscriber system.

Required behavior:

1. preserve explicit Operator Brief consent and the authoritative subscriber ledger;
2. record the entitlement source/cohort deterministically so book-assisted subscriber and revenue analysis remains possible;
3. grant the digital-book entitlement only after the subscriber state is durably accepted;
4. make entitlement/delivery idempotent for repeat requests;
5. stop newsletter nurture immediately when the subscriber unsubscribes or becomes suppressed;
6. persist provider/send/error evidence needed for troubleshooting without treating email-open tracking as authoritative;
7. keep the existing production failure/dead-letter controls in the execution path;
8. preserve attribution so complimentary subscriber distribution can be distinguished from retail/direct sales;
9. do not represent complimentary subscriber delivery as zero-value retail revenue;
10. do not create a second Operator Brief workflow, subscriber ledger, or analytics truth store when the existing governed systems can be extended safely.

## Welcome/nurture content

The existing five-message onboarding concept remains part of the handoff, but copy must reflect commercial status.

The sequence should:

- deliver or activate the subscriber's complimentary digital-book entitlement;
- teach practical review of AI-generated Python/Bash automation;
- reinforce failure + overreach judgment;
- introduce the seven review gates: Intent, Inputs, State, Failure, Safety, Evidence, Idempotency;
- transition the subscriber into the normal Operator Brief cadence;
- make contextual paid-product recommendations only when relevant.

It must **not** repeatedly describe AI-Generated DevOps Scripts as a free book or free product.

## Content/editorial continuity

The Production Interview content concept may continue as an editorial acquisition/nurture franchise where useful. Its purpose is to teach production reasoning rather than trivia and to create relevant bridges into the Operator Brief and the book.

Canonical format:

1. Scenario.
2. Basic answer.
3. Why it is incomplete.
4. Production answer.
5. What the interviewer is actually testing.
6. Evidence that would prove the answer.
7. Contextual book/newsletter bridge only where relevant.

## Book publication migration gate

Before the commercial edition is uploaded to KDP, Gumroad, or any other storefront, the canonical book workspace must:

1. run `validation/retitle_public_edition.sh`;
2. migrate the manuscript metadata to **AI-Generated DevOps Scripts**;
3. remove the old `New-subscriber practice edition` / `Free subscriber edition` metadata from the commercial artifact;
4. rebuild the PDF and cover assets;
5. rerun manuscript/code parity and the full-page render audit;
6. prove the executable lab tree is unchanged;
7. write and review `validation/PUBLIC_TITLE_MIGRATION.md`;
8. commit the rebuilt commercial artifacts before storefront upload.

The existing certified runtime behavior remains authoritative unless executable lab content changes.

## Source-authority / global handoff rule

Tayoca's global authority remains Forgejo-first. This handoff currently exists in the downstream GitHub mirror because the originating workstream did not have a Forgejo connector. The global Tayoca workstream must reconcile this exact intent through current canonical Forgejo `main` before production mutation.

When reconciling, preserve the scope above unless the owner explicitly changes it. Do not discard it merely because earlier GitHub lead-magnet work was classified as source drift.

Once this handoff is reconciled into Forgejo and the global workstream records ownership, the originating specialist chat may be retired. The global Tayoca workstream then owns the commercial-book + Operator Brief entitlement integration end to end.
