import type { UserRole } from "@/components/app-shell";
import type { Country } from "@/lib/taxonomy/countries";
import type { ProgrammeArea } from "@/lib/taxonomy/programme-areas";
import type { Sector } from "@/lib/taxonomy/sectors";
import type {
  EventFormat,
  EventType,
  PairStatus,
  RequestStatus,
} from "@/lib/taxonomy/statuses";

export interface Member {
  id: string;
  slug: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  unreadMessages?: number;
  title: string;
  organisation: string;
  country: Country | string;
  nationality?: Country | string;
  sectors: Array<Sector | string>;
  expertise: string[];
  bio: string;
  languages: string[];
  timezone: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  mentorshipStatus:
    | "accepting_mentees"
    | "looking_for_mentor"
    | "both"
    | "not_now";
  availability?: "weekly" | "biweekly" | "monthly";
  joinedAt: string;
  lastActiveAt: string;
}

export interface MemberFilter {
  query?: string;
  country?: string;
  sector?: string;
  expertise?: string;
  mentorshipStatus?: Member["mentorshipStatus"];
}

export interface PairGoal {
  id: string;
  title: string;
  successCriteria: string;
  status: "not_started" | "in_progress" | "completed";
  notes?: string;
}

export interface Session {
  id: string;
  pairId: string;
  date: string;
  durationMinutes: number;
  format: "video" | "phone" | "in_person";
  notes: string;
  goalsDiscussed: string[];
  wellbeing: "great" | "good" | "fair" | "poor";
  attachments?: Array<{ id: string; filename: string; url: string }>;
}

export interface Pair {
  id: string;
  mentorId: string;
  menteeId: string;
  status: PairStatus;
  startedAt: string;
  programmeMonths: number;
  monthsCompleted: number;
  cohort: string;
  goals: PairGoal[];
  nextMeetingAt?: string;
  cadence: "weekly" | "biweekly" | "monthly";
}

export interface MentorshipRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: RequestStatus;
  motivation: string;
  goals: string;
  preferredCadence: "weekly" | "biweekly" | "monthly";
  createdAt: string;
}

export interface NgnEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  programmeArea: ProgrammeArea;
  type: EventType;
  format: EventFormat;
  startAt: string;
  endAt: string;
  location?: string;
  videoUrl?: string;
  speakers: Array<{ id: string; name: string; role: string; avatarUrl?: string | null }>;
  registrationRequired: boolean;
  capacity?: number;
  registeredCount: number;
  registered?: boolean;
  recordingUrl?: string;
  materials?: Array<{ id: string; filename: string; url: string }>;
  recap?: string;
}

export interface Circle {
  id: string;
  slug: string;
  name: string;
  topic: string;
  cadence: "weekly" | "biweekly" | "monthly";
  capacity: number;
  facilitators: string[];
  memberIds: string[];
  description: string;
  createdAt: string;
}

export interface OneToManySession {
  id: string;
  title: string;
  description: string;
  hostId: string;
  programmeArea: ProgrammeArea;
  startAt: string;
  endAt: string;
  format: EventFormat;
  capacity: number;
  registeredCount: number;
  recordingUrl?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessageAt: string;
  lastMessage: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
  readAt?: string | null;
  attachment?: { filename: string; url: string; size: number };
}

export interface DiscussionSpace {
  id: string;
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  programmeArea?: ProgrammeArea;
}

/** Forum-style thread inside a discussion space (mock-backed until Supabase). */
export interface DiscussionThread {
  id: string;
  spaceId: string;
  /** Denormalised for routing and fixtures. */
  spaceSlug: string;
  title: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  /** Total posts in the thread (including the opening post). */
  messageCount: number;
  pinned?: boolean;
}

export interface ThreadReply {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  sentAt: string;
}

export interface ModerationReport {
  id: string;
  kind: "post" | "comment";
  /** Display label (mock). */
  reportedBy: string;
  reason: string;
  body: string;
  spaceName: string;
  reportedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  kind: "mentorship" | "event" | "message" | "system";
  title: string;
  body: string;
  href: string;
  createdAt: string;
  readAt?: string | null;
}

export interface AdminStat {
  label: string;
  value: number | string;
  trendPct?: number;
  tone?: "info" | "warning" | "error" | "success";
}
