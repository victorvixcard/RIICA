import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  ExternalLink,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import type { Faq } from "@/store/types";
import { cn } from "@/lib/utils";

interface FormState {
  pergunta: string;
  resposta: string;
  categoria: string;
  ordem: number;
  publicado: boolean;
}

const EMPTY: FormState = {
  pergunta: "",
  resposta: "",
  categoria: "",
  ordem: 0,
  publicado: true,
};

export function ConteudoFaq() {
  const { state, dispatch } = useContent();
  const [editando, setEditando] = useState<string | "novo" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const ordenados = [...state.faqs].sort((a, b) => a.ordem - b.ordem);

  const abrirNovo = () => {
    setForm({ ...EMPTY, ordem: state.faqs.length });
    setEditando("novo");
  };

  const abrirEdicao = (f: Faq) => {
    setForm({
      pergunta: f.pergunta,
      resposta: f.resposta,
      categoria: f.categoria ?? "",
      ordem: f.ordem,
      publicado: f.publicado,
    });
    setEditando(f.id);
  };

  const fechar = () => {
    setEditando(null);
    setForm(EMPTY);
  };

  const salvar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const payload = {
      pergunta: form.pergunta.trim(),
      resposta: form.resposta.trim(),
      categoria: form.categoria.trim() || undefined,
      ordem: form.ordem,
      publicado: form.publicado,
    };
    if (editando === "novo") {
      dispatch({ type: "faq/create", payload });
    } else if (editando) {
      dispatch({ type: "faq/update", payload: { id: editando, ...payload } });
    }
    fechar();
  };

  const deletar = (id: string) => {
    if (!confirm("Deletar esta pergunta?")) return;
    dispatch({ type: "faq/delete", payload: { id } });
  };

  const togglePub = (f: Faq) => {
    dispatch({ type: "faq/update", payload: { ...f, publicado: !f.publicado } });
  };

  return (
    <>
      <Topbar
        title="FAQ"
        subtitle="Perguntas frequentes exibidas na seção de FAQ do portal"
        actions={
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            <Plus className="h-4 w-4" />
            Nova pergunta
          </button>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto">
          <Link
            to="/admin/conteudo"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para conteúdo
          </Link>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-background/40">
                  <th className="py-3 pl-5 pr-4 font-semibold w-12">#</th>
                  <th className="py-3 px-4 font-semibold">Pergunta</th>
                  <th className="py-3 px-4 font-semibold w-32">Categoria</th>
                  <th className="py-3 px-4 font-semibold w-32 text-center">Publicado</th>
                  <th className="py-3 pl-4 pr-5 font-semibold w-32 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ordenados.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[13px] text-muted-foreground">
                      Nenhuma pergunta cadastrada.
                    </td>
                  </tr>
                )}
                {ordenados.map((f, i) => (
                  <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="py-4 pl-5 pr-4 text-[12px] text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="py-4 px-4">
                      <div className="text-[13px] font-semibold text-foreground leading-snug">{f.pergunta}</div>
                      <div className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">{f.resposta}</div>
                    </td>
                    <td className="py-4 px-4">
                      {f.categoria ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider text-foreground">
                          {f.categoria}
                        </span>
                      ) : (
                        <span className="text-[12px] text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => togglePub(f)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
                          f.publicado
                            ? "bg-primary/10 text-primary hover:bg-primary/15"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {f.publicado ? <><Eye className="h-3 w-3" />Publicado</> : <><EyeOff className="h-3 w-3" />Rascunho</>}
                      </button>
                    </td>
                    <td className="py-4 pl-4 pr-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => abrirEdicao(f)} aria-label="Editar" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => deletar(f.id)} aria-label="Deletar" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-[12px] text-muted-foreground">
            Apenas perguntas <strong>publicadas</strong> aparecem no portal.{" "}
            <a href="/" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-deep font-semibold inline-flex items-center gap-1">
              Abrir portal <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </main>

      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={(ev) => ev.target === ev.currentTarget && fechar()}>
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-base font-bold text-foreground">
                {editando === "novo" ? "Nova pergunta" : "Editar pergunta"}
              </h3>
              <button onClick={fechar} aria-label="Fechar" className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={salvar} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Pergunta</label>
                <input type="text" required value={form.pergunta} onChange={(e) => setForm({ ...form, pergunta: e.target.value })} placeholder="ex: Como acesso a área do investidor?" className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Resposta</label>
                <textarea required rows={4} value={form.resposta} onChange={(e) => setForm({ ...form, resposta: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Categoria (opcional)</label>
                  <input type="text" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Acesso, Resultados, Contato..." className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Ordem</label>
                  <input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </div>
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.publicado} onChange={(e) => setForm({ ...form, publicado: e.target.checked })} className="rounded border-input text-primary focus:ring-primary/30" />
                  <span className="text-[13px] text-foreground">Publicado</span>
                </label>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={fechar} className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors">
                  <Save className="h-3.5 w-3.5" />Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
