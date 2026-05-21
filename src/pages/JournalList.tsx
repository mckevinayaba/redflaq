import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { generateTimelinePDF } from "@/utils/pdfTimeline";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileJournal from "@/components/mobile/screens/MobileJournal";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const card: React.CSSProperties = {
  background: '#111118',
  border: '1px solid rgba(108,53,222,0.25)',
  borderRadius: 8,
};

const inputStyle: React.CSSProperties = {
  ...inter as React.CSSProperties,
  fontSize: 14,
  color: '#d1d1d6',
  background: '#0d0d1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  padding: '10px 14px',
  outline: 'none',
  width: '100%',
};

interface JournalEntry {
  id: string;
  entry_date: string;
  entry_time: string;
  incident_description: string;
  location: string | null;
  witnesses: string | null;
  injuries_damage: string | null;
  created_at: string;
  about_person?: string | null;
  statement_hash?: string | null;
  hash_generated_at?: string | null;
  abuse_types?: string[] | null;
  weapon_involved?: boolean | null;
  weapon_description?: string | null;
  medical_attention?: boolean | null;
  medical_details?: string | null;
  police_reported?: boolean | null;
  police_case_number?: string | null;
  children_present?: boolean | null;
  emotional_state?: string | null;
  addendum_notes?: string | null;
  last_edited_at?: string | null;
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
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState("all");
  const [timelineDateFrom, setTimelineDateFrom] = useState("");
  const [timelineDateTo, setTimelineDateTo] = useState("");

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Your";

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
    setEntries((data as JournalEntry[]) || []);

    if (data && data.length > 0) {
      const ids = data.map(e => e.id);
      const { data: evData } = await supabase.from("journal_evidence").select("entry_id, file_type").in("entry_id", ids);
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
    const now = new Date(); const entryDate = new Date(e.entry_date);
    if (filter === "30") { const cutoff = new Date(); cutoff.setDate(now.getDate() - 30); if (entryDate < cutoff) return false; }
    if (filter === "180") { const cutoff = new Date(); cutoff.setDate(now.getDate() - 180); if (entryDate < cutoff) return false; }
    if (filter === "365") { const cutoff = new Date(); cutoff.setDate(now.getDate() - 365); if (entryDate < cutoff) return false; }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (e.incident_description?.toLowerCase().includes(q) || e.location?.toLowerCase().includes(q) || e.about_person?.toLowerCase().includes(q));
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

  const uniquePersons = [...new Set(entries.map(e => e.about_person).filter(Boolean) as string[])].sort();

  const handleGenerateTimeline = () => {
    let filtered = [...entries];
    if (timelineFilter !== "all") filtered = filtered.filter(e => e.about_person === timelineFilter);
    if (timelineDateFrom) filtered = filtered.filter(e => e.entry_date >= timelineDateFrom);
    if (timelineDateTo) filtered = filtered.filter(e => e.entry_date <= timelineDateTo);
    if (filtered.length === 0) { toast({ title: "No entries match", description: "Adjust your filters.", variant: "destructive" }); return; }
    generateTimelinePDF({ entries: filtered, userName: firstName, filterPerson: timelineFilter === "all" ? undefined : timelineFilter });
    setShowTimeline(false);
    toast({ title: "Timeline PDF downloaded" });
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: 28, height: 28, border: '3px solid rgba(108,53,222,0.2)', borderTopColor: '#6C35DE', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ ...mono, fontSize: 10, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
          Your Safety Journal
        </p>
        <h1 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 8 }}>
          {firstName}'s Safety Journal
        </h1>
        <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7, maxWidth: 600, marginBottom: 8 }}>
          Track what changed. Record what felt off. Preserve clarity before memory gets manipulated.
        </p>
        <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7, maxWidth: 600 }}>
          Court-admissible when you need it. Invisible until then.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
        <Link to="/dashboard/journal/new" style={{
          ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff',
          background: '#6C35DE', padding: '10px 20px', borderRadius: 4,
          textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Record Something
        </Link>
        {entries.length > 0 && (
          <>
            <button onClick={() => setShowTimeline(true)} style={{
              ...inter, fontSize: 14, fontWeight: 600, color: '#6C35DE',
              background: 'transparent', border: '1px solid rgba(108,53,222,0.35)',
              padding: '10px 18px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              Export Timeline
            </button>
            <Link to="/dashboard/journal/export" style={{
              ...inter, fontSize: 14, fontWeight: 600, color: '#d1d1d6',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              padding: '10px 18px', borderRadius: 4, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              Export to PDF
            </Link>
          </>
        )}
      </div>

      {/* Filter & Search */}
      {entries.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3" style={{ marginBottom: 24 }}>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ ...inputStyle, width: 'auto', minWidth: 160 }}
            onFocus={e => e.target.style.borderColor = '#6C35DE'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <option value="all">All Entries</option>
            <option value="30">Last 30 Days</option>
            <option value="180">Last 6 Months</option>
            <option value="365">Last Year</option>
          </select>
          <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ ...inputStyle, paddingLeft: 38 }}
              onFocus={e => e.target.style.borderColor = '#6C35DE'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
        </div>
      )}

      {/* Entry list */}
      {filteredEntries.length === 0 ? (
        <div style={{
          ...card,
          padding: '48px 24px',
          textAlign: 'center',
          border: '2px dashed rgba(108,53,222,0.3)',
          background: '#0d0d1a',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <h2 style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            {entries.length === 0 ? "No journal entries yet" : "No entries match your search"}
          </h2>
          <p style={{ ...inter, fontSize: 14, color: '#8b8b91', maxWidth: 420, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {entries.length === 0
              ? "Start documenting patterns, incidents, or moments that felt off — privately and securely."
              : "Try adjusting your filters or search terms."}
          </p>
          {entries.length === 0 && (
            <Link to="/dashboard/journal/new" style={{
              ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff',
              background: '#6C35DE', padding: '12px 24px', borderRadius: 4, textDecoration: 'none',
            }}>
              Create Your First Entry
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredEntries.map(entry => {
            const evSummary = getEvidenceSummary(entry.id);
            const isVerified = !!entry.statement_hash;
            return (
              <div key={entry.id} style={{ ...card, padding: '20px 24px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#6C35DE'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,53,222,0.25)'}
              >
                <div className="flex flex-col sm:flex-row sm:items-start" style={{ justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ ...mono, fontSize: 11, color: '#6C35DE', fontWeight: 700 }}>
                        {new Date(entry.entry_date).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                      <span style={{ ...mono, fontSize: 11, color: '#8b8b91' }}>at {entry.entry_time?.slice(0, 5)}</span>
                      {isVerified && (
                        <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#27AE60', background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.25)', padding: '2px 8px', borderRadius: 4 }}>
                          Verified
                        </span>
                      )}
                    </div>
                    {entry.about_person && (
                      <p style={{ ...inter, fontSize: 12, color: '#6C35DE', marginBottom: 4 }}>About: {entry.about_person}</p>
                    )}
                    {entry.location && (
                      <p style={{ ...mono, fontSize: 11, color: '#8b8b91', marginBottom: 6 }}>{entry.location}</p>
                    )}
                    <p style={{ ...inter, fontSize: 14, color: '#d1d1d6', lineHeight: 1.6 }}>
                      {entry.incident_description.slice(0, 150)}{entry.incident_description.length > 150 ? "..." : ""}
                    </p>
                    {evSummary && (
                      <p style={{ ...mono, fontSize: 10, color: '#8b8b91', marginTop: 8 }}>Attachments: {evSummary}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <Link to={`/dashboard/journal/${entry.id}`} style={{
                      ...inter, fontSize: 13, fontWeight: 600, color: '#6C35DE',
                      textDecoration: 'none', padding: '6px 12px', borderRadius: 4,
                      background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.2)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      View
                    </Link>
                    <Link to={`/dashboard/journal/export?entry=${entry.id}`} style={{
                      ...inter, fontSize: 13, fontWeight: 600, color: '#8b8b91',
                      textDecoration: 'none', padding: '6px 12px', borderRadius: 4,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      PDF
                    </Link>
                    <button onClick={() => setDeleteId(entry.id)} style={{
                      ...inter, fontSize: 13, fontWeight: 600, color: '#C0392B',
                      background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)',
                      padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legal disclaimer */}
      <div style={{ ...card, padding: '20px 24px', marginTop: 32, borderLeft: '3px solid rgba(108,53,222,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <h3 style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Legal disclaimer</h3>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.7 }}>
              My Safety Journal is a documentation tool to help you organise incidents and share information with people supporting you. It does not guarantee that any entry or file will be accepted as evidence in court.
            </p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.7, marginTop: 8 }}>
              Under South African law (including the Electronic Communications and Transactions Act), digital information can be used in legal processes if properly authenticated. Always speak to a lawyer, Legal Aid South Africa (0800 110 110), or another qualified advisor before relying on journal entries in a case.
            </p>
          </div>
        </div>
      </div>

      {/* Delete modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', padding: 16 }}
          onClick={() => setDeleteId(null)}>
          <div style={{ ...card, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <h3 style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Delete this entry?</h3>
            <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 24 }}>Are you sure you want to delete this entry? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ ...inter, fontSize: 14, fontWeight: 600, color: '#d1d1d6', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', padding: '10px 18px', borderRadius: 4, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#C0392B', border: 'none', padding: '10px 18px', borderRadius: 4, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Export modal */}
      {showTimeline && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', padding: 16 }}
          onClick={() => setShowTimeline(false)}>
          <div style={{ ...card, padding: 28, maxWidth: 520, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.6)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff' }}>Export Incident Timeline</h3>
              <button onClick={() => setShowTimeline(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b8b91', padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 24, lineHeight: 1.6 }}>
              Export a chronological timeline for Legal Aid SA, lawyers, or social workers.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ ...mono, fontSize: 10, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>
                  Filter by Person (Optional)
                </label>
                <select value={timelineFilter} onChange={e => setTimelineFilter(e.target.value)} style={inputStyle}>
                  <option value="all">All entries</option>
                  {uniquePersons.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ ...mono, fontSize: 10, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>From</label>
                  <input type="date" value={timelineDateFrom} onChange={e => setTimelineDateFrom(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={{ ...mono, fontSize: 10, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 }}>To</label>
                  <input type="date" value={timelineDateTo} onChange={e => setTimelineDateTo(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
              <button onClick={() => setShowTimeline(false)} style={{ ...inter, fontSize: 14, fontWeight: 600, color: '#d1d1d6', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', padding: '10px 18px', borderRadius: 4, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleGenerateTimeline} style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#6C35DE', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer' }}>
                Generate Timeline PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
