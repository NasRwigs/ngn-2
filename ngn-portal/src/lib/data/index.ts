/**
 * Data provider seam.
 *
 * Server Components call `await dataProvider()` to get the typed query +
 * mutation interfaces. Today this returns the mock implementation. When
 * Supabase lands, change the import here and nothing else needs to move.
 */

import { mutations, queries } from "./mock-impl";

export interface DataProvider {
  queries: typeof queries;
  mutations: typeof mutations;
}

export async function dataProvider(): Promise<DataProvider> {
  return { queries, mutations };
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
