import type { Member } from "./types";

/**
 * Personas used by the dev switcher. Maps a key (cookie value) to the
 * member id in the fixture set. Adding a persona here also requires a
 * matching member in `fixtures/members.ts`.
 */
export const personas = {
  member_sarah: { memberSlug: "sarah-jenkins", label: "Sarah Jenkins — Member" },
  member_kwame: { memberSlug: "kwame-mensah", label: "Kwame Mensah — Member" },
  exco_amina: { memberSlug: "amina-diop", label: "Dr Amina Diop — ExCo" },
  programme_admin_nneka: {
    memberSlug: "nneka-okafor",
    label: "Nneka Okafor — Programme Admin",
  },
  foundation_staff_omar: {
    memberSlug: "omar-hassan",
    label: "Omar Hassan — Foundation Staff",
  },
} as const;

import { MEMBERS } from "./fixtures/members";

export function findMemberByPersona(
  key: keyof typeof personas,
): Member | undefined {
  const persona = personas[key];
  if (!persona) return undefined;
  return MEMBERS.find((m) => m.slug === persona.memberSlug);
}
