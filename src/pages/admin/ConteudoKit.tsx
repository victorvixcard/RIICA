import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  ExternalLink,
  FileText,
  Plus,
  Trash2,
  GripVertical,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import { CATEGORIA_DOC_LABEL } from "@/store/types";

function genLinkId() {
  return `la-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 5)}`;
}

export function ConteudoKit() {
  const { state, dispatch } = useContent();
  const [trimestre, setTrimestre] = useState(state.kitAtual.trimestre);
  const [ano, setAno] = useState(state.kitAtual.ano);
  const [destaquesIds, setDestaquesIds] = useState<string[]>(
    state.kitAtual.documentosDestaqueIds
  );
  const [linksAux, setLinksAux] = useState(state.kitAtual.linksAuxiliares);
  const [dirty, setDirty] = useState(false);

  const toggleDoc = (id: string) => {
    setDirty(true);
    setDestaquesIds((arr) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    );
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setDirty(true);
    setDestaquesIds((arr) => {
      const next = [...arr];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    if (idx === destaquesIds.length - 1) return;
    setDirty(true);
    setDestaquesIds((arr) => {
      const next = [...arr];
      [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      return next;
    });
  };

  const addLink = () => {
    setDirty(true);
    setLinksAux((arr) => [...arr, { id: genLinkId(), label: "", url: "" }]);
  };

  const updateLink = (id: string, patch: Partial<{ label: string; url: string }>) => {
    setDirty(true);
    setLinksAux((arr) =>
      arr.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  };

  const removeLink = (id: string) => {
    setDirty(true);
    setLinksAux((arr) => arr.filter((l) => l.id !== id));
  };

  const salvar = () => {
    dispatch({
      type: "kit/update",
      payload: {
        trimestre: trimestre.trim(),
        ano,
        documentosDestaqueIds: destaquesIds,
        linksAuxiliares: linksAux.filter((l) => l.label.trim()),
      },
    });
    setDirty(false);
  };

  const reset = () => {
    setTrimestre(state.kitAtual.trimestre);
    setAno(state.kitAtual.ano);
    setDestaquesIds(state.kitAtual.documentosDestaqueIds);
    setLinksAux(state.kitAtual.linksAuxiliares);
    setDirty(false);
  };

  const docsSelecionados = destaquesIds
    .map((id) => state.documentos.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
  const docsDisponiveis = state.documentos.filter(
    (d) => !destaquesIds.includes(d.id)
  );

  return (
    <>
      <Topbar
        title="Kit do Investidor"
        subtitle="Configure o trimestre atual, documentos em destaque e links auxiliares"
        actions={
          <div className="flex items-center gap-2">
            {dirty && (
              <button
                onClick={reset}
                className="px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Descartar
              </button>
            )}
            <button
              onClick={salvar}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              Salvar alterações
            </button>
          </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Coluna principal */}
            <div className="space-y-6">
              {/* Trimestre */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-primary border-l-2 border-primary pl-3">
                  Período atual
                </h2>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Trimestre (texto livre)
                    </label>
                    <input
                      type="text"
                      value={trimestre}
                      onChange={(e) => {
                        setTrimestre(e.target.value);
                        setDirty(true);
                      }}
                      placeholder="ex: 1T26, 4T25, 2025-Anual"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Aparece em destaque no Kit do Investidor na home
                    </p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Ano
                    </label>
                    <input
                      type="number"
                      value={ano}
                      onChange={(e) => {
                        setAno(Number(e.target.value));
                        setDirty(true);
                      }}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </div>
                </div>
              </div>

              {/* Documentos em destaque */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-primary border-l-2 border-primary pl-3">
                    Documentos em destaque
                  </h2>
                  <span className="text-[11px] text-muted-foreground">
                    {destaquesIds.length} selecionados — recomendado 3
                  </span>
                </div>

                {docsSelecionados.length === 0 ? (
                  <p className="mt-6 text-[13px] text-muted-foreground italic">
                    Nenhum documento selecionado ainda. Escolha abaixo.
                  </p>
                ) : (
                  <ul className="mt-5 space-y-2">
                    {docsSelecionados.map((d, idx) => (
                      <li
                        key={d.id}
                        className="flex items-center gap-3 p-3 rounded-md border border-border bg-background"
                      >
                        <button
                          onClick={() => moveUp(idx)}
                          disabled={idx === 0}
                          aria-label="Mover para cima"
                          className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-30 hover:bg-muted transition-colors"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveDown(idx)}
                          disabled={idx === destaquesIds.length - 1}
                          aria-label="Mover para baixo"
                          className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-primary disabled:opacity-30 hover:bg-muted transition-colors"
                        >
                          ↓
                        </button>
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-foreground truncate">
                            {d.titulo}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {CATEGORIA_DOC_LABEL[d.categoria]}
                            {d.periodo ? ` · ${d.periodo}` : ""}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleDoc(d.id)}
                          className="text-[11px] font-semibold text-muted-foreground hover:text-destructive transition-colors px-2 py-1"
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 pt-5 border-t border-border">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Documentos disponíveis no repositório
                  </div>
                  {docsDisponiveis.length === 0 ? (
                    <p className="text-[12px] text-muted-foreground italic">
                      Todos os documentos já estão em destaque.
                    </p>
                  ) : (
                    <ul className="space-y-1.5">
                      {docsDisponiveis.map((d) => (
                        <li key={d.id}>
                          <button
                            onClick={() => toggleDoc(d.id)}
                            className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-muted text-left transition-colors group"
                          >
                            <div className="h-7 w-7 rounded border border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary">
                              <Plus className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] text-foreground truncate">
                                {d.titulo}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {CATEGORIA_DOC_LABEL[d.categoria]}
                                {d.periodo ? ` · ${d.periodo}` : ""}
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Links auxiliares */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-primary border-l-2 border-primary pl-3">
                      Links auxiliares
                    </h2>
                    <p className="mt-1 text-[11px] text-muted-foreground pl-4">
                      Aparecem como "/" separados abaixo dos documentos (20-F,
                      Apresentação Institucional, Planilha)
                    </p>
                  </div>
                  <button
                    onClick={addLink}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar link
                  </button>
                </div>

                {linksAux.length === 0 ? (
                  <p className="mt-5 text-[13px] text-muted-foreground italic">
                    Nenhum link auxiliar configurado.
                  </p>
                ) : (
                  <ul className="mt-5 space-y-2">
                    {linksAux.map((link) => (
                      <li
                        key={link.id}
                        className="flex items-center gap-3 p-3 rounded-md border border-border bg-background"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) =>
                            updateLink(link.id, { label: e.target.value })
                          }
                          placeholder="Label do link"
                          className="flex-1 min-w-0 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) =>
                            updateLink(link.id, { url: e.target.value })
                          }
                          placeholder="URL"
                          className="flex-[2] min-w-0 bg-transparent text-[13px] text-muted-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary"
                        />
                        <button
                          onClick={() => removeLink(link.id)}
                          aria-label="Remover"
                          className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Preview lateral */}
            <div className="lg:sticky lg:top-20 self-start">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                  Preview · Kit do Investidor
                </div>
                <div className="rounded-lg border border-border bg-background p-5">
                  <div className="flex items-start gap-5">
                    <div className="flex flex-col items-center">
                      <span className="font-display text-4xl font-extrabold text-gradient-primary leading-none">
                        {trimestre || "?T??"}
                      </span>
                      <div className="mt-3 h-10 w-px bg-primary/30" />
                    </div>
                    <ul className="flex-1 space-y-2 pt-1">
                      {docsSelecionados.length === 0 ? (
                        <li className="text-[12px] text-muted-foreground italic">
                          Sem documentos selecionados
                        </li>
                      ) : (
                        docsSelecionados.map((d) => (
                          <li
                            key={d.id}
                            className="flex items-center gap-2 text-[12px] text-foreground"
                          >
                            <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">{d.titulo}</span>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  {linksAux.filter((l) => l.label.trim()).length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
                      {linksAux
                        .filter((l) => l.label.trim())
                        .map((l, i, arr) => (
                          <span key={l.id} className="flex items-center gap-x-2">
                            <span className="text-primary">{l.label}</span>
                            {i < arr.length - 1 && (
                              <span className="text-border">/</span>
                            )}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Salve as alterações pra ver refletindo em{" "}
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary-deep inline-flex items-center gap-1"
                  >
                    ri.grupoica.com.br <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
