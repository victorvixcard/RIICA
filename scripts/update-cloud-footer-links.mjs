// Alinha as URLs dos footer_links com os destinos reais — mesmo que
// header (nav_items) e quick_actions já usam.
// Uso: SUPABASE_SERVICE_ROLE_KEY=... node scripts/update-cloud-footer-links.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://rvjbhomewnnfjcbnbbyp.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

// Mapa: label → URL correta (baseado no header e páginas existentes)
const PATCHES = [
  { label: "Quem somos",            url: "/quem-somos" },
  { label: "Nossas soluções",       url: "/em-construcao" },
  { label: "Governança",            url: "/em-construcao" },
  { label: "Carreiras",             url: "/em-construcao" },
  { label: "Informações financeiras", url: "/demonstracoes" },
  { label: "Comunicados ao mercado", url: "/em-construcao" },
  { label: "Agenda do investidor",  url: "/em-construcao" },
  { label: "FAQ",                   url: "/em-construcao" },
  { label: "Fale com RI",           url: "/fale-com-ri" },
  { label: "Imprensa",              url: "/em-construcao" },
  { label: "Ouvidoria",             url: "/em-construcao" },
  { label: "Política de privacidade", url: "/em-construcao" },
];

let atualizados = 0;
for (const p of PATCHES) {
  const { error, count } = await sb
    .from("footer_links")
    .update({ url: p.url }, { count: "exact" })
    .eq("label", p.label);
  if (error) {
    console.error(`✗ erro em "${p.label}":`, error.message);
    continue;
  }
  console.log(`✓ ${p.label.padEnd(28)} → ${p.url}  (${count ?? "?"} row)`);
  atualizados += count ?? 0;
}

console.log(`\n🎯 ${atualizados} footer_links atualizados.`);
