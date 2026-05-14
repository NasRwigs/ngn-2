/**
 * Mutation interface. Server Actions wrap these. The mock implementation
 * stores state in memory and is reset per dev session; the Supabase impl
 * will write through to Postgres.
 */

import type { Member } from "./types";

export interface ProfileInput {
  name: string;
  title: string;
  organisation: string;
  country: string;
  sectors: string[];
  expertise: string[];
  bio: string;
  languages: string[];
  timezone: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  mentorshipStatus: Member["mentorshipStatus"];
}

export interface OnboardingInput {
  email: string;
  password: string;
  name: string;
  country: string;
  nationality: string;
  title: string;
  organisation: string;
  sectors: string[];
  expertise: string[];
  bio: string;
  languages: string[];
  timezone: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  mentorshipStatus: Member["mentorshipStatus"];
  skillsOffered?: string[];
  skillsWanted?: string[];
}

export interface MentorshipRequestInput {
  toUserId: string;
  motivation: string;
  goals: string;
  preferredCadence: "weekly" | "biweekly" | "monthly";
}

export interface IntakeInput {
  goals: Array<{ title: string; successCriteria: string }>;
  workingAgreement: string;
  cadence: "weekly" | "biweekly" | "monthly";
}

export interface SessionInput {
  date: string;
  durationMinutes: number;
  format: "video" | "phone" | "in_person";
  notes: string;
  goalsDiscussed: string[];
  wellbeing: "great" | "good" | "fair" | "poor";
}

export interface EventInput {
  title: string;
  description: string;
  programmeArea: string;
  type: string;
  format: string;
  startAt: string;
  endAt: string;
  location?: string;
  videoUrl?: string;
  speakerIds: string[];
  registrationRequired: boolean;
  capacity?: number;
}

export interface CircleInput {
  name: string;
  topic: string;
  cadence: "weekly" | "biweekly" | "monthly";
  capacity: number;
  facilitatorIds: string[];
  description: string;
}

export interface DiscussionThreadInput {
  title: string;
  body: string;
}

export interface Mutations {
  members: {
    updateProfile(userId: string, input: ProfileInput): Promise<Member>;
  };
  auth: {
    signUp(input: OnboardingInput): Promise<{ userId: string }>;
    sendMagicLink(email: string): Promise<{ ok: true }>;
    requestPasswordReset(email: string): Promise<{ ok: true }>;
  };
  mentorship: {
    sendRequest(
      fromUserId: string,
      input: MentorshipRequestInput,
    ): Promise<{ requestId: string }>;
    submitIntake(
      pairId: string,
      input: IntakeInput,
    ): Promise<{ ok: true }>;
    logSession(
      pairId: string,
      input: SessionInput,
    ): Promise<{ sessionId: string }>;
  };
  events: {
    register(eventId: string, userId: string): Promise<{ ok: true }>;
    unregister(eventId: string, userId: string): Promise<{ ok: true }>;
    create(input: EventInput): Promise<{ eventId: string }>;
  };
  circles: {
    create(input: CircleInput): Promise<{ circleId: string }>;
    join(circleId: string, userId: string): Promise<{ ok: true }>;
  };
  messages: {
    send(
      conversationId: string,
      senderId: string,
      body: string,
    ): Promise<{ messageId: string }>;
    markRead(conversationId: string, userId: string): Promise<{ ok: true }>;
  };
  spaces: {
    createThread(
      spaceSlug: string,
      authorId: string,
      input: DiscussionThreadInput,
    ): Promise<{ threadId: string }>;
    replyToThread(
      spaceSlug: string,
      threadId: string,
      authorId: string,
      body: string,
    ): Promise<{ replyId: string }>;
  };
  admin: {
    moderationResolve(
      reportId: string,
      action: "keep" | "remove",
    ): Promise<{ ok: true }>;
  };
}
