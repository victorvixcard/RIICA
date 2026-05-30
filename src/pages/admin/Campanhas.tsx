import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Send,
  Calendar,
  Mail,
  MessageCircle,
  Bell,
  Filter,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import {
  CANAL_LABEL,
  STATUS_CAMPANHA_LABEL,
  type Campanha,
  type CanalCampanha,
  type StatusCampanha,
} from "@/mock/campanhas";
import { getCampanhas } from "@/lib/api/campanhas";
import { cn } from "@/lib/utils";

const STATUS_OPTS: StatusCampanha[] = [
  "rascunho",
  "agendada",
  "enviando",
  "concluida",
  "falhou",
];

const STATUS_TINT: Record<StatusCampanha, string> = {
  rascunho: "bg-muted text-muted-foreground border-border",
  agendada: "bg-warning/15 text-warning-foreground border-warning/30",
  enviando: "bg-primary/10 text-primary border-primary/20",
  concluida: "bg-primary/15 text-primary-deep border-primary/30",
  falhou: "bg-destructive/10 text-destructive border-destructive/20",
};

const CANAL_ICON: Record<CanalCampanha, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  push: Bell,
};

function fmtDataHora(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function Campanhas() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusCampanha | "todos">(
    "todos"
  );

  const [campanhas, setCampanhas] = useState<Campanha[]>([]);

  useEffect(() => {
    getCampanhas()
      .then(setCampanhas)
      .catch((e) => console.error("[campanhas] erro ao carregar:", e));
  }, []);

  const filtradas = useMemo(() => {
    let arr = campanhas;
    if (filtroStatus !== "todos") arr = arr.filter((c) => c.status === filtroStatus);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      arr = arr.filter(
        (c) =>
          c.titulo.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
      );
    }
    return [...arr].sort((a, b) => b.criadaEm.localeCompare(a.criadaEm));
  }, [busca, filtroStatus, campanhas]);

  const stats = useMemo(() => {
    const enviando = campanhas.filter((c) => c.status === "enviando").length;
    const agendadas = campanhas.filter((c) => c.status === "agendada").length;
    const concluidas = campanhas.filter((c) => c.status === "concluida").length;
    const totalEnviado = campanhas.reduce((acc, c) => acc + c.entregues, 0);
    return { enviando, agendadas, concluidas, totalEnviado };
  }, [campanhas]);

  return (
    <>
      <Topbar
        title="Campanhas"
        subtitle="Disparo de mensagens multicanal — email, WhatsApp, push"
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
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Em andamento" value={stats.enviando} tone="primary" />
            <Stat label="Agendadas" value={stats.agendadas} tone="warning" />
            <Stat label="Concluídas" value={stats.concluidas} tone="success" />
            <Stat
              label="Total entregue"
              value={stats.totalEnviado.toLocaleString("pt-BR")}
              tone="neutral"
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
                  placeholder="Buscar campanha por título ou ID..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Status
              </div>
              <Chip
                active={filtroStatus === "todos"}
                onClick={() => setFiltroStatus("todos")}
                label={`Todas (${campanhas.length})`}
              />
              {STATUS_OPTS.map((s) => (
                <Chip
                  key={s}
                  active={filtroStatus === s}
                  onClick={() => setFiltroStatus(s)}
                  label={STATUS_CAMPANHA_LABEL[s]}
                />
              ))}
            </div>
          </div>

          {/* Cards de campanhas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtradas.map((c) => {
              const pctEntregue = c.audienciaTotal
                ? Math.round((c.entregues / c.audienciaTotal) * 100)
                : 0;
              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-soft transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider",
                            STATUS_TINT[c.status]
                          )}
                        >
                          {STATUS_CAMPANHA_LABEL[c.status]}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {c.id}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-[15px] font-bold text-foreground leading-tight">
                        {c.titulo}
                      </h3>
                    </div>
                    <button
                      onClick={() => alert("Detalhe completo da campanha vem na E4.1")}
                      className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                      aria-label="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Canais */}
                  <div className="mt-3 flex items-center gap-2">
                    {c.canais.map((canal) => {
                      const Icon = CANAL_ICON[canal];
                      return (
                        <span
                          key={canal}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[11px] font-semibold text-foreground"
                        >
                          <Icon className="h-3 w-3" />
                          {CANAL_LABEL[canal]}
                        </span>
                      );
                    })}
                  </div>

                  {/* Progresso */}
                  {(c.status === "enviando" || c.status === "concluida") && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                        <span>
                          <strong className="text-foreground">
                            {c.entregues.toLocaleString("pt-BR")}
                          </strong>{" "}
                          de{" "}
                          <strong className="text-foreground">
                            {c.audienciaTotal.toLocaleString("pt-BR")}
                          </strong>{" "}
                          entregues
                        </span>
                        <span className="font-bold text-foreground tabular-nums">
                          {pctEntregue}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pctEntregue}%` }}
                        />
                      </div>
                      {c.abertura > 0 && (
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          Taxa de abertura:{" "}
                          <strong className="text-primary">
                            {c.abertura.toFixed(1)}%
                          </strong>
                        </div>
                      )}
                    </div>
                  )}

                  {c.status === "agendada" && c.agendadaPara && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-warning/10 text-warning-foreground text-[11px] font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      Agendada para {fmtDataHora(c.agendadaPara)}
                    </div>
                  )}

                  {c.status === "rascunho" && (
                    <div className="mt-4 flex items-center gap-2">
                      <button className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors">
                        <Send className="h-3 w-3" />
                        Continuar edição
                      </button>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-border text-[10px] text-muted-foreground">
                    Criada em {fmtDataHora(c.criadaEm)} · Template{" "}
                    <code className="font-mono">{c.template}</code>
                  </div>
                </div>
              );
            })}
          </div>

          {filtradas.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-[13px]">
              Nenhuma campanha encontrada com esses filtros.
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone: "neutral" | "primary" | "success" | "warning" | "destructive";
}) {
  const toneCls = {
    neutral: "text-foreground",
    primary: "text-primary",
    success: "text-primary-deep",
    warning: "text-warning-foreground",
    destructive: "text-destructive",
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className={cn("font-display text-xl font-extrabold tabular-nums", toneCls)}>
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
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
