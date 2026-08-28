# Tayoca Control Plane — UX Proposal (internal operating surface)

Scope: design proposal for the internal control-plane/CMS experience. No production n8n access used; this is a repository-delivered specification the authorised control plane can implement.

## 1. Positioning

The control plane is an internal operating product, not an admin template: dark warm canvas (same tokens as the public site — one company, two surfaces), dense but calm, every number traceable to a defined source. It answers: *what exists, what's pending, what changed, what's healthy.*

## 2. Information architecture (internal)

```
Control Plane
├─ Overview        (publication state, scheduled/awaiting approval, workflow health)
├─ Content         (entity browser: pages, services, portfolio, products, publications,
│                   articles, newsletter issues, community, media, nav/footer, SEO)
├─ Editorial       (opportunity ledger, campaign approvals, corrections/supersessions)
├─ Intake          (assessment leads, Operator Brief subscriptions, community applications)
├─ Trust & Reviews (verification hold queue, publication approvals, review requests)
├─ Revenue         (pipeline, proposals, objections, attribution, verified revenue)
├─ Distribution    (campaigns, channels, UTMs, published assets)
├─ Analytics       (first-party + Search Console snapshots with data-through provenance)
└─ Operations      (workflow health, dead letters, reliability ledger, audit log)
```

These are functional domains from the control-plane brief, not hard-coded labels.

## 3. Key surfaces

### Overview
- Cards with *defined* sources only: current Operator Brief issue (archive page + workflow state), pending approvals (editorial/campaign ledgers), active intake counts (intake ledger), workflow health (reliability ledger + dead-letter monitor), latest content commits (Forgejo). Unavailable metrics render as "no data" — never zero.

### Content entity browser
- Left: entity tree (kinds above). Centre: list with status chips (draft / scheduled / approved / published / superseded / withdrawn). Right: detail panel with metadata, canonical URL, source-of-truth file, last change (commit + author + timestamp), and gateway actions (create/update/delete → PR in Forgejo, never direct-to-main).

### Editorial approval queue
- Opportunities → draft → approval (human) → distribution approval (human) → published. Corrections create revisions; supersession marks prior versions; history never silently rewritten. Mirrors the existing workflow semantics exactly.

### Intake
- Read-only triage view over intake ledger; dedupe state and consent flags visible; unsubscribe/consent history visible; no write path from this view (operations stay in n8n).

### Trust & Reviews
- Verification hold queue: items fail closed until verification completes; publication requires human approval. This is a queue with gates, not a scoreboard.

### Operations
- Workflow rows (the 5 active + monitor) with last execution, freshness window, dead-letter count (metadata-only), owner, and link to sanitized snapshots. Audit log: every content mutation from the gateway (commit, author, entity, path).

## 4. Design language (internal)

Same tokens as public (`00`–`05` docs): `#0d0d0d` canvas, `#171717` surfaces, amber accent, Sora/Inter/JetBrains Mono. Dense tables in mono for ledgers; status chips (amber = pending, green = verified, grey = inactive, red = failed/dead-letter); no charts without a defined data source; no decorative metrics.

## 5. Implementation path

1. Static prototype (HTML in repo, no backend): Overview + Content browser + Operations from fixture data — reviewable without n8n access.
2. Gateway entity actions behind approval (authorised control plane).
3. Connect to reliability ledger + ledgers via read-only workflow endpoints.
4. Auth: existing gateway auth; least-privilege; content ops ≠ workflow administration.

Deliverable of this workspace: this proposal + the repository-side contracts in `05-control-plane-migration-plan.md`. The prototype itself should be built by the owner's control-plane team or via an authorised follow-up.
