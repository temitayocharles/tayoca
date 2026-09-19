# Tayoca Growth Measurement Checkpoint

Date: 2026-09-18

## Authority and scope

This checkpoint records the current analytics and search-discoverability baseline for Tayoca and the low-risk measurement correction applied to the Community Website Initiative.

No paid media, public outreach, social publication, or customer-contact action is authorized by this document.

## Canonical analytics property

The active tayoca.com GA4 property is:

- Property: `properties/548373018`
- Stream: `properties/548373018/dataStreams/15375937707`
- Stream name: `Tayoca Website`
- Default URI: `https://tayoca.com`
- Measurement ID: `G-G4QC90QNXW`
- Currency: CAD
- Current property timezone: America/Vancouver

A second GA4 property named Tayoca, `properties/548376430`, currently has no data stream. Do not treat it as the production source.

The production property timezone does not match Tayoca's Ontario operating context. This is recorded as a reporting-boundary issue only. Do not change the GA4 property timezone without a separate explicit configuration decision because it changes day-boundary reporting.

## Thirty-day GA4 baseline

For the 30-day period ending yesterday at capture time:

- 148 page views
- 95 sessions
- 94 first-visit events
- 84 user-engagement events
- 36 Community Website Initiative view events
- 16 community nomination view events
- 22 scroll events
- 2 assessment CTA clicks
- 1 outbound click

Top pages by page views:

1. `/` - 37
2. `/community/websites` - 36
3. `/community/nominate` - 16
4. `/assessments.html` - 15
5. `/operator-brief.html` - 10

The Community Website Initiative is therefore one of the highest-traffic Tayoca surfaces in the captured period.

## Acquisition baseline

Sessions by source and medium:

- direct / none: 55 sessions, 21 engaged sessions
- google / organic: 28 sessions, 0 engaged sessions
- facebook / community_group: 2 sessions, 1 engaged session
- facebook.com / referral: 2 sessions, 1 engaged session
- linkedin / organic_social: 2 sessions, 1 engaged session
- m.facebook.com / referral: 2 sessions, 0 engaged sessions
- email_signature / email: 1 session, 1 engaged session
- facebook / organic_social: 1 session, 0 engaged sessions
- linkedin.com / referral: 1 session, 1 engaged session

The Google organic row is anomalous when compared with Search Console, which reported zero search clicks in the overlapping final-data window. Do not report the 28 GA4 sessions as verified Google Search acquisition until that mismatch is understood.

## Geography baseline

The largest active-user groups in the captured GA4 period were:

- Canada: 45 active users, 47 sessions, 15 engaged sessions
- United States: 34 active users, 35 sessions, 9 engaged sessions

No person-level identity inference should be made from these aggregates.

## Community Website Initiative traffic

The `/community/websites` page recorded 36 page views and 29 active users in the captured period.

Landing-page attribution includes small but real Facebook traffic to this page, including community-group, mobile Facebook referral, and organic-social rows.

The site already emitted `community_google_form_click` and `community_nomination_click` to GA4 through direct `gtag` calls. Those page-specific events did not flow through Tayoca's first-party analytics emitter.

The patch in this change routes the existing community page view and CTA events through `window.TayocaAnalytics.emit` when available, with direct `gtag` as a fallback. This preserves the current event names while adding the same first-party attribution and sanitized context used by the rest of Tayoca's analytics contract.

The patch does not claim that a Google Form click is a submitted application. Application completion remains a separate measurement boundary.

## Google Forms response visibility

The two initiative forms exist in the connected Google Drive:

- Tayoca Community Website Initiative Application
- Tayoca Community Website Initiative - Business Nomination

The Google Forms response API is not currently connected. No submission count is therefore certified in this checkpoint.

Do not infer application count from CTA clicks.

## Search Console

Property:

`https://tayoca.com/`

Permission:

`siteOwner`

Sitemap:

`https://tayoca.com/sitemap.xml`

The sitemap report currently shows 41 submitted URLs, zero indexed in the sitemap aggregate, zero errors, and zero warnings. Direct URL Inspection contradicts the aggregate zero-indexed count for core pages, so the sitemap aggregate must not be used as a site-wide indexing conclusion.

Direct inspection confirms submitted-and-indexed status for:

- `https://tayoca.com/`
- `https://tayoca.com/community/websites`
- `https://tayoca.com/trust.html`
- `https://tayoca.com/assessments.html`
- `https://tayoca.com/blog/`

The withdrawn historical AWS case-study page:

`https://tayoca.com/blog/how-we-saved-216k-on-aws-in-90-days.html`

is correctly excluded by a `noindex` meta tag.

## Search performance baseline

For 2026-08-18 through 2026-09-16, Search Console reported impressions but zero clicks.

Higher-impression pages included:

- `/blog/devops-incident-response-runbook.html`: 29 impressions
- `/products.html`: 23
- `/about.html`: 21
- `/blog/n8n-mcp-kubernetes.html`: 15
- `/blog/gitops-beyond-hello-world.html`: 11
- `/services.html`: 10
- homepage: 8
- `/blog/kubernetes-production-checklist.html`: 8

Current query data is predominantly branded or navigational. The main public-search growth opportunity is therefore not to claim established organic acquisition, but to improve qualified non-branded discovery and click-through while keeping claims evidence-safe.

## External name ambiguity

Public search results also surface an unrelated `www.tayoca.com` entity using the Tayoca name.

Do not treat that external result as a Tayoca-owned property.

Future search work should strengthen entity clarity around the owned `https://tayoca.com/` property rather than attempting to make unsupported ownership claims about the unrelated `www` result.

## Measurement follow-ups

1. Verify the Community Website Initiative CTA events after this patch reaches production.
2. Establish a governed way to count actual Google Form submissions before calling applications a conversion.
3. Investigate the GA4 Google-organic versus Search Console zero-click mismatch.
4. Decide whether the production GA4 timezone should be moved from America/Vancouver to an Ontario-aligned timezone.
5. Keep Search Console direct URL Inspection as the authority for priority-page indexing while sitemap aggregate data is inconsistent.
6. Do not re-enable withdrawn case-study pages merely to increase indexed-page counts.
