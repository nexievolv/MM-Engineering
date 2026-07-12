import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { company, services } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Projects", to: "/projects" },
  { label: "Gallery", to: "/gallery" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<"services" | null>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(null);
  }, [pathname]);

  const solid = scrolled || mobileOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "bg-background/95 shadow-card backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-18 items-center justify-between gap-4 px-6 lg:px-12" style={{ height: 72 }}>
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <div className="grid size-9 shrink-0 place-items-center bg-accent font-display text-lg font-black text-accent-foreground">
            M
          </div>
          <div className="min-w-0 leading-none">
            <span className={cn("block font-display text-lg font-black tracking-tight", solid ? "text-navy" : "text-white")}>
              MM ENGINEERING
            </span>
            <span className={cn("block text-[9px] font-semibold uppercase tracking-[0.3em]", solid ? "text-steel" : "text-white/60")}>
              Baddi · Himachal Pradesh
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 xl:flex">
          {/* Home Link */}
          <Link
            to="/"
            className={cn("link-underline py-6 text-sm font-semibold", solid ? "text-foreground" : "text-white")}
          >
            Home
          </Link>

          {/* Services dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdown("services")}
            onMouseLeave={() => setDropdown(null)}
          >
            <Link
              to="/services"
              className={cn(
                "link-underline flex items-center gap-1 py-6 text-sm font-semibold",
                solid ? "text-foreground" : "text-white",
              )}
            >
              Services
              <ChevronDown className={cn("size-3.5 transition-transform duration-300", dropdown === "services" && "rotate-180")} />
            </Link>
            <AnimatePresence>
              {dropdown === "services" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-full w-[620px] -translate-x-1/2 border border-border bg-background p-6 shadow-card-hover"
                >
                  <div className="grid grid-cols-2 gap-1">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        to="/services/$slug"
                        params={{ slug: s.slug }}
                        className="group flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-muted"
                      >
                        <span className="text-sm font-semibold text-navy transition-colors group-hover:text-accent">
                          {s.title}
                        </span>
                        <span className="line-clamp-1 text-xs text-muted-foreground">{s.short}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <Link to="/services" className="text-xs font-bold uppercase tracking-wider text-accent hover:underline">
                      View all services →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>



          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to as never}
              className={cn("link-underline py-6 text-sm font-semibold", solid ? "text-foreground" : "text-white")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden items-center gap-3 xl:flex">
          <a
            href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
            className={cn(
              "flex items-center gap-2 text-sm font-semibold transition-colors hover:text-accent",
              solid ? "text-navy" : "text-white",
            )}
          >
            <Phone className="size-4" />
            <span className="hidden 2xl:inline">{company.phone}</span>
          </a>
          <Link
            to="/contact"
            className="bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-accent-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30"
          >
            Request Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
          className={cn("grid size-11 place-items-center xl:hidden", solid ? "text-navy" : "text-white")}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background xl:hidden"
          >
            <nav className="container mx-auto flex max-h-[calc(100vh-80px)] flex-col gap-1 overflow-y-auto px-6 py-6">
              <Link to="/" className="py-3.5 font-display text-lg font-bold text-navy">
                Home
              </Link>
              <Link to="/services" className="py-3.5 font-display text-lg font-bold text-navy">
                Services
              </Link>
              <div className="grid grid-cols-1 gap-1 border-l-2 border-accent/30 pl-4 sm:grid-cols-2">
                {services.slice(0, 6).map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="py-2 text-sm font-medium text-muted-foreground hover:text-accent"
                  >
                    {s.title}
                  </Link>
                ))}
              </div>
              {navLinks.map((l) => (
                <Link key={l.to} to={l.to as never} className="py-3.5 font-display text-lg font-bold text-navy">
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-4 bg-accent px-6 py-4 text-center text-sm font-bold uppercase tracking-wider text-accent-foreground"
              >
                Request Quote
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
