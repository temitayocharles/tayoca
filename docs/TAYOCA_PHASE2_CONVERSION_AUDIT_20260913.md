# Tayoca Phase 2 — Conversion and Customer Journey Audit

Status: **IN PROGRESS**

Audit started: **2026-09-13**

Roadmap phase: **Phase 2 — Conversion and customer journey**

## Objective

Validate the five primary Tayoca visitor journeys end-to-end, identify actual friction or dead ends, preserve attribution and measurement, and test forms without creating fake production records.

The safe form-test mode already present in the public runtime is:

`?tayoca_test=stage12`

In that mode `growth-os.js` returns local deterministic success responses and does not create assessment leads, subscriptions, or unsubscribe mutations.

## Primary journeys

1. Service understanding → assessment → qualified conversation
2. Operator Brief → recurring reader → service/product interest
3. Product detail → external purchase/use path
4. Work/evidence → assessment/contact
5. Community initiative → governed intake

## Live surface audit

### 1. Assessment journey

Live route: `/assessments.html`

Observed production form:

- `method="post"`
- `data-tayoca-form="assessment_request"`
- action: `https://n8n.tca-infraforge.site/webhook/tayoca/growth/assessment`
- fields: `email`, `company`, `role`, `segment`, `assessment`, `urgency`, `evidence_readiness`, `context`

Assessment catalogue links preselect the selected assessment, preserve campaign attribution, and jump to `#assessment-form`.

Examples include:

- Technology Value Assessment → `utm_campaign=pgc1_ai_automation_operations`
- Cloud & AI Cost Assessment → `utm_campaign=pgc1_cloud_ai_cost`
- Platform Reliability Assessment → `utm_campaign=pgc1_platform_kubernetes_reliability`

All three use `utm_source=tayoca_site`, `utm_medium=internal`, and `utm_content=assessment_catalog_card`.

Runtime behavior in `growth-os.js`:

- query-string assessment is preselected in the form;
- UTM fields are preserved in the submission payload;
- `tayoca_test=stage12` avoids production record creation;
- successful assessment requests emit `generate_lead`;
- qualified Cloud & AI Cost requests map to `https://cal.com/tayoca/finops-audit`;
- qualified Platform Reliability / Technology Value requests map to `https://cal.com/tayoca/platform-engineering-consultation`;
- generated scheduling CTA emits `assessment_schedule_click`;
- error state provides `support@tayoca.com` as a recovery path.

Initial verdict: **journey contract exists and is safely testable; interactive desktop/mobile execution remains to be certified.**

### 2. Operator Brief journey

Live route: `/operator-brief.html`

Observed subscription form:

- `method="post"`
- `data-tayoca-form="operator_brief"`
- action: `https://n8n.tca-infraforge.site/webhook/tayoca/growth/operator-brief`
- fields: `email`, `interest`, `consent`, plus `website` honeypot

Observed unsubscribe form:

- `data-tayoca-form="operator_brief_unsubscribe"`
- public tooling redacts the action value, as expected for sensitive endpoint handling

Runtime behavior:

- safe test mode returns a local success without creating a subscription;
- successful signup emits `generate_lead` and `operator_brief_signup`;
- unsubscribe test mode avoids modifying subscription state;
- archive and trust links provide onward navigation.

Initial verdict: **reader acquisition path exists and is safely testable; interactive success-state and mobile checks remain.**

### 3. Product purchase journey

Representative live route: `/products/aws-cost-optimization-playbook.html`

Observed CTAs:

- `Buy securely on Gumroad`
- `Buy for $29`

Both point to:

`https://tayoca.gumroad.com/l/aws-cost-optimization`

Both carry `data-event="product_purchase_click"` and open externally.

Measurement behavior:

- `growth-os.js` emits the explicit `product_purchase_click` event;
- `growth-os.js` emits `product_click` for Gumroad links;
- `ga4.js` emits `gumroad_click` for Gumroad outbound clicks.

The multiple names for a single purchase-intent click are recorded here as an event-contract observation, not automatically classified as a defect. Consolidation belongs to the measurement contract only if later evidence shows double-counting or reporting ambiguity.

Initial verdict: **destination is explicit and instrumented; destination reachability and mobile click behavior remain to be certified without purchasing.**

### 4. Work/evidence journey

Live route: `/work.html`

Observed:

- route returns HTTP 200;
- primary `Start an Assessment` path points to `/assessments.html`;
- no form is embedded on the Work page;
- generic assessment-link instrumentation in `growth-os.js` emits `assessment_cta_click` for links whose destination contains `assessments`.

Initial verdict: **Work → assessment path exists; no instrumentation defect is inferred merely because the link lacks a page-specific `data-event`.**

### 5. Community governed-intake journey

Live route: `/community/websites`

Observed primary intake CTAs:

- `Apply on Google Forms`
- `Apply now`

Both point to the same Google Forms destination:

`https://docs.google.com/forms/d/e/1FAIpQLSeTyWlIZzI8uz4zNRiLXaNdIAw3NuPDIRxnuemwIb7c-IW64Q/viewform`

The links open in a new tab. `ga4.js` classifies cross-origin links as `outbound_click`.

Initial verdict: **governed external intake path exists; destination reachability and mobile behavior remain to be certified without submitting an application.**

## Measurement and attribution already present

`public/ga4.js` defines conversion events including:

- `generate_lead`
- `assessment_schedule_click`
- `operator_brief_signup`
- `product_click`

It also:

- records sanitized first-touch and last-touch attribution;
- preserves newsletter attribution;
- supports case-study assist attribution;
- marks Stage 12 test traffic separately;
- sends events to GA4 and the first-party collector;
- strips sensitive query keys from stored/reporting URLs;
- emits `outbound_click` and `gumroad_click` as appropriate.

## Next execution gate

The next Phase 2 action is a browser-level journey certification, using Scrapling first:

1. desktop service → assessment deep link → preselected form → Stage 12 safe submit → generated next action;
2. mobile equivalent of the assessment journey;
3. desktop/mobile Operator Brief safe signup → success state;
4. product CTA destination integrity without purchase;
5. Work → assessment route continuity;
6. Community → Google Forms destination integrity without submission;
7. confirmation/error-state and dead-end review;
8. attribution preservation across the assessment deep-link path.

Only verified defects or material friction discovered by these tests should be remediated. The Phase 2 exit gate remains unchanged: all primary journeys documented, no known dead ends, safe form/handoff tests green, meaningful events attributable, and representative desktop/mobile journey tests passing.
