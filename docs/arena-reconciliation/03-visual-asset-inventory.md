# Visual asset inventory

Every image used by the redesigned site, its provenance, and the surface it supports.
No asset is presented as something it is not: generated imagery is editorial, real
product artwork is used where real artwork exists, and nothing here is a fabricated
customer, dashboard or production screenshot.

## 0. Provenance classes

| Class | Meaning | Rules applied |
|---|---|---|
| **RESTORED** | Committed on the earlier Arena redesign branch (`942e4a5`) and carried forward | Reused verbatim; no re-upload, no re-generation |
| **GENERATED** | Produced in this workspace as editorial imagery | Editorial only. Never labelled as a real product screenshot, customer photo, client site or production capture. Alt text describes the scene, never a claimed client. |
| **CANONICAL** | Already on current `main` | Untouched |

## 1. Editorial photography / illustration — `public/assets/img/`

| File | Class | Size | Surfaces it supports |
|---|---|---|---|
| `hero-workshop-wide.jpg` | GENERATED | 146 KB | Home hero (cinematic full-bleed) · segment hero for `ai-enabled-engineering` |
| `workshop-detail.jpg` | RESTORED | 218 KB | About hero-split · Assessments hero-split · Trust hero-split · segment hero for `regulated-operations` |
| `build-bench.jpg` | GENERATED | 237 KB | Work hero · segment hero for `growth-stage-technology` |
| `publishing-print.jpg` | GENERATED | 266 KB | Blog index hero · Work "Build & Read" portfolio card |
| `community-storefront-day.jpg` | GENERATED | 399 KB | Home community split + portfolio card · Community initiative hero background |
| `ontario-main-street.jpg` | RESTORED | 334 KB | Work community section figure |
| `operator-brief-editorial.jpg` | RESTORED | 152 KB | Home brief split · Operator Brief hero |
| `sitesupply-market.jpg` | RESTORED | 232 KB | Home build mosaic · Work portfolio card (neutral "Project / build · In market") |
| `workshop-desk.jpg` | RESTORED | 162 KB | Services hero-split |
| `sivanta-flow.png` | RESTORED | 694 KB | Sivanta hero (device frame) · Products · Work · Home — the Sivanta conversation-flow diagram |

All ten files resolve and are referenced. No page references a missing image.

## 2. Real product artwork — never substituted

### 2.1 Publication covers — `public/cover_*.png` (CANONICAL, 8 files)

| Cover | Product | Price |
|---|---|---|
| `cover_ai-automation-career.png` | AI Automation Career Transition Guide | $49 |
| `cover_ai-made-simple.png` | AI Made Simple | — |
| `cover_aws-cost-optimization.png` | AWS Cost Optimization Playbook | $29 |
| `cover_build-break-fix-devops.png` | Build/Break/Fix DevOps Labs | $19 |
| `cover_devops-incident-runbook.png` | DevOps Incident Response Runbook | $19 |
| `cover_gitops-field-guide.png` | GitOps Field Guide | $29 |
| `cover_k8s-production-checklist.png` | Kubernetes Production Readiness Checklist | $19 |
| `cover_n8n-mcp-k8s.png` | n8n + MCP on Kubernetes Teaching Pack | $39 |

These are the real published covers. They drive the product cards on `products.html`
and the cover strip on the home page and blog index. **No cover was replaced with a
generated image**, and no generated image is presented as a product cover.

### 2.2 Product preview imagery — `public/assets/previews/*.png` (CANONICAL, 16 files)

Used by the existing product pages (`k8s-setup`, `real-scenarios`, `n8n-mcp`,
`lab-guide`, `course-kit`, `automation-patterns`, `ai-made-simple`, `ai-career-guide`).
Retained as-is.

### 2.3 Open Graph / social imagery (CANONICAL)

`assets/og-image.png` (default), `assets/og-aws-savings.png`,
`assets/og-k8s-readiness.png`, `assets/sivanta-og-image.png`. All `og:image` and
`twitter:image` references were carried through the redesign unchanged.

## 3. Non-photographic visuals added by this redesign

| Element | What it is | Why it is honest |
|---|---|---|
| Inline-SVG operating-loop diagram (`services.html`) | Drawn diagram | Clearly a diagram; no screenshot claim |
| Inline-SVG control-plane diagram (`work.html`) | Drawn diagram | Labels the integration surface abstractly |
| `.device` browser frame around `sivanta-flow.png` | A frame around the real flow diagram | The diagram is the real artefact; the frame is chrome |
| `.diagram` / `.paper-band` / `.rail` / `.mosaic` | Layout and composition primitives | Not imagery; no representational claim |
| `.segment-hero--*` photographic heroes | Three different photographs, one per segment | Prevents the segment pages reading as three copies of one template |

## 4. Anti-monotony measures

The program authority asked for a strong near-black foundation with real light/dark
contrast and visual variety, explicitly warning against "another uniform
dark-card system". What the redesign does about it:

1. **Warm-paper bands** break the dark run on home, about, services, work, results and
   blog — a paper surface with dark ink, not another dark card.
2. **Ten distinct editorial images** across the site, with no image used more than four
   times and most used once or twice.
3. **Full-bleed cinematic heroes** vs. split heroes vs. banded headers — three hero
   treatments rather than one.
4. **Real product covers** as the dominant colour and texture on product surfaces.
5. **Drawn diagrams** instead of decorative gradients.
6. **Chips, ledger labels and mono meta rails** for texture instead of extra cards.
7. **Per-segment hero photography** so the three segment pages are visually distinct.

## 5. Asset rules the redesign obeys

- No stock-photo human faces implying staff, customers or clients.
- No fabricated logos, dashboards, terminal captures or "before/after" charts.
- No generated image is captioned or alt-texted as a real client, real deployment or
  production screenshot.
- Every image carries descriptive `alt` text; purely decorative frames are not given
  misleading descriptions.
- Images that illustrate a *subject* (for example local independent storefronts for the
  community initiative) are captioned as the subject, not as a claimed client —
  `work.html` states this explicitly in its figure caption.
