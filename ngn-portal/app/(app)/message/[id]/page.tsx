import { notFound } from "next/navigation";

import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";

import { ConversationView } from "./conversation-view";

export const metadata = { title: "Conversation" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;
  const { queries } = await dataProvider();
  const [conv, user, messages] = await Promise.all([
    queries.messages.conversation(id),
    getCurrentUser(),
    queries.messages.messages(id),
  ]);

  if (!conv) notFound();

  const otherId = conv.participantIds.find((pid) => pid !== user.id);
  const other = otherId ? findMember(otherId) : null;

  return (
    <ConversationView
      conversationId={conv.id}
      currentUserId={user.id}
      other={other ? { id: other.id, name: other.name, avatarUrl: other.avatarUrl ?? null, title: other.title } : null}
      initialMessages={messages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        body: m.body,
        sentAt: m.sentAt,
      }))}
    />
  );
}
