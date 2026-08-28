# Tayoca Control Plane — Current-State Architecture (Arena Audit)

> **Authority note (post-discovery correction, 2026-08-27):** `automation/n8n/workflow-registry.yaml` and the workflow table in §2 are a **repository-declared snapshot** (last reconciled 2026-08-11). Live n8n runtime inspection has shown a **materially broader workflow estate** than the set below. This document therefore describes *repository-declared state only*; it is **not** an assertion about the complete live environment. No workflow rationalisation may be executed from this document alone — a live-runtime reconciliation (authorised control plane) must come first (§6). A live Control Center inspection also identified **authorization material embedded in workflow code**; the remediation requirement is documented in §8 and in `05-control-plane-migration-plan.md` §5. The value itself is never reproduced here.

## 1. Architecture overview

```
Forgejo (canonical source)  ── mirror ──▶ GitHub (deployment mirror)
      │                                          │
      │ CI: .forgejo/workflows/static-quality.yml│ (3 validators; +1 proposed)
      ▼                                          ▼
n8n Control Center / CMS gateway  ◀── webhooks ──▶ public/** static site (Vercel)
      │   (Unified Gateway v6.1: bounded Forgejo content R/W,
      │    list/get/create/update/delete on selected public/** paths,
      │    controlled image uploads)
      ▼
Growth OS workflows (5 active) ──▶ Sheets ledgers ──▶ executive reporting
      │                                (opportunity, campaign, content queue, sales,
      ▼                                 reviews, revenue pipeline, proposals, KPI…)
Messaging: Slack / WhatsApp-Infobip / email (Resend) / community Google Form bridge
```

## 2. Workflow inventory — repository-declared snapshot (from `automation/n8n/workflow-registry.yaml`, reconciled 2026-08-11)

Not authoritative runtime state. Live runtime reconciliation is required (see §6).

### Active (production)
| Key | n8n ID | Domain | Role |
|---|---|---|---|
| assessment-operator-brief-intake | V28T575q7GSRFOti | intake | Assessment leads + Operator Brief subscriptions; consent, dedupe, honeypot, idempotent unsubscribe, campaign attribution, atomic revenue-pipeline persistence |
| verified-review-trust-flywheel | ZZDXWFKiPnzeKtNr | trust | Gumroad sale verification → review requests → human-approved public reviews; replay-safe; unattributed-by-default |
| demand-engine-revenue-command-center | MRaoY2aHm85q3QWG | growth | Weekly editorial campaign approval, correction/supersession, weekly executive report; zero default ad spend |
| operator-brief | Ug7hA8cXrrCIVYkI | newsletter | Weekly issue generation from approved opportunities, 8-section fixed template, whole-issue human approval, atomic Forgejo archive publication, revision-preserving corrections, fail-closed delivery |
| infobip-inbound-delivery-correlation | W4aE4hNuFgwAxL02 | messaging | Delivery/Inbound event correlation, metadata-only ledger, batch-100 fail-closed |
| production-failure-dead-letter | iX0ehWNElYUfdCQZ | ops | 5-min metadata-only monitor over the five workflows above + native error trigger; sanitized Slack alerts; sanitized Forgejo backup |

### Inactive / library / legacy (not production architecture)
whatsapp-assistant (legacy_inactive), reputation-planning-kernel (inactive_library_validated), tayoca-core-event-ingress (inactive_library_validated), reputation-due-campaign-scheduler (inactive_library_validated).

## 3. Website → n8n/CMS dependency map

See `00-discovery-audit.md` §4 (contracts C1–C12). Summary of mutation surfaces:

- **CMS gateway writes** (selected `public/**` in canonical Forgejo): Operator Brief archive insert (`operator-brief-archive.html`, marker contract), editorial article generation (`public/blog/**`), product feed (`products-feed.csv`), controlled image uploads. Exact gateway path allowlist is defined in the gateway workflow (runtime), not in this repo — flag for owner confirmation of the full allowlist.
- **Website → n8n POSTs**: assessment intake, Operator Brief subscribe, unsubscribe (JSON via `growth-os.js`).
- **Website → n8n GET**: public reviews list (`/webhook/tayoca/reviews/public`).
- **n8n → external**: Google Forms bridge (community intake), Gumroad (sale verification), Sheets (ledgers), Slack, Infobip, Resend.
- **Website → third-party**: cal.com (booking), Gumroad (purchase), wa.me (WhatsApp chat), GA4, Google Fonts, InsForge analytics (self-hosted Plausible-compatible endpoint).

## 4. Sheet ledger classification (from Growth OS docs; authority = operating plan)

- System-of-record: sales, revenue pipeline, verified reviews, editorial opportunity ledger, campaign ledger.
- Ledger/queue: content queue, review requests, proposals, objections, attribution, KPI history, workflow reliability ledger.
- Reporting view: executive PDF report (generated, not a store of truth).
- Rule: Sheets are governed state for workflows; website content stays in Git (Forgejo canonical). No second truth store.

## 5. Secrets & authentication posture

- Repo: no tracked `.env*` (CI-enforced), no credential IDs or tokens in workflow exports (n8n README rules; exports bind logical credential names at import). No production n8n credentials requested or used for this work.
- Recommended (already partially in place): all secrets in n8n credential store; gateway auth via bounded token; content operations least-privilege (list/get/create/update/delete scoped to `public/**` allowlist; no workflow-administration surface exposed to the public site).
- Remediation plan: keep secrets out of workflow JSON exports; audit any historical export for accidentally embedded values before committing (existing rule); rotate any value found (none found in this snapshot).

## 6. Observability gaps & recommendations

| Gap | Recommendation |
|---|---|
| CMS mutation audit trail | Forgejo commits already provide full history; formalize: every gateway write = one commit with structured message (`content: <entity> <action> <path>`) |
| Content publication state | New registry (`company-ecosystem.json`) gains `status` fields; gateway actions can read them |
| Workflow health visibility | Reliability ledger exists; propose a read-only control-plane view over it (see 06-control-plane-ux-proposal.md) |
| Form intake telemetry | `growth-os.js` emits `generate_lead` events; keep event taxonomy stable during redesign (done — data-event names preserved) |
| Failure ownership | Dead-letter monitor covers the 5 active workflows; any new workflow must be added to the allowlist with an owner field |

## 6. Live-runtime reconciliation (required, authorised control plane)

The repository registry cannot enumerate the live n8n estate. The following reconciliation must be executed by the authorised control plane before any rationalisation or migration:

1. Export the complete live workflow list (id, name, active state, active version, updated timestamps).
2. Diff against `automation/n8n/workflow-registry.yaml`; classify each delta (new, renamed, superseded, deactivated, temporary).
3. Update the registry (or its successor) to reflect runtime truth, including owners and approval gates per workflow.
4. Re-certify the dead-letter monitor's allowlist against the live estate (it currently scans a fixed five-workflow set).
5. Record the reconciliation commit + runtime snapshot in the reliability ledger.

## 7. Control-console UI (public repo, authenticated preview)

`temitayocharles/tayoca-control-center` (public fork of `janmaaarc/n8n-ops`) is the actual control-console implementation: React/TypeScript/Tailwind dashboard for n8n execution tracking, performance analytics, queue monitoring, scheduled triggers, webhooks and workflow backups. Security model (from its public README):

- Browser never receives an n8n API key, Forgejo token or gateway token.
- All mutations go server-side through the Tayoca Control Gateway (`/api/control` → gateway webhook → n8n loopback / canonical Forgejo).
- Production control access is fail-closed unless `ALLOW_PRODUCTION_CONTROL_CENTER=true` is deliberately configured.
- The deployment is an authenticated preview — it must not be treated as a public showcase on tayoca.com.

## 8. Embedded-authorization-material remediation (documented requirement only)

A live Control Center inspection identified authorization material embedded in workflow code. This workspace does not reproduce, retrieve or expose the value. The authorised control plane must execute:

1. **Migrate** the value into n8n's credential store (or the designated secret manager) and reference it by credential name in the workflow.
2. **Rotate** the value; the old value must not remain valid.
3. **Identify affected callers** (workflows, webhooks, scripts, integrations that consume the value or the credential).
4. **Migrate callers safely** to the credential reference; no caller may fall back to the embedded value.
5. **Test authentication** for every affected path (including dead-letter and approval-gated paths).
6. **Rollback** plan: prior credential version retained in the credential store, documented, recoverable.
7. **Certify** the old value is no longer accepted (negative test recorded) and that no workflow code contains embedded authorization material (repo + runtime scan).

## 9. Workflow rationalisation plan

- **Canonical**: the 5 active workflows + dead-letter monitor. No changes proposed.
- **Library (keep, inactive)**: reputation kernel, core event ingress, due-campaign scheduler — candidates to become shared adapters when reputation product activates.
- **Legacy (retire when owner confirms)**: whatsapp-assistant-legacy; `l/*` campaign landers (Tailwind CDN) once 301 targets are confirmed healthy; `landing_ai-made-simple*` landers.
- **Duplication in content (not workflows)**: two $216K articles (one withdrawn from proof use) — keep both as published articles, but results surface must not cite the withdrawn one (fixed in redesign).
