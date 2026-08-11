# Tayoca Workflow Recovery Runbook

## Scope

This runbook covers the five active Tayoca production workflows and the shared production failure monitor. Forgejo remains the canonical source for Tayoca application policy and the `temitayocharles/n8n-control-plane` Forgejo repository stores sanitized n8n workflow snapshots.

## Detection

The certified failure path is `Tayoca Ops | Production Failure & Dead Letter` (`iX0ehWNElYUfdCQZ`). It polls every five minutes and reads only failed-execution index metadata for the governed production workflow IDs. A new failed execution is identified by `execution:<execution_id>` and is written idempotently to the `Workflow Reliability` sheet before a sanitized Slack alert is emitted.

Do not use raw execution payloads as the routine alert source. They can contain customer or provider data. The monitor intentionally records workflow ID/name, execution ID, failure time, a generic failure class, recovery state, and source metadata only.

The native n8n `errorWorkflow` setting remains configured as a best-effort control, but Stage 13 certification does not depend on it because isolated real-webhook probes did not dispatch the Error Trigger workflow on this n8n instance.

## Triage

1. Locate the `Workflow Reliability` row by `record_id` or `execution_id`.
2. Confirm the affected workflow and failure time.
3. Inspect the n8n execution only when needed for diagnosis, using least-privilege access. Do not copy raw payloads into Slack, Git, reports, or the reliability ledger.
4. Classify the incident:
   - transient dependency/network failure;
   - rate-limit/backpressure failure;
   - credential or authorization failure;
   - input/data-contract failure;
   - application/workflow logic failure;
   - upstream provider outage.
5. If the operation is not provably idempotent, do not retry automatically. Establish the external side effect state first.

## Workflow-specific rules

### Infobip

The callback pipeline is `Normalize -> Idempotent Upsert -> Summarize -> Acknowledge`.

- Callback batches greater than 100 must fail before acknowledgement.
- Duplicate callback metadata collapses by deterministic `event_id`.
- Message text, sender/recipient phone numbers, headers and raw payloads must not be persisted in the Infobip Event Ledger.
- If acknowledgement was not reached, provider redelivery is safe because the metadata upsert is idempotent.

### Assessment and Operator Brief Intake

- Preserve deterministic lead/opportunity identifiers.
- Verify the durable lead record and Revenue Pipeline state before retrying downstream writes.
- Never manufacture an accepted public response after a failed durable write.

### Operator Brief

- Publication remains human-approved.
- Forgejo archive writes use SHA/atomic update semantics.
- Sender-domain or email-delivery failure remains fail-closed; do not bypass domain verification.

### Verified Review and Trust

- Gumroad/provider verification remains authoritative.
- Replays must preserve the existing idempotency key and must never create a second verified sale or review journey from the same provider event.

### Revenue Command Center

- Revenue/proposal values remain governed by Stage 11 evidence.
- A reporting failure must not be converted into zero revenue/search/analytics without provenance.
- Re-running a report is allowed only after determining that prior KPI/Slack side effects will not duplicate materially.

## Backup and restore

Current sanitized snapshots are written by `Workflow Backup | Sanitized Forgejo Intake v4` (`fFOe97sMowmItUDi`) into `temitayocharles/n8n-control-plane/workflows/`.

Sanitized snapshots deliberately exclude credentials. Recovery therefore has two phases:

1. **Structural restore**
   - fetch the canonical snapshot;
   - validate JSON structure;
   - create the workflow inactive;
   - verify node count and connection roots;
   - verify there are zero credential bindings;
   - verify no webhook/schedule becomes active.
2. **Controlled activation**
   - rebind only approved current credentials;
   - validate webhook IDs/paths, schedules, and environment references;
   - run a pin-data test where possible;
   - compare against the recovery reference;
   - publish only after the recovery owner approves activation.

Stage 13 restore drill `72326` rehydrated six of six governed snapshots inactive with exact node counts/connection roots and zero credential bindings. All disposable restores were archived afterward.

## Rollback

For an application workflow change, prefer n8n's prior active version when it is a known-good rollback. For loss/corruption of the workflow definition, restore from the latest sanitized Forgejo snapshot, rebind credentials deliberately, validate, then activate.

For the public Tayoca site, Vercel deployment `dpl_5Hr57kTgKLisNiXBejjZU6TxTYJB` is the Stage 12/13 production baseline. Earlier Stage-specific rollback references remain documented in their baselines; do not roll back the website to a partially deployed Stage 10 state.

## Recovery closure

A reliability incident is closed only when:

- the workflow has returned to a known-good state;
- duplicate/external side effects were checked;
- the relevant recovery test or production readback passed;
- `recovery_state` is changed from `open` to `resolved`;
- `resolved_at` and `recovery_reference` are recorded;
- any permanent fix is backed up and its rollback reference is known.

## Known non-blocking platform limitations

- Native n8n `errorWorkflow` dispatch did not fire in Stage 13 isolated real-webhook probes despite the configured workflow ID. The active five-minute execution monitor is therefore the certified control.
- The global full-instance backup orchestration path can exceed the connector/manual execution boundary. Tayoca uses the existing bounded sanitized backup worker directly for the governed production set; the restore drill proves recoverability.
