import { Mail, Phone, Link as LinkIcon } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useContent } from "@/store/content";
import type { TipoRedeSocial } from "@/store/types";

type IconType = (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;

function svg(path: React.ReactNode, opts?: { fill?: boolean }): IconType {
  return (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={opts?.fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {path}
    </svg>
  );
}

const IconLinkedin = svg(
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-12h4v2" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </>
);
const IconInstagram = svg(
  <>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </>
);
const IconFacebook = svg(
  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
);
const IconYoutube = svg(
  <>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </>
);
const IconX = svg(
  <path d="M18 2h3l-7.5 8.6L22 22h-6.9l-5-6.5L4.3 22H1l8-9.2L1.5 2H8.5l4.5 6 5-6Z" fill="currentColor" stroke="none" />
);

const ICONE_REDE: Record<TipoRedeSocial, IconType> = {
  linkedin: IconLinkedin,
  instagram: IconInstagram,
  facebook: IconFacebook,
  youtube: IconYoutube,
  x: IconX,
  email: Mail as unknown as IconType,
  telefone: Phone as unknown as IconType,
};

export function Footer() {
  const { state } = useContent();
  const { footerColunas, redesSociais, config } = state;

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Logo variant="inverse" />
            <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-white/60">
              {config.footerDescricao}
            </p>
            <div className="mt-6 flex items-center gap-3">
              {redesSociais.map((rede) => {
                const Icon = ICONE_REDE[rede.tipo] ?? LinkIcon;
                return (
                  <a
                    key={rede.id}
                    href={rede.url}
                    aria-label={rede.tipo}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-primary-glow hover:border-primary-glow/40 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerColunas.map((col) => (
            <div key={col.id}>
              <h4 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {col.titulo}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      className="text-[13px] text-white/60 hover:text-primary-glow transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <p className="text-[12px] text-white/50">
            {config.footerCopyright}
            {config.footerCnpj ? ` ${config.footerCnpj}` : ""}
          </p>
          <p className="text-[12px] text-white/50">{config.footerEndereco}</p>
        </div>
      </div>
    </footer>
  );
}
