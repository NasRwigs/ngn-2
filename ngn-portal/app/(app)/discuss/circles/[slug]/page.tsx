import { notFound } from "next/navigation";
import { Users } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { DataList } from "@/components/ui/data-list";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/format/date";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const circle = await queries.circles.bySlug(slug);
  return { title: circle?.name ?? "Circle not found" };
}

export default async function CircleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const [circle, user] = await Promise.all([
    queries.circles.bySlug(slug),
    getCurrentUser(),
  ]);
  if (!circle) notFound();

  const isMember = circle.memberIds.includes(user.id);
  const isFull = circle.memberIds.length >= circle.capacity;

  return (
    <>
      <BackLink href="/discuss/circles" className="mt-4">
        Back to circles
      </BackLink>
      <PageHeader
        title={circle.name}
        description={circle.topic}
        meta={
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag>{circle.cadence}</Tag>
            <Tag>
              {circle.memberIds.length} / {circle.capacity} members
            </Tag>
          </div>
        }
        actions={
          isMember ? (
            <Button variant="outline">Leave circle</Button>
          ) : (
            <Button disabled={isFull}>
              {isFull ? "Full" : "Join circle"}
            </Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 md:p-6">
            <CardTitle>About</CardTitle>
            <p className="mt-3 text-body-md text-on-surface whitespace-pre-line">
              {circle.description}
            </p>
          </Card>

          <Card className="p-5 md:p-6">
            <CardTitle>Members</CardTitle>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {circle.memberIds.map((memberId) => {
                const member = findMember(memberId);
                if (!member) return null;
                const isFacilitator = circle.facilitators.includes(memberId);
                return (
                  <li
                    key={memberId}
                    className="flex items-center gap-2 p-2 rounded hover:bg-surface-container"
                  >
                    <Avatar
                      src={member.avatarUrl}
                      name={member.name}
                      size={36}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {member.title}
                      </p>
                    </div>
                    {isFacilitator && <Tag size="sm">Facilitator</Tag>}
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <Card className="p-5 md:p-6 h-fit">
          <CardTitle>Details</CardTitle>
          <div className="mt-3">
            <DataList
              items={[
                { label: "Cadence", value: circle.cadence },
                {
                  label: "Capacity",
                  value: (
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-4" aria-hidden />
                      {circle.memberIds.length} / {circle.capacity}
                    </span>
                  ),
                },
                { label: "Created", value: formatDate(circle.createdAt) },
                {
                  label: "Facilitators",
                  value: circle.facilitators
                    .map((id) => findMember(id)?.name ?? id)
                    .join(", "),
                },
              ]}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
