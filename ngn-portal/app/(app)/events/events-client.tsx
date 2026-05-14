"use client";

import * as React from "react";
import { Grid3x3, List } from "lucide-react";

import { EventCard } from "@/components/patterns/event-card";
import { Segmented } from "@/components/ui/segmented";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROGRAMME_AREAS } from "@/lib/taxonomy/programme-areas";
import { formatDateTime } from "@/lib/format/date";
import type { NgnEvent } from "@/lib/data/types";

import Link from "next/link";

type View = "list" | "calendar";

export function EventsClient({ events }: { events: NgnEvent[] }) {
  const [view, setView] = React.useState<View>("list");
  const [area, setArea] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    if (area === "all") return events;
    return events.filter((e) => e.programmeArea === area);
  }, [events, area]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, NgnEvent[]>();
    for (const event of filtered) {
      const month = event.startAt.slice(0, 7);
      if (!map.has(month)) map.set(month, []);
      map.get(month)!.push(event);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={area} onValueChange={setArea}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {PROGRAMME_AREAS.filter((a) => a !== "General / Cross-cutting").map((a) => (
              <TabsTrigger key={a} value={a}>
                {a}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Segmented
          ariaLabel="View"
          value={view}
          onChange={setView}
          options={[
            { value: "list", label: "List", icon: <List className="size-3.5" /> },
            { value: "calendar", label: "Calendar", icon: <Grid3x3 className="size-3.5" /> },
          ]}
        />
      </div>

      {view === "list" ? (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <li key={event.id}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-6">
          {grouped.map(([month, monthEvents]) => (
            <section key={month}>
              <h3 className="font-medium text-on-surface mb-2">
                {new Date(month + "-01").toLocaleString("en-GB", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <ol className="rounded-lg border border-outline-variant bg-surface-container-lowest divide-y divide-outline-variant">
                {monthEvents.map((event) => (
                  <li key={event.id}>
                    <Link
                      href={`/events/${event.slug}`}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <time
                        dateTime={event.startAt}
                        className="text-sm text-on-surface-variant sm:w-48 shrink-0"
                      >
                        {formatDateTime(event.startAt)}
                      </time>
                      <span className="font-medium text-on-surface flex-1">
                        {event.title}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-on-surface-variant">
                        {event.programmeArea} · {event.format}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
