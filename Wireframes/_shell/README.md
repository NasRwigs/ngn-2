# `<AppShell>` — NGN Portal chrome (starter implementation)

A drop-in React component package implementing the chrome lock from
**Doc5 §2** of the NGN Portal review. Provides the single canonical shell
that every authenticated page should render inside.

**Tech assumptions** (from Doc1 §1.5 and Doc4):
- Next.js 16, App Router, React 19
- Tailwind CSS
- Supabase Auth for the user/session
- TypeScript (strict)

This package replaces the **6 different desktop sidebars and 5 different
mobile bottom bars** currently scattered across the wireframe deck (Doc5
§6) with one shell, drawn once.

---

## What's in the box

```
_shell/
├── README.md                  ← this file
├── index.ts                   ← public exports
├── app-shell.tsx              ← <AppShell>: the composition
├── sidebar.tsx                ← desktop + tablet rail (client)
├── mobile-bottom-bar.tsx      ← mobile bottom bar (client)
├── global-header.tsx          ← header, bell, avatar menu (client)
├── breadcrumbs.tsx            ← breadcrumb trail (server)
├── avatar.tsx                 ← circular avatar with initials fallback
├── nav-config.ts              ← single source of truth for nav items
├── types.ts                   ← AppUser, NavItem, UserRole, role labels
├── cn.ts                      ← tiny className combiner (no deps)
├── tailwind.tokens.ts         ← DESIGN.md tokens as a Tailwind theme
└── example-layout.tsx         ← reference app/(app)/layout.tsx wiring

../_shell-storybook/           ← Storybook (6 chrome stories); see sibling README
```

About 750 lines of focused TypeScript. No runtime dependencies beyond
`next`, `react`, and `lucide-react`.

---

## Storybook (chrome contract)

The sibling **`../_shell-storybook/`** package runs Storybook **9** with
**Next.js 15** so the integration stays stable; the shell source here
remains written for the production app on **Next.js 16** (same `Link` /
`Image` / `usePathname` APIs). When your app is on Next 16 + a Storybook
release that officially supports it, bump the versions in
`_shell-storybook/package.json` to match.

```bash
cd Wireframes/_shell-storybook
npm install
npm run storybook
```

See `../_shell-storybook/README.md` for the story matrix and CI build.

---

## Installation

1. Copy the `_shell/` folder into your app, e.g.
   `ngn-portal/src/components/app-shell/`.

2. Install the icon library (Doc5 §5.5 picked Lucide):

   ```bash
   pnpm add lucide-react
   ```

3. Merge `tailwind.tokens.ts` into your `tailwind.config.ts`:

   ```ts
   import { ngnTheme } from "./src/components/app-shell/tailwind.tokens";

   export default {
     content: ["./src/**/*.{ts,tsx}"],
     theme: ngnTheme,
   } satisfies Config;
   ```

4. Import the Hanken Grotesk webfont in your root `app/layout.tsx`:

   ```ts
   import { Hanken_Grotesk } from "next/font/google";
   const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-sans" });
   ```

   …and add `sans.variable` to your `<html>` className.

---

## Integration

Mount the shell once, in the root authenticated layout. See
`example-layout.tsx` for the full Supabase Auth wiring; the gist:

```tsx
// app/(app)/layout.tsx
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/app-shell";

export default async function AppLayout({
  children,
}: { children: React.ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("id, name, email, role, avatar_url")
    .eq("id", authUser.id)
    .single();
  if (!profile) redirect("/login");

  return (
    <AppShell
      user={{
        id: profile.id,
        name: profile.name,
        firstName: profile.name.split(" ")[0],
        email: profile.email,
        role: profile.role,
        avatarUrl: profile.avatar_url,
      }}
    >
      {children}
    </AppShell>
  );
}
```

**Critical:** the route group `(app)` keeps `/login`, `/join`,
`/reset-password` *outside* the shell. Those screens should not have
sidebars or bottom bars.

---

## Per-page breadcrumbs

Doc2 §1.2 requires breadcrumbs on every non-top-level page. Two
acceptable patterns; pick one and stick to it:

### Option A — Pass at the layout level (per-segment)

Each route segment owns a layout that re-mounts `<AppShell>` with the
correct breadcrumbs:

```tsx
// app/(app)/connect/[slug]/layout.tsx
export default async function ProfileLayout({
  params,
  children,
}: { params: Promise<{ slug: string }>; children: React.ReactNode }) {
  const { slug } = await params;
  const member = await getMember(slug);

  return (
    <AppShell
      user={await getCurrentUser()}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Connect", href: "/connect" },
        { label: member.name },
      ]}
    >
      {children}
    </AppShell>
  );
}
```

Verbose but explicit, and works with React Server Components without any
client-side context.

### Option B — Render `<Breadcrumbs>` directly inside the page

Skip the `breadcrumbs` prop on `<AppShell>` and let pages render the
component themselves:

```tsx
import { Breadcrumbs } from "@/components/app-shell";

export default function Page() {
  return (
    <>
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Mentor", href: "/mentor" },
        { label: "Pair detail" },
      ]} />
      {/* ...page content... */}
    </>
  );
}
```

Slightly more flexible. The breadcrumb sits inside `<main>` rather than
between header and content, which matters for sticky-header layouts.

Option A is recommended for consistency.

---

## Adding a new top-level area

Edit **`nav-config.ts`** only. The sidebar, mobile bar, and active-state
detection all read from the same array. Example:

```ts
import { Newspaper } from "lucide-react";

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  // ...existing items
  {
    key: "insights",
    label: "Insights",
    href: "/insights",
    icon: Newspaper,
    mobile: false,           // sidebar-only
  },
];
```

A runtime check in dev mode enforces the **exactly 5 mobile items** rule
from Doc2 §1.1. If you add a sixth `mobile: true` item without removing
one, the dev build throws.

---

## Role gating

`<Sidebar>` and `<UserMenu>` both consult `user.role` against the
`roles` field on each `NavItem`. The `Admin` item is wired to `ADMIN_ROLES`
(ExCo, Programme Admin, Foundation Staff) per Doc1 §2.1; Members never
see it.

To add additional gated items:

```ts
{
  key: "reports",
  label: "Reports",
  href: "/admin/reports",
  icon: BarChart,
  mobile: false,
  roles: ["exco", "foundation_staff"],   // narrower than ADMIN_ROLES
},
```

This handles **visibility only** — server-side authorization on the route
itself is still required (RBAC is checked in route handlers / Supabase
RLS, not in the chrome).

---

## What this package does NOT include

By design, to keep the surface small:

- **Toasts / snackbars** (Doc2 §4.2) — use Sonner or a similar library.
- **Modals / sheets** (Doc2 §4.2) — use Radix Dialog.
- **Loading skeletons** — pages own their own Suspense boundaries.
- **Actual notification dropdown content** — `NotificationBell` links
  to `/notifications`. Build that page; don't try to cram a popover here.
- **Search** — there is no global search per Doc2 §4.2 (search is
  per-area: directory, events, discussions). Don't add a header search.
- **Onboarding wrapper** — the 5-step onboarding flow (Doc5 §3) lives
  *outside* `<AppShell>` because it has no chrome.
- **Empty / error states** — implement per page; the shell stays neutral.

---

## Conformance to Doc5 §2

| Requirement | Where implemented |
|---|---|
| Single wordmark "NGN Portal" | `sidebar.tsx` (BrandLockup), `global-header.tsx` (mobile brand) |
| Desktop sidebar 240px, role-gated Admin | `sidebar.tsx` |
| Tablet rail 64px icons-only with tooltip | `sidebar.tsx` (`lg:` breakpoint logic) |
| Mobile bottom bar, exactly 5 items | `mobile-bottom-bar.tsx` + dev assertion in `nav-config.ts` |
| Active state: 4px MIF Orange bar + Blue tint + bold | `sidebar.tsx` (NavLink) |
| Message badge with unread count | `sidebar.tsx`, also surfaced in mobile avatar menu |
| Notification bell with unread dot | `global-header.tsx` (NotificationBell) |
| Avatar menu: Profile, Settings, Legal, Sign out | `global-header.tsx` (UserMenu) |
| Breadcrumbs slot under header | `app-shell.tsx` + `breadcrumbs.tsx` |
| `Sign out` is a POST, not a GET | `global-header.tsx` (form action) |
| No screen redraws the chrome | Single `<AppShell>` component, mounted once in `(app)/layout.tsx` |

---

## Known TODOs (intentional cuts)

1. **Notification popover.** Currently the bell links to `/notifications`.
   When that page exists, swap to a Radix Popover with a server action
   feed.
2. **Skip-to-content link.** WCAG 2.1 best practice. Add at the top of
   `<AppShell>` once we have a `#main` landmark we trust.
3. **Tablet sidebar expand-on-click.** Currently shows tooltips on hover
   only. If users find the icon-only rail unclear, add a click-to-expand
   behaviour with `useState` + a transient class.
4. **Localisation.** All strings are inline English. Move to a
   `t()` lookup once i18n lands.
5. **`prefers-reduced-motion`.** The avatar menu has no transitions
   currently, but if hover/focus animations are added, gate them.
6. **High-contrast theme.** DESIGN.md targets WCAG AA; the chrome itself
   passes, but a dedicated high-contrast token override is not yet wired.

None of these are blockers for first deploy. Open a tracking issue per
TODO when implementing.

---

## Try it locally (without the rest of the app)

If you want to render the chrome in isolation for designer review:

```tsx
// app/page.tsx (a quick scratch route)
import { AppShell } from "@/components/app-shell";

export default function Home() {
  return (
    <AppShell
      user={{
        id: "demo",
        name: "Sarah Jenkins",
        firstName: "Sarah",
        email: "sarah@example.org",
        role: "member",
        avatarUrl: null,
        unreadMessages: 3,
      }}
      notificationCount={2}
      breadcrumbs={[{ label: "Home" }]}
    >
      <h1 className="text-headline-lg mt-4">Good morning, Sarah</h1>
      <p className="text-body-md text-on-surface-variant mt-2">
        Page content goes here. Resize the window to see the sidebar
        collapse to the tablet rail at 1024px and disappear into the
        mobile bottom bar at 768px.
      </p>
    </AppShell>
  );
}
```

That's enough to verify the chrome before any real pages are wired up.
