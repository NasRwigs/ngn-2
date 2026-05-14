import { ArrowDown, ArrowUp } from "lucide-react";

import { cn } from "./cn";
import { Card } from "./card";

interface StatCardProps {
  label: string;
  value: string | number;
  trendPct?: number;
  tone?: "info" | "success" | "warning" | "error";
  className?: string;
}

export function StatCard({
  label,
  value,
  trendPct,
  tone = "info",
  className,
}: StatCardProps) {
  const trendUp = (trendPct ?? 0) >= 0;
  return (
    <Card
      className={cn("p-4 md:p-6", className)}
      accent={tone === "warning" ? "orange" : tone === "error" ? "red" : "blue"}
    >
      <div className="text-sm text-on-surface-variant">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-headline-lg text-on-surface font-bold">{value}</div>
        {typeof trendPct === "number" && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trendUp ? "text-success" : "text-error",
            )}
            aria-label={`${trendUp ? "Up" : "Down"} ${Math.abs(trendPct)} percent`}
          >
            {trendUp ? (
              <ArrowUp className="size-3" aria-hidden />
            ) : (
              <ArrowDown className="size-3" aria-hidden />
            )}
            {Math.abs(trendPct)}%
          </div>
        )}
      </div>
    </Card>
  );
}
