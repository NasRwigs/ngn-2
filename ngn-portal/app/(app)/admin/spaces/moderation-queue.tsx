"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tag } from "@/components/ui/tag";
import { toast } from "@/components/ui/toaster";
import type { ModerationReport } from "@/lib/data/types";

import { moderationResolveAction } from "./actions";

interface ModerationQueueProps {
  reports: ModerationReport[];
}

export function ModerationQueue({ reports: initialReports }: ModerationQueueProps) {
  const router = useRouter();
  const [pending, setPending] = React.useState<string | null>(null);

  async function resolve(id: string, action: "keep" | "remove") {
    setPending(id);
    try {
      await moderationResolveAction(id, action);
      toast.success(
        action === "keep" ? "Content kept and flag dismissed" : "Content removed",
      );
      router.refresh();
    } catch {
      toast.error("Could not update the queue.");
    } finally {
      setPending(null);
    }
  }

  if (initialReports.length === 0) {
    return (
      <EmptyState
        icon={Check}
        title="Queue clear"
        description="No reported content needs review."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {initialReports.map((item) => (
        <li key={item.id}>
          <Card className="p-4" accent="orange">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" aria-hidden />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Tag size="sm">{item.spaceName}</Tag>
                  <Tag size="sm">{item.kind}</Tag>
                  <span className="text-xs text-on-surface-variant">
                    {item.reason}
                  </span>
                </div>
                <p className="mt-2 text-sm text-on-surface line-clamp-3">
                  &ldquo;{item.body}&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={pending === item.id}
                    onClick={() => void resolve(item.id, "keep")}
                  >
                    <Check className="size-4" aria-hidden />
                    Keep
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={pending === item.id}
                    onClick={() => void resolve(item.id, "remove")}
                  >
                    <X className="size-4" aria-hidden />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
