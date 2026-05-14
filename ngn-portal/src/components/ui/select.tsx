import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "./cn";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ invalid, className, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-11 w-full appearance-none rounded border bg-surface-container-lowest",
            "px-3 pr-10 text-body-md text-on-surface",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "disabled:opacity-50 disabled:bg-surface-container",
            invalid
              ? "border-error focus:ring-error focus:border-error"
              : "border-outline-variant",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant"
          aria-hidden
        />
      </div>
    );
  },
);
