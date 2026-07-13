import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { img, services } from "@/lib/site-data";
import { CtaSection, LucideIcon, Reveal, SectionHeader, Stagger, StaggerItem, Breadcrumbs } from "@/components/site/Shared";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Industrial Fabrication & Engineering Services in Baddi | MM Engineering" },
      {
        name: "description",
        content:
          "Industrial fabrication, structural steel work, assembly & integration, custom gear manufacturing and BMC machining services in Baddi, Barotiwala and Nalagarh — MM Engineering, Himachal Pradesh.",
      },
      { property: "og:title", content: "Industrial Fabrication & Engineering Services in Baddi | MM Engineering" },
      { property: "og:description", content: "Fabrication, structural steel, assembly, gear manufacturing and BMC machining services in Baddi, HP." },
    ],
  }),
  component: ServicesPage,
});



function ServicesPage() {
  return (
    <>
      {/* Page hero */}
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <img
          src={img.workshop}
          alt="MM Engineering workshop services hero"
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
                { label: "Services", to: "/services" },
              ]}
            />
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
              Five Core Capabilities. One Reliable Vendor.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Industrial fabrication, structural steel work, mechanical assembly, custom gear manufacturing and
              BMC machining — delivered from our Baddi workshop for factories across
              the BBN industrial belt and Northern India.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="blueprint-grid-dark bg-surface py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="card-lift group flex h-full flex-col border border-border bg-card shadow-card"
                >
                  <div className="img-zoom relative h-52">
                    <img src={s.image} alt={s.title} width={1280} height={960} loading="lazy" className="size-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-40" />
                    <div className="absolute bottom-4 left-4 grid size-12 place-items-center bg-accent text-accent-foreground shadow-lg">
                      <LucideIcon name={s.icon} className="size-6" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-bold text-navy transition-colors duration-300 group-hover:text-accent">
                      {s.title}
                    </h2>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy transition-colors group-hover:text-accent">
                      View service
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Capability statement */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Capability"
              title="If It's Fabricated or Machined, We Can Build It"
              description="From a single precision shaft to a full SS process skid, our Baddi workshop handles a wide range of industrial metalwork under one roof."
            />
            <Reveal delay={0.1} className="-mt-6 grid grid-cols-2 gap-6">
              {[
                ["MS + SS", "Full material range"],
                ["±0.02 mm", "BMC tolerance"],
                ["5 Ton", "Overhead handling"],
                ["24–48 hr", "Quotation turnaround"],
              ].map(([v, l]) => (
                <div key={l} className="border-l-2 border-accent pl-4">
                  <span className="font-display text-2xl font-black text-navy md:text-3xl">{v}</span>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{l}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal x={30} y={0} className="img-zoom">
            <img src={img.heavyMachinery} alt="Fabrication bay at MM Engineering, Baddi" width={1280} height={960} loading="lazy" className="w-full object-cover" />
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
