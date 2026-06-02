-- Contact / demo-request submissions for nomik.ai contact form.
-- Writes go through the submit-contact Edge Function using the service role,
-- so anon/authenticated roles have no access at all. RLS is FORCED so even
-- a future role with table privileges still routes through policies.

create extension if not exists citext;
create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  email       citext      not null,
  company     text        not null,
  team_size   text        not null,
  use_case    text        not null,
  sovereignty text        not null,
  source      text        not null default 'nomik.ai/contact',
  ip_hash     text,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists contact_submissions_created_at_desc_idx
  on public.contact_submissions (created_at desc);

create index if not exists contact_submissions_ip_hash_created_at_idx
  on public.contact_submissions (ip_hash, created_at desc);

alter table public.contact_submissions enable row level security;
alter table public.contact_submissions force  row level security;

revoke all on public.contact_submissions from anon, authenticated;
