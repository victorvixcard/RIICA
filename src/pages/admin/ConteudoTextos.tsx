import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  GripVertical,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import type {
  Kpi,
  TextosInstitucionais,
  TickerSimbolo,
} from "@/store/types";

type Aba = "hero" | "purpose" | "kpis" | "ticker";

const ABAS: { id: Aba; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "purpose", label: "Propósito" },
  { id: "kpis", label: "KPIs (Grupo em números)" },
  { id: "ticker", label: "Ticker de cotações" },
];

function genId(p: string) {
  return `${p}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 5)}`;
}

export function ConteudoTextos() {
  const { state, dispatch } = useContent();
  const [aba, setAba] = useState<Aba>("hero");
  const [textos, setTextos] = useState<TextosInstitucionais>(state.textos);
  const [dirty, setDirty] = useState(false);

  const setHero = (patch: Partial<TextosInstitucionais["hero"]>) => {
    setTextos((t) => ({ ...t, hero: { ...t.hero, ...patch } }));
    setDirty(true);
  };
  const setPurpose = (patch: Partial<TextosInstitucionais["purpose"]>) => {
    setTextos((t) => ({ ...t, purpose: { ...t.purpose, ...patch } }));
    setDirty(true);
  };

  const updateKpi = (id: string, patch: Partial<Kpi>) => {
    setTextos((t) => ({
      ...t,
      kpis: t.kpis.map((k) => (k.id === id ? { ...k, ...patch } : k)),
    }));
    setDirty(true);
  };
  const addKpi = () => {
    setTextos((t) => ({
      ...t,
      kpis: [...t.kpis, { id: genId("kpi"), valor: "", label: "" }],
    }));
    setDirty(true);
  };
  const removeKpi = (id: string) => {
    setTextos((t) => ({
      ...t,
      kpis: t.kpis.filter((k) => k.id !== id),
    }));
    setDirty(true);
  };

  const updateTk = (id: string, patch: Partial<TickerSimbolo>) => {
    setTextos((t) => ({
      ...t,
      ticker: t.ticker.map((tk) => (tk.id === id ? { ...tk, ...patch } : tk)),
    }));
    setDirty(true);
  };
  const addTk = () => {
    setTextos((t) => ({
      ...t,
      ticker: [
        ...t.ticker,
        {
          id: genId("tk"),
          simbolo: "",
          preco: "",
          variacao: "",
          positivo: true,
        },
      ],
    }));
    setDirty(true);
  };
  const removeTk = (id: string) => {
    setTextos((t) => ({
      ...t,
      ticker: t.ticker.filter((tk) => tk.id !== id),
    }));
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
        subtitle="Edite o Hero, Propósito, KPIs e Ticker exibidos no portal"
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

          {/* Abas */}
          <div className="flex items-center gap-1 mb-6 border-b border-border">
            {ABAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={[
                  "px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider border-b-2 transition-colors",
                  aba === a.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {a.label}
              </button>
            ))}
          </div>

          {aba === "hero" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Eyebrow (texto pequeno acima do título)
                </label>
                <input
                  type="text"
                  value={textos.hero.eyebrow}
                  onChange={(e) => setHero({ eyebrow: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
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
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
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
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    CTA principal (botão verde)
                  </label>
                  <input
                    type="text"
                    value={textos.hero.ctaLabel}
                    onChange={(e) => setHero({ ctaLabel: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    CTA secundário (link)
                  </label>
                  <input
                    type="text"
                    value={textos.hero.ctaSecundarioLabel}
                    onChange={(e) =>
                      setHero({ ctaSecundarioLabel: e.target.value })
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>
            </div>
          )}

          {aba === "purpose" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Eyebrow
                </label>
                <input
                  type="text"
                  value={textos.purpose.eyebrow}
                  onChange={(e) => setPurpose({ eyebrow: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Título — Antes (preto)
                  </label>
                  <input
                    type="text"
                    value={textos.purpose.tituloAntes}
                    onChange={(e) =>
                      setPurpose({ tituloAntes: e.target.value })
                    }
                    placeholder="ex: Nosso propósito é"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Título — Destaque (verde gradient)
                  </label>
                  <input
                    type="text"
                    value={textos.purpose.tituloDestaque}
                    onChange={(e) =>
                      setPurpose({ tituloDestaque: e.target.value })
                    }
                    placeholder="ex: transformar vidas"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  value={textos.purpose.descricao}
                  onChange={(e) => setPurpose({ descricao: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Eyebrow dos KPIs (texto entre tracinhos)
                </label>
                <input
                  type="text"
                  value={textos.purpose.kpisEyebrow}
                  onChange={(e) =>
                    setPurpose({ kpisEyebrow: e.target.value })
                  }
                  placeholder="ex: Grupo ICA em números"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
              </div>
            </div>
          )}

          {aba === "kpis" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-muted-foreground">
                  {textos.kpis.length} KPIs configurados — recomendado 6
                </p>
                <button
                  onClick={addKpi}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar KPI
                </button>
              </div>
              <ul className="space-y-2">
                {textos.kpis.map((kpi) => (
                  <li
                    key={kpi.id}
                    className="flex items-center gap-3 p-3 rounded-md border border-border bg-background"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      value={kpi.valor}
                      onChange={(e) =>
                        updateKpi(kpi.id, { valor: e.target.value })
                      }
                      placeholder="Valor (ex: +30, R$ 3,2 bi)"
                      className="w-40 bg-transparent text-[14px] font-bold text-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary"
                    />
                    <input
                      type="text"
                      value={kpi.label}
                      onChange={(e) =>
                        updateKpi(kpi.id, { label: e.target.value })
                      }
                      placeholder="Label (ex: Anos de história)"
                      className="flex-1 min-w-0 bg-transparent text-[13px] text-muted-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary"
                    />
                    <button
                      onClick={() => removeKpi(kpi.id)}
                      aria-label="Remover"
                      className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aba === "ticker" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[13px] text-muted-foreground">
                  {textos.ticker.length} símbolos no ticker do header
                </p>
                <button
                  onClick={addTk}
                  className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar símbolo
                </button>
              </div>
              <ul className="space-y-2">
                {textos.ticker.map((tk) => (
                  <li
                    key={tk.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto_auto] gap-3 items-center p-3 rounded-md border border-border bg-background"
                  >
                    <input
                      type="text"
                      value={tk.simbolo}
                      onChange={(e) =>
                        updateTk(tk.id, { simbolo: e.target.value })
                      }
                      placeholder="Símbolo (ex: ICAB31)"
                      className="bg-transparent text-[13px] font-bold text-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary"
                    />
                    <input
                      type="text"
                      value={tk.preco}
                      onChange={(e) =>
                        updateTk(tk.id, { preco: e.target.value })
                      }
                      placeholder="Preço (ex: R$ 42,80)"
                      className="bg-transparent text-[13px] text-muted-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary"
                    />
                    <input
                      type="text"
                      value={tk.variacao}
                      onChange={(e) =>
                        updateTk(tk.id, { variacao: e.target.value })
                      }
                      placeholder="Variação (ex: ↑ 1,24%)"
                      className="bg-transparent text-[13px] text-muted-foreground placeholder:text-muted-foreground outline-none border-b border-transparent focus:border-primary"
                    />
                    <label className="flex items-center gap-2 text-[11px] font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tk.positivo}
                        onChange={(e) =>
                          updateTk(tk.id, { positivo: e.target.checked })
                        }
                        className="rounded border-input text-primary focus:ring-primary/30"
                      />
                      <span className="text-muted-foreground">Positivo</span>
                    </label>
                    <button
                      onClick={() => removeTk(tk.id)}
                      aria-label="Remover"
                      className="h-7 w-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors justify-self-end"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-6 text-[12px] text-muted-foreground">
            Salve as alterações pra ver refletindo em{" "}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-deep font-semibold inline-flex items-center gap-1"
            >
              ri.grupoica.com.br <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
