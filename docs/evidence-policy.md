# Tayoca Evidence, Publication and AI Policy

Status: **Stage 4 authority**  
Effective: 2026-08-09  
Commercial authority: `docs/positioning.md`  
Source authority: `docs/repository-source-of-truth.yaml`  
Machine-readable claim state: `docs/claims-register.yaml`

## Principle

Public claims must be **traceable, proportionate, approved, privacy-safe, and correctable**. A plausible statement is not evidence. A public repository is not publication approval. A generated narrative is not a case study.

Private repository, client, payment, credential, security, personnel, and restricted operational details are nonpublishable by default.

## Evidence schema

Every material claim must resolve to a record containing:

- `claim_id` — stable identifier.
- `claim_text` — exact or normalized claim.
- `claim_type` — factual, quantified_outcome, testimonial, credential, capability, policy, pricing, estimate, or positioning.
- `surfaces` — current or intended public locations.
- `source_class` — client_evidence, first_party_operational, first_party_commercial, public_primary_source, buyer_review, credential_record, policy_record, or none.
- `evidence_refs` — durable references sufficient to re-check the claim without relying on memory.
- `subject_owner` — accountable owner of the underlying fact or system.
- `evidence_owner` — person or function responsible for maintaining evidence.
- `disclosure_class` — public, redacted_public, permission_required, confidential, restricted, or secret.
- `approval_state` — approved, conditional, pending, blocked, retired, or corrected.
- `approval_record` — who approved publication, when, and under what scope.
- `measurement` — baseline, period, method, units, assumptions, and confidence where applicable.
- `limitations` — material caveats or non-transferable conditions.
- `correction_path` — how a challenged or stale claim is corrected or withdrawn.
- `last_verified_at` — timestamp of the latest evidence check.
- `expires_at` — required for time-sensitive claims where appropriate.

Missing required evidence or approval is fail-closed: the claim is not reusable public proof.

## Claim lifecycle

`DISCOVERED -> PENDING_EVIDENCE -> PENDING_APPROVAL -> APPROVED -> PUBLISHED`

Alternative terminal/control states:

- `BLOCKED` — insufficient evidence, unsafe disclosure, unsupported attribution, or unresolved contradiction.
- `CONDITIONAL` — usable only with stated conditions/qualifiers.
- `CORRECTED` — previously published wording was materially changed; correction record retained.
- `RETIRED` — no longer current or authorized for reuse.

Automation may discover, extract, normalize, compare, and draft. It may **not** promote a claim from pending/blocked to approved.

## Evidence strength

From strongest to weakest for outcome claims:

1. Direct source-system evidence with reproducible measurement and retained baseline.
2. Client-approved records with independent or jointly reviewable measurement.
3. First-party operational records with reproducible calculation.
4. Contemporaneous written records with corroboration.
5. Public primary sources for externally verifiable facts.
6. Secondary sources, recollection, generated text, marketing drafts, or example numbers.

Levels 5-6 do not establish a private client outcome. Generated text and marketing copy are never self-authenticating evidence.

## Quantified claims

A cost, percentage, uptime, latency, time-to-delivery, productivity, revenue, ROI, or performance claim must include:

- baseline and comparison period;
- source data and calculation method;
- units/currency and whether amounts are actual, annualized, modeled, projected, or realized;
- implementation boundary and material confounders;
- validation owner;
- disclosure approval;
- limitations and date.

Modeled savings must be labeled as modeled/estimated. They become realized savings only after the agreed post-change measurement confirms them.

## Case-study standard

A public case study requires all of the following before publication:

1. **Subject authority** — the organization/project may be described at the chosen level of identification.
2. **Problem baseline** — evidence-backed pre-intervention condition.
3. **Intervention record** — what actually changed, by whom, and within what scope.
4. **Outcome measurement** — method, period, source, and distinction between realized and projected results.
5. **Reliability/safety context** — any statement that performance or reliability was preserved must be separately measured.
6. **Disclosure approval** — client/subject consent where required, plus internal publication approval.
7. **Known limits** — what the case does not prove and what is environment-specific.
8. **Evidence retention** — durable internal references sufficient for later re-verification.

Composite, illustrative, anonymized, or reconstructed examples must be labeled as such and must not be written as a real client engagement.

## Client confidentiality and disclosure

Client and prospect information is confidential unless the disclosure scope is explicitly approved. This includes names, logos, architecture, screenshots, tickets, repositories, source code, incident records, cost data, security posture, internal hostnames, employee information, and commercial terms.

- Anonymization must remove information that could reasonably re-identify the subject when combined with context.
- Client approval to perform work is not approval to publish the work.
- A client name/logo requires explicit publication authority for that use.
- Technical evidence intended for public proof must be reduced to the minimum necessary, safely redacted, and checked for secrets and sensitive operational details.
- Screenshots and diagrams must be reviewed for hidden identifiers, URLs, account IDs, credentials, internal topology, and personal data before publication.
- When disclosure authority is uncertain, the material remains non-public.

## Testimonials and buyer reviews

A review may be described as a **verified buyer review** only when all controls below pass:

- purchase identity is verified against an authoritative commerce-provider record;
- the reviewed product is within the Tayoca product allowlist;
- the buyer has not been refunded/disputed/chargebacked when that matters to eligibility;
- review submission is bound to the verified purchase and buyer identity using a non-guessable or otherwise strongly protected mechanism;
- publication consent is explicit;
- published identity follows the buyer's selected display preference;
- a human moderation/approval record exists;
- critical sentiment is not a rejection criterion;
- private buyer/payment information is stripped from the public feed;
- corrections/withdrawal can be applied without fabricating history.

Provider-authenticated ingress is preferred. Where ingress is unauthenticated, server-side provider verification is a compensating control but must be documented and risk-assessed. Deterministic public review tokens are not accepted as the long-term control.

No review, rating, testimonial, buyer identity, or aggregate score may be fabricated, seeded, inferred, or silently edited.

## Credentials and attestations

Certifications, professional credentials, partnership badges, customer logos, and attestations are factual claims. Each requires a credential/evidence reference, holder/entity, current status where relevant, and approval for public display. Unverified abbreviations in a footer are not exempt.

## Pricing, guarantees and service levels

Current price points may be published from the commercial authority. Guarantees, refunds, SLAs, delivery-time promises, and performance commitments require their conditions and measurement method in the approved offer/SOW. Marketing shorthand must not broaden the contractual commitment.

## Sponsorships, affiliates and commercial relationships

Commercial relationships must not be hidden inside editorial or recommendation content.

- Sponsored content must be clearly identified as sponsored or paid where the relationship could affect reader interpretation.
- Affiliate links must be disclosed near the relevant recommendation or through an obvious page-level disclosure before a purchase decision.
- Referral fees, commissions, gifts, free access, or other material consideration that could influence a recommendation must be disclosed.
- Sponsorship or affiliate status does not change the evidence threshold for factual, comparative, performance, or outcome claims.
- Tayoca must not imply independent endorsement where compensation or a material relationship exists.
- Revenue attribution and partner reporting may be automated, but disclosure language and material endorsement claims remain approval-gated.

## Conflicts of interest

A material conflict exists when Tayoca, a contributor, an affiliate, a client relationship, an ownership interest, or another commercial dependency could reasonably affect—or appear to affect—the neutrality of a recommendation or evaluation.

Material conflicts must be disclosed at the point where they matter. When a conflict makes an objective comparison impractical, the content must be framed as first-party positioning or opinion rather than independent evaluation.

## Generated imagery and synthetic media

Generated or materially synthetic imagery may support illustration and design, but it is not evidence of a real client, deployment, facility, person, product state, or measured outcome.

- Synthetic imagery must not be used to fabricate testimonials, client environments, screenshots, credentials, dashboards, or before/after evidence.
- When a reasonable viewer could mistake generated media for documentary evidence, the media must be labeled as generated, illustrative, simulated, or concept imagery.
- AI-generated diagrams or mockups may describe a proposed architecture only when the surrounding wording does not imply production deployment.
- Generated likenesses or media involving identifiable people require appropriate consent and must not imply endorsement without approval.
- Editorial automation must preserve any required generated-media disclosure when content is republished or reformatted.

## Repository and operational evidence

Repository-derived evidence must obey `docs/repository-source-of-truth.yaml`.

- Private repositories are nonpublishable by default.
- Public visibility does not equal approval.
- Backup, recovery, test, legacy, ambiguous-authority, and pending-platform-only repositories cannot feed public claims automatically.
- Secrets, credentials, internal hostnames where sensitive, security weaknesses, personal data, client-confidential data, and raw payment data must never be exposed as proof.
- Code existence may support a capability claim; it does not by itself prove production use, reliability, adoption, savings, revenue, or business impact.

## Editorial and AI ethics

AI may assist research, extraction, comparison, analysis, drafting, formatting, and controlled automation. Human accountability remains with Tayoca.

AI must not:

- invent client identities, deployments, measurements, citations, testimonials, credentials, or results;
- convert estimates into realized outcomes;
- present example architecture or generated code as production evidence;
- obscure material uncertainty or source conflict;
- disclose restricted data because it is technically accessible;
- autonomously publish a material claim or sensitive communication;
- remove sponsorship, affiliate, conflict, generated-media, correction, or evidence qualifiers during rewriting.

Material public content requires an identifiable human approval step. Corrections must be possible after publication.

## Correction policy

A challenged material claim is moved to `PENDING_EVIDENCE` or `BLOCKED` until re-verified. If incorrect or materially misleading:

1. stop reuse/automation of the claim;
2. correct or withdraw affected public surfaces;
3. retain the prior wording and reason in the claim record;
4. record correction date and approver;
5. propagate the correction to derivative content where practical.

Corrections may be reported to `support@tayoca.com`.

## Publication gate

A material claim is publishable only when:

`evidence sufficient AND disclosure allowed AND approval recorded AND current wording within approved scope`.

Anything else is fail-closed.
