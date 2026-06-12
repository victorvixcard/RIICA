import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  Loader2,
  X,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { uploadArquivo, type ArquivoUpload } from "@/lib/api/storage";
import { cn } from "@/lib/utils";

interface UploadArquivoProps {
  /** URL atual do arquivo (quando já existe um). */
  value?: string;
  /** Nome/rótulo do arquivo atual (opcional, p/ exibição). */
  nomeAtual?: string;
  /** Subpasta lógica dentro do bucket (ex: "comunicados"). */
  prefix?: string;
  /** Tipos aceitos no seletor. */
  accept?: string;
  /** Disparado ao concluir o upload com sucesso. */
  onUploaded: (r: ArquivoUpload) => void;
  /** Disparado ao remover o arquivo (limpa o campo). */
  onClear?: () => void;
}

export function UploadArquivo({
  value,
  nomeAtual,
  prefix = "geral",
  accept = ".pdf",
  onUploaded,
  onClear,
}: UploadArquivoProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const enviar = async (file?: File) => {
    if (!file) return;
    setErro(null);
    setUploading(true);
    try {
      const r = await uploadArquivo(file, prefix);
      onUploaded(r);
    } catch (e) {
      setErro(
        e instanceof Error ? e.message : "Falha no upload. Tente novamente."
      );
    } finally {
      setUploading(false);
    }
  };

  // Arquivo já existe → mostra link + ações
  if (value && !uploading) {
    return (
      <div className="rounded-md border border-border bg-background p-3 flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <FileText className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-foreground truncate">
            {nomeAtual || "Arquivo anexado"}
          </div>
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary-deep"
          >
            Abrir / baixar <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors px-2"
        >
          Trocar
        </button>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Remover arquivo"
            className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => enviar(e.target.files?.[0])}
        />
      </div>
    );
  }

  // Sem arquivo → dropzone
  return (
    <div>
      <button
        type="button"
        disabled={uploading}
        onClick={() => ref.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          enviar(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "w-full rounded-md border-2 border-dashed px-5 py-6 transition-colors flex items-center gap-4 text-left",
          uploading
            ? "border-primary/40 bg-primary/5 cursor-wait"
            : dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
        )}
      >
        <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {uploading ? (
            <div className="text-[13px] font-semibold text-foreground">
              Enviando arquivo…
            </div>
          ) : (
            <>
              <div className="text-[13px] font-semibold text-foreground">
                Clique ou arraste um PDF
              </div>
              <div className="text-[11px] text-muted-foreground">
                Vai para o Storage e fica disponível para download · até 20 MB
              </div>
            </>
          )}
        </div>
      </button>

      {erro && (
        <div className="mt-2 flex items-start gap-2 text-[12px] text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {erro}
        </div>
      )}

      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => enviar(e.target.files?.[0])}
      />
    </div>
  );
}
