import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Search, User } from "lucide-react";
import { useState } from "react";
import { blogPosts, img } from "@/lib/site-data";
import { CtaSection, Reveal, Stagger, StaggerItem } from "@/components/site/Shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Industrial Engineering Blog | Fabrication Insights Baddi" },
      {
        name: "description",
        content:
          "Technical guides on SS 316L mirror polish, pickling & passivation, process piping, BMC milling tolerances, and industrial maintenance tips in Baddi, Himachal Pradesh.",
      },
      { name: "keywords", content: "industrial engineering blog, steel fabrication tips, SS 316L mirror polish Baddi, process piping design HP, machinery maintenance BBN" },
      { property: "og:title", content: "Industrial Engineering Blog | Fabrication Insights Baddi" },
      { property: "og:description", content: "Technical guides on SS 316L mirror polish, pickling & passivation, process piping, BMC milling tolerances, and industrial maintenance tips in Baddi, Himachal Pradesh." },
    ],
  }),
  component: BlogPage,
});

const categories = ["All", "Engineering", "Quality", "Procurement", "Case Study"];

function BlogPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const featured = blogPosts.find((p) => p.featured) ?? blogPosts[0];
  const rest = blogPosts.filter((p) => p !== featured);
  const filtered = rest.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (query === "" || p.title.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <img src={img.engineeringDesign} alt="" width={1280} height={960} className="absolute inset-0 size-full object-cover opacity-25" aria-hidden />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Insights</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
              From the Engineering Desk
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              No marketing fluff. Practical knowledge from the people who cut, weld, and machine for a living.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Controls */}
          <Reveal className="mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300",
                    category === c
                      ? "bg-navy text-navy-foreground"
                      : "border border-border text-muted-foreground hover:border-accent hover:text-accent",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full border border-border bg-card py-3 pl-11 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </Reveal>

          {/* Featured */}
          {category === "All" && query === "" && (
            <Reveal className="mb-12">
              <Link to="/contact" className="group grid overflow-hidden border border-border bg-card shadow-card card-lift lg:grid-cols-2">
                <div className="img-zoom relative min-h-72">
                  <img src={featured.image} alt={featured.title} width={1280} height={960} loading="lazy" className="absolute inset-0 size-full object-cover" />
                  <span className="absolute left-5 top-5 bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                    Featured
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider">
                    <span className="text-accent">{featured.category}</span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" /> {featured.readTime}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold leading-tight text-navy transition-colors group-hover:text-accent md:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{featured.excerpt}</p>
                  <div className="mt-6 flex items-center gap-3 text-sm">
                    <span className="grid size-9 place-items-center bg-navy font-display text-xs font-black text-navy-foreground">
                      {featured.author[0]}
                    </span>
                    <div>
                      <span className="block font-semibold text-navy">{featured.author}</span>
                      <span className="text-xs text-muted-foreground">{featured.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Grid */}
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(category === "All" && query === "" ? rest : filtered).map((b) => (
              <StaggerItem key={b.slug}>
                <Link to="/contact" className="card-lift group flex h-full flex-col border border-border bg-card shadow-card">
                  <div className="img-zoom h-52">
                    <img src={b.image} alt={b.title} width={1280} height={960} loading="lazy" className="size-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider">
                      <span className="text-accent">{b.category}</span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" /> {b.readTime}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy transition-colors group-hover:text-accent">
                      {b.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{b.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <User className="size-3.5" /> {b.author.split(",")[0]}
                      </span>
                      <span>{b.date}</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>

          {filtered.length === 0 && !(category === "All" && query === "") && (
            <p className="py-16 text-center text-muted-foreground">No articles match your search.</p>
          )}

          {/* Pagination */}
          <Reveal className="mt-14 flex items-center justify-center gap-2">
            {["1", "2", "3"].map((p, i) => (
              <button
                key={p}
                className={cn(
                  "grid size-11 place-items-center text-sm font-bold transition-all duration-300",
                  i === 0 ? "bg-navy text-navy-foreground" : "border border-border text-muted-foreground hover:border-accent hover:text-accent",
                )}
              >
                {p}
              </button>
            ))}
            <button className="grid size-11 place-items-center border border-border text-muted-foreground transition-all duration-300 hover:border-accent hover:text-accent">
              <ArrowRight className="size-4" />
            </button>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
