---
tags: [riica, frontend, portal-publico]
atualizado: 2026-05-29
---

# 05 — Portal Público

← [[RIICA — Índice]]

Rota: `/` (componente `PortalRI.tsx`). Tudo aqui sai do banco via o content store e é editável no [[07 — Painel Admin e CMS]].

## Seções da home (de cima pra baixo)

| Seção | Componente | O que mostra | Editável em |
|---|---|---|---|
| **Header** | `Header.tsx` | Logo, ticker de cotações, botão Institucional, botão Área do Investidor, seletor PT/EN, **menu de navegação** | Navegação + Ticker + Institucional |
| **Hero** | `Hero.tsx` | Título, subtítulo, descrição e 2 CTAs do destaque principal | Textos institucionais |
| **Ações rápidas** | `QuickActions.tsx` | Faixa de botões (FAQs, Resultados, Apresentação, Mailing, Contato) | Ações rápidas |
| **InfoGrid** | `InfoGrid.tsx` | 3 colunas: Últimas Atualizações (comunicados), Kit do Investidor (documentos em destaque), Próximos Eventos | Comunicados / Kit / Eventos |
| **Purpose** | `Purpose.tsx` | "Quem somos" + KPIs ("Grupo ICA em números") | Textos institucionais (purpose + KPIs) |
| **Footer** | `Footer.tsx` | Descrição, colunas de links, redes sociais, copyright, CNPJ, endereço | Rodapé |

## Página de Demonstrações Financeiras

Rota: `/demonstracoes` (componente `Demonstracoes.tsx`). Mostra **DRE** e **Balanço Patrimonial** por período (1T26, 4T25, 3T25, 2T25), lendo de `periodos_financeiros` + `linhas_financeiras` + `valores_financeiros`.

> ⚠️ Os dados já vêm do banco, mas **ainda não há editor no admin** para o financeiro (tarefa pendente — ver [[09 — Roadmap e Fases]]).

## Regras de exibição

- **Comunicados**: só aparecem se `publicado = true`.
- **Eventos**: só aparecem em "Próximos Eventos" se `publicado = true` e a data for futura.
- **Documentos**: só aparecem se `publico = true`.
- **Navegação / Ações rápidas**: só itens com `visivel = true`, ordenados por `ordem`.
- **FAQ**: só `publicado = true`.

## Itens de menu que ainda são âncoras vazias

Hoje só **Informações Financeiras** (`/demonstracoes`) leva a uma página real. Governança Corporativa, Ação e Serviços aos Investidores são âncoras (`#...`) sem página dedicada ainda — tarefa pendente (ver [[09 — Roadmap e Fases]]).

Ver também: [[07 — Painel Admin e CMS]]
