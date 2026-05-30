import { Construction } from "lucide-react";

/**
 * Placeholder visual usado quando um bloco do portal ainda não tem dados
 * para apresentar. Comunica que a informação será exibida quando o
 * portal estiver 100% concluído para o investidor.
 */
export function PlaceholderEmBreve({
  tipo,
  className = "",
}: {
  tipo: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-dashed border-border bg-card/40 px-6 py-10 flex flex-col items-center text-center ${className}`}
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        <Construction className="h-5 w-5" />
      </div>
      <h4 className="mt-5 font-display text-[14px] font-bold text-foreground">
        Em breve
      </h4>
      <p className="mt-2 max-w-[28ch] text-[13px] text-muted-foreground leading-relaxed">
        {tipo} serão exibidos aqui assim que o portal estiver 100% concluído
        para o investidor.
      </p>
    </div>
  );
}
