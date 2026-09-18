# Reader Pass canonical integration plan

Status: **review candidate only**

Date: 2026-09-18

## Authority

Forgejo `temitayocharles/tayoca` remains the canonical engineering and policy authority. GitHub PR #18 is a downstream review/integration vehicle and must not be merged or promoted as an independent production authority.

The existing Tayoca Books entitlement architecture is already part of the canonical program:

- access gateway workflow: `OlixJ5IbyYgW0QXo`
- deterministic issuer: `HvdfA1qyVwZ8KSB4`
- scheduled provisioner: `44SLdWuiBIiN25Ln`
- public contract: `/access/book`
- existing policy: deterministic token issuance, resend idempotency, fail-closed invalid entitlement handling

Reader Pass must therefore extend or repair that contract rather than silently creating a second production access system.

## Current production defect

A live Vercel request on 2026-09-18 to the production `/access/book` route returned HTTP 502 with `ROUTER_EXTERNAL_TARGET_HANDSHAKE_ERROR`. The route currently rewrites to:

`https://n8n.tca-infraforge.site/webhook/tayoca/books/access`

This is current runtime evidence that the existing public access contract needs repair/reconciliation. It does not by itself prove which n8n workflow component failed.

## Reader Pass review implementation

PR #18 supplies a production-shaped replacement/extension candidate with:

- server-side Gumroad license verification;
- unique Reader Pass issuance per verified sale;
- one-sale/one-pass idempotency;
- HMAC-only storage of pass material;
- edition-scoped entitlements;
- two-device default;
- transactionally enforced device binding;
- self-service device revocation;
- 30-minute HttpOnly/Secure/SameSite=Strict sessions;
- download and claim rate limits;
- hashed audit events;
- authenticated delivery of the verified companion ZIPs;
- stable edition resource pages suitable for printed QR/short URLs.

The backing Neon project and Vercel secrets are **preview-only**. They are not production authority and must remain preview-only unless canonical Forgejo explicitly adopts this persistence model.

## Compatibility rule

Do not break or invalidate previously issued AI Wrote the Script entitlement tokens merely to introduce Reader Pass.

Before canonical cutover, the Forgejo/n8n integrator must inspect the live gateway/issuer/provisioner definitions and choose one of these compatible paths:

1. **Adapt in place:** retain the existing issuer/token format and add the Reader Pass device, Gumroad, resource-bundle and audit controls around it.
2. **Bridge:** allow the existing deterministic token to exchange once for a Reader Pass entitlement without weakening product/edition scope.
3. **Migrate:** import existing active entitlements into the adopted datastore and keep the old token exchange endpoint available for an explicit migration window.

A destructive token reset is not an acceptable default.

## Public-route rule

The existing public route `/access/book` remains the compatibility boundary until canonical integration is complete.

The new `/resources/books/<slug>` pages may become the permanent print-facing landing pages only after all of the following are true:

1. canonical Forgejo contains the pages and redirects;
2. the current static-quality gate passes;
3. entitlement compatibility is certified;
4. a real or authorized test entitlement proves session + device + download behavior;
5. the GitHub mirror is produced from Forgejo;
6. Vercel production deploys that mirror;
7. the exact printed QR target resolves in production;
8. rollback to the prior gateway remains documented.

## Gumroad scope

Reader Pass does not rely on a shared printed secret. For Gumroad products, a buyer claims a pass only after server-side verification of the Gumroad license key and purchase state.

The current connected Gumroad surface can list products, inspect sales, and verify licenses, but it cannot create products or upload/replace product content. Product-content synchronization remains a separate provider-side operation.

## Paperback scope

A QR code identifies a title/edition and lands on a stable Tayoca resource page. It must not contain a universal credential.

For paperback purchases, entitlement issuance must be tied to a verifiable purchase/claim path approved in the canonical system. A public book possession signal alone is not sufficient because it can be copied or shared.

## Production gates

Reader Pass is not production-ready merely because the preview works. Production adoption requires:

- canonical Forgejo acceptance;
- existing-token compatibility proof;
- repair or retirement of the broken n8n gateway with an explicit migration record;
- final production datastore decision;
- secret provisioning through the canonical deployment path;
- static/CI/security gates;
- live negative and positive entitlement tests;
- two-device enforcement test;
- revoked-device download denial;
- exact companion-bundle hash verification;
- production QR/short-URL verification;
- rollback evidence.

## Review evidence already obtained

The GitHub review candidate has passed its Reader Pass security CI and Vercel preview deployment. Earlier preview certification proved:

- valid session issuance;
- entitlement re-check;
- exact n8n companion ZIP delivery;
- first and second device accepted;
- third device rejected with `device_limit`.

Temporary test entitlement data was deleted after certification.

This evidence is useful implementation proof, but Forgejo and the existing production entitlement contract remain authoritative.
