import { cn } from "./cn";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  tone?: "primary" | "success" | "warning" | "error";
  className?: string;
  showValue?: boolean;
}

const TONE = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "primary",
  className,
  showValue,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-on-surface-variant">{label}</span>}
          {showValue && (
            <span className="font-medium text-on-surface">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn("h-full rounded-full transition-all", TONE[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
