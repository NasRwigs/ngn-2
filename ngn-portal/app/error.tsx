"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-dvh grid place-items-center p-6 bg-surface">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-headline-md text-on-surface">Something went wrong</h1>
        <p className="text-body-md text-on-surface-variant">
          We hit an unexpected error. Try again, and if it persists contact your
          ExCo representative.
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
