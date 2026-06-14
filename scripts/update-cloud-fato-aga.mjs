// Atualiza o fato relevante existente (data 2026-05-25) para o conteúdo
// oficial da Assembleia Geral Extraordinária.
// Uso: SUPABASE_SERVICE_ROLE_KEY=... node scripts/update-cloud-fato-aga.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://rvjbhomewnnfjcbnbbyp.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const patch = {
  titulo: "Assembleia Geral Extraordinária",
  tag: "ASSEMBLEIA GERAL EXTRAORDINÁRIA",
  resumo:
    "A ICA Soluções Financeiras S/A, na qualidade de Sócia Ostensiva das Sociedades em Conta de Participação por ela constituídas, nos termos do art. 991 e seguintes do Código Civil, realizará Assembleia Geral Extraordinária destinada à deliberação sobre a implementação da nova estrutura operacional e regulatória voltada à continuidade das operações e regularização dos compromissos assumidos perante os investidores.\n\n" +
    "A deliberação será conduzida exclusivamente pela Sócia Ostensiva, a quem compete, por força contratual e legal, a administração e gestão da SCP, dispensando-se a convocação e participação dos sócios participantes (ocultos) para validade do ato, conforme rito previsto nos respectivos instrumentos contratuais. A assembleia será realizada em conformidade com a legislação aplicável, os atos societários da companhia e os instrumentos contratuais vigentes. A pauta contemplará, entre outros temas, a aprovação das medidas necessárias à reorganização da estrutura operacional e a formalização dos instrumentos jurídicos pertinentes.\n\n" +
    "Os documentos preparatórios e informações relevantes permanecerão disponíveis aos investidores por meio dos canais oficiais de Relações com Investidores.",
};

const { data, error } = await sb
  .from("fatos_relevantes")
  .update(patch)
  .eq("data", "2026-05-25")
  .select();
if (error) throw error;

console.log(`✓ ${data.length} fato(s) atualizado(s):`);
console.log(`  Título: ${data[0]?.titulo}`);
console.log(`  Tag: ${data[0]?.tag}`);
console.log(`  Resumo: ${data[0]?.resumo.length} chars, ${data[0]?.resumo.split(/\n\n+/).length} parágrafo(s)`);
