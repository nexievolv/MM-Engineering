import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Layers,
  UserCheck,
  MessageSquare,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  Plus,
  ThumbsUp,
  FileText
} from "lucide-react";
import { fetchLeadsAdmin, fetchReviewsAdmin, fetchBlogPostsAdmin } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage
});

function DashboardPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  
  const [stats, setStats] = useState({
    leadsTotal: 0,
    leadsNew: 0,
    leadsActive: 0,
    leadsClosed: 0,
    reviewsTotal: 0,
    reviewsApproved: 0,
    reviewsPending: 0,
    blogsTotal: 0,
    blogsPublished: 0,
    blogsDrafts: 0
  });

  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const [leads, reviews, posts] = await Promise.all([
          fetchLeadsAdmin({ data: token }),
          fetchReviewsAdmin({ data: token }),
          fetchBlogPostsAdmin({ data: token })
        ]);

        const safeLeads = leads || [];
        const safeReviews = reviews || [];
        const safePosts = posts || [];

        const leadsNew = safeLeads.filter((l: any) => l.status === "new").length;
        const leadsActive = safeLeads.filter((l: any) => l.status === "contacted").length;
        const leadsClosed = safeLeads.filter((l: any) => l.status === "closed").length;

        const reviewsApproved = safeReviews.filter((r: any) => r.approved).length;
        const reviewsPending = safeReviews.filter((r: any) => !r.approved).length;

        const blogsPublished = safePosts.filter((p: any) => p.published).length;
        const blogsDrafts = safePosts.filter((p: any) => !p.published).length;

        setStats({
          leadsTotal: safeLeads.length,
          leadsNew,
          leadsActive,
          leadsClosed,
          reviewsTotal: safeReviews.length,
          reviewsApproved,
          reviewsPending,
          blogsTotal: safePosts.length,
          blogsPublished,
          blogsDrafts
        });

        setRecentLeads(safeLeads.slice(0, 3));
        setRecentReviews(safeReviews.slice(0, 3));
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard summaries. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center space-y-2">
          <Activity className="size-8 animate-spin mx-auto text-accent" />
          <p className="text-xs text-muted-foreground font-semibold">Generating dashboard analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-red-600 bg-red-50 p-6 border-l-4 border-red-500 font-semibold mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-navy text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors"
        >
          Retry Load
        </button>
      </div>
    );
  }

  // Segment metrics for visual chart
  const leadTotalCount = stats.leadsTotal || 1; // avoid divide by zero
  const pctNew = Math.round((stats.leadsNew / leadTotalCount) * 100);
  const pctActive = Math.round((stats.leadsActive / leadTotalCount) * 100);
  const pctClosed = Math.round((stats.leadsClosed / leadTotalCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & System Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-navy uppercase tracking-tight">Overview Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time operations tracking, moderation state, and dynamic system statistics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] bg-green-500/10 text-green-700 border border-green-500/20 px-2.5 py-1 font-bold uppercase tracking-wider rounded-sm">
            Supabase Connection: Live
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Leads */}
        <div className="border border-border bg-card p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform">
            <Layers className="size-16 text-navy" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Inquiries</p>
          <p className="font-display text-3xl font-black text-navy mt-1">{stats.leadsTotal}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 border border-red-200/50 font-bold uppercase">
              {stats.leadsNew} New
            </span>
            <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 border border-amber-200/50 font-bold uppercase">
              {stats.leadsActive} Active
            </span>
          </div>
        </div>

        {/* Card 2: Reviews */}
        <div className="border border-border bg-card p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform">
            <UserCheck className="size-16 text-navy" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Client Reviews</p>
          <p className="font-display text-3xl font-black text-navy mt-1">{stats.reviewsTotal}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 border border-green-200/50 font-bold uppercase">
              {stats.reviewsApproved} Live
            </span>
            <span className="text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 border border-amber-200/50 font-bold uppercase">
              {stats.reviewsPending} Pending
            </span>
          </div>
        </div>

        {/* Card 3: Blogs */}
        <div className="border border-border bg-card p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform">
            <MessageSquare className="size-16 text-navy" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Blog CMS Articles</p>
          <p className="font-display text-3xl font-black text-navy mt-1">{stats.blogsTotal}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[9px] bg-green-50 text-green-600 px-2 py-0.5 border border-green-200/50 font-bold uppercase">
              {stats.blogsPublished} Live
            </span>
            <span className="text-[9px] bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 border border-border font-bold uppercase">
              {stats.blogsDrafts} Drafts
            </span>
          </div>
        </div>

        {/* Card 4: System Health */}
        <div className="border border-border bg-card p-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
          <div className="absolute right-3 top-3 opacity-10 group-hover:scale-110 transition-transform">
            <Activity className="size-16 text-navy" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">System Latency</p>
          <p className="font-display text-3xl font-black text-navy mt-1">A+</p>
          <div className="mt-3 flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
            <Clock className="size-3" /> Updated just now
          </div>
        </div>
      </div>

      {/* Chart and Activity Breakdown */}
      <div className="border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider">Leads Lifecycle Status</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">RFQ conversion and pipeline layout</p>
          </div>
          <div className="flex gap-4 text-[10px] font-semibold text-navy">
            <span className="flex items-center gap-1.5"><span className="size-2 bg-red-500 rounded-sm" /> New ({pctNew || 0}%)</span>
            <span className="flex items-center gap-1.5"><span className="size-2 bg-amber-500 rounded-sm" /> In-Progress ({pctActive || 0}%)</span>
            <span className="flex items-center gap-1.5"><span className="size-2 bg-green-500 rounded-sm" /> Closed ({pctClosed || 0}%)</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="h-4 bg-muted/40 w-full overflow-hidden flex border border-border/60">
          <div style={{ width: `${pctNew || 0}%` }} className="bg-red-500 h-full transition-all duration-500" title="New" />
          <div style={{ width: `${pctActive || 0}%` }} className="bg-amber-500 h-full transition-all duration-500" title="In Progress" />
          <div style={{ width: `${pctClosed || 0}%` }} className="bg-green-500 h-full transition-all duration-500" title="Closed" />
        </div>
      </div>

      {/* Columns: Recent Enquiries vs Moderation Queue */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        
        {/* Left Column: Recent Enquiries */}
        <div className="border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
              <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <Layers className="size-4 text-accent" /> Recent Direct Enquiries
              </h3>
              <Link
                to="/admin/leads"
                className="text-[10px] text-accent hover:text-navy hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
              >
                Manage leads <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentLeads.map((l) => (
                <div key={l.id} className="border border-border/80 p-3.5 hover:bg-muted/10 transition-colors rounded-sm flex items-start justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-navy">{l.company_name || "Direct Customer Enquiry"}</h4>
                    <p className="text-muted-foreground mt-0.5">Contact: {l.contact_person} · {l.requirements_type}</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-1 flex items-center gap-1">
                      <Clock className="size-3" /> {new Date(l.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                      l.status === "new"
                        ? "bg-red-50 text-red-600 border-red-200"
                        : l.status === "contacted"
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "bg-green-50 text-green-600 border-green-200"
                    )}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
              {recentLeads.length === 0 && (
                <p className="text-center py-6 text-xs text-muted-foreground">No recent enquiries received.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Moderation & Quick Actions */}
        <div className="space-y-6">
          
          {/* Moderation Queue */}
          <div className="border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
              <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="size-4 text-accent" /> Feedback Moderation
              </h3>
              <Link
                to="/admin/reviews"
                className="text-[10px] text-accent hover:text-navy hover:underline font-bold uppercase tracking-wider flex items-center gap-1"
              >
                Approve Reviews <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentReviews.map((r) => (
                <div key={r.id} className="border border-border/80 p-3.5 hover:bg-muted/10 transition-colors rounded-sm text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-navy">{r.name}</span>
                    <span
                      className={cn(
                        "px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider",
                        r.approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {r.approved ? "Live" : "Pending"}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-1 italic">"{r.comment}"</p>
                </div>
              ))}
              {recentReviews.length === 0 && (
                <p className="text-center py-6 text-xs text-muted-foreground">No reviews submitted.</p>
              )}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="border border-border bg-card p-6 shadow-sm">
            <h3 className="font-display text-sm font-bold text-navy uppercase tracking-wider mb-4 border-b border-border pb-3">
              Quick Admin Actions
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                to="/admin/blogs"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-colors rounded-sm"
              >
                <Plus className="size-4 shrink-0 text-accent" /> Add Article
              </Link>
              <Link
                to="/admin/reviews"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-colors rounded-sm"
              >
                <ThumbsUp className="size-4 shrink-0 text-accent" /> Verify Feedback
              </Link>
              <Link
                to="/admin/leads"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-colors rounded-sm"
              >
                <FileText className="size-4 shrink-0 text-accent" /> Review RFQs
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-colors rounded-sm"
              >
                <TrendingUp className="size-4 shrink-0 text-accent" /> Public Site
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
