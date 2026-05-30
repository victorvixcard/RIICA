// Arquivo de contexto: co-loca provider, hook e constantes/tipos do domínio.
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import * as investidoresApi from "@/lib/api/investidores";
import { useAuth } from "./auth";

// ===== Tipos =====
export type StatusInvestidor =
  | "ativo"
  | "pendente_confirmacao"
  | "bloqueado"
  | "inativo";

export type OrigemInvestidor =
  | "CSV"
  | "Cadastro manual"
  | "Importação SCP"
  | "Indicação";

export interface Investidor {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  whatsapp: string;
  status: StatusInvestidor;
  valorInvestido: number;
  ultimoContato: string; // ISO yyyy-mm-dd
  origem: OrigemInvestidor;
  tags?: string[];
  criadoEm: string;
}

export const STATUS_LABEL: Record<StatusInvestidor, string> = {
  ativo: "Ativo",
  pendente_confirmacao: "Pendente",
  bloqueado: "Bloqueado",
  inativo: "Inativo",
};

export const STATUS_TINT: Record<StatusInvestidor, string> = {
  ativo: "bg-primary/10 text-primary border-primary/20",
  pendente_confirmacao: "bg-warning/15 text-warning-foreground border-warning/30",
  bloqueado: "bg-destructive/10 text-destructive border-destructive/20",
  inativo: "bg-muted text-muted-foreground border-border",
};

// ===== Seed =====
const SEED_INVESTORS: Investidor[] = [
  ["Ana Carolina Ferreira", "123.456.789-00", "ana.ferreira@email.com", "+55 27 99999-1234", "ativo", 285000, "2026-05-19", "CSV"],
  ["Bruno Lima Pereira", "987.654.321-00", "bruno.lima@email.com", "+55 27 98888-5678", "ativo", 1240000, "2026-05-18", "CSV"],
  ["Carla Souza Albuquerque", "456.789.123-00", "carla.souza@email.com", "+55 11 97777-3456", "pendente_confirmacao", 75000, "2026-04-30", "Cadastro manual"],
  ["Daniel Vasconcelos Pinto", "321.654.987-00", "daniel.v@email.com", "+55 31 96666-7890", "ativo", 520000, "2026-05-15", "Importação SCP"],
  ["Eduarda Martins Andrade", "654.987.321-00", "eduarda.m@email.com", "+55 21 95555-1122", "ativo", 180000, "2026-05-12", "CSV"],
  ["Felipe Antunes Costa", "789.123.456-00", "felipe.costa@email.com", "+55 27 94444-3344", "bloqueado", 320000, "2026-03-22", "CSV"],
  ["Gabriela Reis Monteiro", "147.258.369-00", "gabi.reis@email.com", "+55 27 93333-5566", "ativo", 95000, "2026-05-17", "CSV"],
  ["Henrique Toledo Pacheco", "258.369.147-00", "henrique.t@email.com", "+55 11 92222-7788", "inativo", 0, "2025-11-08", "Importação SCP"],
  ["Isabela Nogueira Brito", "369.147.258-00", "isa.brito@email.com", "+55 27 91111-9900", "ativo", 2150000, "2026-05-20", "CSV"],
  ["João Pedro Mendonça", "159.357.486-00", "joao.m@email.com", "+55 31 90000-2233", "pendente_confirmacao", 60000, "2026-05-08", "Cadastro manual"],
  ["Karina Oliveira Salles", "753.951.486-00", "karina.s@email.com", "+55 27 99811-1100", "ativo", 410000, "2026-05-19", "CSV"],
  ["Lucas Bernardes Faria", "852.741.963-00", "lucas.b@email.com", "+55 11 98722-3344", "ativo", 1850000, "2026-05-21", "Indicação"],
  ["Mariana Castro Lima", "951.357.852-00", "mariana.c@email.com", "+55 31 97633-5566", "ativo", 130000, "2026-05-14", "CSV"],
  ["Nelson Diniz Almeida", "246.813.579-00", "nelson.d@email.com", "+55 21 96544-7788", "pendente_confirmacao", 250000, "2026-05-05", "Cadastro manual"],
  ["Olívia Pacheco Ramos", "135.792.468-00", "olivia.p@email.com", "+55 27 95455-9900", "ativo", 88000, "2026-05-16", "CSV"],
  ["Pedro Henrique Tavares", "864.197.532-00", "pedro.t@email.com", "+55 27 94366-1122", "ativo", 720000, "2026-05-13", "CSV"],
  ["Quezia Lopes Madureira", "975.318.642-00", "quezia.l@email.com", "+55 11 93277-3344", "ativo", 165000, "2026-05-19", "Importação SCP"],
  ["Rafael Cordeiro Bastos", "486.215.973-00", "rafael.c@email.com", "+55 31 92188-5566", "ativo", 3400000, "2026-05-20", "Indicação"],
  ["Sabrina Vieira Coutinho", "537.624.819-00", "sabrina.v@email.com", "+55 21 91099-7788", "bloqueado", 195000, "2026-02-14", "CSV"],
  ["Tiago Marques Filho", "648.715.293-00", "tiago.m@email.com", "+55 27 90011-9900", "ativo", 240000, "2026-05-11", "CSV"],
  ["Úrsula Bittencourt Ribeiro", "759.826.314-00", "ursula.b@email.com", "+55 11 99012-1234", "ativo", 4750000, "2026-05-21", "Indicação"],
  ["Vinicius Antunes Borges", "861.937.425-00", "vinicius.a@email.com", "+55 31 98923-5678", "ativo", 380000, "2026-05-10", "CSV"],
  ["Wesley Praxedes Lobato", "972.148.536-00", "wesley.p@email.com", "+55 21 97834-3456", "pendente_confirmacao", 55000, "2026-04-28", "Cadastro manual"],
  ["Xênia Carvalho Furtado", "183.259.647-00", "xenia.c@email.com", "+55 27 96745-7890", "ativo", 920000, "2026-05-18", "CSV"],
  ["Yuri Almeida Marcondes", "294.361.758-00", "yuri.a@email.com", "+55 27 95656-1122", "ativo", 145000, "2026-05-15", "CSV"],
  ["Zilda Brandão Oliveira", "305.472.869-00", "zilda.b@email.com", "+55 11 94567-3344", "inativo", 0, "2025-09-12", "Importação SCP"],
  ["Adriana Coelho Santos", "416.583.971-00", "adriana.c@email.com", "+55 31 93478-5566", "ativo", 670000, "2026-05-12", "CSV"],
  ["Bernardo Pires Quintela", "527.694.182-00", "bernardo.q@email.com", "+55 21 92389-7788", "ativo", 1100000, "2026-05-21", "Indicação"],
  ["Camila Duarte Esteves", "638.715.293-00", "camila.d@email.com", "+55 27 91290-9900", "ativo", 78000, "2026-05-09", "CSV"],
  ["Diogo Falcão Rezende", "749.826.314-00", "diogo.f@email.com", "+55 27 90101-1234", "ativo", 290000, "2026-05-16", "CSV"],
  ["Eliana Gomes Soares", "850.937.425-00", "eliana.g@email.com", "+55 11 99012-5678", "pendente_confirmacao", 115000, "2026-05-03", "Cadastro manual"],
  ["Fábio Hering Ramalho", "961.048.536-00", "fabio.h@email.com", "+55 31 98123-3456", "ativo", 2050000, "2026-05-20", "Indicação"],
  ["Giselle Itamar Pessoa", "072.159.647-00", "giselle.i@email.com", "+55 21 97234-7890", "ativo", 195000, "2026-05-14", "CSV"],
].map(
  ([
    nome,
    cpf,
    email,
    whatsapp,
    status,
    valorInvestido,
    ultimoContato,
    origem,
  ], i) => ({
    id: `INV-${String(i + 1).padStart(4, "0")}`,
    nome: nome as string,
    cpf: cpf as string,
    email: email as string,
    whatsapp: whatsapp as string,
    status: status as StatusInvestidor,
    valorInvestido: valorInvestido as number,
    ultimoContato: ultimoContato as string,
    origem: origem as OrigemInvestidor,
    criadoEm: "2026-01-01",
  })
);

// ===== State + Actions =====
interface InvestorState {
  version: number;
  investidores: Investidor[];
}

const INVESTOR_VERSION = 1;

const INITIAL_STATE: InvestorState = {
  version: INVESTOR_VERSION,
  investidores: SEED_INVESTORS, // placeholder até o refetch do DB
};

type Action =
  | { type: "create"; payload: Omit<Investidor, "id" | "criadoEm"> }
  | { type: "update"; payload: Investidor }
  | { type: "delete"; payload: { id: string } }
  | { type: "deleteMany"; payload: { ids: string[] } }
  | { type: "bulkImport"; payload: { novos: Omit<Investidor, "id" | "criadoEm">[] } }
  | { type: "reset" };

function genId() {
  return `INV-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

// Reducer puro — atualização OTIMISTA local; refetch reconcilia com o DB.
function reducer(state: InvestorState, action: Action): InvestorState {
  switch (action.type) {
    case "create":
      return {
        ...state,
        investidores: [
          {
            ...action.payload,
            id: genId(),
            criadoEm: new Date().toISOString().slice(0, 10),
          },
          ...state.investidores,
        ],
      };
    case "update":
      return {
        ...state,
        investidores: state.investidores.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case "delete":
      return {
        ...state,
        investidores: state.investidores.filter(
          (i) => i.id !== action.payload.id
        ),
      };
    case "deleteMany": {
      const set = new Set(action.payload.ids);
      return {
        ...state,
        investidores: state.investidores.filter((i) => !set.has(i.id)),
      };
    }
    case "bulkImport": {
      const novos: Investidor[] = action.payload.novos.map((n) => ({
        ...n,
        id: genId(),
        criadoEm: new Date().toISOString().slice(0, 10),
      }));
      return { ...state, investidores: [...novos, ...state.investidores] };
    }
    case "reset":
      return state; // refetch recarrega o estado autoritativo
    default:
      return state;
  }
}

// Persiste a ação no backend (Supabase).
async function persist(action: Action): Promise<void> {
  switch (action.type) {
    case "create":
      return investidoresApi.createInvestidor(action.payload);
    case "update":
      return investidoresApi.updateInvestidor(action.payload);
    case "delete":
      return investidoresApi.deleteInvestidor(action.payload.id);
    case "deleteMany":
      return investidoresApi.deleteInvestidores(action.payload.ids);
    case "bulkImport":
      return investidoresApi.bulkImportInvestidores(action.payload.novos);
    case "reset":
      return Promise.resolve();
  }
}

// ===== Context =====
interface InvestorContextValue {
  state: InvestorState;
  dispatch: (action: Action) => void;
  loading: boolean;
  refetch: () => Promise<void>;
}

const InvestorContext = createContext<InvestorContextValue | null>(null);

export function InvestorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InvestorState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const refetch = useCallback(async () => {
    const investidores = await investidoresApi.getInvestidores();
    setState({ version: INVESTOR_VERSION, investidores });
  }, []);

  useEffect(() => {
    // Carrega no mount e recarrega quando a sessão muda (login/logout) —
    // com RLS, só super_admin enxerga a base completa.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch()
      .catch((err) =>
        console.error("[investidores] falha ao carregar do Supabase:", err)
      )
      .finally(() => setLoading(false));
  }, [refetch, session?.user?.id]);

  const dispatch = useCallback(
    (action: Action) => {
      setState((prev) => reducer(prev, action)); // otimista
      void persist(action)
        .then(() => refetch())
        .catch((err) => {
          console.error("[investidores] falha ao persistir:", err);
          void refetch();
        });
    },
    [refetch]
  );

  return (
    <InvestorContext.Provider value={{ state, dispatch, loading, refetch }}>
      {children}
    </InvestorContext.Provider>
  );
}

export function useInvestors() {
  const ctx = useContext(InvestorContext);
  if (!ctx)
    throw new Error("useInvestors precisa estar dentro de <InvestorProvider>");
  return ctx;
}
