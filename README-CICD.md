# Tayoca CI/CD and production authority

Tayoca uses a deliberately split source-and-deployment model:

- **Canonical source and CI authority:** Forgejo `temitayocharles/tayoca`
- **Canonical quality gate:** `.forgejo/workflows/static-quality.yml` on Forgejo runners
- **Secondary deployment mirror:** GitHub `temitayocharles/tayoca`
- **Production hosting:** Vercel project `tayoca-com-static`
- **Production domains:** `tayoca.com` and `www.tayoca.com`

## Change flow

1. Make and validate the canonical change in Forgejo.
2. Pass the existing Forgejo static-quality gate.
3. Mirror the intended change exactly to GitHub.
4. Vercel deploys the GitHub `main` mirror to production.
5. Verify the resulting deployment is `READY / PROMOTED`, the expected production aliases remain assigned, and no blocking deployment check exists.

GitHub is not an independent source of truth. Do not make GitHub-only product or policy changes and then treat them as canonical.

## Certified baseline

The immutable pre-growth certification boundary is:

- Tag: `tayoca-certified-2026-08-10`
- Commit: `2f98c1f6899425437e185b791512d7b35252d838`
- Final certification baseline: `docs/stage14-final-certification-baseline.json`
- Final public-shell audit: execution `73587`, 34/34 canonical pages, 0 violations

Post-certification operating work is governed by `docs/production-growth-operating-plan.yaml`.

## Retired deployment paths

Cloudflare Pages/Wrangler and Netlify deployment configuration were removed during post-certification housekeeping. They are historical Git content only and are not supported production paths.
