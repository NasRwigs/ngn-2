import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveTable, type TableColumn } from "@/components/ui/responsive-table";
import { dataProvider } from "@/lib/data";
import type { DiscussionSpace } from "@/lib/data/types";

import { ModerationQueue } from "./moderation-queue";

export const metadata = { title: "Admin · Spaces" };

const COLUMNS: TableColumn<DiscussionSpace>[] = [
  {
    key: "name",
    header: "Name",
    primary: true,
    cell: (s) => <span className="font-medium">{s.name}</span>,
  },
  {
    key: "area",
    header: "Programme",
    cell: (s) => s.programmeArea ?? "—",
  },
  {
    key: "members",
    header: "Members",
    cell: (s) => s.memberCount,
  },
];

export default async function AdminSpacesPage() {
  const { queries } = await dataProvider();
  const [spaces, reports] = await Promise.all([
    queries.spaces.list(),
    queries.admin.moderationQueue(),
  ]);

  return (
    <>
      <PageHeader
        title="Discussion space management"
        description={`Manage ${spaces.length} discussion spaces, members, and moderation.`}
        actions={
          <Button asChild>
            <Link href="/admin/spaces/new">
              <Plus className="size-4" aria-hidden />
              Create space
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section>
          <h2 className="text-headline-md text-on-surface mb-3">Spaces</h2>
          <ResponsiveTable
            rows={spaces}
            columns={COLUMNS}
            keyOf={(s) => s.id}
            rowHref={(s) => `/discuss/spaces/${s.slug}`}
          />
        </section>

        <section>
          <h2 className="text-headline-md text-on-surface mb-3">
            Moderation queue
          </h2>
          <ModerationQueue reports={reports} />
        </section>
      </div>
    </>
  );
}
