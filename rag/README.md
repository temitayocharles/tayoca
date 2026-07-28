# Tayoca Shared RAG

The RAG layer is a shared platform service, not a hidden collection of unrelated workflow memories.

## Corpus domains

- Tayoca identity, positioning, principles, and service boundaries
- Website pages and structured metadata
- Products, resources, offers, and approved pricing information
- Articles, case studies, statistics, and evidence with provenance
- FAQs, objections, contact routes, and escalation guidance
- SEO topic clusters and internal-link relationships
- Dated analytics-derived insights

## Components

- `sources/`: approved source registry
- `schemas/`: document, chunk, and retrieval contracts
- `ingestion/`: Crawlee and repository ingestion specifications
- `evaluation/`: retrieval test questions and expected evidence
- `runbooks/`: refresh, deletion, incident, and rollback procedures

The production vector store must be durable. The n8n simple in-memory vector store is not the production datastore.