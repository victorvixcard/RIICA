---
tags: [riica, indice, moc]
atualizado: 2026-06-04
---

# 🏛️ RIICA — Portal de Relações com Investidores do Grupo ICA

> Mapa de conteúdo (MOC) da documentação do sistema. Comece por aqui.

## O que é

Portal de **Relações com Investidores (RI)** do **Grupo ICA**. Uma única SPA (React) que entrega **três experiências** num mesmo app, com backend **Supabase** (Postgres + Auth + Storage).

- Repositório: `github.com/victorvixcard/RIICA`
- Pasta local: `C:\Users\Administrador\OneDrive\Desktop\Sistemas\Ri-ica`
- Domínio: `icaportalri.com.br` (apontamento DNS em andamento)
- Hospedagem frontend: **Vercel** (deploy automático ao push em `main`)
- Hospedagem backend: **Supabase Cloud — sa-east-1 (São Paulo)**

## Mapa da documentação

1. [[01 — Visão Geral]] — contexto, objetivo, os três frontends
2. [[02 — Stack e Arquitetura]] — tecnologias, estrutura de pastas, fluxo de dados
3. [[03 — Backend Supabase]] — como subir, migrations, seed, comandos
4. [[04 — Modelo de Dados]] — todas as tabelas e relações
5. [[05 — Portal Público]] — seções da home e o que cada uma faz
6. [[06 — Área do Investidor]] — login e área logada
7. [[07 — Painel Admin e CMS]] — cada menu do admin e a que corresponde
8. [[08 — Acessos e Credenciais]] — usuários, senhas, chaves
9. [[09 — Roadmap e Fases]] — o que está pronto e o que falta

## Estado atual (resumo)

- ✅ **Fase 1** — dados + CRUDs ligados ao Supabase
- ✅ **Fase 2** — autenticação real (Supabase Auth + RLS + papéis super_admin/investidor)
- ✅ **CMS total** — todos os blocos do portal editáveis: textos, navegação, ações rápidas, rodapé, FAQ, comunicados, eventos, documentos, kit, **fatos relevantes**
- ✅ **Deploy produção** — Vercel + Supabase Cloud SP rodando
- ✅ **Reestruturação da home (2026-06-04)** — Logo "GRUPO ICA", Hero com imagem da skyline de Salvador em duotone verde, 4 Princípios institucionais, seção Fatos Relevantes (CMS), Aviso Legal regulatório
- ⏳ **Pendente** — editor do Financeiro no admin, sub-páginas (Diretoria Executiva, Políticas de Governança, Calendário), Resend + Edge Function pra e-mail real, finalizar apontamento DNS do domínio
