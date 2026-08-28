# GitHub-only source drift register

Deliverable: identify and classify historical GitHub-only content and funnel drift so
the canonical integrator can decide what to adopt. **Nothing here was silently
restored.**

> GitHub is the external design workspace. Final acceptance and production
> reconciliation must occur through canonical Forgejo.

## Method

Compared the canonical GitHub `main` (`d13dd28ef0dba6695bf1140221dab287a53ac970`,
mirroring Forgejo `917bbb733c877bbdf4e64e3fac91cc8e07131fab`) against the divergent
GitHub history and the earlier Arena redesign branch
(`942e4a57f61c66337adef2b851f5bd4b18096e3e`).

Structural finding: `git merge-base --all origin/main 942e4a57…` returns **nothing**
(exit 1). The histories share no commit, so drift cannot be resolved by merge or
cherry-pick — only by intent. This is why the reconciled branch was rebuilt from
current `main`.

## Drift register

### D1 — SiteSupply market-entry acquisition funnel

| | |
|---|---|
| Origin | Historical GitHub-only commits (lineage: "Add SiteSupply market-entry acquisition funnel", PR #12) |
| Artefact | `public/blog/sitesupply-construction-procurement-marketplace.html` |
| Currently in canonical `main`? | **No** |
| Evidence | Not present in the canonical repository at `d13dd28`. The current canonical `main` is the authority. |
| Content risk | It asserts a SiteSupply **ownership/relationship** position that the company registry still classifies as `owner_confirmation_required` |
| Classification | **Useful but not canonical; relationship claim unresolved** |
| Action taken | **Not restored.** No public page links to it. `/work.html` classifies SiteSupply neutrally as `Project / build · In market`. |
| Recommendation | If the owner confirms the relationship and naming, re-author it as a canonical Forgejo page, classify it in `company-ecosystem.json` with `disclosure_permission: approved_for_publication`, then link it from `/work.html`. Do not restore the historical file as-is. |

### D2 — Community initiative intake surface

| | |
|---|---|
| Origin | Historical on-site intake form |
| Current canonical state | Canonical `main` replaced the on-site form with the Google Form; `community-websites.js` retains the legacy path |
| Classification | **Canonical wins** |
| Action taken | None. Google Form URL and all `data-google-form-cta` markers preserved. |

### D3 — AI/DevOps script-debugging lead magnet

| | |
|---|---|
| Origin | Historical GitHub-only content/funnel work |
| Current canonical state | Absent |
| Classification | **Funnel drift; intent not confirmed** |
| Action taken | Not restored, not linked |
| Recommendation | Reconcile intent through Forgejo before any reuse. |

### D4 — "Production Interview" lead magnet

| | |
|---|---|
| Origin | Historical GitHub-only content/funnel work |
| Current canonical state | Absent |
| Classification | **Funnel drift; intent not confirmed** |
| Action taken | Not restored, not linked |
| Recommendation | Reconcile intent through Forgejo before any reuse. |

### D5 — Legacy `/l/*` landers and superseded product landers

| | |
|---|---|
| Current canonical state | Present behind 301 redirects in `_redirects` and `vercel.json` |
| Classification | **Canonical redirects — preserve** |
| Action taken | All 18 redirect rules preserved, including the newer runbook redirect. Landers were given the canonical shell but not reinstated as primary destinations. |

### D6 — Older Arena redesign branch as a whole

| | |
|---|---|
| Origin | `arena/01a04553-tayoca` @ `942e4a57…` (PR #13, still open) |
| Classification | **Superseded as a merge candidate; retained as the visual source** |
| Action taken | Not merged, not rebased. Design intent was ported by hand onto a branch cut from current `main`. Its `docs/arena-redesign/*` set was **not** copied forward because it contains the two errors this task corrects (Creator Prompter Studio recorded as "not found"; five-active-workflow framing). It is replaced by `docs/arena-reconciliation/*`. |
| Recommendation | Keep PR #13 open as history; mark it superseded-for-merge. Review the reconciled branch instead. |

### D7 — Root-level `LM_ARENA_*_BRIEF.md` documents

| | |
|---|---|
| Origin | Earlier Arena branch root |
| Current canonical state | Absent from canonical `main` |
| Classification | **Not canonical** — the briefs live on the canonical `lm-arena/company-platform-rebuild` branch |
| Action taken | Not restored |

## Rules applied to every item

1. **Canonical `main` wins** for facts, contracts and publication state.
2. A page that exists only in divergent GitHub history is **not** linked from a public
   page and **not** added to the sitemap.
3. Unverified third-party, client or community work is never published on the strength
   of its own existence.
4. Drift is **classified and reported**, not quietly adopted.
