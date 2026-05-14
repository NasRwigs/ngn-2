import { Users } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { dataProvider } from "@/lib/data";

import { ConnectClient } from "./connect-client";

export const metadata = { title: "Connect" };

export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; sector?: string }>;
}) {
  const params = await searchParams;
  const { queries } = await dataProvider();
  const members = await queries.members.list({
    query: params.q,
    country: params.country,
    sector: params.sector,
  });

  return (
    <>
      <PageHeader
        title="Connect"
        description="Browse and connect with NGN members across sectors, countries, and disciplines."
      />

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No members match your filters"
          description="Try clearing one filter or searching with different keywords."
        />
      ) : (
        <ConnectClient members={members} />
      )}
    </>
  );
}
