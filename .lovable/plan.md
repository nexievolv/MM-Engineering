## MM Engineering – Version 2 Production Build

Large, multi-part request. Preserving the approved UI/UX (navy/steel/orange, Archivo + IBM Plex, blueprint grids, Motion animations). Only content, structure, service catalog, hero stats layout, backend, and admin change.

---

### Phase 1 — Rebrand & Content Rewrite (no UI changes)

- Global find/replace **Vulcan Engineering Works → MM Engineering** across `site-data.ts`, `Header.tsx`, `Footer.tsx`, `__root.tsx`, all routes, SEO metadata.
- Update `company` object in `src/lib/site-data.ts`:
  - Address: *Near Simro Dharam Kanta, By Pass Road, Baddi, Himachal Pradesh, India*
  - Phone: `+91 93188 73188`
  - Hours: Mon–Sat 8:00 AM – 6:30 PM
  - Email: `info@mmengineeringbaddi.in` (placeholder – will confirm)
  - Operating area list: Baddi, Barotiwala, Nalagarh, BBN Industrial Area, Solan
- Rewrite all copy in professional Indian business English targeted at BBN-belt factories, pharma units, packaging, food processing.
- Rewrite testimonials, blog posts, project case studies with Indian company names and BBN-region context.

### Phase 2 — Services Restructure

**New service catalog (4 dedicated pages):**

1. Industrial Fabrication *(umbrella – hosts Sheet Metal, Pipe & Tube, Stainless Steel as in-page sections)*
2. Assembly & Integration
3. Custom Gear Manufacturing
4. CNC / VMC Machining

**Removed:** Heavy Fabrication, Machine Components, OEM Manufacturing, Engineering Design, Reverse Engineering, Prototype Development, plus the standalone Sheet Metal / Pipe & Tube / Stainless Steel entries (folded into Industrial Fabrication page).

- `site-data.ts`: rewrite `services` array to the 4 items above with full detail (overview, applications, industries, materials, process, advantages, FAQs, gallery, related).
- Add nested `fabricationTypes` data (Sheet Metal, Pipe & Tube, Stainless Steel) with description / applications / materials / industries / process / images.
- Home page **Core Capabilities** section: show only Industrial Fabrication, Assembly & Integration, Custom Gear Manufacturing (3 cards).
- Home services grid, services index page, header mega-menu, footer, mobile nav, sitemap all reflect the 4 services.
- `src/routes/services.$slug.tsx`: add a `FabricationTypesSection` that renders only for `industrial-fabrication` slug — full section per type with alternating image/text layout matching approved design language.

### Phase 3 — Hero Stat Cards Responsive Fix

Current floating stat cards overlap/crop on tablet/mobile. Fix in `src/routes/index.tsx`:

- Desktop/laptop: keep the floating-over-hero layout, but constrain to `container` width and add safe bottom padding to hero so they never overlap next section.
- Tablet (md): move stats into a 2×2 grid docked below hero text, still overlapping hero image slightly.
- Mobile: stack as full-width strip **below** the hero (no absolute positioning), inside the hero section, with proper spacing.
- Verify with Playwright screenshots at 375, 768, 1024, 1440 widths.

### Phase 4 — Backend (Lovable Cloud / Supabase)

Enable Lovable Cloud, then create schema:

**Tables (all with GRANTs + RLS):**

- `profiles` (id → auth.users, full_name)
- `user_roles` + `app_role` enum + `has_role()` SECURITY DEFINER fn (admin role gate)
- `services` (slug, title, short, body jsonb, image, icon, order, published)
- `projects` (slug, title, client, industry, year, specs jsonb, images, body, published)
- `gallery_images` (category enum: workshop/fabrication/machinery/projects/finished_products, image_url, alt, order)
- `blog_posts` (slug, title, excerpt, body markdown, seo_title, seo_description, cover_image, author, category, status: draft/published, published_at)
- `testimonials` (name, company, role, quote, rating, approved)
- `leads` (name, company, phone, email, service, message, status: new/contacted/closed, created_at)
- `rfq_requests` (name, company, phone, email, material, quantity, requirements, file_urls text[], status, created_at)
- `site_settings` (singleton key/value for phone, address, hours, maps_link, socials, seo defaults)

**Storage buckets:** `gallery` (public), `blog-covers` (public), `rfq-uploads` (private, admin read only), `site-media` (public).

**RLS:**

- Public tables (services/projects/gallery/blogs published, approved testimonials, site_settings): `TO anon, authenticated` SELECT with `published = true` / `approved = true` filter.
- Leads/RFQ: `TO anon` INSERT only; admin SELECT/UPDATE/DELETE via `has_role(auth.uid(), 'admin')`.
- Everything else: admin-only writes.

### Phase 5 — Lead Capture Wiring

- Contact form → insert into `leads`.
- New `/request-quote` route with RFQ form (file upload to `rfq-uploads`, then insert row).
- Client-side Zod validation + server-side re-validation in a `createServerFn`.
- Newsletter form in footer → inserts into a small `newsletter_subscribers` table.

### Phase 6 — Admin Panel (`/admin/*` under `_authenticated/`)

Clean, on-brand admin using existing design tokens (navy sidebar, orange accents). Screens:

- `/auth` — email/password sign-in (Supabase). No public sign-up.
- `/_authenticated/admin` — dashboard: lead count, RFQ count, recent activity
- `/_authenticated/admin/leads` — table, mark contacted/closed, delete
- `/_authenticated/admin/rfq` — table with file downloads (signed URLs)
- `/_authenticated/admin/services` — list/edit (title, body sections, images)
- `/_authenticated/admin/projects` — CRUD
- `/_authenticated/admin/gallery` — upload, category tag, delete
- `/_authenticated/admin/blog` — list, create/edit with textarea + markdown (lightweight, no heavy WYSIWYG dep), publish/draft
- `/_authenticated/admin/testimonials` — approve/delete
- `/_authenticated/admin/settings` — site contact info, socials, maps link, SEO defaults

Public pages continue to render from static `site-data.ts` as fallback; where DB data exists, prefer DB (progressive: services/projects/blog read from DB via server fns; gallery reads DB). Admin edits reflect on the site.

### Phase 7 — SEO

- Update every route's `head()` with Baddi/BBN-targeted titles & descriptions (e.g. *"Industrial Fabrication Company in Baddi | MM Engineering"*).
- Root: Organization + LocalBusiness JSON-LD with address, geo, hours, phone.
- Service pages: Service JSON-LD + FAQPage JSON-LD from FAQs.
- Blog: Article JSON-LD.
- Breadcrumb JSON-LD on deep routes.
- Regenerate `sitemap.xml` with the 4 services + dynamic blog slugs.
- `robots.txt` allow all except `/admin`, `/_authenticated`.
- Image `alt` audit across all routes.

### Phase 8 — UX polish

- Scroll progress bar (top of viewport).
- Back-to-top button (appears after 600px scroll).
- Sticky "Request Quote" floating button on mobile.
- WhatsApp floating button already exists — wire to `wa.me/919318873188`.
- Skeleton loaders on admin tables and dynamic public queries.
- Keep all existing motion; no new animation systems.

### Phase 9 — QA

- `tsgo` clean.
- Playwright: home, services index, each of 4 service pages, projects, gallery, blog, contact, RFQ, admin login flow. Screenshots at 375 / 768 / 1440.
- Verify no console errors, no placeholder text, all links resolve.

---

### Clarifications before I start

1. **Admin account** — I'll seed a placeholder admin user, but you'll need to sign up via `/auth` and I'll grant admin role in the DB. Confirm the email you'd like to use, or I'll set it up so the first registered user auto-becomes admin (dev-only convenience) with instructions to revoke.
2. **Email** — no email provided. OK to use `info@mmengineeringbaddi.in` as a placeholder that you can change later in Admin → Settings?
3. **Blog editor** — a lightweight markdown textarea + preview (fast, no heavy deps) is sufficient for admin CMS, matching the "simple and clean" ask. Confirm or say if you'd like a full WYSIWYG (heavier bundle).
4. **Existing images** — the current AI-generated industrial photos are generic. Regenerating 15+ new "Indian workshop / Indian workers" images is expensive. Options: (a) keep existing images, they're neutral industrial photography; (b) regenerate the ~6 most prominent hero/service-hero images with Indian-context prompts; (c) regenerate all. Which?

Once you confirm 1–4, I'll execute Phases 1–9 in a single continuous build.