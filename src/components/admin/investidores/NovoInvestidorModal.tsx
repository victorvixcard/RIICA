import { useState } from "react";
import { X, Save, UserPlus } from "lucide-react";
import {
  useInvestors,
  STATUS_LABEL,
  type StatusInvestidor,
  type OrigemInvestidor,
} from "@/store/investors";

const STATUS_OPTS: StatusInvestidor[] = [
  "ativo",
  "pendente_confirmacao",
  "bloqueado",
  "inativo",
];
const ORIGEM_OPTS: OrigemInvestidor[] = [
  "Cadastro manual",
  "CSV",
  "Importação SCP",
  "Indicação",
];

function formatCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

interface FormState {
  nome: string;
  cpf: string;
  email: string;
  whatsapp: string;
  status: StatusInvestidor;
  origem: OrigemInvestidor;
  valorInvestido: string;
}

const EMPTY: FormState = {
  nome: "",
  cpf: "",
  email: "",
  whatsapp: "",
  status: "pendente_confirmacao",
  origem: "Cadastro manual",
  valorInvestido: "",
};

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export function NovoInvestidorModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = useInvestors();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [erro, setErro] = useState("");

  if (!open) return null;

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    const cpfDigits = form.cpf.replace(/\D/g, "");
    if (!form.nome.trim()) return setErro("Informe o nome.");
    if (cpfDigits.length !== 11) return setErro("CPF deve ter 11 dígitos.");
    if (!form.email.trim()) return setErro("Informe o e-mail.");
    const jaExiste = state.investidores.some(
      (i) => i.cpf.replace(/\D/g, "") === cpfDigits
    );
    if (jaExiste) return setErro("Já existe um investidor com este CPF.");

    dispatch({
      type: "create",
      payload: {
        nome: form.nome.trim(),
        cpf: formatCpf(form.cpf),
        email: form.email.trim(),
        whatsapp: form.whatsapp.trim(),
        status: form.status,
        valorInvestido: Number(form.valorInvestido.replace(/\D/g, "")) || 0,
        ultimoContato: new Date().toISOString().slice(0, 10),
        origem: form.origem,
      },
    });
    setForm(EMPTY);
    onClose();
  };

  const fechar = () => {
    setForm(EMPTY);
    setErro("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && fechar()}
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-base font-bold text-foreground inline-flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Novo investidor
          </h3>
          <button
            onClick={fechar}
            aria-label="Fechar"
            className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={salvar} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Nome</label>
            <input className={inputCls} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">CPF</label>
              <input className={inputCls} inputMode="numeric" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Valor investido (R$)</label>
              <input className={inputCls} inputMode="numeric" placeholder="0" value={form.valorInvestido} onChange={(e) => setForm({ ...form, valorInvestido: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">E-mail</label>
              <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">WhatsApp</label>
              <input className={inputCls} placeholder="+55 27 99999-0000" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Status</label>
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as StatusInvestidor })}>
                {STATUS_OPTS.map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Origem</label>
              <select className={inputCls} value={form.origem} onChange={(e) => setForm({ ...form, origem: e.target.value as OrigemInvestidor })}>
                {ORIGEM_OPTS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {erro && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-[13px] text-destructive">
              {erro}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button type="button" onClick={fechar} className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors">
              <Save className="h-3.5 w-3.5" />
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
