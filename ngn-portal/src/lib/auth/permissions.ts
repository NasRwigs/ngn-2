import type { AppUser, UserRole } from "@/components/app-shell";

export type Action =
  | "view_directory"
  | "edit_own_profile"
  | "request_mentorship"
  | "log_session"
  | "create_event"
  | "create_session"
  | "create_circle"
  | "invite_member"
  | "view_admin"
  | "run_matching"
  | "manage_spaces"
  | "view_reports";

const RULES: Record<Action, ReadonlyArray<UserRole>> = {
  view_directory: ["exco", "programme_admin", "foundation_staff", "member"],
  edit_own_profile: [
    "exco",
    "programme_admin",
    "foundation_staff",
    "member",
    "ecosystem_participant",
  ],
  request_mentorship: ["member"],
  log_session: ["member"],
  create_event: ["exco", "programme_admin"],
  create_session: ["exco", "programme_admin", "member"],
  create_circle: ["exco", "programme_admin"],
  invite_member: ["exco", "programme_admin"],
  view_admin: ["exco", "programme_admin", "foundation_staff"],
  run_matching: ["exco", "programme_admin"],
  manage_spaces: ["exco", "programme_admin"],
  view_reports: ["exco", "foundation_staff"],
};

export function can(user: AppUser | null | undefined, action: Action): boolean {
  if (!user) return false;
  return RULES[action]?.includes(user.role) ?? false;
}
