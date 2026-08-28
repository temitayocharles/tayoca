# The Production Interview

Status: **editorial franchise defined**

## Positioning

A recurring Tayoca content series built around the questions that expose whether someone can reason about production systems rather than repeat definitions.

The series is for mixed experience levels. It uses senior engineering language where appropriate, but explains the mental model and the operational consequence instead of assuming the audience already knows the answer.

## Core format

Every episode/post follows the same structure:

1. **Scenario** — a production-shaped prompt.
2. **The basic answer** — the answer many candidates give.
3. **Why it is incomplete** — the missing operational context.
4. **The production answer** — what a strong engineer reasons through.
5. **What the interviewer is actually testing** — judgment, not trivia.
6. **Evidence** — logs, metrics, exit codes, events, traces, plans, or state that would prove the answer.
7. **Practice bridge** — where relevant, point to the free Debugging AI-Generated DevOps Scripts pack.

## Editorial rules

- No gotcha trivia.
- No fake seniority theater.
- No claim that there is one universal production answer when trade-offs exist.
- Explain terminology in context instead of watering the scenario down.
- Prefer failure modes, constraints, and evidence over memorized commands.
- Keep tool choice subordinate to the engineering decision.
- Separate what is generally true from what depends on a specific platform/version/environment.

## Initial episode bank

### Kubernetes

1. A Deployment says `Available`, but customers still receive 5xx responses. What do you investigate before restarting anything?
2. A rollout stalls with one old replica still serving and one new replica in `ImagePullBackOff`. What does Kubernetes protect you from, and what does it not protect you from?
3. Why can a readiness probe make a deployment safer while also creating an outage when designed badly?
4. Your pod has `CrashLoopBackOff`. What evidence do you collect before changing the manifest?
5. A node is `NotReady`. When is draining correct, and when can it make the incident worse?

### CI/CD

6. A security scan prints a critical finding but the pipeline is green. How can that happen?
7. A deployment job has been running for four hours. What should have bounded it?
8. A retry makes a flaky deployment pass. Why can that be a reliability regression instead of a fix?
9. When should a pipeline fail closed, and when is a warning-only control defensible?

### Python/Bash automation

10. An AI-generated health checker prints errors but exits 0. Where is the contract broken?
11. A cleanup script accepts a directory path from an environment variable. What makes that dangerous even when the path ends in `/build`?
12. A Bash command works on Linux but fails on macOS. What does a production-quality test need to prove?
13. An API inventory script works in staging but silently misses resources in production. What assumptions do you test first?

### Terraform / infrastructure

14. `terraform plan` wants to replace a production resource. What do you inspect before deciding whether the plan is safe?
15. Why is a successful `terraform apply` insufficient evidence that an infrastructure change is production-ready?
16. When is `ignore_changes` a useful boundary, and when does it hide drift you actually need to see?

### Reliability / incident response

17. CPU is normal, memory is normal, latency doubled. What do you investigate next?
18. Error rate is low but one customer is completely broken. Which aggregate dashboards are now misleading you?
19. A rollback fixes the symptom. What evidence do you preserve before declaring the incident resolved?
20. An alert is noisy. What is the difference between muting noise and repairing the signal?

## Lead-magnet bridge

Use the free pack only when the episode naturally concerns generated scripts, automation failure, overreach, evidence, or review discipline.

Default CTA:

> AI can write the script. Can you tell when it will fail or when it's doing too much? Get the free **Debugging AI-Generated DevOps Scripts** practice pack: 10 Python and Bash labs for catching failure, unsafe scope, unbounded behavior, and false success before production.

“Doing too much” is not marketing filler. It means overreach: deletion scope that is too broad, retries or concurrency without a bound, indefinite waits, unexpected state mutation, or any other automation behavior that exceeds the intended operating boundary.

Do not attach this CTA mechanically to every Tayoca piece. The goal is relevant subscriber acquisition, not maximum impressions.

## Repurposing model

One strong scenario can become:

- one long-form video;
- one short clip built around the incomplete answer;
- one LinkedIn post;
- one Operator Brief section;
- one carousel or diagram;
- one interview-question thread;
- one lead-magnet CTA when contextually relevant.

The canonical source should remain the scenario and production reasoning, not a collection of independently improvised posts.
