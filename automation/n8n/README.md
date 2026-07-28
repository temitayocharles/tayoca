# Tayoca n8n Workflows

This directory contains portable, sanitized workflow exports and their operational documentation.

## Layout

- `core/`: shared orchestration contracts and platform adapters
- `products/whatsapp-assistant/`: Tayoca conversational entry point
- `products/reputation/`: reusable customer feedback and reputation product
- `rag/`: corpus ingestion, refresh, retrieval, and evaluation workflows
- `fixtures/`: synthetic test events only

## Rules

- Never commit credential IDs, API keys, access tokens, customer PII, webhook secrets, or production phone numbers.
- Runtime workflows may bind logical credential names after import.
- Every workflow export must have a matching README describing triggers, inputs, outputs, dependencies, failure handling, and activation status.
- Product workflows communicate using the event-envelope contract; they do not call each other through undocumented payloads.

## Current n8n workflows

- WhatsApp Assistant: `GnOCF3gFqMqM6UxF`, inactive while sender identity and RAG retrieval are finalized.
- Reputation Planning Kernel: `XbDHeVK66snphcYV`, tested successfully and intentionally inactive.