import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Loader, 
  Trash2, 
  Edit2, 
  Plus, 
  Save, 
  Undo, 
  ImageIcon, 
  Link as LinkIcon, 
  Table as TableIcon, 
  Columns, 
  ChevronRight, 
  CornerDownRight, 
  Image as ImageIconLucide, 
  FileText,
  X
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Link as TiptapLink } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image as TiptapImage } from "@tiptap/extension-image";

import { fetchBlogPostsAdmin, upsertBlogPostAdmin, deleteBlogPostAdmin } from "@/lib/admin-actions";
import { img } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { ImagePickerModal } from "@/components/site/ImagePickerModal";

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

  // Cover Image State
  const [coverUrl, setCoverUrl] = useState("");

  // Reusable Image Picker Modal States
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"cover" | "inline">("cover");

  // Inline Image Prompt Modal States
  const [inlinePromptOpen, setInlinePromptOpen] = useState(false);
  const [inlineImageUrl, setInlineImageUrl] = useState("");
  const [inlineImageAlt, setInlineImageAlt] = useState("");
  const [inlineImageCaption, setInlineImageCaption] = useState("");
  const [inlineImageAlignment, setInlineImageAlignment] = useState<"left" | "center" | "right">("center");

  // Rich Text Editor State
  const [editorContent, setEditorContent] = useState("");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent underline hover:text-navy transition-colors"
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-border w-full my-6 text-xs text-left"
        }
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-border p-2"
        }
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-border p-2 bg-muted/30 font-bold text-navy"
        }
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: "mx-auto max-w-full my-6 border border-border shadow-sm block"
        }
      })
    ],
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
      setCoverUrl(editingPost.image_url || "");
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
    setCoverUrl("");
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
      image_url: coverUrl, // Send mapped cover image URL
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

  // Image Picker Selector Resolver
  const handleImagePickerSelect = (img: { public_url: string; alt_text?: string; title: string }) => {
    if (pickerMode === "cover") {
      setCoverUrl(img.public_url);
    } else {
      // In inline image insertion mode, open prompt modal to get alignment/caption metadata
      setInlineImageUrl(img.public_url);
      setInlineImageAlt(img.alt_text || img.title);
      setInlineImageCaption(img.title);
      setInlinePromptOpen(true);
    }
  };

  const handleInsertInlineImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !inlineImageUrl) return;

    let containerStyle = "margin: 1.5rem auto; text-align: center; display: block; clear: both;";
    let imgStyle = "max-width: 100%; height: auto; display: inline-block; border: 1px solid #e2e8f0; padding: 4px; background: white;";

    if (inlineImageAlignment === "left") {
      containerStyle = "float: left; margin: 0 1.5rem 1.5rem 0; max-width: 45%; text-align: left;";
    } else if (inlineImageAlignment === "right") {
      containerStyle = "float: right; margin: 0 0 1.5rem 1.5rem; max-width: 45%; text-align: right;";
    }

    const captionHtml = inlineImageCaption 
      ? `<figcaption style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; font-style: italic; text-align: center;">${inlineImageCaption}</figcaption>` 
      : "";

    editor.chain().focus().insertContent(`
      <figure style="${containerStyle}" class="blog-inline-figure">
        <img src="${inlineImageUrl}" alt="${inlineImageAlt}" style="${imgStyle}" />
        ${captionHtml}
      </figure>
      <p></p>
    `).run();

    setInlinePromptOpen(false);
    setInlineImageUrl("");
  };

  // Format link helper
  const handleAddLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter target URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
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
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
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

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-6">
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

            {/* UPGRADED Cover Image Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Cover Image
              </label>
              <div className="flex gap-4 items-center">
                {coverUrl ? (
                  <img src={coverUrl} className="size-16 object-cover border border-border bg-muted/20" />
                ) : (
                  <div className="size-16 border border-dashed border-border bg-muted/10 flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="size-5" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPickerMode("cover");
                    setPickerOpen(true);
                  }}
                  className="bg-navy hover:bg-accent text-white hover:text-accent-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Choose Cover Image
                </button>
              </div>
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

          {/* UPGRADED Rich Text Body Editor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
              Article Rich Text Body
            </label>
            <div className="border border-border bg-background rounded-sm">
              
              {/* Toolbar Controls */}
              <div className="flex flex-wrap gap-1.5 border-b border-border bg-muted/40 p-2">
                
                {/* Text Formats */}
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

                <div className="w-px h-5 bg-border mx-1 self-center" />

                {/* Headings */}
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

                <div className="w-px h-5 bg-border mx-1 self-center" />

                {/* Paragraph Structures */}
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
                  Quote
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold", editor?.isActive("codeBlock") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  Code Block
                </button>

                <div className="w-px h-5 bg-border mx-1 self-center" />

                {/* Links */}
                <button
                  type="button"
                  onClick={handleAddLink}
                  className={cn("px-2.5 py-1 text-xs border rounded font-semibold flex items-center gap-1", editor?.isActive("link") ? "bg-navy text-white" : "bg-card border-border hover:bg-muted")}
                >
                  <LinkIcon className="size-3" /> Link
                </button>

                <div className="w-px h-5 bg-border mx-1 self-center" />

                {/* Inline Media Selector */}
                <button
                  type="button"
                  onClick={() => {
                    setPickerMode("inline");
                    setPickerOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs border rounded bg-card border-border hover:border-accent hover:text-accent font-semibold flex items-center gap-1"
                >
                  <ImageIcon className="size-3 text-accent" /> Add Image
                </button>

                <div className="w-px h-5 bg-border mx-1 self-center" />

                {/* Table Actions */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                  className="px-2.5 py-1 text-xs border border-border bg-card rounded font-semibold hover:bg-muted flex items-center gap-1"
                  title="Insert Table"
                >
                  <TableIcon className="size-3" /> Table
                </button>
                {editor?.isActive("table") && (
                  <>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addColumnAfter().run()}
                      className="px-2 py-1 text-[10px] border border-border bg-card rounded hover:bg-muted"
                    >
                      + Col
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().addRowAfter().run()}
                      className="px-2 py-1 text-[10px] border border-border bg-card rounded hover:bg-muted"
                    >
                      + Row
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteColumn().run()}
                      className="px-2 py-1 text-[10px] border border-red-200 bg-red-50 text-red-700 rounded hover:bg-red-100"
                    >
                      - Col
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteRow().run()}
                      className="px-2 py-1 text-[10px] border border-red-200 bg-red-50 text-red-700 rounded hover:bg-red-100"
                    >
                      - Row
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().deleteTable().run()}
                      className="px-2 py-1 text-[10px] border border-red-300 bg-red-100 text-red-800 rounded font-bold hover:bg-red-200"
                    >
                      Delete Table
                    </button>
                  </>
                )}

                <div className="w-px h-5 bg-border mx-1 self-center" />

                {/* Undo / Redo */}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  className="px-2 py-1 text-xs border border-border bg-card rounded disabled:opacity-30 hover:bg-muted"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  className="px-2 py-1 text-xs border border-border bg-card rounded disabled:opacity-30 hover:bg-muted"
                >
                  Redo
                </button>

              </div>

              {/* Editor Workspace */}
              <div className="p-5 min-h-[350px] outline-none prose prose-slate max-w-none prose-sm">
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

        {/* Inline Image alignment and caption modal */}
        {inlinePromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-sm bg-card border border-border p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-border pb-2.5 mb-4">
                <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider">
                  Image Settings
                </h3>
                <button type="button" onClick={() => setInlinePromptOpen(false)} className="p-1 hover:bg-muted text-muted-foreground hover:text-navy rounded-full">
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleInsertInlineImageSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Image Caption / Title
                  </label>
                  <input
                    type="text"
                    placeholder="Short description under the image"
                    value={inlineImageCaption}
                    onChange={(e) => setInlineImageCaption(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    SEO Alt Description
                  </label>
                  <input
                    type="text"
                    placeholder="Explain what the image shows"
                    value={inlineImageAlt}
                    onChange={(e) => setInlineImageAlt(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy uppercase tracking-wider mb-1">
                    Alignment
                  </label>
                  <select
                    value={inlineImageAlignment}
                    onChange={(e: any) => setInlineImageAlignment(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 focus:outline-none focus:border-accent"
                  >
                    <option value="center">Centered (Large Block)</option>
                    <option value="left">Left Aligned (Wrapped Text)</option>
                    <option value="right">Right Aligned (Wrapped Text)</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setInlinePromptOpen(false)}
                    className="border border-border hover:bg-muted px-4 py-2 font-bold uppercase tracking-wider text-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-accent text-accent-foreground px-4 py-2 font-bold uppercase tracking-wider text-[10px]"
                  >
                    Insert Image
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reusable Image Picker Modal */}
        <ImagePickerModal
          isOpen={pickerOpen}
          onClose={() => setPickerOpen(false)}
          onSelect={handleImagePickerSelect}
        />

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
