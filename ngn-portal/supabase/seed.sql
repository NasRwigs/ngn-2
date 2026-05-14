-- Optional seed for `supabase db reset` (local). Inserts discussion spaces only.
insert into public.discussion_spaces (slug, name, description, member_count)
values
  ('general', 'General', 'Open discussion for all members.', 0),
  ('announcements', 'Announcements', 'Official announcements from ExCo and Programme Admins.', 0),
  ('mentorship', 'Mentorship', 'Discussion space for the mentorship programme.', 0),
  ('climate', 'Climate & Energy', 'Climate adaptation and energy transition discussions.', 0)
on conflict (slug) do nothing;
