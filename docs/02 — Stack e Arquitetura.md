---
tags: [riica, stack, arquitetura]
atualizado: 2026-05-29
---

# 02 — Stack e Arquitetura

← [[RIICA — Índice]]

## Stack

### Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| **React** | 19 | UI |
| **TypeScript** | ~6.0 | Tipagem |
| **Vite** | 8 | Build/dev server |
| **React Router DOM** | 7 | Rotas (SPA, `BrowserRouter`) |
| **Tailwind CSS** | 3.4 | Estilos |
| **framer-motion** | 12 | Animações |
| **lucide-react** | — | Ícones (⚠️ sem ícones de marca; redes sociais usam SVG inline) |
| **recharts** | 3 | Gráficos (dashboard) |
| **react-hook-form + zod** | 7 / 4 | Formulários e validação |
| **papaparse** | 5 | Importação CSV de investidores |

### Backend
| Tecnologia | Papel |
|---|---|
| **Supabase** (Postgres + Auth + Storage) | Banco, API REST automática (PostgREST), storage de PDFs |
| **@supabase/supabase-js** 2 | Cliente no frontend |
| **Docker Desktop + WSL2** | Roda o stack Supabase local |

## Estrutura de pastas

```
Ri-ica/
├── src/
│   ├── App.tsx                 # rotas
│   ├── lib/
│   │   ├── supabase.ts         # cliente Supabase (lê .env)
│   │   ├── api/                # CAMADA DE API tipada (snake_case ↔ camelCase)
│   │   │   ├── content.ts      # CMS: comunicados, eventos, docs, kit, textos, nav, footer, quickactions, faq, config
│   │   │   ├── investidores.ts
│   │   │   ├── campanhas.ts · templates.ts · historico.ts
│   │   │   ├── financeiro.ts · atividades.ts
│   │   │   └── index.ts        # barrel
│   │   ├── csv.ts · utils.ts
│   ├── store/
│   │   ├── content.tsx         # ContentProvider (CMS) — state + dispatch, lê/grava no Supabase
│   │   ├── investors.tsx       # InvestorProvider
│   │   ├── types.ts            # tipos do conteúdo
│   │   └── seed.ts             # SEED placeholder (forma inicial até o refetch)
│   ├── pages/
│   │   ├── PortalRI.tsx · Demonstracoes.tsx
│   │   ├── investidor/ (Login, Area)
│   │   └── admin/ (Dashboard, Investidores, Campanhas, Templates, Historico, Configuracoes, Conteudo*)
│   ├── components/
│   │   ├── sections/ (Header, Hero, QuickActions, InfoGrid, Purpose, Footer)
│   │   ├── admin/ (layout: AdminShell, Sidebar, Topbar; csv; investidores; kpi)
│   │   └── brand/Logo.tsx
│   └── mock/                   # tipos legados (Campanha, Template, EnvioLog, Financeiro) — dados agora vêm do DB
├── supabase/
│   ├── config.toml             # project_id "Ri-ica", portas
│   ├── migrations/
│   │   ├── 20260529000001_init_schema.sql   # 17 tabelas núcleo
│   │   └── 20260529000002_cms_extended.sql  # 7 tabelas do CMS estendido
│   └── seed.sql                # dados iniciais
├── docs/                       # 📚 esta documentação (vault Obsidian)
├── .env / .env.example         # VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
└── .claude/launch.json         # config do preview (npm run dev, porta 5173)
```

## Fluxo de dados (importante)

```
Componente (ex: Header)
   ↓ useContent() / useInvestors()
Store (content.tsx / investors.tsx)
   ↓ dispatch(action)  →  optimista (setState) + persist()
Camada de API (src/lib/api/*)
   ↓ mapeia camelCase → snake_case
Supabase (@supabase/supabase-js → PostgREST)
   ↓
Postgres
```

- **Leitura**: no mount, o store chama `getContent()` / `getInvestidores()` e popula o estado. O `SEED` (em `store/seed.ts`) é só um placeholder visual até o refetch chegar.
- **Escrita**: `dispatch` faz **atualização otimista** local + persiste no Supabase + **refetch** para reconciliar (ids reais do banco).
- **Sincronia entre telas**: mesma aba navegando → instantâneo (estado compartilhado). Abas/dispositivos diferentes → só atualiza com **F5** (não há realtime ainda).

## Convenções

- Colunas do banco em **snake_case**; tipos do frontend em **camelCase**; o mapeamento vive na camada de API.
- Conjuntos fixos (status, tipos) via **CHECK constraints** (não enums) — mais fácil de evoluir.
- IDs: `text` com default `uuid`; o seed usa ids legados legíveis (ex: `doc-001`).

Ver também: [[03 — Backend Supabase]] · [[04 — Modelo de Dados]]
