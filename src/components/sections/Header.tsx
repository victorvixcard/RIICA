import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, Mail, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useContent } from "@/store/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state } = useContent();
  const nav = [...state.navItems]
    .filter((i) => i.visivel)
    .sort((a, b) => a.ordem - b.ordem);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do body com o drawer aberto + fecha no Escape.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-background/60 backdrop-blur-sm border-b border-transparent"
      )}
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-6 lg:px-10 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="Portal RI Grupo ICA">
            <Logo />
          </Link>

          {/* Ações — desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <a
              href={state.config.institucionalUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              Institucional
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=fundo@icainvest.com.br&su=Contato%20%E2%80%94%20Portal%20RI%20Grupo%20ICA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary-deep transition-colors shadow-brand"
            >
              <Mail className="h-3.5 w-3.5" />
              Fale com RI
            </a>
            <div className="flex items-center gap-0.5 rounded-full border border-border px-0.5 text-[11px] font-semibold">
              <button className="rounded-full bg-foreground px-2.5 py-1 text-background">
                PT
              </button>
              <button className="px-2.5 py-1 text-muted-foreground hover:text-foreground">
                EN
              </button>
            </div>
          </div>

          {/* Hambúrguer — mobile/tablet */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            className="lg:hidden h-10 w-10 -mr-1 rounded-md flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Nav inline — desktop */}
        <nav className="hidden lg:flex mt-4 items-center justify-between border-t border-border/60 pt-4">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {nav.map((item) => {
              const isInternal = item.url.startsWith("/");
              const inner = (
                <span className="group inline-flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground/75 hover:text-primary transition-colors">
                  {item.label}
                  {!isInternal && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform group-hover:rotate-180" />
                  )}
                </span>
              );
              return (
                <li key={item.id}>
                  {isInternal ? (
                    <Link to={item.url}>{inner}</Link>
                  ) : (
                    <a href={item.url}>{inner}</a>
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

      {/* Drawer mobile — via portal no body para escapar do containing block
          criado pelo backdrop-filter do header (senão o fixed colapsa). */}
      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-0 right-0 h-full w-[300px] max-w-[88vw] bg-background border-l border-border shadow-elevated flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <Logo />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                  className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="flex flex-col gap-0.5">
                  {nav.map((item) => {
                    const isInternal = item.url.startsWith("/");
                    const cls =
                      "block rounded-md px-3 py-3 text-[14px] font-semibold uppercase tracking-[0.1em] text-foreground/80 hover:bg-muted hover:text-primary transition-colors";
                    return (
                      <li key={item.id}>
                        {isInternal ? (
                          <Link
                            to={item.url}
                            onClick={() => setMobileOpen(false)}
                            className={cls}
                          >
                            {item.label}
                          </Link>
                        ) : (
                          <a
                            href={item.url}
                            onClick={() => setMobileOpen(false)}
                            className={cls}
                          >
                            {item.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="px-5 py-5 border-t border-border space-y-3">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=fundo@icainvest.com.br&su=Contato%20%E2%80%94%20Portal%20RI%20Grupo%20ICA"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary-deep transition-colors shadow-brand"
                >
                  <Mail className="h-4 w-4" />
                  Fale com RI
                </a>
                <a
                  href={state.config.institucionalUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-full border border-border px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  Site Institucional
                </a>
                <div className="flex items-center justify-center gap-1 pt-1">
                  <button className="rounded-full bg-foreground px-4 py-1.5 text-[11px] font-semibold text-background">
                    PT
                  </button>
                  <button className="rounded-full px-4 py-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
                    EN
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}
