import { motion, useInView, useScroll, useSpring, animate, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, MessageCircle, Phone, icons } from "lucide-react";
import { company, processTimeline } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function LucideIcon({ name, className }: { name: string; className?: string }) {
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } }, hidden: {} }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView) return;
    let isMounted = true;
    const chars = "0123456789X-±.Y_#Z";
    let iteration = 0;

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (!isMounted) return;
        setDisplay(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 30);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
    };
  }, [inView, text, delay]);

  return <span ref={ref}>{display}</span>;
}

export function ImageReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        initial={{ scale: 1.1 }}
        animate={inView ? { scale: 1 } : { scale: 1.1 }}
        transition={{ duration: 1.2, ease: EASE }}
        className="size-full"
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 0.85, ease: [0.77, 0, 0.175, 1] }}
        style={{ transformOrigin: "right" }}
        className="absolute inset-0 z-10 bg-navy"
      />
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <Reveal className={cn("mb-12 max-w-3xl md:mb-16", align === "center" ? "mx-auto text-center" : "")}>
      <div className={cn("mb-4 flex items-center gap-3", align === "center" ? "justify-center" : "")}>
        <span className="h-px w-8 bg-accent" />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          <ScrambleText text={eyebrow} />
        </span>
        {align === "center" && <span className="h-px w-8 bg-accent" />}
      </div>
      <h2
        className={cn(
          "text-balance text-3xl font-bold leading-[1.1] md:text-5xl",
          dark ? "text-navy-foreground" : "text-navy",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed md:text-lg", dark ? "text-navy-foreground/70" : "text-muted-foreground")}>
          {description}
        </p>
      )}
    </Reveal>
  );
}

export function ArrowLink({ to, params, children, dark = false }: { to: string; params?: Record<string, string>; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      to={to as never}
      params={params as never}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider transition-colors",
        dark ? "text-navy-foreground hover:text-accent" : "text-navy hover:text-accent",
      )}
    >
      {children}
      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  );
}

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-20 md:py-28">
      <div className="blueprint-grid absolute inset-0" aria-hidden />
      <div className="absolute -right-32 -top-32 size-96 rounded-full bg-accent/10 blur-3xl" aria-hidden />
      <div className="container relative mx-auto px-6 text-center lg:px-12">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Start Your Project</span>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-bold leading-[1.1] text-navy-foreground md:text-5xl">
            Ready to Build Something That Lasts?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-navy-foreground/70 md:text-lg">
            Send us your drawings and get a detailed quote within 48 hours — reviewed by senior engineers, not a sales script.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 bg-accent px-8 py-4 text-sm font-bold uppercase tracking-wider text-accent-foreground shadow-lg shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/35"
            >
              Request a Quote
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex items-center gap-2 border border-navy-foreground/25 px-8 py-4 text-sm font-bold uppercase tracking-wider text-navy-foreground transition-all duration-300 hover:border-accent hover:text-accent"
            >
              <Phone className="size-4" />
              {company.phone}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
      aria-hidden
    />
  );
}

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <motion.a
        href={`https://wa.me/${company.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.08 }}
        className="grid size-13 place-items-center rounded-full bg-[oklch(0.72_0.17_150)] text-white shadow-lg"
        style={{ width: 52, height: 52 }}
      >
        <MessageCircle className="size-6" />
      </motion.a>
      <motion.button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={false}
        animate={{ scale: showTop ? 1 : 0, opacity: showTop ? 1 : 0 }}
        whileHover={{ scale: 1.08 }}
        className="grid place-items-center rounded-full bg-navy text-navy-foreground shadow-lg"
        style={{ width: 44, height: 44 }}
      >
        <ArrowUp className="size-5" />
      </motion.button>
    </div>
  );
}

export function ProcessTimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="blueprint-grid-dark bg-surface py-20 md:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader
          eyebrow="How We Work"
          title="A Clear Process from Enquiry to Delivery"
          description="Six practical steps — with quality checks and progress updates along the way."
        />
        <div ref={containerRef} className="relative mx-auto max-w-4xl">
          {/* Background vertical line */}
          <div className="absolute bottom-4 left-[27px] top-4 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" aria-hidden />
          {/* Active drawing vertical line */}
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute bottom-4 left-[27px] top-4 w-0.5 bg-accent md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          {processTimeline.map((p, i) => (
            <Reveal
              key={p.phase}
              x={i % 2 === 0 ? -24 : 24}
              y={0}
              delay={0.05 * i}
              className={cn(
                "relative mb-10 flex gap-6 pl-16 md:w-1/2 md:pl-0 last:mb-0",
                i % 2 === 0 ? "md:pr-14 md:text-right" : "md:ml-auto md:pl-14",
              )}
            >
              <div
                className={cn(
                  "absolute left-0 top-0 grid size-14 place-items-center border-2 border-accent bg-background font-display text-sm font-black text-accent z-10",
                  i % 2 === 0 ? "md:left-auto md:-right-7" : "md:-left-7",
                )}
              >
                {p.phase}
              </div>
              <div className="border border-border bg-card p-6 shadow-card transition-colors duration-300 hover:border-accent/40">
                <h3 className="font-display text-lg font-bold text-navy">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; to?: string; params?: any }[];
}) {
  return (
    <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em]" aria-label="Breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={item.label} className="flex items-center gap-2">
            {idx > 0 && <span className="text-white/30">/</span>}
            {isLast || !item.to ? (
              <span className={isLast ? "text-accent" : "text-white/50"}>{item.label}</span>
            ) : (
              <Link
                to={item.to as any}
                params={item.params}
                className="text-white/50 transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
