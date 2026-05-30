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
