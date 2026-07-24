import { createAdminClient } from 'npm:@insforge/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

interface NewsletterSubscribeRequest {
  email: string;
}

export default async function (req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed. Use POST.' }, 405);
  }

  const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
  const apiKey = Deno.env.get('API_KEY');

  if (!baseUrl || !apiKey) {
    console.error('Missing InsForge credentials');
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }

  const admin = createAdminClient({ baseUrl, apiKey });

  try {
    const body: NewsletterSubscribeRequest = await req.json();

    const { email } = body;

    if (!email || typeof email !== 'string') {
      return jsonResponse({ error: 'Email is required.' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ error: 'Please provide a valid email address.' }, 400);
    }

    // Insert subscriber into database using InsForge SDK (existing nl_subscribers table)
    const { data, error } = await admin.database
      .from('nl_subscribers')
      .insert([{
        email: email.trim().toLowerCase(),
        name: email.split('@')[0],
        is_active: true,
        is_verified: false,
        subscribed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      // Handle duplicate email gracefully
      if (error.code === '23505') { // Unique constraint violation
        return jsonResponse({
          success: true,
          message: 'Email already subscribed!',
          email: email
        }, 200);
      }

      console.error('Database error:', error);
      return jsonResponse({
        error: 'Failed to subscribe to newsletter.',
        details: error.message
      }, 502);
    }

    // Success! Return success response
    return jsonResponse({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      email: email
    }, 200);

  } catch (error) {
    console.error('Subscription error:', error);
    return jsonResponse({
      error: 'An unexpected error occurred.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500);
  }
}