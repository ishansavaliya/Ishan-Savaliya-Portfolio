-- =============================================================================
-- Ishan OS — initial schema
-- Public READ on published content; WRITE restricted to authenticated admin.
-- Run in the Supabase SQL editor (or via the CLI) after creating the project.
-- =============================================================================

-- ---------- helper: updated_at trigger -------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ---------- profile (single row) -------------------------------------------
create table if not exists profile (
  id            text primary key default 'me',
  full_name     text not null,
  name          text not null,
  title         text not null,
  tagline       text,
  location      text,
  email         text,
  phone         text,
  availability  text default 'open',
  availability_note text,
  summary       text,
  about         jsonb default '[]',
  socials       jsonb default '[]',
  resume_url    text,
  avatar_url    text,
  updated_at    timestamptz default now()
);

-- ---------- experience ------------------------------------------------------
create table if not exists experience (
  id          text primary key,
  company     text not null,
  role        text not null,
  type        text default 'full-time',
  start_label text,
  end_label   text,
  location    text,
  current     boolean default false,
  highlights  jsonb default '[]',
  stack       jsonb default '[]',
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ---------- projects --------------------------------------------------------
create table if not exists projects (
  id          text primary key,
  name        text not null,
  tagline     text,
  category    text default 'personal',
  featured    boolean default false,
  description text,
  highlights  jsonb default '[]',
  stack       jsonb default '[]',
  github      text,
  live        text,
  metrics     jsonb default '[]',
  images      jsonb default '[]',
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ---------- skills ----------------------------------------------------------
create table if not exists skills (
  id          text primary key,
  label       text not null,
  skills      jsonb default '[]',
  sort_order  int default 0,
  updated_at  timestamptz default now()
);

-- ---------- education -------------------------------------------------------
create table if not exists education (
  id          text primary key,
  institution text not null,
  degree      text,
  grade       text,
  start_label text,
  end_label   text,
  location    text,
  sort_order  int default 0
);

-- ---------- certifications --------------------------------------------------
create table if not exists certifications (
  id          text primary key,
  name        text not null,
  issuer      text,
  url         text,
  category    text,
  sort_order  int default 0
);

-- ---------- testimonials ----------------------------------------------------
create table if not exists testimonials (
  id          text primary key,
  name        text not null,
  role        text,
  company     text,
  quote       text not null,
  url         text,
  approved    boolean default false,
  created_at  timestamptz default now()
);

-- ---------- achievements ----------------------------------------------------
create table if not exists achievements (
  id          text primary key,
  title       text not null,
  description text,
  date_label  text,
  category    text default 'milestone',
  sort_order  int default 0
);

-- ---------- blogs -----------------------------------------------------------
create table if not exists blogs (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  excerpt     text,
  body        text,
  tags        jsonb default '[]',
  cover_image text,
  reading_time int default 1,
  views       int default 0,
  published   boolean default false,
  published_at timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ---------- contact messages ------------------------------------------------
create table if not exists messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text,
  body        text not null,
  read        boolean default false,
  created_at  timestamptz default now()
);

-- ---------- announcements ---------------------------------------------------
create table if not exists announcements (
  id          uuid primary key default gen_random_uuid(),
  message     text not null,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ---------- settings (key/value) -------------------------------------------
create table if not exists settings (
  key         text primary key,
  value       jsonb,
  updated_at  timestamptz default now()
);

-- ---------- updated_at triggers --------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['profile','experience','projects','skills','blogs']
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- =============================================================================
-- Row Level Security
-- =============================================================================
alter table profile        enable row level security;
alter table experience     enable row level security;
alter table projects       enable row level security;
alter table skills         enable row level security;
alter table education      enable row level security;
alter table certifications enable row level security;
alter table testimonials   enable row level security;
alter table achievements   enable row level security;
alter table blogs          enable row level security;
alter table messages       enable row level security;
alter table announcements  enable row level security;
alter table settings       enable row level security;

-- Public read on portfolio content
do $$
declare t text;
begin
  foreach t in array array[
    'profile','experience','projects','skills','education',
    'certifications','achievements','announcements','settings'
  ]
  loop
    execute format(
      'drop policy if exists "public_read_%1$s" on %1$s;
       create policy "public_read_%1$s" on %1$s for select using (true);', t);
    execute format(
      'drop policy if exists "admin_write_%1$s" on %1$s;
       create policy "admin_write_%1$s" on %1$s for all
       using (auth.role() = ''authenticated'')
       with check (auth.role() = ''authenticated'');', t);
  end loop;
end $$;

-- Blogs: public read only when published; admin full access
drop policy if exists "public_read_blogs" on blogs;
create policy "public_read_blogs" on blogs for select using (published = true);
drop policy if exists "admin_all_blogs" on blogs;
create policy "admin_all_blogs" on blogs for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Testimonials: public read only when approved; admin full access
drop policy if exists "public_read_testimonials" on testimonials;
create policy "public_read_testimonials" on testimonials for select using (approved = true);
drop policy if exists "admin_all_testimonials" on testimonials;
create policy "admin_all_testimonials" on testimonials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Messages: anyone may INSERT (contact form); only admin may read/manage
drop policy if exists "public_insert_messages" on messages;
create policy "public_insert_messages" on messages for insert with check (true);
drop policy if exists "admin_read_messages" on messages;
create policy "admin_read_messages" on messages for select
  using (auth.role() = 'authenticated');
drop policy if exists "admin_update_messages" on messages;
create policy "admin_update_messages" on messages for update
  using (auth.role() = 'authenticated');
