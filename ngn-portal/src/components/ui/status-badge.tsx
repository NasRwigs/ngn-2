import { CheckCircle2, Clock, AlertTriangle, CheckCheck } from "lucide-react";

import { Badge } from "./badge";
import type { PairStatus } from "@/lib/taxonomy/statuses";

const META: Record<
  PairStatus,
  { tone: "success" | "warning" | "error" | "info"; icon: typeof Clock }
> = {
  Active: { tone: "success", icon: CheckCircle2 },
  Pending: { tone: "warning", icon: Clock },
  "At Risk": { tone: "error", icon: AlertTriangle },
  Completed: { tone: "info", icon: CheckCheck },
};

export function PairStatusBadge({ status }: { status: PairStatus }) {
  const meta = META[status];
  const Icon = meta.icon;
  return (
    <Badge tone={meta.tone} size="md">
      <Icon className="size-3" aria-hidden />
      {status}
    </Badge>
  );
}
