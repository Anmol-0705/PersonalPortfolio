-- Phase 9: admin-managed services, replacing data/services.ts as the
-- runtime source of truth. Same security model as
-- 0005_create_skills_table.sql (see its comments).
--
-- `icon` stores only a controlled string identifier, never a component
-- name or anything dynamically imported — the CHECK constraint below is
-- the database-level half of that guarantee; the application-level half
-- is lib/service-icons.ts's fixed serviceIconMap, which the admin UI
-- selects from and which is the only place an id is turned into an
-- actual Lucide icon component.
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null check (icon in ('rocket', 'layers', 'pen-tool', 'wrench')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;

drop policy if exists "Public can view services" on public.services;
create policy "Public can view services"
  on public.services for select
  to public
  using (true);

drop policy if exists "Admin can create services" on public.services;
create policy "Admin can create services"
  on public.services for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admin can update services" on public.services;
create policy "Admin can update services"
  on public.services for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin can delete services" on public.services;
create policy "Admin can delete services"
  on public.services for delete
  to authenticated
  using (public.is_admin());
