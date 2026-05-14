import type { Meta, StoryObj } from "@storybook/react";

import { AppShell } from "@ngn-shell/app-shell";
import type { AppUser, UserRole } from "@ngn-shell/types";

function SamplePage({ role, pathname }: { role: UserRole; pathname: string }) {
  return (
    <div className="max-w-3xl py-6">
      <h1 className="text-headline-lg text-on-surface">Chrome contract preview</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        Viewport + pathname are set per story. Role:{" "}
        <strong className="text-on-surface">{role}</strong> · Path:{" "}
        <code className="rounded bg-surface-container px-1 py-0.5 text-sm">
          {pathname}
        </code>
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-body-md text-on-surface-variant">
        <li>
          <strong className="text-on-surface">Mobile</strong>: bottom bar (5
          items). Message + Admin (if allowed) live in the avatar menu.
        </li>
        <li>
          <strong className="text-on-surface">Tablet</strong>: 64px icon rail +
          tooltips; bottom bar hidden at <code className="text-sm">md+</code>.
        </li>
        <li>
          <strong className="text-on-surface">Desktop</strong>: 240px sidebar;
          Message in rail; Admin only for ExCo / Programme Admin / Foundation
          Staff.
        </li>
      </ul>
    </div>
  );
}

const baseUser = {
  id: "story-user-1",
  name: "Aminata Diallo",
  firstName: "Aminata",
  email: "aminata.diallo@example.org",
  avatarUrl: null as string | null,
  unreadMessages: 3,
};

function userFor(role: UserRole): AppUser {
  return { ...baseUser, role };
}

const meta = {
  title: "Chrome / AppShell",
  component: AppShell,
  parameters: {
    layout: "fullscreen" as const,
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/" },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-dvh bg-surface font-sans antialiased">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof AppShell>;

/** Mobile: below md — bottom bar visible; sidebar hidden. */
export const MobileMember: Story = {
  name: "Mobile · Member",
  parameters: {
    viewport: { defaultViewport: "ngnMobile" },
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
  args: {
    user: userFor("member"),
    notificationCount: 2,
    breadcrumbs: [{ label: "Home" }],
    children: <SamplePage role="member" pathname="/" />,
  },
};

export const MobileExCo: Story = {
  name: "Mobile · ExCo",
  parameters: {
    viewport: { defaultViewport: "ngnMobile" },
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
  args: {
    user: userFor("exco"),
    notificationCount: 1,
    breadcrumbs: [{ label: "Home" }],
    children: <SamplePage role="exco" pathname="/" />,
  },
};

/** Tablet: md to lg — icon rail; no bottom bar. */
export const TabletMember: Story = {
  name: "Tablet · Member",
  parameters: {
    viewport: { defaultViewport: "ngnTablet" },
    nextjs: { appDirectory: true, navigation: { pathname: "/connect" } },
  },
  args: {
    user: userFor("member"),
    notificationCount: 0,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Connect", href: "/connect" },
      { label: "Browse" },
    ],
    children: <SamplePage role="member" pathname="/connect" />,
  },
};

export const TabletExCo: Story = {
  name: "Tablet · ExCo",
  parameters: {
    viewport: { defaultViewport: "ngnTablet" },
    nextjs: { appDirectory: true, navigation: { pathname: "/admin" } },
  },
  args: {
    user: userFor("exco"),
    notificationCount: 4,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Admin", href: "/admin" },
      { label: "Overview" },
    ],
    children: <SamplePage role="exco" pathname="/admin" />,
  },
};

/** Desktop: lg and up — full sidebar with labels. */
export const DesktopMember: Story = {
  name: "Desktop · Member",
  parameters: {
    viewport: { defaultViewport: "ngnDesktop" },
    nextjs: { appDirectory: true, navigation: { pathname: "/events" } },
  },
  args: {
    user: userFor("member"),
    notificationCount: 2,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events" },
      { label: "Future of Africa Forum" },
    ],
    children: <SamplePage role="member" pathname="/events" />,
  },
};

export const DesktopExCo: Story = {
  name: "Desktop · ExCo",
  parameters: {
    viewport: { defaultViewport: "ngnDesktop" },
    nextjs: { appDirectory: true, navigation: { pathname: "/admin" } },
  },
  args: {
    user: userFor("exco"),
    notificationCount: 0,
    breadcrumbs: [
      { label: "Home", href: "/" },
      { label: "Admin", href: "/admin" },
      { label: "Overview" },
    ],
    children: <SamplePage role="exco" pathname="/admin" />,
  },
};
