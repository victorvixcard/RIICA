---
tags: [riica, frontend, portal-publico]
atualizado: 2026-06-04
---

# 05 — Portal Público

← [[RIICA — Índice]]

Rota: `/` (componente `PortalRI.tsx`). Tudo aqui sai do banco via o content store e é editável no [[07 — Painel Admin e CMS]] (exceto onde indicado).

## Seções da home (de cima pra baixo)

| Seção | Componente | O que mostra | Origem do conteúdo |
|---|---|---|---|
| **Header** | `Header.tsx` | Logo "GRUPO ICA", botão Institucional, **botão "Fale com RI"** (verde, com ícone de envelope), seletor PT/EN, menu de navegação (6 itens) | CMS (Navegação + URL Institucional) |
| **Hero** | `Hero.tsx` | Layout split: à esquerda título "Governança que protege quem confia em nós" + descrição; à direita imagem da skyline de Salvador em **duotone verde institucional** + animação Ken Burns + selo "Portal R.I." flutuante | CMS (textos do Hero) + imagem em `public/hero/grupo-ica-skyline.png` |
| **Ações rápidas** | `QuickActions.tsx` | 4 botões pílula: FAQs, Resultados do Trimestre, Apresentação Institucional, Projetos Sociais (link externo p/ Instituto Esmeraldas) | CMS (Ações rápidas) |
| **4 Princípios** | `Principios.tsx` | Grid 4 colunas com ícone + título + descrição: Transparência / Governança Sólida / Criação de Valor / Impacto Social | **Texto fixo no código** (decisão de produto) |
| **Fatos Relevantes** ✨ | `FatosRelevantes.tsx` | Faixa escura com título + subtítulo, lista timeline com data + tag + título + resumo. Itens são hiperlinkados quando têm URL | CMS (`fatos_relevantes`) |
| **Aviso Legal** ✨ | `AvisoLegal.tsx` | Texto regulatório (Lei 6.385/76 + CVM) com razão social + CNPJ + cidade no final | Texto fixo + CNPJ/endereço vindos do CMS |
| **Footer** | `Footer.tsx` | Logo, descrição, colunas de links, redes sociais, copyright, CNPJ, endereço | CMS (Rodapé) |

✨ = adicionados na reestruturação de 2026-06-04.

### O que foi removido em 2026-06-04
- ❌ **InfoGrid** (3 boxes "Últimas Atualizações / Kit / Próximos Eventos") — substituído pelos 4 Princípios
- ❌ **Purpose** ("Quem Somos" + KPIs "Grupo ICA em números") — conteúdo movido para a página `/quem-somos`

## Páginas internas

| Rota | Componente | O que faz |
|---|---|---|
| `/demonstracoes` | `Demonstracoes.tsx` | DRE + Balanço Patrimonial por período. Lê de `periodos_financeiros` + `linhas_financeiras` + `valores_financeiros`. ⚠️ Ainda sem editor no admin |
| `/quem-somos` ✨ | `QuemSomos.tsx` | Página institucional do Grupo ICA — propósito, parágrafos institucionais, box de destaque |
| `/fale-com-ri` ✨ | `FaleComRi.tsx` | Cards de contato (email, telefone, endereço, horário) + formulário (nome, email, telefone, assunto, mensagem). ⚠️ Envio simulado — Resend pendente |
| `/em-construcao`, `/resultados`, `/apresentacao`, `/contato` | `PaginaEmBreve.tsx` | Placeholders "Em breve" pra rotas referenciadas no menu/ações rápidas mas sem página real ainda |

## Hero — detalhes técnicos do duotone

A imagem do skyline (`/hero/grupo-ica-skyline.png`) recebe um filtro SVG `feColorMatrix` que mapeia luminância para:
- **Shadow:** `#0d3d1f` (verde institucional escuro)
- **Highlight:** `#f5efe4` (creme claro)

Em cima disso vão overlays de gradient verde (canto inferior) + soft mask na borda esquerda + vinheta + grain SVG sutil. A imagem anima com Ken Burns (zoom 1.02 ↔ 1.10 em 22s ida-volta).

## Regras de exibição

- **Comunicados, Eventos, Documentos, FAQ, Fatos Relevantes**: só `publicado = true` (ou `publico = true` em Documentos) aparecem para usuários anônimos.
- **Navegação / Ações rápidas**: só itens com `visivel = true`, ordenados por `ordem`.
- **Fatos Relevantes**: quando a tabela do Cloud estiver vazia, o componente exibe um fallback com 3 mocks fictícios + badge "PREVIEW DE DEMONSTRAÇÃO" (some automaticamente quando o primeiro fato real for publicado).

## Conexão CMS ↔ Portal — single source of truth

CNPJ, razão social e endereço aparecem em **dois lugares** (Footer + Aviso Legal). Os dois leem o mesmo registro `site_config` do CMS. Editar em `/admin/conteudo/rodape` atualiza ambos automaticamente.

Ver também: [[07 — Painel Admin e CMS]]
