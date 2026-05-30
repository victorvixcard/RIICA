import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function PaginaEmBreve({
  titulo,
  mensagem,
}: {
  titulo: string;
  mensagem: string;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-10 py-4">
          <Link to="/" aria-label="Portal RI Grupo ICA">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-md text-center">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Construction className="h-8 w-8" />
          </div>
          <h1 className="mt-8 font-display text-3xl font-extrabold text-foreground">
            {titulo}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
            {mensagem}
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao portal
          </Link>
        </div>
      </main>
    </div>
  );
}
