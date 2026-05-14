import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format/date";
import type { NgnEvent } from "@/lib/data/types";

export function EventCard({ event }: { event: NgnEvent }) {
  return (
    <Card className="p-4 md:p-5">
      <Link
        href={`/events/${event.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded space-y-3"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone="info">{event.programmeArea}</Badge>
          <Badge tone="neutral">{event.format}</Badge>
        </div>

        <div>
          <h3 className="font-medium text-on-surface line-clamp-2">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">
            {event.description}
          </p>
        </div>

        <ul className="space-y-1 text-sm text-on-surface-variant">
          <li className="flex items-center gap-1.5">
            <Calendar className="size-4 shrink-0" aria-hidden />
            <span>{formatDateTime(event.startAt)}</span>
          </li>
          {event.location && (
            <li className="flex items-center gap-1.5">
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{event.location}</span>
            </li>
          )}
          {event.registrationRequired && event.capacity && (
            <li className="flex items-center gap-1.5">
              <Users className="size-4 shrink-0" aria-hidden />
              <span>
                {event.registeredCount}/{event.capacity} registered
              </span>
            </li>
          )}
        </ul>
      </Link>
    </Card>
  );
}
