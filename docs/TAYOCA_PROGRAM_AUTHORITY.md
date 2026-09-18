# Tayoca Program Authority

Status: **authoritative operating anchor**

Last reconciled: 2026-09-18

Canonical repository: `temitayocharles/tayoca` on Forgejo

Canonical checkpoint when this anchor was created: `0b301b8653caa982f2a828dd536246f094a6b463`

## 1. Purpose and precedence

This document is the durable center for Tayoca program context, scope, architecture, design intent, safety boundaries, completed work, unresolved work and reconciliation protocol.

Future operators and agents must not use conversational recollection as operational authority. Before changing Tayoca they must:

1. read this document;
2. read `docs/tayoca-program-state.yaml`;
3. read `docs/production-growth-operating-plan.yaml` and any workstream-specific policy referenced here;
4. query current Forgejo `main`, recent commits, open pull requests and relevant live runtime state;
5. reconcile any newer evidence back into this anchor/state file before acting when it changes the program model.

Where sources disagree, precedence is:

1. verified live production state for runtime facts;
2. current canonical Forgejo `main` for desired state, policy and public content;
3. approved external-system system-of-record data for its own domain;
4. this program anchor for cross-domain intent and workstream status;
5. historical branches, patches, mirrors and conversation artifacts as evidence only.

GitHub is downstream. It is not an independent production authority.

## 2. What Tayoca is

Tayoca must be represented as an engineering-led technology company and builder, not as a single consulting funnel, a DevOps-only website, or a generic AI SaaS company.

The company spans several connected business expressions:

- client technology delivery and application development;
- AI, AI agents, workflow automation, integration, RAG/LLMOps and operational automation;
- cloud economics, FinOps and technology-value engineering;
- platform engineering, reliability, DevSecOps, Kubernetes, GitOps, observability and recovery;
- owned software, applications, ventures, experiments and project work where ownership/disclosure is verified;
- books, playbooks, workbooks, labs, guides and other educational products;
- technical writing, blog/editorial publishing and the Operator Brief;
- community projects, including the community website initiative;
- practical teaching, enablement and technical content;
- internal automation and operating systems that support company delivery.

These are not interchangeable categories. Public information architecture and internal content models must distinguish at least:

- services/solutions;
- owned products/software;
- ventures/projects/builds;
- client work/case studies;
- experiments;
- community initiatives;
- publications/learning products;
- editorial/newsletter content;
- internal systems.

Do not force all of these into a single `product` taxonomy.

## 3. Public positioning

The commercial direction is outcome-led, not a list of technologies.

A durable positioning frame is:

> Tayoca helps organizations make complex technology reliable, economically accountable and operationally scalable.

The public company story should make technology value, platform reliability and agentic/automated operations legible while still showing what Tayoca actually builds and publishes.

Capabilities such as Kubernetes, Terraform, CI/CD, AI, cloud and automation are supporting capabilities, not the entire top-level proposition.

Multiple visitor journeys must be supported:

- prospective client -> capability -> work/evidence -> contact/diagnostic;
- product buyer -> product/software/publication -> evaluate -> purchase/use;
- reader -> article -> related work/product -> Operator Brief;
- community participant -> initiative -> trusted low-friction intake;
- partner/collaborator -> company/projects -> contact;
- engineer/learner -> books/labs/guides/teaching/technical writing.

## 4. Public founder and disclosure rules

Public founder identity: **Temitayo Charles**.

Credential badges currently represented in Tayoca material include PMP, CSM, Terraform Associate and AWS Solutions Architect. They must only be displayed where current/verifiable.

Owned/project work must use truthful classification. For example, where ownership is not fully established, use neutral language such as `Project / build · In market` rather than inventing founder, client or ownership claims.

Never invent or imply unsupported:

- customers or clients;
- testimonials;
- revenue;
- savings;
- uptime;
- partnerships;
- team members;
- certifications;
- project ownership;
- production screenshots;
- client outcomes;
- deployment status.

Existing evidence and claims controls remain binding.

## 5. Website design mandate

### 5.1 Problem to solve

The existing/current-era site has been too text-heavy, formal, visually bland and structurally narrow relative to the amount of real work Tayoca has.

The redesign problem is not `make the assessment funnel prettier`. The public site must visibly communicate that Tayoca is a living technology company that builds, publishes, teaches, operates and contributes.

Known weaknesses that must not be reintroduced:

- assessment/governance language dominating company identity;
- products/publications treated as secondary;
- Operator Brief buried;
- community work isolated;
- software/builds not presented coherently;
- thin About/company story;
- inconsistent navigation/footer systems;
- weak visual storytelling;
- long stretches of text cards with little real imagery;
- existing covers/screenshots/assets left unused;
- different pages looking like separate eras/sites.

### 5.2 Visual requirements

The site should feel confident, modern, human and engineering-led. It should have visual rhythm and personality, not sterile uniformity.

Use real artefacts first:

- actual product/book covers;
- application/interface screenshots where disclosure permits;
- browser/device previews;
- project visuals;
- diagrams only when they clarify a real system;
- editorial imagery;
- community/local imagery where appropriate;
- human/workshop context that does not invent employees or clients;
- subtle motion that improves comprehension.

Avoid:

- generic navy/dark AI landing-page tropes;
- glowing blue/purple gradient blobs;
- neural-network/network-node decoration;
- meaningless circuit-board imagery;
- fabricated decorative dashboards;
- excessive glassmorphism;
- endless identical icon-card grids;
- generic stock-team photos implying nonexistent staff/clients;
- visual claims that cannot be supported.

The existing black/orange Tayoca palette is a brand reference, not a command to produce a monochrome or boring site. The visual system may evolve while preserving recognizable Tayoca identity. Existing brand references include near-black, warm surface tones and Tayoca orange, but composition, imagery, typography, contrast, texture, spacing and sectional variety must carry more of the identity.

### 5.3 Current brand reference

Existing documented reference:

- near black `#0d0d0d`;
- surface `#171717`;
- Tayoca orange `#f97316`;
- light text `#e5e5e5`;
- muted `#a3a3a3`;
- Sora / Inter / JetBrains Mono are existing typography references.

These values may be evolved deliberately; they must not be treated as a substitute for art direction.

## 6. Company operating architecture

### Forgejo

Forgejo is the canonical engineering and policy authority. It owns source, policy-as-code, change history, public-site content/configuration, evidence and accepted design/code changes.

### Notion

Notion is the canonical human-readable cross-project intelligence layer for normalized operating knowledge such as Projects, Intelligence Events, Decisions & Milestones and Content Opportunities. It does not replace raw evidence systems.

### n8n

n8n is the orchestration fabric. It connects website/forms, Forgejo, Notion, Google Workspace/Sheets, messaging, analytics, community intake, revenue operations, publishing, reviews/trust, recovery and project intelligence.

Raw evidence remains authoritative in its originating system. n8n must not become an undocumented truth store.

### GitHub

GitHub is a downstream deployment/external-agent workspace and mirror. Direct GitHub-only changes are not canonical until reconciled through Forgejo.

## 7. n8n control-plane foundation

The control-plane strategy is to **augment and govern the existing workflow estate, not rebuild hundreds of workflows wholesale**.

The broader foundation includes or has included:

- durable task/state structures;
- provenance;
- approval/configuration authority;
- event ledger;
- workflow/candidate/notification registration;
- local observation bridge;
- snapshot freshness and runtime health;
- recovery/audit timelines;
- backup and restore;
- static-state export/import/reconciliation;
- Forgejo-backed control-plane policy/evidence;
- RAG registration and a Neon/pgvector-oriented retrieval architecture.

Historical static-state reconciliation reached a certified 46/46, zero-duplicate checkpoint, but all live-estate counts must be re-queried before current claims are made.

### 7.1 Public n8n domain cutover — 2026-09-18

The public n8n endpoint migration from `n8n.tca-infraforge.site` to `n8n.tayoca.com` is complete at the public routing, application, provider-callback and deployment layers.

Certified evidence:

- canonical Forgejo PR #161 merged as `8837d3dd155a67a88fd7d75622d25341c0127eb8`;
- exact canonical tree mirrored to GitHub as `fcfb6bd4a0d6c4caba6f84202d825f0bb8170753`;
- Vercel production deployment `dpl_D5MCP413B5uda9gjZcUQ2xPqe4hK` reached READY/PROMOTED and owns `tayoca.com`;
- post-deploy production parity run #37557 passed on the canonical merge;
- static quality, route parity, social metadata, structured data, content architecture, conversion runtime and theme runtime were re-run on the canonical merge and passed;
- active n8n workflow metadata advertises `https://n8n.tayoca.com` for book access, assessment, Operator Brief, reviews and Gumroad callbacks;
- n8n execution #559821 confirmed the book access gateway remains fail-closed without a valid entitlement token;
- Gumroad sale events now have exactly one resource subscription, targeting `https://n8n.tayoca.com/webhook/tayoca-gumroad-sale`; the legacy subscription was removed only after the new subscription was verified;
- canonical homelab certificate, Homepage, Authentik reference and Uptime Kuma desired state use `n8n.tayoca.com`;
- the legacy Cloudflare DNS record for `n8n.tca-infraforge.site` was deleted after cutover verification, while `n8n.tayoca.com` remains proxied to tunnel `8481ad36-ec4e-41a0-8891-00ae45c69a0c`.

The current Cloudflare connector cannot read the tunnel configuration API, so any dormant legacy ingress rule inside that tunnel remains unverified configuration hygiene. It is not publicly addressable through the retired legacy DNS hostname and must not be modified with a replace-style tunnel update until the complete live ingress configuration can be read safely.

## 8. Tayoca Control Center / CMS

The Tayoca Control Center at `control.tayoca.com` is **completed and production-deployed**. It is not an unfinished prerequisite for the public company-platform redesign.

The canonical production handoff is `docs/control-center-production-handoff-20260828.md`, with machine-readable status in `docs/control-center-status-note.yaml`. The recorded production line is `6cae0f71d7b60cec62c783de925780835075e96c`, deployment `dpl_5xGR3Lm58YdNKU3vUJD5Ds8ZudsJ`, and protected gateway `gif5P0MDI6WrceAP` (`Tayoca Control Center | Unified Gateway v6.1`).

Implemented capabilities include structured Website CMS operations, Pages/Blog/Products/Site Data, Media Library, guarded uploads, reusable sections, Global Site Settings, revision/content history and restore, Workflow Studio with real workflow operations, execution/error visibility, backup export and restore-to-unpublished-drafts, schedules/webhook inventory, metrics/usage, Control Health, server-side credential handling and exact-SHA gated production deployment. Cloudflare Access is the sole authentication boundary.

Global Site Settings recovery has been exercised to the exact original Forgejo blob with no residual content/settings drift.

### Historical authorization finding

A prior live inspection identified shared authorization material in an earlier Control Center workflow implementation. The completed production handoff supersedes that finding as an **active implementation workstream**. Do not reproduce historical secret values. Do not reopen the Control Center broadly. Revisit the historical finding only for a specific evidenced defect or an explicitly scoped security audit.

### Public redesign boundary

LM Arena and public-site integration may inspect and preserve repository-visible contracts, especially Global Site Settings and publishing interfaces, but must not redesign, replace or create a second Control Center/CMS/authentication plane by default.

## 9. Project Intelligence Hub

The Project Intelligence Hub is the cross-project intelligence layer, with canonical policy at:

`intelligence/project-intelligence-hub-policy.yaml`

The intended Notion model includes:

- Projects;
- Intelligence Events;
- Decisions & Milestones;
- Content Opportunities.

Deterministic ingestion/materialization was advanced through Content Triage, a least-privilege Notion Ops sub-workflow and Content Opportunity Materializer v8.

Required properties include:

- deterministic fingerprints;
- one-event-at-a-time bounded processing where appropriate;
- durable upsert before source acknowledgement;
- idempotent replay;
- AI enrichment downstream/non-blocking where policy requires;
- source-system authority preserved.

Merged Tayoca policy/evidence PRs include #24, #26, #27 and #28.

## 10. Repository intelligence and publishing

Repository intelligence must not turn every commit into content.

Required direction:

- complete/paginated Forgejo and GitHub discovery where authorized;
- canonical/active/brand allowlists;
- meaningful project classification;
- multi-signal milestone clustering rather than commit-only noise;
- review-first editorial artifacts;
- separate approval/publishing path;
- no unsupported newsletter narratives.

Operator Brief is a first-class publishing property, not a generic hidden newsletter form. Its policy is under `editorial/operator-brief/`.

## 11. Growth OS, community, revenue and trust

The repository contains a production growth operating plan and evidence for W1-W10 covering offer prioritization, campaign launch, assessment/B2B intake, content distribution, targeted outbound, Operator Brief nurture, revenue operations, controlled experiments and later reliability/editorial/accessibility work.

Relevant authority begins at:

`docs/production-growth-operating-plan.yaml`

### Community Website Initiative

The public Tayoca community page is an SEO/authority surface. The Google Form is intentionally the low-friction intake surface unless a deliberate migration replaces it.

The Google Form bridge must preserve deduplication, attribution and downstream Growth OS handling. WhatsApp/WAHA notification paths may be used where configured.

### Reviews and trust

Review/trust workflows must be tied to real experiences and verification. Unverified events must fail closed rather than become testimonials/proof.

Public surfaces include `public/review.html`, `public/reviews.html` and `public/trust.html`.

### Messaging

Channel identity/routing must be explicit. Messaging integrations include WhatsApp/Infobip, Slack/email and failure/dead-letter paths. Do not infer recipient identity from a phone number without the configured routing contract.

## 12. Global Site Settings

Global Site Settings provide a safe shared configuration surface through:

- `public/data/site-settings.json`;
- `public/tayoca-site.js`;
- `docs/site-settings-policy.yaml`.

The design principle is structured global configuration with static HTML fallback when configuration is missing/invalid.

Controls must preserve:

- source-of-truth ownership;
- link allowlists;
- rollback;
- structured editing;
- browser-secret prohibition;
- fail-safe rendering.

On 2026-08-28 another workstream certified and restored the site-settings recovery path via commits:

- `010c79f6dbd28fadde150b0869bb09f476f132f6` (`test: certify site settings recovery path`);
- `0b301b8653caa982f2a828dd536246f094a6b463` (`test: restore site settings from certified revision`).

These are current canonical history, not temporary conversational notes.

## 13. Forgejo Actions, mirror and runner convergence

This incident/workstream is closed unless a new regression is proven.

Resolved items include:

- automatic push and pull-request event delivery;
- Forgejo 16 incompatibility with GitHub-style `on.workflow_call.secrets` declarations in shared workflows;
- secret replay/self-healing after Forgejo recovery;
- GitHub App `contents:write` installation permission;
- duplicate Tayoca deployment mirror authority;
- GitHub-associated mirror author identity for Vercel;
- queue-driven KEDA runner demand scaling;
- container runner resource right-sizing;
- stale runner registration/pod/ReplicaSet cleanup.

Tayoca mirror cleanup: PR #37.
Mirror author/Vercel attribution: PR #38, merge `33d2586d3f7be93a45ce9b7db6e24a4fea8085ac`.

Queue-driven runner convergence was certified through `homelab-gitops` PR #620 and #622. Do not reopen this infrastructure work while resuming Tayoca product/control-plane work unless current evidence shows a regression.

## 14. Workflow backup and live-estate reconciliation

Backup/recovery orchestration has been strengthened historically, including fixes for incomplete traversal/locator limits. However, old workflow-count checkpoints must not be treated as current truth.

The operating requirement is to reconcile:

- live n8n workflows;
- activation/version/owner state;
- repository workflow registry;
- backup ledger;
- stored snapshots;
- temporary/diagnostic workflows;
- legacy/disabled workflows.

The repository registry is a declared snapshot, not authoritative live runtime inventory.

Do not assume historical `526 vs 594` or any other remembered count remains current. Re-query the full live estate and classify differences before changing/deleting workflows.

## 15. LM Arena company-platform redesign

### 15.1 Source artifacts

The original external-agent briefs are preserved on Forgejo branch:

`lm-arena/company-platform-rebuild`

at commit:

`e4d02bb92a8792b9665b66880aadf82024857e8d`

with:

- `LM_ARENA_COMPANY_PLATFORM_BRIEF.md`;
- `LM_ARENA_CONTROL_PLANE_BRIEF.md`.

They correctly require a company-wide redesign, control-plane compatibility, truthful portfolio classification, multi-journey IA, real visual storytelling, no generic AI template styling, no production credentials, and branch/PR reconciliation through canonical Forgejo.

### 15.2 Recovered implementation lineage

The initially supplied LM Arena patch was identified historically as:

`01a04553-bda5-7775-a3a7-c7d0f5b4f0c5.patch`

It represented a large redesign/control-plane proposal. The durable surviving implementation lineage is GitHub PR #13 and branch:

`arena/01a04553-tayoca`

Current reviewed branch head at the time this anchor was written:

`942e4a57f61c66337adef2b851f5bd4b18096e3e`

PR #13 is a review vehicle only and must not be merged to GitHub main as production authority.

Its current scope is 76 changed files, 9 commits, 4,377 additions and 1,625 deletions. It includes:

- `docs/arena-redesign/00` through `10` discovery/architecture/migration/QA/inventory documents;
- a new `public/work.html` portfolio surface;
- `public/data/company-ecosystem.json`;
- `scripts/validate_company_ecosystem.py` and link validation;
- canonical shell/navigation/footer work across major public pages/articles/products;
- redesigned home/about/services/results/products/blog/Operator Brief/community/trust/reviews/Sivanta surfaces;
- imagery/artwork assets;
- contract-preservation validation for forms, Operator Brief archive marker, community Google Form markers, product registry, analytics and redirects.

### 15.3 LM Arena production verdict

GitHub PR #15 (`arena/01a04a44-tayoca`, reviewed head `0f67039f7276ea7c932f1f2f97d0013f7832f029`) is the accepted external design source for the company-platform modernization. Final acceptance occurred through canonical Forgejo, not through a GitHub merge.

The reviewed design was reconciled onto current canonical contracts and certified through Forgejo PR #41. The pre-merge canonical head `3e57d58afa9df0e145daf38d1911534e9ba0e470` passed static-quality run #17675 and the self-hosted Chromium/Axe gate #17677 after seven real color-contrast regressions were corrected without changing the accepted visual direction.

Forgejo PR #41 was then merged to canonical `main` as `9b1f2ec0c928652d7868b4057126ec686b8d7f28`. Automatic push run #17682 succeeded and mirrored the canonical result to GitHub commit `046441d27e3a97bed5253c21cb0dfc49f3e36b52` with trailer `Canonical-Forgejo-Commit: 9b1f2ec0c928652d7868b4057126ec686b8d7f28` and canonical tree `d3f5eb5b2241ff44079b5e6652afc1035c753473`.

Vercel production project `tayoca-com-static` promoted deployment `dpl_BifRiqN4R7bMbY64nZTnhd1waJKY` from that GitHub mirror commit. `tayoca.com` is assigned directly to the promoted deployment and `www.tayoca.com` permanently redirects to it.

Post-deployment parity initially reported 49/50 because the verifier treated the intentionally declared permanent redirect for `/blog/devops-incident-response-runbook.html` as content drift. Diagnostic run #17707 isolated that contract mismatch. The verifier was made redirect-aware, retaining byte-exact comparison for ordinary HTML while validating declared Vercel redirects as redirect contracts. Production parity run #17715 then passed.

The durable certification record is `docs/public-company-platform-production-certification-20260828.md`.

**Verdict: the LM Arena company-platform redesign is reconciled, certified and production-deployed through canonical Forgejo.** GitHub PR #15 remains design provenance only and must not be merged independently as a second authority.

The modernization preserves the completed Control Center, Global Site Settings, locked product contracts, evidence/disclosure boundaries and conservative treatment of unresolved project ownership/public-disclosure decisions. Those separate disclosure decisions do not retroactively block the website deployment.

## 16. Current source-drift warning

Recent GitHub `tayoca` history contains direct GitHub-only lead-magnet/content commits (AI-generated DevOps script debugging / Production Interview funnel work) after the LM Arena work and before later canonical mirror commits.

Because Forgejo is canonical, such GitHub-only changes must not be assumed accepted. Before reusing them, identify whether the corresponding intent exists in Forgejo or an approved workstream and reconcile through a Forgejo branch/PR.

## 17. Safety and sequencing

For broad Tayoca work, use this order unless an incident overrides it:

1. reconstruct and certify current live state;
2. fix security/safety correctness;
3. fix data-integrity, recovery and source-authority issues;
4. complete product/runtime behavior and stable contracts;
5. preserve the completed Control Center and stable publishing/configuration contracts;
6. integrate public company-platform changes through Forgejo;
7. certify production parity, accessibility, analytics, links and rollback.

A production incident may temporarily interrupt this sequence. Record the interruption, resolve it, then return to the current program workstream.

## 18. Current status matrix

| Workstream | Status | Rule |
|---|---|---|
| Forgejo Actions eventing | VERIFIED COMPLETE | Reopen only on regression |
| shared-workflows Forgejo compatibility | VERIFIED for known defect | Respect private reusable-workflow limitation |
| Runner/KEDA convergence | VERIFIED COMPLETE | Separate platform work from Tayoca feature work |
| Forgejo -> GitHub mirror | VERIFIED COMPLETE | Forgejo remains canonical |
| Vercel mirror attribution | VERIFIED COMPLETE | PR #38/current history |
| Global Site Settings | IMPLEMENTED; recovery recently certified | Recheck current live production before modification |
| Project Intelligence Hub | IMPLEMENTED to v8 materializer policy/runtime checkpoint | Live recheck before further mutation |
| Control Center/CMS | VERIFIED COMPLETE / PRODUCTION-DEPLOYED | Reopen only for a specific defect or new feature |
| Historical Control Center authorization finding | SUPERSEDED AS ACTIVE WORKSTREAM | Reopen only for a specific evidenced defect or scoped security audit |
| Community Google Form bridge | IMPLEMENTED checkpoint | Verify live before changing intake |
| Growth OS | SUBSTANTIAL IMPLEMENTATION | Follow locked operating plan/evidence |
| Operator Brief | IMPLEMENTED architecture/runtime checkpoint | Preserve publishing contracts |
| Review/trust system | SUBSTANTIAL IMPLEMENTATION | Preserve fail-closed verification |
| Workflow live-estate reconciliation | OPEN / NEEDS CURRENT LIVE PASS | Runtime inventory wins over stale registry |
| Backup ledger/snapshot reconciliation | OPEN / NEEDS CURRENT LIVE PASS | Do not rely on old counts |
| LM Arena company-platform redesign | VERIFIED COMPLETE / PRODUCTION-DEPLOYED | GitHub PR #15 is design provenance; Forgejo PR #41 is canonical acceptance |
| Full public visual/company-platform modernization | VERIFIED COMPLETE / PRODUCTION-DEPLOYED | Reopen only for a specific defect or new feature |

## 19. Current remaining-work register

The public company-platform modernization is complete and production-deployed. Do not reopen it broadly unless current evidence identifies a specific defect or a new feature is requested.

Separate cross-platform workstreams remain open and must not be conflated with the completed website modernization:

1. query and reconcile the current live Tayoca-related n8n estate against repository declarations;
2. reconcile the backup ledger and stored workflow snapshots against current live runtime state;
3. recheck Project Intelligence Hub, Growth OS, Operator Brief, community and trust runtimes when a change requires current runtime evidence;
4. resolve or explicitly defer project/ownership/public-disclosure items before making stronger public claims about Creator Prompter Studio, SiteSupply, Zernio/9Drive, Abiding Place Fellowship or other unresolved relationships.

The completed Control Center is not in this remaining-work register unless a specific evidenced defect or new feature is raised.

## 20. Completion standard

No workstream is `complete` because a file was changed, a PR opened, or an endpoint returned 200.

Completion requires applicable evidence such as:

- current source-of-truth state;
- automated validation;
- execution/run evidence;
- idempotency where required;
- security-boundary proof;
- live parity;
- rollback path;
- observability/failure behavior;
- truthful disclosure;
- accessibility/responsive QA for public UI;
- documented ownership of changed contracts.

This document and `docs/tayoca-program-state.yaml` must be updated whenever a material cross-program decision, source-authority change or workstream completion changes the operating picture.
