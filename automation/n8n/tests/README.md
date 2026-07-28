# n8n workflow tests

Every committed workflow must be validated by the n8n Workflow SDK and executed with deterministic test data before publication.

Current verified executions:

- Reputation Planning Kernel: `31305`
- Tayoca Core Event Ingress Kernel: `31309`
- Reputation Due Campaign Scheduler: `31312`

Production publication is prohibited until persistence, consent enforcement, sender identity, delivery adapters, and inbound-response correlation are connected and verified.
