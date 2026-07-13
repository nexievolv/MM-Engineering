-- Initial migration for MM Engineering Supabase schema

-- 1. Leads Table
create table if not exists public.leads (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    company text,
    email text not null,
    phone text not null,
    service text,
    material text,
    quantity text,
    message text not null,
    drawing_url text,
    status text default 'new'::text not null,
    notes text
);

-- Enable RLS
alter table public.leads enable row level security;

-- 3. Blog Posts Table
create table if not exists public.blog_posts (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    slug text not null unique,
    title text not null,
    category text not null,
    excerpt text not null,
    content text not null,
    author text not null default 'MM Engineering Team'::text,
    date text not null,
    read_time text not null,
    image_url text,
    featured boolean default false not null,
    published boolean default true not null,
    show_on_homepage boolean default false not null,
    meta_title text,
    meta_description text
);

alter table public.blog_posts enable row level security;

-- 4. Testimonials Table
create table if not exists public.testimonials (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    role text not null,
    company text,
    content text not null,
    rating integer default 5 not null,
    active boolean default true not null,
    sort_order integer default 0 not null
);

alter table public.testimonials enable row level security;

-- 5. Reviews Table
create table if not exists public.reviews (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    role text,
    company text,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text not null,
    approved boolean default false not null,
    show_on_homepage boolean default false not null
);

alter table public.reviews enable row level security;

-- 6. Gallery Items Table
create table if not exists public.gallery_items (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    category text not null,
    image_url text not null,
    size text default 'sm'::text not null,
    active boolean default true not null,
    sort_order integer default 0 not null
);

alter table public.gallery_items enable row level security;

-- 7. Projects Table
create table if not exists public.projects (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    slug text not null unique,
    title text not null,
    client text not null,
    completed text not null,
    industry text not null,
    summary text not null,
    specs text[] not null default '{}'::text[],
    image_url text not null,
    active boolean default true not null,
    sort_order integer default 0 not null
);

alter table public.projects enable row level security;

-- 8. Contact Settings Table (single row)
create table if not exists public.contact_settings (
    id integer primary key default 1 check (id = 1),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    phone text not null,
    whatsapp text not null,
    email text not null,
    address text not null,
    hours text not null,
    maps_link text not null,
    maps_embed text not null
);

alter table public.contact_settings enable row level security;

-- 9. SEO Settings Table
create table if not exists public.seo_settings (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    page_path text not null unique,
    title text not null,
    description text not null,
    keywords text
);

alter table public.seo_settings enable row level security;

-- Create Storage Bucket for RFQ Drawings
-- Note: In Supabase, bucket creation can be done via SQL on storage.buckets table
insert into storage.buckets (id, name, public) 
values ('rfq_drawings', 'rfq-drawings', true)
on conflict (id) do nothing;

-- Storage Policy to allow anyone to upload files to rfq_drawings bucket, and anyone to read them
create policy "Allow public uploads to rfq_drawings"
on storage.objects for insert
with check (bucket_id = 'rfq_drawings');

create policy "Allow public read access to rfq_drawings"
on storage.objects for select
using (bucket_id = 'rfq_drawings');



-- Policies for Tables:
-- Admin operations bypass RLS via Service Role Key (already handled in server.ts/client.server.ts).
-- For client-side inserts (anonymous users):
create policy "Allow anonymous inserts to leads"
on public.leads for insert
with check (true);

create policy "Allow anonymous inserts to reviews"
on public.reviews for insert
with check (true);

-- Allow public read access to active testimonials, gallery items, projects, approved reviews, blog posts, contact settings, and seo settings:
create policy "Allow public read access to active testimonials"
on public.testimonials for select
using (active = true);

create policy "Allow public read access to active gallery items"
on public.gallery_items for select
using (active = true);

create policy "Allow public read access to active projects"
on public.projects for select
using (active = true);

create policy "Allow public read access to approved reviews"
on public.reviews for select
using (approved = true);

create policy "Allow public read access to published blog posts"
on public.blog_posts for select
using (published = true);

create policy "Allow public read access to contact settings"
on public.contact_settings for select
using (true);

create policy "Allow public read access to seo settings"
on public.seo_settings for select
using (true);
