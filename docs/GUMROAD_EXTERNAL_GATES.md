# Tayoca Gumroad External Gates

**Reconciled:** 2026-08-30

This document records the two remaining Gumroad-dependent Tayoca gates after completion of the non-RAG engineering closure. Neither gate should be bypassed with fabricated transactions, unverified customer events, unsupported API mutations, or a second delivery system.

## 1. Reviews / Trust positive-sale certification

**Lifecycle:** BLOCKED

### What is complete

- `Tayoca Growth OS | Verified Review & Trust Flywheel` is active.
- Gumroad has a live `sale` resource subscription targeting `https://n8n.tayoca.com/webhook/tayoca-gumroad-sale`.
- The webhook does not trust the callback payload as purchase truth. It extracts only the candidate `sale_id` and re-queries Gumroad's authenticated sale-detail API using the runtime `GUMROAD_ACCESS_TOKEN`.
- The verified result is checked for matching sale ID, refund/dispute/chargeback state, verified buyer email, Tayoca product allowlist membership, and buyer contact preference before any sale, attribution, or review-request ledger write.
- Unverified or ineligible events fail closed and cannot create a review invitation.

### Why the positive certification is still blocked

A live Gumroad account reconciliation on 2026-08-30 returned **zero successful sales** across the current Tayoca catalog. Product-level `sales_count` is also zero. Therefore there is no legitimate positive provider event that can be used to prove the success branch end-to-end.

A synthetic or manually invented sale must **not** be inserted merely to turn this gate green.

### Completion trigger

When the first legitimate successful Gumroad sale occurs for an allowlisted Tayoca product:

1. confirm Gumroad delivered the sale webhook;
2. confirm the workflow re-verified the same sale through the authenticated Gumroad API;
3. confirm exactly one idempotent sale-ledger row exists;
4. confirm exactly one product-revenue attribution row exists;
5. confirm exactly one review-request record is scheduled only when buyer contact preference allows it;
6. replay the same sale ID and confirm no duplicate sale, attribution, or review-request record is created;
7. verify a refunded/disputed/chargeback or invalid sale ID remains fail-closed;
8. record sanitized certification evidence and change this lifecycle to DONE.

Until a real successful sale exists, this gate remains **BLOCKED by external event availability**, not by missing Tayoca engineering.

## 2. Kubernetes Operator's Workbook Gumroad file synchronization

**Lifecycle:** BLOCKED

### Current Gumroad state

Product: `Kubernetes Operator's Workbook, Second Edition`

Gumroad product ID: `domJlWCnRA126wfxjTqZNA==`

Permalink: `kubernetes-operators-workbook`

The listing is intentionally still published with explicit fail-safe copy telling visitors **not to purchase** while the attached checkout file remains the previous **86-page** download.

### Certified replacement

Canonical artifact repository: `temitayocharles/my-books`

Release tag: `customer-bundles-2026-08-29`

Asset: `Kubernetes_Operators_Workbook_Second_Edition_Digital_Bundle.zip`

Permanent release download path:
`https://github.com/temitayocharles/my-books/releases/download/customer-bundles-2026-08-29/Kubernetes_Operators_Workbook_Second_Edition_Digital_Bundle.zip`

Size: `705267` bytes

SHA-256: `ddc98b490ac5978eb18273ff124f3c7fed7f02ca46e61fa10b9e334fb76c0f99`

Contents: certified **133-page** customer reading/workbook PDF, front-cover preview, and README.

Supporting canonical evidence:

- `kubernetes-operators-workbook-second-edition/customer/PACKAGE_MANIFEST.md`
- `kubernetes-operators-workbook-second-edition/customer/SHA256SUMS.txt`
- `kubernetes-operators-workbook-second-edition/COMPLETION_REPORT.md`

### Why synchronization is blocked

Gumroad's current official API does not support creating products or uploading/replacing product content files. The connected Gumroad API therefore cannot perform this mutation.

A read-only Hyperbrowser check on 2026-08-30 also confirmed that the available browser session is **not authenticated** to the Gumroad creator dashboard; it reached the Gumroad login page and stopped without attempting authentication.

Accordingly, there is no currently authorized automation path that can replace the attachment safely.

### Exact UI completion procedure

After an authorized browser session is authenticated to Gumroad:

1. open the product `Kubernetes Operator's Workbook, Second Edition`;
2. open the **Content** editor;
3. remove/replace the stale 86-page downloadable file;
4. upload `Kubernetes_Operators_Workbook_Second_Edition_Digital_Bundle.zip` from release `customer-bundles-2026-08-29`;
5. save the product;
6. re-read the product and verify its attached content no longer reports `86 pages` / `1.66 MB`;
7. perform a private/test purchase or creator preview sufficient to verify the downloadable bundle hash/content without creating a false public sale;
8. only after content parity is proven, remove the temporary `Edition refresh in progress` / `Please do not purchase` warning from the product description and Tayoca public copy;
9. record final evidence and change this lifecycle to DONE.

Do not weaken the warning or mark synchronization complete until the checkout actually serves the certified bundle.

## Ownership boundary

These are the only Gumroad-specific finite gates remaining from this closure wave. Ongoing Growth OS, Operator Brief, Community, Project Intelligence, Trust accumulation, and subscriber-entitlement provisioning remain ACTIVE business operations. The central RAG P6/P8 rollout remains a separate workstream governed by `docs/RAG_SYSTEM_HANDOFF.md`.
