import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Plus, FileDown, Search, Trash2, Eye, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  entry_date: string;
  entry_time: string;
  incident_description: string;
  location: string | null;
  witnesses: string | null;
  injuries_damage: string | null;
  created_at: string;
}

interface EvidenceCount {
  entry_id: string;
  file_type: string;
}

export default function JournalList() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [evidenceCounts, setEvidenceCounts] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const firstName = user?.user_metadata?.full_name?.split(" ")[0]
    || user?.email?.split("@")[0]
    || "Your";

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) fetchEntries();
  }, [user, authLoading]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user!.id)
      .order("entry_date", { ascending: false })
      .order("entry_time", { ascending: false });

    if (error) { toast({ title: "Error loading entries", description: error.message, variant: "destructive" }); return; }
    setEntries(data || []);

    if (data && data.length > 0) {
      const ids = data.map(e => e.id);
      const { data: evData } = await supabase
        .from("journal_evidence")
        .select("entry_id, file_type")
        .in("entry_id", ids);

      const counts: Record<string, Record<string, number>> = {};
      (evData || []).forEach((ev: EvidenceCount) => {
        if (!counts[ev.entry_id]) counts[ev.entry_id] = {};
        counts[ev.entry_id][ev.file_type] = (counts[ev.entry_id][ev.file_type] || 0) + 1;
      });
      setEvidenceCounts(counts);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { data: evidence } = await supabase.from("journal_evidence").select("file_url").eq("entry_id", id);
    if (evidence && evidence.length > 0) {
      const paths = evidence.map(e => {
        const url = e.file_url;
        const idx = url.indexOf("journal-evidence/");
        return idx >= 0 ? url.substring(idx + "journal-evidence/".length) : "";
      }).filter(Boolean);
      if (paths.length > 0) await supabase.storage.from("journal-evidence").remove(paths);
    }

    const { error } = await supabase.from("journal_entries").delete().eq("id", id);
    if (error) toast({ title: "Error deleting entry", description: error.message, variant: "destructive" });
    else { toast({ title: "Entry deleted" }); setEntries(prev => prev.filter(e => e.id !== id)); }
    setDeleteId(null);
  };

  const filteredEntries = entries.filter(e => {
    const now = new Date();
    const entryDate = new Date(e.entry_date);
    if (filter === "30") { const cutoff = new Date(); cutoff.setDate(now.getDate() - 30); if (entryDate < cutoff) return false; }
    if (filter === "180") { const cutoff = new Date(); cutoff.setDate(now.getDate() - 180); if (entryDate < cutoff) return false; }
    if (filter === "365") { const cutoff = new Date(); cutoff.setDate(now.getDate() - 365); if (entryDate < cutoff) return false; }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (e.incident_description?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q));
    }
    return true;
  });

  const getEvidenceSummary = (id: string) => {
    const counts = evidenceCounts[id];
    if (!counts) return null;
    const parts: string[] = [];
    if (counts.photo) parts.push(`${counts.photo} photo${counts.photo > 1 ? "s" : ""}`);
    if (counts.video) parts.push(`${counts.video} video${counts.video > 1 ? "s" : ""}`);
    if (counts.audio) parts.push(`${counts.audio} audio`);
    if (counts.document) parts.push(`${counts.document} doc${counts.document > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen -m-4 sm:-m-6 lg:-m-10 p-4 sm:p-6 lg:p-10" style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E1B4B 100%)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="font-mono text-[11px] tracking-widest text-purple-300/70 uppercase mb-1">My Safety Journal</p>
            <h1 className="font-heading text-2xl sm:text-3xl text-white mb-2">{firstName}'s Safety Journal</h1>
            <p className="font-body text-sm text-purple-200/80 max-w-2xl mb-3">
              Private documentation for anyone experiencing abuse.
            </p>
            <p className="font-body text-sm text-purple-200/60 max-w-2xl mb-4">
              Whether you're a woman, man, queer person, child or elder — abuse thrives in silence. My Safety Journal helps you quietly record what is happening while it is still fresh, so you are not left with only your memory later.
            </p>
            <ul className="font-body text-sm text-purple-200/60 max-w-2xl space-y-1.5 list-disc list-inside">
              <li>Record incidents with dates, times and details in your own words.</li>
              <li>Upload photos, videos or voice recordings of injuries, damage or threats.</li>
              <li>Save screenshots of messages, emails and social‑media posts.</li>
              <li>Export everything to share with lawyers, police or trusted contacts when you're ready.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Link to="/dashboard/journal/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors">
              <Plus className="h-4 w-4" /> New Entry
            </Link>
            {entries.length > 0 && (
              <Link to="/dashboard/journal/export" className="inline-flex items-center gap-2 px-5 py-2.5 border border-purple-400/30 text-purple-200 font-body font-medium text-sm rounded-lg hover:bg-white/5 transition-colors">
                <FileDown className="h-4 w-4" /> Export to PDF
              </Link>
            )}
          </div>

          {/* Filter & Search */}
          {entries.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-purple-400/20 bg-white/10 text-purple-100 font-body text-sm backdrop-blur-sm">
                <option value="all" className="bg-[#1E1B4B] text-white">All Entries</option>
                <option value="30" className="bg-[#1E1B4B] text-white">Last 30 Days</option>
                <option value="180" className="bg-[#1E1B4B] text-white">Last 6 Months</option>
                <option value="365" className="bg-[#1E1B4B] text-white">Last Year</option>
              </select>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-300/50" />
                <input
                  type="text" placeholder="Search entries..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-purple-400/20 bg-white/10 text-purple-100 placeholder:text-purple-300/40 font-body text-sm backdrop-blur-sm"
                />
              </div>
            </div>
          )}

          {/* Entry List */}
          {filteredEntries.length === 0 ? (
            <div className="rounded-2xl p-12 text-center" style={{ background: '#F5F3FF', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
              <div className="text-4xl mb-4">📝</div>
              <h2 className="font-heading text-lg text-[#1E1B4B] mb-2">
                {entries.length === 0 ? "You have not documented any incidents yet" : "No entries match your search"}
              </h2>
              <p className="font-body text-sm text-[#6B7280] mb-6 max-w-md mx-auto">
                {entries.length === 0
                  ? "When something worries you, writing it down here can help you see patterns and remember details later."
                  : "Try adjusting your filters or search terms."}
              </p>
              {entries.length === 0 && (
                <Link to="/dashboard/journal/new" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors">
                  <Plus className="h-4 w-4" /> Create First Entry
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map(entry => {
                const evSummary = getEvidenceSummary(entry.id);
                return (
                  <div key={entry.id} className="rounded-2xl p-5 hover:shadow-lg transition-all" style={{ background: '#F5F3FF', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-xs text-primary">📅</span>
                          <span className="font-body text-sm font-semibold text-[#1E1B4B]">
                            {new Date(entry.entry_date).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                          <span className="font-body text-xs text-[#6B7280]">at {entry.entry_time?.slice(0, 5)}</span>
                        </div>
                        {entry.location && (
                          <p className="font-body text-xs text-[#6B7280] mb-1">📍 {entry.location}</p>
                        )}
                        <p className="font-body text-sm text-[#374151] line-clamp-2">
                          {entry.incident_description.slice(0, 150)}{entry.incident_description.length > 150 ? "..." : ""}
                        </p>
                        {evSummary && (
                          <p className="font-mono text-[10px] text-[#6B7280] mt-2">📎 {evSummary}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link to={`/dashboard/journal/${entry.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-body font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Link>
                        <Link to={`/dashboard/journal/export?entry=${entry.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-body font-medium text-[#6B7280] hover:bg-[#EDE9FE] rounded-lg transition-colors">
                          <FileDown className="h-3.5 w-3.5" /> PDF
                        </Link>
                        <button onClick={() => setDeleteId(entry.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-body font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Legal Disclaimer */}
          <div className="mt-8 rounded-2xl p-5" style={{ background: '#F5F3FF', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderLeft: '4px solid #7C3AED' }}>
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-sm text-[#1E1B4B] mb-2">Legal disclaimer</h3>
                <p className="font-body text-xs text-[#6B7280] leading-relaxed">
                  My Safety Journal is a documentation tool to help you organise incidents and share information with people supporting you. It does not guarantee that any entry or file will be accepted as evidence in court.
                </p>
                <p className="font-body text-xs text-[#6B7280] leading-relaxed mt-2">
                  Under South African law (including the Electronic Communications and Transactions Act), digital information can be used in legal processes if it is properly authenticated and presented by a legal professional. Always speak to a lawyer, Legal Aid South Africa (0800 110 110), or another qualified advisor before relying on journal entries in a case.
                </p>
                <p className="font-body text-xs text-[#6B7280] leading-relaxed mt-2">
                  This tool does not replace: reporting to the police (10111), getting medical care, or speaking to a qualified attorney.
                </p>
              </div>
            </div>
          </div>

          {/* Delete confirmation modal */}
          {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
              <div className="rounded-2xl p-6 max-w-sm w-full shadow-xl" style={{ background: '#F5F3FF' }} onClick={e => e.stopPropagation()}>
                <h3 className="font-heading text-lg text-[#1E1B4B] mb-2">Delete this entry?</h3>
                <p className="font-body text-sm text-[#6B7280] mb-6">Are you sure you want to delete this entry? This action cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setDeleteId(null)} className="px-4 py-2 font-body text-sm font-medium text-[#374151] border border-[#D1D5DB] rounded-lg hover:bg-[#EDE9FE] transition-colors">Cancel</button>
                  <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 font-body text-sm font-bold text-white bg-destructive rounded-lg hover:opacity-90 transition-colors">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
