import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, 
  Upload, 
  Loader, 
  Trash2, 
  Edit, 
  RefreshCw, 
  Check, 
  X, 
  Filter, 
  FileText,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGalleryPage
});

interface GalleryImage {
  id: string;
  created_at: string;
  title: string;
  filename: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  page: string | null;
  section: string | null;
  category: string | null;
  is_published: boolean;
  show_on_homepage: boolean;
}

function AdminGalleryPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPage, setFilterPage] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  
  // Edit Metadata State
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Upload Metadata Fields
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadPage, setUploadPage] = useState("Gallery");
  const [uploadSection, setUploadSection] = useState("Showcase");
  const [uploadCategory, setUploadCategory] = useState("Gallery");

  // Replacement State
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err: any) {
      console.error("Error loading gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGallery();
    }
  }, [token]);

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
            0.82
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Only images are allowed.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const compressedBlob = await compressToWebP(file);
      const filename = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const webpName = `${filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.webp`;
      const storagePath = `gallery/${webpName}`;

      // Upload to Storage
      const { error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(storagePath, compressedBlob, {
          contentType: "image/webp",
          upsert: true
        });

      if (uploadErr) throw uploadErr;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(storagePath);

      // Create record
      const title = uploadTitle.trim() || filename;
      const { error: dbErr } = await supabase
        .from("gallery")
        .insert({
          title,
          filename: webpName,
          storage_path: storagePath,
          public_url: publicUrl,
          alt_text: uploadAlt.trim() || title,
          page: uploadPage,
          section: uploadSection,
          category: uploadCategory,
          is_published: true,
          show_on_homepage: uploadPage === "Homepage"
        });

      if (dbErr) throw dbErr;

      // Reset Form
      setUploadTitle("");
      setUploadAlt("");
      fetchGallery();
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleReplaceImage = async (file: File, imageToReplace: GalleryImage) => {
    if (!file.type.startsWith("image/")) {
      alert("Only images are allowed.");
      return;
    }

    if (!confirm("Are you sure you want to replace this image? The changes will instantly apply site-wide.")) {
      return;
    }

    setLoading(true);
    try {
      const compressedBlob = await compressToWebP(file);
      
      // Upload/overwrite existing path in Supabase storage
      const { error: uploadErr } = await supabase.storage
        .from("gallery")
        .upload(imageToReplace.storage_path, compressedBlob, {
          contentType: "image/webp",
          upsert: true
        });

      if (uploadErr) throw uploadErr;

      // Since public URL stays the same (same storage path), we just update the updated_at timestamp to bust cache if necessary
      const { error: dbErr } = await supabase
        .from("gallery")
        .update({
          updated_at: new Date().toISOString()
        })
        .eq("id", imageToReplace.id);

      if (dbErr) throw dbErr;

      alert("Image replaced successfully! If you don't see the new image, try clearing your browser cache.");
      fetchGallery();
    } catch (err: any) {
      console.error(err);
      alert("Replacement failed: " + err.message);
    } finally {
      setLoading(false);
      setReplacingId(null);
    }
  };

  const handleDeleteImage = async (img: GalleryImage) => {
    if (!confirm(`Are you sure you want to delete "${img.title}"?\nThis will remove the file from Supabase Storage and the database. It may cause broken image placeholders on pages referencing it.`)) {
      return;
    }

    setLoading(true);
    try {
      // 1. Delete from Supabase Storage
      const { error: storageErr } = await supabase.storage
        .from("gallery")
        .remove([img.storage_path]);

      if (storageErr) {
        console.warn("Storage deletion warning:", storageErr.message);
      }

      // 2. Delete database record
      const { error: dbErr } = await supabase
        .from("gallery")
        .delete()
        .eq("id", img.id);

      if (dbErr) throw dbErr;

      // 3. Clean up other tables to prevent broken links
      // e.g. if this public URL is used as blog cover, null it out
      await supabase
        .from("blog_posts")
        .update({ image_url: null })
        .eq("image_url", img.public_url);

      await supabase
        .from("projects")
        .update({ image_url: "" }) // empty string fallback
        .eq("image_url", img.public_url);



      fetchGallery();
    } catch (err: any) {
      console.error(err);
      alert("Delete failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMetadata = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingImage) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from("gallery")
        .update({
          title: formData.get("title") as string,
          alt_text: formData.get("alt_text") as string,
          page: formData.get("page") as string,
          section: formData.get("section") as string,
          category: formData.get("category") as string
        })
        .eq("id", editingImage.id);

      if (error) throw error;
      setEditingImage(null);
      fetchGallery();
    } catch (err: any) {
      console.error(err);
      alert("Failed to update metadata: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCheckbox = async (img: GalleryImage, field: "is_published" | "show_on_homepage", value: boolean) => {
    try {
      // Optimistic state update
      setImages(prev => prev.map(p => p.id === img.id ? { ...p, [field]: value } : p));
      
      const updatePayload = field === "is_published"
        ? { is_published: value }
        : { show_on_homepage: value };

      const { error } = await supabase
        .from("gallery")
        .update(updatePayload)
        .eq("id", img.id);

      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      // Revert on error
      fetchGallery();
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.filename.toLowerCase().includes(search.toLowerCase()) ||
      (img.alt_text && img.alt_text.toLowerCase().includes(search.toLowerCase()));

    const matchesPage = filterPage === "All" || img.page === filterPage;
    const matchesCategory = filterCategory === "All" || img.category === filterCategory;

    return matchesSearch && matchesPage && matchesCategory;
  });

  const pages = ["All", "Homepage", "Services", "Blogs", "Projects", "Gallery", "About", "Contact"];
  const categories = ["All", "Cover", "Content", "Gallery", "Icon", "Background"];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-navy uppercase tracking-tight">Centralized Media Gallery</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Single source of truth for all images. Optimize and reuse assets across all pages.
          </p>
        </div>
      </div>

      {/* Grid: Upload & Controls */}
      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Upload Container */}
        <div className="lg:col-span-8 border border-border bg-card p-6 rounded-sm shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider mb-4 border-b border-border pb-2">
              Upload New Images
            </h3>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed border-border/80 bg-surface/30 rounded-md hover:border-accent hover:bg-muted/10 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8 min-h-[180px]",
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
                  <Loader className="size-8 animate-spin text-accent mx-auto" />
                  <p className="text-xs font-bold text-navy uppercase tracking-wider">Optimizing & converting to WebP...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="size-6 text-accent mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-navy uppercase tracking-wider">Drag & Drop Image Here</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">or browse files from device</p>
                  </div>
                  <p className="text-[9px] text-muted-foreground/60">Auto-compressed WebP format optimization</p>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="text-xs text-red-600 bg-red-50 border-l-4 border-red-500 p-3 mt-4 font-semibold">
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {/* Upload Metadata Settings */}
        <div className="lg:col-span-4 border border-border bg-card p-6 rounded-sm shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider border-b border-border pb-2 mb-4">
              Upload Configuration
            </h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Title Tag
                </label>
                <input
                  type="text"
                  placeholder="Optional name"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  placeholder="Optional SEO alt description"
                  value={uploadAlt}
                  onChange={(e) => setUploadAlt(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Page
                  </label>
                  <select
                    value={uploadPage}
                    onChange={(e) => setUploadPage(e.target.value)}
                    className="w-full border border-border bg-background px-2 py-2 focus:outline-none focus:border-accent"
                  >
                    {pages.filter(p => p !== "All").map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full border border-border bg-background px-2 py-2 focus:outline-none focus:border-accent"
                  >
                    {categories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Media Grid Section */}
      <div className="border border-border bg-card p-6 shadow-sm space-y-6">
        
        {/* Toolbar controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider">
              Asset Files ({filteredImages.length})
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search */}
            <div className="relative w-full sm:max-w-[200px]">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-border bg-background py-1.5 pl-8 pr-3 text-xs focus:border-accent focus:outline-none"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <select
                value={filterPage}
                onChange={(e) => setFilterPage(e.target.value)}
                className="border border-border bg-background px-2.5 py-1.5 text-xs focus:border-accent focus:outline-none"
              >
                {pages.map((p) => (
                  <option key={p} value={p}>{p === "All" ? "All Pages" : p}</option>
                ))}
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-border bg-background px-2.5 py-1.5 text-xs focus:border-accent focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Loading skeleton */}
        {loading && images.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border border-border/80 p-3 bg-muted/10 animate-pulse flex flex-col justify-between h-56">
                <div className="bg-muted/40 aspect-square w-full rounded-sm" />
                <div className="h-3 w-3/4 bg-muted/40 rounded-sm mt-3" />
                <div className="h-3 w-1/2 bg-muted/40 rounded-sm mt-1.5" />
              </div>
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground flex flex-col items-center">
            <FileText className="size-10 text-muted-foreground/30 mb-2" />
            <p className="text-xs font-bold uppercase text-navy">No media files found</p>
            <p className="text-[11px] mt-0.5">Upload a new image or adjust filters to view files.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="border border-border bg-card shadow-sm flex flex-col justify-between overflow-hidden relative group hover:border-accent transition-colors"
              >
                {/* Image Preview & Hover Actions */}
                <div className="aspect-[4/3] relative overflow-hidden bg-muted/10 border-b border-border">
                  <img
                    src={img.public_url}
                    alt={img.alt_text || img.title}
                    className="size-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Replacer File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={replaceInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0] && replacingId === img.id) {
                        handleReplaceImage(e.target.files[0], img);
                      }
                    }}
                    className="hidden"
                  />

                  {/* Overlays Tags */}
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                    {img.page && (
                      <span className="bg-navy/80 text-white border border-white/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider rounded-sm backdrop-blur-sm">
                        {img.page}
                      </span>
                    )}
                    {img.category && (
                      <span className="bg-accent/80 text-accent-foreground px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm backdrop-blur-sm">
                        {img.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info & Inputs */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-navy truncate" title={img.title}>
                      {img.title}
                    </h4>
                    <p className="text-[9px] text-muted-foreground truncate leading-none">
                      {img.filename}
                    </p>
                    <p className="text-[8px] text-muted-foreground/80 pt-0.5">
                      Uploaded: {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Checkboxes */}
                  <div className="space-y-1.5 pt-2 border-t border-border/80">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={img.is_published}
                        onChange={(e) => handleToggleCheckbox(img, "is_published", e.target.checked)}
                        className="rounded border-border focus:ring-accent size-3 text-accent"
                      />
                      Published
                    </label>

                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-navy cursor-pointer">
                      <input
                        type="checkbox"
                        checked={img.show_on_homepage}
                        onChange={(e) => handleToggleCheckbox(img, "show_on_homepage", e.target.checked)}
                        className="rounded border-border focus:ring-accent size-3 text-accent"
                      />
                      On Homepage
                    </label>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex gap-1.5 pt-3 border-t border-border/60 justify-end">
                    
                    {/* Edit Metadata */}
                    <button
                      onClick={() => setEditingImage(img)}
                      className="p-1.5 border border-border hover:border-accent hover:text-accent rounded-sm transition-colors"
                      title="Edit Metadata"
                    >
                      <Edit className="size-3.5" />
                    </button>

                    {/* Replace File */}
                    <button
                      onClick={() => {
                        setReplacingId(img.id);
                        replaceInputRef.current?.click();
                      }}
                      className="p-1.5 border border-border hover:border-accent hover:text-accent rounded-sm transition-colors"
                      title="Replace Image File"
                    >
                      <RefreshCw className={cn("size-3.5", replacingId === img.id && "animate-spin")} />
                    </button>

                    {/* Delete File */}
                    <button
                      onClick={() => handleDeleteImage(img)}
                      className="p-1.5 border border-border hover:border-red-500 hover:text-red-500 rounded-sm transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 className="size-3.5" />
                    </button>

                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Edit Metadata Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-card border border-border p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <h3 className="font-display text-base font-bold text-navy uppercase tracking-wider">
                Edit Image Metadata
              </h3>
              <button onClick={() => setEditingImage(null)} className="p-1 text-muted-foreground hover:text-navy">
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateMetadata} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                  Image Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingImage.title}
                  className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                  Alt Text
                </label>
                <input
                  type="text"
                  name="alt_text"
                  defaultValue={editingImage.alt_text || ""}
                  className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                    Assign to Page
                  </label>
                  <select
                    name="page"
                    defaultValue={editingImage.page || "Gallery"}
                    className="w-full border border-border bg-background px-2 py-2 focus:outline-none focus:border-accent"
                  >
                    {pages.filter(p => p !== "All").map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingImage.category || "Gallery"}
                    className="w-full border border-border bg-background px-2 py-2 focus:outline-none focus:border-accent"
                  >
                    {categories.filter(c => c !== "All").map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-navy uppercase tracking-wider mb-1.5">
                  Section Tag
                </label>
                <input
                  type="text"
                  name="section"
                  defaultValue={editingImage.section || ""}
                  className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-accent text-accent-foreground py-2.5 font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-accent/90"
              >
                <Save className="size-4" /> Save Configuration
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
