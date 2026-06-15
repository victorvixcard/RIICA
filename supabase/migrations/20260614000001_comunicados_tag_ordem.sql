-- ============================================================
-- Comunicados ao mercado: alinhamento de schema com Fatos Relevantes.
-- Adiciona `tag` (categoria visual) e `ordem` (desempate de mesma data).
-- A tabela já existia desde 20260529000001_init_schema.sql mas não era
-- exposta no CMS — agora volta como entidade independente de Fatos.
-- ============================================================

alter table public.comunicados
  add column if not exists tag text not null default 'COMUNICADO',
  add column if not exists ordem integer not null default 0;

create index if not exists comunicados_data_idx
  on public.comunicados (data desc, ordem);
