---
tags: [riica, admin, cms]
atualizado: 2026-06-04
---

# 07 — Painel Admin e CMS

← [[RIICA — Índice]]

Rota base: `/admin`. Layout = `AdminShell` (Sidebar + Topbar + conteúdo). Login em `/admin/login`.

> 🔐 **Login real ativo** (Fase 2 concluída): Supabase Auth + RLS por papel. Usuário precisa ter `papel = 'super_admin'` em `public.usuarios` pra acessar `/admin`. Ver [[08 — Acessos e Credenciais]].

## Menu lateral (Sidebar)

### Grupo "Operação"

| Menu | Rota | O que faz |
|---|---|---|
| **Dashboard** | `/admin/dashboard` | Visão geral: KPIs, gráfico de envios (30 dias), atividades recentes (log) |
| **Investidores** | `/admin/investidores` | Lista, filtra (status/origem/valor), busca, importa CSV, cria/edita/exclui investidores, altera status. Importação CSV tem opção "Gerar credenciais?" que cria registros em `usuarios` |
| **Usuários** | `/admin/usuarios` | CRUD de usuários do sistema (papel super_admin / investidor / etc.), ativar/desativar, resetar senha. Lê/grava em `usuarios` e Supabase Auth |
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
| **Comunicados** | `/admin/conteudo/comunicados` | (reservado p/ uso futuro — atualmente sem bloco visível no portal) | `comunicados` |
| **Eventos** | `/admin/conteudo/eventos` | (reservado p/ uso futuro) | `eventos` |
| **Documentos** | `/admin/conteudo/documentos` | Repositório de PDFs — alimenta `/demonstracoes` | `documentos` |
| **Kit do Investidor** | `/admin/conteudo/kit` | Trimestre + documentos em destaque + links auxiliares | `kit_trimestre`, `kit_documentos`, `kit_links` |
| **Textos institucionais** | `/admin/conteudo/textos` | **Apenas Hero** da home (título, eyebrow, descrição) — abas Purpose/KPIs/Ticker foram removidas em 2026-06-04 | `site_textos` |
| **Navegação** ⭐ | `/admin/conteudo/navegacao` | Menu do header (rótulo, URL, ordem, visível) | `nav_items` |
| **Ações rápidas** ⭐ | `/admin/conteudo/acoes` | Botões abaixo do hero | `quick_actions` |
| **Rodapé** ⭐ | `/admin/conteudo/rodape` | Descrição, colunas de links, redes sociais, CNPJ, endereço, copyright, URL institucional. Reflete também no Aviso Legal da home | `footer_colunas`, `footer_links`, `redes_sociais`, `site_config` |
| **FAQ** ⭐ | `/admin/conteudo/faq` | Perguntas frequentes (reservado p/ uso futuro no portal) | `faqs` |
| **Fatos Relevantes** ✨ | `/admin/conteudo/fatos-relevantes` | Seção de timeline na home — comunicados oficiais, avisos ao mercado, atos societários (data, tag, título, resumo, URL, publicar/rascunho, ordem) | `fatos_relevantes` |

⭐ = adicionados na etapa "CMS total" (2026-05-29).
✨ = adicionado na reestruturação (2026-06-04).

## Padrões de edição

- **CRUD em lista com modal** (Comunicados, Eventos, FAQ): tabela + botão "Novo" + modal de edição + toggle Publicar.
- **Editor de lista inline com "Salvar"** (Navegação, Ações rápidas): linhas editáveis, reordenar (↑↓), adicionar/remover, botão único "Salvar alterações" (substitui a lista inteira no banco).
- **Editor multi-seção** (Rodapé): config institucional + colunas/links + redes sociais, com "Salvar tudo".
- **Botão "Resetar"** no hub recarrega o estado do banco (não re-popula o seed pelo cliente).

## Como o save funciona

`dispatch(action)` → atualização otimista local → persiste via [[02 — Stack e Arquitetura|camada de API]] → refetch para reconciliar. Em outras abas, a mudança aparece após **F5**.

Ver também: [[04 — Modelo de Dados]] · [[05 — Portal Público]]
