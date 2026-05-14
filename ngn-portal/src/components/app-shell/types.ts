import type { LucideIcon } from "lucide-react";

/** The four canonical NGN tiers + ecosystem participant. Doc1 §2.1. */
export type UserRole =
  | "exco"
  | "programme_admin"
  | "foundation_staff"
  | "member"
  | "ecosystem_participant";

export interface AppUser {
  id: string;
  name: string;
  firstName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  unreadMessages?: number;
}

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  mobile: boolean;
  roles?: ReadonlyArray<UserRole>;
  matchExact?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  exco: "ExCo",
  programme_admin: "Programme Admin",
  foundation_staff: "Foundation Staff",
  member: "Member",
  ecosystem_participant: "Ecosystem Participant",
};

export const ADMIN_ROLES: ReadonlyArray<UserRole> = [
  "exco",
  "programme_admin",
  "foundation_staff",
];
