import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/store/auth";

export function AdminShell() {
  const { usuario, loading } = useAuth();

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
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
