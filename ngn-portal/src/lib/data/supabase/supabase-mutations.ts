import type { SupabaseClient } from "@supabase/supabase-js";

import type { Mutations } from "@/lib/data/mutations";

import { mapProfileToMember, type ProfileRow } from "./mappers";
import { slugify } from "./slug";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export function buildSupabaseMutations(supabase: SupabaseClient): Mutations {
  return {
    members: {
      async updateProfile(userId, input) {
        const patch = {
          display_name: input.name,
          title: input.title,
          organisation: input.organisation,
          country: input.country,
          sectors: input.sectors,
          expertise: input.expertise,
          bio: input.bio,
          languages: input.languages,
          timezone: input.timezone,
          linkedin_url: input.linkedinUrl ?? null,
          website_url: input.websiteUrl ?? null,
          mentorship_status: input.mentorshipStatus,
        };
        const { data, error } = await supabase
          .from("profiles")
          .update(patch)
          .eq("id", userId)
          .select("*")
          .single();
        if (error || !data) throw new Error(error?.message ?? "Update failed");
        return mapProfileToMember(data as ProfileRow);
      },
    },
    auth: {
      async signUp(input) {
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: { full_name: input.name },
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
          },
        });
        if (error) throw new Error(error.message);
        const userId = data.user?.id;
        if (!userId) {
          throw new Error(
            "Sign up did not return a user id (email confirmation may be required).",
          );
        }
        if (data.session) {
          const { error: pe } = await supabase
            .from("profiles")
            .update({
              display_name: input.name,
              title: input.title,
              organisation: input.organisation,
              country: input.country,
              nationality: input.nationality,
              sectors: input.sectors,
              expertise: input.expertise,
              bio: input.bio,
              languages: input.languages,
              timezone: input.timezone,
              linkedin_url: input.linkedinUrl ?? null,
              website_url: input.websiteUrl ?? null,
              mentorship_status: input.mentorshipStatus,
              skills_offered: input.skillsOffered ?? [],
              skills_wanted: input.skillsWanted ?? [],
              availability:
                input.mentorshipStatus === "not_now"
                  ? null
                  : (input.cadence ?? "biweekly"),
            })
            .eq("id", userId);
          if (pe) throw new Error(pe.message);
        }
        return { userId };
      },
      async sendMagicLink(email) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
          },
        });
        if (error) throw new Error(error.message);
        return { ok: true as const };
      },
      async requestPasswordReset(email) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/reset-password/confirm`,
        });
        if (error) throw new Error(error.message);
        return { ok: true as const };
      },
    },
    mentorship: {
      async sendRequest(fromUserId, input) {
        const { data, error } = await supabase
          .from("mentorship_requests")
          .insert({
            from_user_id: fromUserId,
            to_user_id: input.toUserId,
            motivation: input.motivation,
            goals: input.goals,
            preferred_cadence: input.preferredCadence,
            status: "pending",
          })
          .select("id")
          .single();
        if (error || !data) throw new Error(error?.message ?? "Request failed");
        return { requestId: data.id as string };
      },
      async submitIntake(pairId, input) {
        const { error: uerr } = await supabase
          .from("pairs")
          .update({
            working_agreement: input.workingAgreement,
            cadence: input.cadence,
          })
          .eq("id", pairId);
        if (uerr) throw new Error(uerr.message);
        const goals = input.goals.map((g, i) => ({
          pair_id: pairId,
          title: g.title,
          success_criteria: g.successCriteria,
          status: "not_started" as const,
          sort_order: i,
        }));
        const { error: gerr } = await supabase.from("pair_goals").insert(goals);
        if (gerr) throw new Error(gerr.message);
        return { ok: true as const };
      },
      async logSession(pairId, input) {
        const { data, error } = await supabase
          .from("pair_session_logs")
          .insert({
            pair_id: pairId,
            session_date: input.date.slice(0, 10),
            duration_minutes: input.durationMinutes,
            format: input.format,
            notes: input.notes,
            goals_discussed: input.goalsDiscussed,
            wellbeing: input.wellbeing,
          })
          .select("id")
          .single();
        if (error || !data) throw new Error(error?.message ?? "Log failed");
        return { sessionId: data.id as string };
      },
    },
    events: {
      async register(eventId, userId) {
        const { error } = await supabase.from("event_registrations").insert({
          event_id: eventId,
          profile_id: userId,
        });
        if (error) throw new Error(error.message);
        return { ok: true as const };
      },
      async unregister(eventId, userId) {
        const { error } = await supabase
          .from("event_registrations")
          .delete()
          .eq("event_id", eventId)
          .eq("profile_id", userId);
        if (error) throw new Error(error.message);
        return { ok: true as const };
      },
      async create(input) {
        const base = slugify(input.title);
        const slug = `${base}-${randomSuffix()}`;
        const { data: ev, error } = await supabase
          .from("events")
          .insert({
            slug,
            title: input.title,
            description: input.description,
            programme_area: input.programmeArea,
            event_type: input.type,
            event_format: input.format,
            start_at: input.startAt,
            end_at: input.endAt,
            location: input.location ?? null,
            video_url: input.videoUrl ?? null,
            registration_required: input.registrationRequired,
            capacity: input.capacity ?? null,
          })
          .select("id")
          .single();
        if (error || !ev) throw new Error(error?.message ?? "Create failed");
        const eventId = ev.id as string;
        if (input.speakerIds.length) {
          const rows = input.speakerIds.map((id) => ({
            event_id: eventId,
            profile_id: id,
            speaker_role: "Speaker",
          }));
          const { error: se } = await supabase.from("event_speakers").insert(rows);
          if (se) throw new Error(se.message);
        }
        return { eventId };
      },
    },
    circles: {
      async create(input) {
        const base = slugify(input.name);
        const slug = `${base}-${randomSuffix()}`;
        const { data, error } = await supabase
          .from("circles")
          .insert({
            slug,
            name: input.name,
            topic: input.topic,
            cadence: input.cadence,
            capacity: input.capacity,
            description: input.description,
            facilitator_ids: input.facilitatorIds,
          })
          .select("id")
          .single();
        if (error || !data) throw new Error(error?.message ?? "Create failed");
        return { circleId: data.id as string };
      },
      async join(circleId, userId) {
        const { error } = await supabase.from("circle_members").insert({
          circle_id: circleId,
          profile_id: userId,
        });
        if (error) throw new Error(error.message);
        return { ok: true as const };
      },
    },
    messages: {
      async send(conversationId, senderId, body) {
        const now = new Date().toISOString();
        const { data: msg, error } = await supabase
          .from("messages")
          .insert({
            conversation_id: conversationId,
            sender_id: senderId,
            body,
            sent_at: now,
          })
          .select("id")
          .single();
        if (error || !msg) throw new Error(error?.message ?? "Send failed");
        await supabase
          .from("conversations")
          .update({
            last_message_at: now,
            last_message_preview: body.slice(0, 280),
          })
          .eq("id", conversationId);
        const { data: parts } = await supabase
          .from("conversation_participants")
          .select("profile_id, unread_count")
          .eq("conversation_id", conversationId);
        for (const p of parts ?? []) {
          if ((p as { profile_id: string }).profile_id === senderId) continue;
          const cur = (p as { unread_count: number }).unread_count ?? 0;
          await supabase
            .from("conversation_participants")
            .update({ unread_count: cur + 1 })
            .eq("conversation_id", conversationId)
            .eq("profile_id", (p as { profile_id: string }).profile_id);
        }
        return { messageId: msg.id as string };
      },
      async markRead(conversationId, userId) {
        await supabase
          .from("conversation_participants")
          .update({ unread_count: 0 })
          .eq("conversation_id", conversationId)
          .eq("profile_id", userId);
        const { data: others } = await supabase
          .from("messages")
          .select("id")
          .eq("conversation_id", conversationId)
          .neq("sender_id", userId)
          .is("read_at", null);
        const ids = (others ?? []).map((m: { id: string }) => m.id);
        if (ids.length) {
          await supabase
            .from("messages")
            .update({ read_at: new Date().toISOString() })
            .in("id", ids);
        }
        return { ok: true as const };
      },
    },
    spaces: {
      async createThread(spaceSlug, authorId, input) {
        const { data: space, error: se } = await supabase
          .from("discussion_spaces")
          .select("id")
          .eq("slug", spaceSlug)
          .single();
        if (se || !space) throw new Error(se?.message ?? "Space not found");
        const now = new Date().toISOString();
        const { data: thread, error: te } = await supabase
          .from("discussion_threads")
          .insert({
            space_id: space.id,
            title: input.title,
            author_id: authorId,
            created_at: now,
            updated_at: now,
            last_activity_at: now,
          })
          .select("id")
          .single();
        if (te || !thread) throw new Error(te?.message ?? "Thread failed");
        const tid = thread.id as string;
        const { error: re } = await supabase.from("thread_replies").insert({
          thread_id: tid,
          author_id: authorId,
          body: input.body,
          sent_at: now,
        });
        if (re) throw new Error(re.message);
        return { threadId: tid };
      },
      async replyToThread(spaceSlug, threadId, authorId, body) {
        const { data: space } = await supabase
          .from("discussion_spaces")
          .select("id")
          .eq("slug", spaceSlug)
          .maybeSingle();
        if (!space) throw new Error("Space not found");
        const { data: thread } = await supabase
          .from("discussion_threads")
          .select("id")
          .eq("id", threadId)
          .eq("space_id", space.id)
          .maybeSingle();
        if (!thread) throw new Error("Thread not found");
        const now = new Date().toISOString();
        const { data: rep, error } = await supabase
          .from("thread_replies")
          .insert({
            thread_id: threadId,
            author_id: authorId,
            body,
            sent_at: now,
          })
          .select("id")
          .single();
        if (error || !rep) throw new Error(error?.message ?? "Reply failed");
        await supabase
          .from("discussion_threads")
          .update({ updated_at: now, last_activity_at: now })
          .eq("id", threadId);
        return { replyId: rep.id as string };
      },
      async createSpace(input) {
        const slug = `${slugify(input.name)}-${randomSuffix()}`;
        const { data, error } = await supabase
          .from("discussion_spaces")
          .insert({
            slug,
            name: input.name,
            description: input.description,
            programme_area: input.programmeArea ?? null,
            member_count: 0,
          })
          .select("id")
          .single();
        if (error || !data) {
          throw new Error(error?.message ?? "Create space failed");
        }
        return { spaceId: data.id as string, slug };
      },
    },
    admin: {
      async moderationResolve(reportId, action) {
        if (action === "remove") {
          const { error } = await supabase
            .from("moderation_reports")
            .delete()
            .eq("id", reportId);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await supabase
            .from("moderation_reports")
            .update({ status: "resolved" })
            .eq("id", reportId);
          if (error) throw new Error(error.message);
        }
        return { ok: true as const };
      },
    },
    groupSessions: {
      async create(hostId, input) {
        const { data, error } = await supabase
          .from("group_sessions")
          .insert({
            title: input.title,
            description: input.description,
            host_id: hostId,
            programme_area: input.programmeArea,
            start_at: input.startAt,
            end_at: input.endAt,
            event_format: input.format,
            capacity: input.capacity,
          })
          .select("id")
          .single();
        if (error || !data) {
          throw new Error(error?.message ?? "Create session failed");
        }
        return { sessionId: data.id as string };
      },
    },
  };
}
