# Tayoca Program Status

**Status authority:** current reconciliation matrix

**Reconciled:** 2026-08-30

This document is the current component-level status register for the Tayoca program. It supplements `TAYOCA_PROGRAM_AUTHORITY.md` and `tayoca-program-state.yaml`. When an older status label conflicts with this matrix, this document wins until the older wording is reconciled. Only four lifecycle states are valid here: **DONE**, **ACTIVE**, **RETIRED**, and **BLOCKED**.

| Initiative / component | State | Current evidence / rule |
|---|---|---|
| Canonical Tayoca engineering authority on Forgejo | DONE | Forgejo remains the canonical repository, policy and change authority. GitHub is downstream evidence/mirror only. |
| Public company-platform modernization | DONE | Canonical Forgejo PR #41 / merge `9b1f2ec0c928652d7868b4057126ec686b8d7f28`; production and responsive/browser QA rechecked 2026-08-30. |
| Historical GitHub redesign review PR #13 | RETIRED | Review vehicle only; closed without merge after canonical production reconciliation. |
| Accepted GitHub design review PR #15 | RETIRED | Design provenance only; closed without merge after canonical Forgejo production acceptance. |
| Tayoca Control Center | DONE | Separate completed production control-plane workstream; reopen only for a concrete defect or new feature. |
| Growth OS implementation | DONE | Governed campaign, approval, distribution, reporting, sales/review/proposal/revenue-attribution architecture exists. |
| Growth OS commercial/editorial operation | ACTIVE | Ongoing campaigns, reporting, attribution and revenue operation continue by design. |
| Brand Intelligence live snapshot collector | DONE | `Tayoca Brand Intelligence | Live Monitor v4` actively refreshes a sanitized first-party operational snapshot on a five-minute schedule. |
| Brand Intelligence monitoring operation | ACTIVE | Live collection continues by design. |
| Owner conversational Brand Intelligence over WhatsApp | DONE | Existing WAHA general agent is wired to owner-only `Tayoca Brand Intelligence | Owner Query v4`; the called workflow independently enforces owner identity. The stale hard-coded partner sequence was removed and the workflow is active. |
| Owner conversational Brand Intelligence over Telegram | RETIRED | Not required while the existing secured personal WhatsApp route is the selected owner surface. Do not create a duplicate transport merely for parity. |
| WhatsApp conversational memory | ACTIVE | Current sender-scoped buffer memory is functional. Durable Postgres memory is desirable but is not required to expose live intelligence safely. |
| Repository-grounded RAG knowledge bridge | ACTIVE | WhatsApp agent can query bounded canonical Forgejo RAG evidence for stable organization facts. |
| Central governed RAG API/MCP integration for Tayoca | BLOCKED | `rag-system` P6/P8 production rollout is not complete. The canonical handoff contract is `docs/RAG_SYSTEM_HANDOFF.md`; do not bypass it with a parallel Supabase/vector store. |
| Operator Brief platform | DONE | Evidence-gated editorial generation, human approval, canonical Forgejo publication, subscriber/provider parity and suppression controls exist. |
| Operator Brief publication cadence | ACTIVE | Recurring editorial operation continues by design. Email delivery remains fail-closed if the Resend runtime credential or subscriber/provider parity is unavailable. |
| Legacy repository commit-digest newsletter | RETIRED | Superseded by Operator Brief. |
| Community Website Initiative acquisition/integration | DONE | Google Form bridge, direct intake, nomination, cohort, notification and review adapter paths are implemented. |
| Community Website Initiative delivery/outcomes | ACTIVE | Selection, delivery, feedback, case-study and referral outcomes remain ongoing for eligible businesses. Delivered businesses are removed from active prospect and mailing counts. |
| ACG Shelburne delivered website | DONE | The website for African Caribbean Grocery Store was already designed, handed over and moved into an existing-client maintenance relationship. Exclude ACG Shelburne from active cohort, mailing/outreach and candidate-site counts. Preserve the `acg-shelburne` Vercel project as a maintenance/handoff asset until requested changes are resolved; proof, case-study or referral use requires the business owner's permission. |
| Reviews / Trust implementation | DONE | Verified-review architecture, publication consent, human approval and public review feed are implemented. |
| Reviews / Trust verified-sale ingestion | BLOCKED | Provider-authenticated Gumroad sale verification and the live Gumroad `sale` webhook are implemented and fail closed. Live Gumroad reconciliation on 2026-08-30 shows zero successful sales, so the positive success branch cannot be certified without fabricating a transaction. See `docs/GUMROAD_EXTERNAL_GATES.md`. |
| Reviews / Trust live accumulation | ACTIVE | Consent-based review submission, moderation, publication and recovery follow-up continue for verified customer relationships; no unverified sale event may create a review invitation. |
| Workflow backup architecture | DONE | Production `Workflow Backup | Nightly Forgejo Orchestrator v4` is active with bounded page processing and fail-closed coverage certification. Stage 14 workflow certification records sanitized restore PASS and bounded backup as the accepted production architecture. |
| Backup ledger / snapshot reconciliation | DONE | Current live runtime and canonical backup repository were re-queried on 2026-08-30. Superseded v9 crash evidence was removed; the accepted production architecture remains the bounded v4 orchestrator/worker path. |
| Temporary Tayoca n8n diagnostic/migration workflows | RETIRED | Tayoca-specific Repository Intelligence, Project Intelligence, backup-crash and book-staging diagnostics created during reconciliation were archived after use. Unrelated product/workstream TEMP workflows are outside this Tayoca lifecycle decision. |
| Workflow live-estate reconciliation | DONE | Live runtime was re-queried; current active implementations supersede stale repository counts/registries. |
| Repository Intelligence bounded legacy certifier | RETIRED | The old seven-repository Stage 7 private certifier is archived and superseded by exhaustive Repository Intelligence v11. |
| Repository Intelligence exhaustive estate coverage | DONE | `Tayoca Repository Intelligence | Estate Query v11` is published and production-certified. Current certified estate: 50 Forgejo-visible repositories and 104 GitHub-owned repositories, with authenticated pagination-to-exhaustion and authority-aware classification. |
| Owner conversational Repository Intelligence over WhatsApp | DONE | `Tayoca Repository Intelligence | Owner Query v1` independently enforces owner identity and is wired as `repository_intelligence` into the active WAHA General Core. |
| Project Intelligence runtime | ACTIVE | Canonical live-sync, materializer, Notion, triage, promotion, meeting-ingest and reliability workflows remain active. |
| Project Intelligence failure notifications | DONE | Reliability/dead-letter monitoring continues on a five-minute schedule; Project Intelligence failures now alert the owner directly on Slack instead of the ForgeWatch channel. |
| AI Wrote the Script commercial artifact | DONE | Certified customer bundle, PDF, license/readme, companion labs and SHA-256 manifest exist in canonical `my-books`. |
| AI Wrote the Script subscriber entitlement architecture | DONE | Durable fail-closed access gateway, deterministic entitlement issuer and scheduled idempotent provisioner are active. Production `/access/book` rewrites to the gateway and rejects invalid or absent entitlement with `access_denied`. |
| AI Wrote the Script entitlement delivery operation | ACTIVE | `Tayoca Books | Subscriber Entitlement Provisioner v1` runs every 30 minutes, reuses deterministic access tokens and Resend idempotency, and records delivery state. Operator Brief remains the ongoing nurture channel. |
| Kubernetes workbook checkout/file synchronization | BLOCKED | The certified 133-page bundle is ready, but Gumroad's API does not support product-content upload/replacement and the available connected browser session is not authenticated to the Gumroad creator dashboard. The stale 86-page checkout remains protected by explicit do-not-purchase copy. Exact artifact/hash and UI completion steps are in `docs/GUMROAD_EXTERNAL_GATES.md`. |
| Public desktop/mobile visual and functional QA | DONE | Representative production pages were rendered independently through available browser engines; no Control Center navigation leakage or error-shell regression was found. |
| Forgejo → GitHub → Vercel deployment parity for latest non-RAG closure | DONE | Canonical Forgejo `main` `6229c874425fc1f273df80222e6712539ac4f6d6` was reconciled to GitHub `main` `73b330aa02cf01b5550aafe520e7f661d62515d8`; Vercel production deployment `dpl_BvXUZBxbj96UvxtgE3gVDozGg6Lo` is READY/PROMOTED. |

## Owner intelligence architecture

The selected Tayoca owner-query pattern deliberately mirrors the strongest parts of the SiteSupply/Olufunke reference architecture without copying its product-specific storage choices:

1. **Live operational truth:** deterministic sanitized Brand Intelligence snapshot.
2. **Stable knowledge:** governed RAG evidence bridge.
3. **Repository truth:** exhaustive read-only Repository Intelligence with Forgejo/GitHub authority classification.
4. **Conversation:** existing WAHA personal WhatsApp agent with sender-scoped memory.
5. **Authorization:** owner identity is enforced outside the LLM by each owner-query workflow.
6. **Actions:** read/analyze/recommend/draft by default. Consequential publishing, customer contact, spend, production and security mutations require separately governed action workflows and explicit approval where appropriate.

Supabase is not a Tayoca architectural requirement merely because SiteSupply uses it as its own system of record. Tayoca must use the authoritative system for each domain rather than creating a duplicate database.

## Remaining active engineering

All currently actionable non-RAG Tayoca engineering in this closure wave is complete. Remaining work is either a separate workstream, an external event/authentication gate, or an intentionally ongoing business operation:

- central `rag-system` P6/P8 remains a separate workstream and must complete before Tayoca switches to the production RAG API/MCP runtime;
- Reviews / Trust positive-sale certification is **BLOCKED** until the first legitimate successful Gumroad sale exists; do not fabricate a transaction to satisfy the gate;
- Kubernetes workbook checkout/file synchronization is **BLOCKED** until an authorized Gumroad creator-browser session can replace the stale attachment with the certified bundle; the Gumroad API cannot perform that mutation;
- the subscriber entitlement provisioner, Growth OS, Operator Brief, Community, Project Intelligence and trust operations continue as ongoing **ACTIVE** business processes.

The exact external triggers, certified artifact identity and completion procedures are codified in `docs/GUMROAD_EXTERNAL_GATES.md`.

Do not reopen completed public-platform, Control Center, backup, Repository Intelligence, entitlement architecture or temporary-workflow cleanup work without new evidence.
