import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImagePickerModal } from "@/components/site/ImagePickerModal";
import { 
  Home, 
  ImageIcon, 
  Save, 
  Loader, 
  Layout, 
  HelpCircle,
  Eye
} from "lucide-react";

export const Route = createFileRoute("/admin/homepage")({
  component: AdminHomepagePage
});

interface HomepageSlots {
  hero: string;
  about: string;
  capability1: string; // industrial-fabrication
  capability2: string; // assembly-integration
  capability3: string; // custom-gear-manufacturing
  quality: string;
}

function AdminHomepagePage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  const [loading, setLoading] = useState(true);
  
  // Current values
  const [slots, setSlots] = useState<HomepageSlots>({
    hero: "",
    about: "",
    capability1: "",
    capability2: "",
    capability3: "",
    quality: ""
  });

  // Showcase list
  const [showcaseImages, setShowcaseImages] = useState<any[]>([]);

  // Picker states
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<keyof HomepageSlots | null>(null);

  const loadHomepageData = async () => {
    setLoading(true);
    try {
      // 1. Fetch images mapped to specific slots
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .eq("is_published", true);

      if (error) throw error;

      const newSlots: HomepageSlots = {
        hero: "",
        about: "",
        capability1: "",
        capability2: "",
        capability3: "",
        quality: ""
      };

      const showcase: any[] = [];

      (data || []).forEach((img) => {
        // Map slots
        if (img.page === "Homepage" && img.section === "Hero" && img.category === "Cover") {
          newSlots.hero = img.public_url;
        } else if (img.page === "About" && img.section === "Overview" && img.category === "Cover") {
          newSlots.about = img.public_url;
        } else if (img.page === "Homepage" && img.section === "Capabilities" && img.category === "industrial-fabrication") {
          newSlots.capability1 = img.public_url;
        } else if (img.page === "Homepage" && img.section === "Capabilities" && img.category === "assembly-integration") {
          newSlots.capability2 = img.public_url;
        } else if (img.page === "Homepage" && img.section === "Capabilities" && img.category === "custom-gear-manufacturing") {
          newSlots.capability3 = img.public_url;
        } else if (img.page === "Homepage" && img.section === "Quality" && img.category === "Cover") {
          newSlots.quality = img.public_url;
        }

        // Showcase list (show on homepage flag)
        if (img.show_on_homepage) {
          showcase.push(img);
        }
      });

      setSlots(newSlots);
      setShowcaseImages(showcase);
    } catch (err) {
      console.error("Error loading homepage slot configuration:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadHomepageData();
    }
  }, [token]);

  const handleOpenPicker = (slot: keyof HomepageSlots) => {
    setActiveSlot(slot);
    setPickerOpen(true);
  };

  const handleSelectImage = async (selected: { public_url: string; title: string }) => {
    if (!activeSlot) return;

    setLoading(true);
    try {
      // 1. Identify parameters for target slot
      let page = "Homepage";
      let section = "";
      let category = "Cover";

      switch (activeSlot) {
        case "hero":
          section = "Hero";
          break;
        case "about":
          page = "About";
          section = "Overview";
          break;
        case "capability1":
          section = "Capabilities";
          category = "industrial-fabrication";
          break;
        case "capability2":
          section = "Capabilities";
          category = "assembly-integration";
          break;
        case "capability3":
          section = "Capabilities";
          category = "custom-gear-manufacturing";
          break;
        case "quality":
          section = "Quality";
          break;
      }

      // 2. Clear previous images mapped to this slot to avoid duplicates
      await supabase
        .from("gallery")
        .update({ page: null, section: null, category: null })
        .eq("page", page)
        .eq("section", section)
        .eq("category", category);

      // 3. Map selected image to target slot
      const { error } = await supabase
        .from("gallery")
        .update({ page, section, category, show_on_homepage: page === "Homepage" })
        .eq("public_url", selected.public_url);

      if (error) throw error;

      alert(`Homepage slot "${activeSlot}" updated successfully!`);
      loadHomepageData();
    } catch (err: any) {
      console.error(err);
      alert("Failed to map image: " + err.message);
    } finally {
      setLoading(false);
      setActiveSlot(null);
    }
  };

  const handleRemoveFromShowcase = async (imgId: string) => {
    try {
      // Optimistic update
      setShowcaseImages(prev => prev.filter(p => p.id !== imgId));

      const { error } = await supabase
        .from("gallery")
        .update({ show_on_homepage: false })
        .eq("id", imgId);

      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      loadHomepageData();
    }
  };

  if (loading && showcaseImages.length === 0) {
    return <div className="text-center py-12"><Loader className="size-8 animate-spin mx-auto text-accent" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-navy uppercase tracking-tight">Homepage Image Editor</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Map images from the central gallery to specific layout positions on the public landing page.
          </p>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* Left: Slot Mapping */}
        <div className="border border-border bg-card p-6 rounded-sm shadow-sm space-y-6">
          <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
            <Layout className="size-4 text-accent" /> Layout Position Mapping
          </h3>

          <div className="space-y-5 text-xs">
            
            {/* Slot 1: Hero Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b border-border/60 pb-4">
              <div className="space-y-0.5">
                <p className="font-bold text-navy uppercase">Hero Background Image</p>
                <p className="text-[10px] text-muted-foreground">Appears in background of main title banner.</p>
              </div>
              <div className="flex items-center gap-3">
                {slots.hero && (
                  <img src={slots.hero} className="size-12 object-cover border border-border" />
                )}
                <button
                  onClick={() => handleOpenPicker("hero")}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {/* Slot 2: About Image */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b border-border/60 pb-4">
              <div className="space-y-0.5">
                <p className="font-bold text-navy uppercase">About Section Image</p>
                <p className="text-[10px] text-muted-foreground">Inspection/Workshop image next to standard story.</p>
              </div>
              <div className="flex items-center gap-3">
                {slots.about && (
                  <img src={slots.about} className="size-12 object-cover border border-border" />
                )}
                <button
                  onClick={() => handleOpenPicker("about")}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {/* Slot 3: Capability 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b border-border/60 pb-4">
              <div className="space-y-0.5">
                <p className="font-bold text-navy uppercase">Industrial Fabrication</p>
                <p className="text-[10px] text-muted-foreground">Image for Capability Card 1.</p>
              </div>
              <div className="flex items-center gap-3">
                {slots.capability1 && (
                  <img src={slots.capability1} className="size-12 object-cover border border-border" />
                )}
                <button
                  onClick={() => handleOpenPicker("capability1")}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {/* Slot 4: Capability 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b border-border/60 pb-4">
              <div className="space-y-0.5">
                <p className="font-bold text-navy uppercase">Assembly & Integration</p>
                <p className="text-[10px] text-muted-foreground">Image for Capability Card 2.</p>
              </div>
              <div className="flex items-center gap-3">
                {slots.capability2 && (
                  <img src={slots.capability2} className="size-12 object-cover border border-border" />
                )}
                <button
                  onClick={() => handleOpenPicker("capability2")}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {/* Slot 5: Capability 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between border-b border-border/60 pb-4">
              <div className="space-y-0.5">
                <p className="font-bold text-navy uppercase">Custom Gear Manufacturing</p>
                <p className="text-[10px] text-muted-foreground">Image for Capability Card 3.</p>
              </div>
              <div className="flex items-center gap-3">
                {slots.capability3 && (
                  <img src={slots.capability3} className="size-12 object-cover border border-border" />
                )}
                <button
                  onClick={() => handleOpenPicker("capability3")}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>

            {/* Slot 6: Quality Inspection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between pb-2">
              <div className="space-y-0.5">
                <p className="font-bold text-navy uppercase">Quality Section Image</p>
                <p className="text-[10px] text-muted-foreground">Side image showing precision checks.</p>
              </div>
              <div className="flex items-center gap-3">
                {slots.quality && (
                  <img src={slots.quality} className="size-12 object-cover border border-border" />
                )}
                <button
                  onClick={() => handleOpenPicker("quality")}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px] transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Showcase / Homepage Gallery */}
        <div className="border border-border bg-card p-6 rounded-sm shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-2 flex items-center gap-2">
              <Eye className="size-4 text-accent" /> Homepage Gallery Showcase
            </h3>
            <p className="text-[11px] text-muted-foreground mt-2 mb-4 leading-relaxed">
              These images are flagged with <strong>Show on Homepage</strong>. They will render in the workshop grid overview section. To add new ones, go to the <strong>Media Gallery</strong> tab and check "On Homepage".
            </p>

            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {showcaseImages.map((img) => (
                <div key={img.id} className="relative aspect-video border border-border rounded-sm overflow-hidden group">
                  <img src={img.public_url} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white text-xs">
                    <p className="font-bold truncate">{img.title}</p>
                    <button
                      onClick={() => handleRemoveFromShowcase(img.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider py-1 text-[9px] rounded-sm transition-colors"
                    >
                      Remove from Homepage
                    </button>
                  </div>
                </div>
              ))}
              {showcaseImages.length === 0 && (
                <div className="col-span-2 py-16 text-center text-xs text-muted-foreground bg-surface/30 border border-dashed border-border/80 flex flex-col items-center justify-center">
                  <ImageIcon className="size-8 text-muted-foreground/30 mb-2" />
                  No showcase images selected.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Picker Modal */}
      <ImagePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectImage}
      />

    </div>
  );
}
