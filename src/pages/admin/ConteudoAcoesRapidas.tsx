import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import type { QuickAction } from "@/store/types";

function novo(): QuickAction {
  return {
    id: `tmp-${Math.random().toString(36).slice(2, 8)}`,
    label: "",
    href: "#",
    ordem: 0,
    visivel: true,
  };
}

export function ConteudoAcoesRapidas() {
  const { state, dispatch } = useContent();
  const [itens, setItens] = useState<QuickAction[]>(() =>
    [...state.quickActions].sort((a, b) => a.ordem - b.ordem)
  );

  const set = (i: number, patch: Partial<QuickAction>) =>
    setItens((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const mover = (i: number, dir: -1 | 1) => {
    setItens((arr) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return arr;
      const copy = [...arr];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const remover = (i: number) => setItens((arr) => arr.filter((_, idx) => idx !== i));
  const adicionar = () => setItens((arr) => [...arr, novo()]);

  const salvar = () => {
    const limpos = itens
      .filter((it) => it.label.trim())
      .map((it, ordem) => ({ ...it, label: it.label.trim(), href: it.href.trim() || "#", ordem }));
    dispatch({ type: "quickActions/save", payload: limpos });
  };

  return (
    <>
      <Topbar
        title="Ações rápidas"
        subtitle="Botões em destaque logo abaixo do hero da home"
        actions={
          <button onClick={salvar} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors">
            <Save className="h-4 w-4" />
            Salvar alterações
          </button>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1000px] mx-auto">
          <Link to="/admin/conteudo" className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para conteúdo
          </Link>

          <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            {itens.map((it, i) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir" className="h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground hover:text-primary disabled:opacity-30">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => mover(i, 1)} disabled={i === itens.length - 1} aria-label="Descer" className="h-6 w-6 inline-flex items-center justify-center rounded text-muted-foreground hover:text-primary disabled:opacity-30">
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={it.label} onChange={(e) => set(i, { label: e.target.value })} placeholder="Rótulo (ex: FAQs)" className="rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                  <input value={it.href} onChange={(e) => set(i, { href: e.target.value })} placeholder="Destino (#faqs, /demonstracoes...)" className="rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-[12px] text-foreground shrink-0">
                  <input type="checkbox" checked={it.visivel} onChange={(e) => set(i, { visivel: e.target.checked })} className="rounded border-input text-primary focus:ring-primary/30" />
                  Visível
                </label>
                <button onClick={() => remover(i)} aria-label="Remover" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            <button onClick={adicionar} className="inline-flex items-center gap-2 rounded-md border border-dashed border-border px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors">
              <Plus className="h-4 w-4" />
              Adicionar ação
            </button>
          </div>

          <p className="mt-6 text-[12px] text-muted-foreground">
            <a href="/" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-deep font-semibold inline-flex items-center gap-1">
              Abrir portal <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
