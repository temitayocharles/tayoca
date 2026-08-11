# Tayoca Assessment B2B Follow-up Runbook

This runbook governs Production Growth Cycle 1 W4. It extends the certified Stage 11 Revenue Pipeline; it does not create a second CRM or parallel opportunity system.

## Authorities

- Assessment intake: n8n workflow `V28T575q7GSRFOti`
- Opportunity ledger: Growth OS spreadsheet, `Revenue Pipeline`
- Scheduling authority: Cal.com account `tayoca`
- FinOps event type: `6432033` / `finops-audit`
- Platform and AI/LLMOps event type: `6432034` / `platform-engineering-consultation`
- Proposal controls: `docs/proposal-template.md`, `docs/scope-template.md`, and `docs/sales-enablement.md`

A browser scheduling click is intent only. It is not evidence that a consultation was booked. A pipeline row may enter `assessment_scheduled` only when a real Cal.com booking or equivalent operator-verified scheduling record exists.

## Intake outcomes

### `assessment_submitted` / qualification status `review`

Use when urgency, evidence readiness, or submitted context is insufficient for automatic qualification.

- Do not show a self-scheduling CTA.
- Keep `next_action=review_assessment_fit` until an operator reviews the submitted evidence.
- Review the buyer problem, urgency, evidence readiness, organization/role context, and campaign lineage.
- If the evidence supports qualification, transition to `assessment_qualified` and set `next_action=schedule_assessment`.
- If there is no commercial fit, transition to `lost` only with a recorded `loss_reason`.
- If more information is needed, keep the opportunity at `assessment_submitted`; record the requested information in `notes` and set an appropriate `next_action` / `next_action_due_at` rather than inventing a new pipeline stage.

### `assessment_qualified`

A qualified opportunity may receive the consultation CTA.

Scheduling route:

- `Cloud & AI Cost Assessment` -> `https://cal.com/tayoca/finops-audit`
- `Platform Reliability Assessment` -> `https://cal.com/tayoca/platform-engineering-consultation`
- `Technology Value Assessment` -> `https://cal.com/tayoca/platform-engineering-consultation`

The Platform Engineering Consultation is the current scheduling surface for both platform reliability and AI/LLMOps/technology-value conversations. Do not send Technology Value prospects to the FinOps booking type unless their assessment itself is changed through the governed intake path.

## Cal.com booking reconciliation

Cal.com booking lifecycle is not currently synchronized automatically into Revenue Pipeline. Until a credential-preserving automation path is certified, booking reconciliation is operator-controlled and fail-closed.

For each real booking:

1. Use the Cal.com booking UID, event type, attendee email, and start time as scheduling evidence.
2. Match the attendee email to an open Revenue Pipeline opportunity.
3. If exactly one open opportunity matches, verify that the booking event type is compatible with the assessment before changing stage.
4. If multiple open opportunities match, do not guess. Resolve using assessment, campaign, submitted timestamp, and buyer context.
5. Transition only `assessment_qualified -> assessment_scheduled`.
6. Update `stage_entered_at` and `updated_at`.
7. Set `next_action=conduct_assessment` and an appropriate due date.
8. Preserve booking evidence in `notes` using a compact record such as `cal_booking_uid=<uid>; event_type=<slug>; start=<ISO time>`.

A schedule CTA click, pageview, email reply, or inferred calendar intent must never cause the scheduled transition.

### Reschedule or cancellation

- A reschedule keeps the opportunity at `assessment_scheduled`; update the booking evidence and next-action due date.
- A cancellation does not silently move the opportunity backward. Record the cancellation in `notes` and set `next_action=reschedule_assessment`.
- Move to `lost` only after an operator determines the opportunity is no longer proceeding, and record a loss reason.

## Conversation and assessment progression

`assessment_scheduled -> assessment_in_progress` requires evidence that the assessment conversation or agreed evidence review actually began. Time passing on the calendar is insufficient by itself.

`assessment_in_progress -> assessment_delivered` requires the agreed assessment output or materially sufficient diagnostic result to exist. Preserve the evidence references used for findings.

## Proposal eligibility

Do not draft a proposal merely because an assessment was submitted, qualified, or booked.

Before `assessment_delivered -> proposal_draft`, the opportunity must have materially sufficient evidence for:

- the buyer problem and desired outcome;
- the proposed deliverables;
- assumptions and exclusions;
- timeline;
- pricing method;
- evidence references;
- the accountable decision-maker or buyer contact when known.

Proposal and scope records must retain the same `opportunity_id`. Proposal drafting does not authorize sending; `approval_state=approved_for_send` remains mandatory.

## Follow-up discipline

- Work the oldest open `review_assessment_fit` and `schedule_assessment` items first unless a documented urgency requires otherwise.
- Use `next_action` and `next_action_due_at` rather than relying on memory.
- Record material buyer objections in the existing Objection Ledger.
- Do not invent ROI, savings, uptime, customer proof, or commercial urgency to accelerate a sale.
- Do not mark `won` from a verbal yes, meeting booking, proposal view, or unsigned intent. Verified revenue controls remain binding.

## Automation debt

Automatic Cal.com booking-to-pipeline synchronization remains a W10 operational-debt item. It may be implemented only when the existing credential-bound Revenue Pipeline path can be extended without rebuilding certified workflow credentials/webhook identities or creating an uncontrolled parallel CRM.
