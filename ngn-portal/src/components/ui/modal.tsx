"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "./cn";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** "modal" = centered dialog (desktop). "sheet" = bottom sheet on mobile, centered on md+. */
    layout?: "modal" | "sheet";
    showClose?: boolean;
  }
>(function DialogContent(
  { children, className, layout = "modal", showClose = true, ...props },
  ref,
) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-inverse-surface/40",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        )}
      />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-surface-container-lowest text-on-surface",
          "shadow-level-2",
          "focus:outline-none",
          layout === "sheet"
            ? cn(
                "inset-x-0 bottom-0 rounded-t-lg",
                "max-h-[92dvh] overflow-y-auto",
                "md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
                "md:w-full md:max-w-lg md:rounded-lg md:max-h-[92dvh]",
              )
            : cn(
                "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                "w-[calc(100%-2rem)] max-w-lg max-h-[92dvh] overflow-y-auto rounded-lg",
              ),
          className,
        )}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            className={cn(
              "absolute right-3 top-3 size-9 grid place-items-center rounded-full",
              "text-on-surface-variant hover:bg-surface-container",
              "focus:outline-none focus:ring-2 focus:ring-primary",
            )}
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pb-2", className)} {...props} />;
}

export function DialogTitle({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-headline-md text-on-surface", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-body-md text-on-surface-variant mt-1", className)}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  );
}

export function DialogBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-4", className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-6 pt-0 flex flex-col-reverse md:flex-row md:justify-end md:items-center gap-2",
        className,
      )}
      {...props}
    />
  );
}
