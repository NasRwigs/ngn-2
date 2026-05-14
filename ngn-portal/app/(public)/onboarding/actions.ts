"use server";

import type { OnboardingInput } from "@/lib/data/mutations";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signUpFromOnboardingAction(
  input: OnboardingInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseEnabled()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
    },
  });
  if (error) return { ok: false, error: error.message };
  const userId = data.user?.id;
  if (!userId) {
    return {
      ok: false,
      error:
        "Could not create user. If email confirmation is required, check your inbox.",
    };
  }

  const profilePatch = {
    display_name: input.name,
    title: input.title,
    organisation: input.organisation,
    country: input.country,
    nationality: input.nationality,
    sectors: input.sectors,
    expertise: input.expertise,
    bio: input.bio,
    languages: input.languages,
    timezone: input.timezone,
    linkedin_url: input.linkedinUrl ?? null,
    website_url: input.websiteUrl ?? null,
    mentorship_status: input.mentorshipStatus,
    skills_offered: input.skillsOffered ?? [],
    skills_wanted: input.skillsWanted ?? [],
    availability:
      input.mentorshipStatus === "not_now" ? null : (input.cadence ?? "biweekly"),
  };

  try {
    const admin = createSupabaseAdminClient();
    const { error: ae } = await admin
      .from("profiles")
      .update(profilePatch)
      .eq("id", userId);
    if (ae) return { ok: false, error: ae.message };
  } catch {
    if (data.session) {
      const { error: ue } = await supabase
        .from("profiles")
        .update(profilePatch)
        .eq("id", userId);
      if (ue) return { ok: false, error: ue.message };
    }
  }

  return { ok: true };
}
