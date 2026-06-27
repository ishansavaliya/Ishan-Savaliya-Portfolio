-- =============================================================================
-- 0002 — Blog author credit + cover image storage
--   * adds author_name / author_url columns to blogs
--   * creates a public "blog-images" storage bucket for cover uploads
-- Additive & idempotent — safe to run on an existing database.
-- =============================================================================

-- ---------- author credit columns ------------------------------------------
alter table blogs add column if not exists author_name text;
alter table blogs add column if not exists author_url  text;

-- ---------- cover-image storage bucket -------------------------------------
-- Public bucket so cover URLs render without signed access.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

-- Anyone can READ objects in this public bucket
drop policy if exists "blog_images_public_read" on storage.objects;
create policy "blog_images_public_read" on storage.objects
  for select using (bucket_id = 'blog-images');

-- Only authenticated admin may upload / change / delete cover images
drop policy if exists "blog_images_admin_write" on storage.objects;
create policy "blog_images_admin_write" on storage.objects
  for all
  using (bucket_id = 'blog-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');
