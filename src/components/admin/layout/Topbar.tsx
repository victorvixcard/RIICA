import { Bell, Search, Menu } from "lucide-react";
import { useMobileNav } from "./mobile-nav";

interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const mobileNav = useMobileNav();

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3 sm:gap-6 px-4 sm:px-6 lg:px-10 h-16">
        {/* Hambúrguer — só no mobile/tablet, abre a sidebar como drawer */}
        <button
          onClick={() => mobileNav?.open()}
          aria-label="Abrir menu"
          className="lg:hidden h-9 w-9 -ml-1 rounded-md flex items-center justify-center text-foreground hover:bg-muted transition-colors shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="font-display text-base sm:text-lg font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-[12px] text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 w-72">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar investidor, campanha, CPF..."
            className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono border border-border rounded text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <button
          aria-label="Notificações"
          className="relative h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>

        {actions}
      </div>
    </header>
  );
}
