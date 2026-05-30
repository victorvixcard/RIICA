import { motion } from "framer-motion";
import { useContent } from "@/store/content";
import { PlaceholderEmBreve } from "@/components/PlaceholderEmBreve";

export function Purpose() {
  const { state } = useContent();
  const p = state.textos.purpose;
  const kpis = state.textos.kpis;
  const temKpis = kpis.length > 0;

  return (
    <section className="relative py-24 lg:py-36 overflow-hidden border-t border-border bg-card/50">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-primary/4 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
            {p.eyebrow}
          </div>
          <h2 className="mt-7 font-display text-3xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            {p.tituloAntes}{" "}
            <span className="text-gradient-primary">{p.tituloDestaque}</span>
          </h2>
          <p className="mt-6 text-base lg:text-lg text-muted-foreground leading-relaxed">
            {p.descricao}
          </p>

          {temKpis && (
            <div className="mt-10 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-px w-10 bg-border" />
              {p.kpisEyebrow}
              <span className="h-px w-10 bg-border" />
            </div>
          )}
        </motion.div>

        {temKpis ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
            }}
            className="mt-14 grid grid-cols-2 lg:grid-cols-6 gap-px rounded-xl border border-border bg-border overflow-hidden shadow-soft"
          >
            {kpis.map((stat) => (
              <motion.div
                key={stat.id}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col items-center justify-center bg-background px-6 py-10 text-center"
              >
                <div className="font-display text-3xl lg:text-4xl font-extrabold text-foreground">
                  {stat.valor}
                </div>
                <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="mt-14 max-w-md mx-auto">
            <PlaceholderEmBreve tipo="Os números do Grupo ICA" />
          </div>
        )}
      </div>
    </section>
  );
}
