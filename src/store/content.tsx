import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import type {
  Comunicado,
  ContentState,
  Documento,
  Evento,
  KitTrimestre,
  TextosInstitucionais,
} from "./types";
import { SEED, CONTENT_VERSION } from "./seed";

const STORAGE_KEY = "ica-content-store@v1";

// ===== Actions =====
type Action =
  // Comunicados
  | { type: "comunicado/create"; payload: Omit<Comunicado, "id"> }
  | { type: "comunicado/update"; payload: Comunicado }
  | { type: "comunicado/delete"; payload: { id: string } }
  // Eventos
  | { type: "evento/create"; payload: Omit<Evento, "id"> }
  | { type: "evento/update"; payload: Evento }
  | { type: "evento/delete"; payload: { id: string } }
  // Documentos
  | { type: "documento/create"; payload: Omit<Documento, "id"> }
  | { type: "documento/update"; payload: Documento }
  | { type: "documento/delete"; payload: { id: string } }
  // Kit
  | { type: "kit/update"; payload: KitTrimestre }
  // Textos
  | { type: "textos/update"; payload: Partial<TextosInstitucionais> }
  // Misc
  | { type: "reset" };

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

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
        comunicados: state.comunicados.filter(
          (c) => c.id !== action.payload.id
        ),
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
        // Cascade: limpar referência do documento em comunicados vinculados
        comunicados: state.comunicados.map((c) =>
          c.documentoId === removedId ? { ...c, documentoId: undefined } : c
        ),
        // Cascade: remover do Kit do Investidor se estava em destaque
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
      return {
        ...state,
        textos: { ...state.textos, ...action.payload },
      };

    case "reset":
      return { ...SEED };

    default:
      return state;
  }
}

// ===== Persistence =====
function loadInitial(): ContentState {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as ContentState;
    if (!parsed.version || parsed.version !== CONTENT_VERSION) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

// ===== Context =====
interface ContentContextValue {
  state: ContentState;
  dispatch: React.Dispatch<Action>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage cheio ou indisponível — silenciar
    }
  }, [state]);

  // Sync entre abas: admin em uma aba edita → outra aba (ex: portal) recarrega
  // com o novo estado. Reload é o caminho mais simples e correto para garantir
  // que todos os hooks que dependem do store reflitam a mudança.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        window.location.reload();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <ContentContext.Provider value={{ state, dispatch }}>
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
