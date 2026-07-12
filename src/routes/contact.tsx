import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { company, img, services } from "@/lib/site-data";
import { Reveal, SectionHeader, Stagger, StaggerItem } from "@/components/site/Shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MM Engineering Baddi | Industrial Fabrication HP" },
      {
        name: "description",
        content:
          "Contact MM Engineering in Baddi, Himachal Pradesh for RFQs & drawing submissions. Reach us for SS piping, structural steel, custom gears, and BMC machining in BBN.",
      },
      { name: "keywords", content: "contact MM Engineering Baddi, fabrication RFQ Baddi, steel fabrication quotes Baddi, MM Engineering address Baddi, bypass road Baddi workshop" },
      { property: "og:title", content: "Contact MM Engineering Baddi | Industrial Fabrication HP" },
      { property: "og:description", content: "Get in touch with MM Engineering Baddi for industrial fabrication, custom gears, and precision BMC boring & milling in Solan district, HP." },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact MM Engineering Baddi",
          "description": "Contact and RFQ submission page for MM Engineering, industrial fabrication and precision engineering workshop in Baddi, Himachal Pradesh.",
          "url": "https://www.mmengineeringbaddi.in/contact",
          "mainEntity": {
            "@type": "LocalBusiness",
            "name": "MM Engineering",
            "telephone": "+91 93188 73188",
            "email": "info@mmengineeringbaddi.in",
            "image": "https://www.mmengineeringbaddi.in/og-image.jpg",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Near Simro Dharam Kanta, By Pass Road",
              "addressLocality": "Baddi",
              "addressRegion": "Himachal Pradesh",
              "postalCode": "173205",
              "addressCountry": "IN",
            },
          },
        }),
      },
    ],
  }),
  component: ContactPage,
});

const contactCards = [
  { icon: MapPin, title: "Workshop", lines: [company.address] },
  { icon: Phone, title: "Phone", lines: [company.phone, "WhatsApp available"] },
  { icon: Mail, title: "Email", lines: [company.email, "Drawings & RFQs welcome"] },
  { icon: Clock, title: "Working Hours", lines: [company.hours, "Sundays closed"] },
];

function Field({
  label,
  type = "text",
  textarea = false,
  required = true,
}: {
  label: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const active = focused || value !== "";

  const shared =
    "peer w-full border border-border bg-card px-4 pt-6 pb-2.5 text-sm transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

  return (
    <div className="relative">
      <label
        className={cn(
          "pointer-events-none absolute left-4 transition-all duration-200",
          active ? "text-[10px] font-bold uppercase tracking-wider text-accent" : "text-sm text-muted-foreground",
        )}
        style={{ top: active ? 8 : 18 }}
      >
        {label}
        {required && " *"}
      </label>
      {textarea ? (
        <textarea
          rows={5}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={shared}
        />
      ) : (
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={shared}
        />
      )}
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);

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
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Contact</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
              Talk to Our Team in Baddi.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Send us your drawings or requirement. Our engineering team will review and
              revert with a detailed quotation within 24–48 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`tel:${company.phoneRaw}`}
                className="inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
              >
                <Phone className="size-4" />
                {company.phone}
              </a>
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-white/25 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <MessageCircle className="size-4" />
                WhatsApp Us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact cards */}
      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((c) => (
              <StaggerItem key={c.title}>
                <div className="card-lift h-full border border-border bg-card p-7 shadow-card">
                  <div className="grid size-12 place-items-center bg-navy text-navy-foreground">
                    <c.icon className="size-5" />
                  </div>
                  <h2 className="mt-5 font-display text-lg font-bold text-navy">{c.title}</h2>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {l}
                    </p>
                  ))}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Form + map */}
      <section className="blueprint-grid-dark bg-surface py-20 md:py-28">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-12">
          <div>
            <SectionHeader
              align="left"
              eyebrow="Request a Quote"
              title="Tell Us About Your Requirement"
              description="The more detail you share — drawings, materials, quantities, delivery expectations — the sharper the quotation we can send back."
            />
            {sent ? (
              <Reveal className="border border-accent/30 bg-accent/5 p-10 text-center">
                <Send className="mx-auto size-10 text-accent" />
                <h3 className="mt-4 font-display text-2xl font-bold text-navy">Enquiry Received</h3>
                <p className="mt-2 text-muted-foreground">
                  Thank you. Our engineering team will review your requirement and
                  respond within 24–48 hours.
                </p>
              </Reveal>
            ) : (
              <form
                className="grid gap-5 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field label="Full Name" />
                <Field label="Company Name" />
                <Field label="Work Email" type="email" />
                <Field label="Phone / WhatsApp" type="tel" />
                <div className="sm:col-span-2">
                  <select
                    required
                    defaultValue=""
                    className="w-full border border-border bg-card px-4 py-4 text-sm text-foreground transition-all duration-300 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    <option value="" disabled>
                      Service required *
                    </option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                    <option value="other">Other / Not sure</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Requirement details — dimensions, material, quantity, timeline" textarea />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="group inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/35"
                  >
                    Submit Enquiry
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Map + visit info */}
          <div className="flex flex-col gap-6">
            <Reveal className="relative min-h-80 flex-1 overflow-hidden border border-border bg-navy shadow-card">
              <iframe
                title="MM Engineering location — Baddi, Himachal Pradesh"
                src={company.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="size-full min-h-80 border-0"
              />
            </Reveal>
            <Reveal delay={0.1} className="border-l-4 border-accent bg-card p-7 shadow-card">
              <h3 className="font-display text-lg font-bold text-navy">Visiting Our Workshop?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Our workshop is located near Simro Dharam Kanta, on the By Pass Road in
                Baddi — easily accessible from Barotiwala, Nalagarh and the BBN industrial
                area. Please call ahead to fix a convenient time.
              </p>
              <a
                href={company.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
              >
                Open in Google Maps
                <ArrowRight className="size-3.5" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
