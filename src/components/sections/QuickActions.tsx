import { motion } from "framer-motion";

const ACTIONS = [
  { label: "FAQs", href: "#faqs" },
  { label: "Resultados Trimestrais", href: "#resultados" },
  { label: "Apresentação Institucional", href: "#apresentacao" },
  { label: "Mailing", href: "#mailing" },
  { label: "Contato com RI", href: "#contato" },
];

export function QuickActions() {
  return (
    <section className="relative -mt-16 z-20">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
          }}
          className="flex flex-wrap items-center justify-center gap-3 lg:gap-4"
        >
          {ACTIONS.map((action) => (
            <motion.li
              key={action.label}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <a
                href={action.href}
                className="group inline-flex items-center justify-center rounded-full bg-primary px-7 lg:px-9 py-4 text-center text-[12px] font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-brand hover:bg-primary-deep hover:-translate-y-0.5 transition-all duration-300"
              >
                {action.label}
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
