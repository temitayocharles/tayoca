# Brand Intelligence Live Monitor v4 Repair Certification — 2026-08-30

## Incident

The authoritative Tayoca `Brand Intelligence Snapshot` stopped advancing while the original `Tayoca Brand Intelligence | Live Monitor v4` workflow remained active on a five-minute schedule.

Observed stale snapshot before remediation: `2026-08-30T18:41:14.391Z`.

## Root cause

The original collector workflow `nENZYZbo72RkqxZF` depended on a Composio remote-workbench script that called legacy helper functions which are no longer available in the current runtime. A production manual execution, `287835`, did not advance the snapshot.

## Replacement

The collector was rebuilt around current supported connector tools rather than retired workbench helpers:

- GA4 realtime event activity: `GOOGLE_ANALYTICS_RUN_REALTIME_REPORT`
- GA4 realtime visitor activity: `GOOGLE_ANALYTICS_RUN_REALTIME_REPORT`
- Growth OS aggregate state: `GOOGLESHEETS_BATCH_GET`
- Authoritative snapshot write: Google Sheets OAuth node

Application count is derived from the governed `Community Form Ledger`. Source health therefore reports `intake_ledger:ok` instead of claiming direct Google Forms health when no active Forms connector is present.

Replacement workflow:

- Name: `Tayoca Brand Intelligence | Live Monitor v4 Repair Candidate`
- Workflow ID: `QDESdSUjHLAYO6wU`
- Active version: `766014d8-358c-4cdf-9087-6495adc96b6e`
- Schedule: every five minutes

The temporary first replacement candidate `HlBd8NsghpVF4Zeh` was never executed because credential auto-resolution selected an unrelated header-auth credential. It was archived before any external call. The certified replacement uses the exact intended Composio and Google Sheets credentials.

## Runtime proof

Manual candidate execution `288718` refreshed the authoritative snapshot to `2026-08-30T20:49:11.476Z` with:

- `cohort_count=38`
- `positive_conversations=0`
- `ready_partner_routes=0`
- `source_status=ga4:ok;intake_ledger:ok;revenue:ok;nominations:ok;cohort:ok;partners:ok`
- no source errors

Only after that proof was the old collector `nENZYZbo72RkqxZF` unpublished and the replacement published.

A scheduler-driven refresh then advanced the authoritative snapshot without a further manual n8n execution to `2026-08-30T20:50:59.665Z`, preserving the same governed counts and all-ok source state.

Forgejo issue #75 was closed after this automatic-refresh closure gate passed.

## Current authority

For Tayoca Brand Intelligence live monitoring, `QDESdSUjHLAYO6wU` supersedes `nENZYZbo72RkqxZF`. Future work must re-query the live estate before relying on remembered workflow IDs or versions.