import { describe, expect, it } from "vitest";

import { can } from "@/lib/auth/permissions";
import type { AppUser } from "@/components/app-shell";

function user(role: AppUser["role"]): AppUser {
  return {
    id: "u",
    name: "U",
    firstName: "U",
    email: "u@example.org",
    role,
  };
}

describe("permissions.can", () => {
  it("ExCo can view admin", () => {
    expect(can(user("exco"), "view_admin")).toBe(true);
  });

  it("member cannot view admin", () => {
    expect(can(user("member"), "view_admin")).toBe(false);
  });

  it("only admins can create events", () => {
    expect(can(user("programme_admin"), "create_event")).toBe(true);
    expect(can(user("member"), "create_event")).toBe(false);
  });

  it("members can request mentorship; ecosystem participants cannot", () => {
    expect(can(user("member"), "request_mentorship")).toBe(true);
    expect(can(user("ecosystem_participant"), "request_mentorship")).toBe(false);
  });

  it("null user has no permissions", () => {
    expect(can(null, "edit_own_profile")).toBe(false);
  });
});
