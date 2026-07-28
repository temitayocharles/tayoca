# Tayoca Reputation

## Product purpose

A reusable, tenant-aware post-experience system for collecting private customer feedback, initiating service recovery, and requesting honest public reviews without fabrication or review gating.

## Workflow state

- Planning Kernel workflow ID: `XbDHeVK66snphcYV`
- Validation execution: `31305`
- State: inactive

## Implemented

- Required event-field validation
- Tenant configuration validation
- Contact-channel selection based on explicit consent
- Configurable initial delay and reminder interval
- Maximum of three attempts
- Deterministic campaign plan IDs
- Suppression when no consented channel exists
- Explicit review-policy controls

## Remaining production adapters

- Durable event and campaign persistence
- Due-campaign scheduler
- WhatsApp, SMS, and email delivery adapters
- Inbound response correlation
- Sentiment and urgency classification
- Human escalation and service-recovery queue
- Review destination routing
- Analytics and dead-letter processing

These adapters must remain shared and configuration-driven rather than copied for each business.