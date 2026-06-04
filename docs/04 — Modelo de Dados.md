---
tags: [riica, banco, modelo-de-dados, schema]
atualizado: 2026-06-04
---

# 04 — Modelo de Dados

← [[RIICA — Índice]]

25 tabelas no schema `public`, agrupadas por domínio. Colunas em snake_case. Todas com RLS habilitada (Fase 2).

## CMS / Conteúdo

### `documentos`
PDFs e formulários. `id, titulo, categoria, periodo, arquivo, tamanho, data_publicacao, publico, tag`.
Categorias: release, apresentacao, demonstracao, ata, regulamento, fato_relevante, comunicado, formulario, outro.

### `comunicados`
Comunicados ao mercado (home "Últimas atualizações"). `id, data, titulo, resumo, documento_id→documentos, link, destaque, publicado`.

### `eventos`
Agenda do investidor. `id, data, hora, titulo, tipo, local, link_inscricao, publicado`.
Tipos: Conferência, Presencial, Virtual, APIMEC, Investor Day, Assembleia.

### `kit_trimestre` + `kit_documentos` + `kit_links`
Kit do Investidor do trimestre ativo. Kit tem documentos em destaque (`kit_documentos` → documentos) e links auxiliares (`kit_links`).

### `site_textos` (singleton, id=1)
Hero e Purpose em **jsonb**. Textos institucionais do topo da home.

### `kpis`
"Grupo ICA em números". `id, valor, label, ordem`.

### `ticker`
Cotações no header. `id, simbolo, preco, variacao, positivo, ordem`.

### CMS estendido (migration 2)
- **`nav_items`** — menu do header: `label, url, ordem, visivel`
- **`quick_actions`** — botões abaixo do hero: `label, href, ordem, visivel`
- **`footer_colunas`** + **`footer_links`** (link→coluna) — colunas de links do rodapé
- **`redes_sociais`** — `tipo` (linkedin/instagram/facebook/youtube/x/email/telefone), `url, ordem`
- **`site_config`** (singleton, id=1) — `institucional_url, footer_descricao, footer_cnpj, footer_endereco, footer_copyright`. RLS de SELECT pública corrigida no hotfix `20260604000002`.
- **`faqs`** — `pergunta, resposta, categoria, ordem, publicado`

### `fatos_relevantes` (migration 4 — 2026-06-04)
Lista timeline da seção "Fatos Relevantes" da home. `id (uuid), data (date), tag (text, ex: COMUNICADO OFICIAL / AVISO AO MERCADO / FATO RELEVANTE), titulo, resumo, url, publicado, ordem, created_at, updated_at`. RLS: anon lê `publicado=true`; `super_admin` faz tudo.

### `usuarios` (migration 3 — Fase 2)
Identidades de quem usa o sistema (super_admin ou investidor). `id (uuid), auth_id (→auth.users), nome, email, cpf (único), papel, status (ativo/inativo), criado_em, atualizado_em`. Vincula-se com Supabase Auth via `auth_id`. RLS: super_admin gere todos; cada usuário lê o próprio perfil.

## Investidores

### `investidores`
`id, nome, cpf (único), email, whatsapp, status, valor_investido, ultimo_contato, origem, tags[], criado_em`.
Status: ativo, pendente_confirmacao, bloqueado, inativo.
Origem: CSV, Cadastro manual, Importação SCP, Indicação.

## Engajamento

### `templates`
Modelos de mensagem. `id, nome, canal (email/whatsapp/push), assunto, resumo, conteudo, tags[], usos, ultima_edicao, ativo`.

### `campanhas`
Disparos multicanal. `id, titulo, canais[], status, audiencia_total, entregues, abertura, agendada_para, template_ref, criada_em`.
Status: rascunho, agendada, enviando, concluida, falhou.

### `envios`
Log por destinatário (histórico). `id, campanha_id→campanhas, destinatario_nome, destinatario_contato, canal, status, enviado_em, aberto_em, clicado_em, erro`.
Status: entregue, aberto, clicado, falhou, bouncing, pendente.

## Financeiro

### `periodos_financeiros`
`id, trimestre, ano, publicado, ordem`. Ex: P-1T26, P-4T25.

### `linhas_financeiras`
`id, demonstracao (dre/balanco_ativo/balanco_passivo), conta, ordem, destaque, nivel (0/1/2)`.

### `valores_financeiros`
Valor por linha × período. `linha_id→linhas, periodo_id→periodos, valor`. PK composta.

## Auditoria

### `atividades`
Log do dashboard. `id, tipo (envio/import/campanha/login/edicao), texto, meta, created_at`.

## Relações (resumo)

```
comunicados.documento_id      → documentos
kit_documentos.documento_id   → documentos
kit_documentos.kit_id         → kit_trimestre
kit_links.kit_id              → kit_trimestre
footer_links.coluna_id        → footer_colunas
envios.campanha_id            → campanhas
valores_financeiros.linha_id  → linhas_financeiras
valores_financeiros.periodo_id→ periodos_financeiros
```

Cascades importantes: apagar documento limpa a referência em comunicados e remove dos destaques do Kit. Apagar coluna do rodapé remove seus links. Apagar campanha remove seus envios.

Ver também: [[03 — Backend Supabase]] · [[07 — Painel Admin e CMS]]
