// Aplica as mudanças textuais da Fase 1 no Supabase Cloud.
// Uso: SUPABASE_SERVICE_ROLE_KEY=... node scripts/update-cloud-fase1.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://rvjbhomewnnfjcbnbbyp.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

// 1) Hero — textos novos
const heroPatch = {
  eyebrow: "",
  tituloLinha1: "Governança que protege",
  tituloLinha2: "quem confia em nós",
  descricao:
    "Grupo ICA: conectando servidores públicos, prefeituras e pequenos negócios por meio de tecnologia, crédito e benefícios, impulsionando o desenvolvimento econômico local e transformando realidades em todo o Brasil.",
  ctaLabel: "",
  ctaSecundarioLabel: "",
};

const { error: e1 } = await sb.from("site_textos").update({ hero: heroPatch }).eq("id", 1);
if (e1) throw e1;
console.log("✓ Hero atualizado");

// 2) Nav Items — 6 novos
await sb.from("nav_items").delete().neq("id", "_never_");
const { error: e2 } = await sb.from("nav_items").insert([
  { id: "nav-1", label: "Quem Somos", url: "/quem-somos", ordem: 0, visivel: true },
  { id: "nav-2", label: "Governança Corporativa", url: "/em-construcao", ordem: 1, visivel: true },
  { id: "nav-3", label: "Políticas de Governança", url: "/em-construcao", ordem: 2, visivel: true },
  { id: "nav-4", label: "Informações Financeiras", url: "/demonstracoes", ordem: 3, visivel: true },
  { id: "nav-5", label: "Comunicados", url: "/em-construcao", ordem: 4, visivel: true },
  { id: "nav-6", label: "Fundos de Investimentos", url: "/em-construcao", ordem: 5, visivel: true },
]);
if (e2) throw e2;
console.log("✓ Nav items atualizados (6)");

// 3) Quick Actions — 4 botões (3 atuais + Projetos Sociais)
await sb.from("quick_actions").delete().neq("id", "_never_");
const { error: e3 } = await sb.from("quick_actions").insert([
  { id: "qa-1", label: "FAQs", href: "/em-construcao", ordem: 0, visivel: true },
  { id: "qa-2", label: "Resultados do Trimestre", href: "/resultados", ordem: 1, visivel: true },
  { id: "qa-3", label: "Apresentação Institucional", href: "/apresentacao", ordem: 2, visivel: true },
  { id: "qa-4", label: "Projetos Sociais", href: "https://www.institutoesmeraldas.com.br/home", ordem: 3, visivel: true },
]);
if (e3) throw e3;
console.log("✓ Quick actions atualizadas (4)");

console.log("\n🎯 Fase 1 (CMS) aplicada com sucesso no Supabase Cloud.");
