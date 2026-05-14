import { CIRCLES, ONE_TO_MANY_SESSIONS } from "./fixtures/circles";
import { EVENTS } from "./fixtures/events";
import { CHAT_MESSAGES, CONVERSATIONS } from "./fixtures/messages";
import {
  MEMBERS,
  findMember,
  findMemberBySlug,
} from "./fixtures/members";
import { NOTIFICATIONS } from "./fixtures/notifications";
import {
  MENTORSHIP_REQUESTS,
  PAIRS,
  SESSIONS,
} from "./fixtures/pairs";
import { DISCUSSION_SPACES } from "./fixtures/spaces";
import { DISCUSSION_THREADS, THREAD_REPLIES } from "./fixtures/threads";
import { MODERATION_REPORTS } from "./fixtures/moderation-reports";
import type { Queries } from "./queries";
import type { Mutations } from "./mutations";
import type { AdminStat, DiscussionThread } from "./types";

const sleep = (ms = 30) => new Promise((r) => setTimeout(r, ms));

function withThreadCounts(thread: DiscussionThread): DiscussionThread {
  const messageCount = THREAD_REPLIES.filter((r) => r.threadId === thread.id)
    .length;
  return { ...thread, messageCount };
}

export const queries: Queries = {
  members: {
    async me(currentUserId) {
      await sleep();
      const m = findMember(currentUserId) ?? MEMBERS[0];
      if (!m) throw new Error("no members");
      return m;
    },
    async list(filter) {
      await sleep();
      let result = [...MEMBERS];
      if (filter?.query) {
        const q = filter.query.toLowerCase();
        result = result.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.organisation.toLowerCase().includes(q) ||
            m.title.toLowerCase().includes(q) ||
            m.expertise.some((tag) => tag.toLowerCase().includes(q)),
        );
      }
      if (filter?.country) {
        result = result.filter((m) => m.country === filter.country);
      }
      if (filter?.sector) {
        result = result.filter((m) => m.sectors.includes(filter.sector!));
      }
      if (filter?.expertise) {
        result = result.filter((m) =>
          m.expertise.some((tag) =>
            tag.toLowerCase().includes(filter.expertise!.toLowerCase()),
          ),
        );
      }
      if (filter?.mentorshipStatus) {
        result = result.filter(
          (m) => m.mentorshipStatus === filter.mentorshipStatus,
        );
      }
      return result;
    },
    async byId(id) {
      await sleep();
      return findMember(id) ?? null;
    },
    async bySlug(slug) {
      await sleep();
      return findMemberBySlug(slug) ?? null;
    },
    async suggestedMentors(currentUserId) {
      await sleep();
      return MEMBERS.filter(
        (m) =>
          m.id !== currentUserId &&
          (m.mentorshipStatus === "accepting_mentees" ||
            m.mentorshipStatus === "both"),
      ).slice(0, 4);
    },
  },
  pairs: {
    async forUser(userId) {
      await sleep();
      return PAIRS.filter(
        (p) => p.mentorId === userId || p.menteeId === userId,
      );
    },
    async byId(id) {
      await sleep();
      return PAIRS.find((p) => p.id === id) ?? null;
    },
    async sessions(pairId) {
      await sleep();
      return SESSIONS.filter((s) => s.pairId === pairId).sort((a, b) =>
        b.date.localeCompare(a.date),
      );
    },
  },
  mentorship: {
    async requestsForUser(userId) {
      await sleep();
      return MENTORSHIP_REQUESTS.filter(
        (r) => r.fromUserId === userId || r.toUserId === userId,
      );
    },
  },
  events: {
    async list(opts) {
      await sleep();
      const now = Date.now();
      let result = [...EVENTS];
      if (opts?.upcomingOnly) {
        result = result.filter((e) => new Date(e.startAt).getTime() >= now);
      }
      if (opts?.area) {
        result = result.filter((e) => e.programmeArea === opts.area);
      }
      return result.sort((a, b) => a.startAt.localeCompare(b.startAt));
    },
    async bySlug(slug) {
      await sleep();
      return EVENTS.find((e) => e.slug === slug) ?? null;
    },
  },
  circles: {
    async list() {
      await sleep();
      return CIRCLES;
    },
    async bySlug(slug) {
      await sleep();
      return CIRCLES.find((c) => c.slug === slug) ?? null;
    },
  },
  sessions: {
    async list() {
      await sleep();
      return ONE_TO_MANY_SESSIONS;
    },
    async byId(id) {
      await sleep();
      return ONE_TO_MANY_SESSIONS.find((s) => s.id === id) ?? null;
    },
  },
  messages: {
    async conversations(userId) {
      await sleep();
      return CONVERSATIONS.filter((c) => c.participantIds.includes(userId)).sort(
        (a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt),
      );
    },
    async conversation(id) {
      await sleep();
      return CONVERSATIONS.find((c) => c.id === id) ?? null;
    },
    async messages(conversationId) {
      await sleep();
      return CHAT_MESSAGES.filter((m) => m.conversationId === conversationId).sort(
        (a, b) => a.sentAt.localeCompare(b.sentAt),
      );
    },
    async unreadCount(userId) {
      await sleep();
      return CONVERSATIONS.filter((c) => c.participantIds.includes(userId))
        .map((c) => c.unreadCount)
        .reduce((a, b) => a + b, 0);
    },
  },
  notifications: {
    async list(userId) {
      await sleep();
      return NOTIFICATIONS.filter((n) => n.userId === userId);
    },
    async unreadCount(userId) {
      await sleep();
      return NOTIFICATIONS.filter((n) => n.userId === userId && !n.readAt)
        .length;
    },
  },
  spaces: {
    async list() {
      await sleep();
      return DISCUSSION_SPACES;
    },
    async bySlug(slug) {
      await sleep();
      return DISCUSSION_SPACES.find((s) => s.slug === slug) ?? null;
    },
    async threads(spaceSlug) {
      await sleep();
      return DISCUSSION_THREADS.filter((t) => t.spaceSlug === spaceSlug)
        .map(withThreadCounts)
        .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
    },
    async thread(spaceSlug, threadId) {
      await sleep();
      const t = DISCUSSION_THREADS.find(
        (x) => x.spaceSlug === spaceSlug && x.id === threadId,
      );
      return t ? withThreadCounts(t) : null;
    },
    async threadReplies(spaceSlug, threadId) {
      await sleep();
      const t = DISCUSSION_THREADS.find(
        (x) => x.spaceSlug === spaceSlug && x.id === threadId,
      );
      if (!t) return [];
      return THREAD_REPLIES.filter((r) => r.threadId === threadId).sort((a, b) =>
        a.sentAt.localeCompare(b.sentAt),
      );
    },
  },
  admin: {
    async overviewStats() {
      await sleep();
      const stats: AdminStat[] = [
        { label: "Total Members", value: MEMBERS.length, trendPct: 12, tone: "info" },
        { label: "Active Pairs", value: PAIRS.filter((p) => p.status === "Active").length, trendPct: 5, tone: "success" },
        { label: "Pending Requests", value: MENTORSHIP_REQUESTS.filter((r) => r.status === "pending").length, trendPct: -2, tone: "warning" },
        { label: "Avg Programme Duration", value: "4.2 mo", trendPct: 1, tone: "info" },
      ];
      return stats;
    },
    async membersAdmin() {
      await sleep();
      return MEMBERS;
    },
    async pairsRequiringAttention() {
      await sleep();
      return PAIRS.filter((p) => p.status === "Pending" || p.status === "At Risk");
    },
    async unmatchedMentees() {
      await sleep();
      const pairedMenteeIds = new Set(PAIRS.map((p) => p.menteeId));
      return MEMBERS.filter(
        (m) =>
          (m.mentorshipStatus === "looking_for_mentor" ||
            m.mentorshipStatus === "both") &&
          !pairedMenteeIds.has(m.id),
      );
    },
    async moderationQueue() {
      await sleep();
      return [...MODERATION_REPORTS];
    },
  },
};

void findMember;

let nextId = 100;
const generateId = () => `mock_${nextId++}_${Date.now()}`;

export const mutations: Mutations = {
  members: {
    async updateProfile(userId, input) {
      await sleep();
      const idx = MEMBERS.findIndex((m) => m.id === userId);
      if (idx === -1) throw new Error("Member not found");
      const existing = MEMBERS[idx]!;
      MEMBERS[idx] = { ...existing, ...input };
      return MEMBERS[idx]!;
    },
  },
  auth: {
    async signUp(input) {
      await sleep(120);
      const newId = generateId();
      const slug = input.name.toLowerCase().replace(/[^a-z]+/g, "-");
      const newMember = {
        id: newId,
        slug,
        name: input.name,
        email: input.email,
        role: "member" as const,
        title: input.title,
        organisation: input.organisation,
        country: input.country,
        nationality: input.nationality,
        sectors: input.sectors,
        expertise: input.expertise,
        bio: input.bio,
        languages: input.languages,
        timezone: input.timezone,
        linkedinUrl: input.linkedinUrl,
        websiteUrl: input.websiteUrl,
        mentorshipStatus: input.mentorshipStatus,
        joinedAt: new Date().toISOString().split("T")[0]!,
        lastActiveAt: new Date().toISOString(),
      };
      MEMBERS.push(newMember);
      return { userId: newId };
    },
    async sendMagicLink() {
      await sleep(300);
      return { ok: true };
    },
    async requestPasswordReset() {
      await sleep(300);
      return { ok: true };
    },
  },
  mentorship: {
    async sendRequest(fromUserId, input) {
      await sleep();
      const id = generateId();
      MENTORSHIP_REQUESTS.push({
        id,
        fromUserId,
        toUserId: input.toUserId,
        status: "pending",
        motivation: input.motivation,
        goals: input.goals,
        preferredCadence: input.preferredCadence,
        createdAt: new Date().toISOString(),
      });
      return { requestId: id };
    },
    async submitIntake(pairId) {
      await sleep();
      const pair = PAIRS.find((p) => p.id === pairId);
      if (!pair) throw new Error("Pair not found");
      return { ok: true };
    },
    async logSession(pairId, input) {
      await sleep();
      const id = generateId();
      SESSIONS.push({
        id,
        pairId,
        date: input.date,
        durationMinutes: input.durationMinutes,
        format: input.format,
        notes: input.notes,
        goalsDiscussed: input.goalsDiscussed,
        wellbeing: input.wellbeing,
      });
      return { sessionId: id };
    },
  },
  events: {
    async register(eventId) {
      await sleep();
      const event = EVENTS.find((e) => e.id === eventId);
      if (event) {
        event.registeredCount += 1;
        event.registered = true;
      }
      return { ok: true };
    },
    async unregister(eventId) {
      await sleep();
      const event = EVENTS.find((e) => e.id === eventId);
      if (event && event.registeredCount > 0) {
        event.registeredCount -= 1;
        event.registered = false;
      }
      return { ok: true };
    },
    async create() {
      await sleep();
      return { eventId: generateId() };
    },
  },
  circles: {
    async create() {
      await sleep();
      return { circleId: generateId() };
    },
    async join(circleId, userId) {
      await sleep();
      const circle = CIRCLES.find((c) => c.id === circleId);
      if (circle && !circle.memberIds.includes(userId)) {
        circle.memberIds.push(userId);
      }
      return { ok: true };
    },
  },
  messages: {
    async send(conversationId, senderId, body) {
      await sleep();
      const id = generateId();
      CHAT_MESSAGES.push({
        id,
        conversationId,
        senderId,
        body,
        sentAt: new Date().toISOString(),
      });
      const c = CONVERSATIONS.find((c) => c.id === conversationId);
      if (c) {
        c.lastMessageAt = new Date().toISOString();
        c.lastMessage = body;
      }
      return { messageId: id };
    },
    async markRead(conversationId) {
      await sleep();
      const c = CONVERSATIONS.find((c) => c.id === conversationId);
      if (c) c.unreadCount = 0;
      return { ok: true };
    },
  },
  spaces: {
    async createThread(spaceSlug, authorId, input) {
      await sleep();
      const space = DISCUSSION_SPACES.find((s) => s.slug === spaceSlug);
      if (!space) throw new Error("Space not found");
      const tid = generateId();
      const now = new Date().toISOString();
      DISCUSSION_THREADS.push({
        id: tid,
        spaceId: space.id,
        spaceSlug: space.slug,
        title: input.title,
        authorId,
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
        messageCount: 1,
      });
      THREAD_REPLIES.push({
        id: generateId(),
        threadId: tid,
        authorId,
        body: input.body,
        sentAt: now,
      });
      return { threadId: tid };
    },
    async replyToThread(spaceSlug, threadId, authorId, body) {
      await sleep();
      const thread = DISCUSSION_THREADS.find(
        (t) => t.id === threadId && t.spaceSlug === spaceSlug,
      );
      if (!thread) throw new Error("Thread not found");
      const now = new Date().toISOString();
      const rid = generateId();
      THREAD_REPLIES.push({
        id: rid,
        threadId,
        authorId,
        body,
        sentAt: now,
      });
      thread.lastActivityAt = now;
      thread.updatedAt = now;
      thread.messageCount = THREAD_REPLIES.filter((r) => r.threadId === threadId)
        .length;
      return { replyId: rid };
    },
  },
  admin: {
    async moderationResolve(reportId, _action) {
      await sleep();
      void _action;
      const idx = MODERATION_REPORTS.findIndex((r) => r.id === reportId);
      if (idx !== -1) MODERATION_REPORTS.splice(idx, 1);
      return { ok: true };
    },
  },
};
