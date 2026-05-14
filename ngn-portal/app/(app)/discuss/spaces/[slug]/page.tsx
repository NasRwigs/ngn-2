import { notFound } from "next/navigation";

import { BackLink } from "@/components/ui/back-link";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";

import { SpaceThreadsClient } from "./space-threads-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const space = await queries.spaces.bySlug(slug);
  return { title: space?.name ?? "Space not found" };
}

export default async function SpaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { queries } = await dataProvider();
  const space = await queries.spaces.bySlug(slug);
  if (!space) notFound();

  const threads = await queries.spaces.threads(slug);
  const rows = threads.map((t) => ({
    id: t.id,
    title: t.title,
    lastActivityAt: t.lastActivityAt,
    messageCount: t.messageCount,
    pinned: t.pinned,
    authorName: findMember(t.authorId)?.name ?? "Member",
  }));

  return (
    <>
      <BackLink href="/discuss/spaces" className="mt-4">
        Back to spaces
      </BackLink>
      <PageHeader
        title={space.name}
        description={space.description}
        meta={
          <div className="flex flex-wrap items-center gap-1.5">
            {space.programmeArea && <Tag size="sm">{space.programmeArea}</Tag>}
            <Tag size="sm">{space.memberCount} members</Tag>
          </div>
        }
      />

      <SpaceThreadsClient spaceSlug={slug} spaceName={space.name} threads={rows} />
    </>
  );
}
