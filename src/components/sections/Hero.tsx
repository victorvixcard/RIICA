import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useContent } from "@/store/content";

// Duotone SVG filter — mapeia luminance pra duas cores:
// shadow = #0d3d1f (verde institucional escuro)
// highlight = #f5efe4 (creme claro)
// Coeficientes derivados dos pesos de luminância Rec. 709 (0.2126, 0.7152, 0.0722).
const DUOTONE_FILTER = (
  <svg
    width="0"
    height="0"
    style={{ position: "absolute", overflow: "hidden" }}
    aria-hidden="true"
  >
    <defs>
      <filter id="duotone-ica-green" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="
            0.1935 0.6508 0.0657 0 0.051
            0.1484 0.4992 0.0504 0 0.239
            0.1643 0.5528 0.0558 0 0.122
            0      0      0      1 0
          "
        />
      </filter>
    </defs>
  </svg>
);

export function Hero() {
  const { state } = useContent();
  const t = state.textos.hero;

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-gradient-hero">
      {DUOTONE_FILTER}

      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute top-32 -right-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute -bottom-40 -left-32 h-[480px] w-[480px] rounded-full bg-primary/8 blur-[140px]" />

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 lg:px-10 w-full pt-44 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
          {/* TEXTO — coluna esquerda */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {t.eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t.eyebrow}
              </div>
            )}

            <h1 className="mt-7 font-display text-4xl lg:text-[60px] xl:text-[64px] font-extrabold leading-[1.05] tracking-tight text-foreground">
              {t.tituloLinha1}
              <br />
              <span className="text-gradient-primary">{t.tituloLinha2}</span>
            </h1>

            <p className="mt-7 max-w-xl text-base lg:text-lg text-muted-foreground leading-relaxed">
              {t.descricao}
            </p>
          </motion.div>

          {/* IMAGEM — coluna direita */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="relative w-full hidden lg:block"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-surface-dark shadow-elevated">
              {/* Imagem com duotone + Ken Burns (zoom-in suave eterno) */}
              <motion.img
                src="/hero/grupo-ica-skyline.png"
                alt="Edifício institucional do Grupo ICA ao entardecer em Salvador, Bahia"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "url(#duotone-ica-green)" }}
                initial={{ scale: 1.02 }}
                animate={{ scale: 1.1 }}
                transition={{
                  duration: 22,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              {/* Overlay: gradient verde do canto inferior pro topo — aterra a composição */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d3d1f]/40 via-[#0d3d1f]/5 to-transparent" />

              {/* Overlay: gradient lateral pra fundir borda esquerda no hero claro */}
              <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background/15 to-transparent" />

              {/* Vinheta sutil nos cantos */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow:
                    "inset 0 0 140px rgba(13, 61, 31, 0.45), inset 0 -60px 80px rgba(13, 61, 31, 0.3)",
                }}
              />

              {/* Grain sutil */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.06] mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                }}
              />

              {/* Eyebrow decorativo no canto inferior */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/25" />
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
                  Salvador · Bahia
                </span>
                <span className="h-px w-8 bg-white/25" />
              </div>
            </div>

            {/* Selo decorativo flutuante — sutil */}
            <div className="absolute -top-3 -left-3 lg:-top-4 lg:-left-4 inline-flex items-center gap-2 rounded-full bg-card border border-border px-4 py-2 shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
                Portal R.I.
              </span>
            </div>
          </motion.div>
        </div>
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
