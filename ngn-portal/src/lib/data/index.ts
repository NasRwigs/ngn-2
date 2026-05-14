/**
 * Data provider seam.
 *
 * Server Components call `await dataProvider()` to get the typed query +
 * mutation interfaces. Today this returns the mock implementation. When
 * Supabase lands, change the import here and nothing else needs to move.
 */

import { isSupabaseEnabled } from "@/lib/supabase/config";

import type { Mutations } from "./mutations";
import type { Queries } from "./queries";
import { mutations as mockMutations, queries as mockQueries } from "./mock-impl";
import { createSupabaseDataProvider } from "./supabase/provider";

export interface DataProvider {
  queries: Queries;
  mutations: Mutations;
}

export async function dataProvider(): Promise<DataProvider> {
  if (isSupabaseEnabled()) {
    return createSupabaseDataProvider();
  }
  return { queries: mockQueries, mutations: mockMutations };
}

export type {
  Member,
  Pair,
  NgnEvent,
  ChatMessage,
  Conversation,
  DiscussionThread,
  ThreadReply,
  ModerationReport,
} from "./types";
