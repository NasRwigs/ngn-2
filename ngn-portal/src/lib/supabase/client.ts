"use client";

import { createBrowserClient } from "@supabase/ssr";

import { isSupabaseEnabled } from "./config";

export function createSupabaseBrowserClient() {
  if (!isSupabaseEnabled()) {
    throw new Error("Supabase is not configured.");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
