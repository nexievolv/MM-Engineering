import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Upload, X, Check, Loader, Filter, FileImage, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  title: string;
  filename: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  page: string | null;
  section: string | null;
  category: string | null;
}

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: { public_url: string; alt_text?: string; title: string }) => void;
}

export function ImagePickerModal({ isOpen, onClose, onSelect }: ImagePickerModalProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPage, setSelectedPage] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse");
  
  // Upload States
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Upload Metadata State
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadPage, setUploadPage] = useState("Blogs");
  const [uploadSection, setUploadSection] = useState("Content");
  const [uploadCategory, setUploadCategory] = useState("Content");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
      setActiveTab("browse");
      setUploadError(null);
      setUploadTitle("");
      setUploadAlt("");
    }
  }, [isOpen]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  // Helper function to compress and convert image to WebP
  const compressToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context is null"));
            return;
          }

          // Max dimension limit for optimization
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Compression failed"));
              }
            },
            "image/webp",
            0.82 // 82% quality compression
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files (JPG, PNG, WEBP) are supported.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // 1. Optimize image & convert to WebP
      const compressedBlob = await compressToWebP(file);
      const filename = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const webpName = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.webp`;
      const storagePath = `gallery/${webpName}`;

      // 2. Upload WebP to Supabase Storage
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(storagePath, compressedBlob, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: true
        });

      if (uploadErr) throw uploadErr;

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(storagePath);

      // 4. Create database record in gallery table
      const title = uploadTitle.trim() || filename;
      const { data: dbData, error: dbErr } = await supabase
        .from("gallery")
        .insert({
          title: title,
          filename: webpName,
          storage_path: storagePath,
          public_url: publicUrl,
          alt_text: uploadAlt.trim() || title,
          page: uploadPage,
          section: uploadSection,
          category: uploadCategory,
          is_published: true,
          show_on_homepage: uploadPage === "Homepage"
        })
        .select();

      if (dbErr) throw dbErr;

      // Reset states and return to browse with the new image loaded
      await fetchImages();
      setActiveTab("browse");
      setUploadTitle("");
      setUploadAlt("");
      
      // Auto select the newly uploaded image
      if (dbData && dbData[0]) {
        onSelect({
          public_url: dbData[0].public_url,
          alt_text: dbData[0].alt_text || undefined,
          title: dbData[0].title
        });
        onClose();
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setUploadError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.filename.toLowerCase().includes(search.toLowerCase()) ||
      (img.alt_text && img.alt_text.toLowerCase().includes(search.toLowerCase()));

    const matchesPage = selectedPage === "All" || img.page === selectedPage;
    const matchesCategory = selectedCategory === "All" || img.category === selectedCategory;

    return matchesSearch && matchesPage && matchesCategory;
  });

  const pages = ["All", "Homepage", "Services", "Blogs", "Projects", "Gallery", "About", "Contact"];
  const categories = ["All", "Cover", "Content", "Gallery", "Icon", "Background"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl h-[85vh] bg-card border border-border flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
          <div>
            <h3 className="font-display text-lg font-bold text-navy uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="size-5 text-accent" /> Media Library
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Select from existing files or upload a new WebP-optimized image</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full transition-colors">
            <X className="size-5 text-muted-foreground hover:text-navy" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-border px-6">
          <button
            onClick={() => setActiveTab("browse")}
            className={cn(
              "px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors",
              activeTab === "browse" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-navy"
            )}
          >
            Browse Gallery ({filteredImages.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={cn(
              "px-5 py-3 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-colors",
              activeTab === "upload" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-navy"
            )}
          >
            Upload New
          </button>
        </div>

        {/* Browse Tab */}
        {activeTab === "browse" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Filters bar */}
            <div className="p-4 bg-muted/10 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Search */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search gallery..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-border bg-background py-2 pl-9 pr-4 text-xs focus:border-accent focus:outline-none"
                />
              </div>

              {/* Tag Dropdowns */}
              <div className="flex w-full md:w-auto items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                  <Filter className="size-3.5" /> Filter:
                </div>
                
                {/* Page */}
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none max-w-[120px]"
                >
                  {pages.map((p) => (
                    <option key={p} value={p}>{p === "All" ? "All Pages" : p}</option>
                  ))}
                </select>

                {/* Category */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none max-w-[120px]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-surface/30">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-card border border-border/60 animate-pulse flex flex-col justify-between p-3">
                      <div className="size-full bg-muted/40 rounded-sm" />
                      <div className="h-3 w-3/4 bg-muted/40 mt-3 rounded-sm" />
                    </div>
                  ))}
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <FileImage className="size-12 text-muted-foreground/40 mb-3" />
                  <h4 className="font-bold text-navy uppercase text-sm">No images found</h4>
                  <p className="text-xs mt-1">Try resetting search filters or upload a new image.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        onSelect({
                          public_url: img.public_url,
                          alt_text: img.alt_text || undefined,
                          title: img.title
                        });
                        onClose();
                      }}
                      className="group relative aspect-square border border-border bg-card shadow-sm hover:border-accent text-left flex flex-col overflow-hidden focus:outline-none card-lift"
                    >
                      <div className="flex-1 relative overflow-hidden bg-muted/20">
                        <img
                          src={img.public_url}
                          alt={img.alt_text || img.title}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-accent text-accent-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow">
                            Select File
                          </span>
                        </div>
                        {img.page && (
                          <span className="absolute left-2 top-2 bg-navy/80 text-white border border-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider rounded-sm backdrop-blur-sm">
                            {img.page}
                          </span>
                        )}
                      </div>
                      <div className="p-2 border-t border-border bg-card">
                        <p className="text-[10px] font-bold text-navy truncate" title={img.title}>
                          {img.title}
                        </p>
                        <p className="text-[8px] text-muted-foreground truncate mt-0.5">
                          {img.filename}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="flex-1 overflow-y-auto p-8 flex flex-col md:grid md:grid-cols-12 md:gap-8 bg-surface/10">
            
            {/* Drag and Drop Zone */}
            <div className="md:col-span-7 flex flex-col justify-center">
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed border-border/80 bg-card rounded-md hover:border-accent hover:bg-muted/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8 min-h-[300px]",
                  dragActive && "border-accent bg-accent/5",
                  uploading && "pointer-events-none opacity-50"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {uploading ? (
                  <div className="space-y-3">
                    <Loader className="size-10 animate-spin text-accent mx-auto" />
                    <p className="text-xs font-bold text-navy uppercase tracking-wider">Optimizing & Uploading to Storage...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid size-14 place-items-center bg-muted mx-auto text-muted-foreground border border-border/60">
                      <Upload className="size-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy uppercase tracking-wider">Drag & Drop Image Here</p>
                      <p className="text-[11px] text-muted-foreground mt-1">or browse files from device</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground/70">Supports JPG, PNG, WEBP (auto-compressed to WebP format)</p>
                  </div>
                )}
              </div>

              {uploadError && (
                <div className="text-xs text-red-600 bg-red-50 border-l-4 border-red-500 p-4 mt-4 font-semibold">
                  {uploadError}
                </div>
              )}
            </div>

            {/* Metadata Fields */}
            <div className="md:col-span-5 border border-border bg-card p-6 rounded-sm shadow-sm space-y-4 mt-6 md:mt-0 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-2 mb-4">
                  Metadata Configuration
                </h4>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                      Image Title (e.g. Hero Banner)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank to use filename"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                      Alt Text / Caption
                    </label>
                    <input
                      type="text"
                      placeholder="Helpful for SEO & Screen Readers"
                      value={uploadAlt}
                      onChange={(e) => setUploadAlt(e.target.value)}
                      className="w-full border border-border bg-background px-3 py-2 text-xs focus:border-accent focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                        Assign to Page
                      </label>
                      <select
                        value={uploadPage}
                        onChange={(e) => setUploadPage(e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none"
                      >
                        {pages.filter(p => p !== "All").map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                        Assign Category
                      </label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none"
                      >
                        {categories.filter(c => c !== "All").map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                        Assign Section Tag
                      </label>
                      <input
                        type="text"
                        placeholder="Hero, About, etc."
                        value={uploadSection}
                        onChange={(e) => setUploadSection(e.target.value)}
                        className="w-full border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border text-[10px] text-muted-foreground leading-relaxed">
                Images are automatically converted to optimized <strong>.webp</strong>, compressed, and resized (max 1200px) before upload to save bandwidth and ensure blazing-fast site load times.
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
