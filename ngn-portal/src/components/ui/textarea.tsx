import * as React from "react";

import { cn } from "./cn";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  showCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { invalid, showCount, maxLength, className, value, ...props },
    ref,
  ) {
    const length = typeof value === "string" ? value.length : 0;
    return (
      <div className="space-y-1">
        <textarea
          ref={ref}
          aria-invalid={invalid || undefined}
          maxLength={maxLength}
          value={value}
          className={cn(
            "min-h-[6rem] w-full rounded border bg-surface-container-lowest",
            "px-3 py-2 text-body-md text-on-surface",
            "placeholder:text-on-surface-variant",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "disabled:opacity-50 disabled:bg-surface-container",
            invalid
              ? "border-error focus:ring-error focus:border-error"
              : "border-outline-variant",
            className,
          )}
          {...props}
        />
        {showCount && maxLength && (
          <p className="text-xs text-on-surface-variant text-right">
            {length} / {maxLength}
          </p>
        )}
      </div>
    );
  },
);
