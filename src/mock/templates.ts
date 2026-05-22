export type CanalTemplate = "email" | "whatsapp" | "push";

export interface Template {
  id: string;
  nome: string;
  canal: CanalTemplate;
  /** Apenas pra email */
  assunto?: string;
  /** Pré-visualização do corpo (texto plano, sem HTML) */
  resumo: string;
  /** Conteúdo completo (HTML pra email, texto pra WhatsApp/Push) */
  conteudo: string;
  tags: string[];
  usos: number;
  ultimaEdicao: string;
  ativo: boolean;
}

export const CANAL_TEMPLATE_LABEL: Record<CanalTemplate, string> = {
  email: "E-mail",
  whatsapp: "WhatsApp",
  push: "Push",
};

export const TEMPLATES: Template[] = [
  {
    id: "TPL-001",
    nome: "Release de Resultados Trimestrais",
    canal: "email",
    assunto: "Resultados do {{trimestre}} disponíveis — Grupo ICA",
    resumo:
      "Prezado(a) {{nome}}, o Grupo ICA divulgou os resultados financeiros do {{trimestre}}...",
    conteudo:
      "<h2>Resultados do {{trimestre}}</h2><p>Prezado(a) {{nome}},</p><p>O Grupo ICA divulgou os resultados financeiros do {{trimestre}}. Acesse o material completo no portal.</p><p><a href='{{url_kit}}'>Acessar Kit do Investidor</a></p>",
    tags: ["trimestral", "resultados", "release"],
    usos: 12,
    ultimaEdicao: "2026-05-18",
    ativo: true,
  },
  {
    id: "TPL-002",
    nome: "Convite Teleconferência",
    canal: "email",
    assunto: "Convite — Teleconferência de Resultados {{trimestre}}",
    resumo:
      "Olá {{nome}}, convidamos você para a teleconferência de resultados do {{trimestre}}...",
    conteudo:
      "<h2>Teleconferência {{trimestre}}</h2><p>Olá {{nome}},</p><p>Convidamos você para nossa teleconferência em {{data}} às {{hora}}.</p>",
    tags: ["convite", "teleconferência", "evento"],
    usos: 8,
    ultimaEdicao: "2026-05-20",
    ativo: true,
  },
  {
    id: "TPL-003",
    nome: "Aviso curto — WhatsApp Resultados",
    canal: "whatsapp",
    resumo:
      "Olá {{nome}}, os resultados do {{trimestre}} já estão no portal do investidor.",
    conteudo:
      "Olá {{nome}}, os resultados do {{trimestre}} já estão no portal do investidor. Acesse: {{url_kit}}",
    tags: ["trimestral", "curto"],
    usos: 14,
    ultimaEdicao: "2026-05-21",
    ativo: true,
  },
  {
    id: "TPL-004",
    nome: "Push — Novo Comunicado",
    canal: "push",
    resumo: "📊 Novo comunicado do Grupo ICA disponível no portal.",
    conteudo:
      "📊 Novo comunicado do Grupo ICA disponível no portal. Toque para ler.",
    tags: ["comunicado", "alerta"],
    usos: 32,
    ultimaEdicao: "2026-05-19",
    ativo: true,
  },
  {
    id: "TPL-005",
    nome: "Dividendos — Aviso de pagamento",
    canal: "email",
    assunto: "Pagamento de dividendos confirmado — Grupo ICA",
    resumo:
      "{{nome}}, confirmamos o pagamento de R$ {{valor_div}} referente aos seus dividendos...",
    conteudo:
      "<h2>Pagamento de dividendos</h2><p>{{nome}}, confirmamos o pagamento de R$ {{valor_div}} referente aos seus dividendos do exercício {{ano}}.</p><p>O crédito foi realizado em {{data}}.</p>",
    tags: ["dividendos", "pagamento"],
    usos: 4,
    ultimaEdicao: "2026-05-15",
    ativo: true,
  },
  {
    id: "TPL-006",
    nome: "Atualização da Reestruturação",
    canal: "email",
    assunto: "Atualização da Fase {{fase}} — Reestruturação",
    resumo:
      "Prezados investidores, comunicamos o andamento da Fase {{fase}} da reestruturação...",
    conteudo:
      "<h2>Atualização — Fase {{fase}}</h2><p>Prezados investidores,</p><p>Comunicamos o andamento da Fase {{fase}} da reestruturação societária do Grupo ICA.</p>",
    tags: ["reestruturação", "fase", "fidc"],
    usos: 6,
    ultimaEdicao: "2026-05-20",
    ativo: true,
  },
  {
    id: "TPL-007",
    nome: "Onboarding — Boas-vindas",
    canal: "email",
    assunto: "Bem-vindo(a) à área do investidor do Grupo ICA",
    resumo:
      "Olá {{nome}}, sua conta de investidor foi criada. Acesse seus dados no portal...",
    conteudo:
      "<h2>Bem-vindo(a)</h2><p>Olá {{nome}}, sua conta foi criada com sucesso.</p><p>Acesse: {{url_portal}}</p>",
    tags: ["onboarding", "boas-vindas"],
    usos: 142,
    ultimaEdicao: "2026-04-30",
    ativo: true,
  },
  {
    id: "TPL-008",
    nome: "Lembrete — Documentação pendente",
    canal: "whatsapp",
    resumo:
      "{{nome}}, identificamos documentos pendentes no seu cadastro. Atualize em {{prazo}}.",
    conteudo:
      "Olá {{nome}}, identificamos documentos pendentes no seu cadastro. Atualize até {{prazo}} para manter sua conta ativa: {{url_docs}}",
    tags: ["compliance", "documentos"],
    usos: 38,
    ultimaEdicao: "2026-05-10",
    ativo: false,
  },
];
