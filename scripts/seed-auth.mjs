// Seed dos usuários no Supabase Auth (Fase 2).
// Cria uma conta auth.users para cada `usuarios` com senha definida
// (senha = senha_temp) e vincula usuarios.auth_id. Idempotente.
//
// Uso: node scripts/seed-auth.mjs
// Requer no .env: VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Carrega .env simples
const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Faltam VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no .env");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: usuarios, error } = await admin
  .from("usuarios")
  .select("id, nome, email, papel, senha_temp, senha_definida, auth_id");
if (error) {
  console.error("Erro ao ler usuarios:", error.message);
  process.exit(1);
}

let criados = 0,
  vinculados = 0,
  pulados = 0;

for (const u of usuarios) {
  if (!u.senha_definida || !u.senha_temp) {
    pulados++;
    continue;
  }
  if (u.auth_id) {
    pulados++;
    continue;
  }

  // Tenta criar; se já existe (e-mail duplicado), recupera o id.
  let authId = null;
  const { data: created, error: cErr } = await admin.auth.admin.createUser({
    email: u.email,
    password: u.senha_temp,
    email_confirm: true,
    user_metadata: { nome: u.nome, papel: u.papel },
  });
  if (cErr) {
    // Já existe — procura na lista
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
    const existing = list?.users?.find(
      (x) => (x.email || "").toLowerCase() === u.email.toLowerCase()
    );
    if (existing) {
      authId = existing.id;
      // Garante a senha atual
      await admin.auth.admin.updateUserById(existing.id, {
        password: u.senha_temp,
      });
    } else {
      console.error(`Falha ao criar ${u.email}:`, cErr.message);
      continue;
    }
  } else {
    authId = created.user.id;
    criados++;
  }

  const { error: upErr } = await admin
    .from("usuarios")
    .update({ auth_id: authId })
    .eq("id", u.id);
  if (upErr) console.error(`Falha ao vincular ${u.email}:`, upErr.message);
  else vinculados++;
}

console.log(
  `Auth seed concluído — criados: ${criados}, vinculados: ${vinculados}, pulados: ${pulados}`
);
