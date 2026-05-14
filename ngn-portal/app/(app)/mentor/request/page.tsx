import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";

import { RequestForm } from "./request-form";

export const metadata = { title: "Request mentorship" };

export default async function RequestMentorshipPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const params = await searchParams;
  if (!params.to) notFound();

  const { queries } = await dataProvider();
  const mentor = await queries.members.byId(params.to);
  if (!mentor) notFound();

  return (
    <>
      <BackLink href="/mentor/browse" className="mt-4">
        Back to browse
      </BackLink>
      <PageHeader
        title="Request mentorship"
        description={`Send a structured request to ${mentor.name}.`}
      />
      <RequestForm mentor={mentor} />
    </>
  );
}
