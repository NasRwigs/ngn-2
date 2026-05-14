import * as React from "react";

import { cn } from "./cn";

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  meta,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        "py-4 md:py-6",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-headline-lg md:text-headline-lg text-on-surface">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-body-md text-on-surface-variant">
            {description}
          </p>
        )}
        {meta && <div className="mt-2">{meta}</div>}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
}
