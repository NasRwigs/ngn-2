import { Check } from "lucide-react";

import { cn } from "./cn";

interface StepperProps {
  steps: string[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol
      className={cn(
        "flex w-full items-center gap-2 md:gap-4",
        className,
      )}
      aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}
    >
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={label}
            className="flex flex-1 items-center gap-2 min-w-0"
          >
            <div
              className={cn(
                "size-8 shrink-0 rounded-full grid place-items-center text-sm font-medium",
                done && "bg-primary text-on-primary",
                active && "bg-primary text-on-primary ring-4 ring-primary/15",
                !done && !active && "bg-surface-container-high text-on-surface-variant",
              )}
              aria-current={active ? "step" : undefined}
            >
              {done ? <Check className="size-4" aria-hidden /> : i + 1}
            </div>

            <span
              className={cn(
                "hidden md:inline truncate text-sm",
                active ? "font-medium text-on-surface" : "text-on-surface-variant",
              )}
            >
              {label}
            </span>

            {i < steps.length - 1 && (
              <span
                className={cn(
                  "h-0.5 flex-1 rounded",
                  done ? "bg-primary" : "bg-surface-container-high",
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
