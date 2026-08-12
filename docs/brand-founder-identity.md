# Tayoca Founder Identity Standard

Status: active

## Primary identity

- Public name: Temitayo Charles
- Full founder name: Temitayo Charles Akinniranye
- Role: Founder, Tayoca
- Business email: temitayo@tayoca.com
- Website: https://tayoca.com/
- Digital business card: https://tayoca.com/temitayo.html
- Location: Ontario, Canada

## Positioning line

Technology Value | Platform Reliability | Agentic Operations

Long-form practice names remain:
- Technology Value & FinOps
- Platform Reliability & DevSecOps
- Agentic Operations & Automation

## Visual system

Use the certified Tayoca public-site palette and typography:
- Background: #0d0d0d
- Surface: #171717
- Accent: #f97316
- Primary text: #e5e5e5
- Muted text: #a3a3a3
- Wordmark: uppercase TAYOCA with wide tracking
- Public-site typography: Sora for display, Inter for body; email fallbacks must use widely supported system fonts.

Do not introduce a parallel founder brand or alternate color system.

## Business card

- North American trim: 3.5 x 2.0 inches
- Print production size: 3.75 x 2.25 inches including 0.125-inch bleed on every edge
- Front: Tayoca wordmark, value statement and three-practice identity
- Back: Temitayo Charles, Founder, Tayoca, email, website, Ontario, Canada and QR contact link
- Do not publish a personal phone number unless explicitly approved.
- QR destination: https://tayoca.com/temitayo.html with business-card campaign attribution.

## Digital business card

The canonical founder contact page is `public/temitayo.html`. It is intentionally `noindex,follow`: it is a contact utility, not a new SEO landing page.

The downloadable contact record is `public/assets/contact/temitayo-charles.vcf`.

## Email signature

Canonical reusable signatures:
- HTML: `public/assets/email/tayoca-founder-signature.html`
- Plain text: `public/assets/email/tayoca-founder-signature.txt`

The HTML signature uses inline styles and does not depend on a remote logo image or tracking pixel, so the identity remains legible when email clients block images.

Standard signature text:

Temitayo Charles  
Founder, Tayoca  
Technology Value | Platform Reliability | Agentic Operations  
temitayo@tayoca.com | tayoca.com  
Ontario, Canada

## Sender policy

Founder-led business communication should use:

From: `Temitayo Charles | Tayoca <temitayo@tayoca.com>`  
Reply-To: `temitayo@tayoca.com`

Replies route through Cloudflare Email Routing to the primary Yahoo inbox. Resend remains the authenticated outbound sender for governed Tayoca sends.

## Analytics

Business-card QR traffic uses:
- `utm_source=business_card`
- `utm_medium=qr`
- `utm_campaign=founder_identity`

The visible website text remains clean (`tayoca.com` / `tayoca.com/temitayo`); attribution stays in the QR target.

Email-signature website links use equivalent `email_signature` source attribution while displaying only `tayoca.com`.
