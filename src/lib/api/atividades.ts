import { supabase } from "@/lib/supabase";
import type { Atividade } from "@/mock/kpis";

interface AtividadeRow {
  id: string;
  tipo: Atividade["tipo"];
  texto: string;
  meta: string | null;
  created_at: string;
}

function tempoRelativo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora há pouco";
  if (min < 60) return `há ${min} minuto${min > 1 ? "s" : ""}`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} hora${h > 1 ? "s" : ""}`;
  const d = Math.floor(h / 24);
  return `há ${d} dia${d > 1 ? "s" : ""}`;
}

function toAtividade(r: AtividadeRow): Atividade {
  return {
    id: r.id,
    tipo: r.tipo,
    texto: r.texto,
    meta: r.meta ?? undefined,
    quando: tempoRelativo(r.created_at),
  };
}

export async function getAtividades(limite = 20): Promise<Atividade[]> {
  const { data, error } = await supabase
    .from("atividades")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) throw error;
  return (data as AtividadeRow[]).map(toAtividade);
}

export async function registrarAtividade(
  tipo: Atividade["tipo"],
  texto: string,
  meta?: string
) {
  const { error } = await supabase.from("atividades").insert({ tipo, texto, meta: meta ?? null });
  if (error) throw error;
}
