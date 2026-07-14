-- SQL migration script to drop redundant, unused database tables

-- Drop testimonials table (redundant to reviews table)
drop table if exists public.testimonials cascade;

-- Drop gallery_items table (redundant to centralized gallery table)
drop table if exists public.gallery_items cascade;

-- Drop seo_settings table (unused)
drop table if exists public.seo_settings cascade;

-- Drop contact_settings table (unused)
drop table if exists public.contact_settings cascade;
