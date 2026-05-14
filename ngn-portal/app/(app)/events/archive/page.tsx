import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveTable, type TableColumn } from "@/components/ui/responsive-table";
import { Badge } from "@/components/ui/badge";
import { dataProvider } from "@/lib/data";
import { formatDate } from "@/lib/format/date";
import type { NgnEvent } from "@/lib/data/types";

export const metadata = { title: "Events archive" };

const COLUMNS: TableColumn<NgnEvent>[] = [
  {
    key: "title",
    header: "Title",
    cell: (e) => <span className="font-medium">{e.title}</span>,
    primary: true,
  },
  {
    key: "area",
    header: "Programme",
    cell: (e) => <Badge tone="info">{e.programmeArea}</Badge>,
  },
  {
    key: "date",
    header: "Date",
    cell: (e) => formatDate(e.startAt),
  },
  {
    key: "registered",
    header: "Attendees",
    cell: (e) => `${e.registeredCount}`,
    mobile: false,
  },
];

export default async function EventArchivePage() {
  const { queries } = await dataProvider();
  const all = await queries.events.list();
  const past = all
    .filter((e) => new Date(e.endAt).getTime() < Date.now())
    .sort((a, b) => b.startAt.localeCompare(a.startAt));

  return (
    <>
      <BackLink href="/events" className="mt-4">
        Back to events
      </BackLink>
      <PageHeader
        title="Events archive"
        description={`${past.length} past events. Browse recordings, materials, and recaps.`}
      />
      <ResponsiveTable
        rows={past}
        columns={COLUMNS}
        keyOf={(e) => e.id}
        rowHref={(e) => `/events/${e.slug}`}
        empty={
          <p className="text-body-md text-on-surface-variant py-12 text-center">
            No archived events yet.
          </p>
        }
      />
    </>
  );
}
