// Seção "Fatos Relevantes" — lista no estilo timeline com hiperlinks.
// Conteúdo é 100% gerenciado pelo CMS na tabela `fatos_relevantes`.
// Crie/edite/exclua em /admin/conteudo/fatos-relevantes.
import { motion } from "framer-motion";
import { useContent } from "@/store/content";

function formatDataBR(iso: string) {
  // Formato: "23 mai 2025"
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  const meses = [
    "jan", "fev", "mar", "abr", "mai", "jun",
    "jul", "ago", "set", "out", "nov", "dez",
  ];
  return `${String(d).padStart(2, "0")} ${meses[(m - 1 + 12) % 12]} ${y}`;
}

export function FatosRelevantes() {
  const { state } = useContent();

  const items = state.fatosRelevantes
    .filter((f) => f.publicado)
    .sort((a, b) => {
      // Ordena por data desc; em empate, usa ordem asc
      const cmp = b.data.localeCompare(a.data);
      return cmp !== 0 ? cmp : a.ordem - b.ordem;
    });

  return (
    <section className="relative bg-background">
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
        <div className="flex items-center gap-3 mb-8">
          <span className="h-px w-8 bg-primary" />
          <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            Comunicados Recentes
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
            <p className="text-[14px] text-muted-foreground">
              Nenhum fato relevante publicado ainda.
            </p>
            <p className="text-[12px] text-muted-foreground mt-1">
              Adicione conteúdo pelo painel admin em{" "}
              <span className="font-semibold text-foreground">
                Conteúdo &rsaquo; Fatos Relevantes
              </span>
              .
            </p>
          </div>
        ) : (
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
                      <p className="mt-2 text-[13px] lg:text-[14px] text-muted-foreground leading-relaxed">
                        {fato.resumo}
                      </p>
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
        )}
      </div>
    </section>
  );
}
