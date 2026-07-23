// InsForge edge function: analytics-event
//
// Plausible-compatible event collector for tayoca.com.
// Accepts POST /api/event-style payloads (both the new short-field shape
//   {n,u,d,r,v,p,...} used by plausible.io/js/script.js and the legacy
//   long-field shape {name,url,domain,referrer,...}) and inserts a row into
//   public.analytics_events using the project admin key.
//
// Visitor identification is privacy-preserving: a SHA-256 of the visitor's
// X-Forwarded-For + User-Agent is stored (truncated hex) — no raw IP or UA is
// persisted. Unique-visitor counts on the dashboard are derived from this id.
//
// Success: HTTP 202 with body "ok" (matches Plausible's events API contract so
// the official plausible script.js treats it as success).
//
// Invokable at:
//   POST https://v7mhrspk.function2.insforge.app/analytics-event
//
import { createClient } from 'npm:@insforge/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

const ALLOWED_DOMAINS = new Set(['tayoca.com', 'www.tayoca.com', 'localhost', '127.0.0.1']);

// Plausible payload can use either short or long field names.
function extractEvent(body) {
  const name = body.name || body.n;
  const url = body.url || body.u;
  const domain = body.domain || body.d;
  const referrer = body.referrer || body.r || null;
  const props = body.props || body.p || {};
  const screenWidth = Number(body.screen_width ?? body.w ?? 0) || null;
  const screenHeight = Number(body.screen_height ?? body.h ?? 0) || null;
  return { name, url, domain, referrer, props, screenWidth, screenHeight };
}

function derivePath(urlStr) {
  try {
    const u = new URL(urlStr, 'https://placeholder.invalid');
    return (u.pathname || '/') + (u.search || '');
  } catch {
    return null;
  }
}

function deriveReferrerSource(ref) {
  if (!ref) return null;
  try {
    // External referrer: keep host.
    if (/^https?:\/\//i.test(ref)) return new URL(ref).hostname.replace(/^www\./, '');
    return ref;
  } catch {
    return ref;
  }
}

// SHA-256 hex, truncated to 16 chars (64-bit) — plenty of cardinality for
// unique-visitor counts on a personal site, and irreversible.
async function visitorId(xff, ua) {
  const input = `${xff || ''}||${ua || ''}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  const hex = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 16);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default async function (req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed. Use POST.' }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ errors: { body: ['must be valid JSON'] } }, 400);
  }

  const evt = extractEvent(body || {});
  if (!evt.domain || !evt.name || !evt.url) {
    return json(
      {
        errors: {
          ...(evt.domain ? {} : { domain: ["can't be blank"] }),
          ...(evt.name ? {} : { name: ["can't be blank"] }),
          ...(evt.url ? {} : { url: ["can't be blank"] }),
        },
      },
      400,
    );
  }

  // Domain allow-list prevents third parties from using Boss's collector.
  // Strip leading "www." for the relaxed check; keep raw domain in the row.
  if (!ALLOWED_DOMAINS.has(evt.domain) && !ALLOWED_DOMAINS.has(evt.domain.replace(/^www\./, ''))) {
    return json({ errors: { domain: ['not authorized'] } }, 403);
  }

  // Forwarded visitor identity. Prefer X-Forwarded-For (first hop), fall back
  // to InsForge-facing CF-Connecting-IP, then the request remoteAddr.
  const xff =
    req.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    req.headers.get('CF-Connecting-IP') ||
    '';
  const ua = req.headers.get('User-Agent') || '';

  const vid = await visitorId(xff, ua);

  // Admin client performs the INSERT server-side as a trusted writer
  // (bypasses RLS). This is safer than issuing inserts from the user's anon
  // token, and it lets us keep QPARAMS and derive path/referrer_src server-side.
  const client = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    apiKey: Deno.env.get('API_KEY'),
  });

  const row = {
    domain: evt.domain,
    name: evt.name,
    url: evt.url,
    path: derivePath(evt.url),
    referrer: evt.referrer || null,
    referrer_src: deriveReferrerSource(evt.referrer),
    visitor_id: vid,
    screen_width: evt.screenWidth,
    screen_height: evt.screenHeight,
    qparams: evt.props || {},
  };

  const { error } = await client.database.from('analytics_events').insert([row]);

  if (error) {
    console.error('analytics_events insert failed:', error);
    return json({ errors: { database: [String(error.message || error)] } }, 502);
  }

  // Plausible expects 202 with body "ok" (text/plain).
  return new Response('ok', { status: 202, headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
}
