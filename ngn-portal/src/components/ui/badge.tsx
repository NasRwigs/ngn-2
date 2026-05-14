import * as React from "react";

import { cn } from "./cn";

export type BadgeTone =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "neutral"
  | "brand";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
}

const TONE: Record<BadgeTone, string> = {
  info: "bg-primary/10 text-primary",
  success: "bg-success-container text-on-success-container",
  warning: "bg-warning-container text-on-warning-container",
  error: "bg-error-container text-on-error-container",
  neutral: "bg-surface-container-high text-on-surface-variant",
  brand: "bg-secondary-container text-on-secondary",
};

const SIZE = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export function Badge({
  tone = "neutral",
  size = "md",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-wide",
        TONE[tone],
        SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
