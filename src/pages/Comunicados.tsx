// Página pública /comunicados — lista completa de Comunicados ao Mercado.
// Entidade independente de Fatos Relevantes: ambos coexistem e podem ter
// conteúdos sobrepostos quando o admin assim decidir.
import { motion } from "framer-motion";
import { Download, ExternalLink, FileText } from "lucide-react";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";
import { useContent } from "@/store/content";
import { pathDeUrlPublica } from "@/lib/api/storage";

function formatDataBR(iso: string) {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${String(d).padStart(2, "0")} ${meses[(m - 1 + 12) % 12]} ${y}`;
}

export function Comunicados() {
  const { state } = useContent();

  const comunicados = state.comunicados
    .filter((c) => c.publicado)
    .sort((a, b) => {
      const cmp = b.data.localeCompare(a.data);
      return cmp !== 0 ? cmp : a.ordem - b.ordem;
    });

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-44 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute top-32 -right-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full bg-primary/8 blur-[140px]" />

          <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10 pt-16 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Comunicados ao Mercado
              </div>

              <h1 className="mt-6 font-display text-4xl lg:text-[52px] font-extrabold leading-[1.05] tracking-tight text-foreground">
                Comunicados
              </h1>
              <p className="mt-5 max-w-2xl text-[14px] lg:text-[15px] text-muted-foreground leading-relaxed">
                Avisos e comunicações oficiais do Grupo ICA ao mercado, investidores e parceiros — em ordem cronológica.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Lista */}
        <section className="bg-background">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-14 lg:py-16">
            {comunicados.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card/40 px-8 py-16 text-center">
                <div className="mx-auto h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <p className="mt-4 text-[14px] text-muted-foreground">
                  Nenhum comunicado publicado no momento.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border border-y border-border">
                {comunicados.map((c, i) => {
                  const ehPdfStorage = c.link
                    ? pathDeUrlPublica(c.link) !== null
                    : false;
                  const isExterno = c.link?.startsWith("http") ?? false;

                  const inner = (
                    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_auto] gap-3 lg:gap-8 py-7 group">
                      <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
                        <div className="text-[12px] font-bold uppercase tracking-wider text-primary">
                          {formatDataBR(c.data)}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                          {c.tag}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h2 className="font-display text-[17px] lg:text-[19px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {c.titulo}
                        </h2>
                        {c.resumo && (
                          <div className="mt-2 space-y-2 text-[13px] lg:text-[14px] text-muted-foreground leading-relaxed">
                            {c.resumo.split(/\n\s*\n/).map((p, idx) => (
                              <p key={idx}>{p.trim()}</p>
                            ))}
                          </div>
                        )}
                      </div>
                      {c.link && (
                        <div className="lg:self-center shrink-0">
                          <span className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-foreground/80 group-hover:border-primary group-hover:text-primary transition-colors">
                            {ehPdfStorage ? (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                Baixar PDF
                              </>
                            ) : (
                              <>
                                <ExternalLink className="h-3.5 w-3.5" />
                                Abrir
                              </>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <motion.li
                      key={c.id}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
                    >
                      {c.link ? (
                        <a
                          href={c.link}
                          target={isExterno ? "_blank" : undefined}
                          rel={isExterno ? "noopener noreferrer" : undefined}
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
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
