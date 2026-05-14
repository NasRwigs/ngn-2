import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";

import { LogSessionForm } from "./log-form";

export const metadata = { title: "Log session" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LogSessionPage({ params }: PageProps) {
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
        title="Log session"
        description="Record what you discussed, what's next, and how you're feeling about the engagement."
      />
      <LogSessionForm pair={pair} />
    </>
  );
}
