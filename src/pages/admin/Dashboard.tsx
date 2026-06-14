import { Topbar } from "@/components/admin/layout/Topbar";
import { KpiCard } from "@/components/admin/kpi/KpiCard";
import {
  Users,
  Send,
  MailOpen,
  TrendingUp,
  Plus,
  ArrowRight,
  LineChart,
  Activity,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Atividade } from "@/mock/kpis";
import {
  CANAL_LABEL,
  STATUS_CAMPANHA_LABEL,
  type Campanha,
} from "@/mock/campanhas";
import { getAtividades } from "@/lib/api/atividades";
import { getCampanhas } from "@/lib/api/campanhas";
import { useInvestors } from "@/store/investors";
import { cn } from "@/lib/utils";

const STATUS_TINT: Record<string, string> = {
  rascunho: "bg-muted text-muted-foreground",
  agendada: "bg-warning/15 text-warning-foreground",
  enviando: "bg-primary/10 text-primary",
  concluida: "bg-primary/15 text-primary-deep",
  falhou: "bg-destructive/10 text-destructive",
};

export function DashboardAdmin() {
  const { state: invState } = useInvestors();
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);

  useEffect(() => {
    getAtividades(5)
      .then(setAtividades)
      .catch((e) => console.error("[dashboard] erro ao carregar atividades:", e));
    getCampanhas()
      .then(setCampanhas)
      .catch((e) => console.error("[dashboard] erro ao carregar campanhas:", e));
  }, []);

  const totalAtivos = invState.investidores.filter(
    (i) => i.status === "ativo"
  ).length;
  const totalCadastrados = invState.investidores.length;

  // KPIs de engajamento ainda não conectados — populam quando houver envios reais.
  // Mantemos os cards visíveis com "—" para preservar o layout.
  const mensagens30d = "0";
  const taxaAbertura = "—";
  const engajamento = "—";

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Visão geral da operação de RI — últimos 30 dias"
        actions={
          <Link
            to="/admin/campanhas/nova"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova campanha
          </Link>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Investidores ativos"
              value={totalAtivos.toLocaleString("pt-BR")}
              icon={Users}
              hint={
                totalCadastrados === 0
                  ? "Nenhum investidor cadastrado ainda"
                  : `${totalCadastrados} totais cadastrados`
              }
            />
            <KpiCard
              label="Mensagens (30d)"
              value={mensagens30d}
              icon={Send}
              hint="Aguardando primeiros envios"
            />
            <KpiCard
              label="Taxa de abertura"
              value={taxaAbertura}
              icon={MailOpen}
              hint="Calculada após o primeiro disparo"
            />
            <KpiCard
              label="Engajamento"
              value={engajamento}
              icon={TrendingUp}
              hint="Cliques / aberturas"
            />
          </div>

          {/* Gráfico + Atividades */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground">
                    Envios por dia
                  </h2>
                  <p className="text-[12px] text-muted-foreground">
                    Volume diário por canal nos últimos 30 dias
                  </p>
                </div>
              </div>
              <EmptyState
                icon={LineChart}
                titulo="Sem envios registrados"
                descricao="O gráfico será populado automaticamente quando a primeira campanha de e-mail, WhatsApp ou push for disparada."
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base font-bold text-foreground">
                  Atividade recente
                </h2>
                <Link
                  to="/admin/historico"
                  className="text-[12px] font-semibold text-primary hover:text-primary-deep"
                >
                  Ver tudo
                </Link>
              </div>
              {atividades.length === 0 ? (
                <EmptyState
                  icon={Activity}
                  titulo="Sem atividade ainda"
                  descricao="Importações, edições de conteúdo e disparos aparecerão aqui assim que acontecerem."
                  compacto
                />
              ) : (
                <ul className="space-y-4">
                  {atividades.slice(0, 5).map((act) => (
                    <li key={act.id} className="flex items-start gap-3">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-foreground leading-snug">
                          {act.texto}
                        </div>
                        {act.meta && (
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            {act.meta}
                          </div>
                        )}
                        <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {act.quando}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Campanhas recentes */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  Campanhas
                </h2>
                <p className="text-[12px] text-muted-foreground">
                  Últimas campanhas criadas e em execução
                </p>
              </div>
              <Link
                to="/admin/campanhas"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary hover:text-primary-deep"
              >
                Ver todas <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {campanhas.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                titulo="Nenhuma campanha criada ainda"
                descricao="Crie sua primeira campanha multicanal para começar a engajar a base de investidores."
                cta={
                  <Link
                    to="/admin/campanhas/nova"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nova campanha
                  </Link>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
                      <th className="pb-3 pr-4 font-semibold">Campanha</th>
                      <th className="pb-3 px-4 font-semibold">Canais</th>
                      <th className="pb-3 px-4 font-semibold">Status</th>
                      <th className="pb-3 px-4 font-semibold text-right">
                        Audiência
                      </th>
                      <th className="pb-3 px-4 font-semibold text-right">
                        Entregues
                      </th>
                      <th className="pb-3 pl-4 font-semibold text-right">
                        Abertura
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campanhas.slice(0, 5).map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-4 pr-4">
                          <div className="text-[13px] font-semibold text-foreground">
                            {c.titulo}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {c.id}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {c.canais.map((ch) => (
                              <span
                                key={ch}
                                className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold uppercase tracking-wider text-foreground"
                              >
                                {CANAL_LABEL[ch]}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                              STATUS_TINT[c.status]
                            )}
                          >
                            {STATUS_CAMPANHA_LABEL[c.status]}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right text-[13px] text-muted-foreground tabular-nums">
                          {c.audienciaTotal.toLocaleString("pt-BR")}
                        </td>
                        <td className="py-4 px-4 text-right text-[13px] text-foreground tabular-nums">
                          {c.entregues.toLocaleString("pt-BR")}
                        </td>
                        <td className="py-4 pl-4 text-right text-[13px] font-semibold text-primary tabular-nums">
                          {c.abertura > 0 ? `${c.abertura.toFixed(1)}%` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

function EmptyState({
  icon: Icon,
  titulo,
  descricao,
  cta,
  compacto = false,
}: {
  icon: typeof LineChart;
  titulo: string;
  descricao: string;
  cta?: React.ReactNode;
  compacto?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-lg border border-dashed border-border bg-background/40",
        compacto ? "py-10 px-4" : "py-16 px-6 h-72 mt-5"
      )}
    >
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-display text-[14px] font-bold text-foreground">
        {titulo}
      </h3>
      <p className="mt-1.5 max-w-sm text-[12px] text-muted-foreground leading-relaxed">
        {descricao}
      </p>
      {cta && <div className="mt-5">{cta}</div>}
    </div>
  );
}
