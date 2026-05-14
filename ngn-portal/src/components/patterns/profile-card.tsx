import Link from "next/link";
import { Building2, MapPin } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { Member } from "@/lib/data/types";

const MENTORSHIP_LABEL = {
  accepting_mentees: { label: "Accepting mentees", tone: "success" },
  looking_for_mentor: { label: "Seeking mentor", tone: "info" },
  both: { label: "Mentor & mentee", tone: "brand" },
  not_now: { label: "Not available", tone: "neutral" },
} as const;

export function ProfileCard({ member }: { member: Member }) {
  const mentorship = MENTORSHIP_LABEL[member.mentorshipStatus];
  return (
    <Card className="p-4 md:p-5 h-full">
      <Link
        href={`/connect/${member.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
      >
        <div className="flex gap-3 items-start">
          <Avatar src={member.avatarUrl} name={member.name} size={48} />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-on-surface truncate">
              {member.name}
            </h3>
            <p className="text-sm text-on-surface-variant truncate">
              {member.title}
            </p>
          </div>
        </div>

        <ul className="mt-3 space-y-1 text-sm text-on-surface-variant">
          <li className="flex items-center gap-1.5 min-w-0">
            <Building2 className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{member.organisation}</span>
          </li>
          <li className="flex items-center gap-1.5 min-w-0">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{member.country}</span>
          </li>
        </ul>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.expertise.slice(0, 3).map((tag) => (
            <Tag key={tag} size="sm">
              {tag}
            </Tag>
          ))}
        </div>

        <div className="mt-3">
          <Badge tone={mentorship.tone}>{mentorship.label}</Badge>
        </div>
      </Link>
    </Card>
  );
}
