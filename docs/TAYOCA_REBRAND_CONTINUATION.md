# Tayoca Rebrand Continuation Pointer

This file exists as a compact human-readable entry point for future sessions.

Authoritative roadmap: `docs/TAYOCA_REBRAND_ROADMAP.md`

Machine-readable checkpoint: `docs/TAYOCA_REBRAND_STATE.yaml`

Cross-program authority: `docs/TAYOCA_PROGRAM_AUTHORITY.md`

Latest Phase 4 checkpoint note: `docs/TAYOCA_PHASE4_PRODUCT_SOCIAL_METADATA_CHECKPOINT_20260915.md`

Prior Phase 4 checkpoint note: `docs/TAYOCA_PHASE4_SOCIAL_METADATA_GOVERNANCE_CHECKPOINT_20260914.md`

Prior structured-data checkpoint note: `docs/TAYOCA_PHASE4_STRUCTURED_DATA_GOVERNANCE_CHECKPOINT_20260914.md`

When asked to **continue Tayoca rebrand** or equivalent, read those files, reconcile the current checkpoint against canonical Forgejo and the live evidence required by the current phase, then continue the highest-priority incomplete phase. Do not ask the user to restate the roadmap.

Current locked sequence:

1. Production certification and cleanup
2. Conversion and customer journey
3. Content architecture and authority
4. Search, discoverability and structured data
5. Performance and accessibility hardening
6. Measurement and Growth OS
7. Trust, evidence and commercial readiness
8. Continuous design governance

Current Phase 4 implementation baseline:

- Latest canonical Forgejo commit: `b5dab7b28aef45a0ddba1864004f87b1ae2e022f`
- Completed Phase 4 PRs through this checkpoint: #104, #105, #106, #107, #108, #109, #110, #111, #112, #113, #115, #116, #117, #118, #119, #120, #121, #122.
- PR #109 added structured-data governance and passed the replacement explicit post-merge workflow run #33968 / id 2289 on `main`.
- PR #111 added social metadata parity governance and passed explicit post-merge runs on `main`: Social metadata parity #34163 / id 2364, Tayoca static quality #34164 / id 2365, and Structured data governance #34165 / id 2366.
- PR #112 recorded the social metadata governance checkpoint and merged at `5b08167cffb93354fa0ef9a9c1c29dfa31417655`.
- PRs #115 through #122 removed every product-detail page from `TWITTER_DETAIL_GAP_ALLOWLIST` by normalizing Twitter/X title, description and image fields from existing Open Graph metadata.
- Latest product-lane validation on canonical `main` commit `b5dab7b28aef45a0ddba1864004f87b1ae2e022f` passed: Social metadata parity #34987 / id 2732, Structured data governance #34988 / id 2733, and Tayoca static quality #34989 / id 2734.
- Phase 4 remains open. Continue by removing blog-detail social metadata allowlist gaps one page at a time only where title, description and image provenance is clear from existing metadata.
- Product prices, Gumroad checkout URLs, Product JSON-LD offers, visible product page copy, and publication/modification dates were not changed during the product-detail social metadata lane.
- The AWS product cover-image consistency question remains separate from the product Twitter/X metadata lane and should be handled only as a verified follow-up if needed.

The v9 visual system is the accepted baseline. Do not restart broad visual redesign unless a specific defect, verified regression, or explicitly approved new requirement calls for it.
