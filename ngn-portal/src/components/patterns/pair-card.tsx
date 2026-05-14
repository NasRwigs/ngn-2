import Link from "next/link";
import { Calendar } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { Card } from "@/components/ui/card";
import { PairStatusBadge } from "@/components/ui/status-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatDate } from "@/lib/format/date";
import type { Pair } from "@/lib/data/types";
import { findMember } from "@/lib/data/fixtures/members";

interface PairCardProps {
  pair: Pair;
  /** Whose perspective am I viewing this from? */
  viewerId: string;
}

export function PairCard({ pair, viewerId }: PairCardProps) {
  const counterpartId =
    pair.mentorId === viewerId ? pair.menteeId : pair.mentorId;
  const counterpart = findMember(counterpartId);
  const role = pair.mentorId === viewerId ? "Mentee" : "Mentor";

  const completedGoals = pair.goals.filter((g) => g.status === "completed")
    .length;

  return (
    <Card className="p-4 md:p-5">
      <Link
        href={`/mentor/pairs/${pair.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar
              src={counterpart?.avatarUrl}
              name={counterpart?.name ?? "?"}
              size={48}
            />
            <div className="min-w-0">
              <h3 className="font-medium text-on-surface truncate">
                {counterpart?.name ?? "Unknown"}
              </h3>
              <p className="text-sm text-on-surface-variant truncate">
                {role} · {pair.cohort}
              </p>
            </div>
          </div>
          <PairStatusBadge status={pair.status} />
        </div>

        <ProgressBar
          label="Programme progress"
          value={pair.monthsCompleted}
          max={pair.programmeMonths}
          showValue
        />

        <div className="flex items-center justify-between text-sm text-on-surface-variant">
          <span>
            {completedGoals}/{pair.goals.length} goals
          </span>
          {pair.nextMeetingAt && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-4" aria-hidden />
              Next: {formatDate(pair.nextMeetingAt)}
            </span>
          )}
        </div>
      </Link>
    </Card>
  );
}
