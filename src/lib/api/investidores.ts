import { supabase } from "@/lib/supabase";
import type {
  Investidor,
  OrigemInvestidor,
  StatusInvestidor,
} from "@/store/investors";

interface InvestidorRow {
  id: string;
  nome: string;
  cpf: string;
  email: string | null;
  whatsapp: string | null;
  status: StatusInvestidor;
  valor_investido: number;
  ultimo_contato: string | null;
  origem: OrigemInvestidor | null;
  tags: string[] | null;
  criado_em: string;
}

function toInvestidor(r: InvestidorRow): Investidor {
  return {
    id: r.id,
    nome: r.nome,
    cpf: r.cpf,
    email: r.email ?? "",
    whatsapp: r.whatsapp ?? "",
    status: r.status,
    valorInvestido: r.valor_investido,
    ultimoContato: r.ultimo_contato ?? "",
    origem: (r.origem ?? "Cadastro manual") as OrigemInvestidor,
    tags: r.tags ?? undefined,
    criadoEm: r.criado_em,
  };
}

function fromInvestidor(i: Omit<Investidor, "id" | "criadoEm"> | Investidor) {
  return {
    nome: i.nome,
    cpf: i.cpf,
    email: i.email || null,
    whatsapp: i.whatsapp || null,
    status: i.status,
    valor_investido: i.valorInvestido,
    ultimo_contato: i.ultimoContato || null,
    origem: i.origem,
    tags: i.tags ?? [],
  };
}

export async function getInvestidores(): Promise<Investidor[]> {
  const { data, error } = await supabase
    .from("investidores")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return (data as InvestidorRow[]).map(toInvestidor);
}

export async function getInvestidorPorCpf(cpf: string): Promise<Investidor | null> {
  const { data, error } = await supabase
    .from("investidores")
    .select("*")
    .eq("cpf", cpf)
    .maybeSingle();
  if (error) throw error;
  return data ? toInvestidor(data as InvestidorRow) : null;
}

export async function createInvestidor(payload: Omit<Investidor, "id" | "criadoEm">) {
  const { error } = await supabase.from("investidores").insert(fromInvestidor(payload));
  if (error) throw error;
}

export async function updateInvestidor(i: Investidor) {
  const { error } = await supabase.from("investidores").update(fromInvestidor(i)).eq("id", i.id);
  if (error) throw error;
}

export async function deleteInvestidor(id: string) {
  const { error } = await supabase.from("investidores").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteInvestidores(ids: string[]) {
  const { error } = await supabase.from("investidores").delete().in("id", ids);
  if (error) throw error;
}

export async function bulkImportInvestidores(
  novos: Omit<Investidor, "id" | "criadoEm">[]
) {
  if (!novos.length) return;
  const { error } = await supabase.from("investidores").insert(novos.map(fromInvestidor));
  if (error) throw error;
}
