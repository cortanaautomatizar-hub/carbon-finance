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

-- Trigger function: safely populate auth_uid from JWT claims (claim 'sub')
-- Uses current_setting('request.jwt.claims', true) which returns the JWT claims as text when present.
-- The function is defensive: if claims are missing or `sub` is absent, it leaves `auth_uid` as-is.
create or replace function public.set_auth_uid_from_jwt() returns trigger language plpgsql as $$
declare
  jwt_claims_text text;
  jwt_sub text;
begin
  -- try to read JWT claims injected by Supabase (may be null in some contexts)
  jwt_claims_text := current_setting('request.jwt.claims', true);
  if jwt_claims_text is not null then
    begin
      jwt_sub := (jwt_claims_text::json ->> 'sub');
    exception when others then
      jwt_sub := null;
    end;
  else
    jwt_sub := null;
  end if;

  if new.auth_uid is null and jwt_sub is not null then
    new.auth_uid := jwt_sub;
  end if;
  return new;
end;
$$;

-- Attach trigger to relevant tables
drop trigger if exists set_auth_uid_before_insert on cards;
create trigger set_auth_uid_before_insert
  before insert on cards
  for each row execute function public.set_auth_uid_from_jwt();

drop trigger if exists set_auth_uid_before_insert on subscriptions;
create trigger set_auth_uid_before_insert
  before insert on subscriptions
  for each row execute function public.set_auth_uid_from_jwt();
