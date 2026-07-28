# Tayoca Core Architecture

## Shared services

- Tenant registry and configuration
- Customer identity and consent
- Event ledger and idempotency
- Integration adapter registry
- Shared RAG corpus and retrieval contracts
- Conversation and interaction history
- Analytics, audit trails, tracing, and dead-letter handling
- Feature flags and rollout controls

## Product boundaries

### WhatsApp Assistant

Receives inbound conversations, retrieves approved Tayoca knowledge, discovers needs, records interactions, and emits typed events. It does not own review campaigns.

### Reputation

Consumes completed-experience events, schedules consented follow-ups, collects private feedback, routes service recovery, offers public review destinations without review gating, and records campaign outcomes. It does not answer general Tayoca enquiries.

## Communication model

Products communicate through `platform/contracts/event-envelope.schema.json`. Events must carry `event_id`, `event_type`, `tenant_id`, `occurred_at`, `source`, `subject`, and `payload`. Consumers must be idempotent by `event_id`.

## Portability

Workflow exports, schemas, prompts, migrations, fixtures, and runbooks are versioned in this repository. Runtime credentials remain in n8n or the approved secret manager and are referenced by logical credential names.