import type { Plugin } from "vite";

/**
 * Middleware de DEV: POST /api/enviar-credenciais
 * Busca os usuários (papel investidor) pelos e-mails, garante senha provisória
 * e envia o e-mail de credenciais para o Mailpit local (captura, não envia de
 * verdade). É um harness de teste de Fase 1 — em produção o envio será feito
 * por uma Edge Function usando Resend (HTTP API).
 *
 * apply: "serve" garante que o plugin NÃO roda no build de produção da Vercel
 * (não tem nodemailer/Mailpit nem SUPABASE_SERVICE_ROLE_KEY em prod).
 */
export function credenciaisMailer(env: Record<string, string>): Plugin {
  return {
    name: "credenciais-mailer",
    apply: "serve",
    async configureServer(server) {
      const SUPABASE_URL = env.VITE_SUPABASE_URL || "http://127.0.0.1:54321";
      const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
      const SMTP_HOST = env.MAILPIT_SMTP_HOST || "127.0.0.1";
      const SMTP_PORT = Number(env.MAILPIT_SMTP_PORT || "54325");
      const PORTAL_URL = "http://localhost:5173";

      if (!SERVICE_KEY) {
        console.warn(
          "[credenciais-mailer] SUPABASE_SERVICE_ROLE_KEY não definida — endpoint /api/enviar-credenciais desativado."
        );
        return;
      }

      // Imports dinâmicos: só acontecem quando o dev server sobe.
      const nodemailer = (await import("nodemailer")).default;
      const { createClient } = await import("@supabase/supabase-js");

      const headers = {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      };

      const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Garante uma conta no Supabase Auth com a senha atual e vincula usuarios.auth_id.
      async function provisionarAuth(u: {
        id: string;
        email: string;
        nome: string;
        senha: string;
        auth_id: string | null;
      }) {
        if (u.auth_id) {
          await admin.auth.admin.updateUserById(u.auth_id, { password: u.senha });
          return;
        }
        const { data, error } = await admin.auth.admin.createUser({
          email: u.email,
          password: u.senha,
          email_confirm: true,
          user_metadata: { nome: u.nome, papel: "investidor" },
        });
        let authId = data?.user?.id ?? null;
        if (error || !authId) {
          const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
          const existing = list?.users?.find(
            (x) => (x.email || "").toLowerCase() === u.email.toLowerCase()
          );
          if (existing) {
            authId = existing.id;
            await admin.auth.admin.updateUserById(existing.id, { password: u.senha });
          }
        }
        if (authId) {
          await fetch(`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${u.id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ auth_id: authId }),
          });
        }
      }

      const SENHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      const gerarSenha = () =>
        Array.from({ length: 8 }, () => SENHA_CHARS[Math.floor(Math.random() * SENHA_CHARS.length)]).join("");

      server.middlewares.use("/api/enviar-credenciais", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method Not Allowed");
          return;
        }
        try {
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const { emails } = JSON.parse(Buffer.concat(chunks).toString() || "{}") as {
            emails: string[];
          };
          if (!Array.isArray(emails) || emails.length === 0) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Informe ao menos um e-mail." }));
            return;
          }

          // Busca usuários investidor pelos e-mails
          const inList = emails.map((e) => `"${e}"`).join(",");
          const q = `${SUPABASE_URL}/rest/v1/usuarios?select=id,nome,email,papel,senha_temp,senha_definida,auth_id&papel=eq.investidor&email=in.(${encodeURIComponent(inList)})`;
          const resp = await fetch(q, { headers });
          const usuarios = (await resp.json()) as Array<{
            id: string;
            nome: string;
            email: string;
            senha_temp: string | null;
            senha_definida: boolean;
            auth_id: string | null;
          }>;
          const byEmail = new Map(usuarios.map((u) => [u.email.toLowerCase(), u]));

          const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false,
            tls: { rejectUnauthorized: false },
          });

          let enviados = 0;
          const semUsuario: string[] = [];
          const erros: string[] = [];

          for (const email of emails) {
            const u = byEmail.get(email.toLowerCase());
            if (!u) {
              semUsuario.push(email);
              continue;
            }
            let senha = u.senha_temp;
            if (!u.senha_definida || !senha) {
              senha = gerarSenha();
              await fetch(`${SUPABASE_URL}/rest/v1/usuarios?id=eq.${u.id}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify({ senha_temp: senha, senha_definida: true }),
              });
            }
            try {
              // Provisiona/sincroniza a conta de login no Supabase Auth
              await provisionarAuth({
                id: u.id,
                email: u.email,
                nome: u.nome,
                senha: senha!,
                auth_id: u.auth_id,
              });
              await transporter.sendMail({
                from: '"Grupo ICA — RI" <ri@grupoica.com.br>',
                to: u.email,
                subject: "Suas credenciais de acesso — Área do Investidor Grupo ICA",
                html: emailHtml(u.nome, u.email, senha!, PORTAL_URL),
              });
              enviados++;
            } catch (e) {
              erros.push(`${email}: ${String(e)}`);
            }
          }

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ enviados, semUsuario, erros, total: emails.length }));
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}

function emailHtml(nome: string, email: string, senha: string, portalUrl: string): string {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
    <div style="background:#0f3d2e; padding:24px; border-radius:12px 12px 0 0;">
      <span style="color:#fff; font-size:20px; font-weight:800;">GRUPO <span style="color:#4ade80;">ICA</span></span>
      <div style="color:#9ca3af; font-size:11px; letter-spacing:1px; margin-top:4px;">RELAÇÕES COM INVESTIDORES</div>
    </div>
    <div style="border:1px solid #e5e7eb; border-top:0; padding:24px; border-radius:0 0 12px 12px;">
      <h2 style="margin:0 0 12px;">Olá, ${nome}</h2>
      <p style="font-size:14px; line-height:1.6; color:#374151;">
        Sua conta de acesso à Área do Investidor do Grupo ICA foi criada. Use as
        credenciais abaixo para entrar:
      </p>
      <div style="background:#f3f4f6; border-radius:8px; padding:16px; margin:16px 0; font-size:14px;">
        <div><strong>Login (e-mail):</strong> ${email}</div>
        <div style="margin-top:6px;"><strong>Senha provisória:</strong>
          <code style="background:#fff; padding:2px 8px; border-radius:4px; border:1px solid #e5e7eb;">${senha}</code>
        </div>
      </div>
      <a href="${portalUrl}/investidor/login"
         style="display:inline-block; background:#0f3d2e; color:#fff; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:700; font-size:13px;">
        Acessar minha área
      </a>
      <p style="font-size:12px; color:#6b7280; margin-top:20px;">
        Por segurança, recomendamos alterar a senha no primeiro acesso.
      </p>
    </div>
    <p style="text-align:center; color:#9ca3af; font-size:11px; margin-top:16px;">
      © Grupo ICA — Relações com Investidores
    </p>
  </div>`;
}
