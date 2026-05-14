"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "./avatar";
import { cn } from "./cn";
import { NAV_ITEMS } from "./nav-config";
import { ROLE_LABELS, type AppUser, type NavItem } from "./types";

/**
 * Persistent left rail for tablet (64px icons-only) and desktop (240px).
 * Hidden below md.
 *
 * Implements Doc5 §2.1 (desktop) and §2.2 (tablet).
 */
export function Sidebar({ user }: { user: AppUser }) {
  const pathname = usePathname();

  const visible = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user.role),
  );
  const primary = visible.filter((item) => !item.roles);
  const restricted = visible.filter((item) => item.roles);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col",
        "fixed inset-y-0 left-0 z-40",
        "w-16 lg:w-60",
        "bg-surface-container-low",
        "border-r border-outline-variant",
      )}
      aria-label="Primary"
    >
      <BrandLockup />

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {primary.map((item) => (
            <li key={item.key}>
              <NavLink
                item={item}
                active={isActive(pathname, item)}
                badge={
                  item.key === "message" ? user.unreadMessages : undefined
                }
              />
            </li>
          ))}
        </ul>

        {restricted.length > 0 && (
          <>
            <hr
              className="my-3 border-t border-outline-variant"
              aria-hidden
            />
            <ul className="space-y-1">
              {restricted.map((item) => (
                <li key={item.key}>
                  <NavLink item={item} active={isActive(pathname, item)} />
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      <UserCard user={user} />
    </aside>
  );
}

function BrandLockup() {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 h-14 px-4",
        "border-b border-outline-variant",
        "focus:outline-none focus:ring-2 focus:ring-primary",
      )}
    >
      <div
        className={cn(
          "size-8 shrink-0 rounded",
          "bg-primary text-on-primary",
          "grid place-items-center font-bold",
        )}
        aria-hidden
      >
        N
      </div>
      <span className="hidden lg:inline font-bold text-on-surface">
        NGN Portal
      </span>
      <span className="sr-only lg:hidden">NGN Portal — Home</span>
    </Link>
  );
}

interface NavLinkProps {
  item: NavItem;
  active: boolean;
  badge?: number;
}

function NavLink({ item, active, badge }: NavLinkProps) {
  const Icon = item.icon;
  const showBadge = typeof badge === "number" && badge > 0;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 h-11 px-3 rounded-md",
        "transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        active
          ? "bg-primary/10 text-primary font-bold"
          : "text-on-surface-variant hover:bg-surface-container",
      )}
    >
      {/* MIF Orange active indicator (Doc5 §2.1). */}
      {active && (
        <span
          className="absolute inset-y-1 left-0 w-1 rounded-r bg-secondary-container"
          aria-hidden
        />
      )}

      <Icon className="size-5 shrink-0" aria-hidden />

      <span className="hidden lg:inline truncate">{item.label}</span>

      {/* Desktop: numeric badge. Tablet: small dot. */}
      {showBadge && (
        <>
          <span
            className={cn(
              "hidden lg:inline-flex ml-auto items-center justify-center",
              "min-w-5 h-5 px-1.5 rounded-full",
              "bg-secondary-container text-on-secondary",
              "text-xs font-medium",
            )}
            aria-label={`${badge} unread`}
          >
            {badge > 99 ? "99+" : badge}
          </span>
          <span
            className="lg:hidden absolute top-1.5 right-1.5 size-2 rounded-full bg-secondary-container"
            aria-hidden
          />
        </>
      )}

      {/* Tooltip on tablet (icons-only). */}
      <span
        role="tooltip"
        className={cn(
          "lg:hidden pointer-events-none absolute left-full ml-2 z-50",
          "px-2 py-1 rounded text-xs font-medium whitespace-nowrap",
          "bg-inverse-surface text-inverse-on-surface",
          "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
          "transition-opacity",
        )}
      >
        {item.label}
        {showBadge ? ` (${badge})` : ""}
      </span>
    </Link>
  );
}

function UserCard({ user }: { user: AppUser }) {
  return (
    <div className="border-t border-outline-variant p-3">
      <Link
        href="/settings"
        className={cn(
          "flex items-center gap-3 rounded-md p-2",
          "hover:bg-surface-container",
          "focus:outline-none focus:ring-2 focus:ring-primary",
        )}
      >
        <Avatar src={user.avatarUrl} name={user.name} size={36} />
        <div className="hidden lg:block min-w-0 flex-1">
          <div className="text-sm font-medium text-on-surface truncate">
            {user.name}
          </div>
          <div className="text-xs text-on-surface-variant truncate">
            {ROLE_LABELS[user.role]}
          </div>
        </div>
      </Link>
    </div>
  );
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.matchExact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
