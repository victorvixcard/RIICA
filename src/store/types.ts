// ===== Tipos do Content Store =====
// Tudo que o admin pode editar e o portal exibe.

export type CategoriaDoc =
  | "release"
  | "apresentacao"
  | "demonstracao"
  | "ata"
  | "regulamento"
  | "fato_relevante"
  | "comunicado"
  | "formulario"
  | "outro";

export const CATEGORIA_DOC_LABEL: Record<CategoriaDoc, string> = {
  release: "Release",
  apresentacao: "Apresentação",
  demonstracao: "Demonstrações Financeiras",
  ata: "Ata de Reunião",
  regulamento: "Regulamento",
  fato_relevante: "Fato Relevante",
  comunicado: "Comunicado ao Mercado",
  formulario: "Formulário (20-F, etc.)",
  outro: "Outro",
};

export interface Documento {
  id: string;
  titulo: string;
  categoria: CategoriaDoc;
  /** Ex: "1T26", "4T25", "2025-Anual" */
  periodo?: string;
  /** Em mock, é o nome do arquivo. No backend será URL. */
  arquivo: string;
  /** Em bytes */
  tamanho?: number;
  dataPublicacao: string; // ISO
  publico: boolean;
  /** Tag livre — admin pode marcar pra agrupar */
  tag?: string;
}

export interface Comunicado {
  id: string;
  data: string; // ISO
  /** Categoria/tag exibida acima do título — ex: "COMUNICADO", "AVISO", "AGE". */
  tag: string;
  titulo: string;
  resumo?: string;
  /** Documento vinculado (opcional, schema legado). */
  documentoId?: string;
  /** URL do PDF (Storage) ou link externo. */
  link?: string;
  /** Mantido por compat — não usado na lista nova. */
  destaque: boolean;
  publicado: boolean;
  /** Desempate na ordenação quando duas datas coincidem. */
  ordem: number;
}

export type TipoEvento =
  | "Conferência"
  | "Presencial"
  | "Virtual"
  | "APIMEC"
  | "Investor Day"
  | "Assembleia";

export interface Evento {
  id: string;
  data: string; // ISO date
  hora: string; // "10h00" ou "Dia todo"
  titulo: string;
  tipo: TipoEvento;
  local?: string;
  linkInscricao?: string;
  publicado: boolean;
}

export interface KitTrimestre {
  trimestre: string; // "1T26"
  ano: number;
  /** Documentos em destaque exibidos no Kit do Investidor da home */
  documentosDestaqueIds: string[];
  /** Links auxiliares mostrados como linha de "/" no Kit */
  linksAuxiliares: { id: string; label: string; url: string }[];
}

export interface TickerSimbolo {
  id: string;
  simbolo: string;
  preco: string;
  variacao: string;
  positivo: boolean;
}

export interface Kpi {
  id: string;
  valor: string;
  label: string;
}

export interface TextosInstitucionais {
  hero: {
    eyebrow: string;
    tituloLinha1: string;
    tituloLinha2: string;
    descricao: string;
    ctaLabel: string;
    ctaSecundarioLabel: string;
  };
  purpose: {
    eyebrow: string;
    tituloAntes: string;
    tituloDestaque: string;
    descricao: string;
    kpisEyebrow: string;
  };
  kpis: Kpi[];
  ticker: TickerSimbolo[];
}

// ===== CMS estendido — blocos antes hardcoded =====
export interface NavItem {
  id: string;
  label: string;
  url: string;
  ordem: number;
  visivel: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  href: string;
  ordem: number;
  visivel: boolean;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterColuna {
  id: string;
  titulo: string;
  links: FooterLink[];
}

export type TipoRedeSocial =
  | "linkedin"
  | "instagram"
  | "facebook"
  | "youtube"
  | "x"
  | "email"
  | "telefone";

export interface RedeSocial {
  id: string;
  tipo: TipoRedeSocial;
  url: string;
}

export interface SiteConfig {
  institucionalUrl: string;
  footerDescricao: string;
  footerCnpj: string;
  footerEndereco: string;
  footerCopyright: string;
}

export interface Faq {
  id: string;
  pergunta: string;
  resposta: string;
  categoria?: string;
  ordem: number;
  publicado: boolean;
}

export interface FatoRelevante {
  id: string;
  data: string; // ISO
  /** Categoria/tag exibida acima do título — ex: "COMUNICADO OFICIAL", "AVISO AO MERCADO" */
  tag: string;
  titulo: string;
  resumo?: string;
  /** URL externa ou interna (hiperlink do item) */
  url?: string;
  publicado: boolean;
  ordem: number;
}

export interface ContentState {
  version: number;
  comunicados: Comunicado[];
  eventos: Evento[];
  documentos: Documento[];
  kitAtual: KitTrimestre;
  textos: TextosInstitucionais;
  // CMS estendido
  navItems: NavItem[];
  quickActions: QuickAction[];
  footerColunas: FooterColuna[];
  redesSociais: RedeSocial[];
  config: SiteConfig;
  faqs: Faq[];
  fatosRelevantes: FatoRelevante[];
}
