/**
 * Example wiring for the AppShell in a Next.js 16 App Router app
 * backed by Supabase Auth (per Doc1 §1.5).
 *
 * Place this at: app/(app)/layout.tsx
 *
 * The (app) route group lets you keep authenticated routes separate
 * from /login, /join, /reset-password, which should NOT use AppShell.
 *
 * This file is illustrative — adapt the imports to your app's
 * directory structure (the examples assume `@/lib/supabase/server`
 * and `@/components/app-shell`).
 */

import { redirect } from "next/navigation";

// import { createServerClient } from "@/lib/supabase/server";
// import { AppShell } from "@/components/app-shell";
// import type { UserRole } from "@/components/app-shell";

// Stubs so this file type-checks in isolation.
// Delete these when copying into your real app.
declare function createServerClient(): Promise<{
  auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
  from: (table: string) => {
    select: (
      cols: string,
      opts?: { count?: "exact"; head?: boolean },
    ) => {
      eq: (col: string, value: unknown) => {
        single: () => Promise<{ data: ProfileRow | null }>;
        is?: (col: string, value: null) => Promise<{ count: number | null }>;
      };
    };
  };
}>;
declare function AppShell(props: {
  user: AppUserShape;
  notificationCount?: number;
  children: React.ReactNode;
}): React.ReactElement;
type UserRole =
  | "exco"
  | "programme_admin"
  | "foundation_staff"
  | "member"
  | "ecosystem_participant";
interface ProfileRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
}
interface AppUserShape {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  unreadMessages: number;
}
// End stubs.

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();

  // 1. Confirm we have an authenticated session.
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  // 2. Fetch the application profile (joined to auth.users by id).
  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, role, avatar_url")
    .eq("id", authUser.id)
    .single();
  if (!profile) redirect("/login");

  // 3. Count unread messages for the message badge.
  const unreadResult = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("recipient_id", profile.id)
    .is?.("read_at", null);
  const unreadMessages = unreadResult?.count ?? 0;

  // 4. Pass the assembled user object into the chrome.
  return (
    <AppShell
      user={{
        id: profile.id,
        name: profile.name,
        firstName: profile.name.split(" ")[0] ?? profile.name,
        email: profile.email,
        role: profile.role,
        avatarUrl: profile.avatar_url,
        unreadMessages,
      }}
      // Notification count is a separate concept from message unread
      // (e.g. event reminders, mentorship nudges). Wire to your
      // notifications table when ready.
      notificationCount={0}
    >
      {children}
    </AppShell>
  );
}

/**
 * Example page using breadcrumbs.
 *
 * Pages set their own breadcrumbs by composing AppShell at the page level
 * — but since the layout already mounts AppShell, the cleaner pattern is
 * to expose a Breadcrumbs slot via React context or a route segment
 * config. The minimal version below uses a per-page client component
 * that mutates a context. See README §"Per-page breadcrumbs".
 */
