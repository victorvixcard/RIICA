import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Send } from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

// Dados de contato oficiais (sede da Companhia em Itajaí/SC).
const CONTATO = {
  email: "ri@icagrupo.com.br",
  endereco:
    "Rua Luci Canziani, 100, área A 1B — Bairro Praia Brava — Itajaí/SC — CEP 88.306-700",
  horario: "Segunda a sexta, das 9h às 18h",
};

const ASSUNTOS = [
  "Dúvidas sobre a empresa",
  "Informações financeiras",
  "Governança Corporativa",
  "Eventos e comunicados",
  "Imprensa",
  "Outros",
];

export function FaleComRi() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: ASSUNTOS[0],
    mensagem: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    if (!form.nome.trim() || !form.email.trim() || !form.mensagem.trim()) {
      setErro("Preencha nome, e-mail e mensagem.");
      return;
    }
    setEnviando(true);
    try {
      // TODO: ligar no envio real via Edge Function/Resend quando estiver
      // configurado em produção. Por ora apenas simula sucesso.
      await new Promise((r) => setTimeout(r, 800));
      setSucesso(true);
      setForm({ nome: "", email: "", telefone: "", assunto: ASSUNTOS[0], mensagem: "" });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha ao enviar.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-44 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute top-32 -right-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                <Mail className="h-3 w-3" />
                Relações com Investidores
              </div>
              <h1 className="mt-6 font-display text-4xl lg:text-[52px] font-extrabold leading-[1.05] tracking-tight text-foreground">
                Fale com a área de{" "}
                <span className="text-gradient-primary">Relações com Investidores</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base lg:text-lg text-muted-foreground leading-relaxed">
                Tem alguma dúvida, sugestão ou solicitação? A nossa equipe de RI
                está pronta para atender investidores, acionistas, analistas e a
                imprensa.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Cards de contato + Form */}
        <section className="mx-auto max-w-[1200px] px-6 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14">
            {/* Lado esquerdo — informações */}
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold text-foreground uppercase tracking-wider">
                Canais de atendimento
              </h2>
              <ContatoCard icon={Mail} titulo="E-mail" valor={CONTATO.email} href={`mailto:${CONTATO.email}`} />
              <ContatoCard icon={MapPin} titulo="Endereço" valor={CONTATO.endereco} />
              <ContatoCard icon={Clock} titulo="Horário de atendimento" valor={CONTATO.horario} />
            </div>

            {/* Lado direito — formulário */}
            <div className="rounded-2xl border border-border bg-card shadow-soft p-7 lg:p-9">
              <h2 className="font-display text-xl lg:text-2xl font-extrabold text-foreground">
                Envie sua mensagem
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Responderemos em até <strong className="text-foreground">2 dias úteis</strong>.
              </p>

              {sucesso ? (
                <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                    <Send className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                    Mensagem enviada!
                  </h3>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Recebemos sua mensagem. Nossa equipe entrará em contato em
                    breve.
                  </p>
                  <button
                    onClick={() => setSucesso(false)}
                    className="mt-5 text-[12px] font-semibold uppercase tracking-wider text-primary hover:text-primary-deep"
                  >
                    Enviar outra mensagem
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-7 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Nome completo"
                      value={form.nome}
                      onChange={(v) => setForm({ ...form, nome: v })}
                      required
                    />
                    <Field
                      label="E-mail"
                      type="email"
                      value={form.email}
                      onChange={(v) => setForm({ ...form, email: v })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field
                      label="Telefone (opcional)"
                      value={form.telefone}
                      onChange={(v) => setForm({ ...form, telefone: v })}
                    />
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        Assunto
                      </label>
                      <select
                        value={form.assunto}
                        onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                      >
                        {ASSUNTOS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Mensagem <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.mensagem}
                      onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                      placeholder="Descreva sua dúvida, sugestão ou solicitação..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                    />
                  </div>

                  {erro && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-[13px] text-destructive">
                      {erro}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-[13px] font-bold uppercase tracking-[0.12em] text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-60"
                  >
                    {enviando ? "Enviando..." : "Enviar mensagem"}
                    <Send className="h-3.5 w-3.5" />
                  </button>

                  <p className="text-[11px] text-muted-foreground pt-2">
                    Ao enviar, você concorda com a coleta destes dados para fim
                    exclusivo de retorno da equipe de RI.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ContatoCard({
  icon: Icon,
  titulo,
  valor,
  href,
}: {
  icon: typeof Mail;
  titulo: string;
  valor: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-border bg-card hover:border-primary/40 transition-colors p-5 flex items-start gap-4">
      <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {titulo}
        </div>
        <div className="mt-1 text-[14px] text-foreground break-words">{valor}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
