import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, ExternalLink } from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";
import type {
  FooterColuna,
  FooterLink,
  RedeSocial,
  SiteConfig,
  TipoRedeSocial,
} from "@/store/types";

const TIPOS_REDE: TipoRedeSocial[] = [
  "linkedin",
  "instagram",
  "facebook",
  "youtube",
  "x",
  "email",
  "telefone",
];

const inputCls =
  "rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

let tmpId = 0;
const novoId = (p: string) => `tmp-${p}-${tmpId++}`;

export function ConteudoRodape() {
  const { state, dispatch } = useContent();
  const [config, setConfig] = useState<SiteConfig>(state.config);
  const [colunas, setColunas] = useState<FooterColuna[]>(() =>
    state.footerColunas.map((c) => ({ ...c, links: [...c.links] }))
  );
  const [redes, setRedes] = useState<RedeSocial[]>(() => [...state.redesSociais]);

  // ----- colunas -----
  const setColuna = (ci: number, patch: Partial<FooterColuna>) =>
    setColunas((arr) => arr.map((c, i) => (i === ci ? { ...c, ...patch } : c)));
  const addColuna = () =>
    setColunas((arr) => [...arr, { id: novoId("col"), titulo: "", links: [] }]);
  const removeColuna = (ci: number) =>
    setColunas((arr) => arr.filter((_, i) => i !== ci));

  const setLink = (ci: number, li: number, patch: Partial<FooterLink>) =>
    setColunas((arr) =>
      arr.map((c, i) =>
        i === ci
          ? { ...c, links: c.links.map((l, j) => (j === li ? { ...l, ...patch } : l)) }
          : c
      )
    );
  const addLink = (ci: number) =>
    setColunas((arr) =>
      arr.map((c, i) =>
        i === ci ? { ...c, links: [...c.links, { id: novoId("lnk"), label: "", url: "#" }] } : c
      )
    );
  const removeLink = (ci: number, li: number) =>
    setColunas((arr) =>
      arr.map((c, i) => (i === ci ? { ...c, links: c.links.filter((_, j) => j !== li) } : c))
    );

  // ----- redes -----
  const setRede = (i: number, patch: Partial<RedeSocial>) =>
    setRedes((arr) => arr.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const addRede = () =>
    setRedes((arr) => [...arr, { id: novoId("rede"), tipo: "linkedin", url: "#" }]);
  const removeRede = (i: number) => setRedes((arr) => arr.filter((_, idx) => idx !== i));

  const salvar = () => {
    dispatch({ type: "config/update", payload: config });
    dispatch({
      type: "footer/save",
      payload: colunas
        .filter((c) => c.titulo.trim())
        .map((c) => ({ ...c, titulo: c.titulo.trim(), links: c.links.filter((l) => l.label.trim()) })),
    });
    dispatch({ type: "redes/save", payload: redes.filter((r) => r.url.trim()) });
  };

  return (
    <>
      <Topbar
        title="Rodapé"
        subtitle="Textos institucionais, colunas de links e redes sociais do rodapé"
        actions={
          <button onClick={salvar} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors">
            <Save className="h-4 w-4" />
            Salvar tudo
          </button>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1100px] mx-auto space-y-8">
          <Link to="/admin/conteudo" className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para conteúdo
          </Link>

          {/* Configuração institucional */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-display text-base font-bold text-foreground">Institucional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">URL do botão "Institucional"</label>
                <input className={`w-full ${inputCls}`} value={config.institucionalUrl} onChange={(e) => setConfig({ ...config, institucionalUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Endereço</label>
                <input className={`w-full ${inputCls}`} value={config.footerEndereco} onChange={(e) => setConfig({ ...config, footerEndereco: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Descrição do rodapé</label>
              <textarea rows={2} className={`w-full resize-none ${inputCls}`} value={config.footerDescricao} onChange={(e) => setConfig({ ...config, footerDescricao: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Copyright</label>
                <input className={`w-full ${inputCls}`} value={config.footerCopyright} onChange={(e) => setConfig({ ...config, footerCopyright: e.target.value })} />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">CNPJ</label>
                <input className={`w-full ${inputCls}`} value={config.footerCnpj} onChange={(e) => setConfig({ ...config, footerCnpj: e.target.value })} />
              </div>
            </div>
          </section>

          {/* Colunas de links */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">Colunas de links</h2>
              <button onClick={addColuna} className="inline-flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Plus className="h-3.5 w-3.5" />Coluna
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {colunas.map((col, ci) => (
                <div key={col.id} className="rounded-lg border border-border bg-background/40 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <input value={col.titulo} onChange={(e) => setColuna(ci, { titulo: e.target.value })} placeholder="Título da coluna" className={`flex-1 font-semibold ${inputCls}`} />
                    <button onClick={() => removeColuna(ci)} aria-label="Remover coluna" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {col.links.map((l, li) => (
                      <div key={l.id} className="space-y-1 border-l-2 border-border pl-2">
                        <input value={l.label} onChange={(e) => setLink(ci, li, { label: e.target.value })} placeholder="Texto do link" className={`w-full text-[13px] ${inputCls}`} />
                        <div className="flex items-center gap-1">
                          <input value={l.url} onChange={(e) => setLink(ci, li, { url: e.target.value })} placeholder="URL" className={`flex-1 text-[12px] ${inputCls}`} />
                          <button onClick={() => removeLink(ci, li)} aria-label="Remover link" className="inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addLink(ci)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors">
                      <Plus className="h-3 w-3" />Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Redes sociais */}
          <section className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-foreground">Redes sociais</h2>
              <button onClick={addRede} className="inline-flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Plus className="h-3.5 w-3.5" />Rede
              </button>
            </div>
            <div className="space-y-2">
              {redes.map((r, i) => (
                <div key={r.id} className="flex items-center gap-3">
                  <select value={r.tipo} onChange={(e) => setRede(i, { tipo: e.target.value as TipoRedeSocial })} className={`w-40 ${inputCls}`}>
                    {TIPOS_REDE.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <input value={r.url} onChange={(e) => setRede(i, { url: e.target.value })} placeholder="URL (https://, mailto:, tel:)" className={`flex-1 ${inputCls}`} />
                  <button onClick={() => removeRede(i)} aria-label="Remover rede" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <p className="text-[12px] text-muted-foreground">
            <a href="/" target="_blank" rel="noreferrer" className="text-primary hover:text-primary-deep font-semibold inline-flex items-center gap-1">
              Abrir portal <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
