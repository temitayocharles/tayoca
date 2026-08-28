# Tayoca Control Center Production Handoff

Status: **completed / production-deployed**

Recorded: 2026-08-28

This handoff supersedes earlier Tayoca program notes that classified the Control Center/CMS implementation as partial or as an active redesign workstream.

## Production completion

Production at `control.tayoca.com` includes:

- operator-friendly Website CMS;
- Pages / Blog / Products / Site Data;
- Media Library;
- visual image selection and guarded uploads;
- reusable page sections;
- Global Site Settings;
- revision history and restore;
- content history/rollback;
- Workflow Studio;
- real workflow create/update/delete/publish/unpublish operations;
- executions and error visibility;
- real backup export and restore-to-unpublished-drafts;
- truthful Active Executions view;
- schedules, webhook inventory, performance metrics and usage reports;
- Dashboard Control Health;
- server-side credential handling;
- `/api-keys` credential catalog removed;
- fake/local Alerts management removed;
- duplicate Supabase signup/login/password-reset plane removed;
- Cloudflare Access as the sole authentication boundary;
- misleading retry/queue/notification/credential-management semantics corrected;
- zero-warning CI gate;
- exact-SHA gated production deployments.

Control Center production line checkpoint:

`6cae0f71d7b60cec62c783de925780835075e96c`

Production deployment:

`dpl_5xGR3Lm58YdNKU3vUJD5Ds8ZudsJ`

Reported status: `READY / PROMOTED`.

## Backend/control path

The protected unified n8n/Forgejo gateway remains:

- workflow ID: `gif5P0MDI6WrceAP`
- name: `Tayoca Control Center | Unified Gateway v6.1`

Browser credentials are not exposed.

The Forgejo -> GitHub -> Vercel publishing/mirror path has separately been repaired and certified, including GitHub commit attribution for Vercel.

## Recovery certification

Global Site Settings recovery was explicitly exercised by:

1. capturing original settings;
2. creating a harmless JSON-whitespace revision;
3. retrieving a historical revision;
4. restoring previous content;
5. returning the final file to the exact original Forgejo blob SHA;
6. confirming no settings/content drift remained.

Therefore History/Restore is an exercised capability, not UI-only semantics.

## Authentication caveat

Automated testing did not enter the authenticated production UI because a clean browser correctly stopped at Cloudflare Access and no end-user GitHub/OTP session was supplied. This is not classified as an implementation blocker. CI browser coverage applies before production deployment, and the Cloudflare Access boundary itself was verified.

## Program boundary

Treat the Control Center implementation as **closed unless a specific defect or new feature is requested**.

Do not reopen it as part of the LM Arena public website redesign by default.

LM Arena may inspect public repository contracts and must preserve compatibility with Global Site Settings and website/control-plane interfaces, but it must not redesign or replace the production Control Center implementation.

Broader Tayoca website/company-platform work remains separate. Live n8n estate reconciliation and backup-ledger/snapshot reconciliation are also separate cross-platform workstreams and must not be conflated with Control Center completion.

## Superseded program classifications

The following earlier classifications are superseded by this handoff:

- `Control Center/CMS UX: PARTIAL`
- `continue as structured operating product`
- treating Control Center redesign as a prerequisite for the public company-platform redesign

The earlier finding about embedded authorization material must not be assigned to LM Arena as an active implementation task. If its exact remediation provenance ever needs audit, verify it against the production gateway/control-center evidence rather than reopening the Control Center broadly.
