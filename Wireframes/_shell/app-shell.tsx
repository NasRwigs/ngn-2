import { Breadcrumbs } from "./breadcrumbs";
import { GlobalHeader } from "./global-header";
import { MobileBottomBar } from "./mobile-bottom-bar";
import { Sidebar } from "./sidebar";
import type { AppUser, BreadcrumbItem } from "./types";

interface AppShellProps {
  /**
   * The current authenticated user. Fetch this once in your root
   * authenticated layout (e.g. app/(app)/layout.tsx) and pass it down.
   */
  user: AppUser;
  /**
   * Breadcrumb trail for the current page. Omit on top-level pages.
   * Doc2 §1.2 format: Home > Connect > [Member Name].
   */
  breadcrumbs?: BreadcrumbItem[];
  /** Total unread notifications. Drives the bell dot in the header. */
  notificationCount?: number;
  children: React.ReactNode;
}

/**
 * The single canonical chrome for every authenticated NGN Portal page.
 *
 * Implements Doc5 §2 (Chrome Lock):
 *   - Desktop sidebar (240px) with role-gated Admin item
 *   - Tablet rail (64px icons-only) with hover tooltips
 *   - Mobile bottom bar (5 items: Home | Connect | Discuss | Mentor | Events)
 *   - Global header (brand on mobile, notifications + avatar menu)
 *   - Breadcrumbs slot
 *
 * Usage (Next.js App Router):
 *   // app/(app)/layout.tsx
 *   const user = await getCurrentUser();
 *   return <AppShell user={user}>{children}</AppShell>;
 *
 * Pages set their own breadcrumbs by composing with AppShell directly,
 * or by using a per-route helper that sets `breadcrumbs`.
 */
export function AppShell({
  user,
  breadcrumbs = [],
  notificationCount = 0,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-surface text-on-surface font-sans">
      <Sidebar user={user} />

      {/* Content column. md:pl-16 leaves room for the tablet rail; */}
      {/* lg:pl-60 leaves room for the expanded sidebar.            */}
      <div className="md:pl-16 lg:pl-60">
        <GlobalHeader user={user} notificationCount={notificationCount} />

        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

        {/* pb-20 reserves space for the mobile bottom bar (64px + safe area). */}
        <main className="px-4 md:px-6 lg:px-16 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      <MobileBottomBar />
    </div>
  );
}

export type { AppUser, BreadcrumbItem, UserRole } from "./types";
