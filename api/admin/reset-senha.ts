// Vercel Serverless Function: POST /api/admin/reset-senha
//
// Body: { usuarioId: string, novaSenha: string }
// Headers: Authorization: Bearer <JWT do admin logado>
//
// Espelha o middleware vite-plugins/admin-reset-senha.ts (paridade DEV/PROD).
// Env vars necessárias na Vercel:
//   - SUPABASE_URL                    (server-side)
//   - SUPABASE_SERVICE_ROLE_KEY       (server-side, secreta)
// O frontend autentica o requisitante via JWT (Bearer) e service_role
// efetiva a troca em auth.users.
import { createClient } from "@supabase/supabase-js";

type Body = { usuarioId?: string; novaSenha?: string };

type ReqLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: Body | string;
};
type ResLike = {
  status: (code: number) => ResLike;
  json: (data: unknown) => void;
};

export default async function handler(req: ReqLike, res: ResLike) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({
      error: "Servidor sem credenciais Supabase. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY na Vercel.",
    });
  }

  const auth = req.headers["authorization"];
  const jwt = (typeof auth === "string" ? auth : "").replace(/^Bearer /, "");
  if (!jwt) {
    return res.status(401).json({ error: "Token de autenticação ausente." });
  }

  const body: Body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const { usuarioId, novaSenha } = body;
  if (!usuarioId || !novaSenha || novaSenha.length < 6) {
    return res
      .status(400)
      .json({ error: "Informe usuarioId e novaSenha (mín. 6 caracteres)." });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1) Quem é o requisitante?
  const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
  if (userErr || !userData.user) {
    return res.status(401).json({ error: "Sessão inválida ou expirada." });
  }

  // 2) É super_admin?
  const { data: meuPerfil } = await admin
    .from("usuarios")
    .select("papel")
    .eq("auth_id", userData.user.id)
    .single();
  if (meuPerfil?.papel !== "super_admin") {
    return res.status(403).json({ error: "Apenas super_admin pode resetar senhas." });
  }

  // 3) Resolve o alvo.
  const { data: alvo, error: alvoErr } = await admin
    .from("usuarios")
    .select("auth_id, email, nome")
    .eq("id", usuarioId)
    .single();
  if (alvoErr || !alvo) {
    return res.status(404).json({ error: "Usuário não encontrado." });
  }

  let authId = alvo.auth_id as string | null;

  // 4) Cria conta no Auth se necessário; senão, troca a senha.
  if (!authId) {
    const { data: novo, error: criarErr } = await admin.auth.admin.createUser({
      email: alvo.email,
      password: novaSenha,
      email_confirm: true,
      user_metadata: { nome: alvo.nome },
    });
    if (criarErr || !novo.user) {
      return res
        .status(500)
        .json({ error: criarErr?.message || "Falha ao criar conta no Auth." });
    }
    authId = novo.user.id;
    await admin.from("usuarios").update({ auth_id: authId }).eq("id", usuarioId);
  } else {
    const { error: upErr } = await admin.auth.admin.updateUserById(authId, {
      password: novaSenha,
    });
    if (upErr) {
      return res.status(500).json({ error: upErr.message });
    }
  }

  // 5) Marca como definida.
  await admin
    .from("usuarios")
    .update({ senha_definida: true, senha_temp: null })
    .eq("id", usuarioId);

  return res.status(200).json({ ok: true });
}
