"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "bg-surface-container-lowest text-on-surface border border-outline-variant rounded-lg shadow-level-2",
        },
      }}
    />
  );
}

export { toast };
