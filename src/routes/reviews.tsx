import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Quote, Star, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchApprovedReviews, submitReview } from "@/lib/supabase-helpers";
import { CtaSection, Reveal, SectionHeader, Stagger, StaggerItem, Breadcrumbs } from "@/components/site/Shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Client Reviews & Feedback | MM Engineering Baddi" },
      {
        name: "description",
        content:
          "Read testimonials and reviews from factory heads, purchase managers and engineers about MM Engineering's fabrication and machining in Baddi, Himachal Pradesh.",
      },
      { name: "keywords", content: "MM Engineering reviews, steel fabrication Baddi feedback, machine shop ratings Himachal, BBN industrial reviews" },
    ],
  }),
  component: ReviewsPage,
});

function RatingStars({ rating, setRating }: { rating: number; setRating?: (r: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!setRating}
          onClick={() => setRating?.(star)}
          className={cn(
            "transition-colors",
            star <= rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30",
            setRating && "hover:scale-110 cursor-pointer"
          )}
        >
          <Star className="size-5" />
        </button>
      ))}
    </div>
  );
}

function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await fetchApprovedReviews();
        setReviews(data || []);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const comment = formData.get("comment") as string;

    try {
      await submitReview({
        name,
        role,
        company,
        rating: formRating,
        comment,
      });
      setSent(true);
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      setError(err?.message || "Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-navy pb-24 pt-40 md:pb-32 md:pt-48">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} aria-hidden />
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="container relative mx-auto px-6 lg:px-12">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Reviews", to: "/reviews" },
              ]}
            />
            <h1 className="mt-5 max-w-3xl text-balance font-display text-4xl font-black leading-[1.05] text-white md:text-6xl">
              What Our Clients Say
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              Reviews from Plant Heads, Purchase Managers and Operations heads across Baddi and Northern India.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:px-12">
          {/* Reviews list */}
          <div>
            <SectionHeader align="left" eyebrow="Reviews" title="Client Testimonials" />

            {loading ? (
              <p className="text-muted-foreground text-sm">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="border border-border p-8 text-center bg-card text-muted-foreground">
                <Quote className="size-8 mx-auto text-accent opacity-30 mb-3" />
                <p className="text-sm">No client reviews have been published yet. Be the first to leave one!</p>
              </div>
            ) : (
              <Stagger className="grid gap-6">
                {reviews.map((r) => (
                  <StaggerItem key={r.id}>
                    <div className="border border-border bg-card p-6 shadow-card hover:border-accent/40 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <RatingStars rating={r.rating} />
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground md:text-base mb-4">"{r.comment}"</p>
                      <div className="border-t border-border pt-3">
                        <p className="font-display text-sm font-bold text-navy">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.role && r.role}
                          {r.role && r.company && " · "}
                          {r.company && r.company}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>

          {/* Form */}
          <div>
            <div className="lg:sticky lg:top-28">
              <div className="border border-border bg-card p-8 shadow-card">
                <h2 className="font-display text-2xl font-bold text-navy mb-2">Write a Review</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Your feedback helps us maintain our quality standards. Submitted reviews are reviewed by administrators before appearing live.
                </p>

                {sent ? (
                  <div className="border border-accent/20 bg-accent/5 p-6 text-center">
                    <Send className="mx-auto size-8 text-accent mb-3" />
                    <h3 className="font-display text-lg font-bold text-navy">Review Submitted</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Thank you! Your feedback has been received and will be displayed shortly after administrative verification.
                    </p>
                    <button
                      onClick={() => setSent(false)}
                      className="mt-4 text-xs font-bold text-accent hover:underline uppercase tracking-wider"
                    >
                      Submit another review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="rev-rating" className="block text-xs font-bold uppercase tracking-wider text-navy mb-2">
                        Rating *
                      </label>
                      <RatingStars rating={formRating} setRating={setFormRating} />
                    </div>

                    <div>
                      <label htmlFor="rev-name" className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                        Your Name *
                      </label>
                      <input
                        id="rev-name"
                        name="name"
                        type="text"
                        required
                        className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="rev-role" className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                        Designation / Role
                      </label>
                      <input
                        id="rev-role"
                        name="role"
                        placeholder="e.g. Plant Head, Purchase Manager"
                        type="text"
                        className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="rev-company" className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                        Company Name
                      </label>
                      <input
                        id="rev-company"
                        name="company"
                        type="text"
                        className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label htmlFor="rev-comment" className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                        Review Comments *
                      </label>
                      <textarea
                        id="rev-comment"
                        name="comment"
                        rows={4}
                        required
                        placeholder="Describe your experience with our quality, schedule compliance and service..."
                        className="w-full border border-border bg-background px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      />
                    </div>

                    {error && (
                      <div className="text-xs text-red-600 bg-red-50 p-3 border-l-3 border-red-500 font-semibold">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className={cn(
                        "w-full bg-accent text-accent-foreground py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-accent/90",
                        submitting && "opacity-75 cursor-not-allowed"
                      )}
                    >
                      {submitting ? "Submitting Review..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
