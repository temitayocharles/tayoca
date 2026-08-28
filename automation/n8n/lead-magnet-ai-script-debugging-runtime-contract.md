# Runtime Contract: Debugging AI-Generated DevOps Scripts Lead Magnet

Status: **repository implementation contract ready; live n8n mutation pending direct runtime access and end-to-end certification**

## Purpose

Extend the existing Tayoca Operator Brief intake and delivery system to support the evergreen **Debugging AI-Generated DevOps Scripts** lead magnet without weakening consent, idempotency, unsubscribe, or evidence controls.

## Re-verified repository authority

The current workflow registry records:

- `assessment-operator-brief-intake` → n8n `V28T575q7GSRFOti`, status `active`, last validated `2026-08-17T19:20:04Z`.
- `operator-brief` → n8n `Ug7hA8cXrrCIVYkI`, status `active`, last validated `2026-08-17T20:04:10Z`.
- Production failure monitoring is provided by `production-failure-dead-letter` → n8n `iX0ehWNElYUfdCQZ`.

These registry records are configuration evidence, not proof that the running workflows are unchanged today. Before production mutation, the live workflows must be fetched and their active versions compared with the registry.

## Public request contract

The pre-publication landing page submits to the existing Operator Brief endpoint:

`POST https://n8n.tca-infraforge.site/webhook/tayoca/growth/operator-brief`

Required fields:

- `email`
- `interest`
- `consent=yes`
- `source=lead_magnet`
- `lead_magnet=debugging-ai-generated-devops-scripts`
- `campaign=evergreen-ai-script-debugging`
- honeypot `website` must remain empty

The endpoint must preserve the existing non-enumerating public response and origin/bot controls.

## Intake invariants

1. Normalize email deterministically before deduplication.
2. Reject or suppress any submission without explicit `consent=yes`.
3. Preserve `source`, `lead_magnet`, `campaign`, `interest`, consent timestamp, and request correlation ID in durable subscriber state.
4. If an existing subscriber is globally unsubscribed, do not silently reactivate them.
5. If the subscriber is active, update attribution safely without creating duplicate subscriber rows.
6. Lead-magnet requests must not create revenue-pipeline opportunities merely because an email address was submitted.
7. Persistence must succeed before any delivery action is allowed.

## Sequence identity and idempotency

Canonical sequence key:

`debugging-ai-generated-devops-scripts:v1`

Canonical membership key:

`sha256(normalized_email + ":" + sequence_key)`

Required behavior:

- First successful lead-magnet request creates one sequence membership.
- Repeat request may resend Email 0 if explicitly supported, but must not create duplicate future Email 1-4 jobs.
- Every scheduled send uses a deterministic send key: `membership_key + ":email:" + step_number`.
- Provider send ID, attempted_at, accepted_at, delivered/error state, and sanitized failure reason must be persisted.
- A retry must reuse the same deterministic send key.

## Delivery sequence

- Email 0: immediately after durable active-subscriber persistence.
- Email 1: +1 day.
- Email 2: +3 days.
- Email 3: +5 days.
- Email 4: +7 days.

Canonical copy source:

`editorial/operator-brief/welcome-sequence-ai-script-debugging.md`

Canonical download placeholder:

`{{lead_magnet_download_url}}`

This placeholder must not be activated until the certified PDF is present at a stable Tayoca-controlled URL and independently verified as the intended publication artifact.

## Unsubscribe and suppression

Before every send:

1. Re-read authoritative subscriber state.
2. Block if globally unsubscribed.
3. Block if Operator Brief subscription is inactive or suppressed.
4. Mark remaining sequence jobs suppressed after unsubscribe.
5. Do not rely only on a previously queued job payload for consent state.

The existing Operator Brief unsubscribe behavior must remain non-enumerating and idempotent.

## Required observability

Persist or emit evidence for:

- lead-magnet form accepted/rejected
- subscriber persistence outcome
- sequence membership created/reused
- Email 0 provider acceptance
- each scheduled step attempted/accepted/blocked/failed
- unsubscribe suppression
- download event
- paid-product detail and checkout events

No raw secrets, full provider responses, or unnecessary subscriber PII may enter repository logs or public analytics.

## Funnel event names

- `lead_magnet_view`
- `lead_magnet_form_start`
- `lead_magnet_submit`
- `lead_magnet_delivery_sent`
- `lead_magnet_download`
- `lead_magnet_sequence_step`
- `lead_magnet_sequence_suppressed`
- `paid_product_detail_click`
- `paid_checkout_click`

Minimum event properties:

- `lead_magnet`
- `campaign`
- `source`
- `step` where applicable
- pseudonymous or internal correlation ID, never raw email in analytics

## End-to-end certification

Production activation is complete only after a synthetic test subscriber proves all of the following:

1. Landing request is accepted exactly once.
2. Durable subscriber state records explicit consent and lead-magnet attribution.
3. Email 0 is accepted by the verified Tayoca sender path.
4. The download URL returns the intended certified PDF.
5. Repeat submission does not create duplicate future sequence jobs.
6. Scheduled nurture advances once per step.
7. Unsubscribe suppresses all unsent steps immediately.
8. A post-unsubscribe execution proves no further email is sent.
9. Provider IDs and sanitized delivery/error evidence are available for troubleshooting.
10. Only after this proof may the landing page move from `docs/drafts/` into `public/`.

## Rollback

If any production mutation fails certification:

- restore the previous active workflow version recorded immediately before mutation;
- keep the public landing page unpublished;
- leave the existing Operator Brief path functional;
- preserve failed certification evidence without exposing subscriber data or credentials;
- do not mark Issue #14 complete.
