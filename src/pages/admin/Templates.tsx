import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Copy,
  FileText,
  Mail,
  MessageCircle,
  Bell,
  Filter,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import {
  CANAL_TEMPLATE_LABEL,
  type CanalTemplate,
  type Template,
} from "@/mock/templates";
import { getTemplates } from "@/lib/api/templates";
import { cn } from "@/lib/utils";

const CANAL_ICON: Record<CanalTemplate, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  push: Bell,
};

function fmtData(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

export function Templates() {
  const [busca, setBusca] = useState("");
  const [filtroCanal, setFiltroCanal] = useState<CanalTemplate | "todos">(
    "todos"
  );
  const [aberto, setAberto] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .catch((e) => console.error("[templates] erro ao carregar:", e));
  }, []);

  const filtrados = useMemo(() => {
    let arr = templates;
    if (filtroCanal !== "todos")
      arr = arr.filter((t) => t.canal === filtroCanal);
    if (busca.trim()) {
      const q = busca.toLowerCase();
      arr = arr.filter(
        (t) =>
          t.nome.toLowerCase().includes(q) ||
          t.tags.some((g) => g.toLowerCase().includes(q))
      );
    }
    return arr;
  }, [busca, filtroCanal, templates]);

  return (
    <>
      <Topbar
        title="Templates"
        subtitle="Modelos reutilizáveis de mensagens por canal — email, WhatsApp e push"
        actions={
          <button
            onClick={() => alert("Editor de templates virá com integração real (Resend/Twilio)")}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo template
          </button>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Busca + filtros */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome ou tag..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Canal
              </div>
              <Chip
                active={filtroCanal === "todos"}
                onClick={() => setFiltroCanal("todos")}
                label={`Todos (${templates.length})`}
              />
              {(["email", "whatsapp", "push"] as CanalTemplate[]).map((c) => {
                const count = templates.filter((t) => t.canal === c).length;
                return (
                  <Chip
                    key={c}
                    active={filtroCanal === c}
                    onClick={() => setFiltroCanal(c)}
                    label={`${CANAL_TEMPLATE_LABEL[c]} (${count})`}
                  />
                );
              })}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrados.map((t) => {
              const Icon = CANAL_ICON[t.canal];
              return (
                <button
                  key={t.id}
                  onClick={() => setAberto(t)}
                  className="text-left group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-soft transition-all flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                          t.ativo
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {t.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-4 font-display text-[15px] font-bold text-foreground leading-tight">
                    {t.nome}
                  </h3>
                  {t.assunto && (
                    <div className="mt-2 text-[11px] text-muted-foreground line-clamp-1">
                      <strong className="text-foreground/80">Assunto:</strong>{" "}
                      {t.assunto}
                    </div>
                  )}
                  <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                    {t.resumo}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {t.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-1.5 py-0.5 rounded bg-muted text-[10px] font-semibold text-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {t.usos} usos
                    </span>
                    <span>Editado em {fmtData(t.ultimaEdicao)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal de detalhe */}
      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setAberto(null)}
        >
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  {(() => {
                    const Icon = CANAL_ICON[aberto.canal];
                    return <Icon className="h-4 w-4" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    {aberto.nome}
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {CANAL_TEMPLATE_LABEL[aberto.canal]} · {aberto.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => alert("Edição completa com WYSIWYG vem na próxima entrega")}
                  className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(aberto.conteudo);
                    alert("Conteúdo copiado");
                  }}
                  className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label="Copiar"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setAberto(null)}
                  className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {aberto.assunto && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    Assunto
                  </div>
                  <div className="rounded-md border border-border bg-background px-3 py-2 text-[13px] text-foreground">
                    {aberto.assunto}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Conteúdo
                </div>
                <pre className="rounded-md border border-border bg-background p-4 text-[12px] text-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-72 overflow-y-auto">
                  {aberto.conteudo}
                </pre>
              </div>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Variáveis disponíveis
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(
                    new Set(aberto.conteudo.match(/\{\{[^}]+\}\}/g) || [])
                  ).map((v) => (
                    <code
                      key={v}
                      className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px] font-mono"
                    >
                      {v}
                    </code>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border flex items-center justify-between text-[12px] text-muted-foreground">
              <span>Usado em {aberto.usos} campanhas</span>
              <span>Editado em {fmtData(aberto.ultimaEdicao)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-[11px] font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background border border-border text-foreground hover:border-primary/40"
      )}
    >
      {label}
    </button>
  );
}
