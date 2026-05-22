import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, Lock } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useContent } from "@/store/content";

const NAV = [
  { label: "Governança Corporativa", to: "#governanca" },
  { label: "Informações Financeiras", to: "/demonstracoes" },
  { label: "Comunicados, Eventos e Replays", to: "#comunicados" },
  { label: "Ação", to: "#acao" },
  { label: "Serviços aos Investidores", to: "#servicos" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { state } = useContent();
  const ticker = state.textos.ticker;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-background/60 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" aria-label="Portal RI Grupo ICA">
            <Logo />
          </Link>

          <div className="hidden lg:flex items-center gap-7 text-[13px]">
            {ticker.map((tk, i) => (
              <div key={tk.id} className="flex items-center gap-2">
                <span className="font-semibold tracking-wide text-foreground">
                  {tk.simbolo}
                </span>
                <span className="text-muted-foreground">{tk.preco}</span>
                <span
                  className={cn(
                    "font-semibold",
                    tk.positivo ? "text-primary" : "text-destructive"
                  )}
                >
                  {tk.variacao}
                </span>
                {i < ticker.length - 1 && (
                  <span className="ml-5 h-4 w-px bg-border" />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://seugrupoica.com.br"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex rounded-full border border-border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Institucional
            </a>
            <Link
              to="/investidor/login"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary-deep transition-colors shadow-brand"
            >
              <Lock className="h-3.5 w-3.5" />
              Área do Investidor
            </Link>
            <div className="hidden sm:flex items-center gap-0.5 rounded-full border border-border px-0.5 text-[11px] font-semibold">
              <button className="rounded-full bg-foreground px-2.5 py-1 text-background">
                PT
              </button>
              <button className="px-2.5 py-1 text-muted-foreground hover:text-foreground">
                EN
              </button>
            </div>
          </div>
        </div>

        <nav className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV.map((item) => {
              const isInternal = item.to.startsWith("/");
              const inner = (
                <span className="group inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground/75 hover:text-primary transition-colors">
                  {item.label}
                  {!isInternal && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
                  )}
                </span>
              );
              return (
                <li key={item.label}>
                  {isInternal ? (
                    <Link to={item.to}>{inner}</Link>
                  ) : (
                    <button>{inner}</button>
                  )}
                </li>
              );
            })}
          </ul>
          <button
            aria-label="Buscar"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </header>
  );
}
