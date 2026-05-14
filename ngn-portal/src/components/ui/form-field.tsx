import * as React from "react";

import { cn } from "./cn";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  helper?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required,
  helper,
  error,
  className,
  children,
}: FormFieldProps) {
  const helperId = `${htmlFor}-helper`;
  const errorId = `${htmlFor}-error`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-on-surface"
      >
        {label}
        {required && (
          <span className="ml-0.5 text-error" aria-hidden>
            *
          </span>
        )}
      </label>
      <div
        aria-describedby={
          cn(helper ? helperId : null, error ? errorId : null)
            .trim()
            .replace(/\s+/g, " ") || undefined
        }
      >
        {children}
      </div>
      {helper && !error && (
        <p id={helperId} className="text-xs text-on-surface-variant">
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
