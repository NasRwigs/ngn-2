-- RLS policies reference is_staff() / can_*() during row checks; authenticated
-- role must retain EXECUTE. Revoke from PUBLIC/anon only (blocks PostgREST anon RPC).

grant execute on function public.is_staff() to authenticated;
grant execute on function public.can_manage_spaces() to authenticated;
grant execute on function public.can_create_events() to authenticated;
