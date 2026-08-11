# AGENTS.md

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **infracost** (API base `https://v7mhrspk.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SSO, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->

## Tayoca post-certification operating control

The certified transformation roadmap is complete. The authoritative post-certification operating plan is:

`docs/production-growth-operating-plan.yaml`

Before starting, resuming, or modifying Tayoca work:

1. Read `docs/production-growth-operating-plan.yaml` first.
2. Treat the plan's current cycle, workstream priority, gates, change-control rules, and resume protocol as authoritative.
3. Continue the highest-priority incomplete workstream whose dependencies are satisfied. Do not invent or silently start unrelated workstreams.
4. Do not reopen completed Stages 0-14 unless a verified critical/high regression, production incident, security issue, compliance requirement, or recovery need requires it.
5. Patch or extend existing application/workflow/data/analytics/editorial/revenue layers before creating new parallel code, workflows, databases, or services.
6. Preserve the immutable certified baseline tag `tayoca-certified-2026-08-10` and all certified rollback/evidence artifacts.
7. Forgejo is canonical. GitHub is the deployment mirror only. Canonical changes must originate in Forgejo and be mirrored exactly.
8. Preserve the binding controls for claim integrity, private-source isolation, human publication approval, verified revenue, analytics provenance, and workflow recovery.
9. A documentation-only plan change must not mutate production runtime.
10. If requested work falls outside the locked plan, revise the canonical plan deliberately before implementation rather than improvising scope.

Production incidents override growth sequencing only for the duration of the incident. Record the interruption, resolve it safely, then return to the current growth workstream.
