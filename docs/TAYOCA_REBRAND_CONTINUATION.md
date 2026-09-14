# Tayoca Rebrand Continuation Pointer

This file exists as a compact human-readable entry point for future sessions.

Authoritative roadmap: `docs/TAYOCA_REBRAND_ROADMAP.md`

Machine-readable checkpoint: `docs/TAYOCA_REBRAND_STATE.yaml`

Cross-program authority: `docs/TAYOCA_PROGRAM_AUTHORITY.md`

Latest Phase 4 checkpoint note: `docs/TAYOCA_PHASE4_SOCIAL_METADATA_GOVERNANCE_CHECKPOINT_20260914.md`

Prior Phase 4 checkpoint note: `docs/TAYOCA_PHASE4_STRUCTURED_DATA_GOVERNANCE_CHECKPOINT_20260914.md`

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

- Latest canonical Forgejo commit: `e90e3b64818811cf167aace033488a7448b481b6`
- Completed Phase 4 PRs through this checkpoint: #104, #105, #106, #107, #108, #109, #110, #111
- PR #109 added structured-data governance and passed the replacement explicit post-merge workflow run #33968 / id 2289 on `main`.
- PR #110 added the compact structured-data governance checkpoint and merged at `45e4ce2c2de018e758666b4930491aa997def74e`.
- PR #111 added social metadata parity governance and passed explicit post-merge runs on `main`: Social metadata parity #34163 / id 2364, Tayoca static quality #34164 / id 2365, and Structured data governance #34165 / id 2366.
- Phase 4 remains open. Continue by removing explicit structured-data and social-metadata allowlist gaps only where publication, modification, title, description, and image provenance are known.

The v9 visual system is the accepted baseline. Do not restart broad visual redesign unless a specific defect, verified regression, or explicitly approved new requirement calls for it.
