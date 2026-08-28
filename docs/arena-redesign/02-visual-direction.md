# Tayoca Arena Redesign — Visual Direction & Design System Rationale

## 1. Positioning of the visual language

Tayoca's identity is a **night workshop**: a warm near-black canvas, a single amber signal colour, disciplined Sora display type, Inter body and JetBrains Mono for technical annotation. The brief forbids generic AI-SaaS styling (navy/near-black + glowing gradient blobs, glassmorphism, neural-node graphics, fake dashboards). The existing brand is defensible and evidence-consistent — this redesign **evolves and systemizes it**, it does not replace it.

Direction statement: *"An engineering-led company that builds real things — the site should read like a well-kept workshop ledger: precise labels, real artefacts, amber highlights where the work is, and no decoration that can't be accounted for."*

## 2. Design tokens (canonical, one source)

```css
--bg:        #0d0d0d   (warm near-black canvas, unchanged)
--surface:   #171717   (card surface, unchanged)
--surface-2: #1d1b18   (warm-tinted band surface — amber cast, not grey)
--surface-3: #26231f   (hover/raised surface)
--ink:       #f5f4f1   (warm off-white, primary text)
--ink-2:     #d8d5d0   (body text)
--muted:     #a3a3a3   (captions/metadata)
--line:      #2e2b27   (warm hairlines)
--accent:    #f97316   (amber, unchanged)
--accent-2:  #fb923c   (amber-300 for subtle fills)
--accent-ink:#1a0f06   (text on amber)
--paper:     #faf6ef   (warm paper — reserved for the "certificate/ledger" evidence motif only)
--mono:      JetBrains Mono   --display: Sora   --body: Inter
```

Rule: no alternate colour system; amber stays the only saturated accent; warm greys replace neutral greys; paper tone is a rare motif, not a theme.

## 3. Typography system

- Display: Sora 800/700, tight tracking (`-0.04em` headlines), sizes via clamp (hero `clamp(2.5rem,6vw,4.4rem)`).
- Body: Inter 400/500/600, `1.65` line height, max measure `68ch`.
- Annotation: JetBrains Mono 500/600 for eyebrows, tags, numbers, metadata, "ledger" labels. Eyebrows are uppercase, letter-spaced `.11em`, amber.
- Section numbering motif: `01 — Practice`, `02 — Build`, `03 — Buy`, `04 — Read`, `05 — Community` — the "ledger" conceit.

## 4. Components

| Component | Design |
|---|---|
| Header | Sticky, `rgba(13,13,13,.92)` + blur, hairline bottom border, wordmark `TAYOCA` (Sora 800, `.15em`), nav links Inter 600, amber active state, CTA button amber. Mobile: single menu toggle, full-width dropdown, Escape/click-outside close (existing JS preserved). |
| Hero | Two compositions: (a) home — split layout: left identity copy + CTAs, right product/artefact montage (real covers + labelled interface concept); (b) interior — centred, eyebrow + headline + lede. Amber hairline rule below. |
| Ledger band | Numbered section labels + warm surface-2 band; used once per page, not repeated. |
| Cards | `#171717` surface, warm hairline border, 12px radius, hover: lift 4px + amber border; arrow affordance. Variants: practice card, portfolio card (image top), product card (cover image + price + CTA), article card (category tag + title + excerpt). |
| Portfolio strip | Image-led horizontal band on home + grid on /work with kind + status tags (mono, amber/green/grey, always truthful). |
| Evidence motif | "Ledger" block: mono label, bordered panel, amber tick list; used on results/trust only. |
| Newsletter panel | Split: pitch + form card (form classes preserved for growth-os.js). |
| Footer | Four directories (Company / Services / Build & Buy / Publishing / Community) + Connect column; identical everywhere. |
| Buttons | Primary (amber, dark text), secondary (surface-3 border), ghost (hairline), full/small variants — same system as current, refined. |

## 5. Imagery strategy (all generated/assembled in-repo; no fake people, no fake clients)

1. **Real artefacts first**: 8 existing product covers (512px) used on products/home/work; preview images (600×420) reused on product pages; OG images reused.
2. **Editorial photography** (generated, generic, believable — no identifiable persons):
   - Home hero side panel: engineer's night desk — laptop terminal, notebook, warm amber lamp, dark warm backdrop.
   - About: workshop/desk variant + Ontario main-street daylight shot for community.
3. **Project artwork** (generated, non-claiming):
   - Sivanta: labelled "conversation flow" system diagram in brand palette (explicitly an interface concept, not a production screenshot).
   - SiteSupply: construction/procurement marketplace motif (no logos, no fake client data).
   - Operator Brief: editorial/magazine motif.
4. **Community photography**: generic Ontario small-town storefront, daylight, warm — represents the programme's subject (local businesses), not a specific claimed business.
5. **Diagrams only where they clarify**: Sivanta flow diagram; platform delivery loop on services (kept minimal).

**Anti-patterns explicitly avoided**: gradient blobs, circuit-board imagery, neural networks, glassmorphism, fake dashboards as decoration, stock team photos, unsupported numbers.

## 6. Motion

Subtle only: hover lifts, focus rings (3px amber offset), smooth scroll. `prefers-reduced-motion: reduce` disables transitions (already present; carried forward). No scroll-jacking, no parallax.

## 7. Accessibility baseline

- Contrast: amber-on-dark `#f97316` on `#0d0d0d` ≈ 6.6:1 (AA+ for normal text); body `#d8d5d0` on `#0d0d0d` ≈ 12:1. Amber buttons use dark text `#1a0f06` (≈ 8:1).
- Skip link, focus-visible states, `aria-current="page"`, labelled forms, `role="status"` on form responses (preserved from growth-os.js).
- Touch targets ≥ 44px on nav/mobile; readable line lengths; responsive 1200/900/680 breakpoints carried from the existing shell.

## 8. Benchmark references (see discovery doc §6)

Principles adopted from: thoughtbot (portfolio + publications as brand), Fly.io (warm canvas, mono chrome, editorial as identity), Tailscale (restrained accent, technical labels), TRC/Dimensional Innovations (portfolio-first discovery), EWB (community-led trust). No layouts copied; principles only.
