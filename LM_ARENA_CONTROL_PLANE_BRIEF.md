# LM Arena Brief: Tayoca Control Plane, CMS and Operating System

## Mission

Do not treat Tayoca.com as an isolated static website. Tayoca already has a live operating system behind the public experience. Your task is to understand that control plane, document the contracts that the redesign depends on, and propose safe improvements so the website, CMS, publishing system, growth workflows, reporting, intake and automation remain one coherent company platform.

This is not permission to redesign or mutate production n8n workflows blindly. Begin with discovery and system modelling. Preserve live contracts unless a migration is explicitly planned, reversible and reviewable.

## Current control-plane reality

The live system includes at least these layers:

1. Canonical source control in Forgejo.
2. A GitHub downstream workspace/mirror for external tooling.
3. A public static site primarily under `public/**`.
4. An n8n-based Tayoca Control Center / CMS gateway that can read and mutate selected public content in canonical Forgejo.
5. Tayoca Growth OS workflows for assessment intake, Operator Brief subscriptions, editorial generation, campaign approval, distribution, community intake, lead handling and revenue operations.
6. Google Sheets-backed operating ledgers for editorial opportunities, campaigns, content queue, sales, reviews, review requests, revenue pipeline, proposals, objections, attribution and KPI history.
7. First-party analytics and Search Console snapshots used by executive reporting.
8. Messaging and notification integrations including Slack, WhatsApp/Infobip and email delivery paths.
9. Production failure / dead-letter handling.
10. Trust and review workflows that intentionally fail closed when verification is incomplete.

## Important live workflows to inspect

### Tayoca Control Center | Unified Gateway v6.1

This is the CMS/control gateway. It exposes bounded actions for workflow reads/writes and canonical Forgejo content reads/writes. It currently supports content operations including list, get, create, update and delete for selected `public/**` paths and image uploads under controlled paths.

The gateway is a contract between the CMS/control interface, n8n and canonical Forgejo. Do not change public content paths, supported file types, media locations or mutation semantics without mapping the consequences.

Security requirement: inspect authentication and secret handling. Do not expose embedded credentials, tokens or environment secrets in documentation, commits, logs or UI. Any secret found directly in workflow code should be treated as technical debt to migrate into appropriate credential/secret storage, not copied elsewhere.

### Tayoca Growth OS | Demand Engine & Revenue Command Center

This active workflow runs three major operating lanes:

- weekly editorial campaign selection and approval;
- editorial correction/supersession handling;
- weekly executive growth and revenue reporting.

It reads and writes the editorial opportunity ledger, campaign ledger and content queue, applies human approval gates, generates bounded channel adaptations, records corrections as revisions rather than silently overwriting history, reads revenue/trust/pipeline data, and produces an executive PDF report.

The current editorial system is deliberately conservative about unsupported claims. Preserve that safety property, but do not let governance language dominate the public brand experience.

### Tayoca Growth OS | Operator Brief

Treat Operator Brief as a first-class publishing property, not a hidden form. The workflow has governed issue generation, approval, archive publication, corrections/revisions and fail-closed email delivery behaviour. Understand its archive/content contract before changing URLs, page structure, subscription surfaces or CMS models.

### Tayoca Growth OS | Assessment & Operator Brief Intake

This active intake validates and deduplicates assessment leads and explicitly consented newsletter subscriptions. The website redesign must preserve consent semantics, idempotency, unsubscribe behaviour and any endpoint contracts.

### Tayoca Growth OS | Community Website Initiative Intake

This active workflow receives community applications, persists them in Growth OS / Revenue Pipeline, acknowledges applicants and gates further research through approval. The public community experience may be redesigned, but its intake contract must remain functional or be migrated deliberately.

### Tayoca Growth OS | Community Google Form Intake Bridge

This active bridge polls the Google Form and routes new submissions into the live community intake path. If the public experience changes from Google Forms to another interface, propose a migration rather than breaking the bridge silently.

### Tayoca Growth OS | Verified Review & Trust Flywheel

This workflow contains a verification hold and intentionally does not treat unverified events as trusted customer evidence. Preserve the truthfulness boundary.

### Tayoca Ops | Production Failure & Dead Letter

Treat this as part of the control plane. Any new workflow, CMS mutation path or integration should have observable failure behaviour and a clear ownership path.

## What the control plane should become

The target is not "more n8n workflows". The target is a coherent company operating platform with explicit domains and contracts.

Model the control plane around capabilities such as:

- Content and CMS
- Portfolio / project registry
- Product and publication catalogue
- Editorial and newsletter publishing
- Media / asset library
- Lead and assessment intake
- Community programmes
- Revenue pipeline and attribution
- Reviews / trust
- Distribution / social publishing
- Analytics and executive reporting
- Messaging and notifications
- Workflow operations / health / dead letters
- Access, approvals and audit history

These are functional domains, not mandatory UI labels.

## CMS expectations

The redesign should not leave Tayoca with a static-site front end and a CMS that only understands arbitrary HTML files.

Research and propose a stronger content model while preserving current production compatibility during migration. The CMS should eventually understand structured entities such as:

- company pages;
- services / solution areas;
- products;
- software / ventures / projects;
- publications and books;
- articles / insights;
- newsletter issues;
- community initiatives;
- case studies / work items;
- media assets;
- calls to action;
- navigation / footer configuration;
- SEO / Open Graph metadata.

Do not force everything into one generic product schema. A client project, publication, software product, community initiative and internal system are different entities and should be modelled accordingly.

The migration can remain file-backed and Git-backed if that is the best architecture. A database is not automatically required. The objective is reliable structured content, previewability, version history and safe publication.

## Source-of-truth rules

- Forgejo remains canonical unless explicitly changed by the owner.
- GitHub is an external-agent workspace / downstream surface, not an independent production authority.
- The CMS should not create a second truth store that can silently diverge from canonical content.
- n8n workflow state, Sheets ledgers and website content must have documented ownership boundaries.
- If structured data is introduced, define which repository files or data stores own each entity.

## Required discovery work

Before proposing changes:

1. Inventory the current public content tree and content/data files.
2. Identify every website form, endpoint, webhook, feed, archive and URL consumed by n8n.
3. Identify every n8n workflow that reads from or writes to Tayoca website content or website-generated data.
4. Map all Sheets used by Growth OS and classify each as system-of-record, ledger, cache, queue or reporting view.
5. Identify duplicate or overlapping workflows, inactive predecessors and temporary workflows that should not become permanent architecture.
6. Map the CMS gateway actions and current path restrictions.
7. Map asset/media storage and upload contracts.
8. Map approval boundaries, correction semantics, idempotency rules, unsubscribe/consent rules and failure handling.
9. Identify secrets or privileged values stored directly in workflow code and propose secure migration without exposing them.
10. Document observability gaps, dead-letter behaviour and operational ownership.

## User experience for the control plane

If a control-plane UI or CMS interface is redesigned, it should feel like an internal operating product, not a generic admin template.

It should make the following easy to understand:

- what content exists and its publication state;
- what is scheduled or awaiting approval;
- what products/projects/publications exist;
- what forms and campaigns are active;
- what leads and community applications have arrived;
- what newsletter issue is current;
- what workflows are healthy or failing;
- what corrections or review actions are pending;
- what changed, who changed it and what source-of-truth object was modified.

Do not create decorative dashboards with invented metrics. Every metric shown must have a defined data source and unavailable metrics should remain unavailable rather than defaulting to zero.

## Security and change-management requirements

- Never place production secrets in repository files or agent prompts.
- Do not grant LM Arena direct production n8n credentials.
- Do not expose broad workflow mutation endpoints to the public site.
- Keep least-privilege boundaries between CMS content operations and workflow administration.
- Preserve human approval where the current workflow requires it for publication, commercial claims, distribution or high-impact actions.
- Keep destructive content actions auditable and recoverable.
- Use branch/PR-based migration for repository changes.
- Provide rollback steps for changes that modify CMS contracts, content schemas, forms, webhooks or workflow integrations.

## Desired end state

The public website and control plane should behave as two views of one Tayoca company platform:

- public visitors see a coherent company, its work, software, services, publications, insights and community programmes;
- the internal control plane lets the company operate those surfaces reliably;
- structured content can be edited without hand-patching unrelated HTML;
- workflows consume stable contracts rather than fragile page markup;
- publication, newsletter, product, project and community data are reusable across the website and automation stack;
- analytics and revenue reporting use traceable sources;
- failures are observable;
- source-of-truth ownership is explicit;
- external coding/design agents can work through Git branches without receiving production credentials.

## Deliverables

Produce alongside the website redesign:

1. a current-state control-plane architecture document;
2. a website-to-n8n/CMS dependency map;
3. a content-domain and source-of-truth model;
4. a proposed CMS/content architecture;
5. a workflow rationalisation plan identifying canonical, legacy, temporary and duplicate workflows;
6. a secure secret/authentication remediation plan where necessary;
7. an integration migration plan for any changed paths, forms, content types or endpoints;
8. a control-plane UI/UX proposal if the existing CMS/admin experience needs redesign;
9. observability and failure-handling recommendations;
10. staged implementation with validation and rollback criteria.

Do not redesign the company website first and then attempt to retrofit the control plane afterward. Treat both as one architecture with separate public and internal surfaces.