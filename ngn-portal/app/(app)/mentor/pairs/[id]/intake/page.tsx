import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";

import { IntakeForm } from "./intake-form";

export const metadata = { title: "Mentorship intake" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function IntakePage({ params }: PageProps) {
  const { id } = await params;
  const { queries } = await dataProvider();
  const pair = await queries.pairs.byId(id);
  if (!pair) notFound();

  return (
    <>
      <BackLink href={`/mentor/pairs/${pair.id}`} className="mt-4">
        Back to pair
      </BackLink>
      <PageHeader
        title="Mentorship intake"
        description="Define your shared goals and working agreement. Complete this together in your first session."
      />
      <IntakeForm pair={pair} />
    </>
  );
}
