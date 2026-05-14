import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PairStatusBadge } from "@/components/ui/status-badge";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveTable, type TableColumn } from "@/components/ui/responsive-table";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { formatDate } from "@/lib/format/date";
import type { Pair } from "@/lib/data/types";

export const metadata = { title: "Mentorship management" };

const COLUMNS: TableColumn<Pair>[] = [
  {
    key: "pair",
    header: "Pair",
    primary: true,
    cell: (pair) => {
      const mentor = findMember(pair.mentorId);
      const mentee = findMember(pair.menteeId);
      return (
        <span className="font-medium">
          {mentee?.name ?? "Mentee"} × {mentor?.name ?? "Mentor"}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    cell: (pair) => <PairStatusBadge status={pair.status} />,
  },
  {
    key: "cohort",
    header: "Cohort",
    cell: (pair) => pair.cohort,
  },
  {
    key: "started",
    header: "Started",
    cell: (pair) => formatDate(pair.startedAt),
    mobile: false,
  },
  {
    key: "progress",
    header: "Progress",
    cell: (pair) => `${pair.monthsCompleted} / ${pair.programmeMonths} mo`,
  },
];

export default async function AdminMentorshipPage() {
  const { queries } = await dataProvider();
  const members = await queries.admin.membersAdmin();
  const seen = new Set<string>();
  const allPairs: Pair[] = [];
  for (const m of members) {
    for (const p of await queries.pairs.forUser(m.id)) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        allPairs.push(p);
      }
    }
  }

  return (
    <>
      <PageHeader
        title="Mentorship"
        description={`Manage ${allPairs.length} active pairs across cohorts.`}
        actions={
          <Button asChild>
            <Link href="/admin/mentorship/matching">Matching workspace</Link>
          </Button>
        }
      />

      <ResponsiveTable
        rows={allPairs}
        columns={COLUMNS}
        keyOf={(p) => p.id}
        rowHref={(p) => `/admin/mentorship/${p.id}`}
        caption="All mentorship pairs"
      />
    </>
  );
}
