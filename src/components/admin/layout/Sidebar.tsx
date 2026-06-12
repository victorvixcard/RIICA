import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Send,
  FileText,
  History,
  Settings,
  LogOut,
  Layers,
  UserCog,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";

const NAV_OPERACAO = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/investidores", label: "Investidores", icon: Users },
  { to: "/admin/usuarios", label: "Usuários", icon: UserCog },
  { to: "/admin/campanhas", label: "Campanhas", icon: Send },
];

const NAV_CONTEUDO = [
  { to: "/admin/conteudo", label: "Conteúdo do site", icon: Layers },
  { to: "/admin/templates", label: "Templates", icon: FileText },
  { to: "/admin/historico", label: "Histórico", icon: History },
];

function NavItem({
  to,
  label,
  icon: Icon,
  end,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors",
          isActive
            ? "bg-primary/15 text-primary-glow"
            : "text-white/70 hover:text-white hover:bg-white/5"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

/**
 * Conteúdo interno da sidebar — reutilizado tanto no aside fixo (desktop)
 * quanto no drawer mobile. `onNavigate` fecha o drawer ao clicar num link.
 */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const nome = usuario?.nome ?? "Administrador";
  const inicial = nome.charAt(0).toUpperCase();

  const sair = async () => {
    onNavigate?.();
    await logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      <div className="px-6 pt-7 pb-5 border-b border-white/5">
        <Logo variant="inverse" />
      </div>

      <div className="px-3 pt-5 pb-2">
        <div className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          Operação
        </div>
      </div>
      <nav className="px-3 flex flex-col gap-0.5">
        {NAV_OPERACAO.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="px-3 pt-5 pb-2">
        <div className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
          Conteúdo & Comunicação
        </div>
      </div>
      <nav className="px-3 flex flex-col gap-0.5 flex-1">
        {NAV_CONTEUDO.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="px-3 pb-3">
        <NavItem
          to="/admin/configuracoes"
          label="Configurações"
          icon={Settings}
          onNavigate={onNavigate}
        />
      </div>

      <div className="px-3 pb-5 border-t border-white/5 pt-4 mt-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary-glow font-display font-bold text-sm">
            {inicial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">
              {nome}
            </div>
            <div className="text-[11px] text-white/50 truncate">Super Admin</div>
          </div>
          <button
            onClick={sair}
            aria-label="Sair"
            className="h-8 w-8 rounded-md flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

/** Sidebar fixa do desktop (≥ lg). No mobile usa-se o drawer no AdminShell. */
export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-surface-dark text-surface-dark-foreground border-r border-white/5">
      <SidebarContent />
    </aside>
  );
}
