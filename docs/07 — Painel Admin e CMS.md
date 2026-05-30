---
tags: [riica, admin, cms]
atualizado: 2026-05-29
---

# 07 — Painel Admin e CMS

← [[RIICA — Índice]]

Rota base: `/admin`. Layout = `AdminShell` (Sidebar + Topbar + conteúdo). Login em `/admin/login`.

> 🔓 **Login sem auth real**: qualquer e-mail + qualquer senha entram. Ver [[08 — Acessos e Credenciais]].

## Menu lateral (Sidebar)

### Grupo "Operação"

| Menu | Rota | O que faz |
|---|---|---|
| **Dashboard** | `/admin/dashboard` | Visão geral: KPIs, gráfico de envios (30 dias), atividades recentes (log) |
| **Investidores** | `/admin/investidores` | Lista, filtra (status/origem/valor), busca, importa CSV, cria/edita/exclui investidores, altera status. Lê/grava em `investidores` |
| **Campanhas** | `/admin/campanhas` | Lista de campanhas multicanal (e-mail/WhatsApp/push) com status e métricas. Subrota `/admin/campanhas/nova` cria campanha |

### Grupo "Conteúdo & Comunicação"

| Menu | Rota | O que faz |
|---|---|---|
| **Conteúdo do site** | `/admin/conteudo` | **Hub do CMS** — cards para cada bloco editável do portal (ver abaixo) |
| **Templates** | `/admin/templates` | Modelos de mensagem (e-mail/WhatsApp/push) com variáveis `{{nome}}`, `{{trimestre}}` etc. Lê de `templates` |
| **Histórico** | `/admin/historico` | Log de envios por destinatário (entregue/aberto/clicado/falhou). Lê de `envios` |

### Configurações

| Menu | Rota | O que faz |
|---|---|---|
| **Configurações** | `/admin/configuracoes` | Preferências gerais do painel |

## CMS — cards de "Conteúdo do site"

Cada card abre um editor que grava direto no Supabase e reflete no [[05 — Portal Público]].

| Card | Rota | Controla no site | Tabela(s) |
|---|---|---|---|
| **Comunicados** | `/admin/conteudo/comunicados` | "Últimas atualizações" da home | `comunicados` |
| **Eventos** | `/admin/conteudo/eventos` | "Próximos Eventos" | `eventos` |
| **Documentos** | `/admin/conteudo/documentos` | Repositório de PDFs | `documentos` |
| **Kit do Investidor** | `/admin/conteudo/kit` | Trimestre + documentos em destaque + links auxiliares | `kit_trimestre`, `kit_documentos`, `kit_links` |
| **Textos institucionais** | `/admin/conteudo/textos` | Hero, Purpose, KPIs, Ticker | `site_textos`, `kpis`, `ticker` |
| **Navegação** ⭐ | `/admin/conteudo/navegacao` | Menu do header (rótulo, URL, ordem, visível) | `nav_items` |
| **Ações rápidas** ⭐ | `/admin/conteudo/acoes` | Botões abaixo do hero | `quick_actions` |
| **Rodapé** ⭐ | `/admin/conteudo/rodape` | Descrição, colunas de links, redes sociais, CNPJ, endereço, copyright, URL institucional | `footer_colunas`, `footer_links`, `redes_sociais`, `site_config` |
| **FAQ** ⭐ | `/admin/conteudo/faq` | Perguntas frequentes | `faqs` |

⭐ = adicionados na etapa "CMS total" (2026-05-29).

## Padrões de edição

- **CRUD em lista com modal** (Comunicados, Eventos, FAQ): tabela + botão "Novo" + modal de edição + toggle Publicar.
- **Editor de lista inline com "Salvar"** (Navegação, Ações rápidas): linhas editáveis, reordenar (↑↓), adicionar/remover, botão único "Salvar alterações" (substitui a lista inteira no banco).
- **Editor multi-seção** (Rodapé): config institucional + colunas/links + redes sociais, com "Salvar tudo".
- **Botão "Resetar"** no hub recarrega o estado do banco (não re-popula o seed pelo cliente).

## Como o save funciona

`dispatch(action)` → atualização otimista local → persiste via [[02 — Stack e Arquitetura|camada de API]] → refetch para reconciliar. Em outras abas, a mudança aparece após **F5**.

Ver também: [[04 — Modelo de Dados]] · [[05 — Portal Público]]
