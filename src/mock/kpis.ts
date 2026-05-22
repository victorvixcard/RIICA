export interface EnvioPorDia {
  data: string;
  email: number;
  whatsapp: number;
  push: number;
}

export const ENVIOS_30D: EnvioPorDia[] = [
  { data: "22.04", email: 0, whatsapp: 0, push: 0 },
  { data: "23.04", email: 120, whatsapp: 0, push: 60 },
  { data: "24.04", email: 0, whatsapp: 0, push: 0 },
  { data: "25.04", email: 1240, whatsapp: 800, push: 980 },
  { data: "26.04", email: 0, whatsapp: 0, push: 0 },
  { data: "27.04", email: 0, whatsapp: 0, push: 0 },
  { data: "28.04", email: 320, whatsapp: 0, push: 180 },
  { data: "29.04", email: 0, whatsapp: 0, push: 0 },
  { data: "30.04", email: 4200, whatsapp: 2800, push: 3600 },
  { data: "01.05", email: 0, whatsapp: 0, push: 0 },
  { data: "02.05", email: 0, whatsapp: 0, push: 0 },
  { data: "03.05", email: 120, whatsapp: 0, push: 0 },
  { data: "04.05", email: 0, whatsapp: 0, push: 0 },
  { data: "05.05", email: 880, whatsapp: 0, push: 420 },
  { data: "06.05", email: 0, whatsapp: 0, push: 0 },
  { data: "07.05", email: 0, whatsapp: 0, push: 0 },
  { data: "08.05", email: 240, whatsapp: 180, push: 100 },
  { data: "09.05", email: 0, whatsapp: 0, push: 0 },
  { data: "10.05", email: 0, whatsapp: 0, push: 0 },
  { data: "11.05", email: 320, whatsapp: 0, push: 200 },
  { data: "12.05", email: 3200, whatsapp: 1900, push: 2800 },
  { data: "13.05", email: 0, whatsapp: 0, push: 0 },
  { data: "14.05", email: 120, whatsapp: 0, push: 80 },
  { data: "15.05", email: 0, whatsapp: 0, push: 0 },
  { data: "16.05", email: 0, whatsapp: 0, push: 0 },
  { data: "17.05", email: 0, whatsapp: 0, push: 0 },
  { data: "18.05", email: 6841, whatsapp: 0, push: 5980 },
  { data: "19.05", email: 220, whatsapp: 0, push: 180 },
  { data: "20.05", email: 0, whatsapp: 0, push: 0 },
  { data: "21.05", email: 2104, whatsapp: 4108, push: 1820 },
];

export interface Atividade {
  id: string;
  tipo: "envio" | "import" | "campanha" | "login" | "edicao";
  texto: string;
  meta?: string;
  quando: string;
}

export const ATIVIDADES: Atividade[] = [
  {
    id: "act-1",
    tipo: "envio",
    texto: "Campanha CMP-2026-013 em andamento",
    meta: "4.108 / 6.924 entregues",
    quando: "há 8 minutos",
  },
  {
    id: "act-2",
    tipo: "import",
    texto: "Importação CSV concluída",
    meta: "412 investidores adicionados, 8 duplicados ignorados",
    quando: "há 1 hora",
  },
  {
    id: "act-3",
    tipo: "campanha",
    texto: "Nova campanha criada: 'Dividendos extraordinários'",
    meta: "Status: Rascunho",
    quando: "há 3 horas",
  },
  {
    id: "act-4",
    tipo: "envio",
    texto: "Campanha CMP-2026-014 concluída",
    meta: "6.841 entregues — 68,4% de abertura",
    quando: "há 1 dia",
  },
  {
    id: "act-5",
    tipo: "edicao",
    texto: "Template TPL-resultados-trimestrais atualizado",
    meta: "por Vitão",
    quando: "há 2 dias",
  },
  {
    id: "act-6",
    tipo: "login",
    texto: "Renan Giacomin entrou no painel",
    meta: "IP 187.45.x.x",
    quando: "há 2 dias",
  },
];
