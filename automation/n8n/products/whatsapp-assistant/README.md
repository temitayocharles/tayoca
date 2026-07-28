# WhatsApp Assistant

## Responsibility

Conversational Tayoca entry point. It receives inbound WhatsApp text, normalizes the message, generates one concise response, and sends it through the configured WhatsApp identity.

## Boundary

It does not schedule reputation campaigns, scrape patrons, own customer consent, or perform service-recovery workflows. When it identifies a reputation need, it may emit a typed Tayoca event for the Reputation product.

## Runtime

- n8n workflow ID: `GnOCF3gFqMqM6UxF`
- State: inactive
- Model route: `openrouter/free`
- RAG: not yet attached
- WhatsApp sender: must be confirmed before activation

The sanitized export deliberately omits credential bindings and production sender identifiers.