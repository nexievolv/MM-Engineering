import { createFileRoute } from "@tanstack/react-router";
import { Award, Eye, Flag, HeartHandshake, icons } from "lucide-react";
import { certifications, img, stats } from "@/lib/site-data";
import { Counter, CtaSection, Reveal, SectionHeader, Stagger, StaggerItem } from "@/components/site/Shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About MM Engineering Baddi | Fabrication & Machining Facility" },
      {
        name: "description",
        content:
          "Learn about MM Engineering in Baddi, Himachal Pradesh. Over 15 years of delivering certified industrial fabrication, SS cleanroom equipment, custom gears, and heavy BMC boring & milling for factories in Solan district.",
      },
      { name: "keywords", content: "about MM Engineering, fabrication workshop Baddi, metal fabricator Solan, gear manufacturer Baddi, certified welders Baddi, industrial engineering Himachal Pradesh" },
      { property: "og:title", content: "About MM Engineering Baddi | Fabrication & Machining Facility" },
      { property: "og:description", content: "Over 15 years of delivering certified industrial fabrication, SS cleanroom equipment, custom gears, and heavy BMC boring & milling in Baddi, Himachal Pradesh." },
    ],
  }),
  component: AboutPage,
});

const timeline = [
  { year: "2011", event: "Founded MM Engineering as a fabrication workshop in Baddi, serving local pharma plants." },
  { year: "2015", event: "Expanded capabilities to include stainless steel cleanroom equipment and sanitary piping." },
  { year: "2018", event: "Added custom gear manufacturing division to serve packaging machinery OEMs in the BBN belt." },
  { year: "2021", event: "Upgraded machinery with a BMC boring and milling machine division to handle heavier precision engineering jobs." },
  { year: "2024", event: "Crossed 750 projects delivered to over 100 industrial clients in Himachal Pradesh and Northern India." },
  { year: "2026", event: "MM Engineering is now a leading engineering partner in the BBN belt with a full suite of fabrication, machining, and assembly capabilities." },
];

const values = [
  { icon: "ShieldCheck", title: "Safety First", detail: "We maintain strict workplace safety standards, ensuring zero-incident operations for our fabricators and site teams." },
  { icon: "Ruler", title: "Precision Always", detail: "If the print says ±0.02 mm, we hold ±0.02 mm. Measured, documented, and verified." },
  { icon: "Handshake", title: "Straight Dealing", detail: "Honest lead times, clear material specifications, and transparent project updates from day one." },
  { icon: "MapPin", title: "Local Reliability", detail: "Located in Baddi, allowing us to respond quickly to emergency breakdowns and plant shutdown schedules." },
];

const team = [
  { name: "M. M. Sharma", role: "Founder & MD", detail: "25+ years in industrial manufacturing and structural fabrication; founded MM Engineering." },
  { name: "Anil Sharma", role: "Head of Operations", detail: "Manages fabrication schedules, material sourcing, and quality checks at our Baddi workshop." },
  { name: "Karan Dev", role: "Lead Machinist", detail: "Specialized in BMC boring & milling operations and custom gear manufacturing." },
];

function LucideIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return null;
  return <Icon className={className} />;
}

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <img src={img.factory} alt="" width={1280} height={960} className="absolute inset-0 size-full object-cover opacity-25" aria-hidden />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">About MM Engineering</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
              Engineered for Baddi. Trusted for Quality.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              The story of an engineering partner that refused to cut corners — and grew into the fabrication choice for the BBN industrial belt.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto grid items-center gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-12">
          <div>
            <SectionHeader align="left" eyebrow="Our Story" title="Built on Quality" />
            <Reveal delay={0.1} className="-mt-6 space-y-5 leading-relaxed text-muted-foreground md:text-lg">
              <p>
                MM Engineering started with a simple focus: delivering high-quality, drawing-based fabrication for pharma and packaging factories in Baddi. By ensuring that every weld and dimensional tolerance matched the customer's specifications, we quickly won the trust of major plants in the region.
              </p>
              <p>
                Today, we have grown into a reliable vendor handling structural steel work, custom gear manufacturing, mechanical assembly, and BMC boring & milling machining. We serve clients across the BBN belt (Baddi-Barotiwala-Nalagarh) and Northern India from our facility near Simro Dharam Kanta.
              </p>
            </Reveal>
            <Stagger className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <StaggerItem key={s.label}>
                  <div className="border-l-2 border-accent pl-4">
                    <span className="font-display text-2xl font-black text-navy md:text-3xl">
                      <Counter value={s.value} suffix={s.suffix} />
                    </span>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <Reveal x={30} y={0} className="img-zoom">
            <img src={img.welding} alt="MM Engineering welder at work" width={1280} height={960} loading="lazy" className="w-full object-cover" />
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="blueprint-grid-dark bg-surface py-20 md:py-28">
        <div className="container mx-auto grid gap-8 px-6 md:grid-cols-2 lg:px-12">
          <Reveal className="border-t-4 border-accent bg-navy p-9 shadow-card md:p-12">
            <Flag className="size-9 text-accent" />
            <h2 className="mt-5 font-display text-2xl font-bold text-white md:text-3xl">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              To engineer and fabricate industrial equipment of uncompromising quality — delivered on
              schedule, documented completely, and built to the exact standards of the plants they serve.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="border-t-4 border-navy bg-card p-9 shadow-card md:p-12">
            <Eye className="size-9 text-accent" />
            <h2 className="mt-5 font-display text-2xl font-bold text-navy md:text-3xl">Our Vision</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              To be the most reliable and responsive engineering vendor in Northern India — the first call when a plant needs precision work and guaranteed schedules.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader eyebrow="Values" title="What We Refuse to Compromise" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="card-lift h-full border border-border bg-card p-7 shadow-card">
                  <div className="grid size-12 place-items-center bg-navy text-navy-foreground">
                    <LucideIcon name={v.icon} className="size-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold text-navy">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{v.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden bg-navy py-20 md:py-28">
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <SectionHeader dark eyebrow="Milestones" title="15+ Years of Forward Motion" />
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute bottom-2 left-[13px] top-2 w-px bg-white/15" aria-hidden />
            {timeline.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05} className="relative mb-8 pl-14 last:mb-0">
                <span className="absolute left-0 top-1 grid size-7 place-items-center border-2 border-accent bg-navy" aria-hidden>
                  <span className="size-1.5 bg-accent" />
                </span>
                <span className="font-display text-xl font-black text-accent">{t.year}</span>
                <p className="mt-1 leading-relaxed text-white/75">{t.event}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader
            eyebrow="Infrastructure"
            title="A Campus Built for Heavy Work"
            description="Three fabrication bays, a machining hall, a finishing line, and an inspection lab — all connected, all under our quality system."
          />
          <Stagger className="grid gap-4 md:grid-cols-3">
            {[
              { image: img.workshop, title: "Main Fabrication Hall", detail: "Equipped for sheet metal, pipe & tube, and SS fabrication with heavy structural assembly space" },
              { image: img.cnc, title: "BMC Machining Division", detail: "Boring mills, milling centres, and gear hobbing machines for precision tooling" },
              { image: img.quality, title: "Quality & Passivation", detail: "Dimensional checks, weld inspections, and dedicated stainless steel passivation" },
            ].map((f) => (
              <StaggerItem key={f.title}>
                <div className="img-zoom group relative h-80 overflow-hidden">
                  <img src={f.image} alt={f.title} width={1280} height={960} loading="lazy" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="font-display text-xl font-bold text-white">{f.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{f.detail}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Certifications */}
      <section className="blueprint-grid-dark border-y border-border bg-surface py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader eyebrow="Quality Assurance" title="Certified. Audited. Accountable." />
          <Stagger className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
            {certifications.map((c) => (
              <StaggerItem key={c.name}>
                <div className="flex h-full flex-col items-center gap-2 bg-background p-6 text-center transition-colors duration-300 hover:bg-muted">
                  <Award className="size-7 text-accent" />
                  <span className="font-display text-sm font-bold text-navy">{c.name}</span>
                  <span className="text-[11px] leading-snug text-muted-foreground">{c.detail}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 lg:px-12">
          <SectionHeader eyebrow="Leadership" title="The People Behind the Steel" />
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <StaggerItem key={m.name}>
                <div className={cn("card-lift h-full border border-border p-7 shadow-card", i === 0 ? "bg-navy" : "bg-card")}>
                  <div className={cn("grid size-14 place-items-center font-display text-xl font-black", i === 0 ? "bg-accent text-accent-foreground" : "bg-navy text-navy-foreground")}>
                    {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <h3 className={cn("mt-5 font-display text-lg font-bold", i === 0 ? "text-white" : "text-navy")}>{m.name}</h3>
                  <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-accent">{m.role}</p>
                  <p className={cn("mt-3 text-sm leading-relaxed", i === 0 ? "text-white/60" : "text-muted-foreground")}>{m.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-10 text-center text-sm text-muted-foreground">
            <HeartHandshake className="mx-auto mb-2 size-6 text-accent" />
            Backed by a team of skilled fabricators, certified welders, and BMC operators.
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
