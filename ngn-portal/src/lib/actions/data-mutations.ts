"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/permissions";
import { dataProvider } from "@/lib/data";
import type {
  CircleInput,
  DiscussionSpaceInput,
  EventInput,
  GroupSessionInput,
  IntakeInput,
  MentorshipRequestInput,
  ProfileInput,
  SessionInput,
} from "@/lib/data/mutations";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";

export async function updateProfileAction(input: ProfileInput) {
  const user = await getCurrentUser();
  if (!can(user, "edit_own_profile")) {
    throw new Error("You cannot edit this profile.");
  }
  const { mutations } = await dataProvider();
  await mutations.members.updateProfile(user.id, input);
  revalidatePath("/connect");
  revalidatePath(`/connect/${user.id}`);
}

export async function sendMentorshipRequestAction(input: MentorshipRequestInput) {
  const user = await getCurrentUser();
  if (!can(user, "request_mentorship")) {
    throw new Error("You cannot send mentorship requests.");
  }
  const { mutations } = await dataProvider();
  await mutations.mentorship.sendRequest(user.id, input);
  revalidatePath("/mentor");
}

export async function submitIntakeAction(pairId: string, input: IntakeInput) {
  const user = await getCurrentUser();
  if (!can(user, "log_session") && !can(user, "request_mentorship")) {
    throw new Error("Forbidden");
  }
  const { mutations } = await dataProvider();
  await mutations.mentorship.submitIntake(pairId, input);
  revalidatePath(`/mentor/pairs/${pairId}`);
}

export async function logSessionAction(pairId: string, input: SessionInput) {
  const user = await getCurrentUser();
  if (!can(user, "log_session")) {
    throw new Error("Forbidden");
  }
  const { mutations } = await dataProvider();
  await mutations.mentorship.logSession(pairId, input);
  revalidatePath(`/mentor/pairs/${pairId}`);
}

export async function createProgramEventAction(input: EventInput) {
  const user = await getCurrentUser();
  if (!can(user, "create_event")) {
    throw new Error("Forbidden");
  }
  const { mutations } = await dataProvider();
  const { eventId } = await mutations.events.create(input);
  revalidatePath("/events");
  revalidatePath("/admin/events");
  return { eventId };
}

export async function createCircleProgramAction(input: CircleInput) {
  const user = await getCurrentUser();
  if (!can(user, "create_circle")) {
    throw new Error("Forbidden");
  }
  const { mutations } = await dataProvider();
  const { circleId } = await mutations.circles.create(input);
  revalidatePath("/discuss/circles");
  return { circleId };
}

export async function createDiscussionSpaceAdminAction(
  input: DiscussionSpaceInput,
) {
  const user = await getCurrentUser();
  if (!can(user, "manage_spaces")) {
    throw new Error("Forbidden");
  }
  const { mutations } = await dataProvider();
  const { slug } = await mutations.spaces.createSpace(input);
  revalidatePath("/admin/spaces");
  revalidatePath("/discuss/spaces");
  return { slug };
}

export async function createGroupSessionAction(input: GroupSessionInput) {
  const user = await getCurrentUser();
  if (!can(user, "create_session")) {
    throw new Error("Forbidden");
  }
  const { mutations } = await dataProvider();
  const { sessionId } = await mutations.groupSessions.create(user.id, input);
  revalidatePath("/discuss/sessions");
  return { sessionId };
}

export async function registerForEventAction(eventId: string) {
  const user = await getCurrentUser();
  const { mutations } = await dataProvider();
  await mutations.events.register(eventId, user.id);
  revalidatePath("/events");
}

export async function unregisterFromEventAction(eventId: string) {
  const user = await getCurrentUser();
  const { mutations } = await dataProvider();
  await mutations.events.unregister(eventId, user.id);
  revalidatePath("/events");
}

export async function joinCircleAction(circleId: string) {
  const user = await getCurrentUser();
  const { mutations } = await dataProvider();
  await mutations.circles.join(circleId, user.id);
  revalidatePath("/discuss/circles");
}

export async function inviteMemberByEmailAction(input: {
  email: string;
  name: string;
  role: string;
  note?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  if (!can(user, "invite_member")) {
    return { ok: false, error: "Forbidden" };
  }
  if (!isSupabaseEnabled()) {
    return { ok: true };
  }
  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin.auth.admin.inviteUserByEmail(input.email, {
      data: { full_name: input.name, invited_role: input.role, note: input.note },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/onboarding`,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Invite failed",
    };
  }
}
