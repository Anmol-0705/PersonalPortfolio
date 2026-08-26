-- Run this once, with your actual admin login email substituted below.
-- Safe to re-run: does nothing if the row already exists.
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'anmolsamualk@gmail.com'
  and not exists (
    select 1 from public.admin_users a where a.user_id = auth.users.id
  );

-- Verify:
-- select u.email, a.user_id
-- from public.admin_users a
-- join auth.users u on u.id = a.user_id;
