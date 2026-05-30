// Arquivo de contexto: autenticação (Supabase Auth) + papel do usuário.
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { PapelUsuario } from "@/lib/api/usuarios";

export interface UsuarioSessao {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  papel: PapelUsuario;
}

interface AuthContextValue {
  session: Session | null;
  usuario: UsuarioSessao | null;
  loading: boolean;
  loginAdmin: (email: string, senha: string) => Promise<void>;
  loginInvestidor: (cpf: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function carregarUsuario(authId: string): Promise<UsuarioSessao | null> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("id, nome, email, cpf, papel")
    .eq("auth_id", authId)
    .maybeSingle();
  if (error) {
    console.error("[auth] erro ao carregar usuário:", error);
    return null;
  }
  if (!data) return null;
  return {
    id: data.id,
    nome: data.nome,
    email: data.email,
    cpf: data.cpf ?? undefined,
    papel: data.papel,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [usuario, setUsuario] = useState<UsuarioSessao | null>(null);
  const [loading, setLoading] = useState(true);

  // IMPORTANTE: o callback do onAuthStateChange deve ser SÍNCRONO.
  // Fazer queries (await) aqui dentro causa deadlock no lock de auth do
  // supabase-js. Apenas atualizamos a sessão; o usuário é carregado num
  // effect separado disparado pela mudança de user id.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      // Sem sessão: terminou de carregar. Com sessão: o efeito abaixo
      // finaliza o loading só após resolver o papel do usuário.
      if (!data.session) setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess) => {
      setSession(sess);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Carrega o perfil (papel) sempre que o usuário autenticado muda.
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) {
      // Sem usuário: apenas limpa. O fim do loading é controlado pelo
      // getSession (quando não há sessão) — aqui session pode ainda
      // não ter sido resolvida no mount inicial.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsuario(null);
      return;
    }
    let ativo = true;
    carregarUsuario(uid).then((u) => {
      if (ativo) {
        setUsuario(u);
        setLoading(false);
      }
    });
    return () => {
      ativo = false;
    };
  }, [session?.user?.id]);

  const loginAdmin = useCallback(async (email: string, senha: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    if (error || !data.user) throw new Error("E-mail ou senha inválidos.");
    const u = await carregarUsuario(data.user.id);
    if (!u || u.papel !== "super_admin") {
      await supabase.auth.signOut();
      throw new Error("Acesso restrito a administradores.");
    }
    setUsuario(u);
  }, []);

  const loginInvestidor = useCallback(async (cpf: string, senha: string) => {
    const { data: email, error: rpcErr } = await supabase.rpc("email_por_cpf", {
      p_cpf: cpf,
    });
    if (rpcErr) throw new Error("Erro ao validar o CPF.");
    if (!email) throw new Error("CPF não encontrado ou sem acesso liberado.");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email as string,
      password: senha,
    });
    if (error || !data.user) throw new Error("CPF ou senha inválidos.");
    const u = await carregarUsuario(data.user.id);
    if (!u || u.papel !== "investidor") {
      await supabase.auth.signOut();
      throw new Error("Esta conta não tem acesso à área do investidor.");
    }
    setUsuario(u);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUsuario(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, usuario, loading, loginAdmin, loginInvestidor, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
