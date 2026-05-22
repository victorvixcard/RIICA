import { Mail, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

const COLS = [
  {
    title: "Sobre a ICA",
    links: ["Quem somos", "Nossas soluções", "Governança", "Carreiras"],
  },
  {
    title: "Investidores",
    links: [
      "Informações financeiras",
      "Comunicados ao mercado",
      "Agenda do investidor",
      "FAQ",
    ],
  },
  {
    title: "Atendimento",
    links: ["Fale com RI", "Imprensa", "Ouvidoria", "Política de privacidade"],
  },
];

function IconLinkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const SOCIAL = [IconLinkedin, IconInstagram, Mail, Phone];

export function Footer() {
  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Logo variant="inverse" />
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-white/60">
              Relações com Investidores do Grupo ICA — transparência, governança e
              comunicação direta com nossos acionistas.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Rede social"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-primary-glow hover:border-primary-glow/40 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13px] text-white/60 hover:text-primary-glow transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <p className="text-[12px] text-white/50">
            © 2026 Grupo ICA. Todos os direitos reservados. CNPJ 00.000.000/0001-00
          </p>
          <p className="text-[12px] text-white/50">
            Rua Exemplo, 1000 — Vitória/ES — Brasil
          </p>
        </div>
      </div>
    </footer>
  );
}
