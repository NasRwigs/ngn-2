import { AlertOctagon } from "lucide-react";

import { Button } from "./button";
import { Card } from "./card";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "We hit an error",
  description = "Try again, and if it persists let us know.",
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="p-6 text-center" accent="red">
      <div className="size-12 rounded-full bg-error-container grid place-items-center mx-auto mb-4">
        <AlertOctagon className="size-6 text-error" aria-hidden />
      </div>
      <h3 className="text-headline-md text-on-surface">{title}</h3>
      <p className="mt-2 text-body-md text-on-surface-variant">{description}</p>
      {onRetry && (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </Card>
  );
}
