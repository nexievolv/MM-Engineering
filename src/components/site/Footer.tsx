import { Link } from "@tanstack/react-router";
import { ArrowRight, Linkedin, Mail, MapPin, Phone, Clock } from "lucide-react";
import { company, services } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="blueprint-grid absolute inset-0" aria-hidden />
      <div className="container relative mx-auto px-6 lg:px-12">
        {/* CTA band */}
        <div className="flex flex-col gap-6 border-b border-navy-foreground/10 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold">Have a Drawing or Requirement?</h3>
            <p className="mt-1 text-sm text-navy-foreground/60">
              Send us your drawings via email, WhatsApp or our enquiry form. Quotation within 48 hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all duration-300 hover:-translate-y-0.5"
            >
              Request a Quote <ArrowRight className="size-3.5" />
            </Link>
            <a
              href={`https://wa.me/${company.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border border-navy-foreground/20 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-navy-foreground transition-all duration-300 hover:border-accent hover:text-accent"
            >
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Main columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center bg-accent font-display text-lg font-black text-accent-foreground">M</div>
              <div className="leading-none">
                <span className="block font-display text-lg font-black tracking-tight">MM ENGINEERING</span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.3em] text-navy-foreground/50">
                  Baddi · Himachal Pradesh
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-navy-foreground/60">
              Industrial fabrication and precision engineering services for factories across
              the Baddi–Barotiwala–Nalagarh (BBN) industrial belt and Northern India.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={`https://wa.me/${company.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="grid size-10 place-items-center border border-navy-foreground/15 text-navy-foreground/60 transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <Phone className="size-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="grid size-10 place-items-center border border-navy-foreground/15 text-navy-foreground/60 transition-all duration-300 hover:border-accent hover:text-accent"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-navy-foreground/40">Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="text-sm text-navy-foreground/70 transition-colors hover:text-accent"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-navy-foreground/40">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", to: "/about" },
                { label: "Projects", to: "/projects" },
                { label: "Gallery", to: "/gallery" },
                { label: "Blog", to: "/blog" },
                { label: "Contact", to: "/contact" },
                { label: "All Services", to: "/services" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to as never} className="text-sm text-navy-foreground/70 transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-navy-foreground/40">Contact</h4>
            <ul className="space-y-4 text-sm text-navy-foreground/70">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{company.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-accent" />
                <a href={`tel:${company.phoneRaw}`} className="hover:text-accent">
                  {company.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
                <a href={`mailto:${company.email}`} className="hover:text-accent">
                  {company.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-accent" />
                <span>{company.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-navy-foreground/10 py-6 text-xs text-navy-foreground/40 md:flex-row">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <span>
            Serving Baddi · Barotiwala · Nalagarh · BBN · Solan · Himachal Pradesh
          </span>
        </div>
      </div>
    </footer>
  );
}
