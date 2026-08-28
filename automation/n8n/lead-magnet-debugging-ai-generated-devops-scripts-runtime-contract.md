# Debugging AI-Generated DevOps Scripts: Runtime Activation Contract

Status: **implementation-ready, live mutation pending runtime access**

This contract defines how the certified **Debugging AI-Generated DevOps Scripts** lead magnet integrates with the existing Tayoca Operator Brief subscriber and delivery system without weakening consent, idempotency, unsubscribe, or observability controls.

## Current registered dependencies

Re-verify live state immediately before mutation. Repository registry state currently records:

- `assessment-operator-brief-intake`: n8n `V28T575q7GSRFOti`
- `operator-brief`: n8n `Ug7hA8cXrrCIVYkI`
- `production-failure-dead-letter`: n8n `iX0ehWNElYUfdCQZ`

The repository registry is not proof of the running workflow version.

## Public intake contract

Endpoint expected by the prepared landing page:

`POST https://n8n.tca-infraforge.site/webhook/tayoca/growth/operator-brief`

Required form fields:

- `email`
- `interest`
- `consent=yes`
- `source=lead_magnet`
- `lead_magnet=debugging-ai-generated-devops-scripts`
- `campaign=evergreen-ai-script-debugging`
- `website` honeypot, which must remain empty

The existing endpoint must continue to return a bounded, non-enumerating public response. The response must not reveal whether the email address already exists.

## Intake persistence

Before any delivery is attempted, the workflow must durably persist or reconcile:

- normalized email identity
- explicit Operator Brief consent state
- acquisition source
- lead magnet key
- campaign attribution
- primary interest
- first-request timestamp
- most-recent-request timestamp
- globally-unsubscribed suppression state

Subscriber state remains authoritative. A lead-magnet request must not bypass existing global unsubscribe or topic-scoped unsubscribe controls.

## Idempotency

Use deterministic identities rather than timing windows.

Recommended keys:

- subscriber: normalized email
- sequence membership: `sha256(normalized_email + ':debugging-ai-generated-devops-scripts')`
- delivery send: `sha256(sequence_membership + ':email-0')`
- nurture sends: `sha256(sequence_membership + ':email-1')` through `email-4`

A repeat request may intentionally resend Email 0, but must not create a second future nurture sequence. If Email 0 resend is enabled, it needs a separately recorded request-generation key so historical provider send IDs are not overwritten.

## Email 0 transaction boundary

Immediate delivery is permitted only after:

1. input and honeypot validation pass;
2. consent is explicit;
3. subscriber state is successfully persisted;
4. global and Operator Brief suppression checks pass;
5. lead-magnet sequence membership is reconciled idempotently;
6. the stable download URL has already passed publication certification.

If any prerequisite fails, do not send.

Persist at minimum:

- deterministic send key
- provider
- provider message/send ID
- requested_at
- accepted_at or failed_at
- attempt count
- normalized error class
- workflow execution ID

## Scheduled nurture

Canonical cadence:

- Email 1: +1 day
- Email 2: +3 days
- Email 3: +5 days
- Email 4: +7 days

Each scheduled send must re-read the authoritative subscriber state immediately before sending. Do not rely on sequence state cached at enrollment time.

Every send is suppressed when:

- global unsubscribe is active;
- Operator Brief subscription is inactive or unsubscribed;
- consent was revoked;
- the sequence was administratively cancelled.

A suppressed send is terminal for that scheduled step and must be recorded as `suppressed`, not `failed`.

## Retry policy

Provider/network failures may retry with bounded exponential backoff. Never retry validation, consent, suppression, or policy failures.

A retry must reuse the same deterministic send key and must not create a second logical delivery record.

## Download contract

Public URL should be Tayoca-controlled, version-stable, and human-readable, for example:

`https://tayoca.com/downloads/debugging-ai-generated-devops-scripts-v1.0.pdf`

Before activation, certify:

- HTTP 200
- `Content-Type: application/pdf`
- expected artifact byte size/hash recorded
- PDF page count = 59
- title-migrated artifact, if adopted, is separately certified without altering historical v1.0 evidence

The landing page must not expose a download link before successful subscription. Email 0 is the primary delivery path.

## Analytics

Minimum first-party events:

- `lead_magnet_view`
- `lead_magnet_form_start`
- `lead_magnet_submit`
- `lead_magnet_delivery_sent`
- `lead_magnet_download`
- `lead_magnet_sequence_step_sent`
- `lead_magnet_sequence_step_suppressed`
- `paid_product_detail_click`

Do not treat email opens as authoritative engagement evidence.

## Failure monitoring

Any production error from intake, delivery, scheduler, or provider adapter must enter the existing production failure monitoring lane with sanitized metadata only. Do not emit email bodies, tokens, API keys, or unnecessary subscriber PII into alerts.

## Activation acceptance test

Use one controlled synthetic subscriber identity. Certification passes only if all of the following are evidenced:

1. First submission is accepted.
2. Subscriber state appears once with explicit consent and correct source/campaign/lead-magnet metadata.
3. Email 0 sends once and records provider evidence.
4. Download URL returns the certified 59-page PDF.
5. Repeating the form submission does not duplicate future sequence membership.
6. Scheduled steps are represented once each.
7. Unsubscribe transitions the authoritative state successfully.
8. A subsequent due nurture step is suppressed after unsubscribe.
9. Public unsubscribe response remains non-enumerating.
10. No unexpected revenue-pipeline opportunity is created merely from newsletter/lead-magnet subscription.

## Rollback

If runtime activation fails:

- keep the landing page outside `public/`;
- disable only the new lead-magnet branch/scheduler while preserving the existing Operator Brief intake and publication workflows;
- retain failed execution evidence and provider IDs;
- do not delete existing subscriber consent records;
- restore the pre-change workflow version only after recording the rollback version and reason.

## Publication gate

The prepared landing page can move into `public/` only after the acceptance test above passes against the live system and the certified PDF download path is proven.