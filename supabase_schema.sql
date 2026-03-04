
-- Users table setup (safely handle existing objects)
create table if not exists users (
  id text primary key not null,
  email text,
  full_name text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Safely add columns
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'full_name') then
    alter table users add column full_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'image_url') then
    alter table users add column image_url text;
  end if;
end $$;

-- Enable RLS
alter table users enable row level security;

-- Safely create policy for users
do $$ 
begin
  if not exists (select 1 from pg_policies where tablename = 'users' and policyname = 'Public profiles are viewable by everyone.') then
    create policy "Public profiles are viewable by everyone." on users for select using (true);
  end if;
end $$;

-- SERIES GENERATION WIZARD DATA
-- Drop the table first to handle schema updates cleanly during dev
drop table if exists series_projects;

create table series_projects (
  id uuid primary key default gen_random_uuid(),
  user_id text not null, -- Stores Clerk User ID as text
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Step 1: Format & Content
  format text not null,
  niche text,
  custom_topic text,
  custom_prompt text,
  aspect_ratio text not null default '9:16',
  
  -- Step 2: Language & Voice
  language text not null default 'en-US',
  voice text,
  
  -- Step 3: Music
  music text[] default '{}',
  
  -- Step 4: Style
  video_style text,
  caption_style text,
  font_weight text default 'bold',
  
  -- Step 5: Details & Schedule
  name text,
  duration text,
  platforms text[] default '{}',
  publish_time text,
  
  -- Status
  status text default 'pending',
  error_message text
);

-- Enable RLS
alter table series_projects enable row level security;

-- Policies for Clerk Auth (using raw jwt claims)
-- We check if the requesting user's ID (from the JWT 'sub' claim) matches the user_id column
-- 'sub' claim in JWT typically holds the unauthorized user ID
create policy "Users can view their own projects" 
  on series_projects for select 
  using ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can insert their own projects" 
  on series_projects for insert 
  with check ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can update their own projects" 
  on series_projects for update 
  using ((auth.jwt() ->> 'sub') = user_id);

-- VIDEO GENERATIONS DATA
drop table if exists video_generations;

create table video_generations (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references series_projects(id) on delete cascade not null,
  user_id text not null, -- Stores Clerk User ID as text for security checks
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- The generated assets
  title text,
  script text,
  audio_url text,
  captions jsonb,
  image_urls text[],
  
  -- Video compilation status
  status text default 'processing', -- processing, completed, failed
  final_video_url text,
  error_message text
);

-- Enable RLS for video_generations
alter table video_generations enable row level security;

create policy "Users can view their own generated videos" 
  on video_generations for select 
  using ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can insert their own generated videos" 
  on video_generations for insert 
  with check ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can update their own generated videos" 
  on video_generations for update 
  using ((auth.jwt() ->> 'sub') = user_id);
