"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, Mail, Shield } from "lucide-react";

import { Avatar } from "./avatar";
import { cn } from "./cn";
import { ADMIN_ROLES, ROLE_LABELS, type AppUser } from "./types";

interface GlobalHeaderProps {
  user: AppUser;
  notificationCount?: number;
}

export function GlobalHeader({
  user,
  notificationCount = 0,
}: GlobalHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-14",
        "px-4 md:px-6",
        "flex items-center justify-between",
        "bg-surface/95 supports-[backdrop-filter]:backdrop-blur",
        "border-b border-outline-variant",
      )}
    >
      <Link
        href="/"
        className={cn(
          "md:hidden flex items-center gap-2",
          "focus:outline-none focus:ring-2 focus:ring-primary rounded",
        )}
      >
        <div
          className="size-7 rounded bg-primary text-on-primary grid place-items-center font-bold text-sm"
          aria-hidden
        >
          N
        </div>
        <span className="font-bold text-on-surface">NGN Portal</span>
      </Link>

      <div className="hidden md:block" aria-hidden />

      <div className="flex items-center gap-1">
        <NotificationBell count={notificationCount} />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

function NotificationBell({ count }: { count: number }) {
  return (
    <Link
      href="/notifications"
      className={cn(
        "relative size-10 grid place-items-center rounded-full",
        "text-on-surface-variant hover:bg-surface-container",
        "focus:outline-none focus:ring-2 focus:ring-primary",
      )}
      aria-label={
        count > 0 ? `Notifications (${count} unread)` : "Notifications"
      }
    >
      <Bell className="size-5" aria-hidden />
      {count > 0 && (
        <span
          className="absolute top-1.5 right-1.5 size-2 rounded-full bg-secondary-container"
          aria-hidden
        />
      )}
    </Link>
  );
}

function UserMenu({ user }: { user: AppUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const isAdmin = ADMIN_ROLES.includes(user.role);
  const unread = user.unreadMessages ?? 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <Avatar src={user.avatarUrl} name={user.name} size={36} />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 mt-2 w-64 z-50",
            "rounded-md border border-outline-variant",
            "bg-surface-container-lowest shadow-level-2",
            "py-1",
          )}
        >
          <div className="px-3 py-2 border-b border-outline-variant">
            <div className="text-sm font-medium text-on-surface truncate">
              {user.name}
            </div>
            <div className="text-xs text-on-surface-variant truncate">
              {user.email}
            </div>
            <div className="mt-1 text-xs text-on-surface-variant">
              {ROLE_LABELS[user.role]}
            </div>
          </div>

          <div className="md:hidden border-b border-outline-variant py-1">
            <MenuLink href="/message" onClick={() => setOpen(false)}>
              <Mail className="size-4" aria-hidden />
              <span className="flex-1">Message</span>
              {unread > 0 && (
                <span className="text-xs font-medium text-secondary-container">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </MenuLink>
            {isAdmin && (
              <MenuLink href="/admin" onClick={() => setOpen(false)}>
                <Shield className="size-4" aria-hidden />
                <span>Admin</span>
              </MenuLink>
            )}
          </div>

          <MenuLink href="/connect/edit" onClick={() => setOpen(false)}>
            Profile
          </MenuLink>
          <MenuLink href="/settings" onClick={() => setOpen(false)}>
            Settings
          </MenuLink>
          <MenuLink href="/legal" onClick={() => setOpen(false)}>
            Legal
          </MenuLink>

          <form action="/auth/sign-out" method="post" role="none">
            <button
              type="submit"
              role="menuitem"
              className={cn(
                "w-full text-left px-3 py-2 text-sm text-on-surface",
                "hover:bg-surface-container",
                "focus:outline-none focus:bg-surface-container",
              )}
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm text-on-surface",
        "hover:bg-surface-container",
        "focus:outline-none focus:bg-surface-container",
      )}
    >
      {children}
    </Link>
  );
}
