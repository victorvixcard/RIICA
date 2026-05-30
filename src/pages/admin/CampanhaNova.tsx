import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Users,
  Mail,
  MessageCircle,
  Bell,
  FileText,
  Calendar,
  Send,
  Sparkles,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useInvestors, type StatusInvestidor } from "@/store/investors";
import { type CanalTemplate, type Template } from "@/mock/templates";
import { getTemplates } from "@/lib/api/templates";
import { createCampanha } from "@/lib/api/campanhas";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: "Info básica" },
  { id: 2, label: "Audiência" },
  { id: 3, label: "Conteúdo" },
  { id: 4, label: "Confirmação" },
] as const;

const CANAL_ICON: Record<CanalTemplate, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  push: Bell,
};

const CANAL_LABEL: Record<CanalTemplate, string> = {
  email: "E-mail",
  whatsapp: "WhatsApp",
  push: "Push",
};

type AudienciaTipo = "todos" | "filtro" | "manual";

interface FormCampanha {
  titulo: string;
  descricao: string;
  audienciaTipo: AudienciaTipo;
  filtroStatus: StatusInvestidor | "todos";
  canais: CanalTemplate[];
  templates: Partial<Record<CanalTemplate, string>>;
  agendamento: "agora" | "agendada";
  agendadaPara: string;
}

const EMPTY: FormCampanha = {
  titulo: "",
  descricao: "",
  audienciaTipo: "todos",
  filtroStatus: "ativo",
  canais: ["email"],
  templates: {},
  agendamento: "agora",
  agendadaPara: new Date(Date.now() + 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 16),
};

export function CampanhaNova() {
  const navigate = useNavigate();
  const { state: invState } = useInvestors();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormCampanha>(EMPTY);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch((e) => console.error("[campanha-nova] erro ao carregar templates:", e));
  }, []);

  const audienciaCount = (() => {
    if (form.audienciaTipo === "todos") return invState.investidores.length;
    if (form.audienciaTipo === "filtro") {
      if (form.filtroStatus === "todos") return invState.investidores.length;
      return invState.investidores.filter(
        (i) => i.status === form.filtroStatus
      ).length;
    }
    return 0;
  })();

  const canAdvance = (() => {
    if (step === 1) return form.titulo.trim().length > 2;
    if (step === 2) return audienciaCount > 0;
    if (step === 3) {
      return (
        form.canais.length > 0 &&
        form.canais.every((c) => form.templates[c])
      );
    }
    return true;
  })();

  const toggleCanal = (c: CanalTemplate) => {
    setForm((f) => ({
      ...f,
      canais: f.canais.includes(c)
        ? f.canais.filter((x) => x !== c)
        : [...f.canais, c],
    }));
  };

  const confirmar = async () => {
    setSalvando(true);
    try {
      const templateRef = Object.values(form.templates).find(Boolean) ?? "";
      await createCampanha({
        titulo: form.titulo.trim(),
        canais: form.canais,
        status: form.agendamento === "agendada" ? "agendada" : "rascunho",
        audienciaTotal: audienciaCount,
        entregues: 0,
        abertura: 0,
        agendadaPara:
          form.agendamento === "agendada"
            ? new Date(form.agendadaPara).toISOString()
            : undefined,
        criadaEm: new Date().toISOString(),
        template: templateRef,
      });
      alert(
        `Campanha "${form.titulo}" criada como ${form.agendamento === "agendada" ? "agendada" : "rascunho"}.\n\nO disparo real (Resend, Meta API, FCM) entra na Fase 2.`
      );
      navigate("/admin/campanhas");
    } catch (e) {
      console.error("[campanha-nova] erro ao criar:", e);
      alert("Erro ao criar a campanha. Veja o console.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Topbar
        title="Nova campanha"
        subtitle="Wizard de criação — 4 passos até o disparo"
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1100px] mx-auto">
          <Link
            to="/admin/campanhas"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para campanhas
          </Link>

          {/* Stepper */}
          <div className="rounded-xl border border-border bg-card p-4 mb-6">
            <div className="flex items-center justify-between gap-2">
              {STEPS.map((s, i) => {
                const done = s.id < step;
                const active = s.id === step;
                return (
                  <div key={s.id} className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors",
                          done && "bg-primary text-primary-foreground",
                          active &&
                            "bg-primary/15 text-primary border-2 border-primary",
                          !done &&
                            !active &&
                            "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                      </div>
                      <span
                        className={cn(
                          "text-[11px] font-semibold uppercase tracking-wider hidden md:inline",
                          active && "text-foreground",
                          done && "text-primary",
                          !done && !active && "text-muted-foreground"
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-px",
                          done ? "bg-primary" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conteúdo do passo */}
          <div className="rounded-xl border border-border bg-card p-6">
            {step === 1 && <Step1 form={form} setForm={setForm} />}
            {step === 2 && (
              <Step2
                form={form}
                setForm={setForm}
                investorCount={invState.investidores.length}
                audienciaCount={audienciaCount}
              />
            )}
            {step === 3 && (
              <Step3
                form={form}
                setForm={setForm}
                toggleCanal={toggleCanal}
                templates={templates}
              />
            )}
            {step === 4 && (
              <Step4 form={form} setForm={setForm} audienciaCount={audienciaCount} />
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-[12px] text-muted-foreground">
              Passo {step} de 4
            </div>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar
                </button>
              )}
              {step < 4 && (
                <button
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={!canAdvance}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
              {step === 4 && (
                <button
                  onClick={confirmar}
                  disabled={salvando}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-3.5 w-3.5" />
                  {salvando
                    ? "Salvando..."
                    : form.agendamento === "agora"
                      ? "Criar campanha"
                      : "Agendar"}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Step1({
  form,
  setForm,
}: {
  form: FormCampanha;
  setForm: React.Dispatch<React.SetStateAction<FormCampanha>>;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-base font-bold text-foreground">
          Informações da campanha
        </h2>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Título <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="ex: Convite Teleconferência 2T26"
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Usado internamente — não aparece nas mensagens enviadas
        </p>
      </div>

      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Descrição (opcional)
        </label>
        <textarea
          rows={3}
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          placeholder="Contexto interno: motivo, audiência alvo, observações da diretoria..."
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
        />
      </div>
    </div>
  );
}

function Step2({
  form,
  setForm,
  investorCount,
  audienciaCount,
}: {
  form: FormCampanha;
  setForm: React.Dispatch<React.SetStateAction<FormCampanha>>;
  investorCount: number;
  audienciaCount: number;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="font-display text-base font-bold text-foreground">
          Quem vai receber?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <AudienciaCard
          active={form.audienciaTipo === "todos"}
          onClick={() => setForm({ ...form, audienciaTipo: "todos" })}
          title="Toda a base"
          count={investorCount}
          subtitle="Todos os investidores cadastrados"
        />
        <AudienciaCard
          active={form.audienciaTipo === "filtro"}
          onClick={() => setForm({ ...form, audienciaTipo: "filtro" })}
          title="Por filtro"
          count={null}
          subtitle="Recortar por status, origem, valor"
        />
        <AudienciaCard
          active={form.audienciaTipo === "manual"}
          onClick={() => setForm({ ...form, audienciaTipo: "manual" })}
          title="Seleção manual"
          count={null}
          subtitle="Escolher um a um na base"
          disabled
        />
      </div>

      {form.audienciaTipo === "filtro" && (
        <div className="rounded-lg border border-border bg-background p-4 space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Filtrar por status do investidor
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                "todos",
                "ativo",
                "pendente_confirmacao",
                "bloqueado",
                "inativo",
              ] as const
            ).map((s) => (
              <button
                key={s}
                onClick={() => setForm({ ...form, filtroStatus: s })}
                className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-semibold transition-colors",
                  form.filtroStatus === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:border-primary/40"
                )}
              >
                {s === "todos"
                  ? "Todos"
                  : s === "ativo"
                    ? "Ativo"
                    : s === "pendente_confirmacao"
                      ? "Pendente"
                      : s === "bloqueado"
                        ? "Bloqueado"
                        : "Inativo"}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-[13px] text-foreground">
          Esta campanha vai atingir{" "}
          <strong className="text-primary font-bold tabular-nums">
            {audienciaCount.toLocaleString("pt-BR")}
          </strong>{" "}
          investidor{audienciaCount === 1 ? "" : "es"}
        </span>
      </div>
    </div>
  );
}

function AudienciaCard({
  active,
  onClick,
  title,
  count,
  subtitle,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  count: number | null;
  subtitle: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-lg border-2 p-4 text-left transition-all",
        active
          ? "border-primary bg-primary/5"
          : "border-border bg-card hover:border-primary/40",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-sm font-bold text-foreground">
          {title}
        </h3>
        {active && <Check className="h-4 w-4 text-primary" />}
      </div>
      {count !== null && (
        <div className="mt-2 font-display text-2xl font-extrabold text-foreground tabular-nums">
          {count.toLocaleString("pt-BR")}
        </div>
      )}
      <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
        {subtitle}
      </p>
      {disabled && (
        <div className="mt-2 text-[10px] uppercase tracking-wider text-warning-foreground font-semibold">
          Em construção
        </div>
      )}
    </button>
  );
}

function Step3({
  form,
  setForm,
  toggleCanal,
  templates,
}: {
  form: FormCampanha;
  setForm: React.Dispatch<React.SetStateAction<FormCampanha>>;
  toggleCanal: (c: CanalTemplate) => void;
  templates: Template[];
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="font-display text-base font-bold text-foreground">
          Canais e templates
        </h2>
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Selecione os canais de envio
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["email", "whatsapp", "push"] as CanalTemplate[]).map((c) => {
            const Icon = CANAL_ICON[c];
            const active = form.canais.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCanal(c)}
                className={cn(
                  "rounded-lg border-2 p-4 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      active ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  {active && <Check className="h-4 w-4 text-primary" />}
                </div>
                <h3 className="mt-3 font-display text-sm font-bold text-foreground">
                  {CANAL_LABEL[c]}
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {c === "email" && "Resend / SendGrid"}
                  {c === "whatsapp" && "Meta Cloud API"}
                  {c === "push" && "Notificação in-app"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {form.canais.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Template por canal
          </div>
          {form.canais.map((canal) => {
            const Icon = CANAL_ICON[canal];
            const tplDoCanal = templates.filter((t) => t.canal === canal && t.ativo);
            return (
              <div
                key={canal}
                className="flex items-center gap-3 p-3 rounded-md border border-border bg-background"
              >
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="w-28 shrink-0 text-[13px] font-semibold text-foreground">
                  {CANAL_LABEL[canal]}
                </div>
                <select
                  value={form.templates[canal] ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      templates: {
                        ...form.templates,
                        [canal]: e.target.value || undefined,
                      },
                    })
                  }
                  className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                >
                  <option value="">— Selecione um template —</option>
                  {tplDoCanal.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step4({
  form,
  setForm,
  audienciaCount,
}: {
  form: FormCampanha;
  setForm: React.Dispatch<React.SetStateAction<FormCampanha>>;
  audienciaCount: number;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <Send className="h-5 w-5 text-primary" />
        <h2 className="font-display text-base font-bold text-foreground">
          Revisão e envio
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <RevisaoCard label="Título" value={form.titulo} />
        <RevisaoCard
          label="Audiência"
          value={`${audienciaCount.toLocaleString("pt-BR")} investidor${audienciaCount === 1 ? "" : "es"}`}
        />
        <RevisaoCard
          label="Canais"
          value={form.canais.map((c) => CANAL_LABEL[c]).join(" · ")}
        />
        <RevisaoCard
          label="Templates"
          value={`${Object.keys(form.templates).length} configurados`}
        />
      </div>

      <div className="rounded-lg border border-border bg-background p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
          Quando enviar?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={() => setForm((f) => ({ ...f, agendamento: "agora" }))}
            className={cn(
              "rounded-lg border-2 p-4 text-left transition-all",
              form.agendamento === "agora"
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <div className="flex items-center justify-between">
              <Send className="h-4 w-4 text-foreground" />
              {form.agendamento === "agora" && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
            <h3 className="mt-2 font-display text-sm font-bold text-foreground">
              Enviar agora
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Disparo imediato após confirmação
            </p>
          </button>
          <button
            onClick={() => setForm((f) => ({ ...f, agendamento: "agendada" }))}
            className={cn(
              "rounded-lg border-2 p-4 text-left transition-all",
              form.agendamento === "agendada"
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <div className="flex items-center justify-between">
              <Calendar className="h-4 w-4 text-foreground" />
              {form.agendamento === "agendada" && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
            <h3 className="mt-2 font-display text-sm font-bold text-foreground">
              Agendar
            </h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Disparo automático em data/hora futura
            </p>
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-[12px] text-foreground">
        <strong>Modo mock:</strong> nenhuma mensagem real será enviada ao
        confirmar. A campanha entra como rascunho no histórico. O disparo real
        depende da integração com Resend, Meta Cloud API e FCM.
      </div>
    </div>
  );
}

function RevisaoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-sm font-bold text-foreground">
        {value || "—"}
      </div>
    </div>
  );
}
