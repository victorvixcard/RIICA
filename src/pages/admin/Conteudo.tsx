import { Link } from "react-router-dom";
import {
  Megaphone,
  CalendarDays,
  FileBox,
  Briefcase,
  Type,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { useContent } from "@/store/content";

interface SectionCardProps {
  to: string;
  icon: typeof Megaphone;
  title: string;
  description: string;
  count: number;
  countLabel: string;
  status?: string;
}

function SectionCard({
  to,
  icon: Icon,
  title,
  description,
  count,
  countLabel,
  status,
}: SectionCardProps) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-soft transition-all flex flex-col"
    >
      <div className="flex items-start justify-between">
        <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
      <div className="mt-6">
        <h3 className="font-display text-lg font-bold text-foreground">
          {title}
        </h3>
        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
        <div>
          <div className="font-display text-2xl font-extrabold text-foreground">
            {count}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {countLabel}
          </div>
        </div>
        {status && (
          <span className="text-[11px] font-semibold text-primary">
            {status}
          </span>
        )}
      </div>
    </Link>
  );
}

export function ConteudoOverview() {
  const { state, dispatch } = useContent();
  const comunicadosPub = state.comunicados.filter((c) => c.publicado).length;
  const eventosPub = state.eventos.filter((e) => e.publicado).length;
  const docsPub = state.documentos.filter((d) => d.publico).length;

  const onReset = () => {
    if (
      confirm(
        "Resetar todo o conteúdo para o padrão inicial?\n\nTodos os comunicados, eventos, documentos, configurações do Kit e textos editados serão perdidos."
      )
    ) {
      dispatch({ type: "reset" });
    }
  };

  return (
    <>
      <Topbar
        title="Conteúdo do site"
        subtitle="Tudo que aparece no portal R.I. público — edite aqui, reflete em tempo real"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:border-destructive/40 hover:text-destructive transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Resetar
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir portal
            </a>
          </div>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-start gap-4">
            <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0">
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[14px] text-foreground">
                O painel é a fonte da verdade do portal
              </div>
              <div className="text-[13px] text-muted-foreground mt-1">
                Toda alteração feita aqui aparece imediatamente em{" "}
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:text-primary-deep font-semibold"
                >
                  ri.grupoica.com.br
                </a>
                . Edite com cuidado — não há fluxo de aprovação ainda.
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-foreground mb-4">
              Blocos do portal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SectionCard
                to="/admin/conteudo/comunicados"
                icon={Megaphone}
                title="Comunicados"
                description="Últimas atualizações exibidas na home — fatos relevantes, dividendos, aquisições, atas."
                count={state.comunicados.length}
                countLabel="cadastrados"
                status={`${comunicadosPub} publicados`}
              />
              <SectionCard
                to="/admin/conteudo/eventos"
                icon={CalendarDays}
                title="Eventos"
                description="Agenda do investidor — teleconferências, APIMECs, Investor Day, assembleias."
                count={state.eventos.length}
                countLabel="cadastrados"
                status={`${eventosPub} publicados`}
              />
              <SectionCard
                to="/admin/conteudo/documentos"
                icon={FileBox}
                title="Documentos"
                description="Repositório completo de PDFs — releases, apresentações, atas, 20-F, regulamentos."
                count={state.documentos.length}
                countLabel="documentos"
                status={`${docsPub} públicos`}
              />
              <SectionCard
                to="/admin/conteudo/kit"
                icon={Briefcase}
                title="Kit do Investidor"
                description="Trimestre atual e documentos em destaque na home + links auxiliares (20-F, planilha)."
                count={state.kitAtual.documentosDestaqueIds.length}
                countLabel={`destaques · ${state.kitAtual.trimestre}`}
              />
              <SectionCard
                to="/admin/conteudo/textos"
                icon={Type}
                title="Textos institucionais"
                description="Hero, propósito, KPIs do 'Grupo ICA em números' e ticker de cotações."
                count={state.textos.kpis.length}
                countLabel="KPIs cadastrados"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
