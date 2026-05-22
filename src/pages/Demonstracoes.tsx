import { useState } from "react";
import { Download, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import {
  DRE,
  BALANCO_ATIVO,
  BALANCO_PASSIVO,
  PERIODOS,
  type LinhaFinanceira,
} from "@/mock/dreBalanco";
import { cn } from "@/lib/utils";

type Visao = "dre" | "balanco";

function fmtMilhares(n: number) {
  if (n === 0) return "—";
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}${abs.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

function calcVariacao(atual: number, anterior: number) {
  if (anterior === 0 || atual === 0) return null;
  const pct = ((atual - anterior) / Math.abs(anterior)) * 100;
  return pct;
}

export function Demonstracoes() {
  const [visao, setVisao] = useState<Visao>("dre");
  const [periodoAtual, setPeriodoAtual] = useState(PERIODOS[0].id);
  const [comparar, setComparar] = useState(PERIODOS[1].id);

  const linhas = visao === "dre" ? DRE : [];
  const balanco = visao === "balanco";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 pt-44 pb-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {/* Hero da página */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              Informações Financeiras
            </div>
            <h1 className="mt-5 font-display text-4xl lg:text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground">
              Demonstrações <span className="text-gradient-primary">Financeiras</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base lg:text-lg text-muted-foreground leading-relaxed">
              DRE e Balanço Patrimonial consolidados do Grupo ICA por trimestre,
              com comparativos e variações relativas. Todos os valores em R$
              milhares (R$ mil).
            </p>
          </div>

          {/* Toggle DRE / Balanço */}
          <div className="flex items-center gap-1 mb-6 border-b border-border">
            <TabBtn
              active={visao === "dre"}
              onClick={() => setVisao("dre")}
              label="Demonstração de Resultados"
            />
            <TabBtn
              active={visao === "balanco"}
              onClick={() => setVisao("balanco")}
              label="Balanço Patrimonial"
            />
          </div>

          {/* Seletores de período */}
          <div className="rounded-xl border border-border bg-card p-4 mb-6 flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Período atual
              </label>
              <select
                value={periodoAtual}
                onChange={(e) => setPeriodoAtual(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-[13px] font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {PERIODOS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.trimestre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Comparar com
              </label>
              <select
                value={comparar}
                onChange={(e) => setComparar(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-[13px] font-semibold text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {PERIODOS.filter((p) => p.id !== periodoAtual).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.trimestre}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => alert("Download em PDF / Excel virá com backend")}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                PDF
              </button>
              <button
                onClick={() => alert("Download em Excel virá com backend")}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                XLSX
              </button>
            </div>
          </div>

          {/* Tabela */}
          {!balanco ? (
            <TabelaFinanceira
              titulo={`DRE — Comparativo ${PERIODOS.find((p) => p.id === periodoAtual)?.trimestre} vs ${PERIODOS.find((p) => p.id === comparar)?.trimestre}`}
              linhas={linhas}
              periodoAtual={periodoAtual}
              comparar={comparar}
            />
          ) : (
            <div className="space-y-8">
              <TabelaFinanceira
                titulo={`Ativo — ${PERIODOS.find((p) => p.id === periodoAtual)?.trimestre} vs ${PERIODOS.find((p) => p.id === comparar)?.trimestre}`}
                linhas={BALANCO_ATIVO}
                periodoAtual={periodoAtual}
                comparar={comparar}
              />
              <TabelaFinanceira
                titulo="Passivo + Patrimônio Líquido"
                linhas={BALANCO_PASSIVO}
                periodoAtual={periodoAtual}
                comparar={comparar}
              />
            </div>
          )}

          {/* Footer informativo */}
          <div className="mt-10 rounded-xl border border-border bg-card p-5 text-[12px] text-muted-foreground">
            <strong className="text-foreground">Notas:</strong> As demonstrações
            financeiras consolidadas seguem as práticas contábeis adotadas no
            Brasil (BR GAAP) e as normas internacionais IFRS. As demonstrações
            trimestrais não foram auditadas; as anuais são auditadas pela{" "}
            <em>KPMG Auditores Independentes</em>. Releases de resultados,
            press releases e teleconferências completas estão disponíveis em{" "}
            <a
              href="/"
              className="text-primary hover:text-primary-deep font-semibold"
            >
              Comunicados, Eventos e Replays
            </a>
            .
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-5 py-3 text-[13px] font-bold uppercase tracking-wider border-b-2 transition-colors",
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function TabelaFinanceira({
  titulo,
  linhas,
  periodoAtual,
  comparar,
}: {
  titulo: string;
  linhas: LinhaFinanceira[];
  periodoAtual: string;
  comparar: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-background/40">
        <h2 className="font-display text-sm font-bold text-foreground">
          {titulo}
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Valores em R$ mil
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <th className="px-5 py-3 font-semibold">Conta</th>
              <th className="px-4 py-3 font-semibold text-right">
                {PERIODOS.find((p) => p.id === periodoAtual)?.trimestre}
              </th>
              <th className="px-4 py-3 font-semibold text-right">
                {PERIODOS.find((p) => p.id === comparar)?.trimestre}
              </th>
              <th className="px-5 py-3 font-semibold text-right w-32">Var.</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => {
              const atual = l.valores[periodoAtual] ?? 0;
              const ant = l.valores[comparar] ?? 0;
              const variacao = calcVariacao(atual, ant);
              const isPositiva = variacao !== null && variacao > 0;
              const isNegativa = variacao !== null && variacao < 0;
              return (
                <tr
                  key={l.conta}
                  className={cn(
                    "border-b border-border last:border-0",
                    l.destaque && "bg-background/40 font-semibold",
                    !l.destaque && "hover:bg-muted/40 transition-colors"
                  )}
                >
                  <td
                    className={cn(
                      "py-3 px-5",
                      l.nivel === 2 && "pl-12",
                      l.destaque
                        ? "text-foreground font-display text-[13px] font-extrabold uppercase tracking-wider"
                        : "text-foreground text-[13px]"
                    )}
                  >
                    {l.conta.trim()}
                  </td>
                  <td
                    className={cn(
                      "py-3 px-4 text-right tabular-nums font-mono",
                      l.destaque
                        ? "text-foreground font-bold"
                        : "text-foreground"
                    )}
                  >
                    {fmtMilhares(atual)}
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums font-mono text-muted-foreground">
                    {fmtMilhares(ant)}
                  </td>
                  <td className="py-3 px-5 text-right tabular-nums">
                    {variacao !== null ? (
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 font-bold text-[12px]",
                          isPositiva && "text-primary",
                          isNegativa && "text-destructive"
                        )}
                      >
                        {isPositiva ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : isNegativa ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : null}
                        {Math.abs(variacao).toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
