import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContent } from "@/store/content";

const cls =
  "group inline-flex items-center justify-center rounded-full bg-primary px-7 lg:px-9 py-4 text-center text-[12px] font-bold uppercase tracking-[0.14em] text-primary-foreground shadow-brand hover:bg-primary-deep hover:-translate-y-0.5 transition-all duration-300";

export function QuickActions() {
  const { state } = useContent();
  const actions = [...state.quickActions]
    .filter((a) => a.visivel)
    .sort((a, b) => a.ordem - b.ordem);

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
          {actions.map((action) => (
            <motion.li
              key={action.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {action.href.startsWith("/") ? (
                <Link to={action.href} className={cls}>
                  {action.label}
                </Link>
              ) : (
                <a href={action.href} className={cls}>
                  {action.label}
                </a>
              )}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
