import Link from "next/link";
import { Plus, Users } from "lucide-react";

import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { ADMIN_ROLES } from "@/components/app-shell";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = { title: "Circles" };

export default async function CirclesPage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const circles = await queries.circles.list();
  const isAdmin = ADMIN_ROLES.includes(user.role);

  return (
    <>
      <BackLink href="/discuss" className="mt-4">
        Back to discuss
      </BackLink>
      <PageHeader
        title="Circles"
        description="Small, facilitated groups that meet on a regular cadence."
        actions={
          isAdmin && (
            <Button asChild>
              <Link href="/discuss/circles/new">
                <Plus className="size-4" aria-hidden />
                Create circle
              </Link>
            </Button>
          )
        }
      />

      {circles.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No circles yet"
          description="A programme admin will set up the first circles."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {circles.map((circle) => (
            <li key={circle.id}>
              <Card className="p-5 h-full">
                <Link
                  href={`/discuss/circles/${circle.slug}`}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <h3 className="font-medium text-on-surface">{circle.name}</h3>
                  <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">
                    {circle.topic}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <Tag size="sm">{circle.cadence}</Tag>
                    <Tag size="sm">
                      {circle.memberIds.length} / {circle.capacity}
                    </Tag>
                  </div>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
