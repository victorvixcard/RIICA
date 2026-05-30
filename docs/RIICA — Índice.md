---
tags: [riica, indice, moc]
atualizado: 2026-05-29
---

# 🏛️ RIICA — Portal de Relações com Investidores do Grupo ICA

> Mapa de conteúdo (MOC) da documentação do sistema. Comece por aqui.

## O que é

Portal de **Relações com Investidores (RI)** do **Grupo ICA**. Uma única SPA (React) que entrega **três experiências** num mesmo app, com backend **Supabase** (Postgres + Auth + Storage).

Repositório: `github.com/victorvixcard/RIICA`
Pasta local: `C:\Users\Administrador\OneDrive\Desktop\Sistemas\Ri-ica`

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

- ✅ **Fase 1** — dados + CRUDs ligados ao Supabase (sem autenticação real)
- ✅ **CMS total (prioridades 1–2)** — Navegação, Ações rápidas, Rodapé e FAQ editáveis
- ⏳ **Pendente** — editor do Financeiro, páginas das seções de menu, **autenticação real (Fase 2)**, hospedagem

> ⚠️ **Hoje não há login real**: qualquer credencial entra. Ver [[08 — Acessos e Credenciais]] e [[09 — Roadmap e Fases]].
