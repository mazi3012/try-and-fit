-- 1. PROFILES TABLE
-- Create a table for user profiles to store extra user information
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  website text,

  constraint full_name_length check (char_length(full_name) >= 3)
);

-- 2. PROFILE TRIGGER
-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. TRYON_JOBS TABLE
-- Track virtual try-on requests and their results
create table if not exists public.tryon_jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  status text not null default 'pending', -- pending, processing, completed, failed
  person_image_url text,
  garment_image_url text,
  result_image_url text,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ENABLE RLS
alter table public.profiles enable row level security;
alter table public.tryon_jobs enable row level security;

-- 5. ACCESS POLICIES
-- Profiles: Everyone can see public profiles, users can update their own
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Jobs: Users can only see and manage their own jobs
create policy "Users can view their own jobs." on public.tryon_jobs for select using (auth.uid() = user_id);
create policy "Users can insert their own jobs." on public.tryon_jobs for insert with check (auth.uid() = user_id);
create policy "Users can update their own jobs." on public.tryon_jobs for update using (auth.uid() = user_id);

-- 6. STORAGE BUCKETS
-- Create buckets for uploads and results (Done via SQL for project-ready setup)
insert into storage.buckets (id, name, public) 
values ('user-images', 'user-images', false) 
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('results', 'results', false) 
on conflict (id) do nothing;

-- 7. STORAGE POLICIES
-- Allow users to upload and view their own files in these buckets
create policy "Users can upload their own images"
on storage.objects for insert
with check (
  bucket_id = 'user-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own images"
on storage.objects for select
using (
  bucket_id = 'user-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own results"
on storage.objects for select
using (
  bucket_id = 'results' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
