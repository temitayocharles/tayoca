# Tayoca Developer Authority Wave 1

Campaign: `tayoca_20260918_developer_authority_wave1`

Status: ready for owner review

This wave expands Tayoca beyond LinkedIn into developer-native channels. It does not authorize public distribution by itself.

## Channel strategy

The first developer-authority wave uses two active channels:

- DEV Community for substantial technical articles
- Reddit for discussion-first community participation

Upload-Post profile `tayoca-main` exists and is reserved as a future multi-platform distribution surface. No social destinations are connected to it yet.

Hashnode is authenticated but has no standard publication attached.

X is connected under a non-Tayoca identity and remains unsuitable for Tayoca distribution until the identity is corrected.

Beehiiv is deferred.

LinkedIn company-page distribution remains blocked by LinkedIn Community Management API review.

## DEV Community drafts

### 1. AI publication governance

DEV draft ID: `4686488`

Title:
Giving AI Access to Evidence Is Not the Same as Giving It Authority to Publish

Status:
unpublished

Verified reading time:
4 minutes

Purpose:
Explain access versus publication authority, evidence verification, disclosure classification, human approval, fail-closed publication and correction history.

CTA:
https://tayoca.com/trust.html

### 2. Evidence-led technology value

DEV draft ID: `4686487`

Title:
Technology Value Starts With an Explicit Operating Problem

Status:
unpublished

Verified reading time:
4 minutes

Purpose:
Explain the operating model of diagnosing the problem, establishing evidence, bounding the intervention, implementing the smallest useful change and verifying the result.

CTA:
https://tayoca.com/assessments.html

### 3. Kubernetes production readiness

DEV draft ID: `4686490`

Title:
Production Readiness Is Easier to Inspect Than to Debate

Status:
unpublished

Verified reading time:
4 minutes

Purpose:
Turn production readiness into inspectable controls across workload resilience, resources, deployment safety, observability, recovery, security and ownership.

The verified 150-control package claim is retained. The article explicitly states that a checklist does not make a cluster reliable by itself.

## Reddit market evidence

Read-only Reddit research on 2026-09-18 found concrete discussion demand:

- r/kubernetes: a Kubernetes production-readiness checklist thread scored 134 with 12 comments.
- r/devops: a production-readiness gate discussion scored 21 with 18 comments.
- r/kubernetes: a Kubernetes optimization approval-workflow discussion had 26 comments.
- r/FinOps: multiple recent Kubernetes cost-optimization discussions were active.
- r/OnCall and r/devops contained current incident-runbook and production-gate discussions.

These signals are used only to choose useful discussion topics. They do not authorize spam, automated promotion or rule-breaking.

## Reddit discussion packages

### Kubernetes production readiness

Prompt:
What belongs in a production-readiness review beyond replicas, probes and resource limits?

Distribution rule:
Text-first discussion. No product link in the initial post. Review the target subreddit's current rules before submission.

### FinOps approval boundaries

Prompt:
Where should a Kubernetes cost-optimization system stop and ask for approval?

Distribution rule:
Discussion-first. No internal Tayoca FinOps implementation details. No product link in the initial post.

### Incident runbooks

Prompt:
What makes an incident runbook useful when the incident does not match the happy path?

Distribution rule:
Experiential and non-promotional. No product link in the initial post.

## Governance

All six packages are recorded in Growth OS as `ready_for_owner_review`.

Before DEV publication:

1. Owner explicitly approves the developer-authority wave or the specific article.
2. Article remains within the verified evidence boundary.
3. No em dash punctuation appears.
4. Any AI-assistance disclosure required by the destination is handled accurately.
5. Final link and publication ID are written back to Growth OS.

Before Reddit publication:

1. Owner approval exists.
2. Current subreddit rules are checked immediately before submission.
3. The post is discussion-first and useful without requiring a click.
4. No promotional link is included unless community rules and context support it.
5. No private or sensitive Tayoca implementation detail is introduced.
6. Publication URL is written back to Growth OS.

No item in this file is public distribution authorization by itself.


## Reddit rule reconciliation

Current rules were re-read directly from Reddit before owner review.

### r/kubernetes

The community requires substantive discussion value, rejects low-effort and obvious AI-generated content, prohibits selling, requires commercial affiliation to be disclosed, and removes click-farming or weak promotional posts.

The Kubernetes package was revised accordingly. It is self-contained, includes a Tayoca affiliation disclosure and contains no product or sales link.

### r/FinOps

The API currently exposes a minimal formal rule set, including a no-flair rule. The FinOps package remains technical, self-contained and contains no product link or internal Tayoca implementation details.

### r/OnCall

The Reddit API currently returns no explicit community-specific rules. The incident-runbook package therefore remains self-contained and non-promotional, with a mandatory rule re-check immediately before submission.

## DEV AI-assistance disclosure

DEV currently reports the three drafts as `ai_disclosure_level=not_disclosed` and warns that the field should be explicitly set.

The available Composio DEV action does not expose the AI-disclosure field. Therefore publication must remain blocked until the DEV destination accurately records the applicable AI-assistance disclosure through a supported UI or API path.

This is a destination metadata gate, not a content-evidence defect.


## Distribution outcome

Owner approval was granted on 2026-09-18 and recorded in Growth OS.

### Published Reddit discussions

Kubernetes production readiness:
https://www.reddit.com/r/kubernetes/comments/1wjvocv/what_productionreadiness_controls_have_caught/

FinOps approval boundaries:
https://www.reddit.com/r/FinOps/comments/1wjvp28/where_should_a_kubernetes_costoptimization_system/

Incident runbooks:
https://www.reddit.com/r/OnCall/comments/1wjvopl/what_makes_an_incident_runbook_useful_when_the/

All three were submitted as self-contained discussion posts with transparent Tayoca affiliation and no product link.

The r/FinOps submission initially failed because flair was mandatory. It was retried once using the subreddit-provided self-promotion/vendor flair and then published successfully.

### DEV status

The three DEV articles remain unpublished.

A direct attempt to pass `ai_disclosure_level: some_ai` through the current DEV connector was ignored by the connector. The returned article remained `not_disclosed`.

Issue #165 tracks this destination metadata gap.

No DEV article is authorized to bypass the structured disclosure requirement.
