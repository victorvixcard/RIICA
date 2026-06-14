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
  Menu,
  MousePointerClick,
  PanelBottom,
  HelpCircle,
  Newspaper,
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
  const { state, refetch } = useContent();
  const eventosPub = state.eventos.filter((e) => e.publicado).length;
  const docsPub = state.documentos.filter((d) => d.publico).length;
  const fatosPub = state.fatosRelevantes.filter((f) => f.publicado).length;

  const onRecarregar = () => {
    void refetch();
  };

  return (
    <>
      <Topbar
        title="Conteúdo do site"
        subtitle="Tudo que aparece no portal R.I. público — edite aqui, reflete em tempo real"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={onRecarregar}
              title="Recarregar o conteúdo a partir do banco"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Recarregar
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
                description="Título, descrição e eyebrow do Hero da home — editar reflete imediatamente no portal."
                count={1}
                countLabel="bloco editável"
                status="Hero"
              />
              <SectionCard
                to="/admin/conteudo/navegacao"
                icon={Menu}
                title="Navegação"
                description="Itens do menu principal do header — rótulos, ordem, links e visibilidade."
                count={state.navItems.length}
                countLabel="itens de menu"
                status={`${state.navItems.filter((n) => n.visivel).length} visíveis`}
              />
              <SectionCard
                to="/admin/conteudo/acoes"
                icon={MousePointerClick}
                title="Ações rápidas"
                description="Botões em destaque logo abaixo do hero (FAQs, Resultados, Mailing, Contato)."
                count={state.quickActions.length}
                countLabel="botões"
                status={`${state.quickActions.filter((a) => a.visivel).length} visíveis`}
              />
              <SectionCard
                to="/admin/conteudo/rodape"
                icon={PanelBottom}
                title="Rodapé"
                description="Textos institucionais, colunas de links, redes sociais, CNPJ e endereço."
                count={state.footerColunas.length}
                countLabel="colunas"
                status={`${state.redesSociais.length} redes`}
              />
              <SectionCard
                to="/admin/conteudo/faq"
                icon={HelpCircle}
                title="FAQ"
                description="Perguntas frequentes exibidas no portal — pergunta, resposta e categoria."
                count={state.faqs.length}
                countLabel="perguntas"
                status={`${state.faqs.filter((f) => f.publicado).length} publicadas`}
              />
              <SectionCard
                to="/admin/conteudo/fatos-relevantes"
                icon={Newspaper}
                title="Fatos Relevantes"
                description="Comunicados oficiais, avisos ao mercado e atos societários — bloco em destaque na home."
                count={state.fatosRelevantes.length}
                countLabel="cadastrados"
                status={`${fatosPub} publicados`}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
