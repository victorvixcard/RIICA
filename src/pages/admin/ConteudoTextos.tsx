// Editor de textos institucionais — atualmente cobre só o Hero da home.
// (Os campos `purpose`, `kpis` e `ticker` continuam no banco para compatibilidade,
//  mas não estão visíveis no portal hoje. Quando voltarem a aparecer numa seção,
//  basta restaurar as abas correspondentes.)
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import type { TextosInstitucionais } from "@/store/types";

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export function ConteudoTextos() {
  const { state, dispatch } = useContent();
  const [textos, setTextos] = useState<TextosInstitucionais>(state.textos);
  const [dirty, setDirty] = useState(false);

  const setHero = (patch: Partial<TextosInstitucionais["hero"]>) => {
    setTextos((t) => ({ ...t, hero: { ...t.hero, ...patch } }));
    setDirty(true);
  };

  const salvar = () => {
    dispatch({ type: "textos/update", payload: textos });
    setDirty(false);
  };

  const reset = () => {
    setTextos(state.textos);
    setDirty(false);
  };

  return (
    <>
      <Topbar
        title="Textos institucionais"
        subtitle="Edite o título, descrição e eyebrow do Hero da home"
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
        <div className="max-w-[1100px] mx-auto">
          <Link
            to="/admin/conteudo"
            className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para conteúdo
          </Link>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-border">
              <span className="h-px w-8 bg-primary" />
              <h2 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                Hero da home
              </h2>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Eyebrow (texto pequeno acima do título — opcional)
              </label>
              <input
                type="text"
                value={textos.hero.eyebrow}
                onChange={(e) => setHero({ eyebrow: e.target.value })}
                placeholder="Deixe vazio pra esconder"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Título — Linha 1 (preto)
                </label>
                <input
                  type="text"
                  value={textos.hero.tituloLinha1}
                  onChange={(e) => setHero({ tituloLinha1: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Título — Linha 2 (verde gradient)
                </label>
                <input
                  type="text"
                  value={textos.hero.tituloLinha2}
                  onChange={(e) => setHero({ tituloLinha2: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Descrição (parágrafo abaixo do título)
              </label>
              <textarea
                rows={3}
                value={textos.hero.descricao}
                onChange={(e) => setHero({ descricao: e.target.value })}
                className={`${inputCls} resize-none`}
              />
            </div>

            <p className="text-[11px] text-muted-foreground pt-2 border-t border-border">
              As CTAs do hero foram removidas na última iteração do portal. Os
              campos <code>ctaLabel</code> e <code>ctaSecundarioLabel</code>
              continuam no banco para compatibilidade.
            </p>
          </div>

          <p className="mt-6 text-[12px] text-muted-foreground">
            Salve as alterações pra ver refletindo em{" "}
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
    </>
  );
}
