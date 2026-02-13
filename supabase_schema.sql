-- Create a table for public profiles if it doesn't represent
create table if not exists users (
  id text primary key not null,
  email text,
  full_name text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- If table exists but columns are missing (run this anyway, harmless if columns exist)
alter table users add column if not exists full_name text;
alter table users add column if not exists image_url text;

-- Enable RLS
alter table users enable row level security;

-- Allow public read access (careful with this, adjust policies as needed)
create policy "Public profiles are viewable by everyone." on users
  for select using (true);
