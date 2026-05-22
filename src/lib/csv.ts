// ===== Helpers de CSV =====
// Validação de CPF brasileiro com dígito verificador,
// validação de e-mail, normalizadores e auto-detect de colunas.

export function cleanCpf(raw: string): string {
  return String(raw || "").replace(/\D/g, "");
}

export function formatCpf(raw: string): string {
  const c = cleanCpf(raw);
  if (c.length !== 11) return raw;
  return `${c.slice(0, 3)}.${c.slice(3, 6)}.${c.slice(6, 9)}-${c.slice(9)}`;
}

/**
 * Valida CPF com algoritmo oficial (dígito verificador).
 * Aceita string formatada ou só dígitos.
 */
export function validateCpf(raw: string): boolean {
  const cpf = cleanCpf(raw);
  if (cpf.length !== 11) return false;
  // Rejeita sequências repetidas (000…, 111…, 222…)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigito = (slice: string, factor: number) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i], 10) * (factor - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigito(cpf.slice(0, 9), 10);
  if (d1 !== parseInt(cpf[9], 10)) return false;
  const d2 = calcDigito(cpf.slice(0, 10), 11);
  if (d2 !== parseInt(cpf[10], 10)) return false;

  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(raw: string): boolean {
  return EMAIL_RE.test(String(raw || "").trim());
}

export function normalizePhone(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) return String(raw || "").trim();
  // formato brasileiro:  +55 DD 9XXXX-XXXX
  let withCountry = digits;
  if (!withCountry.startsWith("55")) withCountry = "55" + withCountry;
  const dd = withCountry.slice(2, 4);
  const rest = withCountry.slice(4);
  if (rest.length === 9) {
    return `+55 ${dd} ${rest.slice(0, 5)}-${rest.slice(5)}`;
  }
  if (rest.length === 8) {
    return `+55 ${dd} ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  return String(raw || "").trim();
}

export function parseValor(raw: string | number): number {
  if (typeof raw === "number") return raw;
  const s = String(raw || "").trim();
  if (!s) return 0;
  // R$ 1.234.567,89  →  1234567.89
  const normalized = s
    .replace(/[R$\s]/gi, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
}

// ===== Auto-detect de colunas =====
export type CampoInvestidor =
  | "cpf"
  | "nome"
  | "email"
  | "whatsapp"
  | "valorInvestido";

const HINTS: Record<CampoInvestidor, string[]> = {
  cpf: ["cpf", "documento", "doc", "cpf/cnpj", "cpfcnpj"],
  nome: [
    "nome",
    "nomecompleto",
    "nome completo",
    "investidor",
    "razao",
    "razao social",
    "razaosocial",
    "cliente",
  ],
  email: ["email", "e-mail", "e mail", "mail", "correio"],
  whatsapp: [
    "whatsapp",
    "whats",
    "celular",
    "telefone",
    "fone",
    "phone",
    "wpp",
  ],
  valorInvestido: [
    "valor",
    "valorinvestido",
    "valor investido",
    "investimento",
    "aporte",
    "capital",
    "posicao",
    "saldo",
  ],
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .trim();
}

/** Retorna o nome da coluna mais provável do CSV pra um campo do investidor (ou null). */
export function autoDetectColumn(
  headers: string[],
  target: CampoInvestidor
): string | null {
  const hints = HINTS[target];
  // 1) Match exato
  for (const h of headers) {
    const n = normalize(h);
    if (hints.some((hint) => normalize(hint) === n)) return h;
  }
  // 2) Match parcial (contains)
  for (const h of headers) {
    const n = normalize(h);
    if (hints.some((hint) => n.includes(normalize(hint)))) return h;
  }
  return null;
}

// ===== Template CSV =====
export const TEMPLATE_CSV =
  "cpf,nome,email,whatsapp,valor\n" +
  "123.456.789-09,Fulano de Tal,fulano@email.com,+55 27 99999-0000,150000\n" +
  "987.654.321-00,Beltrano Silva,beltrano@email.com,+55 11 98888-1234,520000\n";

export function downloadTemplate() {
  const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "template-investidores-ica.csv";
  a.click();
  URL.revokeObjectURL(url);
}
