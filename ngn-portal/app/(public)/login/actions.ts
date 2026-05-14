"use server";

import { revalidatePath } from "next/cache";

import { isSupabaseEnabled } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInWithPasswordAction(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseEnabled()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/", "layout");
  return { ok: true };
}
