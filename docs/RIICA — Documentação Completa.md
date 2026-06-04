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
9. [Onboarding via CSV + e-mail](#9--onboarding-via-csv--e-mail)
10. [Modo "Em Breve" do Portal](#10--modo-em-breve-do-portal)
11. [Roadmap e Fases](#11--roadmap-e-fases)

### Estado atual (snapshot 2026-05-29)
- ✅ **Backend Supabase** completo (5 migrations, seed, RLS)
- ✅ **Autenticação real** (Fase 2): Supabase Auth, papéis, login admin + investidor, **RLS habilitada**
- ✅ **CMS total**: Navegação, Ações rápidas, Rodapé, FAQ, Textos, Comunicados, Eventos, Documentos, Kit — todos editáveis pelo admin
- ✅ **Gestão de Usuários** com geração/envio de credenciais por e-mail (dev via Mailpit)
- ✅ **Modo "Em breve"** ligado em todo o portal: ticker removido, KPIs zerados, demonstrações financeiras com placeholder, links levam a páginas em construção
- ⏳ **Pendente**: editor do Financeiro (DRE/Balanço) no admin, páginas reais das seções de menu (Governança, Ação, Serviços), e-mail de produção via Resend

---

## 1 — Visão Geral

### Propósito
O RIICA é o portal de **Relações com Investidores** do **Grupo ICA** — ecossistema com mais de três décadas no mercado capixaba e nacional. Centraliza comunicação com o mercado, divulgação de resultados, documentos, eventos e a área logada do investidor.

### Os três frontends (numa mesma SPA)

| # | Frontend | Rota base | Para quem | Resumo |
|---|---|---|---|---|
| 1 | **Site RI público** | `/` | Mercado, acionistas, imprensa | Vitrine: hero, comunicados, eventos, kit, KPIs, propósito |
| 2 | **Área do Investidor** | `/investidor/*` | Investidores cadastrados | Login (CPF) + área logada |
| 3 | **Super Admin / CMS** | `/admin/*` | Time interno de RI | Investidores, usuários, campanhas, templates, histórico e **CMS total** |

### Princípio central
> **O painel admin é a fonte da verdade do portal.** Tudo que aparece no site público sai do banco e é editável no CMS — sem mexer em código.

### Domínios funcionais
- **CMS / Conteúdo** — comunicados, eventos, documentos, kit, textos, KPIs, ticker, navegação, ações rápidas, rodapé, FAQ
- **Investidores** — cadastro, status, valor investido, CPF, e-mail, WhatsApp, origem
- **Usuários do sistema** — contas com papel `super_admin` ou `investidor`, com geração de credenciais e provisionamento no Supabase Auth
- **Engajamento** — campanhas (e-mail/WhatsApp/push), templates, histórico de envios
- **Financeiro** — DRE e Balanço Patrimonial por período
- **Auditoria** — log de atividades

### Histórico de decisões
- **2026-05-29** — Backend: **Supabase local via Docker**. Estratégia: dados/CRUDs primeiro, autenticação por último (concluída ainda no mesmo dia após validação dos fluxos).
- Grupo ICA comprou um **domínio `.br`** (registro.br) — hospedagem decidida: gerenciada (Vercel/Cloudflare Pages + Supabase Cloud + Resend).
- O Portal está em **modo "Em breve"** — placeholders prontos para receber dados reais quando o conteúdo for liberado.

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
| nodemailer | — | Envio de e-mail (lado dev, via plugin do Vite) |

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
│   ├── App.tsx                 # rotas (públicas, /investidor, /admin, placeholders)
│   ├── lib/
│   │   ├── supabase.ts         # cliente Supabase (lê .env)
│   │   └── api/                # CAMADA DE API tipada (snake_case ↔ camelCase)
│   │       ├── content.ts      # CMS completo (incl. nav, footer, faqs, etc.)
│   │       ├── investidores.ts · campanhas.ts · templates.ts
│   │       ├── historico.ts · financeiro.ts · atividades.ts
│   │       ├── usuarios.ts     # CRUD + senhas + envio de credenciais
│   │       └── index.ts        # barrel
│   ├── store/
│   │   ├── auth.tsx            # AuthProvider (Supabase Auth, sessão, papel)
│   │   ├── content.tsx         # ContentProvider — state + dispatch, refetch on session
│   │   ├── investors.tsx       # InvestorProvider — idem
│   │   ├── types.ts · seed.ts  # tipos + placeholder inicial
│   ├── pages/
│   │   ├── PortalRI.tsx · Demonstracoes.tsx · PaginaEmBreve.tsx
│   │   ├── investidor/ (Login, Area)
│   │   └── admin/ (Dashboard, Investidores, Usuarios, Campanhas,
│   │              Templates, Historico, Configuracoes, Conteudo*)
│   ├── components/
│   │   ├── PlaceholderEmBreve.tsx   # card reutilizável "Em breve"
│   │   ├── sections/ (Header, Hero, QuickActions, InfoGrid, Purpose, Footer)
│   │   ├── admin/ (layout, csv, investidores, kpi) · brand/Logo.tsx
│   └── mock/                   # tipos legados (dados vivem no DB)
├── supabase/
│   ├── config.toml
│   └── migrations/
│       ├── 20260529000001_init_schema.sql      # núcleo (17 tabelas)
│       ├── 20260529000002_cms_extended.sql     # nav/footer/quickactions/faq
│       ├── 20260529000003_usuarios.sql         # usuarios (Fase 1, senha placeholder)
│       ├── 20260529000004_auth.sql             # auth_id + RPC email_por_cpf
│       └── 20260529000005_rls.sql              # RLS + policies por papel
│   └── seed.sql                # dados iniciais (sem números fictícios)
├── scripts/
│   └── seed-auth.mjs           # cria auth.users a partir de usuarios + senha_temp
├── vite-plugins/
│   └── credenciais-mailer.ts   # middleware dev: POST /api/enviar-credenciais
├── docs/                       # esta documentação
├── .env / .env.example         # vars do Vite + service role (lado Node, não exposto)
└── .claude/launch.json
```

### Fluxo de dados
```
Componente → useContent()/useInvestors()/useAuth()
  → Store (dispatch: otimista + persist)
    → Camada de API (camelCase → snake_case)
      → Supabase (PostgREST) → Postgres
```
- **Leitura**: no mount, ou quando a sessão muda, os stores chamam `getContent()` / `getInvestidores()`. O `SEED` é placeholder até o refetch.
- **Escrita**: `dispatch` faz update otimista + persiste + refetch.
- **Sincronia**: mesma aba = instantâneo; abas diferentes = **F5** (sem realtime).

### Convenções
- Banco em **snake_case**, frontend em **camelCase** (mapeado na API).
- Conjuntos fixos via **CHECK** (não enums).
- IDs `text` com default uuid; seed usa ids legíveis (`doc-001`, `INV-0001`).

> ⚠️ **Gotcha do supabase-js:** NUNCA fazer query (await) dentro do callback `onAuthStateChange` — causa deadlock no lock de auth. Carregar perfil em effect separado keyed em `session.user.id`.

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
| `npx supabase db reset` | **Recria** o banco: migrations + seed (apaga dados, incluindo auth.users) |
| `npm run seed:auth` | (Re)cria auth.users a partir de `usuarios` com `senha_definida` |
| `npx supabase migration new <nome>` | Nova migration |

> Depois de `db reset`, **sempre rodar `npm run seed:auth`** para recriar as contas de login.

### Endereços locais
| Serviço | URL |
|---|---|
| API (PostgREST) | http://127.0.0.1:54321 |
| **Studio** | http://127.0.0.1:54323 |
| Mailpit (e-mails dev) | http://127.0.0.1:54324 |
| Mailpit SMTP | localhost:54325 (interno: `supabase_inbucket_Ri-ica:1025`) |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

### Migrations
| Arquivo | O que cria |
|---|---|
| `20260529000001_init_schema.sql` | 17 tabelas núcleo + triggers `updated_at` + bucket Storage `documentos` |
| `20260529000002_cms_extended.sql` | 7 tabelas do CMS estendido (nav, quick_actions, footer, redes, config, faqs) |
| `20260529000003_usuarios.sql` | Tabela `usuarios` (papéis, status, senha_temp placeholder) |
| `20260529000004_auth.sql` | Coluna `usuarios.auth_id`, RPC `email_por_cpf`, função `meu_papel()` |
| `20260529000005_rls.sql` | RLS habilitada + policies por papel, função `meu_cpf()` |

### RLS — modelo de acesso
- **anon** → lê conteúdo público (publicado/publico/sem gate), 0 acesso a PII
- **super_admin** → lê e escreve tudo
- **investidor** → lê o próprio registro de investidores + o próprio perfil de usuário + conteúdo publicado

Funções auxiliares (security definer, bypassam RLS):
- `public.meu_papel()` → papel do usuário atual
- `public.meu_cpf()` → CPF (só dígitos) do usuário atual
- `public.email_por_cpf(p_cpf text)` → mapeia CPF → e-mail (pré-login do investidor)

### Consultar o banco (debug)
```powershell
docker exec supabase_db_Ri-ica psql -U postgres -d postgres -c "select count(*) from investidores;"
```

### Storage
Bucket público `documentos`. Hoje guarda só o **nome do arquivo** (mock); upload real de PDFs entra com a fase de hospedagem.

---

## 4 — Modelo de Dados

25 tabelas no schema `public` (snake_case). RLS habilitada em todas.

### CMS / Conteúdo
- **documentos** — `id, titulo, categoria, periodo, arquivo, tamanho, data_publicacao, publico, tag`. Categorias: release, apresentacao, demonstracao, ata, regulamento, fato_relevante, comunicado, formulario, outro.
- **comunicados** — `id, data, titulo, resumo, documento_id→documentos, link, destaque, publicado`.
- **eventos** — `id, data, hora, titulo, tipo, local, link_inscricao, publicado`. Tipos: Conferência, Presencial, Virtual, APIMEC, Investor Day, Assembleia.
- **kit_trimestre** + **kit_documentos** (→documentos) + **kit_links** — Kit do Investidor do trimestre ativo.
- **site_textos** (singleton id=1) — Hero e Purpose em jsonb.
- **kpis** — `valor, label, ordem`. (Vazio no estado "Em breve".)
- **ticker** — `simbolo, preco, variacao, positivo, ordem`. (Vazio; não rendered no Header.)
- **nav_items** — menu do header: `label, url, ordem, visivel`.
- **quick_actions** — botões do hero: `label, href, ordem, visivel`.
- **footer_colunas** + **footer_links** (→coluna) — colunas de links do rodapé.
- **redes_sociais** — `tipo (linkedin/instagram/facebook/youtube/x/email/telefone), url, ordem`.
- **site_config** (singleton id=1) — `institucional_url, footer_descricao, footer_cnpj, footer_endereco, footer_copyright`.
- **faqs** — `pergunta, resposta, categoria, ordem, publicado`.

### Investidores
- **investidores** — `id, nome, cpf (único), email, whatsapp, status, valor_investido, ultimo_contato, origem, tags[], criado_em`. Status: ativo, pendente_confirmacao, bloqueado, inativo. Origem: CSV, Cadastro manual, Importação SCP, Indicação. **No estado atual `valor_investido = 0` para todos.**

### Usuários do sistema
- **usuarios** — `id, nome, email (único), cpf, papel (super_admin/investidor), status (ativo/inativo), senha_temp, senha_definida, auth_id→auth.users, ultimo_acesso, created_at, updated_at`.

### Engajamento (vazias no estado atual)
- **templates** — `nome, canal (email/whatsapp/push), assunto, resumo, conteudo, tags[], usos, ultima_edicao, ativo`.
- **campanhas** — `titulo, canais[], status, audiencia_total, entregues, abertura, agendada_para, template_ref, criada_em`. Status: rascunho, agendada, enviando, concluida, falhou.
- **envios** — log por destinatário: `campanha_id→campanhas, destinatario_nome, destinatario_contato, canal, status, enviado_em, aberto_em, clicado_em, erro`. Status: entregue, aberto, clicado, falhou, bouncing, pendente.

### Financeiro (vazias no estado atual)
- **periodos_financeiros** — `id, trimestre, ano, publicado, ordem` (P-1T26, etc.).
- **linhas_financeiras** — `demonstracao (dre/balanco_ativo/balanco_passivo), conta, ordem, destaque, nivel (0/1/2)`.
- **valores_financeiros** — `linha_id→linhas, periodo_id→periodos, valor` (PK composta).

### Auditoria (vazia no estado atual)
- **atividades** — `tipo (envio/import/campanha/login/edicao), texto, meta, created_at`.

### Relações principais
```
comunicados.documento_id      → documentos
kit_documentos.{kit_id,documento_id} → kit_trimestre, documentos
kit_links.kit_id              → kit_trimestre
footer_links.coluna_id        → footer_colunas
envios.campanha_id            → campanhas
valores_financeiros.{linha_id,periodo_id} → linhas_financeiras, periodos_financeiros
usuarios.auth_id              → auth.users
```

---

## 5 — Portal Público

Rota `/` (componente `PortalRI.tsx`). Tudo sai do banco e é editável no CMS.

### Seções da home
| Seção | Componente | O que mostra | Editável em |
|---|---|---|---|
| Header | `Header.tsx` | Logo, botão Institucional, Área do Investidor, PT/EN, **menu** | Navegação + Institucional |
| Hero | `Hero.tsx` | Eyebrow ("Resultados em breve"), título, descrição, **2 CTAs** | Textos institucionais |
| Ações rápidas | `QuickActions.tsx` | 3 botões: FAQs, Resultados Trimestrais, Apresentação Institucional | Ações rápidas |
| InfoGrid | `InfoGrid.tsx` | 3 colunas: Comunicados, Kit, Eventos | Comunicados / Kit / Eventos |
| Purpose | `Purpose.tsx` | "Quem somos" + KPIs (ou placeholder) | Textos institucionais |
| Footer | `Footer.tsx` | Descrição, colunas de links, redes, CNPJ, endereço | Rodapé |

### CTAs do Hero
- **Primário** "Acessar Kit do Investidor" → `/em-construcao`
- **Secundário** "Formas de Contato" → `/contato`

### Quick Actions (3)
- FAQs → `/em-construcao`
- Resultados Trimestrais → `/resultados` ("Os resultados serão divulgados em breve")
- Apresentação Institucional → `/apresentacao` ("Em breve será divulgada")

### Páginas placeholder
| Rota | Mensagem |
|---|---|
| `/em-construcao` | Esta área está sendo preparada e ficará disponível em breve |
| `/resultados` | Os resultados serão divulgados em breve |
| `/apresentacao` | Em breve será divulgada a apresentação institucional |
| `/contato` | Em breve disponibilizaremos os canais de atendimento. Enquanto isso, ri@grupoica.com.br |

### Demonstrações Financeiras
Rota `/demonstracoes` — DRE e Balanço por período. **Atualmente sem dados** → mostra placeholder **"Em breve"** com o texto "As demonstrações financeiras serão exibidas aqui assim que o portal estiver 100% concluído para o investidor".

### Regras de exibição
- Comunicados/FAQ: só `publicado = true`.
- Eventos: `publicado = true` **e** data futura.
- Documentos: só `publico = true`.
- Navegação/Ações rápidas: só `visivel = true`, ordenados por `ordem`.
- KPIs: array vazio → placeholder "Em breve" no Purpose.

### Itens de menu ainda sem página
Só **Informações Financeiras** (`/demonstracoes`) tem página. Governança, Ação e Serviços são âncoras vazias (pendente).

---

## 6 — Área do Investidor

| Rota | Componente | Função |
|---|---|---|
| `/investidor/login` | `investidor/Login.tsx` | Entrada por CPF + senha (Supabase Auth) |
| `/investidor/area` | `investidor/Area.tsx` | Área logada |

### Login real (Fase 2)
- Campo **CPF** (formata `000.000.000-00`) + **senha**.
- Fluxo: `email_por_cpf(cpf)` (RPC security definer) → `signInWithPassword(email, senha)`.
- Após login, checa `papel === 'investidor'`.
- Status `bloqueado`/`inativo` → erro.
- Sem fallback "visitante": só CPFs com usuário cadastrado entram.

### Área logada
Cabeçalho (nome do usuário + Sair), cards (Valor Investido, Status, Último Contato — lidos do **próprio registro** via `getInvestidorPorCpf`), Últimos Comunicados (publicados), Próximos Eventos (publicados), Documentos (públicos).

### Guarda de rota
Redireciona para `/investidor/login` se não houver sessão ou papel diferente de `investidor`.

### CPFs de teste (auth real)
| CPF | Investidor | Status | Senha |
|---|---|---|---|
| `123.456.789-00` | Ana Carolina Ferreira | ativo | `invest123` |

Para investidores **sem** usuário (Bruno, Felipe...), gere credenciais pelo admin antes de tentar logar.

---

## 7 — Painel Admin e CMS

Rota base `/admin`. Layout `AdminShell` (Sidebar + Topbar). Login `/admin/login`.
Acesso protegido: rota redireciona para login se papel ≠ `super_admin`.

### Menu lateral
**Operação**
| Menu | Rota | O que faz |
|---|---|---|
| Dashboard | `/admin/dashboard` | KPIs operacionais, gráfico de envios, atividades recentes |
| Investidores | `/admin/investidores` | Lista/filtra/busca, importa CSV (com geração de credenciais), CRUD, altera status, envia credenciais |
| **Usuários** | `/admin/usuarios` | Contas de acesso ao sistema (papel super_admin/investidor), definir/resetar senha, ativar/desativar |
| Campanhas | `/admin/campanhas` (+ `/nova`) | Campanhas multicanal com status e métricas |

**Conteúdo & Comunicação**
| Menu | Rota | O que faz |
|---|---|---|
| Conteúdo do site | `/admin/conteudo` | Hub do CMS (cards abaixo) |
| Templates | `/admin/templates` | Modelos de mensagem com variáveis `{{nome}}` etc. |
| Histórico | `/admin/historico` | Log de envios por destinatário |

**Configurações** — `/admin/configuracoes`.

### CMS — cards de "Conteúdo do site"
| Card | Rota | Controla no site | Tabela(s) |
|---|---|---|---|
| Comunicados | `/admin/conteudo/comunicados` | "Últimas atualizações" | `comunicados` |
| Eventos | `/admin/conteudo/eventos` | "Próximos Eventos" | `eventos` |
| Documentos | `/admin/conteudo/documentos` | Repositório de PDFs | `documentos` |
| Kit do Investidor | `/admin/conteudo/kit` | Trimestre + destaques + links | `kit_trimestre`, `kit_documentos`, `kit_links` |
| Textos institucionais | `/admin/conteudo/textos` | Hero, Purpose, KPIs, Ticker | `site_textos`, `kpis`, `ticker` |
| **Navegação** | `/admin/conteudo/navegacao` | Menu do header | `nav_items` |
| **Ações rápidas** | `/admin/conteudo/acoes` | Botões do hero | `quick_actions` |
| **Rodapé** | `/admin/conteudo/rodape` | Descrição, links, redes, CNPJ, endereço, copyright, institucional | `footer_colunas`, `footer_links`, `redes_sociais`, `site_config` |
| **FAQ** | `/admin/conteudo/faq` | Perguntas frequentes | `faqs` |

### Padrões de edição
- **CRUD em lista com modal** (Comunicados, Eventos, FAQ, Usuários).
- **Lista inline com "Salvar"** (Navegação, Ações rápidas) — reordenar, adicionar/remover, salva a lista inteira.
- **Multi-seção** (Rodapé) com "Salvar tudo".
- Save = otimista local → persiste na API → refetch.

---

## 8 — Acessos e Credenciais

> ⚠️ **Segurança**: não guarde senhas reais de produção neste arquivo (pode ser sincronizado). Use um gerenciador de senhas. As chaves do Supabase abaixo são **defaults locais de dev** (não secretas).

### Logins reais da aplicação (Fase 2 ativa)

**Super Admin / CMS** — `/admin/login`
| E-mail | Senha | Papel |
|---|---|---|
| `vitao@grupoica.com.br` | `admin123` | super_admin |
| `renan@grupoica.com.br` | `admin123` | super_admin |

**Área do Investidor** — `/investidor/login`
| CPF | Investidor | Senha | Status |
|---|---|---|---|
| `123.456.789-00` | Ana Carolina Ferreira | `invest123` | ativo |

> Apenas usuários com `senha_definida=true` no banco têm conta no Supabase Auth. Para liberar mais investidores, gere credenciais pelo painel.

### Supabase local (não secreto, dev only)
| Item | Valor |
|---|---|
| Project URL | `http://127.0.0.1:54321` |
| Publishable (anon) key | `sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH` |
| Studio | `http://127.0.0.1:54323` |
| Postgres | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |

Variáveis em `.env`:
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — expostas ao browser
- `SUPABASE_SERVICE_ROLE_KEY` — **lado Node apenas**, usada pelo middleware do Vite e pelo `seed-auth.mjs`
- `MAILPIT_SMTP_HOST` / `MAILPIT_SMTP_PORT` — para o envio de credenciais em dev

`.env` está no `.gitignore`; `.env.example` é versionado.
> Produção (Supabase Cloud): chaves serão outras e secretas — nunca commitar a `service_role`.

### Domínio `.br` (registro.br)
- Conta: e-mail `icaportalri@gmail.com`.
- 🔒 **Senha NÃO documentada aqui de propósito** — guardar em gerenciador de senhas e **rotacionar**.

### Contas
| Conta | Identificador |
|---|---|
| Repositório | `github.com/victorvixcard/RIICA` |
| Dono/dev | `victoruli@gmail.com` |
| Registrador do domínio | `icaportalri@gmail.com` |

---

## 9 — Onboarding via CSV + e-mail

Fluxo implementado para registrar e ativar acesso de investidores.

### Importar CSV com geração de credenciais
1. Em `/admin/investidores` clique em **"Importar CSV"**.
2. Passo de validação tem checkbox **"Gerar credenciais de acesso?"**.
3. Ao confirmar com Sim:
   - Investidores são inseridos em `investidores`.
   - Para cada novo, é criado um registro em `usuarios` (papel `investidor`, senha provisória aleatória).
4. Tela de sucesso mostra quantas credenciais foram geradas.

### Enviar credenciais por e-mail
- Botão **"Enviar credenciais"** no topo da lista (todos filtrados) e na barra de seleção (selecionados).
- Modal escolhe escopo (Selecionados / Todos filtrados) e dispara `POST /api/enviar-credenciais`.
- Middleware do Vite (`vite-plugins/credenciais-mailer.ts`):
  1. Busca usuários por e-mail (papel `investidor`).
  2. Garante senha provisória (gera se faltar).
  3. **Provisiona/sincroniza o usuário no Supabase Auth** (cria/atualiza com a senha).
  4. Envia o e-mail via **nodemailer → Mailpit** (host `127.0.0.1:54325`).
- Em dev, abra `http://127.0.0.1:54324` para ver as mensagens capturadas pelo Mailpit.

### Por que Vite middleware e não Edge Function?
Edge Functions do Supabase **não suportam TCP/SMTP bruto** (sem `Deno.connect`). Em dev, o middleware do Vite (Node) faz SMTP direto pro Mailpit. **Em produção**, o caminho será uma Edge Function fazendo `POST` HTTP para o **Resend** (HTTP-API, funciona em edge).

---

## 10 — Modo "Em Breve" do Portal

Estado atual: o portal está **preparado para receber dados reais** mas com cards e mensagens deixando claro que o conteúdo será preenchido quando o portal estiver pronto para investidores.

### O que foi feito
| Item | Antes | Agora |
|---|---|---|
| **Ticker** no header | ICAB31, ICA com cotações | **Removido** do render |
| **Hero — eyebrow** | "Resultados 1T26 disponíveis" | **"Resultados em breve"** |
| **Hero — CTA secundário** | "Agendar teleconferência" | **"Formas de Contato"** → `/contato` |
| **Hero — CTA primário** | sem destino | "Acessar Kit do Investidor" → `/em-construcao` |
| **Quick Actions** | 5 (incluindo Mailing, Contato RI) | **3** (FAQs, Resultados, Apresentação) → placeholders |
| **InfoGrid (3 colunas)** | Comunicados / Kit / Eventos publicados | Cards **"Em breve"** ("...assim que o portal estiver 100% concluído para o investidor") |
| **Purpose / KPIs** | 6 KPIs fictícios | Card **"Em breve"** ("Os números do Grupo ICA") |
| **Demonstrações** | DRE/Balanço com valores fictícios | Card **"Em breve"** ("As demonstrações financeiras") |
| **Valor investido** dos 33 cadastros | R$ 285k, 1,2M, etc. | **R$ 0** para todos |
| **Campanhas/envios/atividades** | Mocks de 5/16/6 | **Vazios** (limpos para uso real) |

### Componente reutilizável
`src/components/PlaceholderEmBreve.tsx` — card com ícone + título "Em breve" + mensagem parametrizável. Usado em InfoGrid, Purpose e Demonstrações.

### Como reverter (quando os dados estiverem prontos)
- **Comunicados/Eventos/Kit**: editar no admin e marcar como publicado/ativo. Cards reaparecem automaticamente.
- **KPIs**: cadastrar em `/admin/conteudo/textos`. Section "Em breve" some quando houver pelo menos 1.
- **Demonstrações**: cadastrar períodos + linhas + valores (editor pendente).
- **Valor investido**: editar individualmente em `/admin/investidores` ou importar CSV.

---

## 11 — Roadmap e Fases

### ✅ Concluído
- **Backend Supabase + RLS + auth real** (Fase 1 + Fase 2)
- **CMS total**: comunicados, eventos, documentos, kit, textos, navegação, ações rápidas, rodapé, FAQ
- **Gestão de Usuários** com papéis, status e senha
- **Onboarding via CSV** com geração de credenciais e envio por e-mail (dev via Mailpit)
- **Migração das páginas admin** (Templates, Campanhas, Histórico, Dashboard, Demonstrações, aba histórico do investidor) para o banco
- **Modo "Em breve"** ligado em todo o portal
- **Páginas placeholder** `/em-construcao`, `/resultados`, `/apresentacao`, `/contato`

### ⏳ Pendente
- **Editor do Financeiro** no admin: CRUD de períodos/linhas/valores para alimentar `/demonstracoes`
- **Páginas reais das seções de menu**: Governança Corporativa, Ação, Serviços aos Investidores (hoje âncoras vazias)
- **E-mail de produção**: Edge Function do Supabase fazendo POST HTTP para o **Resend** (substituindo o middleware do Vite em produção)
- **Upload real de PDFs** no Storage do Supabase
- **Realtime** opcional (sincronia ao vivo entre abas; hoje é F5)

### Hospedagem (decidida)
- **Front**: Vercel ou Cloudflare Pages (SPA estática, grátis)
- **Backend**: Supabase Cloud (região São Paulo — dados de investidor no Brasil)
- **E-mail**: Resend (HTTP-API, funciona em Edge Function)
- **Domínio `.br`** apontando para o host do front

### Decisões de arquitetura registradas
- **Blocos estruturados** no CMS, não page-builder livre.
- Backend Supabase; dados/CRUDs **antes** da auth.
- Sincronia: refetch + **F5** (realtime adiado).
- E-mail em produção via **HTTP-API** (Resend) — Edge Functions não fazem TCP/SMTP.

---

*Documento gerado em 2026-05-29 — versão consolidada das notas individuais em `docs/`. Repositório: github.com/victorvixcard/RIICA — commit `1bb9b1f`.*
