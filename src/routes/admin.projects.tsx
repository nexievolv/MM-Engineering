import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader, 
  Trash2, 
  Edit2, 
  Plus, 
  Save, 
  Undo, 
  ImageIcon, 
  FolderPlus, 
  Check, 
  ListPlus, 
  X,
  Calendar,
  Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ImagePickerModal } from "@/components/site/ImagePickerModal";
import { 
  fetchProjectsAdmin, 
  upsertProjectAdmin, 
  deleteProjectAdmin 
} from "@/lib/admin-actions";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjectsPage
});

interface DBProject {
  id: string;
  created_at: string;
  slug: string;
  title: string;
  client: string;
  completed: string;
  industry: string;
  summary: string;
  specs: string[];
  image_url: string;
  active: boolean;
  sort_order: number;
}

function AdminProjectsPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Partial<DBProject> | null>(null);
  const [saving, setSaving] = useState(false);

  // Specifications builder list
  const [specs, setSpecs] = useState<string[]>([]);
  const [newSpecText, setNewSpecText] = useState("");

  // Cover Image Selection
  const [coverUrl, setCoverUrl] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const loadProjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchProjectsAdmin({ data: token });
      setProjects((data || []) as DBProject[]);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [token]);

  // Update builder states when editing project changes
  useEffect(() => {
    if (editingProject) {
      setSpecs(editingProject.specs || []);
      setCoverUrl(editingProject.image_url || "");
    }
  }, [editingProject]);

  const handleEdit = (proj: DBProject) => {
    setEditingProject(proj);
  };

  const handleCreateNew = () => {
    setEditingProject({
      title: "",
      slug: "",
      client: "",
      completed: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      industry: "Pharmaceutical",
      summary: "",
      specs: [],
      image_url: "",
      active: true,
      sort_order: (projects.length + 1) * 10
    });
    setSpecs([]);
    setCoverUrl("");
  };

  const handleAddSpec = () => {
    const text = newSpecText.trim();
    if (!text) return;
    setSpecs(prev => [...prev, text]);
    setNewSpecText("");
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProject) return;

    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const projPayload = {
      ...editingProject,
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      client: formData.get("client") as string,
      completed: formData.get("completed") as string,
      industry: formData.get("industry") as string,
      summary: formData.get("summary") as string,
      sort_order: parseInt(formData.get("sort_order") as string) || 10,
      active: !!formData.get("active"),
      image_url: coverUrl,
      specs: specs
    };

    try {
      await upsertProjectAdmin({ data: { token, project: projPayload } });
      setEditingProject(null);
      loadProjects();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save project: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project permanently?")) return;
    setLoading(true);
    try {
      await deleteProjectAdmin({ data: { token, id } });
      loadProjects();
    } catch (err: any) {
      console.error(err);
      alert("Failed to delete project: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (img: { public_url: string }) => {
    setCoverUrl(img.public_url);
  };

  if (loading && projects.length === 0) {
    return <div className="text-center py-12"><Loader className="size-8 animate-spin mx-auto text-accent" /></div>;
  }

  if (editingProject) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="font-display text-xl font-bold text-navy">
            {editingProject.id ? "Edit Project Details" : "Add New Project"}
          </h2>
          <button
            onClick={() => setEditingProject(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy font-semibold transition-colors"
          >
            <Undo className="size-4" /> Cancel & Return
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-navy mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingProject.title}
                onChange={(e) => {
                  if (!editingProject.id) {
                    const slugVal = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    const slugInput = document.getElementById("project-slug-input") as HTMLInputElement;
                    if (slugInput) slugInput.value = slugVal;
                  }
                }}
                className="w-full border border-border bg-background px-4 py-2.5 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-navy mb-1.5">
                Slug (unique identifier) *
              </label>
              <input
                id="project-slug-input"
                type="text"
                name="slug"
                required
                defaultValue={editingProject.slug}
                className="w-full border border-border bg-background px-4 py-2.5 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-navy mb-1.5">
                Client Name / Organization
              </label>
              <input
                type="text"
                name="client"
                defaultValue={editingProject.client}
                className="w-full border border-border bg-background px-4 py-2.5 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-navy mb-1.5">
                Completion Date / Text (e.g. March 2025)
              </label>
              <input
                type="text"
                name="completed"
                defaultValue={editingProject.completed}
                className="w-full border border-border bg-background px-4 py-2.5 focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-navy mb-1.5">
                Target Industry / Segment
              </label>
              <select
                name="industry"
                defaultValue={editingProject.industry || "Pharmaceutical"}
                className="w-full border border-border bg-background px-4 py-2.5 focus:outline-none focus:border-accent"
              >
                <option value="Pharmaceutical">Pharmaceutical</option>
                <option value="Food Processing">Food Processing</option>
                <option value="Textile">Textile</option>
                <option value="Machine Building">Machine Building</option>
                <option value="Structural Engineering">Structural Engineering</option>
                <option value="Automotive">Automotive</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>

            {/* Image Selector */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-navy mb-1.5">
                Project Cover Image
              </label>
              <div className="flex gap-4 items-center">
                {coverUrl ? (
                  <img src={coverUrl} className="size-16 object-cover border border-border" />
                ) : (
                  <div className="size-16 border border-dashed border-border flex items-center justify-center text-muted-foreground bg-muted/10">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider transition-colors"
                >
                  Choose Image
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-navy mb-1.5">
                Sort Order Number
              </label>
              <input
                type="number"
                name="sort_order"
                defaultValue={editingProject.sort_order || 10}
                className="w-full border border-border bg-background px-4 py-2.5 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 font-bold uppercase tracking-wider text-navy cursor-pointer">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={editingProject.active}
                  className="rounded border-border focus:ring-accent size-3.5 text-accent"
                />
                Active (Shows on Website)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
              Project Summary / Brief Overview *
            </label>
            <textarea
              name="summary"
              rows={3}
              required
              defaultValue={editingProject.summary}
              className="w-full border border-border bg-background px-4 py-2.5 text-xs focus:outline-none focus:border-accent"
            />
          </div>

          {/* Specifications Bullet Points Builder */}
          <div className="border border-border p-5 bg-muted/5 rounded-sm">
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-3">
              Technical Specifications / Key Details
            </label>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add specs detail (e.g. 45 metre SS conveyor line)..."
                value={newSpecText}
                onChange={(e) => setNewSpecText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSpec();
                  }
                }}
                className="flex-1 border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Plus className="size-3.5" /> Add
              </button>
            </div>

            <div className="space-y-1.5">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between bg-card border border-border px-3 py-2 rounded-sm text-xs text-muted-foreground font-semibold">
                  <span className="truncate">{spec}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="text-red-500 hover:text-red-700 p-0.5"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
              {specs.length === 0 && (
                <p className="text-[11px] text-muted-foreground italic">No specifications added yet. Add bullet details above.</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-accent/90"
          >
            {saving ? <Loader className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Project Configuration
          </button>
        </form>

        {/* Reusable Image Picker Modal */}
        <ImagePickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleImageSelect}
        />

      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h2 className="font-display text-xl font-bold text-navy">Projects Case Studies (CMS)</h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-accent/90"
        >
          <FolderPlus className="size-4" /> Add New Project
        </button>
      </div>

      {/* Grid List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <div key={p.id} className="border border-border bg-card shadow-sm flex flex-col justify-between overflow-hidden relative hover:border-accent transition-colors">
            
            {/* Image header */}
            <div className="aspect-video relative overflow-hidden bg-muted/10 border-b border-border">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="size-full object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center text-muted-foreground/30 bg-muted/5">
                  <ImageIcon className="size-8" />
                </div>
              )}
              <span className="absolute top-2 left-2 bg-navy/85 text-white border border-white/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm">
                {p.industry}
              </span>
              {!p.active && (
                <span className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm shadow border border-white">
                  Inactive
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-xs font-bold text-navy line-clamp-1" title={p.title}>{p.title}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{p.summary}</p>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] text-muted-foreground border-t border-border/60 pt-2 font-semibold">
                  <span className="flex items-center gap-1"><Building className="size-3" /> {p.client || "Generic Client"}</span>
                  <span className="flex items-center gap-1"><Calendar className="size-3" /> {p.completed || "N/A"}</span>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex gap-2 justify-end border-t border-border/60 pt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="p-1.5 border border-border hover:border-accent hover:text-accent rounded-sm transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Edit2 className="size-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 border border-border hover:border-red-500 hover:text-red-500 rounded-sm transition-colors text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                >
                  <Trash2 className="size-3.5" /> Delete
                </button>
              </div>
            </div>

          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full border border-dashed border-border/80 rounded-sm p-12 text-center text-muted-foreground">
            <ImageIcon className="size-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs font-bold uppercase text-navy">No database projects found</p>
            <p className="text-[11px] mt-0.5">Click "Add New Project" to add dynamic case studies.</p>
          </div>
        )}
      </div>

    </div>
  );
}
