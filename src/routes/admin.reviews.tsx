import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader, Trash2, Star, CheckCircle, XCircle, Undo, Save, Edit2 } from "lucide-react";
import { fetchReviewsAdmin, approveReviewAdmin, deleteReviewAdmin, upsertReviewAdmin } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reviews")({
  component: ReviewsPage
});

function ReviewsPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const loadReviews = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReviewsAdmin({ data: token });
      setReviews(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load reviews. Check your database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [token]);

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      await approveReviewAdmin({ data: { token, id, approved } });
      loadReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review permanently?")) return;
    try {
      await deleteReviewAdmin({ data: { token, id } });
      loadReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReview) return;
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const reviewData = {
      ...editingReview,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      rating: parseInt(formData.get("rating") as string, 10),
      comment: formData.get("comment") as string,
      approved: !!formData.get("approved"),
      show_on_homepage: !!formData.get("show_on_homepage")
    };

    try {
      await upsertReviewAdmin({ data: { token, review: reviewData } });
      setEditingReview(null);
      loadReviews();
    } catch (err: any) {
      console.error(err);
      alert("Failed to save review: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-red-600 bg-red-50 p-6 border-l-4 border-red-500 font-semibold mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={loadReviews}
          className="bg-navy text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12"><Loader className="size-8 animate-spin mx-auto text-accent" /></div>;

  if (editingReview) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <h2 className="font-display text-xl font-bold text-navy">
            Edit Client Review
          </h2>
          <button
            onClick={() => setEditingReview(null)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-navy font-semibold transition-colors"
          >
            <Undo className="size-4" /> Cancel & Return
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editingReview.name}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Designation / Role
              </label>
              <input
                type="text"
                name="role"
                defaultValue={editingReview.role || ""}
                placeholder="e.g. Purchase Manager"
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                name="company"
                defaultValue={editingReview.company || ""}
                placeholder="e.g. Abbott Labs"
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Rating Stars
              </label>
              <select
                name="rating"
                defaultValue={editingReview.rating}
                className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="flex gap-6 items-center pt-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy cursor-pointer">
                <input
                  type="checkbox"
                  name="approved"
                  defaultChecked={editingReview.approved}
                  className="rounded border-border focus:ring-accent"
                />
                Approved & Live
              </label>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy cursor-pointer">
                <input
                  type="checkbox"
                  name="show_on_homepage"
                  defaultChecked={editingReview.show_on_homepage}
                  className="rounded border-border focus:ring-accent"
                />
                Show on Homepage
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
              Client Feedback Comment *
            </label>
            <textarea
              name="comment"
              rows={4}
              required
              defaultValue={editingReview.comment}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-accent/90"
          >
            {saving ? <Loader className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save Review
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-navy">Reviews Verification</h2>
        <span className="text-xs bg-navy/5 text-navy px-3 py-1 font-semibold">{reviews.length} Reviews</span>
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className={cn(
              "border p-5 relative flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-sm",
              r.approved ? "border-green-500/30 bg-green-50/10" : "border-amber-500/30 bg-amber-50/10"
            )}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="flex text-amber-500">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-500" />
                  ))}
                </span>
                <span className="text-[10px] bg-muted px-2 py-0.5 font-semibold">
                  {r.approved ? "Approved & Live" : "Hidden / Pending Verification"}
                </span>
                {r.show_on_homepage && (
                  <span className="text-[10px] bg-navy/10 text-navy border border-navy/20 px-2 py-0.5 font-bold uppercase">
                    Homepage
                  </span>
                )}
              </div>
              <p className="text-sm italic leading-relaxed text-navy mb-2">"{r.comment}"</p>
              <p className="text-xs font-bold text-navy">
                {r.name} <span className="font-normal text-muted-foreground">{r.role && `(${r.role})`} {r.company && `at ${r.company}`}</span>
              </p>
            </div>

            <div className="flex gap-2 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
              {r.approved ? (
                <button
                  onClick={() => handleApprove(r.id, false)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-amber-500/20 bg-amber-500/10 text-amber-600 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
                >
                  <XCircle className="size-3.5" /> Reject / Hide
                </button>
              ) : (
                <button
                  onClick={() => handleApprove(r.id, true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-green-500/20 bg-green-500/10 text-green-600 text-xs font-semibold hover:bg-green-500/20 transition-colors"
                >
                  <CheckCircle className="size-3.5" /> Approve & Live
                </button>
              )}
              <button
                onClick={() => setEditingReview(r)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-border bg-card text-navy text-xs font-semibold hover:border-accent hover:text-accent transition-colors"
                title="Edit Details"
              >
                <Edit2 className="size-3.5" /> Edit
              </button>
              <button
                onClick={() => handleDelete(r.id)}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-border bg-card text-muted-foreground/70 text-xs font-semibold hover:border-red-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="size-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
