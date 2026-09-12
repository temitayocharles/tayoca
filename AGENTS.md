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

## Tayoca program authority

The durable cross-program source for Tayoca scope, architecture, design intent, safety boundaries, workstream status and reconciliation rules is:

`docs/TAYOCA_PROGRAM_AUTHORITY.md`

The machine-readable companion state is:

`docs/tayoca-program-state.yaml`

Before starting, resuming, reviewing, or modifying any Tayoca work:

1. Read `docs/TAYOCA_PROGRAM_AUTHORITY.md` first.
2. Read `docs/tayoca-program-state.yaml` second.
3. Query current canonical Forgejo `main`, recent commits, open pull requests and any live runtime state relevant to the requested work. Do not use conversational recollection as operational authority.
4. Read the workstream-specific policy or plan referenced by the program anchor, including `docs/production-growth-operating-plan.yaml` for Growth OS work.
5. Where sources disagree, use the precedence defined in the program anchor. Verified live runtime facts and current canonical Forgejo state take priority over historical branches, patches, mirrors and conversation artifacts.
6. Update the program anchor/state when a material cross-program decision, source-authority change or verified workstream completion changes the operating picture.
7. Forgejo is canonical. GitHub is downstream for deployment/external-agent work and is not an independent production authority.
8. Preserve truthfulness, private-source isolation, human approval, verified revenue, analytics provenance, workflow recovery and rollback controls.

## Tayoca rebrand continuation control

The locked public-company rebrand and follow-on execution roadmap is:

`docs/TAYOCA_REBRAND_ROADMAP.md`

Its machine-readable continuation checkpoint is:

`docs/TAYOCA_REBRAND_STATE.yaml`

When a user says **"continue Tayoca rebrand"**, **"resume Tayoca rebrand"**, or equivalent:

1. Read `docs/TAYOCA_REBRAND_ROADMAP.md` after the program authority files.
2. Read `docs/TAYOCA_REBRAND_STATE.yaml` and use `current_phase` plus `current_checkpoint` as the continuation pointer.
3. Reconcile that checkpoint against current canonical Forgejo, CI, deployment, and only the live evidence required by the current phase gate.
4. Continue the highest-priority incomplete roadmap phase whose dependencies are satisfied; do not ask the user to restate the phases.
5. Use Scrapling connected through Composio as the first-class browser for website inspection and production verification when available. Use another browser only when Scrapling cannot perform the required capability or is unavailable.
6. Update the rebrand roadmap/state at phase transitions and clean up temporary branches/workflows after evidence is retained.
7. Do not restart the v9 visual redesign merely because a new chat started. Reopen visual design only for a specific evidenced defect or an explicitly approved new requirement.

The repository documentation, not cross-chat memory, is the continuity mechanism.

## Tayoca post-certification operating control

The certified transformation roadmap is complete. The authoritative post-certification Growth OS operating plan is:

`docs/production-growth-operating-plan.yaml`

For Growth OS and post-certification operating work:

1. Read `docs/production-growth-operating-plan.yaml` after the Tayoca program authority files above.
2. Treat the plan's current cycle, workstream priority, gates, change-control rules, and resume protocol as authoritative for that workstream.
3. Continue the highest-priority incomplete workstream whose dependencies are satisfied. Do not invent or silently start unrelated workstreams.
4. Do not reopen completed Stages 0-14 unless a verified critical/high regression, production incident, security issue, compliance requirement, or recovery need requires it.
5. Patch or extend existing application/workflow/data/analytics/editorial/revenue layers before creating new parallel code, workflows, databases, or services.
6. Preserve the immutable certified baseline tag `tayoca-certified-2026-08-10` and all certified rollback/evidence artifacts.
7. Preserve the binding controls for claim integrity, private-source isolation, human publication approval, verified revenue, analytics provenance, and workflow recovery.
8. A documentation-only plan change must not mutate production runtime.
9. If requested work falls outside the locked plan, revise the canonical plan deliberately before implementation rather than improvising scope.

Production incidents override growth sequencing only for the duration of the incident. Record the interruption, resolve it safely, then return to the current program workstream.
