# Tayoca Rebrand Continuation Pointer

This file exists as a compact human-readable entry point for future sessions.

Authoritative roadmap: `docs/TAYOCA_REBRAND_ROADMAP.md`

Machine-readable checkpoint: `docs/TAYOCA_REBRAND_STATE.yaml`

Cross-program authority: `docs/TAYOCA_PROGRAM_AUTHORITY.md`

Forgejo operations note: `docs/TAYOCA_FORGEJO_OPERATIONS_NOTE_20260920.md`

Latest structured-data closure note: `docs/TAYOCA_PHASE4_CLOUD_COST_BLOGPOSTING_JSONLD_20260918.md`

Latest Phase 4 social metadata checkpoint note: `docs/TAYOCA_PHASE4_SOCIAL_METADATA_ALLOWLIST_CLOSURE_20260916.md`

Prior structured-data date cleanup note: `docs/TAYOCA_PHASE4_N8N_STRUCTURED_DATE_ALLOWLIST_NOTE_20260916.md`

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

- Latest certified canonical Forgejo commit: `0e47ee0adff48d464ed9a4b87288b33f94576a2d`
- Current `main` includes the later founder FDE positioning contract commit and passed explicit gates on `0e47ee0adff48d464ed9a4b87288b33f94576a2d`: Tayoca static quality #40513 / id 5291, Social metadata parity #40514 / id 5292, and Structured data governance #40516 / id 5293.
- Latest completed Phase 4 structured-data closure commit: `57f747f21d4fda69b5babba1b1ae8c82e0383e11`.
- Completed Phase 4 search, metadata and structured-data PRs through this checkpoint include #104 through #137, plus #170 and #171 for the final cloud-cost BlogPosting JSON-LD remediation carrier and content merge.
- PR #109 added structured-data governance and passed the replacement explicit post-merge workflow run #33968 / id 2289 on `main`.
- PR #111 added social metadata parity governance and passed explicit post-merge runs on `main`: Social metadata parity #34163 / id 2364, Tayoca static quality #34164 / id 2365, and Structured data governance #34165 / id 2366.
- PR #112 recorded the social metadata governance checkpoint and merged at `5b08167cffb93354fa0ef9a9c1c29dfa31417655`.
- PRs #115 through #122 removed every product-detail page from `TWITTER_DETAIL_GAP_ALLOWLIST` by normalizing Twitter/X title, description and image fields from existing Open Graph metadata.
- PR #123 recorded the product-detail social metadata checkpoint.
- PRs #124 through #134 removed every blog-detail page from `TWITTER_DETAIL_GAP_ALLOWLIST` by normalizing Twitter/X title, description and image fields from existing Open Graph metadata.
- `TWITTER_DETAIL_GAP_ALLOWLIST` is empty in `scripts/validate_social_metadata_parity.py`.
- PR #135 recorded the Twitter/X detail allowlist closure and passed post-merge gates on `ef20fbe4add7a9acbed509e73af7080f9d463dca`: Tayoca static quality #35655 / id 3214, Social metadata parity #35653 / id 3212, and Structured data governance #35654 / id 3213.
- PR #136 removed the stale `public/blog/n8n-mcp-kubernetes.html` structured-data date-gap allowlist entry because the page already had BlogPosting JSON-LD with `dateModified: 2026-09-11`. It passed post-merge gates on `c5b137ea4b4f04c971a11b66aeba802a3935efcd`: Tayoca static quality #35701 / id 3246, Social metadata parity #35702 / id 3247, and Structured data governance #35703 / id 3248.
- PR #137 added stale structured-data allowlist detection and passed post-merge gates on `e92a4a3f8ef677cc02ce12948609dce38650d4e5`: Tayoca static quality #35732 / id 3273, Social metadata parity #35733 / id 3274, and Structured data governance #35734 / id 3275.
- The provenance-safe BlogPosting `dateModified` remediation formerly tracked by issue #138 has since been completed and issue #138 is closed. The date-gap allowlist is empty.
- PR #171 added provenance-safe `BlogPosting` JSON-LD to `public/blog/cloud-cost-optimization-playbook.html`, removed the final `ARTICLE_JSONLD_MISSING_ALLOWLIST` entry, removed the temporary carrier files introduced by PR #170, and documented the remediation in `docs/TAYOCA_PHASE4_CLOUD_COST_BLOGPOSTING_JSONLD_20260918.md`.
- PR #171 passed pre-merge gates on `aab5c38ae8c63360c4cf590fe74c4016b4df74d4`: Tayoca static quality #37875 / id 4277, Social metadata parity #37876 / id 4278, and Structured data governance #37877 / id 4279.
- PR #171 passed post-merge gates on `57f747f21d4fda69b5babba1b1ae8c82e0383e11`: Tayoca static quality #37885 / id 4287, Social metadata parity #37886 / id 4288, and Structured data governance #37887 / id 4289.
- `ARTICLE_JSONLD_DATE_GAP_ALLOWLIST` is empty in `scripts/validate_structured_data_governance.py`.
- `ARTICLE_JSONLD_MISSING_ALLOWLIST` is empty in `scripts/validate_structured_data_governance.py`.
- Product prices, Gumroad checkout URLs, Product JSON-LD offers, visible product page copy, canonical URLs, and publication dates were not intentionally changed during the Twitter/X detail metadata closure lane or structured-data allowlist closure lane.
- The AWS product cover-image consistency question remains separate from the product Twitter/X metadata lane and should be handled only as a verified follow-up if needed.
- Remaining Phase 4 follow-ups are no longer structured-data allowlist remediation. Continue with live redirect/search-console rechecks, remaining verified image consistency questions, then prepare the Phase 4 exit checkpoint if no new governance defects are found.

Forgejo execution guidance:

- Use feature branches for repository writes.
- Use SHA-guarded Forgejo file writes.
- Merge by normal PR flow after validation.
- Do not force-merge stale PR metadata. If a clean, green PR shows stale `mergeable=false`, close and reopen that PR on the same feature branch.
- Canonical SSH for local git operations is Cloudflare Access SSH via `git-ssh.tayoca.com`; raw TCP/22 behavior alone is not proof of a Forgejo outage.

The v9 visual system is the accepted baseline. Do not restart broad visual redesign unless a specific defect, verified regression, or explicitly approved new requirement calls for it.
