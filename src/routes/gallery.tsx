import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { galleryCategories, galleryItems, img } from "@/lib/site-data";
import { CtaSection, Reveal } from "@/components/site/Shared";
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
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = galleryItems.filter((g) => category === "All" || g.category === category);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <img src={img.heroFabrication} alt="" width={1920} height={1080} className="absolute inset-0 size-full object-cover opacity-25" aria-hidden />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Gallery</span>
            </div>
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
          </Reveal>

          {/* Bento grid */}
          <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 [grid-auto-rows:180px] md:[grid-auto-rows:220px]">
            <AnimatePresence mode="popLayout">
              {filtered.map((g) => {
                const idx = galleryItems.indexOf(g);
                return (
                  <motion.button
                    layout
                    key={g.title}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setLightbox(idx)}
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
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-navy/95 p-6 backdrop-blur-sm"
          >
            <button
              aria-label="Close lightbox"
              className="absolute right-6 top-6 grid size-12 place-items-center border border-white/20 text-white transition-colors hover:border-accent hover:text-accent"
            >
              <X className="size-6" />
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
                src={galleryItems[lightbox].image}
                alt={galleryItems[lightbox].title}
                width={1280}
                height={960}
                className="max-h-[80vh] w-full object-contain"
              />
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                  {galleryItems[lightbox].category}
                </span>
                <span className="font-display text-sm font-bold text-white">{galleryItems[lightbox].title}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>

      <CtaSection />
    </>
  );
}
