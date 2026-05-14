"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "./cn";
import { MOBILE_NAV_ITEMS } from "./nav-config";
import type { NavItem } from "./types";

/**
 * Fixed 5-item bottom bar shown only below md.
 * Doc5 §2.3: items are Home | Connect | Discuss | Mentor | Events.
 *
 * Message lives in the global header avatar menu on mobile;
 * Admin lives in the avatar menu (gated by role).
 */
export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "md:hidden",
        "fixed bottom-0 inset-x-0 z-40",
        "h-16 pb-[env(safe-area-inset-bottom)]",
        "bg-surface-container-low",
        "border-t border-outline-variant",
        "grid grid-cols-5",
      )}
      aria-label="Primary"
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <BarLink key={item.key} item={item} active={isActive(pathname, item)} />
      ))}
    </nav>
  );
}

interface BarLinkProps {
  item: NavItem;
  active: boolean;
}

function BarLink({ item, active }: BarLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex flex-col items-center justify-center gap-0.5",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        active ? "text-primary" : "text-on-surface-variant",
      )}
    >
      {/* MIF Orange active indicator at the top edge. */}
      {active && (
        <span
          className="absolute top-0 inset-x-6 h-0.5 rounded-b bg-secondary-container"
          aria-hidden
        />
      )}
      <Icon className="size-5" aria-hidden />
      <span
        className={cn(
          "text-[11px] leading-tight",
          active ? "font-bold" : "font-medium",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.matchExact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(item.href + "/");
}
