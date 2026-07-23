import { createAdminClient } from 'npm:@insforge/sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status = 400, details?: any) {
  return jsonResponse({ error: { message, details }, status }, status);
}

export default async function (req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return errorResponse('Method not allowed', 405);
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/+/, '');
  const segments = path.split('/').filter(Boolean);
  const params = url.searchParams;

  // The function slug is stripped by the platform, so segments[0] is the endpoint
  // e.g., /analytics-dashboard/pages -> function receives /pages -> segments = ['pages']
  const endpoint = segments[0] || 'overview';
  console.log('DEBUG: segments:', segments, 'endpoint:', endpoint);

  const admin = createAdminClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    apiKey: Deno.env.get('API_KEY'),
  });

  try {
    // GET /analytics-dashboard/overview — overview stats
    if (endpoint === 'overview') {
      const domain = params.get('domain') || 'tayoca.com';
      const days = Math.min(parseInt(params.get('days') || '30'), 90);

      const since = new Date(Date.now() - days * 86400000).toISOString();

      // Total pageviews
      const { data: totalPv, count: pvCount } = await admin.database
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since);

      // Unique visitors (distinct visitor_id)
      const { data: uniqueVisitors } = await admin.database
        .from('analytics_events')
        .select('visitor_id')
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since);

      const uniqueCount = new Set(uniqueVisitors?.map(v => v.visitor_id) || []).size;

      // Top pages
      const { data: topPages } = await admin.database
        .from('analytics_events')
        .select('path')
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since);

      const pageCounts: Record<string, number> = {};
      topPages?.forEach(p => { pageCounts[p.path || '/'] = (pageCounts[p.path || '/'] || 0) + 1; });
      const sortedPages = Object.entries(pageCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([path, count]) => ({ path, count }));

      // Top referrers
      const { data: topReferrers } = await admin.database
        .from('analytics_events')
        .select('referrer_src')
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since)
        .not('referrer_src', 'is', null);

      const refCounts: Record<string, number> = {};
      topReferrers?.forEach(r => { refCounts[r.referrer_src] = (refCounts[r.referrer_src] || 0) + 1; });
      const sortedRefs = Object.entries(refCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([referrer_src, count]) => ({ referrer_src, count }));

      // Daily totals for chart
      const { data: dailyData } = await admin.database
        .from('analytics_events')
        .select('created_at')
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since);

      const dailyCounts: Record<string, number> = {};
      dailyData?.forEach(d => {
        const day = d.created_at.split('T')[0];
        dailyCounts[day] = (dailyCounts[day] || 0) + 1;
      });
      const dailySeries = Object.entries(dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));

      return jsonResponse({
        domain,
        period_days: days,
        total_pageviews: pvCount || 0,
        unique_visitors: uniqueCount,
        top_pages: sortedPages,
        top_referrers: sortedRefs,
        daily_series: dailySeries,
      });
    }

    // GET /analytics-dashboard/pages — paginated page list
    if (endpoint === 'pages') {
      const domain = params.get('domain') || 'tayoca.com';
      const days = Math.min(parseInt(params.get('days') || '30'), 90);
      const page = Math.max(parseInt(params.get('page') || '1'), 1);
      const limit = Math.min(parseInt(params.get('limit') || '50'), 200);
      const since = new Date(Date.now() - days * 86400000).toISOString();

      const { data: pages } = await admin.database
        .from('analytics_events')
        .select('path')
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since);

      const pageCounts: Record<string, number> = {};
      pages?.forEach(p => { pageCounts[p.path || '/'] = (pageCounts[p.path || '/'] || 0) + 1; });

      const sorted = Object.entries(pageCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([path, count]) => ({ path, count }));

      const start = (page - 1) * limit;
      const paginated = sorted.slice(start, start + limit);

      return jsonResponse({
        domain,
        period_days: days,
        total: sorted.length,
        page,
        limit,
        pages: Math.ceil(sorted.length / limit),
        items: paginated,
      });
    }

    // GET /analytics-dashboard/referrers — paginated referrer list
    if (endpoint === 'referrers') {
      const domain = params.get('domain') || 'tayoca.com';
      const days = Math.min(parseInt(params.get('days') || '30'), 90);
      const page = Math.max(parseInt(params.get('page') || '1'), 1);
      const limit = Math.min(parseInt(params.get('limit') || '50'), 200);
      const since = new Date(Date.now() - days * 86400000).toISOString();

      const { data: refs } = await admin.database
        .from('analytics_events')
        .select('referrer_src')
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since)
        .not('referrer_src', 'is', null);

      const refCounts: Record<string, number> = {};
      refs?.forEach(r => { refCounts[r.referrer_src] = (refCounts[r.referrer_src] || 0) + 1; });

      const sorted = Object.entries(refCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([referrer_src, count]) => ({ referrer_src, count }));

      const start = (page - 1) * limit;
      const paginated = sorted.slice(start, start + limit);

      return jsonResponse({
        domain,
        period_days: days,
        total: sorted.length,
        page,
        limit,
        pages: Math.ceil(sorted.length / limit),
        items: paginated,
      });
    }

    // GET /analytics-dashboard/realtime — last 5 minutes
    if (endpoint === 'realtime') {
      const domain = params.get('domain') || 'tayoca.com';
      const minutes = Math.min(parseInt(params.get('minutes') || '5'), 60);
      const since = new Date(Date.now() - minutes * 60000).toISOString();

      const { data: events } = await admin.database
        .from('analytics_events')
        .select('path, referrer_src, created_at')
        .eq('domain', domain)
        .eq('name', 'pageview')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(100);

      const recent = events?.map(e => ({
        path: e.path || '/',
        referrer: e.referrer_src,
        time: e.created_at,
      })) || [];

      const activeVisitors = new Set(events?.map(e => e.visitor_id) || []).size;

      return jsonResponse({
        domain,
        window_minutes: minutes,
        active_visitors: activeVisitors,
        recent_events: recent,
      });
    }

    return errorResponse('Not found', 404);
  } catch (err) {
    console.error('Dashboard error:', err);
    return errorResponse('Internal error', 500, err.message);
  }
}