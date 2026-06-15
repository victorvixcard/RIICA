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
import { UploadArquivo } from "@/components/admin/UploadArquivo";
import { pathDeUrlPublica } from "@/lib/api/storage";
import { useContent } from "@/store/content";
import type { Comunicado } from "@/store/types";
import { cn } from "@/lib/utils";

interface FormState {
  data: string;
  tag: string;
  titulo: string;
  resumo: string;
  link: string;
  ordem: number;
  publicado: boolean;
}

const TAGS_SUGERIDAS = [
  "COMUNICADO",
  "COMUNICADO OFICIAL",
  "AVISO AO MERCADO",
  "RESULTADOS",
  "DIVIDENDOS",
  "ATA SOCIETÁRIA",
  "ASSEMBLEIA GERAL EXTRAORDINÁRIA",
  "ASSEMBLEIA GERAL ORDINÁRIA",
];

const EMPTY: FormState = {
  data: new Date().toISOString().slice(0, 10),
  tag: "COMUNICADO",
  titulo: "",
  resumo: "",
  link: "",
  ordem: 0,
  publicado: true,
};

export function ConteudoComunicados() {
  const { state, dispatch } = useContent();
  const [editando, setEditando] = useState<string | "novo" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const ordenados = [...state.comunicados].sort((a, b) => {
    const cmp = b.data.localeCompare(a.data);
    return cmp !== 0 ? cmp : a.ordem - b.ordem;
  });

  const abrirNovo = () => {
    setForm({ ...EMPTY, ordem: state.comunicados.length });
    setEditando("novo");
  };

  const abrirEdicao = (c: Comunicado) => {
    setForm({
      data: c.data,
      tag: c.tag,
      titulo: c.titulo,
      resumo: c.resumo ?? "",
      link: c.link ?? "",
      ordem: c.ordem,
      publicado: c.publicado,
    });
    setEditando(c.id);
  };

  const fechar = () => {
    setEditando(null);
    setForm(EMPTY);
  };

  const salvar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const payload = {
      data: form.data,
      tag: form.tag.trim() || "COMUNICADO",
      titulo: form.titulo.trim(),
      resumo: form.resumo.trim() || undefined,
      link: form.link.trim() || undefined,
      ordem: form.ordem,
      publicado: form.publicado,
      destaque: false,
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

  const togglePub = (c: Comunicado) => {
    dispatch({
      type: "comunicado/update",
      payload: { ...c, publicado: !c.publicado },
    });
  };

  const formatData = (iso: string) => {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      <Topbar
        title="Comunicados"
        subtitle="Comunicados oficiais e avisos ao mercado exibidos na página /comunicados"
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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-background/40">
                  <th className="py-3 pl-5 pr-4 font-semibold w-28">Data</th>
                  <th className="py-3 px-4 font-semibold w-48">Categoria</th>
                  <th className="py-3 px-4 font-semibold">Título</th>
                  <th className="py-3 px-4 font-semibold w-20 text-center">Link</th>
                  <th className="py-3 px-4 font-semibold w-32 text-center">Publicado</th>
                  <th className="py-3 pl-4 pr-5 font-semibold w-32 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ordenados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-[13px] text-muted-foreground">
                      Nenhum comunicado cadastrado ainda.
                    </td>
                  </tr>
                )}
                {ordenados.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-4 pl-5 pr-4 text-[12px] text-foreground tabular-nums">
                      {formatData(c.data)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider text-foreground">
                        {c.tag}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[13px] font-semibold text-foreground leading-snug">
                        {c.titulo}
                      </div>
                      {c.resumo && (
                        <div className="text-[12px] text-muted-foreground mt-0.5 line-clamp-1">
                          {c.resumo}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {c.link ? (
                        <a
                          href={c.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-7 w-7 rounded-md text-primary hover:bg-primary/10 transition-colors"
                          title={c.link}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span className="text-[12px] text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => togglePub(c)}
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

          <p className="mt-6 text-[12px] text-muted-foreground">
            Apenas itens <strong>publicados</strong> aparecerão na página pública
            de Comunicados.
          </p>
        </div>
      </main>

      {editando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={(ev) => ev.target === ev.currentTarget && fechar()}
        >
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-base font-bold text-foreground">
                {editando === "novo" ? "Novo comunicado" : "Editar comunicado"}
              </h3>
              <button
                onClick={fechar}
                aria-label="Fechar"
                className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={salvar} className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4">
                <div>
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
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Categoria / Tag
                  </label>
                  <input
                    type="text"
                    required
                    list="tags-comunicados"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                    placeholder="Ex: COMUNICADO OFICIAL"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                  <datalist id="tags-comunicados">
                    {TAGS_SUGERIDAS.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Grupo ICA divulga resultados do 1T26"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Resumo (opcional)
                </label>
                <textarea
                  rows={5}
                  value={form.resumo}
                  onChange={(e) => setForm({ ...form, resumo: e.target.value })}
                  placeholder={"Descrição exibida abaixo do título.\n\nPara separar parágrafos, deixe uma linha em branco entre eles (pressione Enter duas vezes)."}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-y leading-relaxed"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Quebra dupla de linha (<kbd className="px-1 py-0.5 rounded bg-muted text-foreground/80 font-mono text-[10px]">Enter</kbd>{" "}
                  <kbd className="px-1 py-0.5 rounded bg-muted text-foreground/80 font-mono text-[10px]">Enter</kbd>) cria parágrafo separado na página.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Link (URL externa ou PDF)
                </label>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Quando preenchido, o card vira um hiperlink na página /comunicados.
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    ou anexe um PDF para download
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="mt-3">
                  <UploadArquivo
                    value={pathDeUrlPublica(form.link) ? form.link : undefined}
                    prefix="comunicados"
                    onUploaded={(r) => setForm({ ...form, link: r.url })}
                    onClear={() => setForm({ ...form, link: "" })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Ordem (desempate)
                  </label>
                  <input
                    type="number"
                    value={form.ordem}
                    onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={form.publicado}
                      onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
                      className="rounded border-input text-primary focus:ring-primary/30"
                    />
                    <span className="text-[13px] text-foreground">Publicado</span>
                  </label>
                </div>
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
