import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";

import { MatchingClient } from "./matching-client";

export const metadata = { title: "Matching workspace" };

export default async function MatchingPage() {
  const { queries } = await dataProvider();
  const [mentees, all] = await Promise.all([
    queries.admin.unmatchedMentees(),
    queries.admin.membersAdmin(),
  ]);
  const mentors = all.filter(
    (m) =>
      m.mentorshipStatus === "accepting_mentees" ||
      m.mentorshipStatus === "both",
  );

  return (
    <>
      <PageHeader
        title="Matching workspace"
        description="Pair mentees with mentors based on sector, expertise overlap, and cadence."
      />
      <MatchingClient mentees={mentees} mentors={mentors} />
    </>
  );
}
