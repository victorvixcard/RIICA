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
  navItems: [
    { id: "nav-1", label: "Governança Corporativa", url: "#governanca", ordem: 0, visivel: true },
    { id: "nav-2", label: "Informações Financeiras", url: "/demonstracoes", ordem: 1, visivel: true },
    { id: "nav-3", label: "Comunicados, Eventos e Replays", url: "#comunicados", ordem: 2, visivel: true },
    { id: "nav-4", label: "Ação", url: "#acao", ordem: 3, visivel: true },
    { id: "nav-5", label: "Serviços aos Investidores", url: "#servicos", ordem: 4, visivel: true },
  ],
  quickActions: [
    { id: "qa-1", label: "FAQs", href: "#faqs", ordem: 0, visivel: true },
    { id: "qa-2", label: "Resultados Trimestrais", href: "#resultados", ordem: 1, visivel: true },
    { id: "qa-3", label: "Apresentação Institucional", href: "#apresentacao", ordem: 2, visivel: true },
    { id: "qa-4", label: "Mailing", href: "#mailing", ordem: 3, visivel: true },
    { id: "qa-5", label: "Contato com RI", href: "#contato", ordem: 4, visivel: true },
  ],
  footerColunas: [
    {
      id: "fc-1",
      titulo: "Sobre a ICA",
      links: [
        { id: "fl-1", label: "Quem somos", url: "#" },
        { id: "fl-2", label: "Nossas soluções", url: "#" },
        { id: "fl-3", label: "Governança", url: "#" },
        { id: "fl-4", label: "Carreiras", url: "#" },
      ],
    },
    {
      id: "fc-2",
      titulo: "Investidores",
      links: [
        { id: "fl-5", label: "Informações financeiras", url: "/demonstracoes" },
        { id: "fl-6", label: "Comunicados ao mercado", url: "#comunicados" },
        { id: "fl-7", label: "Agenda do investidor", url: "#eventos" },
        { id: "fl-8", label: "FAQ", url: "#faqs" },
      ],
    },
    {
      id: "fc-3",
      titulo: "Atendimento",
      links: [
        { id: "fl-9", label: "Fale com RI", url: "#contato" },
        { id: "fl-10", label: "Imprensa", url: "#" },
        { id: "fl-11", label: "Ouvidoria", url: "#" },
        { id: "fl-12", label: "Política de privacidade", url: "#" },
      ],
    },
  ],
  redesSociais: [
    { id: "rs-1", tipo: "linkedin", url: "#" },
    { id: "rs-2", tipo: "instagram", url: "#" },
    { id: "rs-3", tipo: "email", url: "mailto:ri@grupoica.com.br" },
    { id: "rs-4", tipo: "telefone", url: "tel:+5527000000000" },
  ],
  config: {
    institucionalUrl: "https://seugrupoica.com.br",
    footerDescricao:
      "Relações com Investidores do Grupo ICA — transparência, governança e comunicação direta com nossos acionistas.",
    footerCnpj: "CNPJ 00.000.000/0001-00",
    footerEndereco: "Rua Exemplo, 1000 — Vitória/ES — Brasil",
    footerCopyright: "© 2026 Grupo ICA. Todos os direitos reservados.",
  },
  faqs: [
    { id: "faq-1", pergunta: "Como acesso a área do investidor?", resposta: "Clique em \"Área do Investidor\" no topo do portal e entre com seu CPF e a senha cadastrada no primeiro acesso.", categoria: "Acesso", ordem: 0, publicado: true },
    { id: "faq-2", pergunta: "Onde encontro os resultados trimestrais?", resposta: "Os releases, apresentações e demonstrações financeiras de cada trimestre ficam no Kit do Investidor e na seção de Documentos.", categoria: "Resultados", ordem: 1, publicado: true },
    { id: "faq-3", pergunta: "Como entro em contato com o time de RI?", resposta: "Use o botão \"Contato com RI\" no portal ou escreva para ri@grupoica.com.br.", categoria: "Contato", ordem: 2, publicado: true },
    { id: "faq-4", pergunta: "Quando ocorre a próxima teleconferência?", resposta: "As datas das teleconferências e demais eventos ficam na agenda \"Próximos Eventos\" da home.", categoria: "Eventos", ordem: 3, publicado: true },
  ],
};
