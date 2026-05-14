import { notFound } from "next/navigation";

import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";

import { ThreadDetailClient } from "./thread-detail-client";

interface PageProps {
  params: Promise<{ slug: string; threadId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, threadId } = await params;
  const { queries } = await dataProvider();
  const thread = await queries.spaces.thread(slug, threadId);
  return { title: thread?.title ?? "Thread" };
}

export default async function SpaceThreadDetailPage({ params }: PageProps) {
  const { slug, threadId } = await params;
  const { queries } = await dataProvider();
  const [space, thread, replies, user] = await Promise.all([
    queries.spaces.bySlug(slug),
    queries.spaces.thread(slug, threadId),
    queries.spaces.threadReplies(slug, threadId),
    getCurrentUser(),
  ]);

  if (!space || !thread) notFound();

  const posts = replies.map((r, index) => {
    const m = findMember(r.authorId);
    return {
      id: r.id,
      body: r.body,
      sentAt: r.sentAt,
      authorId: r.authorId,
      authorName: m?.name ?? "Member",
      authorAvatarUrl: m?.avatarUrl ?? null,
      isOriginal: index === 0,
    };
  });

  return (
    <ThreadDetailClient
      spaceSlug={slug}
      spaceName={space.name}
      threadId={thread.id}
      threadTitle={thread.title}
      posts={posts}
      currentUserId={user.id}
      currentUserName={user.name}
      currentUserAvatar={user.avatarUrl ?? null}
    />
  );
}
