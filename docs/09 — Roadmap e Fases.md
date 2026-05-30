---
tags: [riica, roadmap, fases, pendencias]
atualizado: 2026-05-29
---

# 09 — Roadmap e Fases

← [[RIICA — Índice]]

## ✅ Concluído

### Fundação do backend (Supabase local)
- Scaffold Supabase, `config.toml`, migrations e seed.
- 24 tabelas cobrindo todos os domínios. Ver [[04 — Modelo de Dados]].
- Camada de API tipada (`src/lib/api/*`).
- Docker Desktop + WSL2 instalados; stack local no ar.

### Migração dos stores
- `content.tsx` e `investors.tsx` saíram de `localStorage` → Supabase (mantendo a API `state`/`dispatch`).

### Área do Investidor
- Login por CPF (sem auth real) + área logada funcional. Ver [[06 — Área do Investidor]].

### CMS total — prioridades 1 e 2
- **Navegação**, **Ações rápidas**, **Rodapé** e **FAQ** agora editáveis no painel. Header/QuickActions/Footer leem do banco. Ver [[07 — Painel Admin e CMS]].

## ⏳ Pendente

### CMS — prioridade 3: Editor do Financeiro
- Criar no admin o CRUD de `periodos_financeiros`, `linhas_financeiras` e `valores_financeiros` para alimentar `/demonstracoes` (hoje só leitura).

### CMS — prioridade 4: Páginas das seções de menu
- Governança Corporativa, Ação, Serviços aos Investidores e uma página pública de **FAQ** — hoje esses itens de menu são âncoras vazias.

### Gestão de Usuários (feito — Fase 1)
- Menu **Usuários** (`/admin/usuarios`): CRUD, papel (super_admin/investidor), ativar/desativar, definir/resetar senha (placeholder). Tabela `usuarios`. Mesmo CPF pode ser investidor (acessa `/investidor`) e usuário do sistema (acessa `/admin`).

### Onboarding via CSV + credenciais por e-mail (pendente)
Fluxo a implementar no import de investidores:
1. Ao subir o CSV, opção **"Gerar credenciais de acesso? Sim/Não"**.
2. Se **Sim** → importa investidores **e** gera credenciais (cria `usuarios` papel investidor + senha provisória).
3. Selecionar **toda a base ou apenas selecionados** e **enviar credenciais para o e-mail cadastrado**.
4. Requer **infraestrutura de e-mail** (provedor/Edge Function; em dev, Mailpit em :54324).
- Buildável na Fase 1: checkbox + geração de registros `usuarios`. Envio real de e-mail e senha de verdade dependem da **Fase 2**.

### Fase 2 — Autenticação real (deixada por último, a pedido)
- Supabase Auth, papéis (super_admin / investidor), **RLS + policies** por papel.
- Substituir os logins abertos do admin e do investidor.
- **Infraestrutura de e-mail** para reset de senha e envio de credenciais.
- **Decisão registrada**: implementar auth **só depois** de testar manualmente acessos e sincronia de telas.

### Infra / Produção
- **Hospedagem** a definir (provável: SPA estática + Supabase Cloud, ou VPS).
- Apontar o **domínio `.br`** (registro.br) para o host. Ver [[08 — Acessos e Credenciais]].
- Upload real de PDFs no Storage do Supabase (hoje só nome do arquivo).
- **Realtime** opcional para sincronia ao vivo entre abas (hoje é F5).

## Decisões de arquitetura registradas

- **Blocos estruturados** no CMS (campos definidos por seção), **não** page-builder livre — mais seguro para um portal RI.
- Backend **Supabase**; dados/CRUDs **antes** da autenticação.
- Sincronia entre telas: refetch + **F5** (realtime adiado).

Ver também: [[RIICA — Índice]]
