import { motion } from "framer-motion";
import { ArrowRight, Calendar, FileText, Download } from "lucide-react";
import { useContent } from "@/store/content";
import { PlaceholderEmBreve } from "@/components/PlaceholderEmBreve";

function Column({
  eyebrow,
  children,
  cta,
  delay = 0,
}: {
  eyebrow: string;
  children: React.ReactNode;
  cta?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
      className="relative flex flex-col"
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-8 bg-primary" />
        <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
          {eyebrow}
        </h3>
      </div>
      <div className="mt-7 flex-1">{children}</div>
      {cta && (
        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-primary hover:text-primary-deep transition-colors w-fit"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </motion.div>
  );
}

function formatDataBR(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export function InfoGrid() {
  const { state } = useContent();
  const updates = state.comunicados
    .filter((c) => c.publicado && c.destaque)
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, 4);

  const eventosFuturos = state.eventos
    .filter((e) => e.publicado)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3);

  const kit = state.kitAtual;
  const docsDestaque = kit.documentosDestaqueIds
    .map((id) => state.documentos.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <section className="relative py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Últimas Atualizações */}
          <Column
            eyebrow="Últimas Atualizações"
            cta={updates.length > 0 ? "Ver mais" : undefined}
            delay={0}
          >
            {updates.length === 0 ? (
              <PlaceholderEmBreve tipo="Os comunicados ao mercado" />
            ) : (
              <ul className="space-y-5">
                {updates.map((u) => (
                  <li
                    key={u.id}
                    className="group cursor-pointer border-b border-border pb-5 last:border-0"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {formatDataBR(u.data)}
                    </div>
                    <div className="mt-2 text-[15px] leading-snug font-medium text-foreground group-hover:text-primary transition-colors">
                      {u.titulo}
                    </div>
                    {u.resumo && (
                      <div className="mt-1 text-[12px] text-muted-foreground line-clamp-2">
                        {u.resumo}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Column>

          {/* Kit do Investidor */}
          <Column eyebrow="Kit do Investidor" delay={0.1}>
            {docsDestaque.length === 0 ? (
              <PlaceholderEmBreve tipo="Os documentos do Kit do Investidor" />
            ) : (
            <div className="rounded-xl border border-border bg-card shadow-soft p-6">
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-display text-5xl font-extrabold text-gradient-primary leading-none">
                    {kit.trimestre}
                  </span>
                  <div className="mt-3 h-12 w-px bg-primary/30" />
                </div>
                <ul className="flex-1 space-y-3 pt-1">
                  {docsDestaque.length === 0 ? (
                    <li className="text-[13px] text-muted-foreground italic">
                      Nenhum documento em destaque.
                    </li>
                  ) : (
                    docsDestaque.map((d) => (
                      <li
                        key={d.id}
                        className="group flex items-center gap-3 text-[14px] text-foreground hover:text-primary cursor-pointer transition-colors"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="flex-1">{d.titulo}</span>
                        <Download className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {kit.linksAuxiliares.length > 0 && (
                <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px]">
                  {kit.linksAuxiliares.map((link, i) => (
                    <span key={link.id} className="flex items-center gap-x-3">
                      <a
                        href={link.url}
                        className="text-primary hover:text-primary-deep transition-colors"
                      >
                        {link.label}
                      </a>
                      {i < kit.linksAuxiliares.length - 1 && (
                        <span className="text-border">/</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
            )}
          </Column>

          {/* Próximos Eventos */}
          <Column
            eyebrow="Próximos Eventos"
            cta={eventosFuturos.length > 0 ? "Ver agenda completa" : undefined}
            delay={0.2}
          >
            {eventosFuturos.length === 0 ? (
              <PlaceholderEmBreve tipo="Os próximos eventos do investidor" />
            ) : (
              <ul className="space-y-3">
                {eventosFuturos.map((ev) => (
                  <li
                    key={ev.id}
                    className="group rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-soft transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                          <span className="text-primary">
                            {formatDataBR(ev.data)}
                          </span>
                          <span className="text-border">•</span>
                          <span className="text-muted-foreground">
                            {ev.hora}
                          </span>
                        </div>
                        <div className="mt-1 text-[14px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                          {ev.titulo}
                        </div>
                        <div className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {ev.tipo}
                          {ev.local ? ` • ${ev.local}` : ""}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Column>
        </div>
      </div>
    </section>
  );
}
