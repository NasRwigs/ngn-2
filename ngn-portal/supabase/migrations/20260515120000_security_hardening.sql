-- Security hardening: linter fixes for function EXECUTE grants, search_path, RLS, storage.

-- ---------------------------------------------------------------------------
-- set_updated_at: immutable search_path
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
-- Revoke RPC exposure of internal SECURITY DEFINER helpers
-- (RLS policies invoke these; they must not be callable via PostgREST)
-- ---------------------------------------------------------------------------

revoke all on function public.is_staff() from public;
revoke all on function public.can_manage_spaces() from public;
revoke all on function public.can_create_events() from public;
revoke all on function public.handle_new_user() from public;

revoke execute on function public.is_staff() from anon, authenticated;
revoke execute on function public.can_manage_spaces() from anon, authenticated;
revoke execute on function public.can_create_events() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;

revoke all on function public.create_dm_conversation(uuid) from public;
revoke execute on function public.create_dm_conversation(uuid) from anon;
grant execute on function public.create_dm_conversation(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- messages: tighten read-receipt updates (no unrestricted WITH CHECK true)
-- ---------------------------------------------------------------------------

drop policy if exists "messages_update_read_own" on public.messages;

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

-- ---------------------------------------------------------------------------
-- avatars bucket: public flag allows object URLs; drop broad SELECT (listing)
-- ---------------------------------------------------------------------------

drop policy if exists "avatars_public_read" on storage.objects;
