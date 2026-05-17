-- ============================================================
-- Universo AGV — Row Level Security Policies
-- Run AFTER 001_schema.sql
-- ============================================================

-- Enable RLS
alter table profiles enable row level security;
alter table proposals enable row level security;
alter table tracking_events enable row level security;
alter table proposal_sessions enable row level security;
alter table pricing_config enable row level security;
alter table notifications enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
create policy "profiles: own read"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: own update"
  on profiles for update
  using (auth.uid() = id);

create policy "profiles: admin read all"
  on profiles for select
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================
-- PROPOSALS
-- ============================================================
create policy "proposals: consultant owns"
  on proposals for all
  using (consultant_id = auth.uid());

create policy "proposals: admin all"
  on proposals for all
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Public read by tracking token (no auth required for clients viewing proposals)
create policy "proposals: public read by token"
  on proposals for select
  using (true); -- filtered by application layer via tracking_token

-- ============================================================
-- TRACKING EVENTS (write-only for anonymous clients)
-- ============================================================
create policy "tracking_events: insert always"
  on tracking_events for insert
  with check (true);

create policy "tracking_events: consultant read own proposals"
  on tracking_events for select
  using (
    exists (
      select 1 from proposals p
      where p.id = tracking_events.proposal_id
        and p.consultant_id = auth.uid()
    )
  );

-- ============================================================
-- PROPOSAL SESSIONS
-- ============================================================
create policy "sessions: insert always"
  on proposal_sessions for insert
  with check (true);

create policy "sessions: update own token"
  on proposal_sessions for update
  using (true); -- filtered by session_token in application

create policy "sessions: consultant read own"
  on proposal_sessions for select
  using (
    exists (
      select 1 from proposals p
      where p.id = proposal_sessions.proposal_id
        and p.consultant_id = auth.uid()
    )
  );

-- ============================================================
-- PRICING CONFIG
-- ============================================================
create policy "pricing: all read"
  on pricing_config for select
  using (true);

create policy "pricing: admin write"
  on pricing_config for all
  using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create policy "notifications: own"
  on notifications for all
  using (user_id = auth.uid());
