import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCircle2, ChevronDown, Cog, Layers } from "lucide-react";
import { useState } from "react";
import { services, type Service } from "@/lib/site-data";
import { CtaSection, LucideIcon, Reveal, SectionHeader, Stagger, StaggerItem, Breadcrumbs } from "@/components/site/Shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service Not Found | MM Engineering" }, { name: "robots", content: "noindex" }] };
    }
    const { service } = loaderData;
    return {
      meta: [
        { title: service.seoTitle },
        { name: "description", content: service.seoDescription },
        { property: "og:title", content: service.seoTitle },
        { property: "og:description", content: service.seoDescription },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: service.title,
            description: service.overview,
            provider: {
              "@type": "LocalBusiness",
              name: "MM Engineering",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Baddi",
                addressRegion: "Himachal Pradesh",
                addressCountry: "IN",
              },
            },
            areaServed: ["Baddi", "Barotiwala", "Nalagarh", "Solan", "Himachal Pradesh"],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  errorComponent: ServiceError,
  component: ServiceDetailPage,
});

function ServiceNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 pt-24">
      <div className="text-center">
        <h1 className="font-display text-3xl font-black text-navy">Service not found</h1>
        <p className="mt-3 text-muted-foreground">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="mt-6 inline-block bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          View all services
        </Link>
      </div>
    </div>
  );
}

function ServiceError() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6 pt-24">
      <div className="text-center">
        <h1 className="font-display text-3xl font-black text-navy">Something went wrong</h1>
        <Link to="/services" className="mt-6 inline-block bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          Back to services
        </Link>
      </div>
    </div>
  );
}



function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border bg-card">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <span className="font-display text-base font-bold text-navy">{q}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-accent transition-transform duration-300", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ServiceDetailPage() {
  const { service } = Route.useLoaderData() as { service: Service };
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      {/* Hero banner */}
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <img
          src={service.image}
          alt={service.title}
          width={1280}
          height={960}
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover opacity-30"
          aria-hidden
        />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: service.title, to: "/services/$slug", params: { slug: service.slug } },
              ]}
            />
            <div className="mt-6 flex items-start gap-5">
              <div className="grid size-14 shrink-0 place-items-center bg-accent text-accent-foreground md:size-16">
                <LucideIcon name={service.icon} className="size-7 md:size-8" />
              </div>
              <h1 className="text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
                {service.title}
              </h1>
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{service.short}</p>
          </Reveal>
        </div>
      </section>

      {/* Overview + benefits */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto grid items-start gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div>
            <SectionHeader align="left" eyebrow="Overview" title={`${service.title}, Done Right`} />
            <Reveal delay={0.1} className="-mt-6">
              <p className="leading-relaxed text-muted-foreground md:text-lg">{service.overview}</p>
              <ul className="mt-8 space-y-3.5">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm font-medium md:text-base">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal x={30} y={0} className="img-zoom lg:sticky lg:top-28">
            <img src={service.image} alt={service.title} width={1280} height={960} loading="lazy" className="w-full object-cover" />
          </Reveal>
        </div>
      </section>

      {/* Fabrication types (only for Industrial Fabrication) */}
      {service.fabricationTypes && service.fabricationTypes.length > 0 && (
        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-6 lg:px-12">
            <SectionHeader
              eyebrow="Types of Fabrication We Provide"
              title="Sheet Metal, Pipe & Tube, Stainless Steel, and Custom Fabrication"
              description="Under our Industrial Fabrication service, we cover specialised fabrication types — each with dedicated skills, materials, and quality controls."
            />
            <div className="space-y-16 md:space-y-24">
              {service.fabricationTypes.map((ft, i) => (
                <div
                  key={ft.slug}
                  className={cn(
                    "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
                    i % 2 === 1 && "lg:[&>*:first-child]:order-2",
                  )}
                >
                  <Reveal x={i % 2 === 0 ? -24 : 24} y={0} className="img-zoom">
                    <img
                      src={ft.image}
                      alt={`${ft.title} at MM Engineering, Baddi`}
                      width={1280}
                      height={960}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </Reveal>
                  <Reveal delay={0.1}>
                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                      0{i + 1} · Fabrication Type
                    </span>
                    <h3 className="mt-3 font-display text-2xl font-bold text-navy md:text-3xl">
                      {ft.title}
                    </h3>
                    <p className="mt-4 leading-relaxed text-muted-foreground">{ft.description}</p>
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-navy">Applications</h4>
                        <ul className="mt-2 space-y-1.5">
                          {ft.applications.map((a) => (
                            <li key={a} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="mt-2 size-1 shrink-0 bg-accent" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-navy">Materials Used</h4>
                        <ul className="mt-2 space-y-1.5">
                          {ft.materials.map((m) => (
                            <li key={m} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="mt-2 size-1 shrink-0 bg-accent" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-navy">Industries Served</h4>
                        <ul className="mt-2 space-y-1.5">
                          {ft.industries.map((ind) => (
                            <li key={ind} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="mt-2 size-1 shrink-0 bg-accent" />
                              {ind}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-navy">Process Overview</h4>
                        <ul className="mt-2 space-y-1.5">
                          {ft.process.map((p) => (
                            <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                              <span className="mt-2 size-1 shrink-0 bg-accent" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Applications & industries */}
      <section className="blueprint-grid-dark bg-surface py-20 md:py-28">
        <div className="container mx-auto grid gap-10 px-6 md:grid-cols-2 lg:px-12">
          <Reveal className="border border-border bg-card p-8 shadow-card md:p-10">
            <Cog className="size-8 text-accent" />
            <h2 className="mt-4 font-display text-2xl font-bold text-navy">Applications</h2>
            <ul className="mt-6 space-y-3">
              {service.applications.map((a) => (
                <li key={a} className="flex items-center gap-3 border-b border-border pb-3 text-sm font-medium">
                  <span className="size-1.5 shrink-0 bg-accent" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="border border-border bg-navy p-8 shadow-card md:p-10">
            <Layers className="size-8 text-accent" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">Industries Served</h2>
            <ul className="mt-6 space-y-3">
              {service.industries.map((i) => (
                <li key={i} className="flex items-center gap-3 border-b border-white/10 pb-3 text-sm font-medium text-white/80">
                  <span className="size-1.5 shrink-0 bg-accent" />
                  {i}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader eyebrow="Process" title="From Drawing to Delivery" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {service.process.map((p, i) => (
              <StaggerItem key={p.step}>
                <div className="relative h-full border border-border bg-card p-6 shadow-card">
                  <span className="font-display text-3xl font-black text-accent/25">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-base font-bold text-navy">{p.step}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Equipment & materials */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto grid gap-10 px-6 md:grid-cols-2 lg:px-12">
          <div>
            <SectionHeader align="left" eyebrow="Equipment" title="What We Run" />
            <Stagger className="-mt-4 grid gap-3">
              {service.equipment.map((e) => (
                <StaggerItem key={e}>
                  <div className="flex items-center gap-4 border border-border bg-card px-5 py-4 shadow-card transition-transform duration-300 hover:translate-x-1">
                    <span className="grid size-8 shrink-0 place-items-center bg-navy text-xs font-black text-white">✓</span>
                    <span className="text-sm font-semibold text-foreground">{e}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <SectionHeader align="left" eyebrow="Materials" title="What We Work With" />
            <Stagger className="-mt-4 grid gap-3">
              {service.materials.map((m) => (
                <StaggerItem key={m}>
                  <div className="flex items-center gap-4 border border-border bg-card px-5 py-4 shadow-card transition-transform duration-300 hover:translate-x-1">
                    <span className="grid size-8 shrink-0 place-items-center bg-accent text-xs font-black text-accent-foreground">▣</span>
                    <span className="text-sm font-semibold text-foreground">{m}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto max-w-3xl px-6 lg:px-12">
          <SectionHeader eyebrow="FAQ" title="Common Questions" />
          <div className="space-y-4">
            {service.faqs.map((f) => (
              <Faq key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Related services */}
      <section className="bg-surface py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader eyebrow="Related" title="Explore More Capabilities" />
          <Stagger className="grid gap-6 md:grid-cols-3">
            {related.map((s) => (
              <StaggerItem key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="card-lift group flex h-full flex-col border border-border bg-card p-7 shadow-card"
                >
                  <div className="grid size-12 place-items-center bg-navy text-navy-foreground transition-colors duration-300 group-hover:bg-accent">
                    <LucideIcon name={s.icon} className="size-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy transition-colors group-hover:text-accent">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy group-hover:text-accent">
                    View service
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
