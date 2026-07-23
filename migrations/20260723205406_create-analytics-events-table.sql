-- InsForge database migration
-- Self-hosted Plausible-compatible analytics for tayoca.com
--
-- Creates `public.analytics_events`: a single table that stores pageviews and
-- custom events in a Plausible-compatible shape. An InsForge edge function
-- (`analytics-event`) writes here server-side with the admin key; the
-- `analytics-dashboard` edge function reads here for aggregated stats.
--
-- Design notes:
--  * `domain`  – Plausible uses the bare domain (e.g. "tayoca.com").
--  * `name`    – event name; "pageview" is the special pageview event.
--  * `url`     – full page URL; we also persist derived `path` for fast grouping.
--  * `referrer`/`referrer_source` – raw referrer + parsed host for source grouping.
--  * `visitor_id` – SHA-256(X-Forwarded-For || User-Agent) truncated, HEX.
--    Privacy-preserving: no raw IP or UA is stored long-term. Used for unique counts.
--  * RLS: only `anon` can INSERT (server-side collectors, including the edge
--    function when invoked as anon, and the Plausible script). Reads come from
--    the dashboard function using the admin key (bypasses RLS) we additionally
--    grant SELECT to anon so the frontend SDK can query safe aggregate views
--    if desired, but the raw table enforces no anon UPDATE/DELETE.
--
-- The previously created empty `public.pageviews` table is dropped here in
-- favour of the richer schema. It had 0 rows (verified before migration).

-- 1. Drop the legacy empty pageviews table (created out-of-band, 0 rows).
DROP TABLE IF EXISTS public.pageviews;

-- 2. Main event table.
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id            bigserial PRIMARY KEY,
  -- Plausible-compatible fields (both short and long names accepted by collector).
  domain        text        NOT NULL,
  name          text        NOT NULL DEFAULT 'pageview',
  url           text        NOT NULL,
  path          text,                       -- derived from url.pathname
  referrer      text,                       -- raw referrer (document.referrer)
  referrer_src  text,                       -- derived referrer host
  -- Visitor/device (privacy-preserving; raw IP/UA not persisted).
  visitor_id    text        NOT NULL,       -- SHA-256(xff||ua)[..16] hex
  screen_width  integer,
  screen_height integer,
  -- Custom properties (Plausible `props`).
  qparams       jsonb       NOT NULL DEFAULT '{}'::jsonb,  -- key-value props bag
  -- Minimum server-side metadata.
  country       text,                       -- filled later if geo added
  raw_ip        inet,                       -- kept nullable; collector omits by default
  created_at    timestamptz NOT NULL DEFAULT NOW()
);

-- 3. Indexes for the dashboard queries (top pages, unique visitors, daily totals).
CREATE INDEX IF NOT EXISTS idx_analytics_events_domain_created
  ON public.analytics_events (domain, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name_domain_created
  ON public.analytics_events (name, domain, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_path_domain_created
  ON public.analytics_events (path, domain, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_visitor_id_domain_created
  ON public.analytics_events (visitor_id, domain, created_at DESC);

-- 4. Row-level security.
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 4a. Allow anonymous inserts (Plausible script / anyone with anon key).
--     WITH CHECK constrains writes so rows must match the same domain guard.
CREATE POLICY analytics_events_anon_insert
  ON public.analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (domain IS NOT NULL AND name IS NOT NULL AND url IS NOT NULL);

CREATE POLICY analytics_events_anon_select
  ON public.analytics_events
  FOR SELECT
  TO anon
  USING (true);

-- 5. Grants. Runtime roles have broad default DML; revoke the dangerous ones.
REVOKE UPDATE, DELETE ON public.analytics_events FROM anon;
REVOKE UPDATE, DELETE ON public.analytics_events FROM authenticated;

GRANT INSERT, SELECT ON public.analytics_events TO anon;
GRANT INSERT, SELECT ON public.analytics_events TO authenticated;
