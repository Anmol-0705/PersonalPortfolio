-- Phase 9: admin-managed skills, replacing data/skills.ts as the
-- runtime source of truth. Mirrors public.projects' security model
-- exactly: RLS policies restrict admin writes via public.is_admin(),
-- and GRANTs are set explicitly and separately from RLS — the missing
-- `GRANT SELECT ... TO anon` on public.projects (see
-- 0004_grant_anon_select_projects.sql) is not repeated here.
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skills enable row level security;

-- Table-level privileges (separate from RLS — see the note above).
grant select on public.skills to anon, authenticated;
grant insert, update, delete on public.skills to authenticated;

-- No published/draft state for skills — every row is always public,
-- matching the original data/skills.ts, which had no draft concept.
drop policy if exists "Public can view skills" on public.skills;
create policy "Public can view skills"
  on public.skills for select
  to public
  using (true);

drop policy if exists "Admin can create skills" on public.skills;
create policy "Admin can create skills"
  on public.skills for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admin can update skills" on public.skills;
create policy "Admin can update skills"
  on public.skills for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin can delete skills" on public.skills;
create policy "Admin can delete skills"
  on public.skills for delete
  to authenticated
  using (public.is_admin());
