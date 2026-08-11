# Tayoca backend function sources

This directory contains backend function source retained by the current Tayoca architecture.

## Active governed surfaces

- `analytics-dashboard.ts` — first-party executive analytics aggregation used by the Stage 12 measurement/reporting system.
- `analytics-event.ts` — first-party analytics event handling source.
- `insforge/analytics-event.js` — deployed/InsForge-oriented analytics event implementation.
- `finops-5k-book.js` — product/service function source retained by the product ecosystem.

Production analytics authority and disclosure rules are defined in `docs/analytics-and-reporting-policy.yaml` and certified in `docs/stage12-executive-analytics-baseline.json`.

## Operator Brief and subscription intake

Newsletter/Operator Brief subscription intake does **not** use a Cloudflare Pages `/api/subscribe` function or a parallel InsForge newsletter endpoint.

The canonical public Operator Brief form posts to the governed n8n workflow:

- Workflow: `Tayoca Growth OS | Assessment & Operator Brief Intake`
- Workflow ID: `V28T575q7GSRFOti`
- Public form: `public/operator-brief.html`

The legacy Cloudflare/InsForge newsletter endpoints and their Wrangler deployment documentation were removed during post-certification housekeeping. Git history remains the historical record if an old implementation ever needs to be inspected.

## Change control

Before changing backend functions, read `docs/production-growth-operating-plan.yaml` and extend the existing governed layer where possible. Do not create a parallel analytics, subscription, or revenue path without an explicit plan revision and evidence that the existing architecture cannot safely support the requirement.
