// Seção "Fatos Relevantes" — lista no estilo timeline com hiperlinks.
// Conteúdo é gerenciado pelo CMS na tabela `fatos_relevantes`.
//
// Enquanto a tabela do Cloud não tiver dados reais, exibe um fallback
// fictício com badge "PREVIEW DE DEMONSTRAÇÃO" pra você visualizar o
// layout. Assim que o primeiro fato real for publicado pelo admin,
// o fallback some automaticamente.
import { motion } from "framer-motion";
import { useContent } from "@/store/content";
import type { FatoRelevante } from "@/store/types";

// Mocks de demonstração — usados apenas quando a tabela do CMS está vazia.
const DEMO_PREVIEW: FatoRelevante[] = [
  {
    id: "demo-1",
    data: "2026-05-23",
    tag: "COMUNICADO OFICIAL",
    titulo:
      "Carta da Diretoria aos Investidores — Perspectivas Estratégicas e Prioridades para 2026",
    resumo:
      "A diretoria executiva do Grupo ICA publica carta institucional endereçada a investidores e parceiros, apresentando a visão estratégica do grupo para o exercício de 2026, prioridades de expansão regional e compromissos de governança corporativa.",
    url: "#",
    publicado: true,
    ordem: 0,
  },
  {
    id: "demo-2",
    data: "2026-04-15",
    tag: "AVISO AO MERCADO",
    titulo:
      "Atualização do Calendário de Eventos Corporativos — Segundo Semestre de 2026",
    resumo:
      "O Grupo ICA divulga a versão atualizada do Calendário de Eventos Corporativos para o segundo semestre de 2026, contemplando assembleias gerais, divulgação de resultados trimestrais e conferências com analistas.",
    url: "#",
    publicado: true,
    ordem: 1,
  },
  {
    id: "demo-3",
    data: "2026-03-08",
    tag: "FATO RELEVANTE",
    titulo:
      "Grupo ICA aprova nova arquitetura de governança e nomeia Governance Officer",
    resumo:
      "A diretoria executiva aprova formalmente a nova arquitetura de governança para os veículos de investimento do grupo, com a designação do Governance Officer e a publicação do cronograma de implementação dos novos controles internos.",
    url: "#",
    publicado: true,
    ordem: 2,
  },
];

function formatDataBR(iso: string) {
  // Formato: "23 mai 2026"
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${String(d).padStart(2, "0")} ${meses[(m - 1 + 12) % 12]} ${y}`;
}

export function FatosRelevantes() {
  const { state } = useContent();

  const reais = state.fatosRelevantes
    .filter((f) => f.publicado)
    .sort((a, b) => {
      const cmp = b.data.localeCompare(a.data);
      return cmp !== 0 ? cmp : a.ordem - b.ordem;
    });

  // Fallback: se não houver dados reais, mostra os mocks com badge visível.
  const items = reais.length > 0 ? reais : DEMO_PREVIEW;
  const isDemo = reais.length === 0;

  return (
    <section id="comunicados" className="relative bg-background scroll-mt-32">
      {/* Faixa escura com título */}
      <div className="relative bg-surface-dark text-surface-dark-foreground">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-10 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-3xl lg:text-[44px] font-extrabold leading-[1.05] tracking-tight text-white">
              Fatos Relevantes
            </h2>
            <p className="mt-3 text-[14px] lg:text-[15px] text-white/60 max-w-2xl leading-relaxed">
              Os princípios que orientam nossa relação com stakeholders.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Lista de fatos relevantes */}
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-14 lg:py-16">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              Comunicados Recentes
            </h3>
          </div>
          {isDemo && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800"
              title="Conteúdo de exemplo — some quando o primeiro fato real for publicado pelo CMS."
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Preview de demonstração
            </span>
          )}
        </div>

        <ul className="divide-y divide-border border-y border-border">
          {items.map((fato, i) => {
            const inner = (
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-3 lg:gap-8 py-7 group">
                <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                  <div className="text-[12px] font-bold uppercase tracking-wider text-primary">
                    {formatDataBR(fato.data)}
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                    {fato.tag}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-display text-[17px] lg:text-[19px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {fato.titulo}
                  </h4>
                  {fato.resumo && (
                    <div className="mt-2 text-[13px] lg:text-[14px] text-muted-foreground leading-relaxed space-y-3">
                      {fato.resumo
                        .split(/\n\n+/)
                        .map((p, idx) => (
                          <p key={idx}>{p}</p>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            );

            return (
              <motion.li
                key={fato.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              >
                {fato.url ? (
                  <a
                    href={fato.url}
                    target={fato.url.startsWith("http") ? "_blank" : undefined}
                    rel={fato.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="block hover:bg-muted/30 transition-colors px-2 lg:px-4 -mx-2 lg:-mx-4 rounded-md"
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
