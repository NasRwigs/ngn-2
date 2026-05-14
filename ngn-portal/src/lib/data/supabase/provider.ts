import { createSupabaseServerClient } from "@/lib/supabase/server";

import type { Mutations } from "../mutations";
import type { Queries } from "../queries";
import { buildSupabaseMutations } from "./supabase-mutations";
import { buildSupabaseQueries } from "./supabase-queries";

export async function createSupabaseDataProvider(): Promise<{
  queries: Queries;
  mutations: Mutations;
}> {
  const supabase = await createSupabaseServerClient();
  return {
    queries: buildSupabaseQueries(supabase),
    mutations: buildSupabaseMutations(supabase),
  };
}
