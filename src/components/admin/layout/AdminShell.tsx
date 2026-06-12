import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Outlet, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Sidebar, SidebarContent } from "./Sidebar";
import { MobileNavProvider } from "./mobile-nav";
import { useAuth } from "@/store/auth";

export function AdminShell() {
  const { usuario, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Trava o scroll do body enquanto o drawer mobile está aberto.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Fecha o drawer com a tecla Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground text-sm">
        Carregando…
      </div>
    );
  }

  if (!usuario || usuario.papel !== "super_admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <MobileNavProvider open={() => setMobileOpen(true)}>
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Sidebar fixa (desktop) */}
        <Sidebar />

        {/* Drawer mobile (< lg) — via portal no body para escapar de qualquer
            containing block criado por transform/filter de ancestrais. */}
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
              <motion.aside
                className="relative h-full w-[280px] max-w-[85vw] flex flex-col bg-surface-dark text-surface-dark-foreground shadow-elevated"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              >
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fechar menu"
                  className="absolute top-4 right-3 z-10 h-9 w-9 rounded-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex-1 flex flex-col overflow-y-auto">
                  <SidebarContent onNavigate={() => setMobileOpen(false)} />
                </div>
              </motion.aside>
            </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

        <div className="flex-1 flex flex-col min-w-0">
          <Outlet />
        </div>
      </div>
    </MobileNavProvider>
  );
}
