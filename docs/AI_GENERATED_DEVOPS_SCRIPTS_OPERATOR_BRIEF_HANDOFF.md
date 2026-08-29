# AI Wrote the Script. Can You Defend It? / Operator Brief Handoff

Status: **final specialist handoff for canonical Forgejo reconciliation and global Tayoca control**

Date updated: 2026-08-29

## Purpose

This document preserves the commercial-book + Operator Brief scope that must be absorbed by the global Tayoca workstream. It is intentionally limited to the book, its commercial distribution, and the newsletter subscriber-entitlement workflow.

The public website redesign, site information architecture, visual redesign, landing pages, and general Tayoca web experience are owned by the separate global website/company-platform workstream and are outside this handoff.

## Canonical commercial book identity

**Title:** AI Wrote the Script. Can You Defend It?

**Subtitle:** 10 Hands-On Python & Bash DevOps Labs for Debugging, Testing, and Hardening AI-Generated Automation Before Production

**Hook:** AI can write the script. Can you tell when it will fail or when it's doing too much?

**Author:** Temitayo Charles Akinniranye

Historical/internal continuity:

- book source workspace: `temitayocharles/my-books/ai-to-engineer-python-bash-practice-pack`;
- historical `AI-to-Engineer` slug remains only for provenance;
- historical runtime/release certification remains immutable;
- executable labs must not be changed merely for commercial packaging or entitlement work.

## Commercial publication status

The book is a **paid commercial publishing product**, not a free lead magnet.

Canonical commercial channels include Amazon KDP, Gumroad, other approved retail/direct storefronts, and Tayoca direct distribution where appropriate.

The controlled commercial rebuild is complete. The canonical customer artifact is the LM Arena-preserving edition:

`publication/pdf/AI-Wrote-the-Script_Can-You-Defend-It_v1.0.pdf`

The migration evidence records:

- final page count: 59;
- outline entries: 37;
- render audit: 59/59 with zero reported layout issues;
- executable lab tree unchanged;
- old `Free subscriber edition` and `New-subscriber practice edition` wording removed;
- commercial title metadata verified;
- LM Arena visual system preserved from the certified baseline.

Book-repository publication sources of truth:

- `COMMERCIAL_DISTRIBUTION.md`
- `KDP_METADATA.md`
- `DIRECT_SALE_PACKAGE.md`
- `NEWSLETTER_SUBSCRIBER_SEQUENCE.md`
- `validation/PUBLIC_TITLE_MIGRATION.md`

## Storefront decisions prepared

### Amazon KDP

Current prepared metadata recommends:

- paperback launch first;
- 8.5 x 11 inch trim matching the certified interior;
- premium color on white paper to preserve the LM Arena accent system at 59 pages;
- matte cover;
- no spine text because the edition is below KDP's spine-text page threshold;
- USD $19.99 recommended paperback list price;
- own ISBN recommended for the paperback because the product is intended for multi-channel commercial distribution;
- Kindle edition only after Kindle-specific conversion/QA;
- no KDP Select while the digital edition is sold/distributed outside Amazon.

The print cover still requires the final KDP wrap generated against the live KDP cover template/calculator and a physical proof before sale.

### Gumroad / direct digital

Prepared direct-sale launch price: **USD $14.99**.

The direct-sale package is defined as a versioned bundle containing the certified PDF, customer README, personal-use commercial license, and the runtime-certified companion lab tree. Retail/direct sales remain financially distinct from Operator Brief subscriber entitlements.

## Operator Brief entitlement model

Qualifying Tayoca Operator Brief subscribers may receive **complimentary access to the commercial digital edition as a subscriber benefit**.

This entitlement must not:

- set retail price to zero;
- classify the book as free or a giveaway product;
- grant resale or redistribution rights;
- silently subscribe an address without explicit Operator Brief consent;
- bypass unsubscribe or suppression controls;
- create duplicate subscriber, entitlement, nurture, or delivery records;
- record complimentary entitlement as retail revenue.

Preferred subscriber-facing language: **Operator Brief subscribers receive complimentary access to the commercial digital edition of AI Wrote the Script. Can You Defend It?**

## Required newsletter/runtime behavior

The global Tayoca workstream must extend the existing Operator Brief / Growth OS / n8n architecture. Do not create a second subscriber system, duplicate Operator Brief workflow, parallel analytics store, or book-specific email platform when the governed systems can be extended safely.

Required behavior:

1. accept only explicit Operator Brief consent and persist it in the authoritative subscriber ledger;
2. persist a deterministic entitlement key for this book and the source/cohort that created it;
3. grant entitlement only after the subscriber state is durably accepted and suppression checks pass;
4. make subscriber, entitlement, nurture membership, and delivery idempotent;
5. allow repeat access requests to resend access instructions without duplicating future nurture jobs;
6. stop nurture immediately after unsubscribe, suppression, or administrative cancellation;
7. persist provider send IDs, workflow execution IDs, delivery/error states, and normalized failure classes for troubleshooting;
8. keep production failure/dead-letter controls in the execution path;
9. preserve attribution so subscriber entitlement can be analyzed separately from Gumroad/KDP/direct sales;
10. do not treat email-open tracking as authoritative evidence;
11. use a stable subscriber-access mechanism that delivers the same certified commercial edition/checksum as the direct-sale package;
12. never expose private repository paths, source archives, publishing fonts, validation internals, credentials, or unrelated files to subscribers.

## Five-message subscriber sequence

The canonical copy intent is maintained in the book workspace at `NEWSLETTER_SUBSCRIBER_SEQUENCE.md` and now uses the final title.

Sequence:

- Email 0: immediate entitlement after durable subscription acceptance;
- Email 1: +1 day, false success / exit status / evidence;
- Email 2: +3 days, hypothesis-before-AI review and overreach boundaries;
- Email 3: +5 days, seven review gates: Intent, Inputs, State, Failure, Safety, Evidence, Idempotency;
- Email 4: +7 days, next-practice guidance and transition into normal Operator Brief cadence.

The book must never be repeatedly described as a free product. The newsletter benefit is complimentary access to a commercial edition.

## Live-runtime activation gate

This GitHub mirror does not prove the current n8n runtime state. Before production mutation, the global Tayoca workstream must:

1. reconcile this handoff through current canonical Forgejo `main`;
2. re-query the live Operator Brief / Growth OS / n8n workflows and active versions;
3. capture rollback versions before mutation;
4. implement the entitlement as the narrowest extension of the existing governed subscriber workflow;
5. run a synthetic subscriber acceptance test covering first subscription, repeat request, entitlement delivery, nurture scheduling, unsubscribe and suppression;
6. verify no duplicate subscriber/entitlement/nurture records;
7. verify the delivered PDF/bundle checksum matches the certified commercial package;
8. record production evidence and ownership in the global Tayoca control plane.

## Retirement rule

The originating specialist chat has completed the commercial title migration, KDP metadata preparation, direct-sale packaging specification, and final Operator Brief handoff.

After the global Tayoca workstream reconciles this exact handoff into canonical Forgejo and takes ownership of the live Operator Brief entitlement implementation, this specialist chat may be retired. Future book/newsletter changes should then flow through the global Tayoca control plane plus the canonical `my-books` publication workspace rather than through a separate parallel workstream.
