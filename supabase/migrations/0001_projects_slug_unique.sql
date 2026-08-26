-- Required for the admin panel's duplicate-slug prevention to be a real
-- guarantee rather than just an application-level check.
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints
    where table_schema = 'public'
      and table_name = 'projects'
      and constraint_type = 'UNIQUE'
      and constraint_name = 'projects_slug_key'
  ) then
    alter table public.projects
      add constraint projects_slug_key unique (slug);
  end if;
end $$;
