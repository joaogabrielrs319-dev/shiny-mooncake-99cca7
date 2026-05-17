-- ============================================================
-- Universo AGV — Schema Principal
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_stat_statements";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  name        text not null,
  role        text not null default 'consultant' check (role in ('admin', 'consultant')),
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- PROPOSALS
-- ============================================================
create table if not exists proposals (
  id                uuid primary key default uuid_generate_v4(),
  consultant_id     uuid not null references profiles(id) on delete cascade,
  client_name       text not null,
  client_phone      text not null,
  client_email      text,
  -- vehicle
  plate             text not null,
  brand             text not null,
  model             text not null,
  year              int not null,
  color             text,
  fuel              text,
  category          text not null,
  fipe_code         text,
  fipe_value        numeric(12,2) not null,
  -- pricing
  coverages         text[] not null default '{}',
  addons            text[] not null default '{}',
  plan              text not null default 'premium' check (plan in ('basic','standard','premium')),
  franchise_value   numeric(10,2) not null default 2500,
  region            text not null default 'sul-sudeste',
  monthly_price     numeric(10,2) not null,
  annual_price      numeric(10,2) not null,
  -- status
  status            text not null default 'draft' check (status in ('draft','sent','viewed','negotiating','hot','closed','lost')),
  tracking_token    text unique not null default replace(gen_random_uuid()::text, '-', ''),
  -- timestamps
  sent_at           timestamptz,
  viewed_at         timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists proposals_consultant_id_idx on proposals(consultant_id);
create index if not exists proposals_status_idx on proposals(status);
create index if not exists proposals_tracking_token_idx on proposals(tracking_token);
create index if not exists proposals_created_at_idx on proposals(created_at desc);

-- ============================================================
-- TRACKING EVENTS
-- ============================================================
create table if not exists tracking_events (
  id           bigserial primary key,
  proposal_id  uuid not null references proposals(id) on delete cascade,
  type         text not null,
  section      text,
  payload      jsonb,
  timestamp    bigint not null
);

create index if not exists tracking_events_proposal_id_idx on tracking_events(proposal_id);
create index if not exists tracking_events_type_idx on tracking_events(type);
create index if not exists tracking_events_timestamp_idx on tracking_events(timestamp desc);

-- ============================================================
-- SESSIONS
-- ============================================================
create table if not exists proposal_sessions (
  id             uuid primary key default uuid_generate_v4(),
  proposal_id    uuid not null references proposals(id) on delete cascade,
  session_token  text unique not null,
  total_time     int not null default 0,
  active_time    int not null default 0,
  idle_time      int not null default 0,
  scroll_depth   int not null default 0,
  sections       text[] not null default '{}',
  conversion_score int not null default 0,
  is_return_visit  boolean not null default false,
  ip_hash        text,
  user_agent     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists proposal_sessions_proposal_id_idx on proposal_sessions(proposal_id);

-- ============================================================
-- PRICING CONFIG (admin-editable)
-- ============================================================
create table if not exists pricing_config (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,
  value       jsonb not null,
  updated_by  uuid references profiles(id),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists notifications (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  type          text not null,
  title         text not null,
  body          text,
  proposal_id   uuid references proposals(id) on delete cascade,
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on notifications(user_id);
create index if not exists notifications_read_idx on notifications(read);

-- ============================================================
-- TRIGGERS: updated_at auto-update
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on profiles for each row execute function set_updated_at();
create trigger proposals_updated_at before update on proposals for each row execute function set_updated_at();
create trigger proposal_sessions_updated_at before update on proposal_sessions for each row execute function set_updated_at();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'consultant')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- TRIGGER: hot lead detection
-- ============================================================
create or replace function check_hot_lead()
returns trigger language plpgsql as $$
begin
  if new.conversion_score >= 80 then
    update proposals set status = 'hot' where id = new.proposal_id and status not in ('closed', 'lost');
  end if;
  return new;
end;
$$;

create trigger on_session_score_updated
  after insert or update on proposal_sessions
  for each row execute function check_hot_lead();
