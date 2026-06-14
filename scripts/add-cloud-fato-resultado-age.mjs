// Sobe a Ata da AGE (PDF local) para o Storage e cria o fato relevante
// "Divulgação do Resultado da AGE" com data 2026-06-12 e link de download.
//
// Uso:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/add-cloud-fato-resultado-age.mjs
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const url = process.env.SUPABASE_URL || "https://rvjbhomewnnfjcbnbbyp.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no env");
  process.exit(1);
}

const PDF_PATH = process.env.PDF_PATH || "C:/Users/Administrador/Downloads/Ata.pdf";
const OBJECT_PATH = "comunicados/ata-resultado-age-12-06-2026.pdf";

const sb = createClient(url, key, { auth: { persistSession: false } });

// 1) Upload do PDF no bucket público "documentos"
console.log(`→ Lendo ${PDF_PATH}…`);
const pdf = await readFile(PDF_PATH);
console.log(`  ${(pdf.length / 1024).toFixed(1)} KB`);

console.log(`→ Subindo para Storage em ${OBJECT_PATH}…`);
const up = await sb.storage.from("documentos").upload(OBJECT_PATH, pdf, {
  contentType: "application/pdf",
  upsert: true,
});
if (up.error) throw up.error;

const { data: pub } = sb.storage.from("documentos").getPublicUrl(OBJECT_PATH);
console.log(`  URL pública: ${pub.publicUrl}`);

// 2) Inserir o fato relevante apontando para o PDF
const fato = {
  data: "2026-06-12",
  tag: "COMUNICADO OFICIAL",
  titulo: "Divulgação do Resultado da Assembleia Geral Extraordinária",
  resumo:
    "A ICA Soluções Financeiras S/A divulga o resultado das deliberações aprovadas em Assembleia Geral Extraordinária, bem como os encaminhamentos necessários para execução das medidas aprovadas.\n\nSegue PDF para download.",
  url: pub.publicUrl,
  publicado: true,
  ordem: 0,
};

console.log(`→ Inserindo fato relevante (data ${fato.data})…`);
const ins = await sb.from("fatos_relevantes").insert(fato).select();
if (ins.error) throw ins.error;

console.log(`✓ Fato relevante criado:`);
console.log(`  ID:     ${ins.data[0].id}`);
console.log(`  Data:   ${ins.data[0].data}`);
console.log(`  Título: ${ins.data[0].titulo}`);
console.log(`  PDF:    ${ins.data[0].url}`);
console.log(`\n🎯 Pronto. Confira em / e em /admin/conteudo/fatos-relevantes.`);
