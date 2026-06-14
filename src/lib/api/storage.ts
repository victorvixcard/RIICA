// Upload de arquivos para o Storage público do Supabase (bucket "documentos").
// Usado pelo CMS para subir PDFs de comunicados / fatos relevantes / documentos
// e disponibilizá-los para download no portal.
import { supabase } from "@/lib/supabase";

const BUCKET = "documentos";

/** Tamanho máximo aceito no cliente (espelha o limite do bucket: 20 MB). */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export interface ArquivoUpload {
  /** URL pública de download. */
  url: string;
  /** Caminho do objeto dentro do bucket. */
  path: string;
  /** Tamanho em bytes. */
  tamanho: number;
  /** Nome original do arquivo. */
  nome: string;
}

function slugify(nome: string): string {
  return (
    nome
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9.]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "arquivo"
  );
}

/**
 * Sobe um arquivo para o bucket público e devolve a URL de download.
 * @param file   arquivo selecionado pelo usuário
 * @param prefix subpasta lógica dentro do bucket (ex: "comunicados")
 */
export async function uploadArquivo(
  file: File,
  prefix = "geral"
): Promise<ArquivoUpload> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Arquivo muito grande (${(file.size / 1024 / 1024).toFixed(1)} MB). Limite: 20 MB.`
    );
  }

  const ext = file.name.includes(".")
    ? file.name.split(".").pop()!.toLowerCase()
    : "bin";
  const base = slugify(file.name.replace(/\.[^.]+$/, ""));
  const stamp = Date.now().toString(36);
  const path = `${prefix}/${stamp}-${base}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, tamanho: file.size, nome: file.name };
}

/** Remove um arquivo do bucket pelo caminho (best-effort, não lança erro). */
export async function removerArquivo(path: string): Promise<void> {
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch (e) {
    console.warn("[storage] falha ao remover arquivo (best-effort):", path, e);
  }
}

/**
 * Extrai o path do objeto a partir de uma URL pública do Supabase Storage.
 * Retorna null se a URL não for do nosso bucket (ex: URL externa digitada
 * pelo admin, "#" placeholder, ou string vazia).
 *
 * Ex:
 *   "https://xxx.supabase.co/storage/v1/object/public/documentos/comunicados/ata.pdf"
 *   → "comunicados/ata.pdf"
 */
export function pathDeUrlPublica(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const i = url.indexOf(marker);
  if (i < 0) return null;
  const path = url.slice(i + marker.length);
  // Sanity check — não deixa passar URL com query string ou fragmento.
  return path.split(/[?#]/)[0] || null;
}

/**
 * Remove o arquivo apenas se ele estiver hospedado no nosso bucket Storage.
 * URLs externas (https://outrodominio.com/x.pdf) ou placeholders ("#") são
 * ignoradas silenciosamente.
 */
export async function removerSeNossoStorage(url: string | null | undefined): Promise<void> {
  const path = pathDeUrlPublica(url);
  if (path) await removerArquivo(path);
}
