-- ============================================================
-- Universo AGV — Supabase Realtime Channels
-- Run AFTER 002_rls.sql
-- ============================================================

-- Enable realtime on critical tables
alter publication supabase_realtime add table proposals;
alter publication supabase_realtime add table proposal_sessions;
alter publication supabase_realtime add table notifications;

-- ============================================================
-- REALTIME PRESENCE: online clients view
-- ============================================================
create or replace view online_proposals as
select
  ps.proposal_id,
  p.client_name,
  p.consultant_id,
  ps.conversion_score,
  ps.sections,
  ps.total_time,
  ps.active_time,
  ps.updated_at
from proposal_sessions ps
join proposals p on p.id = ps.proposal_id
where ps.updated_at > now() - interval '3 minutes';

-- ============================================================
-- SEED: default pricing config
-- ============================================================
insert into pricing_config (key, value) values
  ('base_rate', '0.032'),
  ('category_multipliers', '{
    "hatch": 0.95, "sedan": 1.0, "suv": 1.15, "pickup": 1.2,
    "van": 1.25, "truck": 1.35, "moto": 0.85
  }'),
  ('region_multipliers', '{
    "norte": 1.12, "nordeste": 1.08, "centro-oeste": 1.05, "sul-sudeste": 1.0
  }'),
  ('franchise_discounts', '{
    "1000": 0.0, "1500": -0.03, "2000": -0.06,
    "2500": -0.09, "3000": -0.12, "4000": -0.16, "5000": -0.20
  }'),
  ('addon_prices', '{
    "carro-reserva": 18, "assistencia-24h": 12, "vidros": 15,
    "terceiros": 22, "rastreador": 25
  }')
on conflict (key) do nothing;
