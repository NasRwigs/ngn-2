"use server";

import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Verifies a TOTP code for the signed-in user when MFA is enabled in Supabase.
 */
export async function verifyTotpAction(
  code: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseEnabled()) {
    return { ok: true };
  }
  const supabase = await createSupabaseServerClient();
  const { data: factors, error: fe } = await supabase.auth.mfa.listFactors();
  if (fe) return { ok: false, error: fe.message };
  const totp = factors?.totp?.find((f) => f.status === "verified");
  if (!totp) {
    return { ok: false, error: "No verified TOTP factor for this account." };
  }
  const { data: challenge, error: ce } = await supabase.auth.mfa.challenge({
    factorId: totp.id,
  });
  if (ce || !challenge) return { ok: false, error: ce?.message ?? "Challenge failed" };
  const { error: ve } = await supabase.auth.mfa.verify({
    factorId: totp.id,
    challengeId: challenge.id,
    code: code.replace(/\s/g, ""),
  });
  if (ve) return { ok: false, error: ve.message };
  return { ok: true };
}
