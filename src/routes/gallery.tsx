import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { X, ZoomIn } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { galleryCategories, galleryItems, img } from "@/lib/site-data";
import { CtaSection, Reveal, Breadcrumbs } from "@/components/site/Shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "MM Engineering Workshop Gallery | Fabrication & Machinery Baddi" },
      {
        name: "description",
        content:
          "Tour MM Engineering's manufacturing plant in Baddi, Himachal Pradesh. Gallery of our SS fabrication bays, BMC milling machines, certified welding centers, and completed machine assemblies.",
      },
      { name: "keywords", content: "fabrication workshop images Baddi, engineering facility photos Solan, steel welding shop HP, BMC boring machines gallery" },
      { property: "og:title", content: "MM Engineering Workshop Gallery | Fabrication & Machinery Baddi" },
      { property: "og:description", content: "Tour MM Engineering's manufacturing plant in Baddi, Himachal Pradesh. Gallery of our SS fabrication bays, BMC milling machines, certified welding centers, and completed machine assemblies." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [category, setCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null); // Index in the filtered list
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const [dbGalleryItems, setDbGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadGallery() {
      try {
        const { data } = await supabase
          .from("gallery")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          const formatted = data.map((item, index) => {
            const bentoSizes = ["lg", "sm", "sm", "md", "md", "sm", "lg", "sm", "md", "md"];
            const size = bentoSizes[index % bentoSizes.length];
            return {
              title: item.title,
              image: item.public_url,
              category: item.category || "Facilities",
              size: size
            };
          });
          setDbGalleryItems(formatted);
        }
      } catch (err) {
        console.error("Failed to load gallery from DB:", err);
      }
    }
    loadGallery();
  }, []);

  const displayItems = dbGalleryItems.length > 0 ? dbGalleryItems : galleryItems;
  const filtered = displayItems.filter((g) => category === "All" || g.category === category);

  // Manage Keyboard events for lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === "ArrowRight") {
        setLightbox((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === "Tab") {
        // Simple focus trap: prevent focus from leaving lightbox
        if (lightboxRef.current) {
          const focusables = lightboxRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length > 0) {
            const first = focusables[0] as HTMLElement;
            const last = focusables[focusables.length - 1] as HTMLElement;
            if (e.shiftKey && document.activeElement === first) {
              last.focus();
              e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === last) {
              first.focus();
              e.preventDefault();
            }
          }
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, filtered.length]);

  const openLightbox = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setLightbox(index);
    // Focus the lightbox container or close button shortly after render
    setTimeout(() => {
      const closeBtn = lightboxRef.current?.querySelector("button");
      if (closeBtn) closeBtn.focus();
    }, 50);
  };

  const closeLightbox = () => {
    setLightbox(null);
    // Restore focus
    if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  };

  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <img
          src={img.heroFabrication}
          alt="MM Engineering workshop hero"
          width={1920}
          height={1080}
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
                { label: "Gallery", to: "/gallery" },
              ]}
            />
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
              Steel, Sparks & Precision
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              A look inside our fabrication bays, machine floors, and the projects that leave them.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Category filter */}
          <Reveal className="mb-10 flex flex-wrap gap-2">
            {galleryCategories.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setLightbox(null); }}
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
          </Reveal>

          {/* Bento grid */}
          <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 [grid-auto-rows:180px] md:[grid-auto-rows:220px] grid-flow-dense">
            <AnimatePresence mode="popLayout">
              {filtered.map((g, idx) => {
                return (
                  <motion.button
                    layout
                    key={g.title}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={(e) => openLightbox(idx, e)}
                    className={cn(
                      "img-zoom group relative block overflow-hidden text-left",
                      g.size === "lg" && "col-span-2 row-span-2",
                      g.size === "md" && "col-span-2 md:col-span-2",
                    )}
                  >
                    <img src={g.image} alt={g.title} width={1280} height={960} loading="lazy" className="size-full object-cover" />
                    <div className="absolute inset-0 bg-navy/0 transition-colors duration-500 group-hover:bg-navy/50" />
                    <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <ZoomIn className="size-6 self-end text-white" />
                      <div>
                        <span className="bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                          {g.category}
                        </span>
                        <p className="mt-2 font-display text-sm font-bold text-white">{g.title}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label="Image Lightbox"
            className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/95 p-6 backdrop-blur-sm"
          >
            <button
              aria-label="Close lightbox"
              onClick={closeLightbox}
              className="absolute right-6 top-6 grid size-12 place-items-center border border-white/20 text-white transition-colors hover:border-accent hover:text-accent"
            >
              <X className="size-6" />
            </button>
            
            {/* Navigation controls in lightbox */}
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) => (prev !== null && prev > 0 ? prev - 1 : filtered.length - 1));
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 hidden md:grid size-12 place-items-center border border-white/20 text-white transition-colors hover:border-accent hover:text-accent"
            >
              <span className="text-xl">&larr;</span>
            </button>
            
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                setLightbox((prev) => (prev !== null && prev < filtered.length - 1 ? prev + 1 : 0));
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:grid size-12 place-items-center border border-white/20 text-white transition-colors hover:border-accent hover:text-accent"
            >
              <span className="text-xl">&rarr;</span>
            </button>

            <motion.figure
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-5xl"
            >
              <img
                src={filtered[lightbox].image}
                alt={filtered[lightbox].title}
                width={1280}
                height={960}
                className="max-h-[80vh] w-full object-contain"
              />
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                  {filtered[lightbox].category}
                </span>
                <span className="font-display text-sm font-bold text-white">{filtered[lightbox].title}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <CtaSection />
    </>
  );
}
