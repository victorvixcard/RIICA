// Cria a tabela fatos_relevantes no Supabase Cloud + seed inicial.
//
// Como criar a tabela:
//   1. Abrir Supabase Dashboard > SQL Editor
//   2. Colar o conteúdo de: supabase/migrations/20260604000001_fatos_relevantes.sql
//   3. Run
//
// Depois rodar este script pra popular seed de exemplo:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/setup-cloud-fatos-relevantes.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://rvjbhomewnnfjcbnbbyp.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

// Checa se a tabela existe
const probe = await sb.from("fatos_relevantes").select("id").limit(1);
if (probe.error) {
  console.error("\n✗ Tabela fatos_relevantes NÃO existe ainda.");
  console.error("  Aplique antes a migration via Supabase Dashboard > SQL Editor:");
  console.error("  supabase/migrations/20260604000001_fatos_relevantes.sql");
  process.exit(1);
}

console.log("✓ Tabela fatos_relevantes encontrada");

// Limpa antes de inserir o seed
await sb.from("fatos_relevantes").delete().neq("id", "00000000-0000-0000-0000-000000000000");

// Seed de exemplo — 3 fatos relevantes fictícios pra você testar o CMS.
// Esses 3 vão aparecer no admin (/admin/conteudo/fatos-relevantes) onde
// você pode editar ou excluir um a um.
const seed = [
  {
    data: "2026-05-23",
    tag: "COMUNICADO OFICIAL",
    titulo:
      "Carta da Diretoria aos Investidores — Perspectivas Estratégicas e Prioridades para 2026",
    resumo:
      "A diretoria executiva do Grupo ICA publica carta institucional endereçada a investidores e parceiros, apresentando a visão estratégica do grupo para o exercício de 2026, prioridades de expansão regional e compromissos de governança corporativa.",
    url: "#",
    publicado: true,
    ordem: 0,
  },
  {
    data: "2026-04-15",
    tag: "AVISO AO MERCADO",
    titulo:
      "Atualização do Calendário de Eventos Corporativos — Segundo Semestre de 2026",
    resumo:
      "O Grupo ICA divulga a versão atualizada do Calendário de Eventos Corporativos para o segundo semestre de 2026, contemplando assembleias gerais, divulgação de resultados trimestrais e conferências com analistas.",
    url: "#",
    publicado: true,
    ordem: 1,
  },
  {
    data: "2026-03-08",
    tag: "FATO RELEVANTE",
    titulo:
      "Grupo ICA aprova nova arquitetura de governança e nomeia Governance Officer",
    resumo:
      "A diretoria executiva aprova formalmente a nova arquitetura de governança para os veículos de investimento do grupo, com a designação do Governance Officer e a publicação do cronograma de implementação dos novos controles internos.",
    url: "#",
    publicado: true,
    ordem: 2,
  },
];

const { error: insErr } = await sb.from("fatos_relevantes").insert(seed);
if (insErr) throw insErr;
console.log(`✓ ${seed.length} fatos relevantes inseridos (seed)`);

console.log("\n🎯 Fatos Relevantes pronto no Supabase Cloud.");
