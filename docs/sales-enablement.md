# Tayoca Sales Enablement

This is the Stage 11 sales-enablement layer for Tayoca. It turns the governed product ecosystem and assessment evidence into consistent commercial conversations without inventing proof.

## Client-facing brand contract

All Stage 11 client-facing proposals, scopes, quotations, invoices, executive reports, follow-up documents, presentation material, and outbound commercial email must use **Tayoca Brand System v1** (`tayoca-brand-v1.0.0`) unless a later canonical release explicitly supersedes it.

Canonical public identity:

- `TAYOCA`
- `Temitayo Charles | Tayoca <temitayo@tayoca.com>`
- Reply/contact: `temitayo@tayoca.com`
- Website: `https://tayoca.com/`
- Digital contact card: `https://tayoca.com/temitayo.html`
- Public location: `Ontario, Canada`
- Positioning: `Technology Value | Platform Reliability | Agentic Operations`
- Palette: near-black `#0d0d0d`, white, Tayoca orange `#f97316`
- Canonical email signature: `/assets/email/tayoca-founder-signature.html`

The private inbound mailbox destination, residential address, personal phone number, private credentials, and internal endpoints are not client-facing brand data. Do not place them in proposals, invoices, signatures, presentations, QR payloads, sales collateral, or automated outbound messages.

Document styling is a presentation layer only. It must never overwrite Stage 11 authority for opportunity identity, proposal status, scope version, price, currency, acceptance, payment verification, evidence, or revenue attribution. A branded draft is still a draft; it may be sent only when its governing approval state permits sending.

## Commercial ladder

Use the smallest commercial step that fits the buyer's actual problem.

1. **Operator Tools** when the buyer needs working software or operational automation.
2. **Operator Playbooks** when the team can execute internally but needs a proven operating structure.
3. **Executive Assessments** when the problem is unclear, politically difficult, evidence-poor, or requires a prioritized decision before implementation.
4. **Managed Operations** when the buyer needs an ongoing operating capability rather than a one-off recommendation.

Do not force every buyer toward the highest-priced option. Route to the offer whose buyer, problem, deliverable, evidence boundary, pricing method, limits, and next action match the situation.

## Qualification questions

### Problem

- What decision or operating problem must be resolved?
- What happens if nothing changes in the next 30 to 90 days?
- Which systems, costs, risks, or teams are affected?

### Evidence readiness

- What evidence exists today: billing data, architecture, incidents, telemetry, runbooks, repositories, delivery records, or operating metrics?
- Who can authorize access to the evidence required for the assessment or engagement?
- Is there information that must remain restricted or non-public?

### Authority and timing

- Who owns the decision?
- Who will approve scope and commercial terms?
- What deadline or event is driving the work?

### Commercial fit

- Is the buyer asking for a diagnosis, implementation, an operating tool, a reusable playbook, or an ongoing managed capability?
- Is there a defined budget, procurement path, or approval threshold?

## Assessment-to-proposal handoff

A proposal should not be prepared merely because a lead submitted a form. Before proposal drafting, record:

- `opportunity_id`
- completed or materially sufficient assessment evidence
- problem summary
- desired outcome
- proposed deliverables
- assumptions and exclusions
- timeline
- pricing method
- evidence references
- accountable decision-maker or buyer contact when known

The proposal and scope must keep the same opportunity ID. New commercial versions receive new proposal/scope version identifiers rather than overwriting history.

Use `docs/proposal-template.md` and `docs/scope-template.md` as the canonical content contracts. A renderer may produce DOCX, PDF, HTML, presentation, or email-friendly versions, but it must preserve those contracts and Tayoca Brand System v1.

## Objection handling

Record material objections in the Objection Ledger instead of relying on memory.

### Budget

Clarify whether the objection is affordability, budget timing, approval threshold, or uncertainty about value. Respond with the defined deliverable, evidence boundary, implementation scope, and pricing method. Do not invent savings or ROI figures.

### Timing

Clarify the actual deadline, dependency, and consequence of delay. If the proposed timeline does not fit, revise scope or sequencing through change control rather than promising unsupported acceleration.

### Authority

Identify the decision owner and required stakeholders. Do not treat an interested user as an authorized buyer without evidence.

### Need

Return to the observed problem and assessment evidence. If the problem is not material enough, recommend no purchase or a smaller Tayoca product.

### Trust

Use approved evidence only: product deliverables, public verified evidence, approved reviews, claims-register entries, and explicit engagement controls. Never fabricate logos, customers, adoption, rankings, outcomes, or private-repository details.

### Scope

Separate must-have outcomes from optional additions. Use the scope template and versioned change control.

### Security

Explain the least-privilege access boundary, confidentiality controls, evidence handling, and the rule that private repository content remains non-public by default. Do not make unsupported compliance certifications.

### Procurement

Capture vendor, invoicing, legal, security-review, payment, and approval dependencies explicitly. A procurement delay is not a verbal commitment and must not be counted as revenue.

### Competition

Compare the buyer's required operating outcome, constraints, evidence, support model, and total scope. Avoid unsupported superiority claims.

### Implementation risk

Use milestones, acceptance criteria, rollback, dependencies, and explicit exclusions. Do not promise zero risk or guaranteed outcomes.

## Offer-family proof boundaries

### Operator Tools

Use only capabilities and boundaries recorded in `public/data/product-ecosystem.json` and approved public product evidence.

### Operator Playbooks

Describe what the product contains and who it is for. Do not imply employment, certification, income, exam, or production outcomes unless separately verified and approved.

### Executive Assessments

Sell the diagnostic decision process: evidence collection, analysis, prioritization, and action plan. Do not promise savings, uptime, or transformation before the evidence is reviewed.

### Managed Operations

Define the recurring operating capability, cadence, evidence boundary, service limits, and commercial terms. Support and SLA language must match the signed plan; do not revive the removed generic 24/7 or implied-SLA claims.

## Follow-up assets

Use the Stage 8 editorial system for any outward-facing sales asset. Appropriate approved formats include:

- executive brief
- technical article
- case study where evidence/disclosure approval exists
- product update
- sales-enablement asset
- approved channel adaptation

Private repository intelligence remains internal signal by default and cannot be converted automatically into sales collateral.

## Close discipline

A service opportunity is `won` only after a verified commercial event exists. The Revenue Attribution row must carry the opportunity ID, proposal ID, revenue reference, amount, currency, source system, and `verified=true`.

A verbal yes, accepted meeting, proposal view, procurement review, or unsigned intent is not revenue.

For a lost opportunity, record the loss reason and unresolved objection when applicable. This allows Stage 11 to improve qualification and sales enablement without rewriting the historical record.
