import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader, Trash2 } from "lucide-react";
import { fetchLeadsAdmin, updateLeadStatusAdmin, deleteLeadAdmin } from "@/lib/admin-actions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leads")({
  component: LeadsPage
});

function LeadsPage() {
  const token = typeof window !== "undefined" ? sessionStorage.getItem("mm_admin_token") || "" : "";
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadLeads = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeadsAdmin({ data: token });
      setLeads(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load enquiries. Check your database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [token]);

  const handleUpdate = async (id: string, status: string, notes: string) => {
    setSavingId(id);
    try {
      await updateLeadStatusAdmin({ data: { token, id, status, notes } });
      // Update local state without full reload for instant response
      setLeads(leads.map(l => l.id === id ? { ...l, status, notes } : l));
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry permanently?")) return;
    try {
      await deleteLeadAdmin({ data: { token, id } });
      setLeads(leads.filter((l) => l.id !== id));
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
          onClick={loadLeads}
          className="bg-navy text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12"><Loader className="size-8 animate-spin mx-auto text-accent" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-bold text-navy">Leads & RFQ Enquiries</h2>
        <span className="text-xs bg-navy/5 text-navy px-3 py-1 font-semibold">{leads.length} Enquiries</span>
      </div>

      <div className="space-y-4">
        {leads.map((l) => (
          <div
            key={l.id}
            className={cn(
              "border p-6 bg-card relative shadow-sm hover:shadow transition-shadow rounded-sm",
              l.status === "new" ? "border-accent/40 border-l-4" : "border-border border-l-4 border-l-muted-foreground/35"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display text-base font-bold text-navy">{l.company_name || "Direct Enquiry"}</h3>
                <p className="text-xs text-muted-foreground">
                  Contact: <span className="font-semibold text-navy">{l.contact_person}</span> · {l.email} · {l.phone}
                </p>
              </div>
              <button
                onClick={() => handleDelete(l.id)}
                className="text-muted-foreground hover:text-red-500 p-1.5 transition-colors border border-border hover:border-red-500 bg-background"
                title="Delete lead record"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 bg-muted/20 p-3 rounded-sm border border-border/40 text-xs">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Requirements</span>
                <span className="font-medium text-navy uppercase">{l.requirements_type}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Est. Volume</span>
                <span className="font-medium text-navy">{l.volume || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Location</span>
                <span className="font-medium text-navy">{l.location || "N/A"}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Received Date</span>
                <span className="font-medium text-navy">
                  {l.created_at ? new Date(l.created_at).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>

            <div className="mb-4 bg-muted/30 p-3 text-xs leading-relaxed text-foreground">
              <span className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Message</span>
              {l.message}
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy">Status</span>
                <select
                  defaultValue={l.status}
                  onChange={(e) => handleUpdate(l.id, e.target.value, l.notes || "")}
                  className="border border-border bg-card px-2.5 py-1 text-xs focus:outline-none"
                >
                  <option value="new">New Enquiry</option>
                  <option value="contacted">Contacted / Working</option>
                  <option value="closed">Closed / Finished</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add internal notes..."
                  defaultValue={l.notes || ""}
                  onBlur={(e) => handleUpdate(l.id, l.status, e.target.value)}
                  className="flex-1 border border-border bg-card px-3 py-1.5 text-xs focus:outline-none"
                />
                {savingId === l.id && <Loader className="size-4 animate-spin self-center text-accent" />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
