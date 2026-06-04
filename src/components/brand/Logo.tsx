import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "default" | "inverse";
}

export function Logo({ className, variant = "default" }: LogoProps) {
  const isInverse = variant === "inverse";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-baseline">
        <span
          className={cn(
            "font-display text-2xl font-extrabold tracking-tight",
            isInverse ? "text-white" : "text-foreground"
          )}
        >
          GRUPO
        </span>
        <span
          className={cn(
            "ml-1 font-display text-2xl font-extrabold tracking-tight",
            isInverse ? "text-primary-glow" : "text-primary"
          )}
        >
          ICA
        </span>
      </div>
      <div
        className={cn(
          "hidden md:block h-8 w-px",
          isInverse ? "bg-white/20" : "bg-border"
        )}
      />
      <span
        className={cn(
          "hidden md:block text-[11px] leading-tight uppercase tracking-wider",
          isInverse ? "text-white/60" : "text-muted-foreground"
        )}
      >
        Relações com
        <br />
        Investidores
      </span>
    </div>
  );
}
