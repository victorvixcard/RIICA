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

/** Remove um arquivo do bucket pelo caminho (best-effort). */
export async function removerArquivo(path: string): Promise<void> {
  await supabase.storage.from(BUCKET).remove([path]);
}
