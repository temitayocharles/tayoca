# Tayoca Entity Consistency Audit

Date: 2026-09-20

## Scope

This audit is limited to identity consistency in structured data. It does not add unverified social profiles, a physical business address, local-business markup, reviews, ratings, or claims.

## Current canonical entity

The homepage defines the organization as:

- entity ID: `https://tayoca.com/#organization`
- name: Tayoca
- URL: `https://tayoca.com/`
- founder: Temitayo Charles
- area served: Canada and Worldwide

## Observed inconsistency

The About and Services pages each embedded a fresh anonymous Organization object rather than referring to the homepage's stable organization ID.

That does not prove a search-engine problem, but a stable `@id` gives parsers a consistent identifier for the same organization across pages.

## Staged correction

- AboutPage gets its own stable page ID and its `mainEntity` Organization now uses `https://tayoca.com/#organization`.
- Service gets its own stable service ID and its provider Organization now uses `https://tayoca.com/#organization`.
- User-visible copy is unchanged.
- No `sameAs` values are added because Tayoca's Facebook rename and LinkedIn organization-admin scope are still unresolved, and the current evidence does not establish a complete authoritative social-profile set.
- No LocalBusiness or street-address schema is added because Tayoca's eligible Google Business representation is still unresolved.
- The homepage logo field is left unchanged. The canonical-logo asset bridge remains a separate verification item.

## Publication gate

This branch was rebuilt from current `main` to exclude unrelated research-file drift. Only the two structured-data changes and this audit belong in the publication diff.
