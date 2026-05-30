import { useState } from "react";
import { X, Mail, Send, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Investidor } from "@/store/investors";
import { enviarCredenciais, type ResultadoEnvio } from "@/lib/api/usuarios";
import { cn } from "@/lib/utils";

export function EnviarCredenciaisModal({
  open,
  onClose,
  selecionados,
  todosFiltrados,
}: {
  open: boolean;
  onClose: () => void;
  selecionados: Investidor[];
  todosFiltrados: Investidor[];
}) {
  const [escopo, setEscopo] = useState<"selecionados" | "todos">(
    selecionados.length > 0 ? "selecionados" : "todos"
  );
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoEnvio | null>(null);

  if (!open) return null;

  const alvo = escopo === "selecionados" ? selecionados : todosFiltrados;
  const comEmail = alvo.filter((i) => i.email?.trim());

  const enviar = async () => {
    setEnviando(true);
    setResultado(null);
    try {
      const r = await enviarCredenciais(comEmail.map((i) => i.email));
      setResultado(r);
    } catch (e) {
      setResultado({
        enviados: 0,
        semUsuario: [],
        erros: [String(e)],
        total: comEmail.length,
      });
    } finally {
      setEnviando(false);
    }
  };

  const fechar = () => {
    setResultado(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && fechar()}
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-base font-bold text-foreground inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Enviar credenciais de acesso
          </h3>
          <button
            onClick={fechar}
            aria-label="Fechar"
            className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {!resultado && (
            <>
              <p className="text-[13px] text-muted-foreground">
                Envia o e-mail com login e senha provisória para os investidores.
                Quem ainda não tem credencial recebe uma senha gerada na hora.
              </p>

              <div className="space-y-2">
                <ScopeOption
                  ativo={escopo === "selecionados"}
                  onClick={() => setEscopo("selecionados")}
                  label={`Selecionados (${selecionados.length})`}
                  disabled={selecionados.length === 0}
                />
                <ScopeOption
                  ativo={escopo === "todos"}
                  onClick={() => setEscopo("todos")}
                  label={`Todos os filtrados (${todosFiltrados.length})`}
                />
              </div>

              <div className="rounded-lg bg-muted/50 border border-border p-3 text-[12px] text-muted-foreground">
                Serão enviados <strong className="text-foreground">{comEmail.length}</strong> e-mails
                {alvo.length !== comEmail.length && (
                  <> ({alvo.length - comEmail.length} sem e-mail serão ignorados)</>
                )}
                . Em ambiente de desenvolvimento, os e-mails caem no{" "}
                <a
                  href="http://127.0.0.1:54324"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  Mailpit
                </a>
                .
              </div>
            </>
          )}

          {resultado && (
            <div className="space-y-3">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="text-[13px] text-foreground">
                  <strong>{resultado.enviados}</strong> credenciais enviadas com sucesso.
                  <div className="mt-1 text-[12px] text-muted-foreground">
                    Veja os e-mails no{" "}
                    <a
                      href="http://127.0.0.1:54324"
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Mailpit (127.0.0.1:54324)
                    </a>
                    .
                  </div>
                </div>
              </div>
              {resultado.semUsuario.length > 0 && (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-[12px] text-foreground flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />
                  <div>
                    <strong>{resultado.semUsuario.length}</strong> sem usuário cadastrado (gere credenciais antes): {resultado.semUsuario.slice(0, 5).join(", ")}
                    {resultado.semUsuario.length > 5 ? "…" : ""}
                  </div>
                </div>
              )}
              {resultado.erros.length > 0 && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-[12px] text-destructive">
                  {resultado.erros.length} erro(s). {resultado.erros[0]}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              onClick={fechar}
              className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              {resultado ? "Fechar" : "Cancelar"}
            </button>
            {!resultado && (
              <button
                onClick={enviar}
                disabled={enviando || comEmail.length === 0}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-3.5 w-3.5" />
                {enviando ? "Enviando..." : `Enviar (${comEmail.length})`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScopeOption({
  ativo,
  onClick,
  label,
  disabled,
}: {
  ativo: boolean;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        ativo ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"
      )}
    >
      <span
        className={cn(
          "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0",
          ativo ? "border-primary" : "border-border"
        )}
      >
        {ativo && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      <span className="text-[13px] font-semibold text-foreground">{label}</span>
    </button>
  );
}
