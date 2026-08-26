-- Sets up Supabase Storage for project cover images.
--
-- Bucket: project-images (public-read; writes gated by is_admin()).
--
-- Public-read tradeoff, stated plainly: a public bucket serves any
-- object by URL to anyone who has that URL, regardless of whether the
-- project row referencing it is published. This migration does not
-- weaken public.projects' RLS in any way — an unpublished project's
-- cover_image URL is never returned by any public query (getAllProjects/
-- getFeaturedProjects/getProjectBySlug are all RLS-scoped to
-- published = true for anonymous requests), so there is no public path
-- that discovers or links to a draft's image. Someone who already has
-- the exact object URL (e.g. from a leaked link) could still load the
-- image directly, since object storage has no concept of "published."
-- If that residual exposure is unacceptable later, the fix is a private
-- bucket + short-lived signed URLs generated only for published rows —
-- deliberately not implemented here to keep this phase's scope clean;
-- see docs/PROJECT_STATE.md "Known Limitations".
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Explicit SELECT policy for completeness/defense-in-depth (the bucket's
-- public flag already serves objects via the public URL without this,
-- but this keeps direct Storage API reads consistent with that).
drop policy if exists "Public can view project images" on storage.objects;
create policy "Public can view project images"
  on storage.objects for select
  to public
  using (bucket_id = 'project-images');

drop policy if exists "Admin can upload project images" on storage.objects;
create policy "Admin can upload project images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admin can update project images" on storage.objects;
create policy "Admin can update project images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "Admin can delete project images" on storage.objects;
create policy "Admin can delete project images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
