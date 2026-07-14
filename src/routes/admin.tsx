import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Lock,
  LogOut,
  Layers,
  UserCheck,
  ExternalLink,
  Loader,
  MessageSquare,
  LayoutDashboard,
  Image as ImageIcon,
  Home,
  Wrench,
  Briefcase
} from "lucide-react";
import { verifyAdminPassword } from "@/lib/admin-actions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal | MM Engineering Baddi" },
      { name: "robots", content: "noindex, nofollow" }
    ]
  }),
  component: AdminPage
});

function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Load token from storage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("mm_admin_token");
    if (saved === "mm_eng_admin_session_token_2026") {
      setToken(saved);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await verifyAdminPassword({ data: password });
      if (res.success && res.token) {
        sessionStorage.setItem("mm_admin_token", res.token);
        setToken(res.token);
      } else {
        setLoginError(res.error || "Verification failed");
      }
    } catch (err: any) {
      setLoginError(err?.message || "Server connection failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("mm_admin_token");
    setToken(null);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy px-6 py-12">
        <div className="blueprint-grid absolute inset-0" aria-hidden />
        <div className="relative w-full max-w-md border border-white/10 bg-background/95 p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <div className="mx-auto grid size-12 place-items-center bg-accent text-accent-foreground font-display text-xl font-black mb-3">
              M
            </div>
            <h1 className="font-display text-2xl font-bold text-navy">MM Engineering</h1>
            <p className="text-xs text-muted-foreground mt-1">Authorized Administration Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-pass" className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-pass"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border bg-card py-3 pl-11 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
            </div>

            {loginError && (
              <div className="text-xs text-red-600 bg-red-50 p-3 border-l-3 border-red-500 font-semibold">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-navy text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-2"
            >
              {loggingIn ? (
                <>
                  <Loader className="size-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Admin Tailored Top Header */}
      <header className="bg-navy text-white py-4 px-6 md:px-12 border-b border-white/10 shadow-md flex items-center justify-between sticky top-0 z-45">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="grid size-8 place-items-center bg-accent text-accent-foreground font-display text-sm font-black transition-transform group-hover:scale-105">
              M
            </div>
            <span className="font-display font-black text-base tracking-wider hidden sm:inline-block">
              MM ENGINEERING
            </span>
          </Link>
          <span className="text-white/20 hidden sm:inline">|</span>
          <div className="flex items-center gap-2">
            <span className="bg-accent/15 text-accent border border-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Control Panel
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-accent font-semibold transition-colors border border-white/10 px-3 py-1.5 rounded-sm hover:border-accent"
          >
            <ExternalLink className="size-3.5" /> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors px-3 py-1.5 rounded-sm shadow-sm"
          >
            <LogOut className="size-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 container mx-auto px-6 lg:px-12 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar Nav */}
        <aside className="flex flex-col gap-2">
          {[
            { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
            { to: "/admin/leads", label: "Leads & RFQs", icon: Layers },
            { to: "/admin/reviews", label: "Reviews Approvals", icon: UserCheck },
            { to: "/admin/blogs", label: "Blog CMS", icon: MessageSquare },
            { to: "/admin/projects", label: "Projects CMS", icon: Briefcase },
            { to: "/admin/gallery", label: "Media Gallery", icon: ImageIcon },
            { to: "/admin/homepage", label: "Homepage Editor", icon: Home },
            { to: "/admin/services", label: "Services Editor", icon: Wrench }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                activeOptions={t.to === "/admin" ? { exact: true } : undefined}
                activeProps={{
                  className: "bg-navy text-white border-navy shadow-md translate-x-1"
                }}
                inactiveProps={{
                  className: "bg-card text-muted-foreground border-border hover:border-accent hover:text-accent"
                }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border text-left transition-all rounded-sm"
              >
                <Icon className="size-4 shrink-0" /> {t.label}
              </Link>
            );
          })}
        </aside>

        {/* Content Pane */}
        <main className="bg-card border border-border p-6 md:p-8 shadow-card rounded-sm min-h-[600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
