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
