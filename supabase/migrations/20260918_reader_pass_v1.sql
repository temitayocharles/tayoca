-- Tayoca Reader Pass v1
-- Run in the production Postgres/Supabase database after review.
create extension if not exists pgcrypto;

create table if not exists reader_passes (
  id uuid primary key default gen_random_uuid(),
  pass_hash text not null unique,
  pass_hint text not null,
  status text not null default 'active' check (status in ('active','revoked','suspended')),
  max_devices smallint not null default 2 check (max_devices between 1 and 5),
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create table if not exists reader_entitlements (
  id uuid primary key default gen_random_uuid(),
  reader_pass_id uuid not null references reader_passes(id) on delete cascade,
  product_slug text not null,
  edition text not null,
  source text not null check (source in ('gumroad','paperback','admin')),
  source_reference_hash text,
  status text not null default 'active' check (status in ('active','revoked')),
  created_at timestamptz not null default now(),
  unique(reader_pass_id, product_slug, edition)
);

create table if not exists reader_devices (
  id uuid primary key default gen_random_uuid(),
  reader_pass_id uuid not null references reader_passes(id) on delete cascade,
  device_hash text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique(reader_pass_id, device_hash)
);

create table if not exists reader_access_events (
  id bigserial primary key,
  reader_pass_id uuid references reader_passes(id) on delete set null,
  product_slug text,
  event_type text not null,
  ip_hash text,
  device_hash text,
  created_at timestamptz not null default now()
);
create index if not exists reader_access_events_pass_time_idx on reader_access_events(reader_pass_id, created_at desc);
create index if not exists reader_entitlements_product_idx on reader_entitlements(product_slug, edition, status);
create unique index if not exists reader_entitlements_source_ref_uq
  on reader_entitlements(source, source_reference_hash)
  where source_reference_hash is not null;

alter table reader_passes enable row level security;
alter table reader_entitlements enable row level security;
alter table reader_devices enable row level security;
alter table reader_access_events enable row level security;
-- No public policies. Reader-pass APIs use server-side service credentials only.
