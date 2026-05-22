import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminShell() {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
