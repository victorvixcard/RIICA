import type { Plugin } from "vite";

/**
 * Middleware de DEV: POST /api/admin/reset-senha
 *
 * Body: { usuarioId: string, novaSenha: string }
 * Headers: Authorization: Bearer <JWT do admin logado>
 *
 * 1. Valida o JWT e confirma que o requisitante é super_admin.
 * 2. Busca o auth_id do usuário alvo na tabela public.usuarios.
 * 3. Atualiza a senha em auth.users via service_role.
 * 4. Marca senha_definida=true e zera senha_temp em public.usuarios.
 *
 * Em produção, o mesmo fluxo está em api/admin/reset-senha.ts (Vercel
 * Serverless Function), garantindo paridade entre dev e prod.
 */
export function adminResetSenha(env: Record<string, string>): Plugin {
  return {
    name: "admin-reset-senha",
    apply: "serve",
    async configureServer(server) {
      const SUPABASE_URL = env.VITE_SUPABASE_URL || "http://127.0.0.1:54321";
      const ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
      const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

      if (!SERVICE_KEY || !ANON_KEY) {
        console.warn(
          "[admin-reset-senha] SUPABASE_SERVICE_ROLE_KEY ou VITE_SUPABASE_ANON_KEY ausentes — endpoint desativado."
        );
        return;
      }

      const { createClient } = await import("@supabase/supabase-js");
      const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      server.middlewares.use("/api/admin/reset-senha", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }
        try {
          const jwt = (req.headers.authorization || "").replace(/^Bearer /, "");
          if (!jwt) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: "Token de autenticação ausente." }));
            return;
          }

          // Resolve quem está chamando via JWT.
          const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
          if (userErr || !userData.user) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: "Sessão inválida ou expirada." }));
            return;
          }

          // Confirma que o requisitante é super_admin.
          const { data: meuPerfil } = await admin
            .from("usuarios")
            .select("papel")
            .eq("auth_id", userData.user.id)
            .single();
          if (meuPerfil?.papel !== "super_admin") {
            res.statusCode = 403;
            res.end(JSON.stringify({ error: "Apenas super_admin pode resetar senhas." }));
            return;
          }

          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const { usuarioId, novaSenha } = JSON.parse(
            Buffer.concat(chunks).toString() || "{}"
          ) as { usuarioId?: string; novaSenha?: string };

          if (!usuarioId || !novaSenha || novaSenha.length < 6) {
            res.statusCode = 400;
            res.end(
              JSON.stringify({ error: "Informe usuarioId e novaSenha (mín. 6 caracteres)." })
            );
            return;
          }

          // Busca auth_id do alvo.
          const { data: alvo, error: alvoErr } = await admin
            .from("usuarios")
            .select("auth_id, email, nome")
            .eq("id", usuarioId)
            .single();
          if (alvoErr || !alvo) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Usuário não encontrado." }));
            return;
          }

          let authId = alvo.auth_id as string | null;

          // Se ainda não há conta no Auth, cria agora.
          if (!authId) {
            const { data: novo, error: criarErr } = await admin.auth.admin.createUser({
              email: alvo.email,
              password: novaSenha,
              email_confirm: true,
              user_metadata: { nome: alvo.nome },
            });
            if (criarErr || !novo.user) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: criarErr?.message || "Falha ao criar conta no Auth." }));
              return;
            }
            authId = novo.user.id;
            await admin.from("usuarios").update({ auth_id: authId }).eq("id", usuarioId);
          } else {
            const { error: upErr } = await admin.auth.admin.updateUserById(authId, {
              password: novaSenha,
            });
            if (upErr) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: upErr.message }));
              return;
            }
          }

          await admin
            .from("usuarios")
            .update({ senha_definida: true, senha_temp: null })
            .eq("id", usuarioId);

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}
