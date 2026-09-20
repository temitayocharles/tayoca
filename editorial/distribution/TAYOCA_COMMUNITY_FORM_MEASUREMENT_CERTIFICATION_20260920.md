# Tayoca Community Form Measurement Certification

Date: 2026-09-20

## Purpose

Certify application-completion measurement for the Community Website Initiative without inferring submissions from CTA clicks and without exposing applicant response content.

## Application form

Google Form ID:

`1I608sLqNDmHH7lo5ocHsSuY2jikzaC6N0_cln9hiXdU`

Canonical bridge:

`JVeeHdnxAo9Huy6S` — Tayoca Growth OS | Community Google Form Intake Bridge

The bridge:

1. polls the Google Forms response endpoint through the existing authorized Google connection
2. reads only response IDs needed for deduplication from `Community Form Ledger`
3. routes unseen voluntary applications through the existing Tayoca intake webhook
4. appends a governed ledger receipt only after the intake returns an accepted response
5. keeps application completion distinct from page-view and CTA-click analytics

## Certified state

Manual certification execution `573398` completed successfully on 2026-09-20.

The direct Google Forms response query returned:

- total form responses: 0
- already-seen response IDs: 0
- unseen/new responses: 0

Therefore the certified application count at that poll time is **0 submitted applications**.

This number comes from the Forms response source. It is not inferred from Google Analytics, first-party CTA clicks, or outbound link traffic.

## Scheduler repair

The workflow had accumulated scheduled failures because the published version of `Expand Unseen Responses` used run-once-for-each-item mode while returning an array of items.

The repaired draft uses run-once-for-all-items. It was manually certified, then published as active version:

`80517283-8a98-4911-9bb5-e6638b17f0aa`

After publication the active graph and draft graph were identical.

## Privacy boundary

Do not send applicant PII or raw answers to GA4.

The aggregate response count may be used for operational measurement. Individual application data remains inside the governed intake and Growth OS records required to process the voluntary application.

Application consent, newsletter consent and case-study permission remain distinct.
