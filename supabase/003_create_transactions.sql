-- Create `transactions` table with RLS and example policies

create table if not exists transactions (
  id serial primary key,
  name text,
  amount numeric,
  category text,
  description text,
  date timestamptz,
  user_id integer references users(id) on delete set null,
  auth_uid text,
  created_at timestamptz default now()
);

-- Indexes for fast queries
create index if not exists transactions_auth_idx on transactions(auth_uid);
create index if not exists transactions_user_idx on transactions(user_id);
create index if not exists transactions_date_idx on transactions(date desc);

-- Enable Row Level Security
alter table transactions enable row level security;

-- Policy: allow authenticated users to insert/select/update/delete their own transactions
-- Use DROP + CREATE for compatibility with Postgres versions that don't support CREATE POLICY IF NOT EXISTS
drop policy if exists transactions_policy_auth on transactions;
create policy transactions_policy_auth on transactions
  using (auth_uid = auth.uid())
  with check (auth_uid = auth.uid());

-- Attach trigger for setting auth_uid from JWT if not provided
drop trigger if exists set_auth_uid_before_insert on transactions;
create trigger set_auth_uid_before_insert
  before insert on transactions
  for each row execute function public.set_auth_uid_from_jwt();

-- Note: This migration creates a minimal transactional table used by the frontend.
-- Ensure this file is applied (supabase db push or via SQL editor) in your production DB.