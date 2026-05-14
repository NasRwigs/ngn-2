import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, FileText, MessageSquare, Plus } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { SessionTimeline } from "@/components/patterns/session-timeline";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { DataList } from "@/components/ui/data-list";
import { PageHeader } from "@/components/ui/page-header";
import { PairStatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tag } from "@/components/ui/tag";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/format/date";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const { queries } = await dataProvider();
  const pair = await queries.pairs.byId(id);
  if (!pair) return { title: "Pair not found" };
  const mentor = findMember(pair.mentorId);
  const mentee = findMember(pair.menteeId);
  return { title: `${mentee?.name ?? "Mentee"} × ${mentor?.name ?? "Mentor"}` };
}

const GOAL_STATUS_LABEL: Record<string, { tone: "success" | "info" | "neutral"; label: string }> = {
  completed: { tone: "success", label: "Completed" },
  in_progress: { tone: "info", label: "In progress" },
  not_started: { tone: "neutral", label: "Not started" },
};

export default async function PairDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { queries } = await dataProvider();
  const [pair, user] = await Promise.all([
    queries.pairs.byId(id),
    getCurrentUser(),
  ]);
  if (!pair) notFound();

  const sessions = await queries.pairs.sessions(pair.id);
  const counterpartId =
    pair.mentorId === user.id ? pair.menteeId : pair.mentorId;
  const counterpart = findMember(counterpartId);
  const myRole = pair.mentorId === user.id ? "mentor" : "mentee";

  return (
    <>
      <BackLink href="/mentor" className="mt-4">
        Back to mentor
      </BackLink>

      <PageHeader
        title={counterpart?.name ?? "Pair"}
        description={`You are the ${myRole} · ${pair.cohort}`}
        meta={<PairStatusBadge status={pair.status} />}
        actions={
          <>
            <Button asChild variant="secondary">
              <Link href={`/message?to=${counterpartId}`}>
                <MessageSquare className="size-4" aria-hidden />
                Message
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/mentor/pairs/${pair.id}/log`}>
                <Plus className="size-4" aria-hidden />
                Log session
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 md:p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-3">
            <Avatar
              src={counterpart?.avatarUrl}
              name={counterpart?.name ?? "?"}
              size={64}
            />
            <div className="min-w-0">
              <h2 className="font-bold text-on-surface truncate">
                {counterpart?.name}
              </h2>
              <p className="text-sm text-on-surface-variant truncate">
                {counterpart?.title}
              </p>
            </div>
          </div>

          <hr className="my-4 border-t border-outline-variant" aria-hidden />

          <DataList
            items={[
              { label: "Started", value: formatDate(pair.startedAt) },
              { label: "Cadence", value: pair.cadence },
              {
                label: "Programme length",
                value: `${pair.programmeMonths} months`,
              },
              {
                label: "Next meeting",
                value: pair.nextMeetingAt
                  ? formatDate(pair.nextMeetingAt)
                  : "Not scheduled",
              },
            ]}
          />

          <hr className="my-4 border-t border-outline-variant" aria-hidden />

          <ProgressBar
            label="Programme progress"
            value={pair.monthsCompleted}
            max={pair.programmeMonths}
            showValue
          />
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 md:p-6">
            <header className="flex items-center justify-between mb-3">
              <CardTitle>Goals</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/mentor/pairs/${pair.id}/intake`}>
                  Edit goals
                </Link>
              </Button>
            </header>

            {pair.goals.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">
                No goals set yet.{" "}
                <Link
                  href={`/mentor/pairs/${pair.id}/intake`}
                  className="text-primary hover:underline"
                >
                  Complete intake
                </Link>{" "}
                to define your engagement.
              </p>
            ) : (
              <ul className="space-y-3">
                {pair.goals.map((goal) => {
                  const meta = GOAL_STATUS_LABEL[goal.status] ?? GOAL_STATUS_LABEL.not_started;
                  return (
                    <li
                      key={goal.id}
                      className="border-l-2 border-outline-variant pl-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-on-surface">
                          {goal.title}
                        </h3>
                        <Tag size="sm">{meta?.label}</Tag>
                      </div>
                      <p className="text-sm text-on-surface-variant mt-1">
                        {goal.successCriteria}
                      </p>
                      {goal.notes && (
                        <p className="text-sm text-on-surface mt-1 italic">
                          {goal.notes}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          <Card className="p-5 md:p-6">
            <header className="flex items-center justify-between mb-3">
              <CardTitle>Sessions</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/mentor/pairs/${pair.id}/log`}>
                  <Plus className="size-4" aria-hidden />
                  Log session
                </Link>
              </Button>
            </header>

            <SessionTimeline sessions={sessions} />
          </Card>

          <Card className="p-5 md:p-6">
            <header className="flex items-center justify-between mb-3">
              <CardTitle>Resources</CardTitle>
            </header>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-on-surface">
                <FileText className="size-4 text-on-surface-variant" aria-hidden />
                <Link href="#" className="hover:underline">
                  Mentor &amp; mentee handbook
                </Link>
              </li>
              <li className="flex items-center gap-2 text-on-surface">
                <Calendar className="size-4 text-on-surface-variant" aria-hidden />
                <Link href="#" className="hover:underline">
                  Cohort calendar
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
