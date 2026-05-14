import { AppShell } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/session";
import { dataProvider } from "@/lib/data";

export default async function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const { queries } = await dataProvider();
  const [notifications, unreadMessages] = await Promise.all([
    queries.notifications.unreadCount(user.id),
    queries.messages.unreadCount(user.id),
  ]);

  return (
    <AppShell
      user={{ ...user, unreadMessages }}
      notificationCount={notifications}
    >
      {children}
    </AppShell>
  );
}
