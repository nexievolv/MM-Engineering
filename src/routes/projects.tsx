import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building, Calendar, CheckCircle2 } from "lucide-react";
import { img, projects } from "@/lib/site-data";
import { CtaSection, Reveal, SectionHeader, Stagger, StaggerItem, Breadcrumbs } from "@/components/site/Shared";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Fabrication & Machining Projects in Baddi | Case Studies HP" },
      {
        name: "description",
        content:
          "Explore MM Engineering's track record of 850+ delivered projects: industrial structural steel structures, SS 316L tank farms, packaging OEM programs, and custom gears in Baddi, Himachal Pradesh.",
      },
      { name: "keywords", content: "industrial fabrication projects Baddi, case studies steel fabrication Solan, SS tank farm installation Himachal Pradesh, custom machinery parts BBN" },
      { property: "og:title", content: "Fabrication & Machining Projects in Baddi | Case Studies HP" },
      { property: "og:description", content: "View MM Engineering's track record of over 850 delivered projects including SS piping, custom machinery, and steel platforms in Baddi, Himachal Pradesh." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <img
          src={img.steelStructure}
          alt="MM Engineering structural steel projects hero"
          width={1280}
          height={960}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Projects", to: "/projects" },
              ]}
            />
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
              850+ Projects. One Standard.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              A selection of recent work across the industries we serve — each delivered on schedule,
              with complete quality documentation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="blueprint-grid-dark bg-surface py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <Stagger className="grid gap-8 md:grid-cols-2">
            {projects.map((p, i) => (
              <StaggerItem key={p.slug}>
                <article className="card-lift group flex h-full flex-col border border-border bg-card shadow-card">
                  <div className="img-zoom relative h-72">
                    <img src={p.image} alt={p.title} width={1280} height={960} loading="lazy" className="size-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                    <span className="absolute left-5 top-5 bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                      {p.industry}
                    </span>
                    <div className="absolute bottom-5 left-5 right-5">
                      <h2 className="font-display text-2xl font-bold leading-tight text-white">{p.title}</h2>
                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/60">
                        <span className="flex items-center gap-1.5">
                          <Building className="size-3.5" /> {p.client}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" /> {p.completed}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{p.summary}</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {p.specs.map((s) => (
                        <div key={s} className="flex items-start gap-2 text-xs font-semibold text-foreground">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                          {s}
                        </div>
                      ))}
                    </div>
                    <div className="mt-7 border-t border-border pt-5">
                      <Link
                        to="/contact"
                        className="group/btn inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy transition-colors hover:text-accent"
                      >
                        Request similar case study
                        <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 text-center lg:px-12">
          <SectionHeader
            eyebrow="Your Project Next"
            title="Every Flagship Project Started With a Drawing"
            description="Send us yours. Our engineers will respond with a detailed plan and quote within 48 hours."
          />
          <Reveal>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-navy px-8 py-4 text-sm font-bold uppercase tracking-wider text-navy-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground"
            >
              Start the Conversation
              <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
