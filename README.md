# Portal de Relações com Investidores — Grupo ICA

Portal R.I. público + painel administrativo (CMS + base de investidores) + área restrita do investidor.

Construído em React + TypeScript + Vite + Tailwind, com mock data em `localStorage` como camada de persistência inicial (backend pendente).

---

## Stack

- **Frontend:** React 19 + TypeScript 5 + Vite 8
- **Estilização:** Tailwind CSS v3 + design tokens HSL + Framer Motion
- **Ícones:** Lucide React + SVGs inline para marcas (LinkedIn/Instagram)
- **Roteamento:** React Router DOM v6 (BrowserRouter)
- **Gráficos:** Recharts (Dashboard)
- **CSV:** PapaParse (parse + import)
- **Formulários:** React Hook Form + Zod (parcial — usado nos forms maiores)
- **Estado global:** Context + Reducer + sync com localStorage entre abas
- **Tipografia:** Plus Jakarta Sans (display) + Inter (body)

---

## Identidade visual

Tema claro institucional inspirado em XP Inc. / BTG:

- Fundo off-white quente (`hsl 60 14% 97%`)
- Primary verde institucional escuro (`hsl 145 75% 22%`) — coerente com a marca verde do Grupo ICA, sem o neon
- Superfície escura para sidebar, footer e laterais de login (`--surface-dark`)
- Sombras suaves, bordas finas, letterspacing alto em uppercase
- Tipografia editorial corporativa

---

## Estrutura

```
src/
├── App.tsx                          # Router + providers
├── main.tsx                         # Entry
├── index.css                        # Tokens HSL + utilitários
├── lib/
│   ├── utils.ts                     # cn() helper
│   └── csv.ts                       # validateCpf, validateEmail, autoDetectColumn, ...
├── store/
│   ├── content.tsx                  # CMS do portal — Context + Reducer + localStorage
│   ├── investors.tsx                # Base de investidores — store separado
│   ├── types.ts                     # Tipos do conteúdo
│   └── seed.ts                      # Dados iniciais
├── mock/                            # Dados estáticos restantes (Dashboard)
│   ├── campanhas.ts
│   └── kpis.ts
├── components/
│   ├── brand/Logo.tsx               # Logo com variantes default/inverse
│   ├── sections/                    # Componentes do portal público
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── QuickActions.tsx
│   │   ├── InfoGrid.tsx
│   │   ├── Purpose.tsx
│   │   └── Footer.tsx
│   └── admin/
│       ├── layout/                  # AdminShell, Sidebar, Topbar
│       ├── kpi/KpiCard.tsx
│       └── csv/ImportCsvModal.tsx   # Wizard de import CSV
└── pages/
    ├── PortalRI.tsx                 # Home do portal R.I.
    ├── investidor/Login.tsx         # Login do investidor (CPF + senha + 2FA stub)
    └── admin/
        ├── Login.tsx                # Login do admin
        ├── Dashboard.tsx            # KPIs, gráfico de envios, atividades, campanhas
        ├── Investidores.tsx         # Base com busca, filtros, ordenação, paginação
        ├── Conteudo.tsx             # Overview do CMS
        ├── ConteudoComunicados.tsx  # CRUD
        ├── ConteudoEventos.tsx      # CRUD
        ├── ConteudoDocumentos.tsx   # CRUD com 9 categorias
        ├── ConteudoKit.tsx          # Configurador do Kit do Investidor
        ├── ConteudoTextos.tsx       # Editor de Hero, Propósito, KPIs, Ticker
        └── Stubs.tsx                # Telas em construção (Campanhas, Templates, Histórico)
```

---

## Rotas

| Rota | Quem | Status |
|------|------|--------|
| `/` | Público | ✅ Portal R.I. completo (Hero, atalhos, atualizações, kit, eventos, propósito) |
| `/investidor/login` | Investidor | ✅ Tela split-screen com CPF + senha (2FA SMS pendente) |
| `/admin/login` | Time RI | ✅ Tela split-screen com email + senha |
| `/admin/dashboard` | Time RI | ✅ KPIs, gráfico de envios 30d, atividades, campanhas |
| `/admin/investidores` | Time RI | ✅ Lista + filtros + busca + paginação + **upload CSV** |
| `/admin/campanhas` | Time RI | ⏳ Em construção |
| `/admin/templates` | Time RI | ⏳ Em construção |
| `/admin/historico` | Time RI | ⏳ Em construção |
| `/admin/configuracoes` | Time RI | ⏳ Em construção |
| `/admin/conteudo` | Time RI | ✅ Overview do CMS |
| `/admin/conteudo/comunicados` | Time RI | ✅ CRUD completo |
| `/admin/conteudo/eventos` | Time RI | ✅ CRUD completo |
| `/admin/conteudo/documentos` | Time RI | ✅ CRUD com 9 categorias + filtros |
| `/admin/conteudo/kit` | Time RI | ✅ Configurador com picklist + preview |
| `/admin/conteudo/textos` | Time RI | ✅ Editor com 4 abas (Hero, Propósito, KPIs, Ticker) |

---

## Funcionalidades destacadas

### CMS de conteúdo do portal
Toda informação exibida no portal R.I. público é editada pelo painel. Mudanças refletem em tempo real (mesma aba) e via reload automático (outras abas).

### Upload CSV de investidores
Modal wizard com 4 passos:
1. **Upload** — drag & drop ou seletor, parse com PapaParse
2. **Mapeamento** — auto-detect das colunas (CPF, nome, email, WhatsApp, valor) + override manual
3. **Validação** — CPF com dígito verificador, email com regex, detecção de duplicados (dentro do CSV e contra a base), filtros por estado
4. **Sucesso** — resumo de novos, duplicados, inválidos

### Persistência em localStorage
- `ica-content-store@v1` — CMS do portal
- `ica-investors-store@v1` — base de investidores
- Sync entre abas via `storage` event
- Reset rápido via botão na UI ou `localStorage.clear()`

### Integridade referencial
Deletar documento limpa automaticamente referências em comunicados vinculados e no Kit do Investidor (cascade delete no reducer).

---

## Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Subir dev server
npm run dev
# → http://localhost:5173

# 3. Build de produção
npm run build

# 4. Preview do build
npm run preview
```

---

## Decisões arquiteturais

### Sem backend (ainda)
Toda persistência via `localStorage`. Quando o backend chegar, basta:
- Trocar o reducer dos stores por chamadas a API
- Manter os tipos em `store/types.ts` como contrato
- Mover as actions pra TanStack Query

### Stores separados
- `content` → tudo que aparece no portal público (comunicados, eventos, documentos, kit, textos institucionais, ticker)
- `investors` → dados operacionais (base de investidores)

Não misturei porque conteúdo e dados operacionais têm ciclos de vida e auditoria diferentes.

### Mock data tipado vs hardcoded
KPIs e séries históricas que ainda não têm fluxo de produção continuam em `src/mock/`. Vão para os stores quando os módulos correspondentes (Campanhas, Histórico) forem implementados.

---

## Próximas entregas

- **E3.3** — Modal de detalhe/edição individual do investidor + histórico de comunicações recebidas
- **E3.4** — Ações em lote (multi-select, mudança em massa, export CSV)
- **E4** — Módulo de Campanhas (wizard de disparo multicanal: email + WhatsApp + push)
- **E5** — DRE + Balanço editáveis + página dedicada `/demonstracoes`
- **Backend** — quando o disparo real, upload de PDFs grandes ou auth real forem necessários

---

## Licença

Uso interno — Grupo ICA / Vixsofthouse.
