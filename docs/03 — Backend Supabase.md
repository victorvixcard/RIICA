---
tags: [riica, backend, supabase, docker]
atualizado: 2026-05-29
---

# 03 — Backend Supabase

← [[RIICA — Índice]]

## Pré-requisitos (instalados em 2026-05-29)

- **WSL2** (`wsl --install`)
- **Docker Desktop** 4.74+ (precisa estar com **"Engine running"**)
- **Node** 24 + **npx** (o CLI do Supabase roda via `npx supabase`)

## Como subir o ambiente (toda vez que ligar o PC)

```powershell
# 1) Abrir o Docker Desktop e esperar "Engine running"
# 2) No diretório do projeto:
cd "C:\Users\Administrador\OneDrive\Desktop\Sistemas\Ri-ica"
npx supabase start          # sobe Postgres + Auth + Storage + Studio
npm run dev                 # sobe o frontend (porta 5173)
```

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npx supabase start` | Sobe o stack local |
| `npx supabase stop` | Derruba o stack |
| `npx supabase status` | Mostra URLs e chaves |
| `npx supabase db reset` | **Recria o banco**: aplica migrations + seed (apaga dados!) |
| `npx supabase migration new <nome>` | Cria nova migration vazia |

## Endereços locais

| Serviço | URL |
|---|---|
| API (PostgREST) | http://127.0.0.1:54321 |
| **Studio** (UI do banco) | http://127.0.0.1:54323 |
| Mailpit (e-mails de teste) | http://127.0.0.1:54324 |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

## Migrations & Seed

- `supabase/migrations/20260529000001_init_schema.sql` — 17 tabelas núcleo + triggers `updated_at` + bucket de Storage `documentos`.
- `supabase/migrations/20260529000002_cms_extended.sql` — 7 tabelas do CMS estendido (nav, quick_actions, footer, redes, config, faqs).
- `supabase/seed.sql` — popula tudo com os dados de demonstração. Roda automaticamente no `db reset`.

> **Acesso na Fase 1**: RLS **desabilitada**; `anon` e `authenticated` têm acesso total (via `grant all`). Isso é intencional para desenvolvimento sem auth. Será trocado por **RLS + policies** na Fase 2. Ver [[09 — Roadmap e Fases]].

## Consultar o banco direto (debug)

```powershell
docker exec supabase_db_Ri-ica psql -U postgres -d postgres -c "select count(*) from investidores;"
```

## Storage

Bucket público `documentos` criado na migration. Hoje os documentos guardam apenas o **nome do arquivo** (mock); o upload real de PDFs entra quando ligarmos o Storage de fato.

Ver também: [[04 — Modelo de Dados]] · [[08 — Acessos e Credenciais]]
