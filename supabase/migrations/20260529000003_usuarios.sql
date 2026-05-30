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
