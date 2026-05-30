---
tags: [riica, frontend, investidor, auth]
atualizado: 2026-05-29
---

# 06 — Área do Investidor

← [[RIICA — Índice]]

## Rotas

| Rota | Componente | O que faz |
|---|---|---|
| `/investidor/login` | `investidor/Login.tsx` | Entrada por CPF + senha |
| `/investidor/area` | `investidor/Area.tsx` | Área logada do investidor |

## Login (comportamento atual — SEM auth real)

- Campo **CPF** (formata automaticamente: `000.000.000-00`) + **senha**.
- Regras atuais:
  - CPF precisa ter **11 dígitos**.
  - Se o CPF **existe** na base de investidores → entra com os **dados reais** daquele investidor.
  - Se o CPF **não existe** → entra como **"Investidor Visitante"** (perfil genérico criado na hora).
  - Bloqueios: investidor com status `bloqueado` ou `inativo` recebe mensagem de erro.
  - A senha hoje é aceita com qualquer valor (≥ 4 caracteres) — **não há validação real**.
- A sessão é guardada em `sessionStorage` (chave `investidor`). Não há token/2FA ainda.

> 🔓 **Não há autenticação real.** O fluxo de 2FA via SMS foi removido nesta fase. Login real + papéis entram na **Fase 2** ([[09 — Roadmap e Fases]]).

## Área logada (`/investidor/area`)

Mostra, para o investidor da sessão:
- **Cabeçalho** com nome e botão Sair.
- **Cards**: Valor Investido, Status, Último Contato.
- **Últimos Comunicados** (publicados).
- **Próximos Eventos** (publicados).
- **Documentos** (públicos).
- Link "Voltar ao portal público".

Se não houver sessão válida, redireciona para `/investidor/login`.

## CPFs de teste (existem na base seed)

Qualquer um destes entra com dados reais (senha: qualquer coisa com 4+ caracteres):

| CPF | Investidor | Status |
|---|---|---|
| `123.456.789-00` | Ana Carolina Ferreira | ativo |
| `987.654.321-00` | Bruno Lima Pereira | ativo |
| `789.123.456-00` | Felipe Antunes Costa | **bloqueado** (testa bloqueio) |
| `258.369.147-00` | Henrique Toledo Pacheco | **inativo** (testa inativo) |

Qualquer outro CPF de 11 dígitos entra como "Investidor Visitante".

Ver também: [[08 — Acessos e Credenciais]]
