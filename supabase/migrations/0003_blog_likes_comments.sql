-- =============================================================================
-- 0003 — Blog likes + comments
--   * adds a `likes` counter to blogs
--   * creates a `comments` table (name + body, tied to a post slug)
--   * RPC to atomically bump likes (no read-modify-write races)
-- Additive & idempotent — safe to run on an existing database.
-- =============================================================================

-- ---------- likes counter ---------------------------------------------------
alter table blogs add column if not exists likes int not null default 0;

-- ---------- comments --------------------------------------------------------
create table if not exists comments (
  id          uuid primary key default gen_random_uuid(),
  post_slug   text not null,
  name        text not null,
  body        text not null,
  created_at  timestamptz default now()
);
create index if not exists comments_post_slug_idx on comments (post_slug, created_at desc);

-- ---------- atomic like bump (delta = +1 / -1) ------------------------------
create or replace function bump_blog_likes(p_slug text, p_delta int)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
begin
  update blogs
    set likes = greatest(0, likes + p_delta)
    where slug = p_slug
    returning likes into new_count;
  return coalesce(new_count, 0);
end;
$$;

-- ---------- RLS -------------------------------------------------------------
alter table comments enable row level security;

-- Anyone may read comments
drop policy if exists "public_read_comments" on comments;
create policy "public_read_comments" on comments for select using (true);

-- Anyone may post a comment (insert only)
drop policy if exists "public_insert_comments" on comments;
create policy "public_insert_comments" on comments for insert with check (true);

-- Only authenticated admin may delete / update comments
drop policy if exists "admin_manage_comments" on comments;
create policy "admin_manage_comments" on comments for delete
  using (auth.role() = 'authenticated');
drop policy if exists "admin_update_comments" on comments;
create policy "admin_update_comments" on comments for update
  using (auth.role() = 'authenticated');

-- Allow the bump_blog_likes RPC to run for anon (it only touches the counter)
grant execute on function bump_blog_likes(text, int) to anon, authenticated;
