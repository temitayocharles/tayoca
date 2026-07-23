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

function hashVisitorId(ip: string, ua: string): string {
  const data = `${ip}|${ua}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

function parseReferrerSource(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return null;
  }
}

export default async function (req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
  const apiKey = Deno.env.get('API_KEY');

  if (!baseUrl || !apiKey) {
    console.error('Missing InsForge credentials');
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }

  const admin = createAdminClient({ baseUrl, apiKey });

  try {
    const body = await req.json();

    const {
      domain,
      name = 'pageview',
      url,
      path,
      referrer = null,
      referrer_src = null,
      screen_width = null,
      screen_height = null,
      props = {},
    } = body;

    if (!domain || !name || !url) {
      return jsonResponse({ error: 'Missing required fields: domain, name, url' }, 400);
    }

    const forwardedFor = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const visitorId = hashVisitorId(forwardedFor, userAgent);

    let derivedPath = path;
    if (!derivedPath) {
      try {
        const urlObj = new URL(url);
        derivedPath = urlObj.pathname;
      } catch {
        derivedPath = '/';
      }
    }

    const derivedReferrerSrc = referrer_src || parseReferrerSource(referrer);

    const { error } = await admin.database.from('analytics_events').insert({
      domain,
      name,
      url,
      path: derivedPath,
      referrer,
      referrer_src: derivedReferrerSrc,
      visitor_id: visitorId,
      screen_width,
      screen_height,
      qparams: props,
    });

    if (error) {
      console.error('Insert error:', error);
      return jsonResponse({ error: 'Failed to record event' }, 500);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    console.error('Function error:', err);
    return jsonResponse({ error: 'Invalid request' }, 400);
  }
}