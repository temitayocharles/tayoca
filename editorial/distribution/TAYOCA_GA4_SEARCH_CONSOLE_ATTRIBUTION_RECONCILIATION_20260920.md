# Tayoca GA4 / Search Console Attribution Reconciliation

Date: 2026-09-20

Window compared: 2026-08-18 through 2026-09-16

## Question

GA4 attributed 28 sessions to `google / organic`, while Google Search Console recorded zero clicks for the same Tayoca URL-prefix property and overlapping final-data window.

Those two numbers must not be presented as equivalent evidence of Google Search acquisition.

## Search Console evidence

Property: `https://tayoca.com/`

For the exact window:

- clicks: 0
- impressions: 126
- CTR: 0
- average position: 15.96

Search Console page rows show impressions across the homepage, About, Services, Products, blog articles and other Tayoca pages, but every row has zero clicks.

## GA4 evidence

Property: `properties/548373018`

Filter: `sessionSourceMedium = google / organic`

GA4 reports 28 sessions spread across 18 landing pages. All resolved to host `tayoca.com`.

Characteristics of the entire 28-session slice:

- device category: desktop
- browser: Chrome
- country: Canada
- sessions: 28
- active users: 28 across the landing-page rows
- engaged sessions: 0
- engagement rate: 0
- screen/page views: 28
- average session duration: about 0.116 seconds

That is effectively one page view per session with no engagement and near-zero duration.

## Interpretation

The GA4 slice does not behave like verified search traffic, and Search Console records no search clicks in the same final-data window.

The evidence is consistent with automated or otherwise non-engaged visits being attributed by GA4 to `google / organic`, or another source-classification artifact. This is an evidence-based explanation, not a claim that a specific bot or crawler has been identified.

## Reporting rule

Until Search Console records clicks or a stronger independent acquisition signal exists:

- do not report the 28 GA4 sessions as verified Google Search visits
- keep Search Console clicks as the primary search-acquisition evidence
- GA4 `google / organic` can remain visible as an attribution anomaly, not a validated acquisition KPI
- do not optimize content based on the apparent 28-session count alone

## Related configuration note

GA4 still reports using `America/Vancouver` while the operating program is Ontario-based. Issue #187 tracks the desired timezone correction. The connected Analytics OAuth scopes currently permit reads but reject property updates, so the reporting timezone has not been changed.
