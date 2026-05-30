import { supabase } from "@/lib/supabase";
import type { Campanha } from "@/mock/campanhas";

interface CampanhaRow {
  id: string;
  titulo: string;
  canais: Campanha["canais"];
  status: Campanha["status"];
  audiencia_total: number;
  entregues: number;
  abertura: number;
  agendada_para: string | null;
  template_ref: string | null;
  criada_em: string;
}

function toCampanha(r: CampanhaRow): Campanha {
  return {
    id: r.id,
    titulo: r.titulo,
    canais: r.canais,
    status: r.status,
    audienciaTotal: r.audiencia_total,
    entregues: r.entregues,
    abertura: r.abertura,
    agendadaPara: r.agendada_para ?? undefined,
    criadaEm: r.criada_em,
    template: r.template_ref ?? "",
  };
}

function fromCampanha(c: Omit<Campanha, "id"> | Campanha) {
  return {
    titulo: c.titulo,
    canais: c.canais,
    status: c.status,
    audiencia_total: c.audienciaTotal,
    entregues: c.entregues,
    abertura: c.abertura,
    agendada_para: c.agendadaPara ?? null,
    template_ref: c.template || null,
    criada_em: c.criadaEm,
  };
}

export async function getCampanhas(): Promise<Campanha[]> {
  const { data, error } = await supabase
    .from("campanhas")
    .select("*")
    .order("criada_em", { ascending: false });
  if (error) throw error;
  return (data as CampanhaRow[]).map(toCampanha);
}

export async function createCampanha(payload: Omit<Campanha, "id">) {
  const { error } = await supabase.from("campanhas").insert(fromCampanha(payload));
  if (error) throw error;
}

export async function updateCampanha(c: Campanha) {
  const { error } = await supabase.from("campanhas").update(fromCampanha(c)).eq("id", c.id);
  if (error) throw error;
}

export async function deleteCampanha(id: string) {
  const { error } = await supabase.from("campanhas").delete().eq("id", id);
  if (error) throw error;
}
