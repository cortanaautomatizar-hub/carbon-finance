-- Supabase minimal migration for cards and subscriptions (example)

create table if not exists users (
  id serial primary key,
  email text unique,
  name text,
  created_at timestamptz default now()
);

create table if not exists cards (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  payload jsonb,
  created_at timestamptz default now()
);

-- create index on user_id for fast queries
create index if not exists cards_user_idx on cards(user_id);
create index if not exists subs_user_idx on subscriptions(user_id);
