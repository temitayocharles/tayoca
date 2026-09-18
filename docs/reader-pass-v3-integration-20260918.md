# Tayoca Reader Pass v3 integration

Date: 2026-09-18

## Authority and compatibility

Forgejo remains the canonical repository. This branch is a downstream review vehicle based on the current canonical mirror head.

Reader Pass v3 is additive. It does **not** replace the existing Tayoca Books entitlement contract at `/access/book`.

The existing production route remains:

`https://tayoca.com/access/book?token=...`

and continues to rewrite to:

`https://n8n.tayoca.com/webhook/tayoca/books/access`

Existing AI Wrote the Script entitlement tokens remain valid and are not reset, reissued or invalidated by Reader Pass.

## Reader Pass scope

Reader Pass adds a durable multi-title access model for companion resources:

- one Reader Pass may hold multiple title/edition entitlements;
- pass material is never stored raw server-side;
- Gumroad claims are verified server-side before entitlement issuance;
- a verified Gumroad sale may claim only one Reader Pass;
- two active devices are allowed by default;
- recent device replacement churn is limited;
- browser sessions are short-lived and bound to an explicit device identifier;
- revoked devices lose entitlement/download access;
- companion downloads are served only after session, entitlement and active-device verification;
- download issuance is rate limited;
- access events store hashed identifiers rather than raw pass or IP values.

## Existing token migration

No forced migration is performed in this change.

A future bridge may allow an existing `/access/book` entitlement token to exchange for a Reader Pass, but only after the live n8n entitlement workflow is explicitly integrated and product/edition scope can be verified without weakening the current fail-closed behavior.

Until that bridge is certified:

1. existing AI Wrote the Script customers continue using their existing access link;
2. Reader Pass serves newly claimed companion-resource entitlements;
3. both systems remain fail closed;
4. no universal paperback password is introduced.

## Public resource URLs

Stable print-facing routes are added under:

`https://tayoca.com/resources/books/<slug>`

The QR/URL identifies a title/edition only. It does not itself confer entitlement.

## Production gates

Before canonical promotion:

1. Reader Pass security CI must pass.
2. Vercel preview must build.
3. the preview datastore must remain isolated from production until canonical adoption.
4. Gumroad claim verification must be tested with an authorized test purchase/license.
5. valid first and second devices must succeed.
6. a third active device must be rejected.
7. a revoked device must fail entitlement and download checks.
8. companion bundle hashes must match their certified source bundles.
9. `/access/book` must remain unchanged and continue failing closed for invalid tokens.
10. Forgejo must accept the implementation before any production Reader Pass secret/database promotion.

## Explicit non-goals

- no shared printed password;
- no public GitHub/Forgejo bundle URL;
- no replacement of the current n8n entitlement gateway;
- no destruction of historical entitlement tokens;
- no production datastore cutover from this GitHub review branch.
