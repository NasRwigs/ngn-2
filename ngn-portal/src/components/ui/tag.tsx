import * as React from "react";
import { X } from "lucide-react";

import { cn } from "./cn";

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  onRemove?: () => void;
  size?: "sm" | "md";
}

export function Tag({
  selected,
  onRemove,
  size = "md",
  className,
  children,
  ...props
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full",
        "transition-colors",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        selected
          ? "bg-primary text-on-primary"
          : "bg-surface-container-high text-on-surface-variant",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove tag"
          className="-mr-1 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <X className="size-3" aria-hidden />
        </button>
      )}
    </span>
  );
}

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/** Clickable filter chip. */
export function FilterChip({
  selected,
  className,
  children,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected || undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full",
        "px-3 py-1.5 text-sm font-medium",
        "transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected
          ? "bg-primary text-on-primary"
          : "bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
