-- Phase 14: admin-managed social/professional links (GitHub, LinkedIn,
-- email, etc.), rendered on the homepage Connect section, the footer,
-- and the terminal's `socials` command. Same security model as
-- 0005_create_skills_table.sql / 0006_create_services_table.sql:
-- RLS restricts admin writes via public.is_admin(), and table-level
-- GRANTs are set explicitly and separately from RLS (the missing
-- `GRANT SELECT ... TO anon` on public.projects — see
-- 0004_grant_anon_select_projects.sql — is not repeated here).
--
-- Unlike skills/services, social links DO have a draft-like state
-- (`enabled`), so the public SELECT policy follows public.projects'
-- pattern instead: one policy, `enabled = true OR public.is_admin()`,
-- so RLS alone decides "does this row show up" per caller — the
-- application code never manually filters `published`/`enabled` when
-- reading for an admin session, matching lib/projects.ts's documented
-- approach. (Public-facing reads still filter `enabled` again in
-- lib/social-links.ts as defense in depth — see that file's comment —
-- since a signed-in admin's own browser would otherwise see disabled
-- rows on the public site too, the same reasoning as app/sitemap.ts's
-- published-only filter from Phase 12.)
--
-- `platform` and `icon` are both plain strings, never a component or
-- anything dynamically imported — CHECK constraints below are the
-- database-level half of that guarantee; the application-level half is
-- lib/social-platforms.ts / lib/social-icons.ts's fixed maps, the only
-- place an id is turned into an actual Lucide icon component. This
-- matches public.services.icon's existing defense-in-depth pattern
-- exactly (see 0006_create_services_table.sql).
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in (
    'github', 'linkedin', 'email', 'twitter', 'leetcode', 'hackerrank',
    'kaggle', 'devto', 'medium', 'youtube', 'website', 'resume', 'custom'
  )),
  label text not null,
  -- For platform = 'email', this is a plain email address (no `mailto:`
  -- prefix) — the mailto: link is constructed at render time. For every
  -- other platform, this is a full absolute URL. See
  -- lib/admin/social-link-actions.ts for the corresponding validation
  -- and lib/social-links.ts / the public renderers for how each is
  -- turned into an href. Chosen over storing `mailto:...` directly so
  -- the column has one consistent, easily-validated shape per platform
  -- rather than two different URL schemes mixed into one field.
  url text not null,
  icon text not null check (icon in (
    'code', 'briefcase', 'mail', 'at-sign', 'terminal', 'trophy',
    'bar-chart', 'newspaper', 'book-open', 'video', 'globe', 'file-text',
    'link', 'star', 'sparkles', 'flag', 'award', 'bookmark'
  )),
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_links enable row level security;

-- Table-level privileges (separate from RLS — see the note above).
grant select on public.social_links to anon, authenticated;
grant insert, update, delete on public.social_links to authenticated;

drop policy if exists "Public can view enabled social links" on public.social_links;
create policy "Public can view enabled social links"
  on public.social_links for select
  to public
  using (enabled = true or public.is_admin());

drop policy if exists "Admin can create social links" on public.social_links;
create policy "Admin can create social links"
  on public.social_links for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admin can update social links" on public.social_links;
create policy "Admin can update social links"
  on public.social_links for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin can delete social links" on public.social_links;
create policy "Admin can delete social links"
  on public.social_links for delete
  to authenticated
  using (public.is_admin());
