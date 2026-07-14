import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImagePickerModal } from "@/components/site/ImagePickerModal";
import { services as defaultServices } from "@/lib/site-data";
import { 
  Wrench, 
  ImageIcon, 
  Loader, 
  LayoutGrid,
  ChevronRight
} from "lucide-react";

export const Route = createFileRoute("/admin/services")({
  component: AdminServicesPage
});

interface ServiceCover {
  slug: string;
  url: string;
}

function AdminServicesPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  const [loading, setLoading] = useState(true);
  const [serviceCovers, setServiceCovers] = useState<Record<string, string>>({});
  
  // Picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeServiceSlug, setActiveServiceSlug] = useState<string | null>(null);

  const fetchServiceCovers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("page", "Services")
        .eq("category", "Cover")
        .eq("is_published", true);

      if (error) throw error;

      const covers: Record<string, string> = {};
      (data || []).forEach((img) => {
        if (img.section) {
          covers[img.section] = img.public_url;
        }
      });
      
      setServiceCovers(covers);
    } catch (err) {
      console.error("Error loading service covers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchServiceCovers();
    }
  }, [token]);

  const handleOpenPicker = (slug: string) => {
    setActiveServiceSlug(slug);
    setPickerOpen(true);
  };

  const handleSelectImage = async (selected: { public_url: string; title: string }) => {
    if (!activeServiceSlug) return;

    setLoading(true);
    try {
      // 1. Clear any previous image flagged as the cover for this service
      await supabase
        .from("gallery")
        .update({ page: null, section: null, category: null })
        .eq("page", "Services")
        .eq("section", activeServiceSlug)
        .eq("category", "Cover");

      // 2. Set selected image as the cover for this service
      const { error } = await supabase
        .from("gallery")
        .update({
          page: "Services",
          section: activeServiceSlug,
          category: "Cover",
          is_published: true
        })
        .eq("public_url", selected.public_url);

      if (error) throw error;

      alert(`Service cover image updated successfully!`);
      fetchServiceCovers();
    } catch (err: any) {
      console.error(err);
      alert("Failed to map service image: " + err.message);
    } finally {
      setLoading(false);
      setActiveServiceSlug(null);
    }
  };

  if (loading && Object.keys(serviceCovers).length === 0) {
    return <div className="text-center py-12"><Loader className="size-8 animate-spin mx-auto text-accent" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-navy uppercase tracking-tight">Services Editor</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage cover images dynamically for the five core capabilities offered by MM Engineering.
          </p>
        </div>
      </div>

      {/* Services List Grid */}
      <div className="border border-border bg-card p-6 shadow-sm space-y-6">
        <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
          <LayoutGrid className="size-4 text-accent" /> Dynamic Cover Image Configurations
        </h3>

        <div className="space-y-4">
          {defaultServices.map((s) => {
            const dynamicUrl = serviceCovers[s.slug];
            const currentUrl = dynamicUrl || s.image;
            
            return (
              <div
                key={s.slug}
                className="border border-border p-4 rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-muted/5 hover:bg-muted/10 transition-colors text-xs"
              >
                {/* Text Left */}
                <div className="space-y-1 max-w-md">
                  <h4 className="font-bold text-navy flex items-center gap-1.5 uppercase text-sm">
                    {s.title}
                  </h4>
                  <p className="text-muted-foreground line-clamp-1 leading-relaxed">
                    {s.short}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1">
                    Slug identifier: <span className="font-semibold text-navy bg-muted px-1.5 py-0.5 rounded-sm">{s.slug}</span>
                  </p>
                </div>

                {/* Cover Image & Selection Right */}
                <div className="flex items-center gap-4">
                  
                  {/* Preview Container */}
                  <div className="relative">
                    <img
                      src={currentUrl}
                      className="size-16 object-cover border border-border rounded-sm bg-card"
                    />
                    {!dynamicUrl && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-sm border border-white">
                        Fallback Default
                      </span>
                    )}
                    {dynamicUrl && (
                      <span className="absolute -bottom-1 -right-1 bg-green-600 text-white text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-sm border border-white">
                        Live dynamic
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => handleOpenPicker(s.slug)}
                      className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px] transition-colors flex items-center gap-1.5"
                    >
                      Choose Cover Image <ChevronRight className="size-3" />
                    </button>
                    {dynamicUrl && (
                      <button
                        onClick={async () => {
                          if (confirm("Reset to default hardcoded image?")) {
                            setLoading(true);
                            await supabase
                              .from("gallery")
                              .update({ page: null, section: null, category: null })
                              .eq("page", "Services")
                              .eq("section", s.slug)
                              .eq("category", "Cover");
                            fetchServiceCovers();
                          }
                        }}
                        className="text-[9px] text-red-600 hover:underline text-left font-bold uppercase tracking-wider"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Reusable Picker Modal */}
      <ImagePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectImage}
      />

    </div>
  );
}
