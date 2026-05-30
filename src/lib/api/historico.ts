import { supabase } from "@/lib/supabase";
import type { EnvioLog } from "@/mock/historico";

interface EnvioRow {
  id: string;
  campanha_id: string | null;
  campanha_titulo: string | null;
  destinatario_nome: string;
  destinatario_contato: string;
  canal: EnvioLog["canal"];
  status: EnvioLog["status"];
  enviado_em: string;
  aberto_em: string | null;
  clicado_em: string | null;
  erro: string | null;
}

function toEnvio(r: EnvioRow): EnvioLog {
  return {
    id: r.id,
    campanhaId: r.campanha_id ?? "",
    campanhaTitulo: r.campanha_titulo ?? "",
    destinatarioNome: r.destinatario_nome,
    destinatarioContato: r.destinatario_contato,
    canal: r.canal,
    status: r.status,
    enviadoEm: r.enviado_em,
    abertoEm: r.aberto_em ?? undefined,
    clicadoEm: r.clicado_em ?? undefined,
    erro: r.erro ?? undefined,
  };
}

export async function getHistorico(): Promise<EnvioLog[]> {
  const { data, error } = await supabase
    .from("envios")
    .select("*")
    .order("enviado_em", { ascending: false });
  if (error) throw error;
  return (data as EnvioRow[]).map(toEnvio);
}
