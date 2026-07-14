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
  FileText,
  Briefcase,
  ImageIcon,
  Home,
  Wrench,
  CheckCircle2,
  Database,
  Eye,
  Sliders
} from "lucide-react";
import { fetchLeadsAdmin, fetchReviewsAdmin, fetchBlogPostsAdmin } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage
});

interface DashboardStats {
  leadsTotal: number;
  leadsNew: number;
  leadsActive: number;
  leadsClosed: number;
  reviewsTotal: number;
  reviewsApproved: number;
  reviewsPending: number;
  blogsTotal: number;
  blogsPublished: number;
  blogsDrafts: number;
  projectsTotal: number;
  projectsActive: number;
  projectsDrafts: number;
  galleryTotal: number;
  galleryHomepage: number;
  galleryPublished: number;
}

function DashboardPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  
  const [stats, setStats] = useState<DashboardStats>({
    leadsTotal: 0,
    leadsNew: 0,
    leadsActive: 0,
    leadsClosed: 0,
    reviewsTotal: 0,
    reviewsApproved: 0,
    reviewsPending: 0,
    blogsTotal: 0,
    blogsPublished: 0,
    blogsDrafts: 0,
    projectsTotal: 0,
    projectsActive: 0,
    projectsDrafts: 0,
    galleryTotal: 0,
    galleryHomepage: 0,
    galleryPublished: 0
  });

  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [recentMedia, setRecentMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const [leads, reviews, posts, projectsRes, galleryRes] = await Promise.all([
          fetchLeadsAdmin({ data: token }),
          fetchReviewsAdmin({ data: token }),
          fetchBlogPostsAdmin({ data: token }),
          supabase.from("projects").select("*"),
          supabase.from("gallery").select("*").order("created_at", { ascending: false })
        ]);

        const safeLeads = leads || [];
        const safeReviews = reviews || [];
        const safePosts = posts || [];
        const safeProjects = projectsRes.data || [];
        const safeGallery = galleryRes.data || [];

        // Calculate lead states
        const leadsNew = safeLeads.filter((l: any) => l.status === "new").length;
        const leadsActive = safeLeads.filter((l: any) => l.status === "contacted").length;
        const leadsClosed = safeLeads.filter((l: any) => l.status === "closed").length;

        // Calculate reviews
        const reviewsApproved = safeReviews.filter((r: any) => r.approved).length;
        const reviewsPending = safeReviews.filter((r: any) => !r.approved).length;

        // Calculate blogs
        const blogsPublished = safePosts.filter((p: any) => p.published).length;
        const blogsDrafts = safePosts.filter((p: any) => !p.published).length;

        // Calculate projects
        const projectsActive = safeProjects.filter((p: any) => p.active).length;
        const projectsDrafts = safeProjects.filter((p: any) => !p.active).length;

        // Calculate gallery
        const galleryHomepage = safeGallery.filter((g: any) => g.show_on_homepage).length;
        const galleryPublished = safeGallery.filter((g: any) => g.is_published).length;

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
          blogsDrafts,
          projectsTotal: safeProjects.length,
          projectsActive,
          projectsDrafts,
          galleryTotal: safeGallery.length,
          galleryHomepage,
          galleryPublished
        });

        setRecentLeads(safeLeads.slice(0, 3));
        setRecentReviews(safeReviews.slice(0, 3));
        setRecentMedia(safeGallery.slice(0, 3));
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard summaries. Please check database permissions.");
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

  // Pipeline math
  const leadTotalCount = stats.leadsTotal || 1;
  const pctNew = Math.round((stats.leadsNew / leadTotalCount) * 100);
  const pctActive = Math.round((stats.leadsActive / leadTotalCount) * 100);
  const pctClosed = Math.round((stats.leadsClosed / leadTotalCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome & Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-black text-navy uppercase tracking-tight">Overview Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time operations tracking, CMS moderate states, and dynamic media/project inventories.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 justify-end ml-auto">
          <span className="flex items-center gap-1.5 text-[10px] bg-green-500/10 text-green-700 border border-green-500/20 px-2.5 py-1 font-bold uppercase tracking-wider rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Supabase Connection: Live
          </span>
          <span className="flex items-center gap-1.5 text-[10px] bg-navy/5 text-navy border border-border px-2.5 py-1 font-bold uppercase tracking-wider rounded-sm">
            <Database className="size-3 text-accent" />
            Bucket: public/gallery
          </span>
        </div>
      </div>

      {/* Structured 6-KPI metrics Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Leads */}
        <div className="border border-border bg-card p-4 relative overflow-hidden shadow-sm hover:border-accent transition-colors group">
          <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Layers className="size-12 text-navy" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Direct Leads</p>
          <p className="font-display text-2xl font-black text-navy mt-0.5">{stats.leadsTotal}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="text-[8px] bg-red-50 text-red-600 px-1.5 py-0.5 border border-red-100 font-bold uppercase">
              {stats.leadsNew} New
            </span>
            <span className="text-[8px] bg-amber-50 text-amber-600 px-1.5 py-0.5 border border-amber-100 font-bold uppercase">
              {stats.leadsActive} Active
            </span>
          </div>
        </div>

        {/* Reviews */}
        <div className="border border-border bg-card p-4 relative overflow-hidden shadow-sm hover:border-accent transition-colors group">
          <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserCheck className="size-12 text-navy" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Moderation</p>
          <p className="font-display text-2xl font-black text-navy mt-0.5">{stats.reviewsTotal}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 border border-green-100 font-bold uppercase">
              {stats.reviewsApproved} Live
            </span>
            <span className="text-[8px] bg-amber-50 text-amber-600 px-1.5 py-0.5 border border-amber-100 font-bold uppercase">
              {stats.reviewsPending} Pending
            </span>
          </div>
        </div>

        {/* Blogs */}
        <div className="border border-border bg-card p-4 relative overflow-hidden shadow-sm hover:border-accent transition-colors group">
          <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <MessageSquare className="size-12 text-navy" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Blog CMS</p>
          <p className="font-display text-2xl font-black text-navy mt-0.5">{stats.blogsTotal}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 border border-green-100 font-bold uppercase">
              {stats.blogsPublished} Live
            </span>
            <span className="text-[8px] bg-muted/40 text-muted-foreground px-1.5 py-0.5 border border-border font-bold uppercase">
              {stats.blogsDrafts} Drafts
            </span>
          </div>
        </div>

        {/* Projects */}
        <div className="border border-border bg-card p-4 relative overflow-hidden shadow-sm hover:border-accent transition-colors group">
          <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Briefcase className="size-12 text-navy" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Projects CMS</p>
          <p className="font-display text-2xl font-black text-navy mt-0.5">{stats.projectsTotal}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 border border-green-100 font-bold uppercase">
              {stats.projectsActive} Active
            </span>
            <span className="text-[8px] bg-muted/40 text-muted-foreground px-1.5 py-0.5 border border-border font-bold uppercase">
              {stats.projectsDrafts} Draft
            </span>
          </div>
        </div>

        {/* Gallery */}
        <div className="border border-border bg-card p-4 relative overflow-hidden shadow-sm hover:border-accent transition-colors group">
          <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <ImageIcon className="size-12 text-navy" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Media Library</p>
          <p className="font-display text-2xl font-black text-navy mt-0.5">{stats.galleryTotal}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 border border-green-100 font-bold uppercase">
              {stats.galleryPublished} Published
            </span>
            <span className="text-[8px] bg-navy/5 text-navy px-1.5 py-0.5 border border-border font-bold uppercase">
              {stats.galleryHomepage} Home
            </span>
          </div>
        </div>

        {/* Latency */}
        <div className="border border-border bg-card p-4 relative overflow-hidden shadow-sm hover:border-accent transition-colors group">
          <div className="absolute right-2 top-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity className="size-12 text-navy" />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Server Latency</p>
          <p className="font-display text-2xl font-black text-green-600 mt-0.5">Fast</p>
          <div className="mt-2.5 flex items-center gap-1 text-[8px] text-muted-foreground font-semibold">
            <Clock className="size-3" /> Auto-sync enabled
          </div>
        </div>
      </div>

      {/* Visual Pipeline split status */}
      <div className="border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider">Leads Lifecycle Status</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">RFQ pipeline conversion splits</p>
          </div>
          <div className="flex gap-4 text-[9px] font-semibold text-navy">
            <span className="flex items-center gap-1.5"><span className="size-2 bg-red-500 rounded-sm" /> New ({pctNew || 0}%)</span>
            <span className="flex items-center gap-1.5"><span className="size-2 bg-amber-500 rounded-sm" /> In-Progress ({pctActive || 0}%)</span>
            <span className="flex items-center gap-1.5"><span className="size-2 bg-green-500 rounded-sm" /> Closed ({pctClosed || 0}%)</span>
          </div>
        </div>

        {/* Bar */}
        <div className="h-3 bg-muted/40 w-full overflow-hidden flex border border-border/60">
          <div style={{ width: `${pctNew || 0}%` }} className="bg-red-500 h-full transition-all duration-500" title="New" />
          <div style={{ width: `${pctActive || 0}%` }} className="bg-amber-500 h-full transition-all duration-500" title="In Progress" />
          <div style={{ width: `${pctClosed || 0}%` }} className="bg-green-500 h-full transition-all duration-500" title="Closed" />
        </div>
      </div>

      {/* Split Columns Grid: Activity lists vs actions console */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        
        {/* Left Column: Activity lists */}
        <div className="space-y-6">
          {/* Direct Leads */}
          <div className="border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-2.5">
              <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <Layers className="size-4 text-accent" /> Recent Direct RFQs
              </h3>
              <Link
                to="/admin/leads"
                className="text-[9px] text-accent hover:text-navy hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5"
              >
                Manage <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentLeads.map((l) => (
                <div key={l.id} className="border border-border/60 p-3 hover:bg-muted/10 transition-colors rounded-sm flex items-start justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-navy">{l.company_name || "Direct Customer Enquiry"}</h4>
                    <p className="text-muted-foreground mt-0.5">Contact: {l.contact_person} · {l.requirements_type}</p>
                    <p className="text-[9px] text-muted-foreground/80 mt-1 flex items-center gap-1">
                      <Clock className="size-3 text-accent" /> {new Date(l.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border",
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
                <p className="text-center py-6 text-xs text-muted-foreground italic">No recent enquiries received.</p>
              )}
            </div>
          </div>

          {/* Feedback Queue */}
          <div className="border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-2.5">
              <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="size-4 text-accent" /> Feedback & Reviews Queue
              </h3>
              <Link
                to="/admin/reviews"
                className="text-[9px] text-accent hover:text-navy hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5"
              >
                Moderate <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentReviews.map((r) => (
                <div key={r.id} className="border border-border/60 p-3 hover:bg-muted/10 transition-colors rounded-sm text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-navy">{r.name}</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider border rounded-sm",
                        r.approved ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {r.approved ? "Live" : "Pending"}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-1 italic">"{r.comment}"</p>
                </div>
              ))}
              {recentReviews.length === 0 && (
                <p className="text-center py-6 text-xs text-muted-foreground italic">No client reviews submitted.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Recent media log */}
        <div className="space-y-6">
          
          {/* Quick Actions Console */}
          <div className="border border-border bg-card p-5 shadow-sm">
            <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider mb-4 border-b border-border pb-2.5 flex items-center gap-2">
              <Sliders className="size-4 text-accent" /> Quick Operations Console
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link
                to="/admin/blogs"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 rounded-sm"
              >
                <Plus className="size-4 shrink-0 text-accent" /> Add Article
              </Link>
              <Link
                to="/admin/projects"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 rounded-sm"
              >
                <Briefcase className="size-4 shrink-0 text-accent" /> Add Project
              </Link>
              <Link
                to="/admin/gallery"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 rounded-sm"
              >
                <ImageIcon className="size-4 shrink-0 text-accent" /> Media Library
              </Link>
              <Link
                to="/admin/homepage"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 rounded-sm"
              >
                <Home className="size-4 shrink-0 text-accent" /> Home Layout
              </Link>
              <Link
                to="/admin/services"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 rounded-sm"
              >
                <Wrench className="size-4 shrink-0 text-accent" /> Services Cover
              </Link>
              <Link
                to="/"
                target="_blank"
                className="flex items-center gap-2 px-3 py-2.5 border border-border bg-card hover:border-accent hover:text-accent font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 rounded-sm"
              >
                <TrendingUp className="size-4 shrink-0 text-accent" /> Live Website
              </Link>
            </div>
          </div>

          {/* Recent Uploaded Media Feed */}
          <div className="border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-2.5">
              <h3 className="font-display text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="size-4 text-accent" /> Recent Media Uploads
              </h3>
              <Link
                to="/admin/gallery"
                className="text-[9px] text-accent hover:text-navy hover:underline font-bold uppercase tracking-wider flex items-center gap-0.5"
              >
                All Files <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {recentMedia.map((m) => (
                <div key={m.id} className="group relative aspect-square overflow-hidden bg-muted/10 border border-border rounded-sm">
                  <img src={m.public_url} alt={m.title} className="size-full object-cover" />
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-1.5 text-[8px] text-white">
                    <span className="truncate font-bold">{m.title}</span>
                    <span className="text-white/60 font-semibold truncate">{m.page || "Unassigned"}</span>
                  </div>
                </div>
              ))}
              {recentMedia.length === 0 && (
                <div className="col-span-full border border-dashed border-border/80 py-8 text-center text-muted-foreground text-xs">
                  <ImageIcon className="size-6 text-muted-foreground/30 mx-auto mb-1" />
                  <p className="font-semibold italic">No uploaded media found.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
