# Tayoca Rebrand Continuation Pointer

This file exists as a compact human-readable entry point for future sessions.

Authoritative roadmap: `docs/TAYOCA_REBRAND_ROADMAP.md`

Machine-readable checkpoint: `docs/TAYOCA_REBRAND_STATE.yaml`

Cross-program authority: `docs/TAYOCA_PROGRAM_AUTHORITY.md`

Latest Phase 4 checkpoint note: `docs/TAYOCA_PHASE4_SOCIAL_METADATA_ALLOWLIST_CLOSURE_20260916.md`

Prior product social metadata checkpoint note: `docs/TAYOCA_PHASE4_PRODUCT_SOCIAL_METADATA_CHECKPOINT_20260915.md`

Prior Phase 4 social governance checkpoint note: `docs/TAYOCA_PHASE4_SOCIAL_METADATA_GOVERNANCE_CHECKPOINT_20260914.md`

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

- Latest certified canonical Forgejo commit: `0b929bdc39fcad05666496c89546a89c10c4754c`
- Completed Phase 4 PRs through this checkpoint: #104, #105, #106, #107, #108, #109, #110, #111, #112, #113, #115, #116, #117, #118, #119, #120, #121, #122, #123, #124, #125, #126, #127, #128, #129, #130, #131, #132, #133, #134.
- PR #109 added structured-data governance and passed the replacement explicit post-merge workflow run #33968 / id 2289 on `main`.
- PR #111 added social metadata parity governance and passed explicit post-merge runs on `main`: Social metadata parity #34163 / id 2364, Tayoca static quality #34164 / id 2365, and Structured data governance #34165 / id 2366.
- PR #112 recorded the social metadata governance checkpoint and merged at `5b08167cffb93354fa0ef9a9c1c29dfa31417655`.
- PRs #115 through #122 removed every product-detail page from `TWITTER_DETAIL_GAP_ALLOWLIST` by normalizing Twitter/X title, description and image fields from existing Open Graph metadata.
- PR #123 recorded the product-detail social metadata checkpoint.
- PRs #124 through #134 removed every blog-detail page from `TWITTER_DETAIL_GAP_ALLOWLIST` by normalizing Twitter/X title, description and image fields from existing Open Graph metadata.
- `TWITTER_DETAIL_GAP_ALLOWLIST` is now empty in `scripts/validate_social_metadata_parity.py`.
- Latest allowlist-closure validation on canonical `main` commit `0b929bdc39fcad05666496c89546a89c10c4754c` passed: Tayoca static quality #35606 / id 3170, Social metadata parity #35607 / id 3171, and Structured data governance #35608 / id 3172.
- Phase 4 remains open. Continue by inspecting remaining structured-data allowlists and removing only provenance-safe entries, especially where title, description, image, canonical, date and page-type provenance can be established without inventing publication history.
- Product prices, Gumroad checkout URLs, Product JSON-LD offers, visible product page copy, canonical URLs, and publication/modification dates were not intentionally changed during the Twitter/X detail metadata closure lane.
- The AWS product cover-image consistency question remains separate from the product Twitter/X metadata lane and should be handled only as a verified follow-up if needed.

The v9 visual system is the accepted baseline. Do not restart broad visual redesign unless a specific defect, verified regression, or explicitly approved new requirement calls for it.
