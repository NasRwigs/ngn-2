import * as React from "react";

import { cn } from "./cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  /** Icon shown inside the input, left side. */
  leading?: React.ReactNode;
  /** Element shown inside the input, right side. */
  trailing?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    { invalid, leading, trailing, className, ...props },
    ref,
  ) {
    return (
      <div className="relative">
        {leading && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {leading}
          </span>
        )}
        <input
          ref={ref}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-11 w-full rounded border bg-surface-container-lowest",
            "px-3 text-body-md text-on-surface",
            "placeholder:text-on-surface-variant",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "disabled:opacity-50 disabled:bg-surface-container",
            invalid
              ? "border-error focus:ring-error focus:border-error"
              : "border-outline-variant",
            leading ? "pl-10" : "",
            trailing ? "pr-10" : "",
            className,
          )}
          {...props}
        />
        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            {trailing}
          </span>
        )}
      </div>
    );
  },
);
