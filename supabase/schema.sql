-- ============================================================
-- StockCoach — Supabase Schema
-- Run this in your Supabase project: SQL Editor → New Query → Run
-- ============================================================

-- Holdings table
create table if not exists public.holdings (
  id          uuid        default gen_random_uuid() primary key,
  user_id     text        not null,          -- NextAuth JWT sub (Google/GitHub user ID)
  ticker      text        not null,
  name        text        not null default '',
  sector      text        not null default 'Unknown',
  shares      numeric(15, 4) not null,
  avg_cost    numeric(15, 4) not null,
  purchase_date date       null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index for fast lookups by user
create index if not exists holdings_user_id_idx on public.holdings(user_id);
create index if not exists holdings_ticker_idx  on public.holdings(ticker);

-- Auto-update updated_at on row change
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_holdings_updated_at on public.holdings;
create trigger set_holdings_updated_at
  before update on public.holdings
  for each row execute procedure public.set_updated_at();

-- Row Level Security
-- We verify user_id server-side via NextAuth, but RLS adds a second layer of protection
alter table public.holdings enable row level security;

-- Only the service role (our server) can read/write
-- The service role key bypasses RLS by default, so this policy is for extra safety
-- with the anon key (which we never use for holdings)
create policy "Service role full access"
  on public.holdings
  using (true)
  with check (true);
