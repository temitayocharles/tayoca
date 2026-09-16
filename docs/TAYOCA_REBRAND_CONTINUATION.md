# Tayoca Rebrand Continuation Pointer

This file exists as a compact human-readable entry point for future sessions.

Authoritative roadmap: `docs/TAYOCA_REBRAND_ROADMAP.md`

Machine-readable checkpoint: `docs/TAYOCA_REBRAND_STATE.yaml`

Cross-program authority: `docs/TAYOCA_PROGRAM_AUTHORITY.md`

Latest Phase 4 checkpoint note: `docs/TAYOCA_PHASE4_SOCIAL_METADATA_ALLOWLIST_CLOSURE_20260916.md`

Latest structured-data date cleanup note: `docs/TAYOCA_PHASE4_N8N_STRUCTURED_DATE_ALLOWLIST_NOTE_20260916.md`

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

- Latest certified canonical Forgejo commit: `e92a4a3f8ef677cc02ce12948609dce38650d4e5`
- Completed Phase 4 PRs through this checkpoint: #104, #105, #106, #107, #108, #109, #110, #111, #112, #113, #115, #116, #117, #118, #119, #120, #121, #122, #123, #124, #125, #126, #127, #128, #129, #130, #131, #132, #133, #134, #135, #136, #137.
- PR #109 added structured-data governance and passed the replacement explicit post-merge workflow run #33968 / id 2289 on `main`.
- PR #111 added social metadata parity governance and passed explicit post-merge runs on `main`: Social metadata parity #34163 / id 2364, Tayoca static quality #34164 / id 2365, and Structured data governance #34165 / id 2366.
- PR #112 recorded the social metadata governance checkpoint and merged at `5b08167cffb93354fa0ef9a9c1c29dfa31417655`.
- PRs #115 through #122 removed every product-detail page from `TWITTER_DETAIL_GAP_ALLOWLIST` by normalizing Twitter/X title, description and image fields from existing Open Graph metadata.
- PR #123 recorded the product-detail social metadata checkpoint.
- PRs #124 through #134 removed every blog-detail page from `TWITTER_DETAIL_GAP_ALLOWLIST` by normalizing Twitter/X title, description and image fields from existing Open Graph metadata.
- `TWITTER_DETAIL_GAP_ALLOWLIST` is now empty in `scripts/validate_social_metadata_parity.py`.
- PR #135 recorded the Twitter/X detail allowlist closure and passed post-merge gates on `ef20fbe4add7a9acbed509e73af7080f9d463dca`: Tayoca static quality #35655 / id 3214, Social metadata parity #35653 / id 3212, and Structured data governance #35654 / id 3213.
- PR #136 removed the stale `public/blog/n8n-mcp-kubernetes.html` structured-data date-gap allowlist entry because the page already had BlogPosting JSON-LD with `dateModified: 2026-09-11`. It passed post-merge gates on `c5b137ea4b4f04c971a11b66aeba802a3935efcd`: Tayoca static quality #35701 / id 3246, Social metadata parity #35702 / id 3247, and Structured data governance #35703 / id 3248.
- PR #137 added stale structured-data allowlist detection and passed post-merge gates on `e92a4a3f8ef677cc02ce12948609dce38650d4e5`: Tayoca static quality #35732 / id 3273, Social metadata parity #35733 / id 3274, and Structured data governance #35734 / id 3275.
- Open issue #138 records the remaining provenance-safe BlogPosting `dateModified` remediation for `public/blog/ai-automation-career-roadmap.html`, `public/blog/gitops-beyond-hello-world.html`, and `public/blog/kubernetes-production-checklist.html`.
- Phase 4 remains open. Continue by removing only provenance-safe structured-data allowlist entries. For the remaining no-date BlogPosting pages, add `dateModified` only through a patch-capable or otherwise fully verified file-edit path; do not hand-reconstruct long one-line HTML files from truncated connector output.
- Product prices, Gumroad checkout URLs, Product JSON-LD offers, visible product page copy, canonical URLs, and publication dates were not intentionally changed during the Twitter/X detail metadata closure lane or structured-data stale-allowlist guard lane.
- The AWS product cover-image consistency question remains separate from the product Twitter/X metadata lane and should be handled only as a verified follow-up if needed.

The v9 visual system is the accepted baseline. Do not restart broad visual redesign unless a specific defect, verified regression, or explicitly approved new requirement calls for it.
