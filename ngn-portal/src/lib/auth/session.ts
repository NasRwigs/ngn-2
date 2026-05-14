/**
 * Auth session seam.
 *
 * Today this reads a `ngn_persona` cookie (set by /dev/persona) and returns
 * a fixture user. When Supabase Auth lands, this is the only file that needs
 * to change — replace the cookie read with a Supabase session lookup.
 */

import { cookies } from "next/headers";

import type { AppUser, UserRole } from "@/components/app-shell";
import { findMemberByPersona, personas } from "@/lib/data/personas";

export type PersonaKey = keyof typeof personas;

export async function getCurrentUser(): Promise<AppUser> {
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
