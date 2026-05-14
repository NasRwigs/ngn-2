/**
 * Query interface. Components consume this via `dataProvider`. The mock
 * implementation lives in `mock-impl.ts`; the future Supabase implementation
 * will satisfy the same interface.
 */

import type {
  AdminStat,
  ChatMessage,
  Circle,
  Conversation,
  DiscussionSpace,
  DiscussionThread,
  Member,
  MemberFilter,
  MentorshipRequest,
  ModerationReport,
  NgnEvent,
  NotificationItem,
  OneToManySession,
  Pair,
  Session,
  ThreadReply,
} from "./types";

export interface Queries {
  members: {
    me(currentUserId: string): Promise<Member>;
    list(filter?: MemberFilter): Promise<Member[]>;
    byId(id: string): Promise<Member | null>;
    bySlug(slug: string): Promise<Member | null>;
    suggestedMentors(currentUserId: string): Promise<Member[]>;
  };
  pairs: {
    forUser(userId: string): Promise<Pair[]>;
    byId(id: string): Promise<Pair | null>;
    sessions(pairId: string): Promise<Session[]>;
  };
  mentorship: {
    requestsForUser(userId: string): Promise<MentorshipRequest[]>;
  };
  events: {
    list(opts?: { upcomingOnly?: boolean; area?: string }): Promise<NgnEvent[]>;
    bySlug(slug: string): Promise<NgnEvent | null>;
  };
  circles: {
    list(): Promise<Circle[]>;
    bySlug(slug: string): Promise<Circle | null>;
  };
  sessions: {
    list(): Promise<OneToManySession[]>;
    byId(id: string): Promise<OneToManySession | null>;
  };
  messages: {
    conversations(userId: string): Promise<Conversation[]>;
    conversation(id: string): Promise<Conversation | null>;
    messages(conversationId: string): Promise<ChatMessage[]>;
    unreadCount(userId: string): Promise<number>;
  };
  notifications: {
    list(userId: string): Promise<NotificationItem[]>;
    unreadCount(userId: string): Promise<number>;
  };
  spaces: {
    list(): Promise<DiscussionSpace[]>;
    bySlug(slug: string): Promise<DiscussionSpace | null>;
    threads(spaceSlug: string): Promise<DiscussionThread[]>;
    thread(
      spaceSlug: string,
      threadId: string,
    ): Promise<DiscussionThread | null>;
    threadReplies(
      spaceSlug: string,
      threadId: string,
    ): Promise<ThreadReply[]>;
  };
  admin: {
    overviewStats(): Promise<AdminStat[]>;
    membersAdmin(): Promise<Member[]>;
    pairsRequiringAttention(): Promise<Pair[]>;
    unmatchedMentees(): Promise<Member[]>;
    moderationQueue(): Promise<ModerationReport[]>;
  };
}
