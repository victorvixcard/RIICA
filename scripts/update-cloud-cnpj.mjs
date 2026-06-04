// Atualiza CNPJ, razão social e endereço do rodapé no Supabase Cloud.
// Uso: SUPABASE_SERVICE_ROLE_KEY=... node scripts/update-cloud-cnpj.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL || "https://rvjbhomewnnfjcbnbbyp.supabase.co";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) {
  console.error("Falta SUPABASE_SERVICE_ROLE_KEY no env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const { error } = await sb.from("site_config").upsert({
  id: 1,
  footer_cnpj: "CNPJ 37.468.454/0001-00",
  footer_endereco: "ICA Soluções Financeiras S/A · Salvador, Bahia",
});
if (error) throw error;

console.log("✓ Rodapé atualizado: ICA Soluções Financeiras S/A · CNPJ 37.468.454/0001-00 · Salvador, Bahia");
