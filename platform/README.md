# Tayoca Platform

This directory is the source of truth for Tayoca Core and every reusable product capability.

## Architecture rules

1. Products are separate bounded workflows, not disconnected silos.
2. Every workflow is tenant-aware and configuration-driven.
3. Cross-product communication uses the versioned Tayoca event envelope.
4. Credentials and tenant secrets never belong in Git.
5. n8n is the orchestration layer; durable state belongs in the platform data layer.
6. Crawlee supplies approved public-source acquisition and corpus refresh.
7. Dify may be used for controlled AI prototyping, evaluation, and internal tooling.
8. Insforge may provision application services, data resources, tenant environments, and deployment automation.
9. A workflow is not production-ready until its tests, failure policy, observability, consent rules, and rollback instructions are documented.

## Products

- WhatsApp Assistant: conversational entry point and needs-discovery layer.
- Reputation: post-service feedback, recovery, review invitation, and escalation.
- RAG: shared corpus ingestion and retrieval services.

The WhatsApp Assistant and Reputation product are separate workflows. They share identity, tenants, customers, knowledge, events, analytics, and integration adapters through Tayoca Core.