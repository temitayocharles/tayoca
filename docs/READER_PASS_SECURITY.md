# Tayoca Reader Pass v1

## Security contract

Reader Pass is an entitlement system, not a shared book password.

- A pass is randomly generated with at least 128 bits of entropy. The database stores only an HMAC-SHA-256 digest and a short non-secret hint.
- A pass can hold multiple book/edition entitlements.
- Default concurrent device allowance is **2**. A third device is denied until an existing device is revoked or ages out under the support policy.
- Browser sessions receive a short-lived, HttpOnly, Secure, SameSite=Strict session cookie after pass verification. The raw pass is never stored in browser localStorage.
- Resource downloads use short-lived signed URLs. Storage URLs are never printed in a book.
- Rate limits apply per IP hash, pass hash and device hash. Repeated failures trigger exponential cooldown.
- Access events store hashes, not raw IP addresses or raw pass values.
- Suspicious fan-out, such as many devices or geographically implausible bursts, suspends download issuance rather than exposing resources.
- Revocation operates at pass, entitlement and device level.
- A Tayoca URL and QR identify the book edition but confer **no entitlement by themselves**.

## Purchase paths

### Direct sale / Gumroad
Purchase verification creates or attaches an entitlement. The buyer receives or claims one Reader Pass. The purchased ZIP can remain available through the commerce receipt; Tayoca companion access is an additional durable entitlement route.

### Paperback
A printed QR opens the edition landing page. It never contains a reusable secret. Paperback activation must pass an ownership challenge before an entitlement is issued. There is no public universal paperback key.

## Sharing resistance

Reader Pass is deliberately useful across a reader's own devices but inconvenient to share:
1. two active devices by default;
2. short-lived authenticated sessions;
3. rate-limited pass verification and downloads;
4. anomaly detection on device/IP fan-out;
5. entitlement-specific revocation;
6. no permanent signed download URLs;
7. no raw pass stored server-side.

Do not use aggressive fingerprinting or collect unnecessary personal data. Controls should prevent casual credential sharing without punishing legitimate device replacement.

## Required server endpoints

- POST /api/reader-pass/claim
- POST /api/reader-pass/session
- POST /api/reader-pass/revoke-device
- GET /api/reader-pass/entitlements
- POST /api/reader-pass/download

All endpoints fail closed if the entitlement database, signing key or commerce-verification dependency is unavailable.
