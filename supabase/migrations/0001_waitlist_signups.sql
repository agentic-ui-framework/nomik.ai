-- Waitlist signups for nomik.ai early-access form.
-- Writes go through the submit-waitlist Edge Function using the service role,
-- so anon/authenticated roles have no access at all. RLS is FORCED so even
-- a future role with table privileges still routes through policies.

create extension if not exists citext;
create extension if not exists pgcrypto;

create table if not exists public.waitlist_signups (
  id          uuid        primary key default gen_random_uuid(),
  email       citext      not null unique,
  source      text        not null default 'nomik.ai/index',
  ip_hash     text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists waitlist_signups_created_at_desc_idx
  on public.waitlist_signups (created_at desc);

create index if not exists waitlist_signups_ip_hash_created_at_idx
  on public.waitlist_signups (ip_hash, created_at desc);

alter table public.waitlist_signups enable row level security;
alter table public.waitlist_signups force  row level security;

revoke all on public.waitlist_signups from anon, authenticated;
