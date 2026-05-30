---
tags: [riica, documentacao, sistema]
projeto: RIICA — Portal de Relações com Investidores do Grupo ICA
repositorio: github.com/victorvixcard/RIICA
atualizado: 2026-05-29
---

# 🏛️ RIICA — Documentação Completa do Sistema

> Portal de **Relações com Investidores (RI)** do **Grupo ICA**. Uma única SPA (React) que entrega **três experiências** num mesmo app, com backend **Supabase** (Postgres + Auth + Storage).
> Pasta local: `C:\Users\Administrador\OneDrive\Desktop\Sistemas\Ri-ica`

## Sumário

1. [Visão Geral](#1--visão-geral)
2. [Stack e Arquitetura](#2--stack-e-arquitetura)
3. [Backend Supabase](#3--backend-supabase)
4. [Modelo de Dados](#4--modelo-de-dados)
5. [Portal Público](#5--portal-público)
6. [Área do Investidor](#6--área-do-investidor)
7. [Painel Admin e CMS](#7--painel-admin-e-cms)
8. [Acessos e Credenciais](#8--acessos-e-credenciais)
9. [Roadmap e Fases](#9--roadmap-e-fases)

### Estado atual (resumo)
- ✅ **Fase 1** — dados + CRUDs ligados ao Supabase (sem autenticação real)
- ✅ **CMS total (prioridades 1–2)** — Navegação, Ações rápidas, Rodapé e FAQ editáveis
- ⏳ **Pendente** — editor do Financeiro, páginas das seções de menu, **autenticação real (Fase 2)**, hospedagem
- ⚠️ **Hoje não há login real**: qualquer credencial entra.

---

## 1 — Visão Geral

### Propósito
O RIICA é o portal de **Relações com Investidores** do **Grupo ICA** — ecossistema com mais de três décadas no mercado capixaba e nacional. Centraliza comunicação com o mercado, divulgação de resultados, documentos, eventos e a área logada do investidor.

### Os três frontends (numa mesma SPA)

| # | Frontend | Rota base | Para quem | Resumo |
|---|---|---|---|---|
| 1 | **Site RI público** | `/` | Mercado, acionistas, imprensa | Vitrine: hero, comunicados, eventos, kit, KPIs, propósito |
| 2 | **Área do Investidor** | `/investidor/*` | Investidores cadastrados | Login (CPF) + área logada |
| 3 | **Super Admin / CMS** | `/admin/*` | Time interno de RI | Investidores, campanhas, templates, histórico e **CMS total** |

### Princípio central
> **O painel admin é a fonte da verdade do portal.** Tudo que aparece no site público sai do banco e é editável no CMS — sem mexer em código.

### Domínios funcionais
- **CMS / Conteúdo** — comunicados, eventos, documentos, kit, textos, KPIs, ticker, navegação, ações rápidas, rodapé, FAQ
- **Investidores** — cadastro, status, valor investido, CPF, e-mail, WhatsApp, origem
- **Engajamento** — campanhas (e-mail/WhatsApp/push), templates, histórico de envios
- **Financeiro** — DRE e Balanço Patrimonial por período
- **Auditoria** — log de atividades

### Histórico de decisões
- **2026-05-29** — Backend: **Supabase local via Docker**. Estratégia: **dados/CRUDs primeiro, autenticação por último**.
- Grupo ICA comprou um **domínio `.br`** (registro.br) — hospedagem a definir.

---

## 2 — Stack e Arquitetura

### Stack — Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| React | 19 | UI |
| TypeScript | ~6.0 | Tipagem |
| Vite | 8 | Build/dev server |
| React Router DOM | 7 | Rotas (SPA, `BrowserRouter`) |
| Tailwind CSS | 3.4 | Estilos |
| framer-motion | 12 | Animações |
| lucide-react | — | Ícones (⚠️ sem ícones de marca; redes sociais usam SVG inline) |
| recharts | 3 | Gráficos (dashboard) |
| react-hook-form + zod | 7 / 4 | Formulários e validação |
| papaparse | 5 | Importação CSV de investidores |

### Stack — Backend
| Tecnologia | Papel |
|---|---|
| Supabase (Postgres + Auth + Storage) | Banco, API REST (PostgREST), storage de PDFs |
| @supabase/supabase-js 2 | Cliente no frontend |
| Docker Desktop + WSL2 | Roda o stack Supabase local |

### Estrutura de pastas
```
Ri-ica/
├── src/
│   ├── App.tsx                 # rotas
│   ├── lib/
│   │   ├── supabase.ts         # cliente Supabase (lê .env)
│   │   └── api/                # CAMADA DE API tipada (snake_case ↔ camelCase)
│   │       ├── content.ts      # CMS completo
│   │       ├── investidores.ts · campanhas.ts · templates.ts
│   │       ├── historico.ts · financeiro.ts · atividades.ts · index.ts
│   ├── store/
│   │   ├── content.tsx         # ContentProvider (CMS) — state + dispatch
│   │   ├── investors.tsx       # InvestorProvider
│   │   ├── types.ts · seed.ts
│   ├── pages/
│   │   ├── PortalRI.tsx · Demonstracoes.tsx
│   │   ├── investidor/ (Login, Area)
│   │   └── admin/ (Dashboard, Investidores, Campanhas, Templates, Historico, Configuracoes, Conteudo*)
│   ├── components/
│   │   ├── sections/ (Header, Hero, QuickActions, InfoGrid, Purpose, Footer)
│   │   ├── admin/ (layout, csv, investidores, kpi) · brand/Logo.tsx
│   └── mock/                   # tipos legados (dados agora vêm do DB)
├── supabase/
│   ├── config.toml
│   ├── migrations/ (20260529000001_init_schema · 20260529000002_cms_extended)
│   └── seed.sql
├── docs/                       # esta documentação
├── .env / .env.example
└── .claude/launch.json
```

### Fluxo de dados
```
Componente → useContent()/useInvestors()
  → Store (dispatch: otimista + persist)
    → Camada de API (camelCase → snake_case)
      → Supabase (PostgREST) → Postgres
```
- **Leitura**: no mount o store faz `getContent()` / `getInvestidores()`. O `SEED` é placeholder até o refetch.
- **Escrita**: `dispatch` faz update otimista + persiste + refetch (reconcilia ids).
- **Sincronia**: mesma aba = instantâneo; abas diferentes = **F5** (sem realtime ainda).

### Convenções
- Banco em **snake_case**, frontend em **camelCase** (mapeado na API).
- Conjuntos fixos via **CHECK** (não enums).
- IDs `text` com default uuid; seed usa ids legíveis (`doc-001`).

---

## 3 — Backend Supabase

### Pré-requisitos (instalados 2026-05-29)
- WSL2 (`wsl --install`), Docker Desktop 4.74+ ("Engine running"), Node 24 + npx.

### Subir o ambiente (toda vez que ligar o PC)
```powershell
# 1) Abrir Docker Desktop e esperar "Engine running"
cd "C:\Users\Administrador\OneDrive\Desktop\Sistemas\Ri-ica"
npx supabase start
npm run dev          # frontend na porta 5173
```

### Comandos úteis
| Comando | O que faz |
|---|---|
| `npx supabase start` / `stop` | Sobe / derruba o stack |
| `npx supabase status` | Mostra URLs e chaves |
| `npx supabase db reset` | **Recria** o banco: migrations + seed (apaga dados!) |
| `npx supabase migration new <nome>` | Nova migration |

### Endereços locais
| Serviço | URL |
|---|---|
| API (PostgREST) | http://127.0.0.1:54321 |
| **Studio** | http://127.0.0.1:54323 |
| Mailpit | http://127.0.0.1:54324 |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

### Migrations & Seed
- `20260529000001_init_schema.sql` — 17 tabelas núcleo + triggers `updated_at` + bucket Storage `documentos`.
- `20260529000002_cms_extended.sql` — 7 tabelas do CMS estendido.
- `seed.sql` — dados de demonstração (roda no `db reset`).

> **Fase 1**: RLS **desabilitada**; `anon`/`authenticated` com acesso total. Será trocado por **RLS + policies** na Fase 2.

### Consultar o banco (debug)
```powershell
docker exec supabase_db_Ri-ica psql -U postgres -d postgres -c "select count(*) from investidores;"
```

### Storage
Bucket público `documentos`. Hoje guarda só o **nome do arquivo** (mock); upload real de PDFs entra depois.

---

## 4 — Modelo de Dados

24 tabelas no schema `public` (snake_case).

### CMS / Conteúdo
- **documentos** — `id, titulo, categoria, periodo, arquivo, tamanho, data_publicacao, publico, tag`. Categorias: release, apresentacao, demonstracao, ata, regulamento, fato_relevante, comunicado, formulario, outro.
- **comunicados** — `id, data, titulo, resumo, documento_id→documentos, link, destaque, publicado`.
- **eventos** — `id, data, hora, titulo, tipo, local, link_inscricao, publicado`. Tipos: Conferência, Presencial, Virtual, APIMEC, Investor Day, Assembleia.
- **kit_trimestre** + **kit_documentos** (→documentos) + **kit_links** — Kit do Investidor do trimestre ativo.
- **site_textos** (singleton id=1) — Hero e Purpose em jsonb.
- **kpis** — `valor, label, ordem`.
- **ticker** — `simbolo, preco, variacao, positivo, ordem`.
- **nav_items** — menu do header: `label, url, ordem, visivel`.
- **quick_actions** — botões do hero: `label, href, ordem, visivel`.
- **footer_colunas** + **footer_links** (→coluna) — colunas de links do rodapé.
- **redes_sociais** — `tipo (linkedin/instagram/facebook/youtube/x/email/telefone), url, ordem`.
- **site_config** (singleton id=1) — `institucional_url, footer_descricao, footer_cnpj, footer_endereco, footer_copyright`.
- **faqs** — `pergunta, resposta, categoria, ordem, publicado`.

### Investidores
- **investidores** — `id, nome, cpf (único), email, whatsapp, status, valor_investido, ultimo_contato, origem, tags[], criado_em`. Status: ativo, pendente_confirmacao, bloqueado, inativo. Origem: CSV, Cadastro manual, Importação SCP, Indicação.

### Engajamento
- **templates** — `nome, canal (email/whatsapp/push), assunto, resumo, conteudo, tags[], usos, ultima_edicao, ativo`.
- **campanhas** — `titulo, canais[], status, audiencia_total, entregues, abertura, agendada_para, template_ref, criada_em`. Status: rascunho, agendada, enviando, concluida, falhou.
- **envios** — log por destinatário: `campanha_id→campanhas, destinatario_nome, destinatario_contato, canal, status, enviado_em, aberto_em, clicado_em, erro`. Status: entregue, aberto, clicado, falhou, bouncing, pendente.

### Financeiro
- **periodos_financeiros** — `id, trimestre, ano, publicado, ordem` (P-1T26, P-4T25...).
- **linhas_financeiras** — `demonstracao (dre/balanco_ativo/balanco_passivo), conta, ordem, destaque, nivel (0/1/2)`.
- **valores_financeiros** — `linha_id→linhas, periodo_id→periodos, valor` (PK composta).

### Auditoria
- **atividades** — `tipo (envio/import/campanha/login/edicao), texto, meta, created_at`.

### Relações principais
```
comunicados.documento_id      → documentos
kit_documentos.{kit_id,documento_id} → kit_trimestre, documentos
kit_links.kit_id              → kit_trimestre
footer_links.coluna_id        → footer_colunas
envios.campanha_id            → campanhas
valores_financeiros.{linha_id,periodo_id} → linhas_financeiras, periodos_financeiros
```
Cascades: apagar documento limpa referência em comunicados e remove do Kit; apagar coluna do rodapé remove seus links; apagar campanha remove seus envios.

---

## 5 — Portal Público

Rota `/` (componente `PortalRI.tsx`). Tudo sai do banco e é editável no CMS.

### Seções da home
| Seção | Componente | O que mostra | Editável em |
|---|---|---|---|
| Header | `Header.tsx` | Logo, ticker, botão Institucional, Área do Investidor, PT/EN, **menu** | Navegação + Ticker + Institucional |
| Hero | `Hero.tsx` | Título, subtítulo, descrição, 2 CTAs | Textos institucionais |
| Ações rápidas | `QuickActions.tsx` | Faixa de botões | Ações rápidas |
| InfoGrid | `InfoGrid.tsx` | Últimas Atualizações, Kit do Investidor, Próximos Eventos | Comunicados / Kit / Eventos |
| Purpose | `Purpose.tsx` | "Quem somos" + KPIs | Textos institucionais |
| Footer | `Footer.tsx` | Descrição, colunas de links, redes, CNPJ, endereço | Rodapé |

### Demonstrações Financeiras
Rota `/demonstracoes` — DRE e Balanço por período. Lê do banco; **ainda sem editor no admin** (pendente).

### Regras de exibição
- Comunicados/FAQ: só `publicado = true`.
- Eventos: `publicado = true` **e** data futura.
- Documentos: só `publico = true`.
- Navegação/Ações rápidas: só `visivel = true`, ordenados por `ordem`.

### Itens de menu ainda sem página
Só **Informações Financeiras** (`/demonstracoes`) tem página. Governança, Ação e Serviços são âncoras vazias (pendente).

---

## 6 — Área do Investidor

| Rota | Componente | Função |
|---|---|---|
| `/investidor/login` | `investidor/Login.tsx` | Entrada por CPF + senha |
| `/investidor/area` | `investidor/Area.tsx` | Área logada |

### Login (SEM auth real)
- CPF (formata `000.000.000-00`) + senha.
- CPF com 11 dígitos; existente → dados reais; novo → "Investidor Visitante".
- Status `bloqueado`/`inativo` → erro. Senha aceita qualquer valor (≥4 chars).
- Sessão em `sessionStorage` (chave `investidor`). Sem token/2FA.

### Área logada
Cabeçalho (nome + Sair), cards (Valor Investido, Status, Último Contato), Últimos Comunicados, Próximos Eventos, Documentos. Sem sessão → redireciona ao login.

### CPFs de teste (base seed)
| CPF | Investidor | Status |
|---|---|---|
| `123.456.789-00` | Ana Carolina Ferreira | ativo |
| `987.654.321-00` | Bruno Lima Pereira | ativo |
| `789.123.456-00` | Felipe Antunes Costa | **bloqueado** |
| `258.369.147-00` | Henrique Toledo Pacheco | **inativo** |

Qualquer outro CPF de 11 dígitos → "Investidor Visitante".

---

## 7 — Painel Admin e CMS

Rota base `/admin`. Layout `AdminShell` (Sidebar + Topbar). Login `/admin/login`.
> 🔓 Login sem auth real: qualquer e-mail + senha entram.

### Menu lateral
**Operação**
| Menu | Rota | O que faz |
|---|---|---|
| Dashboard | `/admin/dashboard` | KPIs, gráfico de envios (30 dias), atividades recentes |
| Investidores | `/admin/investidores` | Lista/filtra/busca, importa CSV, CRUD, altera status (`investidores`) |
| Campanhas | `/admin/campanhas` (+ `/nova`) | Campanhas multicanal com status e métricas |

**Conteúdo & Comunicação**
| Menu | Rota | O que faz |
|---|---|---|
| Conteúdo do site | `/admin/conteudo` | Hub do CMS (cards abaixo) |
| Templates | `/admin/templates` | Modelos de mensagem com variáveis `{{nome}}` etc. (`templates`) |
| Histórico | `/admin/historico` | Log de envios por destinatário (`envios`) |

**Configurações** — `/admin/configuracoes` — preferências gerais.

### CMS — cards de "Conteúdo do site"
| Card | Rota | Controla no site | Tabela(s) |
|---|---|---|---|
| Comunicados | `/admin/conteudo/comunicados` | "Últimas atualizações" | `comunicados` |
| Eventos | `/admin/conteudo/eventos` | "Próximos Eventos" | `eventos` |
| Documentos | `/admin/conteudo/documentos` | Repositório de PDFs | `documentos` |
| Kit do Investidor | `/admin/conteudo/kit` | Trimestre + destaques + links | `kit_trimestre`, `kit_documentos`, `kit_links` |
| Textos institucionais | `/admin/conteudo/textos` | Hero, Purpose, KPIs, Ticker | `site_textos`, `kpis`, `ticker` |
| **Navegação** ⭐ | `/admin/conteudo/navegacao` | Menu do header | `nav_items` |
| **Ações rápidas** ⭐ | `/admin/conteudo/acoes` | Botões do hero | `quick_actions` |
| **Rodapé** ⭐ | `/admin/conteudo/rodape` | Descrição, links, redes, CNPJ, endereço, copyright, institucional | `footer_colunas`, `footer_links`, `redes_sociais`, `site_config` |
| **FAQ** ⭐ | `/admin/conteudo/faq` | Perguntas frequentes | `faqs` |

⭐ = adicionados na etapa "CMS total" (2026-05-29).

### Padrões de edição
- **CRUD em lista com modal** (Comunicados, Eventos, FAQ).
- **Lista inline com "Salvar"** (Navegação, Ações rápidas) — reordenar, adicionar/remover, salva a lista inteira.
- **Multi-seção** (Rodapé) com "Salvar tudo".
- Save = otimista local → persiste na API → refetch. Outras abas: **F5**.

---

## 8 — Acessos e Credenciais

> ⚠️ **Segurança**: não guarde senhas reais de produção neste arquivo (pode ser sincronizado). Use um gerenciador de senhas. As chaves do Supabase abaixo são **defaults locais de dev** (não secretas).

### Logins da aplicação (Fase 1 — SEM auth real)
**Super Admin / CMS** — `/admin/login` — e-mail qualquer (pré-preenchido `vitao@grupoica.com.br`) + senha qualquer.
**Área do Investidor** — `/investidor/login` — CPF de 11 dígitos + senha ≥4 chars.

### Supabase local (não secreto)
| Item | Valor |
|---|---|
| Project URL | `http://127.0.0.1:54321` |
| Publishable (anon) key | `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH` |
| Studio | `http://127.0.0.1:54323` |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

Variáveis em `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). `.env` no `.gitignore`; `.env.example` versionado.
> Produção (Supabase Cloud): chaves serão outras e secretas — nunca commitar a `service_role`.

### Domínio `.br` (registro.br)
- Conta: e-mail `icaportalri@gmail.com`.
- 🔒 **Senha NÃO documentada de propósito** — guardar em gerenciador de senhas e **rotacionar**.

### Contas
| Conta | Identificador |
|---|---|
| Repositório | `github.com/victorvixcard/RIICA` |
| Dono/dev | `victoruli@gmail.com` |
| Registrador do domínio | `icaportalri@gmail.com` |

---

## 9 — Roadmap e Fases

### ✅ Concluído
- **Fundação do backend**: Supabase local, 24 tabelas, camada de API, Docker+WSL2.
- **Migração dos stores**: `content.tsx` e `investors.tsx` de localStorage → Supabase.
- **Área do Investidor**: login (sem auth real) + área logada.
- **CMS total — prioridades 1 e 2**: Navegação, Ações rápidas, Rodapé e FAQ editáveis; Header/QuickActions/Footer leem do banco.

### ✅ Gestão de Usuários (Fase 1)
- Menu **Usuários** (`/admin/usuarios`): CRUD, papel (super_admin/investidor), ativar/desativar, definir/resetar senha (placeholder). Tabela `usuarios`. Mesmo CPF pode ser investidor (`/investidor`) e usuário do sistema (`/admin`).

### ⏳ Pendente
- **CMS prioridade 3**: editor do Financeiro (DRE/Balanço) no admin.
- **CMS prioridade 4**: páginas reais das seções de menu (Governança, Ação, Serviços) + FAQ pública.
- **Onboarding via CSV + credenciais por e-mail**: no import, opção "Gerar credenciais? Sim/Não" → cria `usuarios` (papel investidor) → selecionar toda a base ou selecionados e **enviar credenciais por e-mail**. Requer infra de e-mail (Mailpit em dev :54324; provedor/Edge Function em prod). Checkbox + geração de registros é Fase 1; envio real + senha de verdade é Fase 2.
- **Fase 2 — Autenticação real** (deixada por último): Supabase Auth, papéis, **RLS + policies**, **infra de e-mail** (reset de senha, credenciais). Implementar só depois de testar acessos e sincronia.
- **Infra**: hospedagem (SPA estática + Supabase Cloud, ou VPS); apontar domínio `.br`; upload real de PDFs; Realtime opcional.

### Decisões de arquitetura registradas
- **Blocos estruturados** no CMS, não page-builder livre.
- Backend Supabase; dados/CRUDs **antes** da auth.
- Sincronia: refetch + **F5** (realtime adiado).

---

*Documento gerado em 2026-05-29. Versão consolidada das notas individuais em `docs/`.*
