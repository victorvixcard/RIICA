import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, FileText, Calendar, Bell, User } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { type Investidor } from "@/store/investors";
import { getInvestidorPorCpf } from "@/lib/api/investidores";
import { useContent } from "@/store/content";
import { useAuth } from "@/store/auth";

export function AreaInvestidor() {
  const navigate = useNavigate();
  const { usuario, loading, logout } = useAuth();
  const { state: content } = useContent();
  const [registro, setRegistro] = useState<Investidor | null>(null);

  const autorizado = !!usuario && usuario.papel === "investidor";

  useEffect(() => {
    if (!loading && !autorizado) {
      navigate("/investidor/login", { replace: true });
    }
  }, [loading, autorizado, navigate]);

  useEffect(() => {
    if (usuario?.cpf) {
      getInvestidorPorCpf(usuario.cpf)
        .then(setRegistro)
        .catch(() => setRegistro(null));
    }
  }, [usuario?.cpf]);

  if (loading || !usuario || !autorizado) return null;

  const sair = async () => {
    await logout();
    navigate("/investidor/login", { replace: true });
  };

  const nome = usuario.nome;
  const cpf = usuario.cpf ?? "—";
  const valorInvestido = registro?.valorInvestido ?? 0;
  const status = registro?.status ?? "ativo";
  const ultimoContato = registro?.ultimoContato;
  const criadoEm = registro?.criadoEm;

  const comunicadosPublicados = content.comunicados.filter((c) => c.publicado);
  const eventosPublicados = content.eventos.filter((e) => e.publicado);
  const documentosPublicos = content.documentos.filter((d) => d.publico);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground border-l border-border pl-4">
              Área do Investidor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[13px] text-foreground font-medium">
              <User className="h-4 w-4 text-muted-foreground" />
              {nome.split(" ")[0]}
            </div>
            <button
              onClick={sair}
              className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Boas-vindas */}
        <div>
          <p className="text-[12px] font-bold uppercase tracking-widest text-primary mb-1">
            Bem-vindo(a)
          </p>
          <h1 className="font-display text-2xl font-extrabold text-foreground">
            {nome}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            CPF {cpf}
            {criadoEm && (
              <>
                {" "}&middot; Investidor desde{" "}
                {new Date(criadoEm).toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </>
            )}
          </p>
        </div>

        {/* Cards resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Valor Investido
            </p>
            <p className="mt-2 text-2xl font-extrabold text-foreground">
              {valorInvestido.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <p className="mt-2 text-2xl font-extrabold text-primary capitalize">
              {status === "ativo" ? "Ativo" : status}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Último Contato
            </p>
            <p className="mt-2 text-2xl font-extrabold text-foreground">
              {ultimoContato
                ? new Date(ultimoContato).toLocaleDateString("pt-BR")
                : "—"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Comunicados */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Bell className="h-4 w-4 text-primary" />
              <h2 className="text-[13px] font-bold uppercase tracking-wider">
                Últimos Comunicados
              </h2>
            </div>
            <ul className="divide-y divide-border">
              {comunicadosPublicados.slice(0, 5).map((c) => (
                <li key={c.id} className="px-5 py-4">
                  <p className="text-[11px] text-muted-foreground mb-0.5">
                    {new Date(c.data).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-[13px] font-semibold text-foreground leading-snug">
                    {c.titulo}
                  </p>
                  {c.resumo && (
                    <p className="mt-0.5 text-[12px] text-muted-foreground line-clamp-2">
                      {c.resumo}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            {/* Próximos Eventos */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="text-[13px] font-bold uppercase tracking-wider">
                  Eventos
                </h2>
              </div>
              <ul className="divide-y divide-border">
                {eventosPublicados.slice(0, 3).map((e) => (
                  <li key={e.id} className="px-5 py-3.5">
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(e.data).toLocaleDateString("pt-BR")}
                      {e.hora ? ` · ${e.hora}` : ""}
                    </p>
                    <p className="text-[13px] font-semibold text-foreground leading-snug">
                      {e.titulo}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Documentos */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-[13px] font-bold uppercase tracking-wider">
                  Documentos
                </h2>
              </div>
              <ul className="divide-y divide-border">
                {documentosPublicos.slice(0, 4).map((d) => (
                  <li key={d.id} className="px-5 py-3.5">
                    <p className="text-[12px] font-semibold text-foreground leading-snug">
                      {d.titulo}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {d.periodo ?? ""}{" "}
                      {((d.tamanho ?? 0) / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border text-center">
          <Link
            to="/"
            className="text-[12px] text-muted-foreground hover:text-primary transition-colors"
          >
            ← Voltar ao portal público
          </Link>
        </div>
      </main>
    </div>
  );
}
