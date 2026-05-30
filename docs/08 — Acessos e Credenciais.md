---
tags: [riica, acessos, credenciais, seguranca]
atualizado: 2026-05-29
---

# 08 — Acessos e Credenciais

← [[RIICA — Índice]]

> ⚠️ **Segurança**: este vault pode ser sincronizado/compartilhado. **Não guarde aqui senhas reais de produção.** Use um gerenciador de senhas (1Password, Bitwarden, etc.) para segredos. As chaves abaixo do Supabase são **defaults locais de desenvolvimento** (não secretas).

## Logins da aplicação (Fase 1 — SEM autenticação real)

> Hoje **nenhum login valida credencial**. Qualquer entrada funciona. Auth real entra na Fase 2 ([[09 — Roadmap e Fases]]).

### Super Admin / CMS — `/admin/login`
- **E-mail**: qualquer (vem pré-preenchido `vitao@grupoica.com.br`)
- **Senha**: qualquer
- Entra direto no dashboard.

### Área do Investidor — `/investidor/login`
- **CPF**: qualquer com 11 dígitos
- **Senha**: qualquer com 4+ caracteres
- CPF cadastrado → dados reais; CPF novo → "Investidor Visitante". Ver [[06 — Área do Investidor]] para CPFs de teste.

## Supabase local (desenvolvimento — não secreto)

Valores default do `supabase start` nesta máquina:

| Item | Valor |
|---|---|
| Project URL | `http://127.0.0.1:54321` |
| Publishable (anon) key | `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH` |
| Studio | `http://127.0.0.1:54323` |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

Essas variáveis ficam em `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). O `.env` está no `.gitignore`; o `.env.example` é versionado.

> Para produção (Supabase Cloud), as chaves serão **outras e secretas** — nunca commitar a `service_role` key.

## Domínio `.br` (registro.br)

- O Grupo ICA comprou um **domínio `.br`** para o portal.
- Conta no **registro.br**: e-mail `icaportalri@gmail.com`.
- 🔒 **A senha do registro.br NÃO está documentada aqui de propósito.** Está com o time/usuário. Recomendado guardar em gerenciador de senhas e **rotacionar** (foi compartilhada uma vez em chat).

## Contas relevantes

| Conta | Identificador | Onde |
|---|---|---|
| Repositório | `github.com/victorvixcard/RIICA` | GitHub |
| Dono/dev | `victoruli@gmail.com` | — |
| Registrador do domínio | `icaportalri@gmail.com` | registro.br |

Ver também: [[09 — Roadmap e Fases]]
