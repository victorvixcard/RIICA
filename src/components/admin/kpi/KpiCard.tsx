import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: number; direction: "up" | "down"; period?: string };
  hint?: string;
}

export function KpiCard({ label, value, icon: Icon, trend, hint }: KpiCardProps) {
  return (
    <div className="group relative rounded-xl border border-border bg-card p-5 hover:shadow-soft transition-shadow">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold",
              trend.direction === "up"
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-5">
        <div className="font-display text-2xl lg:text-3xl font-extrabold text-foreground">
          {value}
        </div>
        <div className="mt-1 text-[12px] uppercase tracking-wider font-semibold text-muted-foreground">
          {label}
        </div>
        {hint && (
          <div className="mt-2 text-[11px] text-muted-foreground">{hint}</div>
        )}
      </div>
    </div>
  );
}
