-- ============================================================
-- RIICA — Deploy completo no Supabase Cloud
-- Cole tudo no SQL Editor e clique RUN. Inclui:
--   1) 5 migrations (schema, CMS estendido, usuarios, auth, RLS)
--   2) seed.sql (dados iniciais, sem números fictícios)
-- ============================================================


-- ============================================================
-- 1) MIGRATION 20260529000001_init_schema.sql
-- ============================================================
-- ============================================================
-- RIICA — Schema inicial (Fase 1: dados + CRUDs, sem auth/RLS)
-- Portal de Relações com Investidores do Grupo ICA
-- ============================================================
-- Convenções:
--   - colunas em snake_case (mapeadas para camelCase na camada de API)
--   - conjuntos fixos via CHECK (text) em vez de enums, para evoluir sem
--     migração de tipo
--   - id text PK com default uuid; seed insere ids legados explicitamente
--   - updated_at mantido por trigger
--   - RLS NÃO habilitada nesta fase (auth vem na Fase 2)
-- ============================================================

-- Função utilitária: bump de updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- CMS / CONTEÚDO
-- ============================================================

-- Documentos (PDFs, formulários, etc.)
create table public.documentos (
  id              text primary key default gen_random_uuid()::text,
  titulo          text not null,
  categoria       text not null check (categoria in (
                    'release','apresentacao','demonstracao','ata',
                    'regulamento','fato_relevante','comunicado','formulario','outro')),
  periodo         text,
  arquivo         text not null,            -- nome do arquivo (mock) / path no Storage
  tamanho         bigint,                   -- bytes
  data_publicacao date not null,
  publico         boolean not null default true,
  tag             text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Comunicados ao mercado
create table public.comunicados (
  id           text primary key default gen_random_uuid()::text,
  data         date not null,
  titulo       text not null,
  resumo       text,
  documento_id text references public.documentos(id) on delete set null,
  link         text,
  destaque     boolean not null default false,
  publicado    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Eventos / agenda
create table public.eventos (
  id             text primary key default gen_random_uuid()::text,
  data           date not null,
  hora           text not null,             -- "10h00" ou "Dia todo"
  titulo         text not null,
  tipo           text not null check (tipo in (
                   'Conferência','Presencial','Virtual','APIMEC','Investor Day','Assembleia')),
  local          text,
  link_inscricao text,
  publicado      boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Kit do Investidor (trimestre corrente)
create table public.kit_trimestre (
  id         text primary key default gen_random_uuid()::text,
  trimestre  text not null,
  ano        int not null,
  ativo      boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Documentos em destaque no Kit (ordenados)
create table public.kit_documentos (
  kit_id       text not null references public.kit_trimestre(id) on delete cascade,
  documento_id text not null references public.documentos(id) on delete cascade,
  ordem        int not null default 0,
  primary key (kit_id, documento_id)
);

-- Links auxiliares do Kit (linha de "/")
create table public.kit_links (
  id     text primary key default gen_random_uuid()::text,
  kit_id text not null references public.kit_trimestre(id) on delete cascade,
  label  text not null,
  url    text not null,
  ordem  int not null default 0
);

-- Textos institucionais (singleton: hero + purpose)
create table public.site_textos (
  id         int primary key default 1 check (id = 1),
  hero       jsonb not null,
  purpose    jsonb not null,
  updated_at timestamptz not null default now()
);

-- KPIs ("Grupo ICA em números")
create table public.kpis (
  id    text primary key default gen_random_uuid()::text,
  valor text not null,
  label text not null,
  ordem int not null default 0
);

-- Ticker de cotações exibido no header
create table public.ticker (
  id       text primary key default gen_random_uuid()::text,
  simbolo  text not null,
  preco    text not null,
  variacao text not null,
  positivo boolean not null default true,
  ordem    int not null default 0
);

-- ============================================================
-- INVESTIDORES
-- ============================================================
create table public.investidores (
  id              text primary key default gen_random_uuid()::text,
  nome            text not null,
  cpf             text not null unique,
  email           text,
  whatsapp        text,
  status          text not null default 'ativo' check (status in (
                    'ativo','pendente_confirmacao','bloqueado','inativo')),
  valor_investido numeric not null default 0,
  ultimo_contato  date,
  origem          text check (origem in (
                    'CSV','Cadastro manual','Importação SCP','Indicação')),
  tags            text[] not null default '{}',
  criado_em       date not null default current_date,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index investidores_status_idx on public.investidores (status);
create index investidores_cpf_idx on public.investidores (cpf);

-- ============================================================
-- ENGAJAMENTO (templates, campanhas, envios)
-- ============================================================
create table public.templates (
  id            text primary key default gen_random_uuid()::text,
  nome          text not null,
  canal         text not null check (canal in ('email','whatsapp','push')),
  assunto       text,
  resumo        text not null,
  conteudo      text not null,
  tags          text[] not null default '{}',
  usos          int not null default 0,
  ultima_edicao date,
  ativo         boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.campanhas (
  id              text primary key default gen_random_uuid()::text,
  titulo          text not null,
  canais          text[] not null default '{}',
  status          text not null default 'rascunho' check (status in (
                    'rascunho','agendada','enviando','concluida','falhou')),
  audiencia_total int not null default 0,
  entregues       int not null default 0,
  abertura        numeric not null default 0,    -- %
  agendada_para   timestamptz,
  template_ref    text,                           -- slug livre do template usado
  criada_em       timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Log de envios (histórico por destinatário)
create table public.envios (
  id                   text primary key default gen_random_uuid()::text,
  campanha_id          text references public.campanhas(id) on delete cascade,
  campanha_titulo      text,
  destinatario_nome    text not null,
  destinatario_contato text not null,
  canal                text not null check (canal in ('email','whatsapp','push')),
  status               text not null check (status in (
                         'entregue','aberto','clicado','falhou','bouncing','pendente')),
  enviado_em           timestamptz not null,
  aberto_em            timestamptz,
  clicado_em           timestamptz,
  erro                 text
);

create index envios_campanha_idx on public.envios (campanha_id);
create index envios_status_idx on public.envios (status);

-- ============================================================
-- FINANCEIRO (DRE / Balanço)
-- ============================================================
create table public.periodos_financeiros (
  id        text primary key,
  trimestre text not null,
  ano       int not null,
  publicado boolean not null default true,
  ordem     int not null default 0
);

create table public.linhas_financeiras (
  id           text primary key default gen_random_uuid()::text,
  demonstracao text not null check (demonstracao in ('dre','balanco_ativo','balanco_passivo')),
  conta        text not null,
  ordem        int not null,
  destaque     boolean not null default false,
  nivel        int not null default 0 check (nivel in (0,1,2))
);

create index linhas_financeiras_demo_idx on public.linhas_financeiras (demonstracao, ordem);

create table public.valores_financeiros (
  linha_id   text not null references public.linhas_financeiras(id) on delete cascade,
  periodo_id text not null references public.periodos_financeiros(id) on delete cascade,
  valor      numeric not null,             -- R$ milhares
  primary key (linha_id, periodo_id)
);

-- ============================================================
-- AUDITORIA / ATIVIDADES
-- ============================================================
create table public.atividades (
  id         text primary key default gen_random_uuid()::text,
  tipo       text not null check (tipo in ('envio','import','campanha','login','edicao')),
  texto      text not null,
  meta       text,
  created_at timestamptz not null default now()
);

create index atividades_created_idx on public.atividades (created_at desc);

-- ============================================================
-- TRIGGERS de updated_at
-- ============================================================
create trigger trg_documentos_updated   before update on public.documentos   for each row execute function public.set_updated_at();
create trigger trg_comunicados_updated   before update on public.comunicados   for each row execute function public.set_updated_at();
create trigger trg_eventos_updated       before update on public.eventos       for each row execute function public.set_updated_at();
create trigger trg_kit_updated           before update on public.kit_trimestre for each row execute function public.set_updated_at();
create trigger trg_site_textos_updated   before update on public.site_textos   for each row execute function public.set_updated_at();
create trigger trg_investidores_updated  before update on public.investidores  for each row execute function public.set_updated_at();
create trigger trg_templates_updated     before update on public.templates     for each row execute function public.set_updated_at();
create trigger trg_campanhas_updated     before update on public.campanhas     for each row execute function public.set_updated_at();

-- ============================================================
-- STORAGE: bucket de documentos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('documentos', 'documentos', true)
on conflict (id) do nothing;

-- ============================================================
-- FASE 1 — acesso aberto para dev (sem auth).
-- Substituir por RLS + policies na Fase 2.
-- ============================================================
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- ============================================================
-- 2) MIGRATION 20260529000002_cms_extended.sql
-- ============================================================
-- ============================================================
-- RIICA — CMS estendido (Fase 1 do "CMS total")
-- Blocos do site que ainda eram hardcoded: navegação, ações
-- rápidas, rodapé, redes sociais, FAQ e config institucional.
-- ============================================================

-- Menu de navegação do header
create table public.nav_items (
  id      text primary key default gen_random_uuid()::text,
  label   text not null,
  url     text not null,
  ordem   int not null default 0,
  visivel boolean not null default true
);

-- Botões de ação rápida (faixa abaixo do hero)
create table public.quick_actions (
  id      text primary key default gen_random_uuid()::text,
  label   text not null,
  href    text not null,
  ordem   int not null default 0,
  visivel boolean not null default true
);

-- Colunas do rodapé
create table public.footer_colunas (
  id     text primary key default gen_random_uuid()::text,
  titulo text not null,
  ordem  int not null default 0
);

-- Links de cada coluna do rodapé
create table public.footer_links (
  id        text primary key default gen_random_uuid()::text,
  coluna_id text not null references public.footer_colunas(id) on delete cascade,
  label     text not null,
  url       text not null default '#',
  ordem     int not null default 0
);

-- Redes sociais / contatos do rodapé
create table public.redes_sociais (
  id    text primary key default gen_random_uuid()::text,
  tipo  text not null check (tipo in ('linkedin','instagram','facebook','youtube','x','email','telefone')),
  url   text not null,
  ordem int not null default 0
);

-- Configuração institucional (singleton)
create table public.site_config (
  id                int primary key default 1 check (id = 1),
  institucional_url text not null default '#',
  footer_descricao  text not null default '',
  footer_cnpj       text not null default '',
  footer_endereco   text not null default '',
  footer_copyright  text not null default '',
  updated_at        timestamptz not null default now()
);

-- FAQ
create table public.faqs (
  id         text primary key default gen_random_uuid()::text,
  pergunta   text not null,
  resposta   text not null,
  categoria  text,
  ordem      int not null default 0,
  publicado  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index nav_items_ordem_idx on public.nav_items (ordem);
create index quick_actions_ordem_idx on public.quick_actions (ordem);
create index footer_links_coluna_idx on public.footer_links (coluna_id, ordem);
create index faqs_ordem_idx on public.faqs (ordem);

create trigger trg_site_config_updated before update on public.site_config for each row execute function public.set_updated_at();
create trigger trg_faqs_updated        before update on public.faqs        for each row execute function public.set_updated_at();

-- Acesso aberto (Fase 1, sem auth) — herdado via default privileges da migration inicial,
-- mas reforçamos para as novas tabelas:
grant all on all tables in schema public to anon, authenticated;

-- ============================================================
-- 3) MIGRATION 20260529000003_usuarios.sql
-- ============================================================
-- ============================================================
-- RIICA — Usuários do sistema (gestão pelo Super Admin)
-- Fase 1: papéis + status + senha PLACEHOLDER (sem auth real).
-- Na Fase 2 isto será integrado ao Supabase Auth (senha hasheada,
-- reset por e-mail, etc.) e a coluna senha_temp será removida.
-- ============================================================

create table public.usuarios (
  id             text primary key default gen_random_uuid()::text,
  nome           text not null,
  email          text not null unique,
  cpf            text,            -- vínculo lógico com investidores (mesma pessoa, acessos distintos)
  papel          text not null default 'investidor' check (papel in ('super_admin','investidor')),
  status         text not null default 'ativo' check (status in ('ativo','inativo')),
  -- ⚠️ PLACEHOLDER de desenvolvimento — NÃO é armazenamento seguro de senha.
  -- Será substituído pelo Supabase Auth na Fase 2.
  senha_temp     text,
  senha_definida boolean not null default false,
  ultimo_acesso  timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index usuarios_papel_idx on public.usuarios (papel);
create index usuarios_cpf_idx on public.usuarios (cpf);

create trigger trg_usuarios_updated before update on public.usuarios for each row execute function public.set_updated_at();

-- Fase 1: acesso aberto para dev
grant all on all tables in schema public to anon, authenticated;

-- ============================================================
-- 4) MIGRATION 20260529000004_auth.sql
-- ============================================================
-- ============================================================
-- RIICA — Fase 2: vínculo com Supabase Auth
-- Liga `usuarios` aos auth.users e expõe RPCs para login e RLS.
-- ============================================================

-- Cada usuário do sistema referencia uma conta de autenticação.
alter table public.usuarios
  add column if not exists auth_id uuid unique references auth.users(id) on delete set null;

-- Login do investidor é por CPF, mas o Supabase Auth é por e-mail.
-- Esta função (executável antes da autenticação) mapeia CPF -> e-mail,
-- somente para investidores ativos.
create or replace function public.email_por_cpf(p_cpf text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email from public.usuarios
  where regexp_replace(cpf, '\D', '', 'g') = regexp_replace(p_cpf, '\D', '', 'g')
    and papel = 'investidor'
    and status = 'ativo'
  limit 1;
$$;

grant execute on function public.email_por_cpf(text) to anon, authenticated;

-- Papel do usuário autenticado (base para as policies de RLS).
create or replace function public.meu_papel()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select papel from public.usuarios where auth_id = auth.uid() limit 1;
$$;

grant execute on function public.meu_papel() to anon, authenticated;

-- ============================================================
-- 5) MIGRATION 20260529000005_rls.sql
-- ============================================================
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

-- ============================================================
-- 6) SEED
-- ============================================================
-- ============================================================
-- RIICA — Seed (dados iniciais a partir dos mocks do frontend)
-- ============================================================

-- ----------------------------------------------------------------
-- DOCUMENTOS
-- ----------------------------------------------------------------
insert into public.documentos (id, titulo, categoria, periodo, arquivo, tamanho, data_publicacao, publico) values
('doc-001','Release de Resultados 1T26','release','1T26','release-1t26.pdf',1248000,'2026-05-18',true),
('doc-002','Apresentação de Resultados 1T26','apresentacao','1T26','apresentacao-1t26.pdf',3850000,'2026-05-18',true),
('doc-003','Demonstrações Financeiras Consolidadas 1T26','demonstracao','1T26','dfp-1t26.pdf',5120000,'2026-05-18',true),
('doc-004','Ata da Reunião do Conselho — 30.04.2026','ata','1T26','ata-conselho-30-04-2026.pdf',412000,'2026-04-30',true),
('doc-005','Formulário 20-F — exercício 2025','formulario','2025-Anual','20-f-2025.pdf',8420000,'2026-03-31',true),
('doc-006','Apresentação Institucional — Maio/2026','apresentacao',null,'apresentacao-institucional.pdf',6240000,'2026-05-02',true);

-- ----------------------------------------------------------------
-- COMUNICADOS
-- ----------------------------------------------------------------
insert into public.comunicados (id, data, titulo, resumo, documento_id, destaque, publicado) values
('com-001','2026-05-19','Grupo ICA anuncia novo programa de dividendos extraordinários','Conselho aprovou distribuição de R$ 0,42 por ação a ser paga em 30/06.',null,true,false),
('com-002','2026-05-18','Grupo ICA divulga resultados financeiros do 1T26','Receita líquida cresceu 12,8% no comparativo anual. EBITDA ajustado de R$ 184M.','doc-001',true,false),
('com-003','2026-05-12','Comunicado ao mercado: aquisição estratégica no segmento de varejo','Aquisição de 60% da Capixaba Distribuidora aprovada pelo CADE.',null,true,false),
('com-004','2026-04-30','Reunião do Conselho de Administração — ata disponível',null,'doc-004',true,false);

-- ----------------------------------------------------------------
-- EVENTOS
-- ----------------------------------------------------------------
insert into public.eventos (id, data, hora, titulo, tipo, local, link_inscricao, publicado) values
('evt-001','2026-05-28','10h00','Teleconferência de Resultados 1T26','Conferência',null,'https://ri.icabank.com.br/teleconf',false),
('evt-002','2026-06-12','14h00','Reunião APIMEC — Vitória/ES','APIMEC','Vitória/ES',null,false),
('evt-003','2026-07-20','Dia todo','ICA Investor Day 2026','Investor Day','São Paulo/SP',null,false);

-- ----------------------------------------------------------------
-- KIT DO INVESTIDOR
-- ----------------------------------------------------------------
insert into public.kit_trimestre (id, trimestre, ano, ativo) values
('kit-1t26','1T26',2026,false);

insert into public.kit_documentos (kit_id, documento_id, ordem) values
('kit-1t26','doc-001',0),
('kit-1t26','doc-002',1),
('kit-1t26','doc-003',2);

insert into public.kit_links (id, kit_id, label, url, ordem) values
('la-1','kit-1t26','20-F','#',0),
('la-2','kit-1t26','Apresentação Institucional','#',1),
('la-3','kit-1t26','Planilha de Dados','#',2);

-- ----------------------------------------------------------------
-- TEXTOS INSTITUCIONAIS (singleton)
-- ----------------------------------------------------------------
insert into public.site_textos (id, hero, purpose) values (
  1,
  '{
    "eyebrow": "Resultados em breve",
    "tituloLinha1": "Grupo ICA divulga",
    "tituloLinha2": "resultados do 1T26",
    "descricao": "Acesse o material completo de divulgação trimestral — release, apresentação, demonstrações financeiras e teleconferência com a administração.",
    "ctaLabel": "Acessar Kit do Investidor",
    "ctaSecundarioLabel": "Formas de contato"
  }'::jsonb,
  '{
    "eyebrow": "Quem somos",
    "tituloAntes": "Nosso propósito é",
    "tituloDestaque": "transformar vidas",
    "descricao": "O Grupo ICA é um ecossistema de soluções que conecta pessoas e empresas ao que importa — com mais de três décadas construindo presença sólida no mercado capixaba e nacional.",
    "kpisEyebrow": "Grupo ICA em números"
  }'::jsonb
);

-- (KPIs e Ticker: vazios por padrão — serão preenchidos via CMS quando
--  houver informações reais para divulgar ao investidor.)

-- ----------------------------------------------------------------
-- INVESTIDORES
-- ----------------------------------------------------------------
insert into public.investidores (id, nome, cpf, email, whatsapp, status, valor_investido, ultimo_contato, origem, criado_em) values
('INV-0001','Ana Carolina Ferreira','123.456.789-00','ana.ferreira@email.com','+55 27 99999-1234','ativo',285000,'2026-05-19','CSV','2026-01-01'),
('INV-0002','Bruno Lima Pereira','987.654.321-00','bruno.lima@email.com','+55 27 98888-5678','ativo',1240000,'2026-05-18','CSV','2026-01-01'),
('INV-0003','Carla Souza Albuquerque','456.789.123-00','carla.souza@email.com','+55 11 97777-3456','pendente_confirmacao',75000,'2026-04-30','Cadastro manual','2026-01-01'),
('INV-0004','Daniel Vasconcelos Pinto','321.654.987-00','daniel.v@email.com','+55 31 96666-7890','ativo',520000,'2026-05-15','Importação SCP','2026-01-01'),
('INV-0005','Eduarda Martins Andrade','654.987.321-00','eduarda.m@email.com','+55 21 95555-1122','ativo',180000,'2026-05-12','CSV','2026-01-01'),
('INV-0006','Felipe Antunes Costa','789.123.456-00','felipe.costa@email.com','+55 27 94444-3344','bloqueado',320000,'2026-03-22','CSV','2026-01-01'),
('INV-0007','Gabriela Reis Monteiro','147.258.369-00','gabi.reis@email.com','+55 27 93333-5566','ativo',95000,'2026-05-17','CSV','2026-01-01'),
('INV-0008','Henrique Toledo Pacheco','258.369.147-00','henrique.t@email.com','+55 11 92222-7788','inativo',0,'2025-11-08','Importação SCP','2026-01-01'),
('INV-0009','Isabela Nogueira Brito','369.147.258-00','isa.brito@email.com','+55 27 91111-9900','ativo',2150000,'2026-05-20','CSV','2026-01-01'),
('INV-0010','João Pedro Mendonça','159.357.486-00','joao.m@email.com','+55 31 90000-2233','pendente_confirmacao',60000,'2026-05-08','Cadastro manual','2026-01-01'),
('INV-0011','Karina Oliveira Salles','753.951.486-00','karina.s@email.com','+55 27 99811-1100','ativo',410000,'2026-05-19','CSV','2026-01-01'),
('INV-0012','Lucas Bernardes Faria','852.741.963-00','lucas.b@email.com','+55 11 98722-3344','ativo',1850000,'2026-05-21','Indicação','2026-01-01'),
('INV-0013','Mariana Castro Lima','951.357.852-00','mariana.c@email.com','+55 31 97633-5566','ativo',130000,'2026-05-14','CSV','2026-01-01'),
('INV-0014','Nelson Diniz Almeida','246.813.579-00','nelson.d@email.com','+55 21 96544-7788','pendente_confirmacao',250000,'2026-05-05','Cadastro manual','2026-01-01'),
('INV-0015','Olívia Pacheco Ramos','135.792.468-00','olivia.p@email.com','+55 27 95455-9900','ativo',88000,'2026-05-16','CSV','2026-01-01'),
('INV-0016','Pedro Henrique Tavares','864.197.532-00','pedro.t@email.com','+55 27 94366-1122','ativo',720000,'2026-05-13','CSV','2026-01-01'),
('INV-0017','Quezia Lopes Madureira','975.318.642-00','quezia.l@email.com','+55 11 93277-3344','ativo',165000,'2026-05-19','Importação SCP','2026-01-01'),
('INV-0018','Rafael Cordeiro Bastos','486.215.973-00','rafael.c@email.com','+55 31 92188-5566','ativo',3400000,'2026-05-20','Indicação','2026-01-01'),
('INV-0019','Sabrina Vieira Coutinho','537.624.819-00','sabrina.v@email.com','+55 21 91099-7788','bloqueado',195000,'2026-02-14','CSV','2026-01-01'),
('INV-0020','Tiago Marques Filho','648.715.293-00','tiago.m@email.com','+55 27 90011-9900','ativo',240000,'2026-05-11','CSV','2026-01-01'),
('INV-0021','Úrsula Bittencourt Ribeiro','759.826.314-00','ursula.b@email.com','+55 11 99012-1234','ativo',4750000,'2026-05-21','Indicação','2026-01-01'),
('INV-0022','Vinicius Antunes Borges','861.937.425-00','vinicius.a@email.com','+55 31 98923-5678','ativo',380000,'2026-05-10','CSV','2026-01-01'),
('INV-0023','Wesley Praxedes Lobato','972.148.536-00','wesley.p@email.com','+55 21 97834-3456','pendente_confirmacao',55000,'2026-04-28','Cadastro manual','2026-01-01'),
('INV-0024','Xênia Carvalho Furtado','183.259.647-00','xenia.c@email.com','+55 27 96745-7890','ativo',920000,'2026-05-18','CSV','2026-01-01'),
('INV-0025','Yuri Almeida Marcondes','294.361.758-00','yuri.a@email.com','+55 27 95656-1122','ativo',145000,'2026-05-15','CSV','2026-01-01'),
('INV-0026','Zilda Brandão Oliveira','305.472.869-00','zilda.b@email.com','+55 11 94567-3344','inativo',0,'2025-09-12','Importação SCP','2026-01-01'),
('INV-0027','Adriana Coelho Santos','416.583.971-00','adriana.c@email.com','+55 31 93478-5566','ativo',670000,'2026-05-12','CSV','2026-01-01'),
('INV-0028','Bernardo Pires Quintela','527.694.182-00','bernardo.q@email.com','+55 21 92389-7788','ativo',1100000,'2026-05-21','Indicação','2026-01-01'),
('INV-0029','Camila Duarte Esteves','638.715.293-00','camila.d@email.com','+55 27 91290-9900','ativo',78000,'2026-05-09','CSV','2026-01-01'),
('INV-0030','Diogo Falcão Rezende','749.826.314-00','diogo.f@email.com','+55 27 90101-1234','ativo',290000,'2026-05-16','CSV','2026-01-01'),
('INV-0031','Eliana Gomes Soares','850.937.425-00','eliana.g@email.com','+55 11 99012-5678','pendente_confirmacao',115000,'2026-05-03','Cadastro manual','2026-01-01'),
('INV-0032','Fábio Hering Ramalho','961.048.536-00','fabio.h@email.com','+55 31 98123-3456','ativo',2050000,'2026-05-20','Indicação','2026-01-01'),
('INV-0033','Giselle Itamar Pessoa','072.159.647-00','giselle.i@email.com','+55 21 97234-7890','ativo',195000,'2026-05-14','CSV','2026-01-01');

-- Valores de investimento zerados — preenchidos quando dados reais chegarem.
update public.investidores set valor_investido = 0;

-- ----------------------------------------------------------------
-- TEMPLATES
-- ----------------------------------------------------------------
insert into public.templates (id, nome, canal, assunto, resumo, conteudo, tags, usos, ultima_edicao, ativo) values
('TPL-001','Release de Resultados Trimestrais','email','Resultados do {{trimestre}} disponíveis — Grupo ICA','Prezado(a) {{nome}}, o Grupo ICA divulgou os resultados financeiros do {{trimestre}}...','<h2>Resultados do {{trimestre}}</h2><p>Prezado(a) {{nome}},</p><p>O Grupo ICA divulgou os resultados financeiros do {{trimestre}}. Acesse o material completo no portal.</p><p><a href=''{{url_kit}}''>Acessar Kit do Investidor</a></p>', array['trimestral','resultados','release'],12,'2026-05-18',true),
('TPL-002','Convite Teleconferência','email','Convite — Teleconferência de Resultados {{trimestre}}','Olá {{nome}}, convidamos você para a teleconferência de resultados do {{trimestre}}...','<h2>Teleconferência {{trimestre}}</h2><p>Olá {{nome}},</p><p>Convidamos você para nossa teleconferência em {{data}} às {{hora}}.</p>', array['convite','teleconferência','evento'],8,'2026-05-20',true),
('TPL-003','Aviso curto — WhatsApp Resultados','whatsapp',null,'Olá {{nome}}, os resultados do {{trimestre}} já estão no portal do investidor.','Olá {{nome}}, os resultados do {{trimestre}} já estão no portal do investidor. Acesse: {{url_kit}}', array['trimestral','curto'],14,'2026-05-21',true),
('TPL-004','Push — Novo Comunicado','push',null,'📊 Novo comunicado do Grupo ICA disponível no portal.','📊 Novo comunicado do Grupo ICA disponível no portal. Toque para ler.', array['comunicado','alerta'],32,'2026-05-19',true),
('TPL-005','Dividendos — Aviso de pagamento','email','Pagamento de dividendos confirmado — Grupo ICA','{{nome}}, confirmamos o pagamento de R$ {{valor_div}} referente aos seus dividendos...','<h2>Pagamento de dividendos</h2><p>{{nome}}, confirmamos o pagamento de R$ {{valor_div}} referente aos seus dividendos do exercício {{ano}}.</p><p>O crédito foi realizado em {{data}}.</p>', array['dividendos','pagamento'],4,'2026-05-15',true),
('TPL-006','Atualização da Reestruturação','email','Atualização da Fase {{fase}} — Reestruturação','Prezados investidores, comunicamos o andamento da Fase {{fase}} da reestruturação...','<h2>Atualização — Fase {{fase}}</h2><p>Prezados investidores,</p><p>Comunicamos o andamento da Fase {{fase}} da reestruturação societária do Grupo ICA.</p>', array['reestruturação','fase','fidc'],6,'2026-05-20',true),
('TPL-007','Onboarding — Boas-vindas','email','Bem-vindo(a) à área do investidor do Grupo ICA','Olá {{nome}}, sua conta de investidor foi criada. Acesse seus dados no portal...','<h2>Bem-vindo(a)</h2><p>Olá {{nome}}, sua conta foi criada com sucesso.</p><p>Acesse: {{url_portal}}</p>', array['onboarding','boas-vindas'],142,'2026-04-30',true),
('TPL-008','Lembrete — Documentação pendente','whatsapp',null,'{{nome}}, identificamos documentos pendentes no seu cadastro. Atualize em {{prazo}}.','Olá {{nome}}, identificamos documentos pendentes no seu cadastro. Atualize até {{prazo}} para manter sua conta ativa: {{url_docs}}', array['compliance','documentos'],38,'2026-05-10',false);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — navegação do header
-- ----------------------------------------------------------------
insert into public.nav_items (id, label, url, ordem, visivel) values
('nav-1','Governança Corporativa','#governanca',0,true),
('nav-2','Informações Financeiras','/demonstracoes',1,true),
('nav-3','Comunicados, Eventos e Replays','#comunicados',2,true),
('nav-4','Ação','#acao',3,true),
('nav-5','Serviços aos Investidores','#servicos',4,true);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — ações rápidas
-- ----------------------------------------------------------------
insert into public.quick_actions (id, label, href, ordem, visivel) values
('qa-1','FAQs','/em-construcao',0,true),
('qa-2','Resultados Trimestrais','/resultados',1,true),
('qa-3','Apresentação Institucional','/apresentacao',2,true);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — rodapé (colunas + links)
-- ----------------------------------------------------------------
insert into public.footer_colunas (id, titulo, ordem) values
('fc-1','Sobre a ICA',0),
('fc-2','Investidores',1),
('fc-3','Atendimento',2);

insert into public.footer_links (coluna_id, label, url, ordem) values
('fc-1','Quem somos','#',0),
('fc-1','Nossas soluções','#',1),
('fc-1','Governança','#',2),
('fc-1','Carreiras','#',3),
('fc-2','Informações financeiras','/demonstracoes',0),
('fc-2','Comunicados ao mercado','#comunicados',1),
('fc-2','Agenda do investidor','#eventos',2),
('fc-2','FAQ','#faqs',3),
('fc-3','Fale com RI','#contato',0),
('fc-3','Imprensa','#',1),
('fc-3','Ouvidoria','#',2),
('fc-3','Política de privacidade','#',3);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — redes sociais
-- ----------------------------------------------------------------
insert into public.redes_sociais (tipo, url, ordem) values
('linkedin','#',0),
('instagram','#',1),
('email','mailto:ri@grupoica.com.br',2),
('telefone','tel:+5527000000000',3);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — configuração institucional (singleton)
-- ----------------------------------------------------------------
insert into public.site_config (id, institucional_url, footer_descricao, footer_cnpj, footer_endereco, footer_copyright) values (
  1,
  'https://seugrupoica.com.br',
  'Relações com Investidores do Grupo ICA — transparência, governança e comunicação direta com nossos acionistas.',
  'CNPJ 00.000.000/0001-00',
  'Rua Exemplo, 1000 — Vitória/ES — Brasil',
  '© 2026 Grupo ICA. Todos os direitos reservados.'
);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — FAQ inicial
-- ----------------------------------------------------------------
insert into public.faqs (pergunta, resposta, categoria, ordem, publicado) values
('Como acesso a área do investidor?','Clique em "Área do Investidor" no topo do portal e entre com seu CPF e a senha cadastrada no primeiro acesso.','Acesso',0,true),
('Onde encontro os resultados trimestrais?','Os releases, apresentações e demonstrações financeiras de cada trimestre ficam no Kit do Investidor e na seção de Documentos.','Resultados',1,true),
('Como entro em contato com o time de RI?','Use o botão "Contato com RI" no portal ou escreva para ri@grupoica.com.br.','Contato',2,true),
('Quando ocorre a próxima teleconferência?','As datas das teleconferências e demais eventos ficam na agenda "Próximos Eventos" da home.','Eventos',3,true);

-- ----------------------------------------------------------------
-- USUÁRIOS DO SISTEMA (gestão pelo Super Admin)
-- senha_temp é PLACEHOLDER de dev — Fase 2 usa Supabase Auth.
-- ----------------------------------------------------------------
insert into public.usuarios (id, nome, email, cpf, papel, status, senha_temp, senha_definida) values
('usr-001','Vitão Uli','vitao@grupoica.com.br',null,'super_admin','ativo','admin123',true),
('usr-002','Renan Giacomin','renan@grupoica.com.br',null,'super_admin','ativo','admin123',true),
('usr-003','Ana Carolina Ferreira','ana.ferreira@email.com','123.456.789-00','investidor','ativo','invest123',true),
('usr-004','Bruno Lima Pereira','bruno.lima@email.com','987.654.321-00','investidor','ativo',null,false),
('usr-005','Felipe Antunes Costa','felipe.costa@email.com','789.123.456-00','investidor','inativo',null,false);

