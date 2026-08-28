# Legacy newsletter implementation deprecation

Stage 9 makes the following components non-authoritative for The Tayoca Operator Brief:

- `EMAIL_CAPTURE_SETUP.md`
- `functions/newsletter-subscribe.ts`
- `functions/api/subscribe.js`
- the pre-Stage-9 `Weekly Newsletter Draft Generator` behaviour previously stored in n8n workflow `Ug7hA8cXrrCIVYkI`

They are retained only for repository history and rollback analysis. They must not be treated as the current subscription, publication, or deliverability design.

## Current authority

### Subscription and unsubscribe

n8n workflow `V28T575q7GSRFOti` — **Tayoca Growth OS | Assessment & Operator Brief Intake**

- `POST /webhook/tayoca/growth/operator-brief`
- explicit consent required
- canonical durable lead table: `tayoca_growth_leads`
- deterministic deduplication
- `subscribed` / `unsubscribed` state
- non-enumerating unsubscribe endpoint:
  `POST /webhook/tayoca/growth/operator-brief/unsubscribe`

### Issue production and publication

n8n workflow `Ug7hA8cXrrCIVYkI` — **Tayoca Growth OS | Operator Brief**

- reads approved Stage 8 editorial opportunities only
- requires eight distinct public/evidence-approved opportunities
- produces the fixed eight-section Operator Brief
- requires separate whole-issue human publication approval
- publishes approved issues atomically to `public/operator-brief-archive.html`
- corrections create and approve a new preserved revision; the original archive entry is not silently rewritten

### Email delivery

Resend audience: `Tayoca Insiders` (`c31a4a87-565c-4486-ac7c-c7ab20185836`).

Production Operator Brief email delivery remains blocked until `tayoca.com` is a verified Resend sender domain. A different verified domain must not be used as a brand-mismatched fallback.

## Rule

Do not revive, extend, or reconnect the legacy subscriber functions or the old commit-digest newsletter behaviour unless a future approved migration explicitly replaces the Stage 9 authority above.
