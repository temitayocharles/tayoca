# Tayoca Phase 2 — Conversion and Customer Journey Audit

Status: **COMPLETE / CERTIFIED**

Audit started: **2026-09-13**  
Closed: **2026-09-13**

Roadmap phase: **Phase 2 — Conversion and customer journey**

## Objective

Validate the five primary Tayoca visitor journeys end-to-end, remove verified conversion defects, preserve attribution and measurement, and test forms without creating fake production records.

Safe form-test mode: `?tayoca_test=stage12`. In this mode `growth-os.js` returns deterministic local success responses and does not create assessment leads, Operator Brief subscriptions, or unsubscribe mutations.

## Primary journeys and final verdicts

1. **Service → assessment → qualified conversation — PASS**
   - Service-specific assessment CTA is present.
   - Cloud & AI Cost deep-link preselection is verified.
   - UTM attribution and `test_traffic=stage12` are preserved.
   - Safe assessment submit reaches the success state without creating a production lead.
   - Qualified Cloud & AI Cost requests expose `https://cal.com/tayoca/finops-audit` as the next action.
   - Scheduling CTA emits `assessment_schedule_click`.

2. **Operator Brief → reader → service/product interest — PASS**
   - Signup form is present and usable on desktop/mobile.
   - Stage 12 signup reaches its success state without creating a subscription.
   - `generate_lead` and `operator_brief_signup` are emitted and attributable.
   - Newsletter source/issue attribution and Stage 12 traffic marker are preserved.
   - Archive, trust and unsubscribe paths remain available.

3. **Product detail → external purchase/use path — PASS after remediation**
   - Representative route: `/products/aws-cost-optimization-playbook.html`.
   - Both purchase CTAs resolve to `https://tayoca.gumroad.com/l/aws-cost-optimization` and open externally.
   - Browser certification exposed a real instrumentation gap: product-detail pages load `revenue-events.js`, not `growth-os.js`, so `gumroad_click` existed while `product_purchase_click` and canonical `product_click` were missing.
   - PR #92 fixed `public/revenue-events.js` so product-detail purchase CTAs now emit `product_purchase_click` and `product_click`; `ga4.js` continues to emit `gumroad_click`.
   - The event-contract gate now requires all three events exactly once for the representative product click.
   - No purchase was made during certification.

4. **Work/evidence → assessment/contact — PASS**
   - `/work.html` resolves successfully.
   - Primary `Start an Assessment` route reaches `/assessments.html`.
   - Desktop and mobile route continuity are covered by the browser regression.

5. **Community initiative → governed intake — PASS**
   - `/community/websites` resolves successfully.
   - Primary application CTAs share the governed Google Forms destination and open externally.
   - Desktop/mobile destination integrity is covered without submitting an application.

## Defects found and disposition

### Invalid assessment test fixture — fixed in regression harness

The original Stage 12 event-contract fixture filled `context` with 35 characters while production correctly enforces `minlength="40"`. Native browser validation therefore prevented the submit event. The production form was not defective.

The fixture now uses a valid context value longer than 40 characters and continues to prove that no production lead is created in Stage 12 mode.

### Product-detail conversion events — production defect fixed

Diagnostic evidence showed the representative product click emitted counts `0/0/1` for `product_purchase_click` / `product_click` / `gumroad_click`. The missing first two events were a production measurement gap on product-detail pages.

PR **#92 — Fix Tayoca Stage 12 conversion event contract** repaired the runtime and browser contract. Canonical merge:

`be6ceeec7534d5fdb7f394b87094aef3d53bcfec`

Temporary diagnostic workflows and artifacts were removed before merge.

## Automated browser certification

Permanent browser regression: `scripts/conversion_journey_browser_check.cjs`.

It runs pinned Chromium in both:

- desktop: `1440×1000`
- mobile: `390×844`, touch/mobile mode

It certifies:

- service → assessment deep link;
- assessment preselection;
- Stage 12 safe submit and success state;
- correct scheduling handoff;
- attribution preservation;
- Operator Brief safe signup and success state;
- Work → assessment navigation;
- product CTA count, destination and external-target contract;
- community application CTA count, shared destination and external-target contract;
- page-error absence.

`conversion_error_state_browser_check.cjs` remains part of the same conversion-runtime workflow for confirmation/error-state recovery coverage.

`conversion_event_contract_browser_check.cjs` additionally certifies the first-party event payload contract for assessment, Operator Brief and product interactions.

### CI evidence

Pre-merge clean-head certification on `001b8943a6e6bea36f0fc1d883e6849df6fa9f85`:

- Forgejo conversion runtime **#32507 / action 1630 — SUCCESS**

Post-merge certification on canonical `main` `be6ceeec7534d5fdb7f394b87094aef3d53bcfec`:

- Forgejo conversion runtime **#32521 / action 1635 — SUCCESS**
- Forgejo deployment parity **#32529 / action 1636 — SUCCESS**
- main push checks **#32518–#32520** are green on the merged revision (an earlier superseded concurrent run was cancelled).

## Downstream production evidence

GitHub mirror `main`:

`7605f2078df27847157a3d08d820d3d77599fd1c`

Mirror metadata records:

- `Canonical-Forgejo-Commit: be6ceeec7534d5fdb7f394b87094aef3d53bcfec`
- `Canonical-Tree: 7efcb765f49a932ca3741cb0c96143b1362965ad`

Vercel production deployment:

`dpl_BXCkvyviDEXp6qi76zbXitQeSnpQ`

State: **READY / PROMOTED**, aliases assigned with no alias error to `tayoca.com` and `www.tayoca.com`.

Deployment source is GitHub `main` at `7605f2078df27847157a3d08d820d3d77599fd1c`, which points back to the exact canonical Forgejo merge above.

Deployment parity run 1636 proves the deployed public bytes match the canonical public tree for this revision.

## Scrapling live production verification

Scrapling through Composio was used as the first-class live browser after deployment. The bounded production session verified successful rendering of:

- `/products/aws-cost-optimization-playbook.html?tayoca_test=stage12`
- `/assessments.html?...&tayoca_test=stage12#assessment-form`
- `/operator-brief.html?...&tayoca_test=stage12`
- `/work.html`
- `/community/websites`

The live product route exposed both Gumroad purchase CTAs; the assessment route exposed the assessment catalogue/form; Operator Brief exposed signup/unsubscribe surfaces; Work exposed the assessment CTA; Community exposed the governed Google Forms application path. No external purchase or application was submitted during live verification.

## Measurement contract

Critical conversion events now include:

- `generate_lead`
- `assessment_schedule_click`
- `operator_brief_signup`
- `product_purchase_click`
- `product_click`
- `gumroad_click`

`ga4.js` preserves sanitized first-touch/last-touch attribution, newsletter attribution, case-study assist attribution and Stage 12 test-traffic separation. Sensitive query keys remain stripped from stored/reporting URLs.

## Phase 2 exit-gate verdict

**PASS. Phase 2 is complete.**

- all five primary journeys are documented;
- no known conversion dead end remains;
- assessment and Operator Brief handoffs pass safe tests without fake production records;
- meaningful conversion events are emitted and attributable;
- representative desktop/mobile journey regressions pass;
- the only verified production instrumentation defect found during the phase was remediated and re-certified;
- downstream mirror, promoted Vercel production and canonical deployment parity are proven.

The roadmap may now advance to **Phase 3 — Content architecture and authority**.
