import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "./cn";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "py-12 px-6 rounded-lg",
        "bg-afro-pattern",
        className,
      )}
    >
      {Icon && (
        <div className="size-12 rounded-full bg-primary/10 grid place-items-center mb-4">
          <Icon className="size-6 text-primary" aria-hidden />
        </div>
      )}
      <h3 className="text-headline-md text-on-surface">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-body-md text-on-surface-variant">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
