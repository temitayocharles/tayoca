# Tayoca Program Authority

Status: **authoritative operating anchor**

Last reconciled: 2026-08-28

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

### 15.3 LM Arena quality verdict

**Historical PR #13 verdict:** useful and substantial, but not production-complete and not safe to merge wholesale.

**Current reconciled candidate:** GitHub PR #15 (`arena/01a04a44-tayoca`, head `0f67039f7276ea7c932f1f2f97d0013f7832f029`) was reconstructed from the GitHub mirror of canonical Forgejo `917bbb733c877bbdf4e64e3fac91cc8e07131fab`. Its reviewed 72-file design delta is now imported into canonical Forgejo branch `integrate/lm-arena-v2-20260828`, with one canonical whitespace-hygiene correction. It remains pending protected-PR, browser/accessibility and production-parity certification before this modernization is complete.**

Strengths:

- correctly reframes Tayoca as a company/builder rather than only an assessment funnel;
- introduces company-level IA and portfolio/content modelling;
- makes Operator Brief, community, products and work visible;
- recognizes stable website-to-n8n contracts;
- preserves the locked commercial product model additively;
- removes unsupported About metrics and stops using the withdrawn $216K narrative as proof;
- includes migration, QA, owner-confirmation and control-plane documentation;
- identifies the embedded Control Center authorization material without exposing it;
- avoids fake clients/metrics and generic AI visual tropes;
- validates a broad set of links/metadata/contracts in its own branch.

Deficiencies / reasons it is not complete:

1. **Stale base:** PR #13 is based on GitHub mirror SHA `5ff90fb683a17f26b055c42795ed53bef36b548a`, while canonical Forgejo has advanced substantially. It requires reconstruction/rebase by intent, not blind merge.
2. **Source-authority boundary:** final acceptance must originate in Forgejo, not GitHub PR #13.
3. **Internal inventory inconsistency:** `00-discovery-audit.md` still describes a five-active-workflow repository view even though later `10-company-discovery-inventory.md` correctly states the live n8n estate is materially broader. The final canonical documentation must use live runtime inventory.
4. **Creator Prompter discovery failure:** LM Arena stated Creator Prompter could not be found. Forgejo currently proves `temitayocharles/creator-prompter-studio` exists, with canonical main `e7299c284d2fb5ca4f69df8b4aa47c902d963261`. This must be classified for public disclosure rather than treated as nonexistent.
5. **Portfolio completeness:** several company/project relationships remain in an owner-confirmation register, including SiteSupply ownership/classification, Sivanta disclosure/deployment claims and other ecosystem projects. They cannot simply be omitted forever if they are material to company identity; they must be resolved deliberately.
6. **Control-plane implementation:** LM Arena documented the CMS/security migration but did not have authority to execute live n8n remediation. Those items remain separate implementation work.
7. **Design direction still risks monotony:** its `night workshop` direction keeps near-black + amber as the dominant surface. It is materially better than the old site, but the final design must specifically address the owner's complaint that Tayoca looks bland/boring. More sectional variety, imagery, product/interface artefacts, editorial composition, light/dark contrast moments and human/community texture are required. The black/orange token set cannot become another uniform dark-card system.
8. **No automatic adoption of generated imagery:** generated editorial/project images must be reviewed for truthfulness, quality, non-deception and visual fit before production.
9. **Later canonical changes:** site-settings recovery, Forgejo/mirror changes, current content and any newer Growth OS/control-plane work must be reconciled into the redesign.

Therefore LM Arena is a **design and implementation candidate**, not the final canonical redesign.

## 16. Current source-drift warning

Recent GitHub `tayoca` history contains direct GitHub-only lead-magnet/content commits (AI-generated DevOps script debugging / Production Interview funnel work) after the LM Arena work and before later canonical mirror commits.

Because Forgejo is canonical, such GitHub-only changes must not be assumed accepted. Before reusing them, identify whether the corresponding intent exists in Forgejo or an approved workstream and reconcile through a Forgejo branch/PR.

## 17. Safety and sequencing

For broad Tayoca work, use this order unless an incident overrides it:

1. reconstruct and certify current live state;
2. fix security/safety correctness;
3. fix data-integrity, recovery and source-authority issues;
4. complete product/runtime behavior and stable contracts;
5. modernize control-plane/CMS experience;
6. integrate the public company-platform redesign;
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
| LM Arena company-platform redesign | RECONCILED FORGEJO INTEGRATION CANDIDATE | GitHub PR #15 imported by exact reviewed head; certify before merge |
| Full public visual/company-platform modernization | INTEGRATION / CERTIFICATION | Preserve LM Arena v2 styling and certify canonical production deployment |

## 19. Required reconciliation before the next autonomous wave

Before resuming implementation, produce a fresh evidence-backed remaining-work register by:

1. diffing current Forgejo `main` against all newer canonical changes since the LM Arena base;
2. reviewing PR #13/`arena/01a04553-tayoca` by feature/intent rather than line-by-line merge;
3. reconciling Creator Prompter and other known project repositories into a truthful company-project inventory;
4. querying the live Tayoca-related n8n estate, not only the repo registry;
5. verifying whether the embedded Control Center authorization material still exists;
6. reconciling live workflows against backup ledger/snapshots and classifying differences;
7. checking current Project Intelligence, Growth OS, Operator Brief, community and trust runtimes;
8. checking current public production site vs canonical Forgejo and GitHub deployment mirror;
9. resolving or explicitly deferring owner-confirmation/disclosure items;
10. creating a staged Forgejo-native redesign/control-plane implementation plan with rollback and certification.

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
