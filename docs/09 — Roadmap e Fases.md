---
tags: [riica, roadmap, fases, pendencias]
atualizado: 2026-06-04
---

# 09 — Roadmap e Fases

← [[RIICA — Índice]]

## ✅ Concluído

### Fundação do backend (Supabase)
- Scaffold Supabase, `config.toml`, migrations e seed.
- 25 tabelas cobrindo todos os domínios. Ver [[04 — Modelo de Dados]].
- Camada de API tipada (`src/lib/api/*`).
- Docker Desktop + WSL2 instalados; stack local funcional.
- **Migrado para Supabase Cloud** — região **sa-east-1 (São Paulo)** para LGPD/latência.

### Migração dos stores
- `content.tsx` e `investors.tsx` saíram de `localStorage` → Supabase (mantendo a API `state`/`dispatch`).

### Fase 2 — Autenticação real ✅
- Supabase Auth ativado, vínculo `auth.users ↔ public.usuarios` via `auth_id`.
- RPC `login_por_cpf` para autenticar investidor por CPF.
- AuthProvider no frontend + proteção de rotas por papel.
- **RLS + policies** em todas as tabelas (anon lê conteúdo público; investidor lê o próprio registro; super_admin faz tudo).
- Logins reais funcionando em produção: admin e investidor.
- Geração de credenciais via CSV cria usuário no Auth + popula `usuarios`.

### CMS total (todas as prioridades)
- **Comunicados, Eventos, Documentos, Kit, Textos institucionais** (Fase 1).
- **Navegação, Ações rápidas, Rodapé, FAQ** ⭐ (2026-05-29).
- **Fatos Relevantes** ✨ (2026-06-04) — nova tabela + tela admin CRUD.

### Área do Investidor
- Login real por CPF + área logada funcional. Ver [[06 — Área do Investidor]].

### Reestruturação da home (2026-06-04)
- Logo "GRUPO ICA" maiúsculo + botão "Fale com RI" substituindo "Área do Investidor".
- 6 itens de menu reestruturados (Quem Somos, Governança Corporativa, Políticas de Governança, Informações Financeiras, Comunicados, Fundos de Investimentos).
- 4 botões de Ações Rápidas (FAQs, Resultados, Apresentação, Projetos Sociais).
- Hero novo: título "Governança que protege quem confia em nós" + **imagem da skyline de Salvador com duotone verde + Ken Burns + selo flutuante**.
- 4 Princípios institucionais (Transparência / Governança Sólida / Criação de Valor / Impacto Social) substituindo InfoGrid.
- Nova seção **Fatos Relevantes** com timeline + CMS.
- Nova seção **Aviso Legal** regulatório (Lei 6.385/76 + CVM) com razão social + CNPJ vindos do CMS.
- Removidos: InfoGrid e Purpose (Quem Somos virou página própria `/quem-somos`).
- Novas páginas: `/quem-somos` (institucional) e `/fale-com-ri` (formulário de contato).
- CNPJ + razão social atualizados: **ICA Soluções Financeiras S/A · CNPJ 37.468.454/0001-00 · Salvador, Bahia**.

### Deploy de produção ✅
- **Vercel** com auto-deploy via GitHub (push em `main` → deploy automático).
- Env vars do Vercel apontando pro Supabase Cloud.
- `vercel.json` com rewrite SPA pra rotas internas funcionarem em refresh direto.
- Custom domain configurado em DNS — apontamento final do `icaportalri.com.br` em propagação.

## ⏳ Pendente

### CMS — Editor do Financeiro
- Criar no admin o CRUD de `periodos_financeiros`, `linhas_financeiras` e `valores_financeiros` para alimentar `/demonstracoes` (hoje só leitura).

### Sub-páginas (referenciadas no menu mas sem página real)
- **Diretoria Executiva** — backend novo (tabela `diretores`).
- **Políticas de Governança** (Outros Documentos) — backend novo (`doc_categorias`).
- **Calendário de Eventos** — pode reutilizar `eventos`.
- **Governança Corporativa**, **Comunicados**, **Fundos de Investimentos** — placeholders por enquanto.

### Infraestrutura de e-mail (Resend)
- Edge Function de envio com **Resend API HTTP** (em dev usa Mailpit via middleware Vite).
- Necessário para:
  - Envio de credenciais ao gerar usuário via CSV.
  - Reset de senha real.
  - Envio do formulário de "Fale com RI" (`/fale-com-ri`) — hoje simulado.

### Conteúdo institucional via CMS (sugestão)
- Mover dados de contato de `/fale-com-ri` pro CMS (email, telefone, endereço, horário editáveis).
- Mover parágrafos da página `/quem-somos` pro CMS.
- (Opcional) CMS pros 4 Princípios — hoje texto fixo, decisão de produto.

### Limpeza futura
- Dropar do banco campos não-mais-usados de `site_textos` (purpose, kpis, ticker) numa migration consolidada.
- Habilitar **Realtime** opcional pra sincronia ao vivo entre abas (hoje é F5).
- Upload real de PDFs no Storage do Supabase (hoje só nome do arquivo).

## Decisões de arquitetura registradas

- **Blocos estruturados** no CMS (campos definidos por seção), **não** page-builder livre — mais seguro para um portal RI.
- Backend **Supabase Cloud SP**; região sa-east-1 escolhida por LGPD/latência.
- **Fluxo de trabalho:** rodar dev local apontando pra Cloud (`.env.local`), validar visualmente, **só então** commit + push (que dispara deploy Vercel automático).
- Sincronia entre telas: refetch + **F5** (realtime adiado).
- Textos institucionais (Aviso Legal, 4 Princípios) ficam **fixos no código** quando são regulatórios ou raramente mudam; CNPJ/endereço/razão social vêm do CMS pra ser **single source of truth**.

Ver também: [[RIICA — Índice]]
