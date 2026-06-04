-- ============================================================
-- RIICA — Tabela Fatos Relevantes (CMS)
-- Lista de fatos relevantes / atos societários exibidos na home
-- numa seção própria, no estilo timeline com hiperlinks.
-- ============================================================
create table if not exists public.fatos_relevantes (
  id uuid primary key default gen_random_uuid(),
  data date not null,
  tag text not null default 'COMUNICADO OFICIAL',
  titulo text not null,
  resumo text,
  url text,
  publicado boolean not null default true,
  ordem integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fatos_relevantes_data_idx
  on public.fatos_relevantes (data desc);

-- RLS — leitura pública dos publicados, super_admin tudo
alter table public.fatos_relevantes enable row level security;

drop policy if exists fatos_relevantes_sel on public.fatos_relevantes;
create policy fatos_relevantes_sel on public.fatos_relevantes
  for select
  using (publicado = true or public.meu_papel() = 'super_admin');

drop policy if exists fatos_relevantes_admin on public.fatos_relevantes;
create policy fatos_relevantes_admin on public.fatos_relevantes
  for all to authenticated
  using (public.meu_papel() = 'super_admin')
  with check (public.meu_papel() = 'super_admin');
