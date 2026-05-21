-- =====================================================================
-- Universo AGV — Setup Supabase (rodar no SQL Editor do seu projeto)
-- =====================================================================

-- 1) Tabela de leads
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  email       text,
  placa       text not null,
  created_at  timestamptz not null default now()
);

-- 2) Habilitar Row Level Security
alter table public.leads enable row level security;

-- 3) Políticas de acesso
-- Qualquer visitante pode cadastrar um lead (formulário público)
drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Apenas usuários autenticados (admin) podem ler os leads
drop policy if exists "Authenticated can read leads" on public.leads;
create policy "Authenticated can read leads"
  on public.leads
  for select
  to authenticated
  using (true);

-- 4) Índice para ordenação por data
create index if not exists leads_created_at_idx
  on public.leads (created_at desc);
