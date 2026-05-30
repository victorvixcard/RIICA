-- ============================================================
-- RIICA — Fase 2: RLS + policies (trancamento de acesso)
-- Modelo:
--   anon            → lê conteúdo público (publicado) do portal
--   super_admin     → lê e escreve tudo
--   investidor      → lê o próprio registro + conteúdo público
-- Funções auxiliares (security definer) bypassam RLS, evitando recursão.
-- ============================================================

-- CPF (apenas dígitos) do usuário autenticado — base para o investidor ler o próprio registro.
create or replace function public.meu_cpf()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select regexp_replace(cpf, '\D', '', 'g')
  from public.usuarios where auth_id = auth.uid() limit 1;
$$;
grant execute on function public.meu_cpf() to anon, authenticated;

-- ------------------------------------------------------------
-- Tabelas de conteúdo PÚBLICO (leitura por todos; escrita só super_admin)
-- ------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'nav_items','quick_actions','footer_colunas','footer_links','redes_sociais',
    'site_textos','kpis','ticker','kit_trimestre','kit_documentos','kit_links',
    'periodos_financeiros','linhas_financeiras','valores_financeiros'
  ] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for select using (true);', t||'_sel', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.meu_papel()=''super_admin'') with check (public.meu_papel()=''super_admin'');', t||'_admin', t);
  end loop;
end $$;

-- ------------------------------------------------------------
-- Conteúdo com gate de publicação (anon vê só publicado; super_admin vê tudo)
-- ------------------------------------------------------------
alter table public.comunicados enable row level security;
create policy comunicados_sel on public.comunicados for select
  using (publicado = true or public.meu_papel() = 'super_admin');
create policy comunicados_admin on public.comunicados for all to authenticated
  using (public.meu_papel() = 'super_admin') with check (public.meu_papel() = 'super_admin');

alter table public.eventos enable row level security;
create policy eventos_sel on public.eventos for select
  using (publicado = true or public.meu_papel() = 'super_admin');
create policy eventos_admin on public.eventos for all to authenticated
  using (public.meu_papel() = 'super_admin') with check (public.meu_papel() = 'super_admin');

alter table public.documentos enable row level security;
create policy documentos_sel on public.documentos for select
  using (publico = true or public.meu_papel() = 'super_admin');
create policy documentos_admin on public.documentos for all to authenticated
  using (public.meu_papel() = 'super_admin') with check (public.meu_papel() = 'super_admin');

alter table public.faqs enable row level security;
create policy faqs_sel on public.faqs for select
  using (publicado = true or public.meu_papel() = 'super_admin');
create policy faqs_admin on public.faqs for all to authenticated
  using (public.meu_papel() = 'super_admin') with check (public.meu_papel() = 'super_admin');

-- ------------------------------------------------------------
-- Investidores: super_admin vê tudo; investidor vê o próprio (por CPF)
-- ------------------------------------------------------------
alter table public.investidores enable row level security;
create policy investidores_sel on public.investidores for select
  using (
    public.meu_papel() = 'super_admin'
    or regexp_replace(cpf, '\D', '', 'g') = public.meu_cpf()
  );
create policy investidores_admin on public.investidores for all to authenticated
  using (public.meu_papel() = 'super_admin') with check (public.meu_papel() = 'super_admin');

-- ------------------------------------------------------------
-- Usuários: super_admin gere todos; cada um lê o próprio perfil
-- ------------------------------------------------------------
alter table public.usuarios enable row level security;
create policy usuarios_sel on public.usuarios for select
  using (public.meu_papel() = 'super_admin' or auth_id = auth.uid());
create policy usuarios_admin on public.usuarios for all to authenticated
  using (public.meu_papel() = 'super_admin') with check (public.meu_papel() = 'super_admin');

-- ------------------------------------------------------------
-- Dados administrativos (apenas super_admin)
-- ------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['templates','campanhas','envios','atividades'] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.meu_papel()=''super_admin'') with check (public.meu_papel()=''super_admin'');', t||'_admin', t);
  end loop;
end $$;
