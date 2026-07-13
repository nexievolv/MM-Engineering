import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader, Trash2, Edit2, Plus, Save, Undo } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { fetchBlogPostsAdmin, upsertBlogPostAdmin, deleteBlogPostAdmin } from "@/lib/admin-actions";
import { img } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/blogs")({
  component: BlogsPage
});

const resolveImage = (imageUrl: string | null | undefined, category: string) => {
  if (!imageUrl || imageUrl.startsWith("/assets/images/") || imageUrl.includes("/placeholder")) {
    switch (category) {
      case "Engineering":
        return img.engineeringDesign;
      case "Quality":
        return img.quality;
      case "Procurement":
        return img.heavyMachinery;
      case "Case Study":
        return img.cnc;
      default:
        return img.workshop;
    }
  }
  return imageUrl;
};

function BlogsPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  // Rich Text Editor State
  const [editorContent, setEditorContent] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    }
  });

  const loadPosts = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogPostsAdmin({ data: token });
      setPosts(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load blog posts. Check your database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [token]);

  // Update editor content when editing post changes
  useEffect(() => {
    if (editingPost && editor) {
      editor.commands.setContent(editingPost.content || "");
      setEditorContent(editingPost.content || "");
    }
  }, [editingPost, editor]);

  const handleEdit = (post: any) => {
    setEditingPost(post);
  };

  const handleCreateNew = () => {
    setEditingPost({
      slug: "",
      title: "",
      category: "Engineering",
      excerpt: "",
      content: "",
      author: "MM Engineering Team",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      read_time: "5 min read",
      image_url: "",
      featured: false,
      published: true,
      show_on_homepage: false
    });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPost) return;
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const postData = {
      ...editingPost,
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      author: formData.get("author") as string,
      date: formData.get("date") as string,
      read_time: formData.get("read_time") as string,
      image_url: formData.get("image_url") as string,
      featured: !!formData.get("featured"),
      published: !!formData.get("published"),
      show_on_homepage: !!formData.get("show_on_homepage"),
      content: editorContent
    };

    try {
      await upsertBlogPostAdmin({ data: { token, post: postData } });
      setEditingPost(null);
      loadPosts();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save article: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post permanently?")) return;
    try {
      await deleteBlogPostAdmin({ data: { token, id } });
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-red-600 bg-red-50 p-6 border-l-4 border-red-500 font-semibold mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={loadPosts}
          className="bg-navy text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12"><Loader className="size-8 animate-spin mx-auto text-accent" /></div>;

  if (editingPost) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="font-display text-xl font-bold text-navy">
            {editingPost.id ? "Edit Blog Post" : "Create New Blog Post"}
          </h2>
          <button
            onClick={() => setEditingPost(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy font-semibold transition-colors"
          >
            <Undo className="size-4" /> Cancel & Return
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={editingPost.title}
                onChange={(e) => {
                  if (!editingPost.id) {
                    const val = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    const slugInput = document.getElementById("blog-slug-input") as HTMLInputElement;
                    if (slugInput) slugInput.value = val;
                  }
                }}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                URL Slug (unique) *
              </label>
              <input
                id="blog-slug-input"
                type="text"
                name="slug"
                required
                defaultValue={editingPost.slug}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Category
              </label>
              <select
                name="category"
                defaultValue={editingPost.category}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Quality">Quality</option>
                <option value="Procurement">Procurement</option>
                <option value="Case Study">Case Study</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Cover Image URL
              </label>
              <input
                type="text"
                name="image_url"
                placeholder="https://..."
                defaultValue={editingPost.image_url}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Author
              </label>
              <input
                type="text"
                name="author"
                defaultValue={editingPost.author}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Publish Date
              </label>
              <input
                type="text"
                name="date"
                defaultValue={editingPost.date}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Read Time Text
              </label>
              <input
                type="text"
                name="read_time"
                defaultValue={editingPost.read_time}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex gap-6 items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  defaultChecked={editingPost.featured}
                  className="rounded border-border focus:ring-accent"
                />
                Featured Article
              </label>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={editingPost.published}
                  className="rounded border-border focus:ring-accent"
                />
                Published Live
              </label>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy cursor-pointer">
                <input
                  type="checkbox"
                  name="show_on_homepage"
                  defaultChecked={editingPost.show_on_homepage}
                  className="rounded border-border focus:ring-accent"
                />
                Show on Homepage
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
              Short Excerpt (shows in post list cards) *
            </label>
            <textarea
              name="excerpt"
              rows={2}
              required
              defaultValue={editingPost.excerpt}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
              Article Rich Text Body
            </label>
            <div className="border border-border bg-background rounded-sm">
              <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("bold") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Bold
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("italic") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Italic
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("underline") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Underline
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("strike") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Strike
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("heading", { level: 3 }) ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("heading", { level: 4 }) ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  H4
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("bulletList") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("orderedList") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Ordered List
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("blockquote") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Blockquote
                </button>
              </div>

              <div className="p-4 prose-industrial min-h-[300px] outline-none">
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-accent/90"
          >
            {saving ? <Loader className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Article
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <h2 className="font-display text-xl font-bold text-navy">Blog Articles (CMS)</h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-accent/90"
        >
          <Plus className="size-4" /> Create New Post
        </button>
      </div>

      <div className="border border-border rounded-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-muted/40 border-b border-border font-bold text-navy">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-muted/20">
                <td className="p-4 font-semibold text-navy">
                  {p.title}
                  {p.featured && (
                    <span className="ml-2 bg-accent/15 text-accent text-[9px] px-2 py-0.5 uppercase font-bold">
                      Featured
                    </span>
                  )}
                  {p.show_on_homepage && (
                    <span className="ml-2 bg-navy/10 text-navy text-[9px] px-2 py-0.5 uppercase font-bold border border-navy/10">
                      Homepage
                    </span>
                  )}
                </td>
                <td className="p-4 uppercase font-semibold text-muted-foreground">{p.category}</td>
                <td className="p-4">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-bold uppercase",
                      p.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {p.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{p.date}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-1.5 border border-border rounded hover:border-accent hover:text-accent transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 border border-border rounded hover:border-red-500 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No database blog posts found. Create one to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
