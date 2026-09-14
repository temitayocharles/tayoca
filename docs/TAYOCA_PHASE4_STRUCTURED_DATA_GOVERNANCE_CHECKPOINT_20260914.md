# Tayoca Phase 4 Structured Data Governance Checkpoint

Recorded: 2026-09-14T19:52:00Z

## Scope

This checkpoint records the state after PR #109 introduced structured-data governance for sitemap-indexed Tayoca pages.

## Canonical implementation baseline

- Repository: `temitayocharles/tayoca`
- Canonical platform: Forgejo
- Branch: `main`
- Latest canonical commit: `05fc968317711842294de466916ce903b4d5188d`
- Merged PR: #109, `test: add Phase 4 structured data governance`
- Merge time: 2026-09-14T18:45:07Z

## Governance added

PR #109 added:

- `.forgejo/workflows/structured-data-governance.yml`
- `scripts/validate_structured_data_governance.py`

The validator covers sitemap-indexed Tayoca pages and checks:

- JSON-LD parseability
- canonical URL alignment
- Product JSON-LD boundaries on product pages
- Article, BlogPosting, or NewsArticle JSON-LD boundaries on blog pages
- prevention of Product JSON-LD on blog pages
- social metadata presence for article pages
- explicit allowlists for known Phase 4 remediation candidates

## Verification evidence

Pre-merge targeted evidence:

- Workflow: `Structured data governance`
- Run number: #33953
- Run id: 2277
- SHA: `89adf1bc228e40d6e60d5f27e0092cf67f5e75c6`
- Status: success

Post-merge evidence on `main`:

- Workflow: `Structured data governance`
- Run number: #33968
- Run id: 2289
- SHA: `05fc968317711842294de466916ce903b4d5188d`
- Status: success

Additional post-merge observed green push runs on the same SHA included #33961, #33962, #33963, #33964, #33965, #33966, and deployment parity #34042.

## Important boundaries

This checkpoint does not mark Phase 4 complete.

The validator intentionally preserves explicit allowlists instead of fabricating unknown publication dates. Allowlist items must be removed only when the underlying page is remediated using real publication or modification provenance.

## Next Phase 4 work

Continue with:

1. Remediate high-confidence JSON-LD gaps where publication or modification provenance is already explicit.
2. Keep unresolved publication-history gaps in the allowlist until provenance is known.
3. Reconcile social metadata and preview-image parity across indexable article and product pages.
4. Recheck Search Console after Google recrawls the PR #105 redirect repairs.
