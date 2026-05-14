/**
 * Auth session seam.
 *
 * When Supabase is configured, resolves the signed-in user from Supabase Auth
 * + `profiles`. Otherwise (local mock / CI), uses the `ngn_persona` cookie and
 * fixture members.
 */

import { cookies } from "next/headers";

import type { AppUser, UserRole } from "@/components/app-shell";
import { mapProfileToAppUser, type ProfileRow } from "@/lib/data/supabase/mappers";
import { findMemberByPersona, personas } from "@/lib/data/personas";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PersonaKey = keyof typeof personas;

export async function getCurrentUser(): Promise<AppUser> {
  if (isSupabaseEnabled()) {
    try {
      const supabase = await createSupabaseServerClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
        if (profile) {
          return mapProfileToAppUser(profile as ProfileRow, 0);
        }
        return {
          id: user.id,
          name: user.user_metadata?.full_name ?? user.email ?? "Member",
          firstName:
            (user.user_metadata?.full_name as string | undefined)?.split(
              " ",
            )[0] ??
            user.email?.split("@")[0] ??
            "Member",
          email: user.email ?? "",
          role: "member",
          avatarUrl: null,
          unreadMessages: 0,
        };
      }
    } catch {
      /* Supabase client unavailable */
    }
  }

  const cookieStore = await cookies();
  const personaKey =
    (cookieStore.get("ngn_persona")?.value as PersonaKey | undefined) ??
    "member_sarah";

  const member = findMemberByPersona(personaKey) ?? findMemberByPersona(
    "member_sarah",
  );

  if (!member) {
    throw new Error(
      "No personas defined. Add at least one persona in src/lib/data/personas.ts.",
    );
  }

  return {
    id: member.id,
    name: member.name,
    firstName: member.name.split(" ")[0] ?? member.name,
    email: member.email,
    role: member.role as UserRole,
    avatarUrl: member.avatarUrl ?? null,
    unreadMessages: member.unreadMessages ?? 0,
  };
}

export async function getPersonaKey(): Promise<PersonaKey> {
  const cookieStore = await cookies();
  return (
    (cookieStore.get("ngn_persona")?.value as PersonaKey | undefined) ??
    "member_sarah"
  );
}
