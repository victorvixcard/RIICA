// ===== DRE e Balanço Patrimonial =====
// Valores em R$ milhares (apresentação na UI converte para legibilidade).

export interface PeriodoFinanceiro {
  id: string;
  trimestre: string; // ex: "1T26", "4T25"
  ano: number;
  publicado: boolean;
}

export const PERIODOS: PeriodoFinanceiro[] = [
  { id: "P-1T26", trimestre: "1T26", ano: 2026, publicado: true },
  { id: "P-4T25", trimestre: "4T25", ano: 2025, publicado: true },
  { id: "P-3T25", trimestre: "3T25", ano: 2025, publicado: true },
  { id: "P-2T25", trimestre: "2T25", ano: 2025, publicado: true },
];

export interface LinhaFinanceira {
  conta: string;
  ordem: number;
  destaque: boolean;
  /** Indentação visual */
  nivel: 0 | 1 | 2;
  /** Valores por período (chave = id do período) */
  valores: Record<string, number>;
}

// ===== DRE — Demonstração de Resultados =====
export const DRE: LinhaFinanceira[] = [
  {
    conta: "Receita Bruta",
    ordem: 1,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 892000, "P-4T25": 820000, "P-3T25": 785000, "P-2T25": 760000 },
  },
  {
    conta: "(–) Deduções de receita",
    ordem: 2,
    destaque: false,
    nivel: 1,
    valores: { "P-1T26": -94000, "P-4T25": -88000, "P-3T25": -82000, "P-2T25": -80000 },
  },
  {
    conta: "Receita Líquida",
    ordem: 3,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 798000, "P-4T25": 732000, "P-3T25": 703000, "P-2T25": 680000 },
  },
  {
    conta: "(–) Custos dos produtos/serviços",
    ordem: 4,
    destaque: false,
    nivel: 1,
    valores: { "P-1T26": -512000, "P-4T25": -478000, "P-3T25": -461000, "P-2T25": -448000 },
  },
  {
    conta: "Lucro Bruto",
    ordem: 5,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 286000, "P-4T25": 254000, "P-3T25": 242000, "P-2T25": 232000 },
  },
  {
    conta: "Despesas operacionais",
    ordem: 6,
    destaque: false,
    nivel: 1,
    valores: { "P-1T26": -112000, "P-4T25": -108000, "P-3T25": -104000, "P-2T25": -101000 },
  },
  {
    conta: "  Vendas",
    ordem: 7,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": -52000, "P-4T25": -50000, "P-3T25": -48000, "P-2T25": -47000 },
  },
  {
    conta: "  Administrativas",
    ordem: 8,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": -42000, "P-4T25": -41000, "P-3T25": -39000, "P-2T25": -38000 },
  },
  {
    conta: "  Outras",
    ordem: 9,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": -18000, "P-4T25": -17000, "P-3T25": -17000, "P-2T25": -16000 },
  },
  {
    conta: "EBITDA",
    ordem: 10,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 184000, "P-4T25": 156000, "P-3T25": 148000, "P-2T25": 142000 },
  },
  {
    conta: "Depreciação e amortização",
    ordem: 11,
    destaque: false,
    nivel: 1,
    valores: { "P-1T26": -22000, "P-4T25": -21000, "P-3T25": -20000, "P-2T25": -20000 },
  },
  {
    conta: "Resultado Financeiro",
    ordem: 12,
    destaque: false,
    nivel: 1,
    valores: { "P-1T26": -32000, "P-4T25": -34000, "P-3T25": -31000, "P-2T25": -29000 },
  },
  {
    conta: "Lucro antes do IR",
    ordem: 13,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 130000, "P-4T25": 101000, "P-3T25": 97000, "P-2T25": 93000 },
  },
  {
    conta: "IR e Contribuição Social",
    ordem: 14,
    destaque: false,
    nivel: 1,
    valores: { "P-1T26": -42000, "P-4T25": -34000, "P-3T25": -32000, "P-2T25": -31000 },
  },
  {
    conta: "Lucro Líquido",
    ordem: 15,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 88000, "P-4T25": 67000, "P-3T25": 65000, "P-2T25": 62000 },
  },
];

// ===== Balanço Patrimonial =====
export const BALANCO_ATIVO: LinhaFinanceira[] = [
  {
    conta: "Ativo Circulante",
    ordem: 1,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 1240000, "P-4T25": 1185000, "P-3T25": 1120000, "P-2T25": 1080000 },
  },
  {
    conta: "  Caixa e equivalentes",
    ordem: 2,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 384000, "P-4T25": 312000, "P-3T25": 298000, "P-2T25": 280000 },
  },
  {
    conta: "  Contas a receber",
    ordem: 3,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 562000, "P-4T25": 538000, "P-3T25": 510000, "P-2T25": 492000 },
  },
  {
    conta: "  Estoques",
    ordem: 4,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 218000, "P-4T25": 232000, "P-3T25": 218000, "P-2T25": 212000 },
  },
  {
    conta: "  Outros",
    ordem: 5,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 76000, "P-4T25": 103000, "P-3T25": 94000, "P-2T25": 96000 },
  },
  {
    conta: "Ativo Não Circulante",
    ordem: 6,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 2120000, "P-4T25": 2105000, "P-3T25": 2080000, "P-2T25": 2058000 },
  },
  {
    conta: "  Imobilizado",
    ordem: 7,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 1450000, "P-4T25": 1440000, "P-3T25": 1422000, "P-2T25": 1408000 },
  },
  {
    conta: "  Intangível",
    ordem: 8,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 480000, "P-4T25": 478000, "P-3T25": 472000, "P-2T25": 468000 },
  },
  {
    conta: "  Investimentos",
    ordem: 9,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 190000, "P-4T25": 187000, "P-3T25": 186000, "P-2T25": 182000 },
  },
  {
    conta: "Total do Ativo",
    ordem: 10,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 3360000, "P-4T25": 3290000, "P-3T25": 3200000, "P-2T25": 3138000 },
  },
];

export const BALANCO_PASSIVO: LinhaFinanceira[] = [
  {
    conta: "Passivo Circulante",
    ordem: 1,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 720000, "P-4T25": 705000, "P-3T25": 680000, "P-2T25": 665000 },
  },
  {
    conta: "  Fornecedores",
    ordem: 2,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 312000, "P-4T25": 305000, "P-3T25": 292000, "P-2T25": 285000 },
  },
  {
    conta: "  Empréstimos curto prazo",
    ordem: 3,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 248000, "P-4T25": 245000, "P-3T25": 240000, "P-2T25": 232000 },
  },
  {
    conta: "  Obrigações tributárias",
    ordem: 4,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 96000, "P-4T25": 92000, "P-3T25": 88000, "P-2T25": 86000 },
  },
  {
    conta: "  Outros",
    ordem: 5,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 64000, "P-4T25": 63000, "P-3T25": 60000, "P-2T25": 62000 },
  },
  {
    conta: "Passivo Não Circulante",
    ordem: 6,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 980000, "P-4T25": 998000, "P-3T25": 1010000, "P-2T25": 1015000 },
  },
  {
    conta: "  Empréstimos longo prazo",
    ordem: 7,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 820000, "P-4T25": 840000, "P-3T25": 852000, "P-2T25": 858000 },
  },
  {
    conta: "  Provisões",
    ordem: 8,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 160000, "P-4T25": 158000, "P-3T25": 158000, "P-2T25": 157000 },
  },
  {
    conta: "Patrimônio Líquido",
    ordem: 9,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 1660000, "P-4T25": 1587000, "P-3T25": 1510000, "P-2T25": 1458000 },
  },
  {
    conta: "  Capital social",
    ordem: 10,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 1000000, "P-4T25": 1000000, "P-3T25": 1000000, "P-2T25": 1000000 },
  },
  {
    conta: "  Reservas e lucros acumulados",
    ordem: 11,
    destaque: false,
    nivel: 2,
    valores: { "P-1T26": 660000, "P-4T25": 587000, "P-3T25": 510000, "P-2T25": 458000 },
  },
  {
    conta: "Total Passivo + PL",
    ordem: 12,
    destaque: true,
    nivel: 0,
    valores: { "P-1T26": 3360000, "P-4T25": 3290000, "P-3T25": 3200000, "P-2T25": 3138000 },
  },
];
