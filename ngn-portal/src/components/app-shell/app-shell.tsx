import { Breadcrumbs } from "./breadcrumbs";
import { GlobalHeader } from "./global-header";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { Sidebar } from "./sidebar";
import type { AppUser, BreadcrumbItem } from "./types";

interface AppShellProps {
  user: AppUser;
  breadcrumbs?: BreadcrumbItem[];
  notificationCount?: number;
  children: React.ReactNode;
}

export function AppShell({
  user,
  breadcrumbs = [],
  notificationCount = 0,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-surface text-on-surface font-sans">
      <Sidebar user={user} />

      <div className="md:pl-16 lg:pl-60">
        <GlobalHeader user={user} notificationCount={notificationCount} />

        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

        <main className="px-4 md:px-6 lg:px-16 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      <MobileBottomBar />
    </div>
  );
}

export type { AppUser, BreadcrumbItem, UserRole } from "./types";
