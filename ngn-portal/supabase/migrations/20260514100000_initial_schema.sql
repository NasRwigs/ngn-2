-- NGN Portal — initial schema (profiles, domain tables, RLS, storage buckets)
-- Apply via Supabase CLI: `supabase db push` or Dashboard SQL editor.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.user_role as enum (
  'exco',
  'programme_admin',
  'foundation_staff',
  'member',
  'ecosystem_participant'
);

create type public.request_status as enum (
  'pending',
  'accepted',
  'declined',
  'cancelled'
);

create type public.session_format as enum ('video', 'phone', 'in_person');

create type public.session_wellbeing as enum ('great', 'good', 'fair', 'poor');

create type public.cadence as enum ('weekly', 'biweekly', 'monthly');

create type public.notification_kind as enum ('mentorship', 'event', 'message', 'system');

create type public.moderation_kind as enum ('post', 'comment');

-- ---------------------------------------------------------------------------
-- Helpers (SECURITY DEFINER for stable RLS checks)
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 auth.users)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  slug text not null unique,
  display_name text not null,
  email text not null,
  role public.user_role not null default 'member',
  avatar_url text,
  title text not null default '',
  organisation text not null default '',
  country text not null default '',
  nationality text not null default '',
  sectors text[] not null default '{}',
  expertise text[] not null default '{}',
  bio text not null default '',
  languages text[] not null default '{}',
  timezone text not null default 'UTC',
  linkedin_url text,
  website_url text,
  mentorship_status text not null
    default 'not_now'
    check (
      mentorship_status in (
        'accepting_mentees',
        'looking_for_mentor',
        'both',
        'not_now'
      )
    ),
  availability public.cadence,
  skills_offered text[] not null default '{}',
  skills_wanted text[] not null default '{}',
  joined_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_country_idx on public.profiles (country);
create index profiles_mentorship_status_idx on public.profiles (mentorship_status);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  final_slug text;
  n int := 0;
begin
  base_slug := lower(
    regexp_replace(
      coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      '[^a-z0-9]+',
      '-',
      'gi'
    )
  );
  if base_slug = '' or base_slug is null then
    base_slug := 'member';
  end if;
  final_slug := base_slug;
  while exists (select 1 from public.profiles where slug = final_slug) loop
    n := n + 1;
    final_slug := base_slug || '-' || n::text;
  end loop;

  insert into public.profiles (id, slug, display_name, email, role)
  values (
    new.id,
    final_slug,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'member'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- RLS helpers (after profiles — bodies reference public.profiles)
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('exco', 'programme_admin', 'foundation_staff')
  );
$$;

create or replace function public.can_manage_spaces()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('exco', 'programme_admin')
  );
$$;

create or replace function public.can_create_events()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role in ('exco', 'programme_admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- Mentorship
-- ---------------------------------------------------------------------------

create table public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.profiles (id) on delete cascade,
  to_user_id uuid not null references public.profiles (id) on delete cascade,
  status public.request_status not null default 'pending',
  motivation text not null default '',
  goals text not null default '',
  preferred_cadence public.cadence not null default 'biweekly',
  created_at timestamptz not null default now(),
  constraint mentorship_requests_distinct check (from_user_id <> to_user_id)
);

create index mentorship_requests_from_idx on public.mentorship_requests (from_user_id);
create index mentorship_requests_to_idx on public.mentorship_requests (to_user_id);

alter table public.mentorship_requests enable row level security;

create policy "mentorship_requests_select_parties"
on public.mentorship_requests for select
to authenticated
using (from_user_id = auth.uid() or to_user_id = auth.uid() or public.is_staff());

create policy "mentorship_requests_insert_own"
on public.mentorship_requests for insert
to authenticated
with check (from_user_id = auth.uid());

create table public.pairs (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.profiles (id) on delete restrict,
  mentee_id uuid not null references public.profiles (id) on delete restrict,
  status text not null default 'Pending'
    check (status in ('Active', 'Pending', 'At Risk', 'Completed')),
  started_at timestamptz not null default now(),
  programme_months int not null default 6,
  months_completed int not null default 0,
  cohort text not null default '',
  next_meeting_at timestamptz,
  cadence public.cadence not null default 'biweekly',
  working_agreement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint pairs_distinct check (mentor_id <> mentee_id)
);

create index pairs_mentor_idx on public.pairs (mentor_id);
create index pairs_mentee_idx on public.pairs (mentee_id);

create trigger pairs_set_updated_at
before update on public.pairs
for each row execute function public.set_updated_at();

alter table public.pairs enable row level security;

create policy "pairs_select_participants_or_staff"
on public.pairs for select
to authenticated
using (
  mentor_id = auth.uid()
  or mentee_id = auth.uid()
  or public.is_staff()
);

create policy "pairs_insert_staff"
on public.pairs for insert
to authenticated
with check (public.is_staff());

create policy "pairs_update_participants_or_staff"
on public.pairs for update
to authenticated
using (
  mentor_id = auth.uid()
  or mentee_id = auth.uid()
  or public.is_staff()
)
with check (
  mentor_id = auth.uid()
  or mentee_id = auth.uid()
  or public.is_staff()
);

create table public.pair_goals (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null references public.pairs (id) on delete cascade,
  title text not null,
  success_criteria text not null default '',
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'completed')),
  notes text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index pair_goals_pair_idx on public.pair_goals (pair_id);

alter table public.pair_goals enable row level security;

create policy "pair_goals_select_via_pair"
on public.pair_goals for select
to authenticated
using (
  exists (
    select 1 from public.pairs p
    where p.id = pair_goals.pair_id
      and (
        p.mentor_id = auth.uid()
        or p.mentee_id = auth.uid()
        or public.is_staff()
      )
  )
);

create policy "pair_goals_insert_via_pair"
on public.pair_goals for insert
to authenticated
with check (
  exists (
    select 1 from public.pairs p
    where p.id = pair_goals.pair_id
      and (
        p.mentor_id = auth.uid()
        or p.mentee_id = auth.uid()
        or public.is_staff()
      )
  )
);

create policy "pair_goals_update_via_pair"
on public.pair_goals for update
to authenticated
using (
  exists (
    select 1 from public.pairs p
    where p.id = pair_goals.pair_id
      and (
        p.mentor_id = auth.uid()
        or p.mentee_id = auth.uid()
        or public.is_staff()
      )
  )
)
with check (
  exists (
    select 1 from public.pairs p
    where p.id = pair_goals.pair_id
      and (
        p.mentor_id = auth.uid()
        or p.mentee_id = auth.uid()
        or public.is_staff()
      )
  )
);

create policy "pair_goals_delete_via_pair"
on public.pair_goals for delete
to authenticated
using (
  exists (
    select 1 from public.pairs p
    where p.id = pair_goals.pair_id
      and (
        p.mentor_id = auth.uid()
        or p.mentee_id = auth.uid()
        or public.is_staff()
      )
  )
);

create table public.pair_session_logs (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid not null references public.pairs (id) on delete cascade,
  session_date date not null,
  duration_minutes int not null default 60,
  format public.session_format not null default 'video',
  notes text not null default '',
  goals_discussed text[] not null default '{}',
  wellbeing public.session_wellbeing not null default 'good',
  created_at timestamptz not null default now()
);

create index pair_session_logs_pair_idx on public.pair_session_logs (pair_id);

alter table public.pair_session_logs enable row level security;

create policy "pair_session_logs_select_via_pair"
on public.pair_session_logs for select
to authenticated
using (
  exists (
    select 1 from public.pairs p
    where p.id = pair_session_logs.pair_id
      and (
        p.mentor_id = auth.uid()
        or p.mentee_id = auth.uid()
        or public.is_staff()
      )
  )
);

create policy "pair_session_logs_write_via_pair"
on public.pair_session_logs for insert
to authenticated
with check (
  exists (
    select 1 from public.pairs p
    where p.id = pair_session_logs.pair_id
      and (
        p.mentor_id = auth.uid()
        or p.mentee_id = auth.uid()
        or public.is_staff()
      )
  )
);

-- ---------------------------------------------------------------------------
-- Events
-- ---------------------------------------------------------------------------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  programme_area text not null default '',
  event_type text not null default 'Webinar',
  event_format text not null default 'Virtual',
  start_at timestamptz not null,
  end_at timestamptz not null,
  location text,
  video_url text,
  registration_required boolean not null default false,
  capacity int,
  recording_url text,
  recap text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "events_select_authenticated"
on public.events for select
to authenticated
using (true);

create policy "events_insert_admins"
on public.events for insert
to authenticated
with check (public.can_create_events());

create policy "events_update_admins"
on public.events for update
to authenticated
using (public.can_create_events())
with check (public.can_create_events());

create table public.event_speakers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  speaker_role text not null default '',
  unique (event_id, profile_id)
);

alter table public.event_speakers enable row level security;

create policy "event_speakers_select_authenticated"
on public.event_speakers for select
to authenticated
using (true);

create policy "event_speakers_insert_admins"
on public.event_speakers for insert
to authenticated
with check (public.can_create_events());

create policy "event_speakers_update_admins"
on public.event_speakers for update
to authenticated
using (public.can_create_events())
with check (public.can_create_events());

create policy "event_speakers_delete_admins"
on public.event_speakers for delete
to authenticated
using (public.can_create_events());

create table public.event_registrations (
  event_id uuid not null references public.events (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, profile_id)
);

alter table public.event_registrations enable row level security;

create policy "event_registrations_select_own_or_staff"
on public.event_registrations for select
to authenticated
using (profile_id = auth.uid() or public.is_staff());

create policy "event_registrations_insert_own"
on public.event_registrations for insert
to authenticated
with check (profile_id = auth.uid());

create policy "event_registrations_delete_own"
on public.event_registrations for delete
to authenticated
using (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Circles & group sessions
-- ---------------------------------------------------------------------------

create table public.circles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  topic text not null default '',
  cadence public.cadence not null default 'monthly',
  capacity int not null default 20,
  description text not null default '',
  facilitator_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger circles_set_updated_at
before update on public.circles
for each row execute function public.set_updated_at();

alter table public.circles enable row level security;

create policy "circles_select_authenticated"
on public.circles for select
to authenticated
using (true);

create policy "circles_write_admins"
on public.circles for insert
to authenticated
with check (public.can_create_events());

create policy "circles_update_admins"
on public.circles for update
to authenticated
using (public.can_create_events())
with check (public.can_create_events());

create table public.circle_members (
  circle_id uuid not null references public.circles (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (circle_id, profile_id)
);

alter table public.circle_members enable row level security;

create policy "circle_members_select_authenticated"
on public.circle_members for select
to authenticated
using (true);

create policy "circle_members_insert_own"
on public.circle_members for insert
to authenticated
with check (profile_id = auth.uid());

create policy "circle_members_delete_own"
on public.circle_members for delete
to authenticated
using (profile_id = auth.uid());

create table public.group_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  host_id uuid not null references public.profiles (id) on delete cascade,
  programme_area text not null default '',
  start_at timestamptz not null,
  end_at timestamptz not null,
  event_format text not null default 'Virtual',
  capacity int not null default 50,
  recording_url text,
  created_at timestamptz not null default now()
);

alter table public.group_sessions enable row level security;

create policy "group_sessions_select_authenticated"
on public.group_sessions for select
to authenticated
using (true);

create policy "group_sessions_write_admins"
on public.group_sessions for insert
to authenticated
with check (public.can_create_events());

create table public.group_session_registrations (
  session_id uuid not null references public.group_sessions (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  primary key (session_id, profile_id)
);

alter table public.group_session_registrations enable row level security;

create policy "group_session_registrations_select"
on public.group_session_registrations for select
to authenticated
using (profile_id = auth.uid() or public.is_staff());

create policy "group_session_registrations_insert_own"
on public.group_session_registrations for insert
to authenticated
with check (profile_id = auth.uid());

create policy "group_session_registrations_delete_own"
on public.group_session_registrations for delete
to authenticated
using (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Messaging
-- ---------------------------------------------------------------------------

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  last_message_at timestamptz not null default now(),
  last_message_preview text not null default '',
  created_at timestamptz not null default now()
);

create table public.conversation_participants (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  unread_count int not null default 0,
  primary key (conversation_id, profile_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  sent_at timestamptz not null default now(),
  read_at timestamptz
);

create index messages_conversation_idx on public.messages (conversation_id, sent_at);

-- Direct-message conversations are created via RPC (bypasses participant RLS safely).
create or replace function public.create_dm_conversation(other_profile_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  cid uuid;
  me uuid := auth.uid();
begin
  if me is null then
    raise exception 'Not authenticated';
  end if;
  if me = other_profile_id then
    raise exception 'Invalid peer';
  end if;

  select c.id into cid
  from public.conversations c
  where
    (select count(*) from public.conversation_participants cp where cp.conversation_id = c.id) = 2
    and exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = c.id and cp.profile_id = me
    )
    and exists (
      select 1 from public.conversation_participants cp
      where cp.conversation_id = c.id and cp.profile_id = other_profile_id
    )
  limit 1;

  if cid is not null then
    return cid;
  end if;

  insert into public.conversations default values
  returning id into cid;

  insert into public.conversation_participants (conversation_id, profile_id)
  values (cid, me), (cid, other_profile_id);

  return cid;
end;
$$;

revoke all on function public.create_dm_conversation(uuid) from public;
revoke execute on function public.create_dm_conversation(uuid) from anon;
grant execute on function public.create_dm_conversation(uuid) to authenticated;

revoke all on function public.is_staff() from public;
revoke all on function public.can_manage_spaces() from public;
revoke all on function public.can_create_events() from public;
revoke all on function public.handle_new_user() from public;
revoke execute on function public.is_staff() from anon;
revoke execute on function public.can_manage_spaces() from anon;
revoke execute on function public.can_create_events() from anon;
revoke execute on function public.handle_new_user() from anon, authenticated;

grant execute on function public.is_staff() to authenticated;
grant execute on function public.can_manage_spaces() to authenticated;
grant execute on function public.can_create_events() to authenticated;

alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;

create policy "conversations_select_participant"
on public.conversations for select
to authenticated
using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.profile_id = auth.uid()
  )
);

create policy "conversation_participants_select_own"
on public.conversation_participants for select
to authenticated
using (profile_id = auth.uid() or public.is_staff());

create policy "messages_select_participant"
on public.messages for select
to authenticated
using (
  exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.profile_id = auth.uid()
  )
);

create policy "messages_insert_as_sender_participant"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.profile_id = auth.uid()
  )
);

create policy "messages_update_read_own"
on public.messages for update
to authenticated
using (
  sender_id <> auth.uid()
  and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.profile_id = auth.uid()
  )
)
with check (
  sender_id <> auth.uid()
  and read_at is not null
  and exists (
    select 1 from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.profile_id = auth.uid()
  )
);

create policy "conversation_participants_update_own"
on public.conversation_participants for update
to authenticated
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Notifications
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind public.notification_kind not null default 'system',
  title text not null,
  body text not null default '',
  href text not null default '/',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
on public.notifications for select
to authenticated
using (user_id = auth.uid());

create policy "notifications_update_own"
on public.notifications for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Discussion spaces & moderation
-- ---------------------------------------------------------------------------

create table public.discussion_spaces (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  programme_area text,
  member_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.discussion_spaces enable row level security;

create policy "discussion_spaces_select_authenticated"
on public.discussion_spaces for select
to authenticated
using (true);

create policy "discussion_spaces_write_managers"
on public.discussion_spaces for all
to authenticated
using (public.can_manage_spaces())
with check (public.can_manage_spaces());

create table public.discussion_threads (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.discussion_spaces (id) on delete cascade,
  title text not null,
  author_id uuid not null references public.profiles (id) on delete cascade,
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);

create index discussion_threads_space_idx on public.discussion_threads (space_id, last_activity_at desc);

create trigger discussion_threads_set_updated_at
before update on public.discussion_threads
for each row execute function public.set_updated_at();

alter table public.discussion_threads enable row level security;

create policy "discussion_threads_select_authenticated"
on public.discussion_threads for select
to authenticated
using (true);

create policy "discussion_threads_insert_authenticated"
on public.discussion_threads for insert
to authenticated
with check (author_id = auth.uid());

create policy "discussion_threads_update_author_or_staff"
on public.discussion_threads for update
to authenticated
using (author_id = auth.uid() or public.can_manage_spaces())
with check (author_id = auth.uid() or public.can_manage_spaces());

create table public.thread_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.discussion_threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  sent_at timestamptz not null default now()
);

create index thread_replies_thread_idx on public.thread_replies (thread_id, sent_at);

alter table public.thread_replies enable row level security;

create policy "thread_replies_select_authenticated"
on public.thread_replies for select
to authenticated
using (true);

create policy "thread_replies_insert_authenticated"
on public.thread_replies for insert
to authenticated
with check (author_id = auth.uid());

create table public.moderation_reports (
  id uuid primary key default gen_random_uuid(),
  kind public.moderation_kind not null,
  reporter_id uuid references public.profiles (id) on delete set null,
  reported_by_label text not null default '',
  reason text not null default '',
  body text not null default '',
  space_name text not null default '',
  thread_id uuid references public.discussion_threads (id) on delete set null,
  reply_id uuid references public.thread_replies (id) on delete set null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.moderation_reports enable row level security;

create policy "moderation_reports_select_managers"
on public.moderation_reports for select
to authenticated
using (public.can_manage_spaces());

create policy "moderation_reports_insert_authenticated"
on public.moderation_reports for insert
to authenticated
with check (reporter_id = auth.uid() or reporter_id is null);

create policy "moderation_reports_update_managers"
on public.moderation_reports for update
to authenticated
using (public.can_manage_spaces())
with check (public.can_manage_spaces());

create policy "moderation_reports_delete_managers"
on public.moderation_reports for delete
to authenticated
using (public.can_manage_spaces());

-- Realtime: enable postgres_changes for these tables in Dashboard if needed.
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.thread_replies;

-- ---------------------------------------------------------------------------
-- Storage buckets + policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

create policy "avatars_owner_write"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_owner_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "avatars_owner_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "attachments_participant_access"
on storage.objects for select
to authenticated
using (bucket_id = 'attachments');

create policy "attachments_authenticated_upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'attachments'
  and (storage.foldername(name))[1] = auth.uid()::text
);
