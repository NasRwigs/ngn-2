import type { UserRole } from "@/components/app-shell";

/** Doc1 §2.1 / Doc5 §4.3 — four tiers + ecosystem participant. */
export const ROLES: ReadonlyArray<UserRole> = [
  "exco",
  "programme_admin",
  "foundation_staff",
  "member",
  "ecosystem_participant",
];
