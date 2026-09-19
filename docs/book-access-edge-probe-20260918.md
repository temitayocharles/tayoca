# Tayoca book access edge probe — 2026-09-18

## Purpose

Validate the public edge after the `n8n.tayoca.com` cutover without using application credentials.

## Evidence

GitHub Actions run: `35378141304`  
Job: `105707654571`

Observed from a clean GitHub-hosted runner:

- `GET https://n8n.tayoca.com/healthz` → **200**, body `{"status":"ok"}`.
- Direct request to `https://n8n.tayoca.com/webhook/tayoca/books/access?token=<invalid-64-char-token>` → **403**, `WWW-Authenticate: Basic realm="Webhook"`, body `Authorization data is wrong!`.
- Public route `https://tayoca.com/access/book?token=<invalid-64-char-token>` → the same **403 Basic-auth challenge**.

## Finding

The DNS/tunnel/n8n edge is healthy. The public book-access webhook is currently gated by n8n Webhook Basic Authentication before the entitlement-token validation workflow can execute.

This means the customer-facing `/access/book?token=...` contract is not currently reaching the workflow's fail-closed token-validation branch over anonymous HTTP, even though manual workflow execution has previously proven that branch behaves correctly.

## Required correction

Inspect the active `Tayoca Books | Subscriber Access Gateway v1` Webhook trigger and reconcile its authentication boundary with the intended public entitlement-token contract.

The correction must preserve all downstream token validation and fail-closed behavior. Do not expose protected artifacts or weaken entitlement checks.

After the n8n trigger is corrected, repeat the same clean external probe. The expected negative-path result is the workflow's controlled denial response, not an n8n Basic-auth challenge.

The temporary probe workflow used to collect this evidence was removed after the result was recorded here.


## Resolution update — 2026-09-19

The edge itself was healthy. The unexpected Basic-auth-style 403 was isolated to the Webhook node option `ignoreBots=true` on the book-access workflow. n8n's Webhook implementation rejects recognized bot user agents before normal webhook authentication/flow execution when that option is enabled.

A clean clone of the existing workflow was published as `Tayoca Books | Subscriber Access Gateway v1.1` (`d34GqqLxHunOOYDz`) on `tayoca/books/access-v2`. Removing only `ignoreBots` caused clean external invalid-token requests to reach the intended entitlement deny branch and return `{"ok":false,"error":"access_denied"}` without a Basic challenge.

The stable public route `/access/book` is being cut over separately through the narrow canonical integration change. Reader Pass remains additive and must not replace the existing token contract.
