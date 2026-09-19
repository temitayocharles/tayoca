# Tayoca Social Growth Operations Update

Date: 2026-09-18

## Scope

This checkpoint records the completed social launch work, Growth OS repairs, current channel constraints, and the next staged authority wave.

## Published social launch

### Instagram brand launch

- Content ID: `tayoca_instagram_brand_launch_20260918`
- Campaign: `tayoca_20260918_social_launch_wave1`
- Published: 2026-09-18T17:44:37Z
- URL: https://www.instagram.com/p/DdcAEism0XC/
- Verified baseline: 0 likes, 0 comments at capture time.

### Facebook local launch

- Content ID: `tayoca_facebook_local_launch_20260918`
- Campaign: `tayoca_20260918_social_launch_wave1`
- Published: 2026-09-18T17:44:55Z
- URL: https://www.facebook.com/122098859420588173/posts/122107398512588173
- Verified baseline: 0 reactions, 0 comments at capture time.

## Published authority wave 2

### Instagram Kubernetes production readiness

- Content ID: `tayoca_instagram_k8s_readiness_20260918`
- Campaign: `tayoca_20260918_social_authority_wave2`
- Published: 2026-09-18T17:56:50Z
- URL: https://www.instagram.com/p/DdcBd6em8Nt/
- Verified baseline: 1 like, 0 comments at capture time.

### Facebook evidence-led engineering

- Content ID: `tayoca_facebook_evidence_led_engineering_20260918`
- Campaign: `tayoca_20260918_social_authority_wave2`
- Published: 2026-09-18T17:56:58Z
- URL: https://www.facebook.com/122098859420588173/posts/122107398932588173
- Verified baseline: 0 reactions, 0 comments at capture time.

## Growth OS repair

The two campaign rows had Facebook publication URLs incorrectly stored in the `instagram_url` field.

They were repaired so:

- `tayoca_20260918_social_launch_wave1.instagram_url` now points to the Instagram launch post.
- `tayoca_20260918_social_authority_wave2.instagram_url` now points to the Instagram authority post.
- Facebook publication receipts are preserved in each campaign `source` field because the current Campaigns schema does not contain a dedicated `facebook_url` column.

The four published Content Queue rows were also updated with verified engagement baselines and notes. No unavailable reach or impression values were invented.

## DEV Community baseline

Three published Tayoca articles remain live.

- AI publication governance: 10 page views, 0 reactions, 0 comments at capture time.
- Kubernetes production readiness: 30 page views, 0 reactions, 0 comments at capture time.
- Technology value and explicit operating problems: 10 page views, 0 reactions, 0 comments at capture time.

Total captured DEV views: 50.

## Upload-Post audit

Profile `tayoca-main` exists on the Default plan.

At audit time it exposes only a TikTok account placeholder. Facebook, LinkedIn, Pinterest, and Google Business are not linked to that profile, so Upload-Post is not currently a usable Tayoca cross-channel publisher for those destinations.

No new external connections were created automatically.

## Facebook identity state

The managed Page still resolves through the Graph API as:

`Charlie’s Local Tech Help - Shelburne, Orangeville, Alliston & Area`

The Tayoca-aligned About, description, and website metadata are present and the Page is published.

The rename is therefore not certified complete. Issue #168 remains open until the Page name itself reflects the intended Tayoca identity and local-search identity can be rechecked.

## Social Authority Wave 3

Wave 3 is staged for owner review only.

Campaign:

`tayoca_20260918_social_authority_wave3`

Items:

1. `tayoca_instagram_ai_publication_governance_20260918`
   - Platform: Instagram
   - Source: published DEV AI publication governance article
   - Status: `ready_for_owner_review`
   - Editorial state: `review_required`

2. `tayoca_facebook_k8s_readiness_20260918`
   - Platform: Facebook
   - Source: published DEV Kubernetes production readiness article
   - Status: `ready_for_owner_review`
   - Editorial state: `review_required`

Neither item has been distributed.

## Current operating constraints

- YouTube is out of scope by user direction.
- No paid promotion or Reddit Ads spend is authorized.
- Reddit participation must remain rule-compliant and non-promotional.
- Upload-Post is not yet connected to the relevant Tayoca destinations.
- Facebook Page rename remains unresolved at API level.
- Canva canonical-logo upload remains pending until the uploaded local image can be staged into a public or Canva-accepted upload source without changing the logo content.
