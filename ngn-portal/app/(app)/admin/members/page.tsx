import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ResponsiveTable, type TableColumn } from "@/components/ui/responsive-table";
import { ROLE_LABELS } from "@/components/app-shell";
import { dataProvider } from "@/lib/data";
import { formatDate, formatRelative } from "@/lib/format/date";
import type { Member } from "@/lib/data/types";

export const metadata = { title: "Member management" };

const COLUMNS: TableColumn<Member>[] = [
  {
    key: "name",
    header: "Name",
    cell: (m) => <span className="font-medium">{m.name}</span>,
    primary: true,
  },
  {
    key: "role",
    header: "Role",
    cell: (m) => <Badge tone={m.role === "exco" ? "brand" : "info"}>{ROLE_LABELS[m.role]}</Badge>,
  },
  {
    key: "country",
    header: "Country",
    cell: (m) => m.country,
  },
  {
    key: "organisation",
    header: "Organisation",
    cell: (m) => m.organisation,
  },
  {
    key: "joined",
    header: "Joined",
    cell: (m) => formatDate(m.joinedAt),
    mobile: false,
  },
  {
    key: "lastActive",
    header: "Last active",
    cell: (m) => formatRelative(m.lastActiveAt),
  },
];

export default async function AdminMembersPage() {
  const { queries } = await dataProvider();
  const members = await queries.admin.membersAdmin();

  return (
    <>
      <PageHeader
        title="Members"
        description={`Manage ${members.length} members. Invite new members, edit roles, or review activity.`}
        actions={
          <Button asChild>
            <Link href="/admin/members/invite">
              <Plus className="size-4" aria-hidden />
              Invite member
            </Link>
          </Button>
        }
      />

      <ResponsiveTable
        rows={members}
        columns={COLUMNS}
        keyOf={(m) => m.id}
        caption="All members"
        rowHref={(m) => `/connect/${m.slug}`}
      />
    </>
  );
}
