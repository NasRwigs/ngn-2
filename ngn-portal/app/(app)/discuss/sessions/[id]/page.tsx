import { notFound } from "next/navigation";

import { Avatar } from "@/components/app-shell/avatar";
import { Badge } from "@/components/ui/badge";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { DataList } from "@/components/ui/data-list";
import { PageHeader } from "@/components/ui/page-header";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { formatDateTime } from "@/lib/format/date";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { queries } = await dataProvider();
  const session = await queries.sessions.byId(id);
  return { title: session?.title ?? "Session not found" };
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { queries } = await dataProvider();
  const session = await queries.sessions.byId(id);
  if (!session) notFound();
  const host = findMember(session.hostId);
  const upcoming = new Date(session.startAt).getTime() >= Date.now();

  return (
    <>
      <BackLink href="/discuss/sessions" className="mt-4">
        Back to sessions
      </BackLink>
      <PageHeader
        title={session.title}
        description={session.description}
        meta={
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="info">{session.programmeArea}</Badge>
            <Badge tone="neutral">{session.format}</Badge>
          </div>
        }
        actions={
          upcoming ? (
            session.registeredCount >= session.capacity ? (
              <Button disabled>Session full</Button>
            ) : (
              <Button>Register</Button>
            )
          ) : session.recordingUrl ? (
            <Button asChild>
              <a href={session.recordingUrl} target="_blank" rel="noreferrer">
                Watch recording
              </a>
            </Button>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 md:p-6 lg:col-span-1 h-fit">
          {host && (
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={host.avatarUrl} name={host.name} size={48} />
              <div className="min-w-0">
                <p className="font-medium text-on-surface truncate">
                  {host.name}
                </p>
                <p className="text-sm text-on-surface-variant truncate">
                  {host.title}
                </p>
              </div>
            </div>
          )}
          <DataList
            items={[
              { label: "When", value: formatDateTime(session.startAt) },
              { label: "Format", value: session.format },
              {
                label: "Capacity",
                value: `${session.registeredCount} / ${session.capacity}`,
              },
            ]}
          />
        </Card>

        <Card className="p-5 md:p-6 lg:col-span-2">
          <CardTitle>About</CardTitle>
          <p className="mt-3 text-body-md text-on-surface whitespace-pre-line">
            {session.description}
          </p>
        </Card>
      </div>
    </>
  );
}
