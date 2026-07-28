create extension if not exists pgcrypto;

create table if not exists tayoca_tenants (
  id text primary key,
  name text not null,
  status text not null default 'inactive' check (status in ('inactive','active','suspended')),
  timezone text not null default 'America/Toronto',
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists tayoca_customers (
  id text primary key,
  tenant_id text not null references tayoca_tenants(id),
  external_id text,
  first_name text,
  email text,
  phone text,
  consent jsonb not null default '{}'::jsonb,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, external_id)
);

create table if not exists tayoca_events (
  event_id text primary key,
  schema_version text not null,
  event_type text not null,
  tenant_id text not null references tayoca_tenants(id),
  occurred_at timestamptz not null,
  source text not null,
  subject jsonb not null,
  payload jsonb not null,
  metadata jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now(),
  processing_status text not null default 'pending'
);

create index if not exists tayoca_events_tenant_type_time_idx on tayoca_events (tenant_id, event_type, occurred_at desc);

create table if not exists reputation_campaigns (
  id text primary key,
  tenant_id text not null references tayoca_tenants(id),
  customer_id text not null references tayoca_customers(id),
  source_event_id text not null references tayoca_events(event_id),
  status text not null check (status in ('planned','active','responded','escalated','completed','suppressed','cancelled')),
  channel text,
  plan jsonb not null,
  next_action_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, source_event_id)
);

create table if not exists reputation_interactions (
  id uuid primary key default gen_random_uuid(),
  campaign_id text not null references reputation_campaigns(id),
  direction text not null check (direction in ('outbound','inbound','internal')),
  channel text not null,
  interaction_type text not null,
  content text,
  sentiment text,
  provider_message_id text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists reputation_campaigns_due_idx on reputation_campaigns (status, next_action_at) where status in ('planned','active');