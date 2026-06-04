// Arquivo de contexto: co-loca provider e hook do conteúdo (CMS).
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  Comunicado,
  ContentState,
  Documento,
  Evento,
  KitTrimestre,
  TextosInstitucionais,
  NavItem,
  QuickAction,
  FooterColuna,
  RedeSocial,
  SiteConfig,
  Faq,
  FatoRelevante,
} from "./types";
import { SEED } from "./seed";
import * as contentApi from "@/lib/api/content";
import { useAuth } from "./auth";

// ===== Actions (assinatura preservada p/ compatibilidade dos consumidores) =====
type Action =
  | { type: "comunicado/create"; payload: Omit<Comunicado, "id"> }
  | { type: "comunicado/update"; payload: Comunicado }
  | { type: "comunicado/delete"; payload: { id: string } }
  | { type: "evento/create"; payload: Omit<Evento, "id"> }
  | { type: "evento/update"; payload: Evento }
  | { type: "evento/delete"; payload: { id: string } }
  | { type: "documento/create"; payload: Omit<Documento, "id"> }
  | { type: "documento/update"; payload: Documento }
  | { type: "documento/delete"; payload: { id: string } }
  | { type: "kit/update"; payload: KitTrimestre }
  | { type: "textos/update"; payload: Partial<TextosInstitucionais> }
  | { type: "nav/save"; payload: NavItem[] }
  | { type: "quickActions/save"; payload: QuickAction[] }
  | { type: "footer/save"; payload: FooterColuna[] }
  | { type: "redes/save"; payload: RedeSocial[] }
  | { type: "config/update"; payload: SiteConfig }
  | { type: "faq/create"; payload: Omit<Faq, "id"> }
  | { type: "faq/update"; payload: Faq }
  | { type: "faq/delete"; payload: { id: string } }
  | { type: "fato/create"; payload: Omit<FatoRelevante, "id"> }
  | { type: "fato/update"; payload: FatoRelevante }
  | { type: "fato/delete"; payload: { id: string } }
  | { type: "reset" };

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

// Reducer puro — usado para atualização OTIMISTA local enquanto o backend
// confirma. Após a persistência, refetch() reconcilia com os ids reais do DB.
function reducer(state: ContentState, action: Action): ContentState {
  switch (action.type) {
    case "comunicado/create":
      return {
        ...state,
        comunicados: [
          { ...action.payload, id: genId("com") },
          ...state.comunicados,
        ],
      };
    case "comunicado/update":
      return {
        ...state,
        comunicados: state.comunicados.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case "comunicado/delete":
      return {
        ...state,
        comunicados: state.comunicados.filter((c) => c.id !== action.payload.id),
      };

    case "evento/create":
      return {
        ...state,
        eventos: [{ ...action.payload, id: genId("evt") }, ...state.eventos],
      };
    case "evento/update":
      return {
        ...state,
        eventos: state.eventos.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case "evento/delete":
      return {
        ...state,
        eventos: state.eventos.filter((e) => e.id !== action.payload.id),
      };

    case "documento/create":
      return {
        ...state,
        documentos: [
          { ...action.payload, id: genId("doc") },
          ...state.documentos,
        ],
      };
    case "documento/update":
      return {
        ...state,
        documentos: state.documentos.map((d) =>
          d.id === action.payload.id ? action.payload : d
        ),
      };
    case "documento/delete": {
      const removedId = action.payload.id;
      return {
        ...state,
        documentos: state.documentos.filter((d) => d.id !== removedId),
        comunicados: state.comunicados.map((c) =>
          c.documentoId === removedId ? { ...c, documentoId: undefined } : c
        ),
        kitAtual: {
          ...state.kitAtual,
          documentosDestaqueIds: state.kitAtual.documentosDestaqueIds.filter(
            (id) => id !== removedId
          ),
        },
      };
    }

    case "kit/update":
      return { ...state, kitAtual: action.payload };

    case "textos/update":
      return { ...state, textos: { ...state.textos, ...action.payload } };

    case "nav/save":
      return { ...state, navItems: action.payload };
    case "quickActions/save":
      return { ...state, quickActions: action.payload };
    case "footer/save":
      return { ...state, footerColunas: action.payload };
    case "redes/save":
      return { ...state, redesSociais: action.payload };
    case "config/update":
      return { ...state, config: action.payload };

    case "faq/create":
      return {
        ...state,
        faqs: [...state.faqs, { ...action.payload, id: genId("faq") }],
      };
    case "faq/update":
      return {
        ...state,
        faqs: state.faqs.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };
    case "faq/delete":
      return {
        ...state,
        faqs: state.faqs.filter((f) => f.id !== action.payload.id),
      };

    case "fato/create":
      return {
        ...state,
        fatosRelevantes: [
          { ...action.payload, id: genId("fato") },
          ...state.fatosRelevantes,
        ],
      };
    case "fato/update":
      return {
        ...state,
        fatosRelevantes: state.fatosRelevantes.map((f) =>
          f.id === action.payload.id ? action.payload : f
        ),
      };
    case "fato/delete":
      return {
        ...state,
        fatosRelevantes: state.fatosRelevantes.filter(
          (f) => f.id !== action.payload.id
        ),
      };

    case "reset":
      return state; // re-seed do DB não é feito pelo cliente; refetch recarrega

    default:
      return state;
  }
}

// Persiste a ação no backend (Supabase) via camada de API.
async function persist(action: Action): Promise<void> {
  switch (action.type) {
    case "comunicado/create":
      return contentApi.createComunicado(action.payload);
    case "comunicado/update":
      return contentApi.updateComunicado(action.payload);
    case "comunicado/delete":
      return contentApi.deleteComunicado(action.payload.id);
    case "evento/create":
      return contentApi.createEvento(action.payload);
    case "evento/update":
      return contentApi.updateEvento(action.payload);
    case "evento/delete":
      return contentApi.deleteEvento(action.payload.id);
    case "documento/create":
      return contentApi.createDocumento(action.payload);
    case "documento/update":
      return contentApi.updateDocumento(action.payload);
    case "documento/delete":
      return contentApi.deleteDocumento(action.payload.id);
    case "kit/update":
      return contentApi.updateKit(action.payload);
    case "textos/update":
      return contentApi.updateTextos(action.payload);
    case "nav/save":
      return contentApi.saveNavItems(action.payload);
    case "quickActions/save":
      return contentApi.saveQuickActions(action.payload);
    case "footer/save":
      return contentApi.saveFooter(action.payload);
    case "redes/save":
      return contentApi.saveRedesSociais(action.payload);
    case "config/update":
      return contentApi.updateConfig(action.payload);
    case "faq/create":
      return contentApi.createFaq(action.payload);
    case "faq/update":
      return contentApi.updateFaq(action.payload);
    case "faq/delete":
      return contentApi.deleteFaq(action.payload.id);
    case "fato/create":
      return contentApi.createFatoRelevante(action.payload);
    case "fato/update":
      return contentApi.updateFatoRelevante(action.payload);
    case "fato/delete":
      return contentApi.deleteFatoRelevante(action.payload.id);
    case "reset":
      return Promise.resolve();
  }
}

// ===== Context =====
interface ContentContextValue {
  state: ContentState;
  dispatch: (action: Action) => void;
  loading: boolean;
  refetch: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  // SEED como placeholder imediato (mesma forma) até o refetch do DB chegar.
  const [state, setState] = useState<ContentState>(SEED);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  const refetch = useCallback(async () => {
    const data = await contentApi.getContent();
    setState(data);
  }, []);

  useEffect(() => {
    // Carrega no mount e recarrega quando a sessão muda (login/logout) —
    // necessário com RLS para o admin ver conteúdo não publicado.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch()
      .catch((err) => console.error("[content] falha ao carregar do Supabase:", err))
      .finally(() => setLoading(false));
  }, [refetch, session?.user?.id]);

  const dispatch = useCallback(
    (action: Action) => {
      setState((prev) => reducer(prev, action)); // otimista
      void persist(action)
        .then(() => refetch()) // reconcilia com ids reais do DB
        .catch((err) => {
          console.error("[content] falha ao persistir:", err);
          void refetch(); // rollback para o estado autoritativo
        });
    },
    [refetch]
  );

  return (
    <ContentContext.Provider value={{ state, dispatch, loading, refetch }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx)
    throw new Error("useContent precisa estar dentro de <ContentProvider>");
  return ctx;
}
