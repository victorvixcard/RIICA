// Zera o banco operacional do admin no Supabase Cloud, mantendo:
//   - usuario Vitão (super_admin)
//   - fatos_relevantes (CMS do site — comunicados)
//   - nav_items, quick_actions, footer_*, redes_sociais, site_config, site_textos
//   - PDF da Ata da AGE (12/06) no Storage
//
// Uso:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/zerar-cloud-operacional.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://rvjbhomewnnfjcbnbbyp.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

// Ordem importa por causa de foreign keys: filhas antes das pais.
const TABELAS_LIMPAR = [
  "atividades",
  "envios",
  "campanhas",
  "templates",
  "valores_financeiros",
  "linhas_financeiras",
  "periodos_financeiros",
  "kit_documentos",
  "kit_links",
  "kit_trimestre",
  "comunicados",
  "documentos",
  "eventos",
  "kpis",
  "ticker",
  "faqs",
  "investidores",
];

console.log("=========================================");
console.log("  ZERANDO BANCO OPERACIONAL DO ADMIN");
console.log("=========================================\n");

// Contagens ANTES
console.log("→ Contagens ANTES:");
for (const t of TABELAS_LIMPAR) {
  const { count, error } = await sb.from(t).select("*", { count: "exact", head: true });
  console.log(`  ${t.padEnd(25)} ${error ? "ERR " + error.message : count + " rows"}`);
}

console.log("\n→ Apagando tabelas operacionais e de conteúdo antigo…");
let total = 0;
for (const t of TABELAS_LIMPAR) {
  // .neq com id sentinel — funciona pra UUID e text
  const { error, count } = await sb
    .from(t)
    .delete({ count: "exact" })
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) {
    console.log(`  ✗ ${t}: ${error.message}`);
  } else {
    console.log(`  ✓ ${t.padEnd(25)} ${count ?? 0} rows apagadas`);
    total += count ?? 0;
  }
}
console.log(`  Total: ${total} rows apagadas em ${TABELAS_LIMPAR.length} tabelas.`);

// Storage — apaga comunicado-25-05.pdf (do FIDC removido)
console.log("\n→ Storage — limpando PDFs antigos:");
const { data: arquivos } = await sb.storage.from("documentos").list("comunicados");
if (arquivos?.length) {
  for (const a of arquivos) {
    const path = `comunicados/${a.name}`;
    if (a.name === "ata-resultado-age-12-06-2026.pdf") {
      console.log(`  → mantendo  ${path} (referenciado pelo fato relevante atual)`);
      continue;
    }
    const { error } = await sb.storage.from("documentos").remove([path]);
    console.log(`  ${error ? "✗" : "✓"} apagado   ${path}${error ? " err=" + error.message : ""}`);
  }
}

// auth.users — apagar Renan e Ana (já não existem em public.usuarios)
console.log("\n→ Auth: limpando contas órfãs (Renan e Ana)…");
const ALVOS_AUTH = [
  { id: "a42f8181-1b09-426e-a618-7175a1d3d6b6", nome: "Renan Giacomin" },
  { id: "382a5dbe-885f-4e20-965b-60851ee76991", nome: "Ana Carolina Ferreira" },
];
for (const a of ALVOS_AUTH) {
  const { error } = await sb.auth.admin.deleteUser(a.id);
  console.log(`  ${error ? "✗" : "✓"} ${a.nome.padEnd(28)} ${error ? "err=" + error.message : "removido"}`);
}

// Estado final
console.log("\n→ Estado final preservado:");
const PRESERVAR = [
  "fatos_relevantes",
  "usuarios",
  "nav_items",
  "quick_actions",
  "footer_colunas",
  "footer_links",
  "redes_sociais",
  "site_config",
  "site_textos",
];
for (const t of PRESERVAR) {
  const { count } = await sb.from(t).select("*", { count: "exact", head: true });
  console.log(`  ${t.padEnd(25)} ${count} rows`);
}

console.log("\n🎯 Banco operacional zerado. CMS do site intacto.");
