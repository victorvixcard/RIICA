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
