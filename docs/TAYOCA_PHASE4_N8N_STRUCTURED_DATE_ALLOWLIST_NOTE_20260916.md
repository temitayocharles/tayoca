# Tayoca Phase 4 n8n Structured Date Allowlist Cleanup Note - 2026-09-16

This branch removes the stale structured-data date-gap allowlist entry for `public/blog/n8n-mcp-kubernetes.html`.

Reason:

- The page already carries BlogPosting JSON-LD.
- The BlogPosting JSON-LD already has `dateModified: 2026-09-11`.
- The validator only requires `datePublished` or `dateModified` for the current governance boundary.
- Removing this allowlist entry does not fabricate `datePublished` and does not alter the article page.

Boundary:

- No public HTML change.
- No BlogPosting JSON-LD change.
- No date value added or changed.
- No social metadata change.
- No product metadata, price, checkout URL, or offer change.
