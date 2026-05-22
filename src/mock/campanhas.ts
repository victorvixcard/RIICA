export type CanalCampanha = "email" | "whatsapp" | "push";
export type StatusCampanha =
  | "rascunho"
  | "agendada"
  | "enviando"
  | "concluida"
  | "falhou";

export interface Campanha {
  id: string;
  titulo: string;
  canais: CanalCampanha[];
  status: StatusCampanha;
  audienciaTotal: number;
  entregues: number;
  abertura: number; // %
  agendadaPara?: string;
  criadaEm: string;
  template: string;
}

export const CAMPANHAS: Campanha[] = [
  {
    id: "CMP-2026-014",
    titulo: "Comunicado 1T26 — Release de Resultados",
    canais: ["email", "push"],
    status: "concluida",
    audienciaTotal: 6924,
    entregues: 6841,
    abertura: 68.4,
    criadaEm: "2026-05-18T10:00:00Z",
    template: "TPL-resultados-trimestrais",
  },
  {
    id: "CMP-2026-013",
    titulo: "Convite Teleconferência 1T26",
    canais: ["email", "whatsapp", "push"],
    status: "enviando",
    audienciaTotal: 6924,
    entregues: 4108,
    abertura: 42.1,
    criadaEm: "2026-05-21T09:00:00Z",
    template: "TPL-convite-teleconferencia",
  },
  {
    id: "CMP-2026-012",
    titulo: "Atualização da Reestruturação — Fase 2",
    canais: ["email", "whatsapp"],
    status: "agendada",
    audienciaTotal: 4521,
    entregues: 0,
    abertura: 0,
    agendadaPara: "2026-05-25T14:00:00Z",
    criadaEm: "2026-05-20T16:30:00Z",
    template: "TPL-atualizacao-fase",
  },
  {
    id: "CMP-2026-011",
    titulo: "Dividendos extraordinários — Aviso de pagamento",
    canais: ["email"],
    status: "rascunho",
    audienciaTotal: 6924,
    entregues: 0,
    abertura: 0,
    criadaEm: "2026-05-21T11:15:00Z",
    template: "TPL-dividendos",
  },
  {
    id: "CMP-2026-010",
    titulo: "Reunião APIMEC — Vitória/ES",
    canais: ["email", "push"],
    status: "concluida",
    audienciaTotal: 3200,
    entregues: 3172,
    abertura: 54.8,
    criadaEm: "2026-05-12T08:00:00Z",
    template: "TPL-evento",
  },
];

export const CANAL_LABEL: Record<CanalCampanha, string> = {
  email: "E-mail",
  whatsapp: "WhatsApp",
  push: "Push",
};

export const STATUS_CAMPANHA_LABEL: Record<StatusCampanha, string> = {
  rascunho: "Rascunho",
  agendada: "Agendada",
  enviando: "Enviando",
  concluida: "Concluída",
  falhou: "Falhou",
};
