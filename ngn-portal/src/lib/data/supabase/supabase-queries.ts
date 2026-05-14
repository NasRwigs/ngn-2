import type { SupabaseClient } from "@supabase/supabase-js";

import type { Queries } from "@/lib/data/queries";
import type { AdminStat, NgnEvent } from "@/lib/data/types";

import {
  mapCircleRow,
  mapConversationRow,
  mapEventRow,
  mapGroupSessionRow,
  mapMessageRow,
  mapMentorshipRequestRow,
  mapModerationRow,
  mapNotificationRow,
  mapPairRow,
  mapProfileToMember,
  mapReplyRow,
  mapSessionLogRow,
  mapSpaceRow,
  mapThreadRow,
  type ProfileRow,
} from "./mappers";

async function loadSpeakerDisplayNames(
  supabase: SupabaseClient,
  speakerRows: Array<{ profile_id: string }>,
): Promise<Map<string, string>> {
  const ids = [...new Set(speakerRows.map((s) => s.profile_id))];
  if (!ids.length) return new Map();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", ids);
  return new Map(
    (data ?? []).map((p: { id: string; display_name: string }) => [
      p.id,
      p.display_name,
    ]),
  );
}

export function buildSupabaseQueries(
  supabase: SupabaseClient,
): Queries {
  return {
    members: {
      async me(currentUserId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUserId)
          .single();
        if (error || !data) throw new Error(error?.message ?? "Profile not found");
        return mapProfileToMember(data as ProfileRow);
      },
      async list(filter) {
        let q = supabase.from("profiles").select("*");
        if (filter?.query) {
          const escaped = filter.query.replace(/%/g, "\\%").replace(/,/g, "\\,");
          q = q.or(
            `display_name.ilike.%${escaped}%,organisation.ilike.%${escaped}%,title.ilike.%${escaped}%`,
          );
        }
        if (filter?.country) q = q.eq("country", filter.country);
        if (filter?.sector) q = q.contains("sectors", [filter.sector]);
        if (filter?.mentorshipStatus) {
          q = q.eq("mentorship_status", filter.mentorshipStatus);
        }
        const { data, error } = await q.order("display_name");
        if (error) throw new Error(error.message);
        let list = (data as ProfileRow[]).map((r) => mapProfileToMember(r));
        if (filter?.expertise) {
          const ex = filter.expertise.toLowerCase();
          list = list.filter((m) =>
            m.expertise.some((tag) => tag.toLowerCase().includes(ex)),
          );
        }
        return list;
      },
      async byId(id) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        return data ? mapProfileToMember(data as ProfileRow) : null;
      },
      async bySlug(slug) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        return data ? mapProfileToMember(data as ProfileRow) : null;
      },
      async suggestedMentors(currentUserId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", currentUserId)
          .in("mentorship_status", ["accepting_mentees", "both"])
          .limit(8);
        if (error) throw new Error(error.message);
        return (data as ProfileRow[]).slice(0, 4).map((r) => mapProfileToMember(r));
      },
    },
    pairs: {
      async forUser(userId) {
        const { data, error } = await supabase
          .from("pairs")
          .select(
            `
            *,
            pair_goals (*)
          `,
          )
          .or(`mentor_id.eq.${userId},mentee_id.eq.${userId}`);
        if (error) throw new Error(error.message);
        return (data ?? []).map((row: Record<string, unknown>) =>
          mapPairRow(row as Parameters<typeof mapPairRow>[0]),
        );
      },
      async byId(id) {
        const { data, error } = await supabase
          .from("pairs")
          .select(
            `
            *,
            pair_goals (*)
          `,
          )
          .eq("id", id)
          .maybeSingle();
        if (error) throw new Error(error.message);
        if (!data) return null;
        return mapPairRow(data as Parameters<typeof mapPairRow>[0]);
      },
      async sessions(pairId) {
        const { data, error } = await supabase
          .from("pair_session_logs")
          .select("*")
          .eq("pair_id", pairId)
          .order("session_date", { ascending: false });
        if (error) throw new Error(error.message);
        return (data ?? []).map((r) =>
          mapSessionLogRow(r as Parameters<typeof mapSessionLogRow>[0]),
        );
      },
    },
    mentorship: {
      async requestsForUser(userId) {
        const { data, error } = await supabase
          .from("mentorship_requests")
          .select("*")
          .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return (data ?? []).map((r) =>
          mapMentorshipRequestRow(r as Parameters<typeof mapMentorshipRequestRow>[0]),
        );
      },
    },
    events: {
      async list(opts) {
        let q = supabase.from("events").select("*").order("start_at");
        if (opts?.upcomingOnly) {
          q = q.gte("start_at", new Date().toISOString());
        }
        if (opts?.area) {
          q = q.eq("programme_area", opts.area);
        }
        const { data: events, error } = await q;
        if (error) throw new Error(error.message);
        if (!events?.length) return [];

        const ids = events.map((e: { id: string }) => e.id);
        const { data: regs } = await supabase
          .from("event_registrations")
          .select("event_id, profile_id")
          .in("event_id", ids);
        const { data: spk } = await supabase
          .from("event_speakers")
          .select("event_id, speaker_role, profile_id")
          .in("event_id", ids);

        const nameById = await loadSpeakerDisplayNames(
          supabase,
          (spk ?? []) as Array<{ profile_id: string }>,
        );

        const regCount = new Map<string, number>();
        (regs ?? []).forEach((r: { event_id: string }) => {
          regCount.set(r.event_id, (regCount.get(r.event_id) ?? 0) + 1);
        });

        const { data: authData } = await supabase.auth.getUser();
        const uid = authData.user?.id;

        return events.map((row: Record<string, unknown>) => {
          const eid = row.id as string;
          const speakersRaw =
            (spk ?? []).filter((s: { event_id: string }) => s.event_id === eid) ??
            [];
          const speakers: NgnEvent["speakers"] = speakersRaw.map(
            (s: {
              profile_id: string;
              speaker_role: string;
            }) => ({
              id: s.profile_id,
              name: nameById.get(s.profile_id) ?? "Speaker",
              role: s.speaker_role,
              avatarUrl: null,
            }),
          );
          const registered =
            uid != null &&
            (regs ?? []).some(
              (r: { event_id: string; profile_id: string }) =>
                r.event_id === eid && r.profile_id === uid,
            );
          return mapEventRow(
            row as Parameters<typeof mapEventRow>[0],
            {
              registeredCount: regCount.get(eid) ?? 0,
              registered,
              speakers,
            },
          );
        });
      },
      async bySlug(slug) {
        const { data: row, error } = await supabase
          .from("events")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error) throw new Error(error.message);
        if (!row) return null;
        const eid = row.id as string;
        const { count } = await supabase
          .from("event_registrations")
          .select("*", { count: "exact", head: true })
          .eq("event_id", eid);
        const { data: spk } = await supabase
          .from("event_speakers")
          .select("event_id, speaker_role, profile_id")
          .eq("event_id", eid);
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData.user?.id;
        let myReg: { event_id: string } | null = null;
        if (uid) {
          const { data } = await supabase
            .from("event_registrations")
            .select("event_id")
            .eq("event_id", eid)
            .eq("profile_id", uid)
            .maybeSingle();
          myReg = data;
        }
        const nameById = await loadSpeakerDisplayNames(
          supabase,
          (spk ?? []) as Array<{ profile_id: string }>,
        );
        const speakers: NgnEvent["speakers"] = (spk ?? []).map(
          (s: {
            profile_id: string;
            speaker_role: string;
          }) => ({
            id: s.profile_id,
            name: nameById.get(s.profile_id) ?? "Speaker",
            role: s.speaker_role,
            avatarUrl: null,
          }),
        );
        return mapEventRow(row as Parameters<typeof mapEventRow>[0], {
          registeredCount: count ?? 0,
          registered: Boolean(myReg && uid),
          speakers,
        });
      },
    },
    circles: {
      async list() {
        const { data: circles, error } = await supabase
          .from("circles")
          .select("*")
          .order("name");
        if (error) throw new Error(error.message);
        if (!circles?.length) return [];
        const ids = circles.map((c: { id: string }) => c.id);
        const { data: members } = await supabase
          .from("circle_members")
          .select("circle_id, profile_id")
          .in("circle_id", ids);
        const byCircle = new Map<string, string[]>();
        (members ?? []).forEach((m: { circle_id: string; profile_id: string }) => {
          const arr = byCircle.get(m.circle_id) ?? [];
          arr.push(m.profile_id);
          byCircle.set(m.circle_id, arr);
        });
        return circles.map((row: Record<string, unknown>) =>
          mapCircleRow(row as Parameters<typeof mapCircleRow>[0], byCircle.get(row.id as string) ?? []),
        );
      },
      async bySlug(slug) {
        const { data: row } = await supabase
          .from("circles")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (!row) return null;
        const { data: members } = await supabase
          .from("circle_members")
          .select("profile_id")
          .eq("circle_id", row.id);
        const memberIds = (members ?? []).map(
          (m: { profile_id: string }) => m.profile_id,
        );
        return mapCircleRow(row as Parameters<typeof mapCircleRow>[0], memberIds);
      },
    },
    sessions: {
      async list() {
        const { data: sessions, error } = await supabase
          .from("group_sessions")
          .select("*")
          .order("start_at");
        if (error) throw new Error(error.message);
        if (!sessions?.length) return [];
        const ids = sessions.map((s: { id: string }) => s.id);
        const { data: regs } = await supabase
          .from("group_session_registrations")
          .select("session_id")
          .in("session_id", ids);
        const counts = new Map<string, number>();
        (regs ?? []).forEach((r: { session_id: string }) => {
          counts.set(r.session_id, (counts.get(r.session_id) ?? 0) + 1);
        });
        return sessions.map((row: Record<string, unknown>) =>
          mapGroupSessionRow(
            row as Parameters<typeof mapGroupSessionRow>[0],
            counts.get(row.id as string) ?? 0,
          ),
        );
      },
      async byId(id) {
        const { data: row } = await supabase
          .from("group_sessions")
          .select("*")
          .eq("id", id)
          .maybeSingle();
        if (!row) return null;
        const { count } = await supabase
          .from("group_session_registrations")
          .select("*", { count: "exact", head: true })
          .eq("session_id", id);
        return mapGroupSessionRow(
          row as Parameters<typeof mapGroupSessionRow>[0],
          count ?? 0,
        );
      },
    },
    messages: {
      async conversations(userId) {
        const { data: parts, error } = await supabase
          .from("conversation_participants")
          .select("conversation_id, unread_count")
          .eq("profile_id", userId);
        if (error) throw new Error(error.message);
        if (!parts?.length) return [];
        const cids = parts.map((p: { conversation_id: string }) => p.conversation_id);
        const { data: convs } = await supabase
          .from("conversations")
          .select("*")
          .in("id", cids);
        const { data: allParts } = await supabase
          .from("conversation_participants")
          .select("conversation_id, profile_id")
          .in("conversation_id", cids);
        const unreadByC = new Map(
          parts.map((p: { conversation_id: string; unread_count: number }) => [
            p.conversation_id,
            p.unread_count,
          ]),
        );
        const participantsByC = new Map<string, string[]>();
        (allParts ?? []).forEach(
          (p: { conversation_id: string; profile_id: string }) => {
            const arr = participantsByC.get(p.conversation_id) ?? [];
            arr.push(p.profile_id);
            participantsByC.set(p.conversation_id, arr);
          },
        );
        return (convs ?? [])
          .map((c: Record<string, unknown>) =>
            mapConversationRow(
              c as Parameters<typeof mapConversationRow>[0],
              participantsByC.get(c.id as string) ?? [],
              unreadByC.get(c.id as string) ?? 0,
            ),
          )
          .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
      },
      async conversation(id) {
        const { data: authData } = await supabase.auth.getUser();
        const uid = authData.user?.id;
        if (!uid) return null;
        const { data: part } = await supabase
          .from("conversation_participants")
          .select("conversation_id, unread_count")
          .eq("conversation_id", id)
          .eq("profile_id", uid)
          .maybeSingle();
        if (!part) return null;
        const { data: c } = await supabase
          .from("conversations")
          .select("*")
          .eq("id", id)
          .single();
        const { data: allParts } = await supabase
          .from("conversation_participants")
          .select("profile_id")
          .eq("conversation_id", id);
        return mapConversationRow(
          c as Parameters<typeof mapConversationRow>[0],
          (allParts ?? []).map((p: { profile_id: string }) => p.profile_id),
          part.unread_count ?? 0,
        );
      },
      async messages(conversationId) {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conversationId)
          .order("sent_at");
        if (error) throw new Error(error.message);
        return (data ?? []).map((r) =>
          mapMessageRow(r as Parameters<typeof mapMessageRow>[0]),
        );
      },
      async unreadCount(userId) {
        const { data, error } = await supabase
          .from("conversation_participants")
          .select("unread_count")
          .eq("profile_id", userId);
        if (error) throw new Error(error.message);
        return (data ?? []).reduce(
          (acc: number, row: { unread_count: number }) => acc + (row.unread_count ?? 0),
          0,
        );
      },
    },
    notifications: {
      async list(userId) {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return (data ?? []).map((r) =>
          mapNotificationRow(r as Parameters<typeof mapNotificationRow>[0]),
        );
      },
      async unreadCount(userId) {
        const { count, error } = await supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId)
          .is("read_at", null);
        if (error) throw new Error(error.message);
        return count ?? 0;
      },
    },
    spaces: {
      async list() {
        const { data, error } = await supabase
          .from("discussion_spaces")
          .select("*")
          .order("name");
        if (error) throw new Error(error.message);
        return (data ?? []).map((r) =>
          mapSpaceRow(r as Parameters<typeof mapSpaceRow>[0]),
        );
      },
      async bySlug(slug) {
        const { data } = await supabase
          .from("discussion_spaces")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        return data ? mapSpaceRow(data as Parameters<typeof mapSpaceRow>[0]) : null;
      },
      async threads(spaceSlug) {
        const { data: space } = await supabase
          .from("discussion_spaces")
          .select("id, slug")
          .eq("slug", spaceSlug)
          .maybeSingle();
        if (!space) return [];
        const { data: threads, error } = await supabase
          .from("discussion_threads")
          .select("*")
          .eq("space_id", space.id)
          .order("last_activity_at", { ascending: false });
        if (error) throw new Error(error.message);
        const tids = (threads ?? []).map((t: { id: string }) => t.id);
        const counts = new Map<string, number>();
        if (tids.length) {
          const { data: replies } = await supabase
            .from("thread_replies")
            .select("thread_id")
            .in("thread_id", tids);
          (replies ?? []).forEach((r: { thread_id: string }) => {
            counts.set(r.thread_id, (counts.get(r.thread_id) ?? 0) + 1);
          });
        }
        return (threads ?? []).map((t: Record<string, unknown>) =>
          mapThreadRow(
            t as Parameters<typeof mapThreadRow>[0],
            space.slug,
            counts.get(t.id as string) ?? 0,
          ),
        );
      },
      async thread(spaceSlug, threadId) {
        const { data: space } = await supabase
          .from("discussion_spaces")
          .select("id, slug")
          .eq("slug", spaceSlug)
          .maybeSingle();
        if (!space) return null;
        const { data: t } = await supabase
          .from("discussion_threads")
          .select("*")
          .eq("id", threadId)
          .eq("space_id", space.id)
          .maybeSingle();
        if (!t) return null;
        const { count } = await supabase
          .from("thread_replies")
          .select("*", { count: "exact", head: true })
          .eq("thread_id", threadId);
        return mapThreadRow(
          t as Parameters<typeof mapThreadRow>[0],
          space.slug,
          count ?? 0,
        );
      },
      async threadReplies(spaceSlug, threadId) {
        const { data: space } = await supabase
          .from("discussion_spaces")
          .select("id")
          .eq("slug", spaceSlug)
          .maybeSingle();
        if (!space) return [];
        const { data: t } = await supabase
          .from("discussion_threads")
          .select("id")
          .eq("id", threadId)
          .eq("space_id", space.id)
          .maybeSingle();
        if (!t) return [];
        const { data, error } = await supabase
          .from("thread_replies")
          .select("*")
          .eq("thread_id", threadId)
          .order("sent_at");
        if (error) throw new Error(error.message);
        return (data ?? []).map((r) =>
          mapReplyRow(r as Parameters<typeof mapReplyRow>[0]),
        );
      },
    },
    admin: {
      async overviewStats(): Promise<AdminStat[]> {
        const [{ count: members }, { count: pairs }, { count: pending }] =
          await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase
              .from("pairs")
              .select("*", { count: "exact", head: true })
              .eq("status", "Active"),
            supabase
              .from("mentorship_requests")
              .select("*", { count: "exact", head: true })
              .eq("status", "pending"),
          ]);
        return [
          { label: "Total Members", value: members ?? 0, tone: "info" },
          { label: "Active Pairs", value: pairs ?? 0, tone: "success" },
          { label: "Pending Requests", value: pending ?? 0, tone: "warning" },
          { label: "Avg Programme Duration", value: "—", tone: "info" },
        ];
      },
      async membersAdmin() {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("display_name");
        if (error) throw new Error(error.message);
        return (data as ProfileRow[]).map((r) => mapProfileToMember(r));
      },
      async pairsRequiringAttention() {
        const { data, error } = await supabase
          .from("pairs")
          .select(
            `
            *,
            pair_goals (*)
          `,
          )
          .in("status", ["Pending", "At Risk"]);
        if (error) throw new Error(error.message);
        return (data ?? []).map((row: Record<string, unknown>) =>
          mapPairRow(row as Parameters<typeof mapPairRow>[0]),
        );
      },
      async unmatchedMentees() {
        const { data: pairs, error: pe } = await supabase
          .from("pairs")
          .select("mentee_id");
        if (pe) throw new Error(pe.message);
        const menteeIds = new Set(
          (pairs ?? []).map((p: { mentee_id: string }) => p.mentee_id),
        );
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .in("mentorship_status", ["looking_for_mentor", "both"]);
        if (error) throw new Error(error.message);
        return (data as ProfileRow[])
          .filter((r) => !menteeIds.has(r.id))
          .map((r) => mapProfileToMember(r));
      },
      async moderationQueue() {
        const { data, error } = await supabase
          .from("moderation_reports")
          .select("*")
          .eq("status", "open")
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        return (data ?? []).map((r) =>
          mapModerationRow(r as Parameters<typeof mapModerationRow>[0]),
        );
      },
    },
  };
}
