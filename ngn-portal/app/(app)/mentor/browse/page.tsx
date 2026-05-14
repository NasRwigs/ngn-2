import { Users } from "lucide-react";

import { BackLink } from "@/components/ui/back-link";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";

import { BrowseMentorsClient } from "./browse-client";

export const metadata = { title: "Browse mentors" };

export default async function BrowseMentorsPage() {
  const { queries } = await dataProvider();
  const members = await queries.members.list();
  const mentors = members.filter(
    (m) =>
      m.mentorshipStatus === "accepting_mentees" ||
      m.mentorshipStatus === "both",
  );

  return (
    <>
      <BackLink href="/mentor" className="mt-4">
        Back to mentor
      </BackLink>
      <PageHeader
        title="Find a mentor"
        description={`Browse ${mentors.length} mentors actively accepting mentees.`}
      />

      {mentors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No mentors available right now"
          description="Check back later — we add new mentors throughout each cohort."
        />
      ) : (
        <BrowseMentorsClient members={mentors} />
      )}
    </>
  );
}
