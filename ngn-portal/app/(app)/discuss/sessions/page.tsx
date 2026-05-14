import Link from "next/link";
import { Calendar, Plus } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { ADMIN_ROLES } from "@/components/app-shell";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/format/date";

export const metadata = { title: "One-to-many sessions" };

export default async function SessionsPage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const sessions = await queries.sessions.list();
  const canCreate = ADMIN_ROLES.includes(user.role) || user.role === "member";

  return (
    <>
      <BackLink href="/discuss" className="mt-4">
        Back to discuss
      </BackLink>
      <PageHeader
        title="One-to-many sessions"
        description="AMAs, masterclasses, and host-led sessions with limited capacity."
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/discuss/sessions/archive">Archive</Link>
            </Button>
            {canCreate && (
              <Button asChild>
                <Link href="/discuss/sessions/new">
                  <Plus className="size-4" aria-hidden />
                  Host session
                </Link>
              </Button>
            )}
          </div>
        }
      />

      {sessions.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No sessions scheduled"
          description="Members and admins can host one-to-many sessions on any topic."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => {
            const host = findMember(session.hostId);
            return (
              <li key={session.id}>
                <Card className="p-5 h-full">
                  <Link
                    href={`/discuss/sessions/${session.id}`}
                    className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    <Tag size="sm">{session.programmeArea}</Tag>
                    <h3 className="mt-2 font-medium text-on-surface">
                      {session.title}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant line-clamp-2">
                      {session.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      {host && (
                        <Avatar
                          src={host.avatarUrl}
                          name={host.name}
                          size={28}
                        />
                      )}
                      <span className="text-sm text-on-surface-variant truncate">
                        {host?.name ?? "Host"}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-on-surface-variant">
                      {formatDateTime(session.startAt)}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {session.registeredCount} / {session.capacity}
                    </p>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
