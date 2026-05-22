import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  FileText,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import {
  CATEGORIA_DOC_LABEL,
  type CategoriaDoc,
  type Documento,
} from "@/store/types";
import { cn } from "@/lib/utils";

const CATEGORIAS: CategoriaDoc[] = [
  "release",
  "apresentacao",
  "demonstracao",
  "ata",
  "regulamento",
  "fato_relevante",
  "comunicado",
  "formulario",
  "outro",
];

interface FormState {
  titulo: string;
  categoria: CategoriaDoc;
  periodo: string;
  arquivo: string;
  tamanho: number;
  dataPublicacao: string;
  publico: boolean;
  tag: string;
}

const EMPTY: FormState = {
  titulo: "",
  categoria: "release",
  periodo: "",
  arquivo: "",
  tamanho: 0,
  dataPublicacao: new Date().toISOString().slice(0, 10),
  publico: true,
  tag: "",
};

function fmtBytes(n?: number) {
  if (!n) return "—";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function fmtData(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

export function ConteudoDocumentos() {
  const { state, dispatch } = useContent();
  const fileRef = useRef<HTMLInputElement>(null);
  const [editando, setEditando] = useState<string | "novo" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [filtroCat, setFiltroCat] = useState<CategoriaDoc | "todos">("todos");

  const docs = useMemo(() => {
    const base = [...state.documentos].sort((a, b) =>
      b.dataPublicacao.localeCompare(a.dataPublicacao)
    );
    return filtroCat === "todos"
      ? base
      : base.filter((d) => d.categoria === filtroCat);
  }, [state.documentos, filtroCat]);

  const abrirNovo = () => {
    setForm(EMPTY);
    setEditando("novo");
  };

  const abrirEdicao = (d: Documento) => {
    setForm({
      titulo: d.titulo,
      categoria: d.categoria,
      periodo: d.periodo ?? "",
      arquivo: d.arquivo,
      tamanho: d.tamanho ?? 0,
      dataPublicacao: d.dataPublicacao,
      publico: d.publico,
      tag: d.tag ?? "",
    });
    setEditando(d.id);
  };

  const fechar = () => {
    setEditando(null);
    setForm(EMPTY);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({
      ...f,
      arquivo: file.name,
      tamanho: file.size,
      titulo: f.titulo || file.name.replace(/\.[^.]+$/, ""),
    }));
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      titulo: form.titulo.trim(),
      categoria: form.categoria,
      periodo: form.periodo.trim() || undefined,
      arquivo: form.arquivo.trim() || "documento-sem-arquivo.pdf",
      tamanho: form.tamanho || undefined,
      dataPublicacao: form.dataPublicacao,
      publico: form.publico,
      tag: form.tag.trim() || undefined,
    };
    if (editando === "novo") {
      dispatch({ type: "documento/create", payload });
    } else if (editando) {
      dispatch({
        type: "documento/update",
        payload: { id: editando, ...payload },
      });
    }
    fechar();
  };

  const deletar = (id: string) => {
    if (!confirm("Deletar este documento? Comunicados vinculados perdem o link."))
      return;
    dispatch({ type: "documento/delete", payload: { id } });
  };

  const togglePub = (d: Documento) => {
    dispatch({
      type: "documento/update",
      payload: { ...d, publico: !d.publico },
    });
  };

  return (
    <>
      <Topbar
        title="Documentos"
        subtitle="Repositório central — todos os arquivos disponíveis para vincular em comunicados e Kit do Investidor"
        actions={
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo documento
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

          {/* Filtros */}
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              Filtrar por categoria
            </div>
            <button
              onClick={() => setFiltroCat("todos")}
              className={cn(
                "px-3 py-1 rounded-full text-[11px] font-semibold transition-colors",
                filtroCat === "todos"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:border-primary/40"
              )}
            >
              Todos ({state.documentos.length})
            </button>
            {CATEGORIAS.map((cat) => {
              const count = state.documentos.filter(
                (d) => d.categoria === cat
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat}
                  onClick={() => setFiltroCat(cat)}
                  className={cn(
                    "px-3 py-1 rounded-full text-[11px] font-semibold transition-colors",
                    filtroCat === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:border-primary/40"
                  )}
                >
                  {CATEGORIA_DOC_LABEL[cat]} ({count})
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-background/40">
                    <th className="py-3 pl-5 pr-4 font-semibold">Documento</th>
                    <th className="py-3 px-4 font-semibold w-40">Categoria</th>
                    <th className="py-3 px-4 font-semibold w-24">Período</th>
                    <th className="py-3 px-4 font-semibold w-28 text-right">
                      Tamanho
                    </th>
                    <th className="py-3 px-4 font-semibold w-28">Publicado</th>
                    <th className="py-3 px-4 font-semibold w-28 text-center">
                      Visibilidade
                    </th>
                    <th className="py-3 pl-4 pr-5 font-semibold w-28 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {docs.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-[13px] text-muted-foreground"
                      >
                        Nenhum documento encontrado.
                      </td>
                    </tr>
                  )}
                  {docs.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-4 pl-5 pr-4">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-foreground leading-snug">
                              {d.titulo}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                              {d.arquivo}
                            </div>
                            {d.tag && (
                              <span className="mt-1.5 inline-flex items-center px-1.5 py-0.5 rounded bg-muted text-[10px] font-semibold uppercase tracking-wider text-foreground">
                                #{d.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider text-foreground">
                          {CATEGORIA_DOC_LABEL[d.categoria]}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[12px] text-muted-foreground tabular-nums">
                        {d.periodo ?? "—"}
                      </td>
                      <td className="py-4 px-4 text-[12px] text-muted-foreground text-right tabular-nums">
                        {fmtBytes(d.tamanho)}
                      </td>
                      <td className="py-4 px-4 text-[12px] text-muted-foreground tabular-nums">
                        {fmtData(d.dataPublicacao)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePub(d)}
                          aria-label="Alternar visibilidade"
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
                            d.publico
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {d.publico ? (
                            <>
                              <Eye className="h-3 w-3" />
                              Público
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3" />
                              Restrito
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 pl-4 pr-5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => abrirEdicao(d)}
                            aria-label="Editar"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deletar(d.id)}
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

          <div className="mt-6 rounded-lg border border-warning/30 bg-warning/5 p-4 text-[12px] text-foreground">
            <strong>Modo mock:</strong> os arquivos selecionados aqui ficam só
            como metadados (nome + tamanho). O conteúdo binário do PDF ainda
            não é armazenado — isso vem com o backend (S3/R2).
          </div>
        </div>
      </main>

      {editando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && fechar()}
        >
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {editando === "novo" ? "Novo documento" : "Editar documento"}
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Documentos podem ser vinculados a Comunicados e ao Kit do
                  Investidor
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
              {/* Upload area */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Arquivo
                </label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-md border-2 border-dashed border-border bg-background px-5 py-6 hover:border-primary/40 hover:bg-primary/5 transition-colors flex items-center gap-4 text-left"
                >
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {form.arquivo ? (
                      <>
                        <div className="text-[13px] font-semibold text-foreground truncate">
                          {form.arquivo}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {fmtBytes(form.tamanho)} — clique para trocar
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[13px] font-semibold text-foreground">
                          Clique para selecionar um arquivo
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          PDF, XLSX, DOCX — qualquer formato
                        </div>
                      </>
                    )}
                  </div>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  onChange={onSelectFile}
                  className="hidden"
                />
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
                  placeholder="ex: Release de Resultados 1T26"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Categoria
                  </label>
                  <select
                    value={form.categoria}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoria: e.target.value as CategoriaDoc,
                      })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    {CATEGORIAS.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORIA_DOC_LABEL[c]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Período (opcional)
                  </label>
                  <input
                    type="text"
                    value={form.periodo}
                    onChange={(e) =>
                      setForm({ ...form, periodo: e.target.value })
                    }
                    placeholder="1T26, 4T25, 2025-Anual"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Data de publicação
                  </label>
                  <input
                    type="date"
                    required
                    value={form.dataPublicacao}
                    onChange={(e) =>
                      setForm({ ...form, dataPublicacao: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Tag livre (opcional)
                </label>
                <input
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="ex: ESG, Reestruturação, FIDC"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.publico}
                    onChange={(e) =>
                      setForm({ ...form, publico: e.target.checked })
                    }
                    className="rounded border-input text-primary focus:ring-primary/30"
                  />
                  <span className="text-[13px] text-foreground">
                    Público (qualquer visitante pode baixar)
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
