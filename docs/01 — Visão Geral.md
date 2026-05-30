---
tags: [riica, visao-geral, contexto]
atualizado: 2026-05-29
---

# 01 — Visão Geral

← [[RIICA — Índice]]

## Propósito

O RIICA é o portal de **Relações com Investidores** do **Grupo ICA** — um ecossistema de soluções com mais de três décadas no mercado capixaba e nacional. O portal centraliza comunicação com o mercado, divulgação de resultados, documentos, eventos e a área logada do investidor.

## Os três frontends (numa mesma SPA)

| # | Frontend | Rota base | Para quem | Resumo |
|---|---|---|---|---|
| 1 | **Site RI público** | `/` | Mercado, acionistas, imprensa | Vitrine: hero, comunicados, eventos, kit do investidor, KPIs, propósito. Ver [[05 — Portal Público]] |
| 2 | **Área do Investidor** | `/investidor/*` | Investidores cadastrados | Login (CPF) + área logada com comunicados, eventos, documentos e dados pessoais. Ver [[06 — Área do Investidor]] |
| 3 | **Super Admin / CMS** | `/admin/*` | Time interno de RI | Gestão de investidores, campanhas multicanal, templates, histórico e **CMS total** do site. Ver [[07 — Painel Admin e CMS]] |

## Princípio central

> **O painel admin é a fonte da verdade do portal.** Tudo que aparece no site público sai do banco e é editável no CMS — sem precisar mexer em código.

## Domínios funcionais

- **CMS / Conteúdo** — comunicados, eventos, documentos, kit trimestral, textos institucionais, KPIs, ticker, navegação, ações rápidas, rodapé, FAQ
- **Investidores** — cadastro, status, valor investido, CPF, e-mail, WhatsApp, origem
- **Engajamento** — campanhas (e-mail/WhatsApp/push), templates, histórico de envios
- **Financeiro** — DRE e Balanço Patrimonial por período
- **Auditoria** — log de atividades

## Histórico de decisões

- **2026-05-29** — Backend definido: **Supabase local via Docker**. Estratégia: **dados/CRUDs primeiro, autenticação por último** (para testar acessos e sincronia de telas antes da fricção de login). Ver [[09 — Roadmap e Fases]].
- O Grupo ICA comprou um **domínio `.br`** (registro.br) — hospedagem ainda a definir.
