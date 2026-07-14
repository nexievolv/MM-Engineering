import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowDown, ChevronDown, Quote, Award, CheckCircle2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import {
  img,
  stats,
  trustedBy,
  services,
  industries,
  whyChooseUs,
  processTimeline,
  projects,
  galleryItems,
  testimonials,
  certifications,
  blogPosts,
  homeFaqs,
  company,
} from "@/lib/site-data";
import { Reveal, Stagger, StaggerItem, Counter, SectionHeader, ArrowLink, CtaSection, ImageReveal, ProcessTimelineSection, LucideIcon } from "@/components/site/Shared";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Industrial Fabrication in Baddi, Solan | MM Engineering" },
      {
        name: "description",
        content:
          "MM Engineering offers certified industrial fabrication, SS 316L piping, structural mezzanines, custom gear cutting, and BMC machining in Baddi, Solan district, Himachal Pradesh. Request a quote within 48h!",
      },
      { name: "keywords", content: "industrial fabrication Baddi, SS fabrication Himachal Pradesh, structural steel work Baddi, custom gear manufacturing Baddi, sheet metal fabrication Baddi, BMC machining Baddi, MM Engineering Baddi, pharma fabrication BBN belt" },
      { property: "og:title", content: "Industrial Fabrication in Baddi, Solan | MM Engineering" },
      { property: "og:description", content: "Certified industrial fabrication, hygienic SS piping, structural mezzanines, and BMC machining in Baddi, Himachal Pradesh. Serving pharma & packaging industries." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: homeFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: HomePage,
});



/* ---------------- HERO ---------------- */
function Hero({ heroImage }: { heroImage?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section ref={ref} onMouseMove={handleMouseMove} className="relative z-10 lg:z-20 bg-navy">
      <motion.div style={{ y: bgY }} className="absolute inset-0 overflow-hidden" aria-hidden>
        <img
          src={heroImage || img.heroFabrication}
          alt="Industrial fabrication workshop at MM Engineering, Baddi"
          width={1920}
          height={1080}
          className="size-full scale-110 object-cover"
        />
      </motion.div>
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
      <div className="blueprint-grid-glow absolute inset-0" aria-hidden />

      <div className="container relative mx-auto flex min-h-svh flex-col justify-center px-6 pb-24 pt-36 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-10 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Baddi · Barotiwala · Nalagarh · BBN
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-balance font-display text-4xl font-black leading-[1.05] text-white sm:text-6xl lg:text-7xl"
        >
          Industrial Fabrication.
          <br />
          <span className="text-accent">Engineered in Baddi.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl"
        >
          MM Engineering is a trusted industrial fabrication and engineering
          services company serving pharma, packaging and food processing plants
          across the Baddi–Barotiwala–Nalagarh industrial belt.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/40"
          >
            Request a Quote
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 border border-white/30 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all duration-300 hover:border-accent hover:text-accent"
          >
            Explore Services
          </Link>
        </motion.div>

        {/* Stats — inline on mobile/tablet, absolute overlay on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 grid grid-cols-2 border border-white/10 bg-navy-light/80 shadow-card-hover backdrop-blur-xl sm:grid-cols-4 lg:hidden"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col gap-1 px-5 py-5",
                (i % 2 === 1) && "border-l border-white/10",
                (i >= 2) && "border-t border-white/10",
                "sm:border-t-0",
                i > 0 ? "sm:border-l sm:border-white/10" : "sm:border-l-0"
              )}
            >
              <span className="font-display text-2xl font-black text-white sm:text-3xl">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50 sm:text-xs">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating stats — desktop only, overlaps hero + next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto grid translate-y-1/2 grid-cols-4 border border-white/10 bg-navy-light/80 shadow-card-hover backdrop-blur-xl"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "flex flex-col gap-1 px-6 py-7 md:px-8 md:py-8",
                  i > 0 && "border-l border-white/10",
                )}
              >
                <span className="font-display text-3xl font-black text-white md:text-4xl">
                  <Counter value={s.value} suffix={s.suffix} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-32 left-1/2 hidden -translate-x-1/2 text-white/40 xl:block"
        aria-hidden
      >
        <ArrowDown className="size-5" />
      </motion.div>
    </section>
  );
}


/* ---------------- FAQ ---------------- */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-base font-bold text-navy md:text-lg">{q}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-accent transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground md:text-base">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const resolveImage = (imageUrl: string | null | undefined, category: string) => {
  if (!imageUrl || imageUrl.startsWith("/assets/images/") || imageUrl.includes("/placeholder")) {
    switch (category) {
      case "Engineering":
        return img.engineeringDesign;
      case "Quality":
        return img.quality;
      case "Procurement":
        return img.heavyMachinery;
      case "Case Study":
        return img.cnc;
      default:
        return img.workshop;
    }
  }
  return imageUrl;
};

/* ---------------- PAGE ---------------- */
function HomePage() {
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [dbHomePosts, setDbHomePosts] = useState<any[]>([]);
  
  // Dynamic Image Slots
  const [heroUrl, setHeroUrl] = useState("");
  const [aboutUrl, setAboutUrl] = useState("");
  const [cap1Url, setCap1Url] = useState("");
  const [cap2Url, setCap2Url] = useState("");
  const [cap3Url, setCap3Url] = useState("");
  const [qualityUrl, setQualityUrl] = useState("");
  const [dbGalleryItems, setDbGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadGalleryAssets() {
      try {
        const { data } = await supabase
          .from("gallery")
          .select("*")
          .eq("is_published", true);

        if (data) {
          const heroImg = data.find(g => g.page === "Homepage" && g.section === "Hero" && g.category === "Cover");
          if (heroImg) setHeroUrl(heroImg.public_url);
          
          const aboutImg = data.find(g => g.page === "About" && g.section === "Overview" && g.category === "Cover");
          if (aboutImg) setAboutUrl(aboutImg.public_url);
          
          const cap1 = data.find(g => g.page === "Homepage" && g.section === "Capabilities" && g.category === "industrial-fabrication");
          const cap2 = data.find(g => g.page === "Homepage" && g.section === "Capabilities" && g.category === "assembly-integration");
          const cap3 = data.find(g => g.page === "Homepage" && g.section === "Capabilities" && g.category === "custom-gear-manufacturing");
          
          if (cap1) setCap1Url(cap1.public_url);
          if (cap2) setCap2Url(cap2.public_url);
          if (cap3) setCap3Url(cap3.public_url);
          
          const qualityImg = data.find(g => g.page === "Homepage" && g.section === "Quality" && g.category === "Cover");
          if (qualityImg) setQualityUrl(qualityImg.public_url);

          const showcase = data.filter(g => g.show_on_homepage);
          if (showcase.length > 0) {
            setDbGalleryItems(showcase.map(i => ({
              title: i.title,
              image: i.public_url
            })));
          }
        }
      } catch (err) {
        console.error("Failed to load homepage gallery images:", err);
      }
    }
    loadGalleryAssets();
  }, []);

  useEffect(() => {
    async function loadHomePosts() {
      try {
        const { data, error } = await (supabase as any)
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          // Flagged for homepage first
          const flagged = data.filter((p: any) => p.show_on_homepage);
          // If none are flagged, show the latest 4 published database posts
          const selected = flagged.length > 0 ? flagged : data.slice(0, 4);

          const formatted = selected.map((p: any) => ({
            slug: p.slug,
            title: p.title,
            category: p.category,
            excerpt: p.excerpt,
            author: p.author || "MM Engineering Team",
            date: p.date,
            readTime: p.read_time,
            image: resolveImage(p.image_url, p.category),
            content: p.content,
            featured: p.featured,
            published: p.published
          }));
          setDbHomePosts(formatted);
        }
      } catch (err) {
        console.error("Failed to load homepage posts:", err);
      }
    }
    loadHomePosts();
  }, []);

  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);

  useEffect(() => {
    async function loadHomeReviews() {
      try {
        const { data, error } = await (supabase as any)
          .from("reviews")
          .select("*")
          .eq("approved", true)
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          const flagged = data.filter((r: any) => r.show_on_homepage);

          if (flagged.length > 0) {
            const formatted = flagged.map((r: any) => ({
              name: r.name,
              quote: r.comment,
              role: `${r.role || "Plant Representative"}${r.company ? ` at ${r.company}` : ""}`
            }));
            setDbTestimonials(formatted);
          } else {
            setDbTestimonials([]);
          }
        } else {
          setDbTestimonials([]);
        }
      } catch (err) {
        console.error("Failed to load homepage testimonials:", err);
      }
    }
    loadHomeReviews();
  }, []);

  const [dbProjects, setDbProjects] = useState<any[]>([]);

  useEffect(() => {
    async function loadHomeProjects() {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .eq("active", true)
          .order("sort_order", { ascending: true })
          .limit(3);
        if (data && data.length > 0) {
          setDbProjects(data);
        }
      } catch (err) {
        console.error("Failed to load homepage projects:", err);
      }
    }
    loadHomeProjects();
  }, []);

  // Only the 3 core capabilities on the home page — Industrial Fabrication, Assembly & Integration, Custom Gear Manufacturing
  const coreServices = services.filter((s) =>
    ["industrial-fabrication", "assembly-integration", "custom-gear-manufacturing"].includes(s.slug),
  );

  const displayPosts = dbHomePosts.length > 0 
    ? dbHomePosts 
    : blogPosts.slice(0, 4).map((b: any) => ({
        slug: b.slug,
        title: b.title,
        category: b.category,
        excerpt: b.excerpt,
        date: b.date,
        readTime: b.readTime,
        image: b.image
      }));

  const displayTestimonials = dbTestimonials.length > 0 ? dbTestimonials : testimonials;

  const displayProjects = dbProjects.length > 0
    ? dbProjects.map(p => ({
        slug: p.slug,
        title: p.title,
        industry: p.industry,
        client: p.client,
        completed: p.completed,
        image: p.image_url || img.steelStructure,
        summary: p.summary
      }))
    : projects.slice(0, 3);

  return (
    <>
      <Hero heroImage={heroUrl} />

      {/* Trusted By */}
      <section className="relative z-10 border-b border-border bg-background pb-16 pt-24 md:pt-32 lg:pt-36">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Trusted by manufacturing companies across Northern India
            </p>
          </Reveal>
          <div className="marquee-container mt-10">
            <div className="animate-marquee flex gap-16 py-4">
              {trustedBy.concat(trustedBy).map((name, i) => (
                <span
                  key={name + "-" + i}
                  className="font-display text-lg font-bold text-steel/60 transition-colors duration-300 hover:text-navy whitespace-nowrap md:text-xl"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About preview */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <Reveal x={-30} y={0} className="relative">
            <div className="img-zoom relative">
              <img src={aboutUrl || img.workshop} alt="Inside MM Engineering's fabrication workshop in Baddi" width={1280} height={960} loading="lazy" className="w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden border-l-4 border-accent bg-navy p-7 shadow-card-hover md:block lg:-right-10">
              <span className="font-display text-3xl font-black text-white md:text-4xl">Baddi, HP</span>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/50">
                Workshop in the BBN Industrial Belt
              </p>
            </div>
          </Reveal>
          <div>
            <SectionHeader
              align="left"
              eyebrow="About MM Engineering"
              title="An Engineering Partner for the BBN Industrial Belt"
            />
            <Reveal delay={0.1}>
              <p className="-mt-8 leading-relaxed text-muted-foreground md:text-lg">
                MM Engineering is a trusted industrial fabrication and engineering services
                company based in Baddi, Himachal Pradesh. From our workshop near Simro
                Dharam Kanta, we handle mild steel and stainless steel fabrication, sheet
                metal work, custom gear manufacturing and BMC precision machining for
                factories across the Baddi–Barotiwala–Nalagarh region.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Skilled fabricators, certified welders and BMC operators",
                  "Serving pharma, packaging, food & general engineering plants",
                  "Drawing-based precision work with quality checks at every stage",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium text-foreground md:text-base">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <ArrowLink to="/about">Our full story</ArrowLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core Capabilities — Row-wise layout with hover and animation effects */}
      <section className="blueprint-grid-dark bg-surface py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow="Core Capabilities"
            title="Three Capabilities. One Reliable Vendor."
            description="Industrial fabrication, mechanical assembly and custom gear manufacturing — all under one roof, with BMC machining backing them up."
          />
          <div className="space-y-16 md:space-y-24">
            {coreServices.map((s, idx) => {
              const isEven = idx % 2 === 0;
              let cardImg = s.image;
              if (s.slug === "industrial-fabrication" && cap1Url) cardImg = cap1Url;
              else if (s.slug === "assembly-integration" && cap2Url) cardImg = cap2Url;
              else if (s.slug === "custom-gear-manufacturing" && cap3Url) cardImg = cap3Url;
              return (
                <div
                  key={s.slug}
                  className={cn(
                    "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                    !isEven && "lg:[&>*:first-child]:order-2"
                  )}
                >
                  {/* Image side with sweep mask effect */}
                  <Reveal x={isEven ? -30 : 30} y={0} className="w-full">
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="block group relative overflow-hidden border border-border bg-card shadow-card h-80 sm:h-96"
                    >
                      <ImageReveal className="size-full">
                        <img
                          src={cardImg}
                          alt={s.title}
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      </ImageReveal>
                      <div className="absolute inset-0 bg-navy/20 transition-opacity duration-300 group-hover:bg-navy/10" />
                      {/* Corner accents representing draft marks */}
                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-accent" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-accent" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-accent" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-accent" />
                    </Link>
                  </Reveal>

                  {/* Content side */}
                  <Reveal x={isEven ? 30 : -30} y={0} className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 place-items-center bg-accent text-accent-foreground shadow-lg">
                        <LucideIcon name={s.icon} className="size-6" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">0{idx + 1} · Capability</span>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-black text-navy sm:text-3xl">
                      {s.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {s.overview}
                    </p>
                    <ul className="mt-6 space-y-2">
                      {s.benefits.slice(0, 3).map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5 text-xs font-medium text-foreground sm:text-sm">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        aria-label={`Explore ${s.title} capability`}
                        className="group inline-flex items-center gap-2 border border-navy px-6 py-3 text-xs font-bold uppercase tracking-wider text-navy transition-all duration-300 hover:bg-navy hover:text-navy-foreground"
                      >
                        Explore Capability
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
          <Reveal className="mt-16 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 border border-navy px-8 py-4 text-sm font-bold uppercase tracking-wider text-navy transition-all duration-300 hover:bg-navy hover:text-navy-foreground"
            >
              View All Services
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Industries */}
      <section className="relative overflow-hidden bg-navy py-20 md:py-28">
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <SectionHeader
            dark
            eyebrow="Industries Served"
            title="Trusted by Factories Across the BBN Belt"
            description="From pharma cleanrooms in Baddi to packaging machinery in Barotiwala, our team understands the standards and schedules that matter to your operations."
          />
          <Stagger className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-4">
            {industries.map((ind) => (
              <StaggerItem key={ind.name}>
                <div className="group h-full bg-navy p-6 transition-colors duration-300 hover:bg-navy-light md:p-8">
                  <LucideIcon name={ind.icon} className="size-7 text-accent transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="mt-4 font-display text-base font-bold text-white md:text-lg">{ind.name}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/50 md:text-sm">{ind.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <SectionHeader
                align="left"
                eyebrow="Why MM Engineering"
                title="Practical Fabrication. Reliable Delivery. Local to Baddi."
              />
              <Reveal delay={0.1} className="-mt-6">
                <p className="leading-relaxed text-muted-foreground md:text-lg">
                  We know how much a stopped line costs a plant. That is why our team
                  focuses on clear communication, honest lead times and finished work that
                  matches your drawings — no rework, no schedule surprises.
                </p>
                <div className="img-zoom mt-10 hidden lg:block">
                  <img src={qualityUrl || img.quality} alt="Precision quality inspection at MM Engineering" width={1280} height={960} loading="lazy" className="w-full object-cover" />
                </div>
              </Reveal>
            </div>
            <Stagger className="grid gap-6 sm:grid-cols-2">
              {whyChooseUs.map((w, wIdx) => (
                <StaggerItem
                  key={w.title}
                  className={cn(
                    "flip-card flip-card-hover h-[240px] w-full cursor-pointer",
                    flippedCard === wIdx && "flip-card-active",
                  )}
                >
                  <div 
                    className="flip-card-inner"
                    onClick={() => setFlippedCard(flippedCard === wIdx ? null : wIdx)}
                  >
                    {/* Front Face */}
                    <div className="flip-card-front border border-border bg-card p-7 shadow-card flex flex-col items-center justify-center text-center">
                      <div className="grid size-14 place-items-center bg-navy text-navy-foreground shadow-md">
                        <LucideIcon name={w.icon} className="size-7" />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold text-navy">{w.title}</h3>
                      <span className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-accent animate-pulse">
                        Tap or hover →
                      </span>
                    </div>

                    {/* Back Face */}
                    <div className="flip-card-back border border-accent bg-navy p-6 shadow-card flex flex-col justify-center text-left">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center bg-accent text-accent-foreground">
                          <LucideIcon name={w.icon} className="size-5" />
                        </div>
                        <h3 className="font-display text-base font-bold text-white">{w.title}</h3>
                      </div>
                      <p className="mt-4 text-xs leading-relaxed text-white/80">{w.detail}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Process timeline with scroll-drawn line animation */}
      <ProcessTimelineSection />

      {/* Featured projects */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow="Recent Projects"
            title="Work Delivered for BBN & Northern India Clients"
          />
          <Stagger key={displayProjects.map((p) => p.slug).join(",")} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayProjects.map((p) => (
              <StaggerItem key={p.slug}>
                <div className="card-lift group flex h-full flex-col border border-border bg-card shadow-card">
                  <div className="img-zoom relative h-56">
                    <img src={p.image} alt={p.title} width={1280} height={960} loading="lazy" className="size-full object-cover" />
                    <span className="absolute left-4 top-4 border border-white/20 bg-navy/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      {p.industry}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-lg font-bold text-navy">{p.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                    <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {p.client} · {p.completed}
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12 text-center">
            <ArrowLink to="/projects">See all projects</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow="Workshop Gallery"
            title="Inside Our Baddi Workshop"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {(dbGalleryItems.length > 0 ? dbGalleryItems : galleryItems).slice(0, 8).map((g, i) => (
              <Reveal
                key={i}
                delay={0.05 * i}
                className={cn(
                  "img-zoom relative overflow-hidden",
                  i === 0 && "col-span-2 row-span-2",
                )}
              >
                <img src={g.image} alt={g.title} width={800} height={600} loading="lazy" className="size-full object-cover" />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-white">{g.title}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <ArrowLink to="/gallery">Open full gallery</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow="Client Feedback"
            title="What Plant Heads & Purchase Managers Say"
          />
          <Stagger key={displayTestimonials.map((t) => t.name).join(",")} className="grid gap-6 md:grid-cols-3">
            {displayTestimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="card-lift flex h-full flex-col border border-border bg-card p-7 shadow-card">
                  <Quote className="size-7 text-accent" />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground md:text-base">"{t.quote}"</p>
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="font-display text-sm font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12 text-center">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 border border-border bg-card px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5"
            >
              Read More Reviews & Leave Feedback
              <ArrowRight className="size-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-surface py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Compliance & Trust</span>
            <h2 className="mt-3 font-display text-2xl font-bold text-navy md:text-3xl">
              Registered · Compliant · Quality Focused
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {certifications.map((c) => (
              <StaggerItem key={c.name}>
                <div className="flex h-full flex-col items-center gap-2 border border-border bg-card p-5 text-center shadow-card">
                  <Award className="size-6 text-accent" />
                  <p className="font-display text-sm font-bold text-navy">{c.name}</p>
                  <p className="text-[10px] leading-tight text-muted-foreground">{c.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Blog preview */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow="Latest Insights"
            title="Engineering Notes from Our Team"
          />
          <Stagger key={displayPosts.map((p) => p.slug).join(",")} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {displayPosts.map((b) => (
              <StaggerItem key={b.slug}>
                <Link to="/blog/$slug" params={{ slug: b.slug }} className="card-lift group flex h-full flex-col border border-border bg-card shadow-card">
                  <div className="img-zoom relative h-40">
                    <img src={b.image} alt={b.title} width={800} height={480} loading="lazy" className="size-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{b.category}</span>
                    <h3 className="mt-2 flex-1 font-display text-base font-bold text-navy group-hover:text-accent">{b.title}</h3>
                    <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">{b.date} · {b.readTime || (b as any).read_time}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-6 lg:px-12">
          <SectionHeader eyebrow="FAQ" title="Common Questions from Plants & Purchase Teams" />
          <div>
            {homeFaqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Have a specific requirement?{" "}
              <Link to="/contact" className="font-semibold text-accent hover:underline">
                Contact our team
              </Link>{" "}
              or call {company.phone}.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

