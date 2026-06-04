-- ============================================================
-- RIICA — Hotfix RLS: site_config foi esquecida da lista de
-- tabelas públicas em 20260529000005_rls.sql.
-- Sem policy de SELECT, o anon recebia array vazio e o rodapé
-- + aviso legal renderizavam vazios em produção.
-- ============================================================
alter table public.site_config enable row level security;

drop policy if exists site_config_sel on public.site_config;
create policy site_config_sel on public.site_config
  for select using (true);

drop policy if exists site_config_admin on public.site_config;
create policy site_config_admin on public.site_config
  for all to authenticated
  using (public.meu_papel() = 'super_admin')
  with check (public.meu_papel() = 'super_admin');
