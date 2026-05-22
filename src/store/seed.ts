import type { ContentState } from "./types";

export const CONTENT_VERSION = 1;

export const SEED: ContentState = {
  version: CONTENT_VERSION,
  comunicados: [
    {
      id: "com-001",
      data: "2026-05-19",
      titulo:
        "Grupo ICA anuncia novo programa de dividendos extraordinários",
      resumo:
        "Conselho aprovou distribuição de R$ 0,42 por ação a ser paga em 30/06.",
      destaque: true,
      publicado: true,
    },
    {
      id: "com-002",
      data: "2026-05-18",
      titulo: "Grupo ICA divulga resultados financeiros do 1T26",
      resumo:
        "Receita líquida cresceu 12,8% no comparativo anual. EBITDA ajustado de R$ 184M.",
      documentoId: "doc-001",
      destaque: true,
      publicado: true,
    },
    {
      id: "com-003",
      data: "2026-05-12",
      titulo:
        "Comunicado ao mercado: aquisição estratégica no segmento de varejo",
      resumo:
        "Aquisição de 60% da Capixaba Distribuidora aprovada pelo CADE.",
      destaque: true,
      publicado: true,
    },
    {
      id: "com-004",
      data: "2026-04-30",
      titulo: "Reunião do Conselho de Administração — ata disponível",
      documentoId: "doc-004",
      destaque: true,
      publicado: true,
    },
  ],
  eventos: [
    {
      id: "evt-001",
      data: "2026-05-28",
      hora: "10h00",
      titulo: "Teleconferência de Resultados 1T26",
      tipo: "Conferência",
      linkInscricao: "https://ri.icabank.com.br/teleconf",
      publicado: true,
    },
    {
      id: "evt-002",
      data: "2026-06-12",
      hora: "14h00",
      titulo: "Reunião APIMEC — Vitória/ES",
      tipo: "APIMEC",
      local: "Vitória/ES",
      publicado: true,
    },
    {
      id: "evt-003",
      data: "2026-07-20",
      hora: "Dia todo",
      titulo: "ICA Investor Day 2026",
      tipo: "Investor Day",
      local: "São Paulo/SP",
      publicado: true,
    },
  ],
  documentos: [
    {
      id: "doc-001",
      titulo: "Release de Resultados 1T26",
      categoria: "release",
      periodo: "1T26",
      arquivo: "release-1t26.pdf",
      tamanho: 1248000,
      dataPublicacao: "2026-05-18",
      publico: true,
    },
    {
      id: "doc-002",
      titulo: "Apresentação de Resultados 1T26",
      categoria: "apresentacao",
      periodo: "1T26",
      arquivo: "apresentacao-1t26.pdf",
      tamanho: 3850000,
      dataPublicacao: "2026-05-18",
      publico: true,
    },
    {
      id: "doc-003",
      titulo: "Demonstrações Financeiras Consolidadas 1T26",
      categoria: "demonstracao",
      periodo: "1T26",
      arquivo: "dfp-1t26.pdf",
      tamanho: 5120000,
      dataPublicacao: "2026-05-18",
      publico: true,
    },
    {
      id: "doc-004",
      titulo: "Ata da Reunião do Conselho — 30.04.2026",
      categoria: "ata",
      periodo: "1T26",
      arquivo: "ata-conselho-30-04-2026.pdf",
      tamanho: 412000,
      dataPublicacao: "2026-04-30",
      publico: true,
    },
    {
      id: "doc-005",
      titulo: "Formulário 20-F — exercício 2025",
      categoria: "formulario",
      periodo: "2025-Anual",
      arquivo: "20-f-2025.pdf",
      tamanho: 8420000,
      dataPublicacao: "2026-03-31",
      publico: true,
    },
    {
      id: "doc-006",
      titulo: "Apresentação Institucional — Maio/2026",
      categoria: "apresentacao",
      arquivo: "apresentacao-institucional.pdf",
      tamanho: 6240000,
      dataPublicacao: "2026-05-02",
      publico: true,
    },
  ],
  kitAtual: {
    trimestre: "1T26",
    ano: 2026,
    documentosDestaqueIds: ["doc-001", "doc-002", "doc-003"],
    linksAuxiliares: [
      { id: "la-1", label: "20-F", url: "#" },
      { id: "la-2", label: "Apresentação Institucional", url: "#" },
      { id: "la-3", label: "Planilha de Dados", url: "#" },
    ],
  },
  textos: {
    hero: {
      eyebrow: "Resultados 1T26 disponíveis",
      tituloLinha1: "Grupo ICA divulga",
      tituloLinha2: "resultados do 1T26",
      descricao:
        "Acesse o material completo de divulgação trimestral — release, apresentação, demonstrações financeiras e teleconferência com a administração.",
      ctaLabel: "Acessar Kit do Investidor",
      ctaSecundarioLabel: "Agendar teleconferência",
    },
    purpose: {
      eyebrow: "Quem somos",
      tituloAntes: "Nosso propósito é",
      tituloDestaque: "transformar vidas",
      descricao:
        "O Grupo ICA é um ecossistema de soluções que conecta pessoas e empresas ao que importa — com mais de três décadas construindo presença sólida no mercado capixaba e nacional.",
      kpisEyebrow: "Grupo ICA em números",
    },
    kpis: [
      { id: "kpi-1", valor: "+30", label: "Anos de história" },
      { id: "kpi-2", valor: "2.500", label: "Colaboradores" },
      { id: "kpi-3", valor: "R$ 3,2 bi", label: "Receita líquida 2025" },
      { id: "kpi-4", valor: "12", label: "Unidades de negócio" },
      { id: "kpi-5", valor: "4", label: "Estados de atuação" },
      { id: "kpi-6", valor: "100%", label: "Capital nacional" },
    ],
    ticker: [
      {
        id: "tk-1",
        simbolo: "ICAB31",
        preco: "R$ 42,80",
        variacao: "↑ 1,24%",
        positivo: true,
      },
      {
        id: "tk-2",
        simbolo: "ICA",
        preco: "$ 8,75",
        variacao: "↑ 0,89%",
        positivo: true,
      },
    ],
  },
};
