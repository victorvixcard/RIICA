import { motion } from "framer-motion";
import { Header } from "@/components/sections/Header";
import { Footer } from "@/components/sections/Footer";

export function QuemSomos() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />

      <main className="pt-44 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-hero">
          <div className="absolute inset-0 grid-pattern opacity-40" />
          <div className="absolute top-32 -right-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -bottom-40 -left-32 h-[380px] w-[380px] rounded-full bg-primary/8 blur-[140px]" />

          <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10 pt-20 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Quem Somos
              </div>

              <h1 className="mt-7 font-display text-4xl lg:text-[56px] font-extrabold leading-[1.05] tracking-tight text-foreground">
                Nosso propósito é{" "}
                <span className="text-gradient-primary">transformar vidas</span>{" "}
                e construir futuros.
              </h1>
            </motion.div>
          </div>
        </section>

        {/* Conteúdo */}
        <section className="bg-background">
          <div className="mx-auto max-w-[820px] px-6 lg:px-10 py-20 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="space-y-6 text-[16px] lg:text-[17px] leading-relaxed text-muted-foreground"
            >
              <p>
                Há mais de 11 anos, o <strong className="text-foreground">Grupo ICA</strong> conecta pessoas a
                oportunidades que promovem dignidade, desenvolvimento e
                realização. Cada solução que entregamos, cada parceria que
                fortalecemos e cada relacionamento que construímos tem um
                propósito comum: gerar valor e impactar positivamente a vida de
                quem confia em nosso trabalho.
              </p>

              <p>
                Somos mais do que um grupo de empresas. Somos um{" "}
                <strong className="text-foreground">ecossistema de negócios</strong> movido pela convicção de que o
                crescimento sustentável acontece quando pessoas, organizações e
                comunidades prosperam juntas.
              </p>

              <p>
                Essa visão nos impulsiona diariamente a criar oportunidades,
                fortalecer economias locais, fomentar o desenvolvimento e
                contribuir para a construção de um legado sólido de prosperidade
                para as atuais e futuras gerações.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 lg:p-10"
            >
              <p className="font-display text-2xl lg:text-[28px] font-extrabold leading-tight text-foreground">
                <span className="text-gradient-primary">Grupo ICA.</span>{" "}
                Conectando oportunidades. Transformando vidas. Construindo o
                futuro.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
