import { Topbar } from "@/components/admin/layout/Topbar";
import { KpiCard } from "@/components/admin/kpi/KpiCard";
import {
  Users,
  Send,
  MailOpen,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ENVIOS_30D, type Atividade } from "@/mock/kpis";
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

const CHART_COLORS = {
  email: "hsl(var(--chart-email))",
  whatsapp: "hsl(var(--chart-whatsapp))",
  push: "hsl(var(--chart-push))",
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
  const novosUltimos7Dias = invState.investidores.filter((i) => {
    const dt = new Date(i.criadoEm);
    const limite = new Date();
    limite.setDate(limite.getDate() - 7);
    return dt >= limite;
  }).length;

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
              trend={{ value: 4.2, direction: "up" }}
              hint={
                novosUltimos7Dias > 0
                  ? `${novosUltimos7Dias} novos nos últimos 7 dias`
                  : `${invState.investidores.length} totais cadastrados`
              }
            />
            <KpiCard
              label="Mensagens (30d)"
              value="42.180"
              icon={Send}
              trend={{ value: 18.7, direction: "up" }}
              hint="Email + WhatsApp + Push"
            />
            <KpiCard
              label="Taxa de abertura"
              value="61,3%"
              icon={MailOpen}
              trend={{ value: 2.1, direction: "up" }}
              hint="Acima da média do setor (48%)"
            />
            <KpiCard
              label="Engajamento"
              value="38,9%"
              icon={TrendingUp}
              trend={{ value: 1.4, direction: "down" }}
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
                <div className="flex items-center gap-4 text-[11px] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-chart-email" />
                    <span className="text-muted-foreground">Email</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-chart-whatsapp" />
                    <span className="text-muted-foreground">WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-chart-push" />
                    <span className="text-muted-foreground">Push</span>
                  </div>
                </div>
              </div>
              <div className="h-72 mt-5">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={ENVIOS_30D}
                    margin={{ top: 10, right: 5, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="gradEmail" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.email} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={CHART_COLORS.email} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradWpp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.whatsapp} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={CHART_COLORS.whatsapp} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradPush" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={CHART_COLORS.push} stopOpacity={0.25} />
                        <stop offset="100%" stopColor={CHART_COLORS.push} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="data"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                      interval={3}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 10,
                        border: "1px solid hsl(var(--border))",
                        background: "hsl(var(--card))",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="email"
                      stroke={CHART_COLORS.email}
                      strokeWidth={2}
                      fill="url(#gradEmail)"
                    />
                    <Area
                      type="monotone"
                      dataKey="whatsapp"
                      stroke={CHART_COLORS.whatsapp}
                      strokeWidth={2}
                      fill="url(#gradWpp)"
                    />
                    <Area
                      type="monotone"
                      dataKey="push"
                      stroke={CHART_COLORS.push}
                      strokeWidth={2}
                      fill="url(#gradPush)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
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
          </div>
        </div>
      </main>
    </>
  );
}
