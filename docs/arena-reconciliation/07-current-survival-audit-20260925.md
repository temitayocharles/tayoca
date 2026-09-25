# Arena v2 survival audit — 2026-09-25

## Scope

Compared GitHub Arena v2 branch `arena/01a04a44-tayoca` against current canonical Tayoca after Forgejo/GitHub reconciliation.

## Result

- Arena v2 changed 72 tracked paths.
- 22 of those paths remain byte-for-byte identical.
- 50 have evolved since Arena v2.
- 0 Arena v2 paths are missing from current Tayoca.
- The shared visual-system stylesheet retains every Arena v2 selector. Current canonical adds only accessibility/contrast corrections on top of the Arena selector set.
- The company map remains present in the site header.
- `Work` and `Community` remain in managed Site Settings navigation and footer data.
- The company ecosystem remains schema v2 and retains its classification, portfolio, publication, community and runtime-inventory model.

## Interpretation

The current site is not a wholesale loss of the Arena makeover. The visual language and company-platform data model survived. Later work substantially simplified page composition and public copy, especially on Home, Work, About, Services, Products, Results and Trust.

The current copy should not be overwritten with the stale Arena branch. Instead, durable Arena concepts are now protected by `scripts/validate_arena_visual_system.py` while current content remains free to evolve.

## Durable contracts protected

- cinematic/split hero primitives
- paper-band contrast system
- portfolio/ledger/device/diagram components
- company-map navigation
- Work, Operator Brief, Community, Trust, Reviews and Sivanta discovery surfaces
- owned/project/community/internal-system representation on the Work surface
- company ecosystem schema v2 and classification model

This guard is deliberately structural rather than pixel-exact. It prevents accidental flattening without freezing the site to the August Arena implementation.
