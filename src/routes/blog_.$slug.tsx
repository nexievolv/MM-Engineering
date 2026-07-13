import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { blogPosts, company, img } from "@/lib/site-data";
import { CtaSection, Reveal, SectionHeader, Stagger, StaggerItem } from "@/components/site/Shared";
import { supabase } from "@/integrations/supabase/client";
import { fetchPublishedBlogPosts } from "@/lib/supabase-helpers";

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

export const Route = createFileRoute("/blog_/$slug")({
  loader: async ({ params }) => {
    // 1. Check database first (including drafts)
    const { data: dbPost, error } = await (supabase as any)
      .from("blog_posts")
      .select("*")
      .eq("slug", params.slug)
      .maybeSingle();

    if (dbPost) {
      if (!dbPost.published) {
        throw new Error("Post not found");
      }
      return {
        post: {
          slug: dbPost.slug,
          title: dbPost.title,
          category: dbPost.category,
          excerpt: dbPost.excerpt,
          author: dbPost.author || "MM Engineering Team",
          date: dbPost.date,
          readTime: dbPost.read_time,
          image: resolveImage(dbPost.image_url, dbPost.category),
          content: dbPost.content,
          featured: dbPost.featured,
          published: dbPost.published
        }
      };
    }

    // 2. Fallback to hardcoded posts if not found in database at all
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw new Error("Post not found");
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Blog Post Not Found | MM Engineering" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} | MM Engineering Blog` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            author: { "@type": "Organization", name: post.author },
            datePublished: post.date,
            publisher: {
              "@type": "Organization",
              name: "MM Engineering",
              url: "https://www.mmengineeringbaddi.in",
            },
          }),
        },
      ],
    };
  },
  errorComponent: () => (
    <div className="flex min-h-[60vh] items-center justify-center px-6 pt-24">
      <div className="text-center">
        <h1 className="font-display text-3xl font-black text-navy">Post not found</h1>
        <p className="mt-3 text-muted-foreground">The blog post you're looking for doesn't exist.</p>
        <Link to="/blog" className="mt-6 inline-block bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          Back to Blog
        </Link>
      </div>
    </div>
  ),
  component: BlogDetailPage,
});

function BlogDetailPage() {
  const { post } = Route.useLoaderData();
  const [allPosts, setAllPosts] = useState<any[]>([post]);

  useEffect(() => {
    async function loadAll() {
      try {
        const posts = await fetchPublishedBlogPosts();
        const formatted = posts.map((p: any) => ({
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

        const unique = formatted.length > 0 ? formatted : blogPosts;
        setAllPosts(unique);
      } catch (err) {
        console.error(err);
      }
    }
    loadAll();
  }, [post.slug]);

  const currentIndex = allPosts.findIndex((p) => p.slug === post.slug);
  const related = allPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const next = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-20 pt-40 md:pb-28 md:pt-48">
        <img
          src={post.image}
          alt=""
          width={1280}
          height={960}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover opacity-25"
          aria-hidden
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <Reveal>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" aria-label="Breadcrumb">
              <Link to="/" className="text-white/50 transition-colors hover:text-accent">Home</Link>
              <span className="text-white/30">/</span>
              <Link to="/blog" className="text-white/50 transition-colors hover:text-accent">Blog</Link>
              <span className="text-white/30">/</span>
              <span className="text-accent line-clamp-1">{post.title}</span>
            </nav>
            <div className="mt-6 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider">
              <span className="bg-accent px-3 py-1 text-accent-foreground">{post.category}</span>
              <span className="flex items-center gap-1.5 text-white/60">
                <Clock className="size-3.5" /> {post.readTime}
              </span>
              <span className="flex items-center gap-1.5 text-white/60">
                <Calendar className="size-3.5" /> {post.date}
              </span>
            </div>
            <h1 className="mt-5 max-w-4xl text-balance font-display text-3xl font-black leading-[1.1] text-white md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex items-center gap-3">
              <span className="grid size-10 place-items-center bg-accent font-display text-sm font-black text-accent-foreground">
                {post.author[0]}
              </span>
              <div>
                <span className="block text-sm font-semibold text-white">{post.author}</span>
                <span className="text-xs text-white/50">MM Engineering, Baddi</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-[1fr_320px] lg:px-12">
          <article className="prose-industrial">
            <Reveal>
              <div className="relative mb-10 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  width={1280}
                  height={720}
                  className="aspect-video w-full object-cover"
                />
              </div>

              <p className="text-lg leading-relaxed text-foreground font-semibold mb-6">{post.excerpt}</p>

              {post.content ? (
                <div 
                  className="prose-industrial mt-8 space-y-6 text-base leading-relaxed text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              ) : (
                <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
                  <p>
                    This article is part of our ongoing series of practical engineering and procurement guides written for plant heads, purchase managers, and maintenance teams working in the Baddi–Barotiwala–Nalagarh industrial belt.
                  </p>
                  <p>
                    At MM Engineering, we believe that sharing technical knowledge — the kind that helps you specify materials correctly, set realistic tolerances, and plan your projects better — builds stronger partnerships with the factories we serve.
                  </p>
                  <p>
                    Whether you are planning a new fabrication project, evaluating material options for your next equipment order, or looking to understand the engineering behind what we deliver, our blog aims to give you clear, jargon-free information you can act on.
                  </p>
                  <div className="border-l-4 border-accent bg-accent/5 p-6">
                    <p className="font-semibold text-navy">
                      Need help with a specific fabrication or machining requirement? Our engineers are happy to discuss your project requirements over a call or at our workshop.
                    </p>
                  </div>
                  <p>
                    For detailed discussions on any topic covered in our articles — or to request a topic we haven't covered yet — reach us at{" "}
                    <a href={`mailto:${company.email}`} className="font-semibold text-accent hover:underline">{company.email}</a>{" "}
                    or call <a href={`tel:${company.phoneRaw}`} className="font-semibold text-accent hover:underline">{company.phone}</a>.
                  </p>
                </div>
              )}

              {/* Tags */}
              <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags:</span>
                <span className="bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{post.category}</span>
                <span className="bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Baddi</span>
                <span className="bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">BBN Belt</span>
                <span className="bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Industrial Fabrication</span>
              </div>

              {/* Prev / Next navigation */}
              <div className="mt-10 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
                {prev ? (
                  <Link
                    to="/blog/$slug"
                    params={{ slug: prev.slug }}
                    className="group flex items-start gap-3 p-4 border border-border transition-colors hover:border-accent"
                  >
                    <ArrowLeft className="mt-1 size-4 shrink-0 text-accent" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Previous</span>
                      <p className="mt-1 text-sm font-semibold text-navy transition-colors group-hover:text-accent line-clamp-2">{prev.title}</p>
                    </div>
                  </Link>
                ) : <div />}
                {next ? (
                  <Link
                    to="/blog/$slug"
                    params={{ slug: next.slug }}
                    className="group flex items-start gap-3 p-4 border border-border text-right transition-colors hover:border-accent sm:flex-row-reverse"
                  >
                    <ArrowRight className="mt-1 size-4 shrink-0 text-accent" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Next</span>
                      <p className="mt-1 text-sm font-semibold text-navy transition-colors group-hover:text-accent line-clamp-2">{next.title}</p>
                    </div>
                  </Link>
                ) : <div />}
              </div>
            </Reveal>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <Reveal delay={0.1}>
              <div className="border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-bold text-navy">About the Author</h3>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid size-12 place-items-center bg-navy font-display text-lg font-black text-navy-foreground">M</span>
                  <div>
                    <p className="font-semibold text-navy">{post.author}</p>
                    <p className="text-xs text-muted-foreground">Engineering team at MM Engineering, Baddi</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Practical fabrication and engineering insights from our workshop in the BBN industrial belt. Written by the people who do the work.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="border border-accent/30 bg-accent/5 p-6">
                <h3 className="font-display text-lg font-bold text-navy">Need a Quote?</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us your drawings and get a detailed quotation within 48 hours.
                </p>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-2 bg-accent px-5 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
                >
                  Request Quote <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </Reveal>

            {related.length > 0 && (
              <Reveal delay={0.2}>
                <div className="border border-border bg-card p-6 shadow-card">
                  <h3 className="font-display text-lg font-bold text-navy">Related Articles</h3>
                  <div className="mt-4 space-y-4">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        to="/blog/$slug"
                        params={{ slug: r.slug }}
                        className="group block border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent">{r.category}</span>
                        <p className="mt-1 text-sm font-semibold text-navy transition-colors group-hover:text-accent line-clamp-2">{r.title}</p>
                        <span className="mt-1 text-xs text-muted-foreground">{r.date}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </aside>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
