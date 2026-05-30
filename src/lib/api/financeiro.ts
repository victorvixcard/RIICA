import { supabase } from "@/lib/supabase";
import type { LinhaFinanceira, PeriodoFinanceiro } from "@/mock/dreBalanco";

type Demonstracao = "dre" | "balanco_ativo" | "balanco_passivo";

interface LinhaRow {
  id: string;
  demonstracao: Demonstracao;
  conta: string;
  ordem: number;
  destaque: boolean;
  nivel: 0 | 1 | 2;
}

interface ValorRow {
  linha_id: string;
  periodo_id: string;
  valor: number;
}

export interface Financeiro {
  periodos: PeriodoFinanceiro[];
  dre: LinhaFinanceira[];
  balancoAtivo: LinhaFinanceira[];
  balancoPassivo: LinhaFinanceira[];
}

export async function getFinanceiro(): Promise<Financeiro> {
  const [periodosRes, linhasRes, valoresRes] = await Promise.all([
    supabase.from("periodos_financeiros").select("*").order("ordem", { ascending: true }),
    supabase.from("linhas_financeiras").select("*").order("ordem", { ascending: true }),
    supabase.from("valores_financeiros").select("*"),
  ]);

  const erro = periodosRes.error || linhasRes.error || valoresRes.error;
  if (erro) throw erro;

  // Agrupa valores por linha
  const valoresPorLinha = new Map<string, Record<string, number>>();
  for (const v of valoresRes.data as ValorRow[]) {
    const atual = valoresPorLinha.get(v.linha_id) ?? {};
    atual[v.periodo_id] = v.valor;
    valoresPorLinha.set(v.linha_id, atual);
  }

  const montar = (demo: Demonstracao): LinhaFinanceira[] =>
    (linhasRes.data as LinhaRow[])
      .filter((l) => l.demonstracao === demo)
      .map((l) => ({
        conta: l.conta,
        ordem: l.ordem,
        destaque: l.destaque,
        nivel: l.nivel,
        valores: valoresPorLinha.get(l.id) ?? {},
      }));

  const periodos: PeriodoFinanceiro[] = (periodosRes.data ?? []).map((p) => ({
    id: p.id,
    trimestre: p.trimestre,
    ano: p.ano,
    publicado: p.publicado,
  }));

  return {
    periodos,
    dre: montar("dre"),
    balancoAtivo: montar("balanco_ativo"),
    balancoPassivo: montar("balanco_passivo"),
  };
}
