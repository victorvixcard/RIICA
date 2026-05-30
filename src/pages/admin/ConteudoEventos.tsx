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
  MapPin,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import type { Evento, TipoEvento } from "@/store/types";
import { cn } from "@/lib/utils";

const TIPOS: TipoEvento[] = [
  "Conferência",
  "Presencial",
  "Virtual",
  "APIMEC",
  "Investor Day",
  "Assembleia",
];

interface FormState {
  data: string;
  hora: string;
  titulo: string;
  tipo: TipoEvento;
  local: string;
  linkInscricao: string;
  publicado: boolean;
}

const EMPTY: FormState = {
  data: new Date().toISOString().slice(0, 10),
  hora: "10h00",
  titulo: "",
  tipo: "Conferência",
  local: "",
  linkInscricao: "",
  publicado: true,
};

function fmt(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

function isFuture(iso: string) {
  return iso >= new Date().toISOString().slice(0, 10);
}

export function ConteudoEventos() {
  const { state, dispatch } = useContent();
  const [editando, setEditando] = useState<string | "novo" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  const ordenados = [...state.eventos].sort((a, b) =>
    a.data.localeCompare(b.data)
  );

  const abrirNovo = () => {
    setForm(EMPTY);
    setEditando("novo");
  };

  const abrirEdicao = (e: Evento) => {
    setForm({
      data: e.data,
      hora: e.hora,
      titulo: e.titulo,
      tipo: e.tipo,
      local: e.local ?? "",
      linkInscricao: e.linkInscricao ?? "",
      publicado: e.publicado,
    });
    setEditando(e.id);
  };

  const fechar = () => {
    setEditando(null);
    setForm(EMPTY);
  };

  const salvar = (ev: React.FormEvent) => {
    ev.preventDefault();
    const payload = {
      data: form.data,
      hora: form.hora.trim(),
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      local: form.local.trim() || undefined,
      linkInscricao: form.linkInscricao.trim() || undefined,
      publicado: form.publicado,
    };
    if (editando === "novo") {
      dispatch({ type: "evento/create", payload });
    } else if (editando) {
      dispatch({
        type: "evento/update",
        payload: { id: editando, ...payload },
      });
    }
    fechar();
  };

  const deletar = (id: string) => {
    if (!confirm("Deletar este evento?")) return;
    dispatch({ type: "evento/delete", payload: { id } });
  };

  const togglePub = (e: Evento) => {
    dispatch({
      type: "evento/update",
      payload: { ...e, publicado: !e.publicado },
    });
  };

  return (
    <>
      <Topbar
        title="Eventos"
        subtitle="Agenda do investidor — teleconferências, APIMECs, Investor Day, assembleias"
        actions={
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo evento
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
                    <th className="py-3 pl-5 pr-4 font-semibold w-36">Data</th>
                    <th className="py-3 px-4 font-semibold">Evento</th>
                    <th className="py-3 px-4 font-semibold w-32">Tipo</th>
                    <th className="py-3 px-4 font-semibold w-32 text-center">
                      Publicado
                    </th>
                    <th className="py-3 pl-4 pr-5 font-semibold w-32 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ordenados.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-16 text-center text-[13px] text-muted-foreground"
                      >
                        Nenhum evento cadastrado.
                      </td>
                    </tr>
                  )}
                  {ordenados.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-4 pl-5 pr-4">
                        <div className="text-[12px] font-bold text-primary tabular-nums">
                          {fmt(e.data)}
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          {e.hora}
                          {!isFuture(e.data) && (
                            <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-[9px] font-bold uppercase">
                              Passado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-[13px] font-semibold text-foreground leading-snug">
                          {e.titulo}
                        </div>
                        {e.local && (
                          <div className="text-[12px] text-muted-foreground mt-0.5 inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {e.local}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider text-foreground">
                          {e.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePub(e)}
                          aria-label="Alternar publicação"
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
                            e.publicado
                              ? "bg-primary/10 text-primary hover:bg-primary/15"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          )}
                        >
                          {e.publicado ? (
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
                            onClick={() => abrirEdicao(e)}
                            aria-label="Editar"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deletar(e.id)}
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
            Apenas eventos <strong>publicados e futuros</strong> aparecem em
            "Próximos Eventos" na home.{" "}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-deep font-semibold inline-flex items-center gap-1"
            >
              Abrir portal <ExternalLink className="h-3 w-3" />
            </a>
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
              <div>
                <h3 className="font-display text-base font-bold text-foreground">
                  {editando === "novo" ? "Novo evento" : "Editar evento"}
                </h3>
                <p className="text-[12px] text-muted-foreground">
                  Aparece em "Próximos Eventos" no portal se estiver no futuro
                  e publicado
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
                    Horário
                  </label>
                  <input
                    type="text"
                    required
                    value={form.hora}
                    onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    placeholder='ex: 10h00 ou "Dia todo"'
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Tipo
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) =>
                      setForm({ ...form, tipo: e.target.value as TipoEvento })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  >
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
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
                  onChange={(e) =>
                    setForm({ ...form, titulo: e.target.value })
                  }
                  placeholder="ex: Teleconferência de Resultados 1T26"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Local (opcional)
                  </label>
                  <input
                    type="text"
                    value={form.local}
                    onChange={(e) =>
                      setForm({ ...form, local: e.target.value })
                    }
                    placeholder="Vitória/ES, Online, São Paulo/SP..."
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Link de inscrição (opcional)
                  </label>
                  <input
                    type="url"
                    value={form.linkInscricao}
                    onChange={(e) =>
                      setForm({ ...form, linkInscricao: e.target.value })
                    }
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
                  <span className="text-[13px] text-foreground">Publicado</span>
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
