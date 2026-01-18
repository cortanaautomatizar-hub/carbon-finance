-- Add auth_uid columns and enable RLS + example policies
-- This migration adds an `auth_uid` (text) column to map Supabase Auth UIDs
-- then enables Row Level Security and creates policies so each user only
-- accesses their own `cards` and `subscriptions` by matching auth.uid().

alter table users add column if not exists auth_uid text;
alter table cards add column if not exists auth_uid text;
alter table subscriptions add column if not exists auth_uid text;

-- Enable RLS
alter table cards enable row level security;
alter table subscriptions enable row level security;

-- Policy: allow authenticated users to select/insert/update/delete only when their auth_uid matches
create policy if not exists "cards_policy_auth" on cards
  using (auth_uid = auth.uid())
  with check (auth_uid = auth.uid());

create policy if not exists "subscriptions_policy_auth" on subscriptions
  using (auth_uid = auth.uid())
  with check (auth_uid = auth.uid());

-- Note: you must ensure `auth_uid` is populated when creating rows (e.g. via your API or DB trigger)
-- Example trigger (optional): set auth_uid from current_setting('request.jwt.claims') if you use RLS triggers.
