import Link from "next/link";
import { MessageSquare } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { findMember } from "@/lib/data/fixtures/members";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";
import { formatRelative } from "@/lib/format/date";

export const metadata = { title: "Messages" };

export default async function MessagesInboxPage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const conversations = await queries.messages.conversations(user.id);

  return (
    <>
      <PageHeader
        title="Messages"
        description="Direct conversations with other members and your mentorship pair."
      />

      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Start a conversation from a member's profile in the directory."
        />
      ) : (
        <ul className="divide-y divide-outline-variant rounded-lg border border-outline-variant bg-surface-container-lowest">
          {conversations.map((conv) => {
            const otherId = conv.participantIds.find((id) => id !== user.id);
            const other = otherId ? findMember(otherId) : null;
            return (
              <li key={conv.id}>
                <Link
                  href={`/message/${conv.id}`}
                  className="flex items-center gap-3 p-4 hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Avatar
                    src={other?.avatarUrl}
                    name={other?.name ?? "?"}
                    size={44}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={`text-on-surface truncate ${
                          conv.unreadCount > 0 ? "font-bold" : "font-medium"
                        }`}
                      >
                        {other?.name ?? "Unknown"}
                      </p>
                      <time
                        dateTime={conv.lastMessageAt}
                        className="text-xs text-on-surface-variant shrink-0"
                      >
                        {formatRelative(conv.lastMessageAt)}
                      </time>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conv.unreadCount > 0
                          ? "text-on-surface font-medium"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span
                      className="size-2.5 rounded-full bg-secondary-container"
                      aria-label={`${conv.unreadCount} unread`}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
