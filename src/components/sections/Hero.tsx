import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useContent } from "@/store/content";

export function Hero() {
  const { state } = useContent();
  const t = state.textos.hero;

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-32 -right-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full bg-primary/8 blur-[140px]" />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-10 w-full pt-44 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {t.eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t.eyebrow}
            </div>
          )}

          <h1 className="mt-7 font-display text-4xl lg:text-[64px] font-extrabold leading-[1.05] tracking-tight text-foreground">
            {t.tituloLinha1}
            <br />
            <span className="text-gradient-primary">{t.tituloLinha2}</span>
          </h1>

          <p className="mt-7 max-w-xl text-base lg:text-lg text-muted-foreground leading-relaxed">
            {t.descricao}
          </p>

        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-sm text-muted-foreground"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </div>
    </section>
  );
}
