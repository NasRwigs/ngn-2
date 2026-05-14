/**
 * Shared types for the AppShell.
 *
 * Source of truth: Doc1 §2.1 (roles), Doc2 §1.1 (nav), Doc5 §1–§2 (chrome lock).
 */

import type { LucideIcon } from "lucide-react";

/** The four canonical NGN tiers + ecosystem participant. Doc1 §2.1. */
export type UserRole =
  | "exco"
  | "programme_admin"
  | "foundation_staff"
  | "member"
  | "ecosystem_participant";

/**
 * The minimal user shape the chrome needs.
 * Fetch this once in your root authenticated layout and pass it down.
 */
export interface AppUser {
  id: string;
  /** Full display name, e.g. "Sarah Jenkins". */
  name: string;
  /** First name only, used in greetings. */
  firstName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  /** Drives the badge on the Message nav item. */
  unreadMessages?: number;
}

/** A single nav entry. The same array drives sidebar + mobile bar. */
export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** True if this item appears in the mobile bottom bar (max 5). */
  mobile: boolean;
  /** Roles that can see this item. Omitted = all authenticated users. */
  roles?: ReadonlyArray<UserRole>;
  /** When true, only an exact pathname match counts as active. */
  matchExact?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  /** When omitted, the crumb renders as plain text (use for the leaf). */
  href?: string;
}

/** Human-readable role labels for the user card. */
export const ROLE_LABELS: Record<UserRole, string> = {
  exco: "ExCo",
  programme_admin: "Programme Admin",
  foundation_staff: "Foundation Staff",
  member: "Member",
  ecosystem_participant: "Ecosystem Participant",
};

/** Roles that can see admin surfaces. Used to gate the Admin nav item. */
export const ADMIN_ROLES: ReadonlyArray<UserRole> = [
  "exco",
  "programme_admin",
  "foundation_staff",
];
