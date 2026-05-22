import { useEffect, useState } from "react";
import {
  X,
  Save,
  Mail,
  MessageCircle,
  Bell,
  Calendar,
  FileText,
  Activity,
  CheckCircle2,
  Eye,
  MousePointer,
  AlertTriangle,
  Phone,
} from "lucide-react";
import {
  useInvestors,
  STATUS_LABEL,
  STATUS_TINT,
  type Investidor,
  type StatusInvestidor,
  type OrigemInvestidor,
} from "@/store/investors";
import { HISTORICO, type CanalEnvio } from "@/mock/historico";
import { cn } from "@/lib/utils";

type Aba = "dados" | "historico" | "atividade";

const CANAL_ICON: Record<CanalEnvio, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  push: Bell,
};

const STATUS_OPTS: StatusInvestidor[] = [
  "ativo",
  "pendente_confirmacao",
  "bloqueado",
  "inativo",
];

const ORIGEM_OPTS: OrigemInvestidor[] = [
  "CSV",
  "Cadastro manual",
  "Importação SCP",
  "Indicação",
];

function fmtData(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

function fmtDataHora(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()} · ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

export function InvestidorDetalheModal({
  investidor,
  open,
  onClose,
}: {
  investidor: Investidor | null;
  open: boolean;
  onClose: () => void;
}) {
  const { dispatch } = useInvestors();
  const [aba, setAba] = useState<Aba>("dados");
  const [editForm, setEditForm] = useState<Investidor | null>(null);

  useEffect(() => {
    if (investidor) {
      setEditForm(investidor);
      setAba("dados");
    }
  }, [investidor]);

  if (!open || !investidor || !editForm) return null;

  const dirty = JSON.stringify(editForm) !== JSON.stringify(investidor);

  const historicoInvestidor = HISTORICO.filter(
    (e) =>
      e.destinatarioContato.includes(investidor.email) ||
      e.destinatarioContato.includes(
        investidor.whatsapp.replace(/\D/g, "").slice(-9)
      ) ||
      e.destinatarioNome === investidor.nome
  );

  const salvar = () => {
    dispatch({ type: "update", payload: editForm });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-stretch justify-end"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-card border-l border-border shadow-elevated flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-base shrink-0">
            {investidor.nome
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-lg font-bold text-foreground truncate">
              {investidor.nome}
            </h2>
            <div className="mt-1 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-muted-foreground">
                {investidor.id} · {investidor.cpf}
              </span>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider",
                  STATUS_TINT[investidor.status]
                )}
              >
                {STATUS_LABEL[investidor.status]}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stats rápidos */}
        <div className="px-6 py-4 border-b border-border grid grid-cols-3 gap-3 bg-background/40">
          <Stat label="Valor investido" value={`R$ ${(investidor.valorInvestido / 1000).toFixed(0)} mil`} />
          <Stat
            label="Cadastrado em"
            value={fmtData(investidor.criadoEm)}
            small
          />
          <Stat
            label="Último contato"
            value={fmtData(investidor.ultimoContato)}
            small
          />
        </div>

        {/* Abas */}
        <div className="flex items-center gap-1 px-6 border-b border-border">
          <TabBtn active={aba === "dados"} onClick={() => setAba("dados")} label="Dados cadastrais" />
          <TabBtn
            active={aba === "historico"}
            onClick={() => setAba("historico")}
            label={`Histórico (${historicoInvestidor.length})`}
          />
          <TabBtn active={aba === "atividade"} onClick={() => setAba("atividade")} label="Atividade" />
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {aba === "dados" && (
            <DadosTab
              form={editForm}
              setForm={setEditForm}
              original={investidor}
            />
          )}
          {aba === "historico" && (
            <HistoricoTab eventos={historicoInvestidor} />
          )}
          {aba === "atividade" && <AtividadeTab investidor={investidor} />}
        </div>

        {/* Footer */}
        {aba === "dados" && (
          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2">
            <button
              onClick={() => setEditForm(investidor)}
              disabled={!dirty}
              className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Descartar
            </button>
            <button
              onClick={salvar}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-3.5 w-3.5" />
              Salvar alterações
            </button>
          </div>
        )}
      </div>
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
        "px-4 py-3 text-[12px] font-bold uppercase tracking-wider border-b-2 transition-colors",
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div>
      <div
        className={cn(
          "font-display font-extrabold text-foreground tabular-nums",
          small ? "text-sm" : "text-base"
        )}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
        {label}
      </div>
    </div>
  );
}

function DadosTab({
  form,
  setForm,
  original,
}: {
  form: Investidor;
  setForm: (i: Investidor) => void;
  original: Investidor;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nome">
          <input
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
        <Field label="CPF">
          <input
            value={form.cpf}
            disabled
            className="w-full rounded-md border border-input bg-muted/40 px-3 py-2 text-[14px] text-muted-foreground font-mono outline-none cursor-not-allowed"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="E-mail">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
        <Field label="WhatsApp">
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Valor investido (R$)">
          <input
            type="number"
            value={form.valorInvestido}
            onChange={(e) =>
              setForm({ ...form, valorInvestido: Number(e.target.value) })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground tabular-nums outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as StatusInvestidor,
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            {STATUS_OPTS.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Origem">
          <select
            value={form.origem}
            onChange={(e) =>
              setForm({ ...form, origem: e.target.value as OrigemInvestidor })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            {ORIGEM_OPTS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Último contato">
          <input
            type="date"
            value={form.ultimoContato}
            onChange={(e) =>
              setForm({ ...form, ultimoContato: e.target.value })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
      </div>

      <div className="rounded-lg border border-border bg-background p-4 mt-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Metadados (somente leitura)
        </div>
        <div className="grid grid-cols-2 gap-3 text-[12px]">
          <div>
            <span className="text-muted-foreground">ID:</span>{" "}
            <code className="font-mono text-foreground">{original.id}</code>
          </div>
          <div>
            <span className="text-muted-foreground">Cadastrado em:</span>{" "}
            <span className="text-foreground">{fmtData(original.criadoEm)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function HistoricoTab({
  eventos,
}: {
  eventos: { id: string; campanhaTitulo: string; canal: CanalEnvio; status: string; enviadoEm: string; abertoEm?: string; clicadoEm?: string; erro?: string }[];
}) {
  if (eventos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <Activity className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="mt-3 text-[13px] text-muted-foreground">
          Nenhuma comunicação enviada para este investidor ainda.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {eventos.map((e) => {
        const Icon = CANAL_ICON[e.canal];
        const dest = e.status === "clicado" ? MousePointer : e.status === "aberto" ? Eye : e.status === "falhou" || e.status === "bouncing" ? AlertTriangle : CheckCircle2;
        const destColor =
          e.status === "clicado"
            ? "text-primary"
            : e.status === "aberto"
              ? "text-primary"
              : e.status === "falhou" || e.status === "bouncing"
                ? "text-destructive"
                : "text-muted-foreground";
        const DestIcon = dest;
        return (
          <li
            key={e.id}
            className="rounded-md border border-border bg-background p-3 flex items-start gap-3"
          >
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-foreground truncate">
                {e.campanhaTitulo}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {fmtDataHora(e.enviadoEm)}
              </div>
              {e.erro && (
                <div className="mt-1 text-[11px] text-destructive">{e.erro}</div>
              )}
            </div>
            <div className={cn("flex items-center gap-1 text-[11px] font-semibold", destColor)}>
              <DestIcon className="h-3.5 w-3.5" />
              {e.status === "clicado"
                ? "Clicou"
                : e.status === "aberto"
                  ? "Abriu"
                  : e.status === "entregue"
                    ? "Entregue"
                    : e.status === "falhou"
                      ? "Falhou"
                      : e.status === "bouncing"
                        ? "Bounce"
                        : "Pendente"}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function AtividadeTab({ investidor }: { investidor: Investidor }) {
  // Atividade fictícia derivada dos dados do investidor (login, downloads, etc.)
  const eventos = [
    {
      icon: CheckCircle2,
      tone: "primary" as const,
      texto: "Login no portal do investidor",
      meta: `IP 187.45.x.x · São Paulo/SP`,
      quando: investidor.ultimoContato,
    },
    {
      icon: FileText,
      tone: "neutral" as const,
      texto: "Download — Release de Resultados 1T26",
      meta: "PDF · 1,2 MB",
      quando: "2026-05-18",
    },
    {
      icon: Eye,
      tone: "neutral" as const,
      texto: "Visualização — Demonstrações Financeiras",
      meta: "Página /demonstracoes",
      quando: "2026-05-15",
    },
    {
      icon: Calendar,
      tone: "primary" as const,
      texto: "Inscrição confirmada — Teleconferência 1T26",
      meta: "28.05.2026 às 10h00",
      quando: "2026-05-12",
    },
    {
      icon: Phone,
      tone: "neutral" as const,
      texto: "Contato com a equipe de RI",
      meta: "Canal: WhatsApp · 8 mensagens trocadas",
      quando: "2026-05-08",
    },
  ];

  return (
    <ul className="space-y-3">
      {eventos.map((e, i) => (
        <li key={i} className="flex items-start gap-3">
          <div
            className={cn(
              "h-9 w-9 rounded-md flex items-center justify-center shrink-0",
              e.tone === "primary"
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            <e.icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-foreground">
              {e.texto}
            </div>
            <div className="text-[11px] text-muted-foreground">{e.meta}</div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {fmtData(e.quando)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
