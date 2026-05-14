import { Clock, Video, Phone, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format/date";
import type { Session } from "@/lib/data/types";

const FORMAT_ICONS = {
  video: Video,
  phone: Phone,
  in_person: MapPin,
};

const WELLBEING_TONE = {
  great: "success",
  good: "info",
  fair: "warning",
  poor: "error",
} as const;

export function SessionTimeline({ sessions }: { sessions: Session[] }) {
  if (sessions.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant">
        No sessions logged yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4">
      <span
        className="absolute left-4 top-2 bottom-2 w-px bg-outline-variant"
        aria-hidden
      />
      {sessions.map((session) => {
        const Icon = FORMAT_ICONS[session.format];
        return (
          <li key={session.id} className="relative pl-10">
            <span
              className="absolute left-1.5 top-3 size-5 rounded-full bg-primary text-on-primary grid place-items-center"
              aria-hidden
            >
              <Icon className="size-3" />
            </span>
            <Card className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-on-surface">
                    {formatDate(session.date)}
                  </div>
                  <div className="text-xs text-on-surface-variant inline-flex items-center gap-1 mt-0.5">
                    <Clock className="size-3" aria-hidden />
                    {session.durationMinutes} min · {session.format.replace("_", " ")}
                  </div>
                </div>
                <Badge tone={WELLBEING_TONE[session.wellbeing]}>
                  {session.wellbeing}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-on-surface">{session.notes}</p>
            </Card>
          </li>
        );
      })}
    </ol>
  );
}
