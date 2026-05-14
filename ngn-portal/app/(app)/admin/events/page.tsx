import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveTable, type TableColumn } from "@/components/ui/responsive-table";
import { dataProvider } from "@/lib/data";
import { formatDate } from "@/lib/format/date";
import type { NgnEvent } from "@/lib/data/types";

export const metadata = { title: "Admin · Events" };

const COLUMNS: TableColumn<NgnEvent>[] = [
  {
    key: "title",
    header: "Title",
    primary: true,
    cell: (e) => <span className="font-medium">{e.title}</span>,
  },
  {
    key: "area",
    header: "Programme",
    cell: (e) => <Badge tone="info">{e.programmeArea}</Badge>,
  },
  {
    key: "date",
    header: "Start",
    cell: (e) => formatDate(e.startAt),
  },
  {
    key: "format",
    header: "Format",
    cell: (e) => e.format,
    mobile: false,
  },
  {
    key: "attendees",
    header: "Registered",
    cell: (e) =>
      e.registrationRequired
        ? `${e.registeredCount}/${e.capacity ?? "—"}`
        : "Open",
  },
];

export default async function AdminEventsPage() {
  const { queries } = await dataProvider();
  const events = await queries.events.list();

  return (
    <>
      <PageHeader
        title="Events management"
        description={`${events.length} events across all programmes.`}
        actions={
          <Button asChild>
            <Link href="/events/new">
              <Plus className="size-4" aria-hidden />
              Create event
            </Link>
          </Button>
        }
      />
      <ResponsiveTable
        rows={events}
        columns={COLUMNS}
        keyOf={(e) => e.id}
        rowHref={(e) => `/events/${e.slug}`}
      />
    </>
  );
}
