import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveTable, type TableColumn } from "@/components/ui/responsive-table";
import { dataProvider } from "@/lib/data";
import { formatDate } from "@/lib/format/date";
import type { OneToManySession } from "@/lib/data/types";

export const metadata = { title: "Sessions archive" };

const COLUMNS: TableColumn<OneToManySession>[] = [
  {
    key: "title",
    header: "Title",
    primary: true,
    cell: (s) => <span className="font-medium">{s.title}</span>,
  },
  {
    key: "area",
    header: "Programme",
    cell: (s) => s.programmeArea,
  },
  {
    key: "date",
    header: "Date",
    cell: (s) => formatDate(s.startAt),
  },
  {
    key: "attendees",
    header: "Attendees",
    cell: (s) => `${s.registeredCount}`,
    mobile: false,
  },
];

export default async function SessionsArchivePage() {
  const { queries } = await dataProvider();
  const all = await queries.sessions.list();
  const past = all.filter(
    (s) => new Date(s.endAt).getTime() < Date.now(),
  );

  return (
    <>
      <BackLink href="/discuss/sessions" className="mt-4">
        Back to sessions
      </BackLink>
      <PageHeader
        title="Sessions archive"
        description={`${past.length} past sessions. Recordings available where shared.`}
      />
      <ResponsiveTable
        rows={past}
        columns={COLUMNS}
        keyOf={(s) => s.id}
        rowHref={(s) => `/discuss/sessions/${s.id}`}
        empty={
          <p className="text-body-md text-on-surface-variant py-12 text-center">
            No past sessions yet.
          </p>
        }
      />
    </>
  );
}
