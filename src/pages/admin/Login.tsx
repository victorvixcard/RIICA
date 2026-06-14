import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Lock, Mail, ArrowLeft, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/store/auth";

export function LoginAdmin() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("vitao@grupoica.com.br");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      await loginAdmin(email, senha);
      navigate("/admin/dashboard");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha ao entrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Lado escuro institucional */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-surface-dark text-surface-dark-foreground relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[400px] rounded-full bg-primary/10 blur-[140px]" />

        <Logo variant="inverse" />

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-glow/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-glow">
            Painel administrativo
          </div>
          <h2 className="mt-6 font-display text-3xl lg:text-4xl font-extrabold leading-tight">
            Operação de RI <br />
            <span className="text-primary-glow">com clareza e controle</span>
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-white/65">
            Importação de bases, gestão de campanhas multicanal e auditoria
            completa em um só lugar.
          </p>
        </div>

        <p className="relative z-10 text-[11px] text-white/40">
          © 2026 Grupo ICA — uso restrito ao time interno
        </p>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao portal
          </Link>

          <div className="mt-10">
            <h1 className="font-display text-3xl font-extrabold text-foreground">
              Entrar no painel
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Acesso restrito ao time de RI do Grupo ICA.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                E-mail corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.nome@grupoica.com.br"
                  className="w-full rounded-md border border-input bg-card pl-10 pr-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={verSenha ? "text" : "password"}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-card pl-10 pr-10 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setVerSenha((v) => !v)}
                  aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {verSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-[12px] text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-input text-primary focus:ring-primary/30"
                />
                Lembrar de mim
              </label>
              <a
                href="#"
                className="text-[12px] font-semibold text-primary hover:text-primary-deep"
              >
                Esqueci a senha
              </a>
            </div>

            {erro && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-[13px] text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-border text-center">
            <p className="text-[11px] text-muted-foreground">
              Protegido por 2FA. Suporte:{" "}
              <a
                href="mailto:ti@grupoica.com.br"
                className="text-primary hover:text-primary-deep"
              >
                ti@grupoica.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
