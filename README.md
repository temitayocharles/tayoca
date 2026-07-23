# Tayoca-www
Website for tayoca.com services.

## Cloud Functions
- `/functions/finops-5k-book.js` – Pages Function handler for the $5,000 FinOps Audit booking form. POSTs to `/book-finops-5k` to redirect to Stripe payment link after collecting lead info.

## Stripe Payment Link Instructions
1. Sign in to Stripe Dashboard: https://dashboard.stripe.com/payment-links
2. Click **New Payment Link**
3. Set item name: `Cloud FinOps Audit - Flat Fee`
4. Set price: **$5,000.00 USD** (with optional tax)
5. Optionally add Success and Cancel webhook URLs if needed
6. Copy the **live** payment link URL (e.g., `https://buy.stripe.com/...`)

## Environment Setup
Set the environment variable `STRIPE_PAYMENT_LINK` to this URL during Pages deployment:
```bash
# Set in Cloudflare Pages dashboard UI under Functions → Environment Variables
STRIPE_PAYMENT_LINK="https://buy.stripe.com/..."
```

## Local Development
- Install Wrangler if not already: `npm install -g wrangler`
- Start a local Pages dev server with functions:
```bash
npx wrangler pages dev --functions ./functions
```
- Test the endpoint: `curl -X POST http://localhost:8787/book-finops-5k -F email=you@example.com -F fullName="Your Name" -F company="Your Co"`

## How It Works
- User clicks "Book & Pay" on the FinOps card in services.html
- UI prompts them to proceed to the Stripe payment link
- After payment (or cancellation), redirect back to your site as configured in Stripe

## Notes
- No JavaScript build step is needed for this static site.
- Replace `STRIPE_PAYMENT_LINK` with the real URL once created in Stripe.
- The function currently returns a redirectUrl JSON response; you can also implement a Stripe webhook listener to handle checkout.session.completed events for fulfillment.
