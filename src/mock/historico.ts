export type StatusEnvio =
  | "entregue"
  | "aberto"
  | "clicado"
  | "falhou"
  | "bouncing"
  | "pendente";

export type CanalEnvio = "email" | "whatsapp" | "push";

export interface EnvioLog {
  id: string;
  campanhaId: string;
  campanhaTitulo: string;
  destinatarioNome: string;
  destinatarioContato: string;
  canal: CanalEnvio;
  status: StatusEnvio;
  enviadoEm: string;
  abertoEm?: string;
  clicadoEm?: string;
  erro?: string;
}

export const STATUS_ENVIO_LABEL: Record<StatusEnvio, string> = {
  entregue: "Entregue",
  aberto: "Aberto",
  clicado: "Clicado",
  falhou: "Falhou",
  bouncing: "Bouncing",
  pendente: "Pendente",
};

export const STATUS_ENVIO_TINT: Record<StatusEnvio, string> = {
  entregue: "bg-muted text-muted-foreground border-border",
  aberto: "bg-primary/10 text-primary border-primary/20",
  clicado: "bg-primary/15 text-primary-deep border-primary/30",
  falhou: "bg-destructive/10 text-destructive border-destructive/20",
  bouncing: "bg-destructive/5 text-destructive border-destructive/20",
  pendente: "bg-warning/10 text-warning-foreground border-warning/30",
};

export const HISTORICO: EnvioLog[] = [
  {
    id: "EVT-2026-05-21-001",
    campanhaId: "CMP-2026-013",
    campanhaTitulo: "Convite Teleconferência 1T26",
    destinatarioNome: "Ana Carolina Ferreira",
    destinatarioContato: "ana.ferreira@email.com",
    canal: "email",
    status: "clicado",
    enviadoEm: "2026-05-21T09:00:14Z",
    abertoEm: "2026-05-21T09:42:00Z",
    clicadoEm: "2026-05-21T09:43:12Z",
  },
  {
    id: "EVT-2026-05-21-002",
    campanhaId: "CMP-2026-013",
    campanhaTitulo: "Convite Teleconferência 1T26",
    destinatarioNome: "Bruno Lima Pereira",
    destinatarioContato: "+55 27 98888-5678",
    canal: "whatsapp",
    status: "aberto",
    enviadoEm: "2026-05-21T09:00:18Z",
    abertoEm: "2026-05-21T09:05:30Z",
  },
  {
    id: "EVT-2026-05-21-003",
    campanhaId: "CMP-2026-013",
    campanhaTitulo: "Convite Teleconferência 1T26",
    destinatarioNome: "Carla Souza Albuquerque",
    destinatarioContato: "carla.souza@email.com",
    canal: "email",
    status: "bouncing",
    enviadoEm: "2026-05-21T09:00:22Z",
    erro: "Caixa cheia (mailbox full)",
  },
  {
    id: "EVT-2026-05-21-004",
    campanhaId: "CMP-2026-013",
    campanhaTitulo: "Convite Teleconferência 1T26",
    destinatarioNome: "Daniel Vasconcelos",
    destinatarioContato: "daniel.v@email.com",
    canal: "push",
    status: "clicado",
    enviadoEm: "2026-05-21T09:00:25Z",
    abertoEm: "2026-05-21T09:01:08Z",
    clicadoEm: "2026-05-21T09:01:55Z",
  },
  {
    id: "EVT-2026-05-21-005",
    campanhaId: "CMP-2026-013",
    campanhaTitulo: "Convite Teleconferência 1T26",
    destinatarioNome: "Eduarda Martins Andrade",
    destinatarioContato: "eduarda.m@email.com",
    canal: "email",
    status: "entregue",
    enviadoEm: "2026-05-21T09:00:30Z",
  },
  {
    id: "EVT-2026-05-21-006",
    campanhaId: "CMP-2026-013",
    campanhaTitulo: "Convite Teleconferência 1T26",
    destinatarioNome: "Isabela Nogueira Brito",
    destinatarioContato: "isa.brito@email.com",
    canal: "email",
    status: "clicado",
    enviadoEm: "2026-05-21T09:00:42Z",
    abertoEm: "2026-05-21T10:18:00Z",
    clicadoEm: "2026-05-21T10:20:14Z",
  },
  {
    id: "EVT-2026-05-21-007",
    campanhaId: "CMP-2026-013",
    campanhaTitulo: "Convite Teleconferência 1T26",
    destinatarioNome: "Felipe Antunes Costa",
    destinatarioContato: "felipe.costa@email.com",
    canal: "email",
    status: "falhou",
    enviadoEm: "2026-05-21T09:00:50Z",
    erro: "E-mail bloqueado pelo destinatário",
  },
  {
    id: "EVT-2026-05-18-001",
    campanhaId: "CMP-2026-014",
    campanhaTitulo: "Comunicado 1T26 — Release de Resultados",
    destinatarioNome: "Ana Carolina Ferreira",
    destinatarioContato: "ana.ferreira@email.com",
    canal: "email",
    status: "clicado",
    enviadoEm: "2026-05-18T10:00:14Z",
    abertoEm: "2026-05-18T10:32:00Z",
    clicadoEm: "2026-05-18T10:33:21Z",
  },
  {
    id: "EVT-2026-05-18-002",
    campanhaId: "CMP-2026-014",
    campanhaTitulo: "Comunicado 1T26 — Release de Resultados",
    destinatarioNome: "Lucas Bernardes Faria",
    destinatarioContato: "lucas.b@email.com",
    canal: "email",
    status: "aberto",
    enviadoEm: "2026-05-18T10:00:30Z",
    abertoEm: "2026-05-18T11:00:00Z",
  },
  {
    id: "EVT-2026-05-18-003",
    campanhaId: "CMP-2026-014",
    campanhaTitulo: "Comunicado 1T26 — Release de Resultados",
    destinatarioNome: "Mariana Castro Lima",
    destinatarioContato: "mariana.c@email.com",
    canal: "push",
    status: "entregue",
    enviadoEm: "2026-05-18T10:00:36Z",
  },
  {
    id: "EVT-2026-05-18-004",
    campanhaId: "CMP-2026-014",
    campanhaTitulo: "Comunicado 1T26 — Release de Resultados",
    destinatarioNome: "Pedro Henrique Tavares",
    destinatarioContato: "pedro.t@email.com",
    canal: "email",
    status: "clicado",
    enviadoEm: "2026-05-18T10:00:40Z",
    abertoEm: "2026-05-18T12:15:00Z",
    clicadoEm: "2026-05-18T12:18:33Z",
  },
  {
    id: "EVT-2026-05-12-001",
    campanhaId: "CMP-2026-010",
    campanhaTitulo: "Reunião APIMEC — Vitória/ES",
    destinatarioNome: "Rafael Cordeiro Bastos",
    destinatarioContato: "rafael.c@email.com",
    canal: "email",
    status: "clicado",
    enviadoEm: "2026-05-12T08:00:11Z",
    abertoEm: "2026-05-12T09:02:00Z",
    clicadoEm: "2026-05-12T09:03:42Z",
  },
  {
    id: "EVT-2026-05-12-002",
    campanhaId: "CMP-2026-010",
    campanhaTitulo: "Reunião APIMEC — Vitória/ES",
    destinatarioNome: "Tiago Marques Filho",
    destinatarioContato: "tiago.m@email.com",
    canal: "push",
    status: "aberto",
    enviadoEm: "2026-05-12T08:00:18Z",
    abertoEm: "2026-05-12T08:45:00Z",
  },
  {
    id: "EVT-2026-05-12-003",
    campanhaId: "CMP-2026-010",
    campanhaTitulo: "Reunião APIMEC — Vitória/ES",
    destinatarioNome: "Úrsula Bittencourt Ribeiro",
    destinatarioContato: "ursula.b@email.com",
    canal: "email",
    status: "entregue",
    enviadoEm: "2026-05-12T08:00:22Z",
  },
  {
    id: "EVT-2026-05-12-004",
    campanhaId: "CMP-2026-010",
    campanhaTitulo: "Reunião APIMEC — Vitória/ES",
    destinatarioNome: "Vinicius Antunes Borges",
    destinatarioContato: "vinicius.a@email.com",
    canal: "email",
    status: "pendente",
    enviadoEm: "2026-05-12T08:00:28Z",
  },
  {
    id: "EVT-2026-05-12-005",
    campanhaId: "CMP-2026-010",
    campanhaTitulo: "Reunião APIMEC — Vitória/ES",
    destinatarioNome: "Xênia Carvalho Furtado",
    destinatarioContato: "xenia.c@email.com",
    canal: "email",
    status: "clicado",
    enviadoEm: "2026-05-12T08:00:31Z",
    abertoEm: "2026-05-12T09:30:00Z",
    clicadoEm: "2026-05-12T09:32:11Z",
  },
];
