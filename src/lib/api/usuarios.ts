import { supabase } from "@/lib/supabase";

export type PapelUsuario = "super_admin" | "investidor";
export type StatusUsuario = "ativo" | "inativo";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  papel: PapelUsuario;
  status: StatusUsuario;
  senhaDefinida: boolean;
  ultimoAcesso?: string;
  criadoEm: string;
}

export const PAPEL_LABEL: Record<PapelUsuario, string> = {
  super_admin: "Super Admin",
  investidor: "Investidor",
};

interface UsuarioRow {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  papel: PapelUsuario;
  status: StatusUsuario;
  senha_definida: boolean;
  ultimo_acesso: string | null;
  created_at: string;
}

function toUsuario(r: UsuarioRow): Usuario {
  return {
    id: r.id,
    nome: r.nome,
    email: r.email,
    cpf: r.cpf ?? undefined,
    papel: r.papel,
    status: r.status,
    senhaDefinida: r.senha_definida,
    ultimoAcesso: r.ultimo_acesso ?? undefined,
    criadoEm: r.created_at,
  };
}

export interface NovoUsuario {
  nome: string;
  email: string;
  cpf?: string;
  papel: PapelUsuario;
  status: StatusUsuario;
}

export async function getUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as UsuarioRow[]).map(toUsuario);
}

export async function createUsuario(payload: NovoUsuario) {
  const { error } = await supabase.from("usuarios").insert({
    nome: payload.nome,
    email: payload.email,
    cpf: payload.cpf || null,
    papel: payload.papel,
    status: payload.status,
  });
  if (error) throw error;
}

export async function updateUsuario(id: string, payload: NovoUsuario) {
  const { error } = await supabase
    .from("usuarios")
    .update({
      nome: payload.nome,
      email: payload.email,
      cpf: payload.cpf || null,
      papel: payload.papel,
      status: payload.status,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteUsuario(id: string) {
  const { error } = await supabase.from("usuarios").delete().eq("id", id);
  if (error) throw error;
}

export async function setStatusUsuario(id: string, status: StatusUsuario) {
  const { error } = await supabase.from("usuarios").update({ status }).eq("id", id);
  if (error) throw error;
}

/**
 * Define/reseta a senha do usuário.
 * ⚠️ Fase 1 (placeholder): grava em senha_temp. Na Fase 2 isto chamará
 * o Supabase Auth (senha hasheada / reset por e-mail).
 */
export async function definirSenha(id: string, novaSenha: string) {
  const { error } = await supabase
    .from("usuarios")
    .update({ senha_temp: novaSenha, senha_definida: true })
    .eq("id", id);
  if (error) throw error;
}

export interface ResultadoEnvio {
  enviados: number;
  semUsuario: string[];
  erros: string[];
  total: number;
}

/**
 * Envia as credenciais por e-mail (dev: cai no Mailpit via middleware do Vite).
 * Recebe a lista de e-mails dos investidores selecionados.
 */
export async function enviarCredenciais(emails: string[]): Promise<ResultadoEnvio> {
  const resp = await fetch("/api/enviar-credenciais", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emails }),
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Falha no envio (${resp.status}): ${txt}`);
  }
  return (await resp.json()) as ResultadoEnvio;
}

/** Gera uma senha provisória legível (placeholder Fase 1). */
export function gerarSenhaProvisoria(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

/**
 * Gera credenciais de acesso (papel investidor) em lote a partir de uma lista
 * de pessoas (vindas do import CSV). Pula quem já tem usuário com o mesmo e-mail.
 * Retorna quantos foram criados e quantos já existiam.
 */
export async function gerarCredenciaisEmLote(
  pessoas: { nome: string; email: string; cpf?: string }[]
): Promise<{ criados: number; jaExistiam: number }> {
  const validas = pessoas.filter((p) => p.email?.trim());
  if (!validas.length) return { criados: 0, jaExistiam: 0 };

  const emails = validas.map((p) => p.email.toLowerCase());
  const { data: existentes, error: errSel } = await supabase
    .from("usuarios")
    .select("email")
    .in("email", emails);
  if (errSel) throw errSel;

  const jaExiste = new Set((existentes ?? []).map((e) => e.email.toLowerCase()));
  const novos = validas.filter((p) => !jaExiste.has(p.email.toLowerCase()));

  if (novos.length) {
    const { error } = await supabase.from("usuarios").insert(
      novos.map((p) => ({
        nome: p.nome,
        email: p.email,
        cpf: p.cpf || null,
        papel: "investidor",
        status: "ativo",
        senha_temp: gerarSenhaProvisoria(),
        senha_definida: true,
      }))
    );
    if (error) throw error;
  }

  return { criados: novos.length, jaExistiam: validas.length - novos.length };
}
