# Tayoca Phase 4 Social Metadata Governance Checkpoint

Recorded: 2026-09-14T20:10:00Z

## Scope

This checkpoint records the state after PR #111 introduced social metadata parity governance for sitemap-indexed Tayoca article and product detail pages.

## Canonical implementation baseline

- Repository: `temitayocharles/tayoca`
- Canonical platform: Forgejo
- Branch: `main`
- Latest canonical commit: `e90e3b64818811cf167aace033488a7448b481b6`
- Merged PR: #111, `test: add Phase 4 social metadata parity governance`
- Merge time: 2026-09-14T20:08:20Z

## Governance added

PR #111 added:

- `.forgejo/workflows/social-metadata-parity.yml`
- `scripts/validate_social_metadata_parity.py`

The validator covers sitemap-indexed Tayoca detail pages under:

- `public/blog/`
- `public/products/`

The validator checks:

- canonical URL alignment with the sitemap URL
- `og:url` alignment with canonical where present
- required Open Graph fields: `og:title`, `og:description`, `og:type`, `og:image`
- `twitter:card` set to `summary_large_image`
- explicit allowlist governance for missing `twitter:title`, `twitter:description`, and `twitter:image`
- `twitter:image` and `og:image` parity where `twitter:image` is present
- stale allowlist detection

## Verification evidence

Pre-merge targeted evidence on PR #111 head `0633f1d96309d4ec429b43da1ac480fa4fa980ef`:

- Social metadata parity: run #34152 / id 2354, success
- Tayoca static quality: run #34154 / id 2355, success
- Structured data governance: run #34155 / id 2356, success

Post-merge evidence on `main` at `e90e3b64818811cf167aace033488a7448b481b6`:

- Social metadata parity: run #34163 / id 2364, success
- Tayoca static quality: run #34164 / id 2365, success
- Structured data governance: run #34165 / id 2366, success

## Important boundaries

This checkpoint does not mark Phase 4 complete.

The validator intentionally preserves explicit allowlists instead of fabricating social preview content. Allowlist entries must be removed only when the underlying page is remediated with real title, description, and image provenance.

## Next Phase 4 work

Continue with:

1. Remediate high-confidence JSON-LD gaps where publication or modification provenance is already explicit.
2. Normalize Twitter/X fields on detail pages using existing page title, description, and Open Graph image where appropriate.
3. Remove social-metadata allowlist entries as each page is corrected.
4. Re-run social metadata parity, structured-data governance, and static quality after each bounded remediation.
5. Recheck Search Console after Google recrawls the PR #105 redirect repairs.
