# Tayoca Organic Search Opportunity Audit

Date: 2026-09-18

## Scope

This audit uses verified Search Console performance and current public metadata to identify pages that are already receiving impressions but no clicks.

No public metadata changes are made by this document.

## Baseline

Search Console property:

`https://tayoca.com/`

Performance window:

2026-08-18 through 2026-09-16

Clicks:

0

The priority is therefore not to claim established organic acquisition. It is to improve qualified discovery and click-through from pages that already have search visibility.

## Priority pages

### 1. DevOps Incident Response Runbook

URL:

`https://tayoca.com/blog/devops-incident-response-runbook.html`

Search Console:
- 29 impressions
- 0 clicks
- average position approximately 24.8

Current title:

`DevOps Incident Response Runbook: Practical Template & Checklist (2026) | Tayoca`

Current description:

`A practical DevOps incident response runbook for 2026: severity, first-response checklist, incident roles, evidence-led investigation, safe mitigation, communications, rollback decisions, and postmortems.`

Assessment:

The page already has a strong, query-aligned title and substantive structured content. The primary constraint is ranking rather than an obviously weak snippet. Prioritize internal linking, relevant external references, topic-cluster support, and earned authority before rewriting an already descriptive title.

### 2. Products catalogue

URL:

`https://tayoca.com/products.html`

Search Console:
- 23 impressions
- 0 clicks
- average position approximately 20.9

Current title:

`Products & Operator Publications | Tayoca`

Current description:

`Practical Tayoca workbooks, playbooks, lab packs and checklists for Kubernetes, cloud cost management, GitOps, DevOps operations and AI automation.`

Assessment:

The title is brand/category oriented rather than search-intent oriented. It may be worth testing a later title that surfaces the strongest categories directly, but public title changes should be reviewed against the catalogue positioning before publication.

The page also contains a legacy first-party analytics block in addition to `/ga4.js`. That should be investigated separately for first-party measurement duplication. Do not remove it until downstream consumers are identified.

### 3. About

URL:

`https://tayoca.com/about.html`

Search Console:
- 21 impressions
- 0 clicks
- average position approximately 4.9

Assessment:

This is the clearest click-through-rate opportunity because the average position is already comparatively strong. Before changing copy, inspect actual query mix and the unrelated `www.tayoca.com` entity ambiguity. Brand/entity clarification is likely more important than generic keyword expansion.

### 4. n8n MCP Kubernetes article

URL:

`https://tayoca.com/blog/n8n-mcp-kubernetes.html`

Search Console:
- 15 impressions
- 0 clicks
- average position approximately 11.9

Assessment:

This page is near the first-page boundary. Treat it as a high-priority technical authority page. Improve topical internal links from relevant n8n, Kubernetes, automation, and product surfaces before introducing broader claims.

### 5. GitOps Beyond Hello World

URL:

`https://tayoca.com/blog/gitops-beyond-hello-world.html`

Search Console:
- 11 impressions
- 0 clicks
- average position approximately 6

Assessment:

The page has potentially useful visibility at a position where snippet relevance and authority can materially affect clicks. Review title, description, first visible answer, internal links, and structured data as one package rather than changing only the title.

### 6. Services

URL:

`https://tayoca.com/services.html`

Search Console:
- 10 impressions
- 0 clicks
- average position approximately 5.6

Assessment:

This is another CTR-sensitive page. The page should make Tayoca's explicit operating-problem positioning immediately clear and avoid generic consultancy language. Query-specific evidence should be reviewed before editing metadata.

### 7. Kubernetes Production Checklist

URL:

`https://tayoca.com/blog/kubernetes-production-checklist.html`

Search Console:
- 8 impressions
- 0 clicks
- average position approximately 13

Assessment:

The existing public authority work on production readiness can support this page. Internal linking from the DEV article, product catalogue, and related Tayoca pages should be consistent, but do not create unsupported claims about production outcomes.

## Entity clarity

Public search also returns an unrelated `www.tayoca.com` entity.

The owned property is:

`https://tayoca.com/`

Future entity work should make the owned organization identity clearer through consistent Organization structured data, sameAs references where authoritative profiles exist, canonical URLs, branded profile metadata, and stable organization naming.

Do not claim ownership or affiliation with the unrelated `www` entity.

## Search and analytics discrepancy

GA4 currently reports a meaningful `google / organic` session row while Search Console reports zero clicks for the overlapping final-data window.

Do not optimize against the GA source label as though it were verified Search acquisition until this discrepancy is understood.

Possible audit questions:
- whether GA is inheriting or misclassifying referrers
- whether bot or non-search traffic is entering the source bucket
- whether Search Console and GA host/path scopes differ
- whether reporting date boundaries are affected by the GA property timezone
- whether a legacy analytics path is contributing inconsistent source attribution

## Recommended sequence

1. Resolve entity ambiguity and query mix for the About and Services pages.
2. Strengthen internal topic clusters for the incident runbook, n8n MCP Kubernetes, GitOps, and Kubernetes readiness pages.
3. Audit legacy first-party analytics duplication on the Products page.
4. Review snippets for pages already ranking near positions 4 through 12.
5. Re-measure Search Console clicks and CTR before making larger metadata changes.
6. Preserve evidence policy and withdrawn-claim noindex controls throughout.

## Publication boundary

Any actual title, description, structured-data, or public page copy change remains a separate editorial and distribution decision.
