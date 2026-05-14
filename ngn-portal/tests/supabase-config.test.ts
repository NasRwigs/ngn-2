import { describe, expect, it } from "vitest";

import { isSupabaseEnabled } from "@/lib/supabase/config";

describe("isSupabaseEnabled", () => {
  it("returns false when DATA_PROVIDER is mock", () => {
    const prevMock = process.env.DATA_PROVIDER;
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const prevKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    try {
      process.env.DATA_PROVIDER = "mock";
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "pk_test";
      expect(isSupabaseEnabled()).toBe(false);
    } finally {
      process.env.DATA_PROVIDER = prevMock;
      process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = prevKey;
    }
  });
});
