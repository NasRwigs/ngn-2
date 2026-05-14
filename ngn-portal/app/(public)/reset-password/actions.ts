"use server";

import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requestPasswordResetAction(
  email: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseEnabled()) {
    return { ok: true };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/reset-password/confirm`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updatePasswordAction(
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseEnabled()) {
    return { ok: true };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
