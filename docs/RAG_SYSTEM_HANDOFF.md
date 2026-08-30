# Tayoca RAG System Handoff

**Status:** `WAITING_FOR_RAG_SYSTEM_P6_P8_PRODUCTION_CERTIFICATION`

**Ownership:** The central `rag-system` rollout is owned by the separate RAG workstream. Tayoca must not create a parallel vector database, Supabase store, alternate embedding estate, or a second RAG control plane while that rollout is incomplete.

## Current safe state

Tayoca remains operational without the central RAG runtime. Live operational truth continues to come from deterministic first-party sources such as Brand Intelligence, Growth OS and Repository Intelligence. Stable organization knowledge may continue to use the existing bounded repository-grounded evidence bridge. If governed RAG is unavailable, Tayoca must fail closed or use that bounded evidence path rather than inventing an alternate knowledge store.

No Tayoca workflow should be switched to the central RAG API/MCP until the `rag-system` workstream has completed and certified its P6/P8 production rollout.

## Cutover contract

The RAG workstream may wire Tayoca only after all of the following are true:

1. **Production identity and transport**
   - A production API and/or MCP endpoint is published.
   - Service authentication is documented and tested.
   - Secrets are supplied through the approved runtime secret mechanism, never committed into Tayoca.

2. **Immutable production release**
   - The deployed RAG version is traceable to an immutable artifact/revision.
   - Registry/authentication/publication gates required by `rag-system` are complete.
   - Health and readiness checks pass from the Tayoca runtime boundary.

3. **Tayoca source boundary**
   - Tayoca retrieval is scoped to approved canonical sources.
   - Canonical Forgejo remains the repository authority; GitHub remains downstream evidence/mirror where applicable.
   - Source/version/freshness metadata is returned with retrieval results.
   - The RAG system must not silently ingest or elevate unapproved conversational memory into canonical Tayoca knowledge.

4. **Query contract**
   - Input supports a user/query plus an explicit Tayoca namespace or equivalent bounded scope.
   - Output provides an answer/evidence payload with source references sufficient to identify the supporting canonical material.
   - Errors distinguish authentication, unavailable index/source, timeout and no-evidence conditions.
   - No-evidence is a valid fail-closed result; it must not be converted into an invented answer.

5. **Authorization remains outside the LLM**
   - Existing owner-query workflows continue to enforce owner identity independently of model output.
   - RAG integration does not weaken WhatsApp/owner authorization boundaries.

6. **Read-only knowledge boundary**
   - The RAG query path may read, retrieve, summarize and recommend.
   - It must not directly publish content, contact customers, spend money, mutate production/security configuration, approve reviews, alter Growth OS state or perform other consequential actions.
   - Consequential actions remain separate governed workflows with their existing approval controls.

7. **Failure and rollback behavior**
   - Authentication failure, timeout, source/index failure or malformed RAG output must fail closed.
   - Where appropriate, Tayoca may fall back to its current bounded repository-grounded evidence bridge; otherwise return unavailable/no-evidence.
   - Cutover must be reversible by changing only the knowledge-bridge/tool binding. Brand Intelligence, Repository Intelligence, Growth OS and other first-party operational systems must not be migrated as part of the RAG cutover.

## Acceptance tests required before cutover

The RAG workstream must record evidence for:

- authenticated health/readiness from the Tayoca execution boundary;
- known-answer evaluation using `rag/evaluation/core-questions.yaml` plus any current governed Tayoca evaluation set;
- source-reference/citation integrity;
- namespace isolation and unauthorized-scope rejection;
- stale-source behavior and freshness metadata;
- no-evidence behavior;
- timeout/unavailable behavior;
- secret/token leakage checks;
- latency appropriate to the owner-query interaction;
- rollback to the existing bounded evidence bridge.

## Tayoca wiring rule

When the RAG workstream is certified, modify only the Tayoca stable-knowledge bridge/tool binding used by the owner conversational agent. Do **not** replace or merge the following with RAG:

- Brand Intelligence live snapshot and owner-query logic;
- Repository Intelligence estate query/owner query;
- Growth OS operational ledgers and reporting;
- Project Intelligence;
- Operator Brief editorial/approval state;
- subscriber entitlements, Trust/reviews or product delivery state.

Those systems remain authoritative for their own domains.

## Completion evidence to append

At RAG cutover, append a short certification record to this document or a sibling evidence file containing:

- certified `rag-system` release/revision;
- production endpoint/interface identifier (no secrets);
- authentication method name;
- Tayoca integration workflow/tool identifier and version;
- acceptance-test result;
- rollback target;
- canonical Tayoca `main` SHA used as the integration baseline.

Until that evidence exists, the correct Tayoca state is **WAITING**, not partially migrated.
