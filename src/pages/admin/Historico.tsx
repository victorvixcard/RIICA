import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Mail,
  MessageCircle,
  Bell,
  Download,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import {
  STATUS_ENVIO_LABEL,
  STATUS_ENVIO_TINT,
  type EnvioLog,
  type CanalEnvio,
  type StatusEnvio,
} from "@/mock/historico";
import { getHistorico } from "@/lib/api/historico";
import { cn } from "@/lib/utils";

const CANAL_ICON: Record<CanalEnvio, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  push: Bell,
};

const STATUS_OPTS: StatusEnvio[] = [
  "entregue",
  "aberto",
  "clicado",
  "falhou",
  "bouncing",
  "pendente",
];

function fmtRelativo(iso: string) {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  const dd = Math.floor(h / 24);
  return `há ${dd}d`;
}

function fmtDataHora(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function Historico() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusEnvio | "todos">(
    "todos"
  );
  const [filtroCanal, setFiltroCanal] = useState<CanalEnvio | "todos">("todos");
  const [historico, setHistorico] = useState<EnvioLog[]>([]);

  useEffect(() => {
    getHistorico()
      .then(setHistorico)
      .catch((e) => console.error("[historico] erro ao carregar:", e));
  }, []);

  const filtrados = useMemo(() => {
    let arr = historico;
    if (filtroStatus !== "todos") arr = arr.filter((e) => e.status === filtroStatus);
    if (filtroCanal !== "todos") arr = arr.filter((e) => e.canal === filtroCanal);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      arr = arr.filter(
        (e) =>
          e.destinatarioNome.toLowerCase().includes(q) ||
          e.destinatarioContato.toLowerCase().includes(q) ||
          e.campanhaTitulo.toLowerCase().includes(q) ||
          e.campanhaId.toLowerCase().includes(q)
      );
    }
    return [...arr].sort((a, b) => b.enviadoEm.localeCompare(a.enviadoEm));
  }, [busca, filtroStatus, filtroCanal, historico]);

  const stats = useMemo(() => {
    const total = historico.length;
    const sucesso = historico.filter(
      (e) => e.status === "entregue" || e.status === "aberto" || e.status === "clicado"
    ).length;
    const cliques = historico.filter((e) => e.status === "clicado").length;
    const falhas = historico.filter(
      (e) => e.status === "falhou" || e.status === "bouncing"
    ).length;
    return { total, sucesso, cliques, falhas };
  }, [historico]);

  return (
    <>
      <Topbar
        title="Histórico de envios"
        subtitle="Log completo de todas as mensagens enviadas — auditoria por canal, campanha e investidor"
        actions={
          <button
            onClick={() => alert("Export do log virá quando integrarmos com provedores reais")}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Download className="h-4 w-4" />
            Exportar log
          </button>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Total de envios" value={stats.total} tone="neutral" />
            <Stat
              label="Sucesso (entregue+)"
              value={stats.sucesso}
              tone="success"
              icon={CheckCircle2}
            />
            <Stat
              label="Cliques registrados"
              value={stats.cliques}
              tone="primary"
            />
            <Stat
              label="Falhas / bouncing"
              value={stats.falhas}
              tone="destructive"
              icon={AlertTriangle}
            />
          </div>

          {/* Busca + filtros */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar destinatário, campanha ou ID..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Filtros
              </div>
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={filtroStatus === "todos"}
                  onClick={() => setFiltroStatus("todos")}
                  label="Status: todos"
                />
                {STATUS_OPTS.map((s) => (
                  <Chip
                    key={s}
                    active={filtroStatus === s}
                    onClick={() => setFiltroStatus(s)}
                    label={STATUS_ENVIO_LABEL[s]}
                  />
                ))}
              </div>
              <div className="h-5 w-px bg-border" />
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={filtroCanal === "todos"}
                  onClick={() => setFiltroCanal("todos")}
                  label="Canal: todos"
                />
                {(["email", "whatsapp", "push"] as CanalEnvio[]).map((c) => (
                  <Chip
                    key={c}
                    active={filtroCanal === c}
                    onClick={() => setFiltroCanal(c)}
                    label={c === "email" ? "E-mail" : c === "whatsapp" ? "WhatsApp" : "Push"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tabela */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-background/40">
                    <th className="py-3 pl-5 pr-4 font-semibold">Destinatário</th>
                    <th className="py-3 px-4 font-semibold">Campanha</th>
                    <th className="py-3 px-4 font-semibold w-24">Canal</th>
                    <th className="py-3 px-4 font-semibold w-32">Status</th>
                    <th className="py-3 px-4 font-semibold w-32">Enviado</th>
                    <th className="py-3 pl-4 pr-5 font-semibold w-32">Engajamento</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-[13px] text-muted-foreground">
                        Nenhum envio encontrado com esses filtros.
                      </td>
                    </tr>
                  )}
                  {filtrados.map((e) => {
                    const Icon = CANAL_ICON[e.canal];
                    return (
                      <tr
                        key={e.id}
                        className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                      >
                        <td className="py-3 pl-5 pr-4">
                          <div className="text-[13px] font-semibold text-foreground">
                            {e.destinatarioNome}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                            {e.destinatarioContato}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-[13px] text-foreground truncate max-w-[220px]">
                            {e.campanhaTitulo}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {e.campanhaId}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="inline-flex items-center gap-1.5 text-[11px] text-foreground">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            {e.canal === "email" ? "Email" : e.canal === "whatsapp" ? "WhatsApp" : "Push"}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider",
                              STATUS_ENVIO_TINT[e.status]
                            )}
                            title={e.erro}
                          >
                            {STATUS_ENVIO_LABEL[e.status]}
                          </span>
                          {e.erro && (
                            <div className="text-[10px] text-destructive mt-0.5 truncate max-w-[150px]">
                              {e.erro}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-muted-foreground tabular-nums">
                          <div>{fmtDataHora(e.enviadoEm)}</div>
                          <div className="text-[10px] opacity-70">
                            {fmtRelativo(e.enviadoEm)}
                          </div>
                        </td>
                        <td className="py-3 pl-4 pr-5 text-[11px] text-muted-foreground">
                          {e.abertoEm && (
                            <div>Aberto · {fmtRelativo(e.abertoEm)}</div>
                          )}
                          {e.clicadoEm && (
                            <div className="text-primary font-semibold">
                              Clicado · {fmtRelativo(e.clicadoEm)}
                            </div>
                          )}
                          {!e.abertoEm && !e.clicadoEm && (
                            <span className="opacity-50">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[12px] text-muted-foreground">
            Mostrando <strong className="text-foreground">{filtrados.length}</strong>{" "}
            de <strong className="text-foreground">{historico.length}</strong>{" "}
            registros. Auditoria completa com retenção mínima de 5 anos.
          </p>
        </div>
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: number;
  tone: "neutral" | "success" | "primary" | "destructive";
  icon?: typeof Mail;
}) {
  const toneCls = {
    neutral: "bg-muted text-muted-foreground",
    success: "bg-primary/10 text-primary",
    primary: "bg-primary/10 text-primary-deep",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div className={cn("h-9 w-9 rounded-md flex items-center justify-center", toneCls)}>
        {Icon ? <Icon className="h-4 w-4" /> : <span className="font-display font-bold">·</span>}
      </div>
      <div>
        <div className="font-display text-lg font-extrabold text-foreground tabular-nums">
          {value}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
      </div>
    </div>
  );
}

function Chip({
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
        "px-3 py-1 rounded-full text-[11px] font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background border border-border text-foreground hover:border-primary/40"
      )}
    >
      {label}
    </button>
  );
}
