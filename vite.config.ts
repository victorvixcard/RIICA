import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { credenciaisMailer } from "./vite-plugins/credenciais-mailer";
import { adminResetSenha } from "./vite-plugins/admin-reset-senha";

export default defineConfig(({ mode }) => {
  // Carrega todas as env vars (inclusive não-VITE_) para uso no lado Node.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), credenciaisMailer(env), adminResetSenha(env)],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
      strictPort: false,
    },
  };
});
