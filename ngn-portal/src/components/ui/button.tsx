"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "./cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
  fullWidth?: boolean;
}

const VARIANT: Record<ButtonVariant, string> = {
  // Primary CTA: MIF Orange per DESIGN.md §Buttons
  primary:
    "bg-secondary-container text-on-secondary hover:bg-secondary-container/90 active:bg-secondary-container/80",
  // Secondary: outlined MIF Blue
  secondary:
    "border-2 border-primary text-primary bg-transparent hover:bg-primary/5 active:bg-primary/10",
  // Ghost: transparent
  ghost:
    "bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10",
  destructive:
    "bg-error text-on-error hover:bg-error/90 active:bg-error/80",
  outline:
    "border border-outline-variant text-on-surface bg-surface-container-lowest hover:bg-surface-container active:bg-surface-container-high",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-12 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading,
      disabled,
      asChild,
      fullWidth,
      className,
      children,
      ...props
    },
    ref,
  ) {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded font-medium",
      "transition-colors",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "disabled:opacity-50 disabled:pointer-events-none",
      VARIANT[variant],
      SIZE[size],
      fullWidth && "w-full",
      className,
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{
        className?: string;
        "aria-disabled"?: boolean;
      }>;
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        "aria-disabled": disabled || loading,
      });
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
