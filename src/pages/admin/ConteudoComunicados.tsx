import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Save,
  X,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import type { Comunicado } from "@/store/types";
import { cn } from "@/lib/utils";

interface FormState {
  data: string;
  titulo: string;
  resumo: string;
  documentoId: string;
  link: string;
  destaque: boolean;
  publicado: boolean;
}

const EMPTY_FORM: FormState = {
  data: new Date().toISOString().slice(0, 10),
  titulo: "",
  resumo: "",
  documentoId: "",
  link: "",
  destaque: true,
  publicado: true,
};

function formatDataBR(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

export function ConteudoComunicados() {
  const { state, dispatch } = useContent();
  const [editando, setEditando] = useState<string | "novo" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const comunicadosOrdenados = [...state.comunicados].sort((a, b) =>
    b.data.localeCompare(a.data)
  );

  const abrirNovo = () => {
    setForm(EMPTY_FORM);
    setEditando("novo");
  };

  const abrirEdicao = (c: Comunicado) => {
    setForm({
      data: c.data,
      titulo: c.titulo,
      resumo: c.resumo ?? "",
      documentoId: c.documentoId ?? "",
      link: c.link ?? "",
      destaque: c.destaque,
      publicado: c.publicado,
    });
    setEditando(c.id);
  };

  const fechar = () => {
    setEditando(null);
    setForm(EMPTY_FORM);
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      data: form.data,
      titulo: form.titulo.trim(),
      resumo: form.resumo.trim() || undefined,
      documentoId: form.documentoId || undefined,
      link: form.link.trim() || undefined,
      destaque: form.destaque,
      publicado: form.publicado,
    };
    if (editando === "novo") {
      dispatch({ type: "comunicado/create", payload });
    } else if (editando) {
      dispatch({
        type: "comunicado/update",
        payload: { id: editando, ...payload },
      });
    }
    fechar();
  };

  const deletar = (id: string) => {
    if (!confirm("Deletar este comunicado?")) return;
    dispatch({ type: "comunicado/delete", payload: { id } });
  };

  const togglePublicado = (c: Comunicado) => {
    dispatch({
      type: "comunicado/update",
      payload: { ...c, publicado: !c.publicado },
    });
  };

  const toggleDestaque = (c: Comunicado) => {
    dispatch({
      type: "comunicado/update",
      payload: { ...c, destaque: !c.destaque },
    });
  };

  return (
    <>
      <Topbar
        title="Comunicados"
        subtitle="Lista de últimas atualizações exibidas na home do portal R.I."
        actions={
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo comunicado
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-background/40">
                    <th className="py-3 pl-5 pr-4 font-semibold w-32">Data</th>
                    <th className="py-3 px-4 font-semibold">Título</th>
                    <th className="py-3 px-4 font-semibold w-32 text-center">
                      Destaque
                    </th>
                    <th className="py-3 px-4 font-semibold w-32 text-center">
                      Publicado
                    </th>
                    <th className="py-3 pl-4 pr-5 font-semibold w-32 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comunicadosOrdenados.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-[13px] text-muted-foreground"
                      >
                        Nenhum comunicado cadastrado. Clique em "Novo
                        comunicado" pra começar.
                      </td>
                    </tr>
                  )}
                  {comunicadosOrdenados.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-4 pl-5 pr-4 text-[12px] font-semibold text-primary tabular-nums">
                        {formatDataBR(c.data)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-[13px] font-semibold text-foreground leading-snug">
                          {c.titulo}
                        </div>
                        {c.resumo && (
                          <div className="text-[12px] text-muted-foreground line-clamp-1 mt-0.5">
                            {c.resumo}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleDestaque(c)}
                          aria-label="Alternar destaque"
                          className={cn(
                            "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
                            c.destaque
                              ? "text-primary hover:bg-primary/10"
                              : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {c.destaque ? (
                            <Star className="h-4 w-4 fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePublicado(c)}
                          aria-label="Alternar publicação"
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
                            c.publicado
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {c.publicado ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Publicado
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Rascunho
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 pl-4 pr-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => abrirEdicao(c)}
                            aria-label="Editar"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deletar(c.id)}
                            aria-label="Deletar"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-[12px] text-muted-foreground">
            Apenas comunicados com <strong>publicado + destaque</strong>{" "}
            aparecem em "Últimas Atualizações" na home. Para conferir,{" "}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-deep font-semibold inline-flex items-center gap-1"
            >
              abra o portal numa nova aba
              <ExternalLink className="h-3 w-3" />
            </a>
            .
          </p>
        </div>
      </main>

      {/* Modal edição */}
      {editando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && fechar()}
        >
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {editando === "novo" ? "Novo comunicado" : "Editar comunicado"}
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Aparece em "Últimas Atualizações" no portal
                </p>
              </div>
              <button
                onClick={fechar}
                aria-label="Fechar"
                className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={salvar} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    required
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    required
                    value={form.titulo}
                    onChange={(e) =>
                      setForm({ ...form, titulo: e.target.value })
                    }
                    placeholder="Ex: Grupo ICA divulga resultados do 1T26"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Resumo (opcional)
                </label>
                <textarea
                  rows={2}
                  value={form.resumo}
                  onChange={(e) =>
                    setForm({ ...form, resumo: e.target.value })
                  }
                  placeholder="Frase curta de contexto que aparece abaixo do título"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Documento vinculado (opcional)
                  </label>
                  <select
                    value={form.documentoId}
                    onChange={(e) =>
                      setForm({ ...form, documentoId: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="">— Nenhum —</option>
                    {state.documentos.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.titulo}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Link externo (opcional)
                  </label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    placeholder="https://..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.publicado}
                    onChange={(e) =>
                      setForm({ ...form, publicado: e.target.checked })
                    }
                    className="rounded border-input text-primary focus:ring-primary/30"
                  />
                  <span className="text-[13px] text-foreground">
                    Publicado
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.destaque}
                    onChange={(e) =>
                      setForm({ ...form, destaque: e.target.checked })
                    }
                    className="rounded border-input text-primary focus:ring-primary/30"
                  />
                  <span className="text-[13px] text-foreground">
                    Mostrar em destaque na home
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={fechar}
                  className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
                >
                  <Save className="h-3.5 w-3.5" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
