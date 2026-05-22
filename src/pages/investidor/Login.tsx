import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, User, Lock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function LoginInvestidor() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Próximo passo: 2FA via SMS no celular cadastrado. (Tela ainda em construção)"
    );
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-surface-dark text-surface-dark-foreground relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[420px] rounded-full bg-primary/10 blur-[140px]" />

        <Logo variant="inverse" />

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-glow/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-glow">
            Área do investidor
          </div>
          <h2 className="mt-6 font-display text-3xl lg:text-4xl font-extrabold leading-tight">
            Seus comunicados,
            <br />
            <span className="text-primary-glow">em um só lugar</span>
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-white/65">
            Acesse releases, atualizações da reestruturação, documentos
            personalizados e seus dados cadastrais com segurança.
          </p>
          <div className="mt-8 flex items-center gap-2 text-[12px] text-white/60">
            <ShieldCheck className="h-4 w-4 text-primary-glow" />
            Protegido por autenticação de dois fatores (SMS)
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-white/40">
          © 2026 Grupo ICA — Relações com Investidores
        </p>
      </div>

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
              Acessar minha área
            </h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Entre com seu CPF e a senha cadastrada no primeiro acesso.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                CPF
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full rounded-md border border-input bg-card pl-10 pr-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
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
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-md border border-input bg-card pl-10 pr-3 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <a
                href="#"
                className="text-[12px] font-semibold text-primary hover:text-primary-deep"
              >
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
            >
              Continuar para o 2FA
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-border text-center">
            <p className="text-[12px] text-muted-foreground">
              Ainda não recebeu seus dados de acesso?{" "}
              <a
                href="mailto:ri@grupoica.com.br"
                className="text-primary hover:text-primary-deep font-semibold"
              >
                Fale com o RI
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
