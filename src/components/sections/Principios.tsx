// 4 Princípios institucionais — substitui o antigo InfoGrid na home.
// Texto fixo no código (não vai pro CMS por enquanto, decisão de produto).
import { motion } from "framer-motion";
import { Eye, ShieldCheck, TrendingUp, Heart } from "lucide-react";

const PRINCIPIOS = [
  {
    icon: Eye,
    titulo: "Transparência",
    descricao:
      "Divulgação integral e tempestiva de informações financeiras, operacionais e societárias a todos os stakeholders.",
  },
  {
    icon: ShieldCheck,
    titulo: "Governança Sólida",
    descricao:
      "Estrutura de governança corporativa com diretoria executiva qualificada, compliance robusto e controles internos efetivos.",
  },
  {
    icon: TrendingUp,
    titulo: "Criação de Valor",
    descricao:
      "Modelo de negócio orientado à geração de valor sustentável para investidores, clientes, parceiros e as comunidades que atendemos.",
  },
  {
    icon: Heart,
    titulo: "Impacto Social",
    descricao:
      "Compromisso com o desenvolvimento econômico e social das regiões onde atuamos, alinhado aos Objetivos de Desenvolvimento Sustentável da ONU.",
  },
];

export function Principios() {
  return (
    <section className="relative py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {PRINCIPIOS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative rounded-2xl border border-border bg-card p-7 lg:p-8 hover:border-primary/40 hover:shadow-soft transition-all flex flex-col"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-lg lg:text-xl font-extrabold text-foreground leading-tight">
                  {p.titulo}
                </h3>
                <p className="mt-3 text-[13px] lg:text-[14px] text-muted-foreground leading-relaxed">
                  {p.descricao}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
