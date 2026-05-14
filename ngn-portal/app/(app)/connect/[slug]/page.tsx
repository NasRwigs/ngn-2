import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, ExternalLink, Globe, Languages, MapPin, MessageSquare, Linkedin } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { Badge } from "@/components/ui/badge";
import { BackLink } from "@/components/ui/back-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataList } from "@/components/ui/data-list";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";
import { formatDate } from "@/lib/format/date";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const MENTORSHIP_LABEL = {
  accepting_mentees: { label: "Accepting mentees", tone: "success" },
  looking_for_mentor: { label: "Seeking mentor", tone: "info" },
  both: { label: "Mentor & mentee", tone: "brand" },
  not_now: { label: "Not available", tone: "neutral" },
} as const;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const member = await queries.members.bySlug(slug);
  if (!member) return { title: "Member not found" };
  return { title: member.name };
}

export default async function MemberProfile({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const [member, user] = await Promise.all([
    queries.members.bySlug(slug),
    getCurrentUser(),
  ]);

  if (!member) notFound();

  const isMe = user.id === member.id;
  const mentorship = MENTORSHIP_LABEL[member.mentorshipStatus];

  return (
    <>
      <BackLink href="/connect" className="mt-4">
        Back to directory
      </BackLink>

      <PageHeader
        title={member.name}
        description={`${member.title} · ${member.organisation}`}
        actions={
          !isMe && (
            <>
              <Button asChild variant="secondary">
                <Link href={`/message?to=${member.id}`}>
                  <MessageSquare className="size-4" aria-hidden />
                  Message
                </Link>
              </Button>
              {(member.mentorshipStatus === "accepting_mentees" ||
                member.mentorshipStatus === "both") && (
                <Button asChild>
                  <Link href={`/mentor/request?to=${member.id}`}>
                    Request mentorship
                  </Link>
                </Button>
              )}
            </>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 p-5 md:p-6 h-fit">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-4">
            <Avatar src={member.avatarUrl} name={member.name} size={96} />
            <div className="min-w-0 flex-1">
              <h2 className="text-headline-md text-on-surface">{member.name}</h2>
              <p className="text-body-md text-on-surface-variant">
                {member.title}
              </p>
              <div className="mt-2">
                <Badge tone={mentorship.tone}>{mentorship.label}</Badge>
              </div>
            </div>
          </div>

          <hr className="my-5 border-t border-outline-variant" aria-hidden />

          <DataList
            items={[
              { label: "Organisation", value: (
                <span className="inline-flex items-center gap-1"><Building2 className="size-4" aria-hidden />{member.organisation}</span>
              ) },
              { label: "Country", value: (
                <span className="inline-flex items-center gap-1"><MapPin className="size-4" aria-hidden />{member.country}</span>
              ) },
              { label: "Languages", value: (
                <span className="inline-flex items-center gap-1"><Languages className="size-4" aria-hidden />{member.languages.join(", ") || "—"}</span>
              ) },
              { label: "Joined", value: formatDate(member.joinedAt) },
            ]}
          />

          {(member.linkedinUrl || member.websiteUrl) && (
            <div className="mt-5 flex flex-wrap gap-2">
              {member.linkedinUrl && (
                <Button asChild variant="outline" size="sm">
                  <a href={member.linkedinUrl} target="_blank" rel="noreferrer">
                    <Linkedin className="size-4" aria-hidden />
                    LinkedIn
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                </Button>
              )}
              {member.websiteUrl && (
                <Button asChild variant="outline" size="sm">
                  <a href={member.websiteUrl} target="_blank" rel="noreferrer">
                    <Globe className="size-4" aria-hidden />
                    Website
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                </Button>
              )}
            </div>
          )}
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-5 md:p-6">
            <h3 className="text-headline-md text-on-surface">About</h3>
            <p className="mt-2 text-body-md text-on-surface whitespace-pre-line">
              {member.bio}
            </p>
          </Card>

          <Card className="p-5 md:p-6">
            <h3 className="text-headline-md text-on-surface">Sectors</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {member.sectors.map((sector) => (
                <li key={sector}>
                  <Tag>{sector}</Tag>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5 md:p-6">
            <h3 className="text-headline-md text-on-surface">Expertise</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {member.expertise.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          </Card>

          {isMe && (
            <Button asChild variant="outline">
              <Link href="/connect/edit">Edit my profile</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
