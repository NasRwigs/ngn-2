import type { AppUser } from "@/components/app-shell";
import type {
  ChatMessage,
  Circle,
  Conversation,
  DiscussionSpace,
  DiscussionThread,
  Member,
  MentorshipRequest,
  ModerationReport,
  NgnEvent,
  NotificationItem,
  OneToManySession,
  Pair,
  PairGoal,
  Session,
  ThreadReply,
} from "@/lib/data/types";

/** Row shape from public.profiles (snake_case). */
export type ProfileRow = {
  id: string;
  slug: string;
  display_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  title: string;
  organisation: string;
  country: string;
  nationality: string;
  sectors: string[];
  expertise: string[];
  bio: string;
  languages: string[];
  timezone: string;
  linkedin_url: string | null;
  website_url: string | null;
  mentorship_status: string;
  availability: string | null;
  skills_offered: string[];
  skills_wanted: string[];
  joined_at: string;
  last_active_at: string;
};

export function mapProfileToMember(row: ProfileRow, unreadMessages = 0): Member {
  return {
    id: row.id,
    slug: row.slug,
    name: row.display_name,
    email: row.email,
    role: row.role as Member["role"],
    avatarUrl: row.avatar_url,
    unreadMessages,
    title: row.title,
    organisation: row.organisation,
    country: row.country,
    nationality: row.nationality,
    sectors: row.sectors ?? [],
    expertise: row.expertise ?? [],
    bio: row.bio,
    languages: row.languages ?? [],
    timezone: row.timezone,
    linkedinUrl: row.linkedin_url ?? undefined,
    websiteUrl: row.website_url ?? undefined,
    mentorshipStatus: row.mentorship_status as Member["mentorshipStatus"],
    availability: (row.availability ?? undefined) as Member["availability"],
    joinedAt: row.joined_at?.slice(0, 10) ?? "",
    lastActiveAt: row.last_active_at ?? "",
  };
}

export function mapProfileToAppUser(
  row: ProfileRow,
  unreadMessages = 0,
): AppUser {
  const name = row.display_name;
  return {
    id: row.id,
    name,
    firstName: name.split(" ")[0] ?? name,
    email: row.email,
    role: row.role as AppUser["role"],
    avatarUrl: row.avatar_url,
    unreadMessages,
  };
}

export function mapPairRow(
  row: {
    id: string;
    mentor_id: string;
    mentee_id: string;
    status: string;
    started_at: string;
    programme_months: number;
    months_completed: number;
    cohort: string;
    next_meeting_at: string | null;
    cadence: string;
    pair_goals?: Array<{
      id: string;
      title: string;
      success_criteria: string;
      status: string;
      notes: string | null;
    }>;
  },
  goalsOverride?: PairGoal[],
): Pair {
  const goals: PairGoal[] =
    goalsOverride ??
    (row.pair_goals ?? []).map((g) => ({
      id: g.id,
      title: g.title,
      successCriteria: g.success_criteria,
      status: g.status as PairGoal["status"],
      notes: g.notes ?? undefined,
    }));
  return {
    id: row.id,
    mentorId: row.mentor_id,
    menteeId: row.mentee_id,
    status: row.status as Pair["status"],
    startedAt: row.started_at?.slice(0, 10) ?? "",
    programmeMonths: row.programme_months,
    monthsCompleted: row.months_completed,
    cohort: row.cohort,
    nextMeetingAt: row.next_meeting_at ?? undefined,
    cadence: row.cadence as Pair["cadence"],
    goals,
  };
}

export function mapSessionLogRow(row: {
  id: string;
  pair_id: string;
  session_date: string;
  duration_minutes: number;
  format: string;
  notes: string;
  goals_discussed: string[];
  wellbeing: string;
}): Session {
  return {
    id: row.id,
    pairId: row.pair_id,
    date: row.session_date,
    durationMinutes: row.duration_minutes,
    format: row.format as Session["format"],
    notes: row.notes,
    goalsDiscussed: row.goals_discussed ?? [],
    wellbeing: row.wellbeing as Session["wellbeing"],
  };
}

export function mapEventRow(
  row: {
    id: string;
    slug: string;
    title: string;
    description: string;
    programme_area: string;
    event_type: string;
    event_format: string;
    start_at: string;
    end_at: string;
    location: string | null;
    video_url: string | null;
    registration_required: boolean;
    capacity: number | null;
    recording_url: string | null;
    recap: string | null;
  },
  extras: {
    registeredCount: number;
    registered?: boolean;
    speakers: NgnEvent["speakers"];
    materials?: NgnEvent["materials"];
  },
): NgnEvent {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    programmeArea: row.programme_area as NgnEvent["programmeArea"],
    type: row.event_type as NgnEvent["type"],
    format: row.event_format as NgnEvent["format"],
    startAt: row.start_at,
    endAt: row.end_at,
    location: row.location ?? undefined,
    videoUrl: row.video_url ?? undefined,
    speakers: extras.speakers,
    registrationRequired: row.registration_required,
    capacity: row.capacity ?? undefined,
    registeredCount: extras.registeredCount,
    registered: extras.registered,
    recordingUrl: row.recording_url ?? undefined,
    materials: extras.materials,
    recap: row.recap ?? undefined,
  };
}

export function mapCircleRow(row: {
  id: string;
  slug: string;
  name: string;
  topic: string;
  cadence: string;
  capacity: number;
  description: string;
  facilitator_ids: string[];
  created_at: string;
}, memberIds: string[]): Circle {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    topic: row.topic,
    cadence: row.cadence as Circle["cadence"],
    capacity: row.capacity,
    facilitators: row.facilitator_ids?.map(String) ?? [],
    memberIds,
    description: row.description,
    createdAt: row.created_at,
  };
}

export function mapGroupSessionRow(row: {
  id: string;
  title: string;
  description: string;
  host_id: string;
  programme_area: string;
  start_at: string;
  end_at: string;
  event_format: string;
  capacity: number;
  recording_url: string | null;
}, registeredCount: number): OneToManySession {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    hostId: row.host_id,
    programmeArea: row.programme_area as OneToManySession["programmeArea"],
    startAt: row.start_at,
    endAt: row.end_at,
    format: row.event_format as OneToManySession["format"],
    capacity: row.capacity,
    registeredCount,
    recordingUrl: row.recording_url ?? undefined,
  };
}

export function mapConversationRow(
  row: { id: string; last_message_at: string; last_message_preview: string },
  participantIds: string[],
  unreadCount: number,
): Conversation {
  return {
    id: row.id,
    participantIds,
    lastMessageAt: row.last_message_at,
    lastMessage: row.last_message_preview,
    unreadCount,
  };
}

export function mapMessageRow(row: {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  sent_at: string;
  read_at: string | null;
}): ChatMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    body: row.body,
    sentAt: row.sent_at,
    readAt: row.read_at,
  };
}

export function mapNotificationRow(row: {
  id: string;
  user_id: string;
  kind: string;
  title: string;
  body: string;
  href: string;
  created_at: string;
  read_at: string | null;
}): NotificationItem {
  return {
    id: row.id,
    userId: row.user_id,
    kind: row.kind as NotificationItem["kind"],
    title: row.title,
    body: row.body,
    href: row.href,
    createdAt: row.created_at,
    readAt: row.read_at,
  };
}

export function mapSpaceRow(row: {
  id: string;
  slug: string;
  name: string;
  description: string;
  programme_area: string | null;
  member_count: number;
}): DiscussionSpace {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    memberCount: row.member_count,
    programmeArea: (row.programme_area ??
      undefined) as DiscussionSpace["programmeArea"],
  };
}

export function mapThreadRow(
  row: {
    id: string;
    space_id: string;
    title: string;
    author_id: string;
    pinned: boolean;
    created_at: string;
    updated_at: string;
    last_activity_at: string;
  },
  spaceSlug: string,
  messageCount: number,
): DiscussionThread {
  return {
    id: row.id,
    spaceId: row.space_id,
    spaceSlug,
    title: row.title,
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastActivityAt: row.last_activity_at,
    messageCount,
    pinned: row.pinned,
  };
}

export function mapReplyRow(row: {
  id: string;
  thread_id: string;
  author_id: string;
  body: string;
  sent_at: string;
}): ThreadReply {
  return {
    id: row.id,
    threadId: row.thread_id,
    authorId: row.author_id,
    body: row.body,
    sentAt: row.sent_at,
  };
}

export function mapMentorshipRequestRow(row: {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: string;
  motivation: string;
  goals: string;
  preferred_cadence: string;
  created_at: string;
}): MentorshipRequest {
  return {
    id: row.id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    status: row.status as MentorshipRequest["status"],
    motivation: row.motivation,
    goals: row.goals,
    preferredCadence: row.preferred_cadence as MentorshipRequest["preferredCadence"],
    createdAt: row.created_at,
  };
}

export function mapModerationRow(row: {
  id: string;
  kind: string;
  reported_by_label: string;
  reason: string;
  body: string;
  space_name: string;
  created_at: string;
}): ModerationReport {
  return {
    id: row.id,
    kind: row.kind as ModerationReport["kind"],
    reportedBy: row.reported_by_label,
    reason: row.reason,
    body: row.body,
    spaceName: row.space_name,
    reportedAt: row.created_at,
  };
}
