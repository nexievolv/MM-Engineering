-- Migration to create Gallery table and storage bucket configuration

-- 1. Create Gallery Table
create table if not exists public.gallery (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    filename text not null,
    storage_path text not null,
    public_url text not null,
    alt_text text,
    page text, -- 'Homepage', 'Services', 'Blogs', 'Projects', 'Gallery', 'About', 'Contact'
    section text, -- 'Hero', 'Capabilities', 'About', etc.
    category text, -- 'Cover', 'Content', 'Gallery', etc.
    is_published boolean default true not null,
    show_on_homepage boolean default false not null
);

-- Enable Row Level Security (RLS)
alter table public.gallery enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Allow public read access to gallery" on public.gallery;
drop policy if exists "Allow public insert to gallery" on public.gallery;
drop policy if exists "Allow public update to gallery" on public.gallery;
drop policy if exists "Allow public delete from gallery" on public.gallery;

drop policy if exists "Allow public read access to gallery storage" on storage.objects;
drop policy if exists "Allow public uploads to gallery storage" on storage.objects;
drop policy if exists "Allow public updates to gallery storage" on storage.objects;
drop policy if exists "Allow public deletion from gallery storage" on storage.objects;

-- Create policies for RLS bypass or custom access:
-- Allow public select/insert/update/delete on gallery table
create policy "Allow public read access to gallery"
on public.gallery for select
using (true);

create policy "Allow public insert to gallery"
on public.gallery for insert
with check (true);

create policy "Allow public update to gallery"
on public.gallery for update
using (true);

create policy "Allow public delete from gallery"
on public.gallery for delete
using (true);

-- 2. Create Storage Bucket for Gallery
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

-- Storage Policies for Gallery Bucket
create policy "Allow public read access to gallery storage"
on storage.objects for select
using (bucket_id = 'gallery');

create policy "Allow public uploads to gallery storage"
on storage.objects for insert
with check (bucket_id = 'gallery');

create policy "Allow public updates to gallery storage"
on storage.objects for update
using (bucket_id = 'gallery');

create policy "Allow public deletion from gallery storage"
on storage.objects for delete
using (bucket_id = 'gallery');