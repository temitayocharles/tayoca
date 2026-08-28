# Tayoca public company-platform production certification

Date: 2026-08-28

This record certifies the Forgejo-native production adoption of the reconciled LM Arena company-platform redesign.

## Accepted design source

- External review vehicle: GitHub PR #15
- Reviewed branch: `arena/01a04a44-tayoca`
- Reviewed head: `0f67039f7276ea7c932f1f2f97d0013f7832f029`
- Canonical integration PR: Forgejo PR #41
- Canonical pre-merge certified head: `3e57d58afa9df0e145daf38d1911534e9ba0e470`
- Canonical production merge: `9b1f2ec0c928652d7868b4057126ec686b8d7f28`

## Pre-merge certification

- Forgejo static quality run #17675: success
- Self-hosted Chromium/Axe run #17677: success
- The browser gate initially identified seven WCAG color-contrast failures. These were corrected without changing the accepted LM Arena design direction before merge.

## Canonical mirror and deployment

- Automatic Forgejo main push run #17682: success
- GitHub mirror commit: `046441d27e3a97bed5253c21cb0dfc49f3e36b52`
- GitHub mirror trailer: `Canonical-Forgejo-Commit: 9b1f2ec0c928652d7868b4057126ec686b8d7f28`
- Mirrored canonical tree: `d3f5eb5b2241ff44079b5e6652afc1035c753473`
- Vercel project: `tayoca-com-static` (`prj_3HzkrxM828WThQD1lOdFjL0jdC8o`)
- Production deployment: `dpl_BifRiqN4R7bMbY64nZTnhd1waJKY`
- Deployment state: `READY` / `PROMOTED`
- Deployment source GitHub SHA: `046441d27e3a97bed5253c21cb0dfc49f3e36b52`
- `tayoca.com` is directly assigned to this deployment.
- `www.tayoca.com` is assigned and permanently redirects to `tayoca.com`.

## Production parity

The first post-deployment parity run #17693 reported 49/50 direct byte matches. The sole exception was `blog/devops-incident-response-runbook.html`, which is intentionally configured in `vercel.json` as a permanent redirect to `/products/devops-incident-runbook-template.html`. Diagnostic run #17707 confirmed that the failure was the verifier treating the configured HTTP 308 as drift rather than a production content mismatch.

The parity verifier is therefore being corrected to validate declared Vercel redirects as redirect contracts while retaining exact byte comparison for ordinary deployed HTML.

## Scope boundary

This certification closes the public website modernization only. It does not close separate live n8n estate reconciliation, backup-ledger/snapshot reconciliation, or unresolved project/public-disclosure decisions. The completed Tayoca Control Center remains outside this workstream unless a specific defect or new feature is raised.

## Final parity result

- Redirect-aware production parity run #17715: **success**.
- Exact-byte parity remains mandatory for ordinary tracked HTML.
- Declared Vercel HTML redirects are validated for permanent status and exact configured destination.

With that correction, the public company-platform modernization satisfies the canonical production certification gate and is classified `completed_production_deployed`.
