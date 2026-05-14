/**
 * Whether the app should use Supabase for auth and data.
 * Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and
 * omit DATA_PROVIDER=mock (or set DATA_PROVIDER=supabase).
 */
export function isSupabaseEnabled(): boolean {
  if (process.env.DATA_PROVIDER === "mock") return false;
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
