import Link from "next/link";
import { Bell } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { dataProvider } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth/session";
import { formatRelative } from "@/lib/format/date";

export const metadata = { title: "Notifications" };

const KIND_LABEL = {
  mentorship: "Mentorship",
  event: "Event",
  message: "Message",
  system: "System",
} as const;

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const items = await queries.notifications.list(user.id);

  return (
    <>
      <PageHeader
        title="Notifications"
        description="What's happening across the network."
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="New activity will show up here."
        />
      ) : (
        <ul className="divide-y divide-outline-variant rounded-lg border border-outline-variant bg-surface-container-lowest">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="block p-4 hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 size-2 rounded-full ${item.readAt ? "bg-transparent" : "bg-secondary-container"}`}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                      {KIND_LABEL[item.kind]}
                    </p>
                    <p className="font-medium text-on-surface mt-0.5">
                      {item.title}
                    </p>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {item.body}
                    </p>
                  </div>
                  <time
                    dateTime={item.createdAt}
                    className="text-xs text-on-surface-variant shrink-0"
                  >
                    {formatRelative(item.createdAt)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
