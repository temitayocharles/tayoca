// Environment variables are set at deploy time
// Expected: STRIPE_PAYMENT_LINK=https://buy.stripe.com/test_...

/** @type {import('@cloudflare/workers-types').PagesFunction} */
export const onRequestPost = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Only accept POST to a specific endpoint
  if (request.method !== 'POST' && url.pathname !== '/book-finops-5k') {
    return new Response(null, { status: 404 });
  }

  try {
    const form = await request.formData();
    const email = form.get('email');
    const fullName = form.get('fullName');
    const company = form.get('company');

    // Minimal validation
    if (!email || !fullName) {
      return new Response(JSON.stringify({ error: 'Email and full name are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // You would typically:
    // 1. Store the lead/booking in a DB (e.g. Supabase, D1, Notion)
    // 2. Send a confirmation email via Resend/Gmail
    // 3. Trigger fulfillment (schedule calendar, etc)

    // For now: redirect to the Stripe payment link to finalize payment
    const stripeLink = env?.STRIPE_PAYMENT_LINK;
    if (!stripeLink) {
      // Fallback URL for local testing
      return new Response(JSON.stringify({ error: 'Billing is temporarily unavailable; please contact support.', nextSteps: 'admin@tayoca.com' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Redirect to finalize payment
    return new Response(JSON.stringify({ success: true, redirectUrl: stripeLink }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Unexpected error. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};