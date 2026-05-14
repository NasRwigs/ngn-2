import Link from "next/link";
import { Bell, Lock, Shield, User } from "lucide-react";

import { Avatar } from "@/components/app-shell/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { DataList } from "@/components/ui/data-list";
import { PageHeader } from "@/components/ui/page-header";
import { ROLE_LABELS, ADMIN_ROLES } from "@/components/app-shell";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const isAdmin = ADMIN_ROLES.includes(user.role);

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account, security, and notifications."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 md:p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-3">
            <Avatar src={user.avatarUrl} name={user.name} size={56} />
            <div className="min-w-0">
              <h2 className="font-bold text-on-surface truncate">{user.name}</h2>
              <p className="text-sm text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
          </div>
          <hr className="my-4 border-t border-outline-variant" aria-hidden />
          <DataList
            items={[
              { label: "Role", value: ROLE_LABELS[user.role] },
              { label: "Member ID", value: user.id },
            ]}
          />
          <Button asChild className="mt-4 w-full" variant="outline">
            <Link href="/connect/edit">Edit profile</Link>
          </Button>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 md:p-6">
            <header className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="size-5 text-on-surface-variant" aria-hidden />
                <CardTitle>Account</CardTitle>
              </div>
            </header>
            <ul className="space-y-2 text-sm">
              <SettingsLink href="/connect/edit" label="Edit profile" />
              <SettingsLink
                href="/settings/email"
                label="Change email address"
              />
            </ul>
          </Card>

          <Card className="p-5 md:p-6">
            <header className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lock className="size-5 text-on-surface-variant" aria-hidden />
                <CardTitle>Security</CardTitle>
              </div>
            </header>
            <ul className="space-y-2 text-sm">
              <SettingsLink href="/reset-password" label="Change password" />
              {isAdmin && (
                <SettingsLink
                  href="/admin/mfa-enrol"
                  label="Two-factor authentication"
                  badge="Required for admins"
                />
              )}
              <SettingsLink href="#" label="Active sessions" />
            </ul>
          </Card>

          <Card className="p-5 md:p-6">
            <header className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="size-5 text-on-surface-variant" aria-hidden />
                <CardTitle>Notifications</CardTitle>
              </div>
            </header>
            <ul className="space-y-2 text-sm">
              <SettingsLink
                href="/settings/notifications"
                label="Notification preferences"
              />
            </ul>
          </Card>

          <Card className="p-5 md:p-6">
            <header className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-on-surface-variant" aria-hidden />
                <CardTitle>Privacy &amp; legal</CardTitle>
              </div>
            </header>
            <ul className="space-y-2 text-sm">
              <SettingsLink href="/legal" label="Privacy policy" />
              <SettingsLink href="/legal#terms" label="Terms of service" />
              <SettingsLink href="#" label="Download my data" />
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

function SettingsLink({
  href,
  label,
  badge,
}: {
  href: string;
  label: string;
  badge?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center justify-between gap-2 p-3 rounded hover:bg-surface-container text-on-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span>{label}</span>
        {badge && (
          <span className="text-xs font-medium text-warning">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
