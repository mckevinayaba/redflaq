import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft, FileDown, Trash2, Download, Eye, Scale } from "lucide-react";
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

interface Evidence {
  id: string;
  file_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function JournalDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user && id) fetchEntry();
  }, [user, authLoading, id]);

  const fetchEntry = async () => {
    const { data, error } = await supabase.from("journal_entries").select("*").eq("id", id!).single();
    if (error || !data) { toast({ title: "Entry not found", variant: "destructive" }); navigate("/dashboard/journal"); return; }
    setEntry(data);

    const { data: evData } = await supabase.from("journal_evidence").select("*").eq("entry_id", id!);
    const evidenceItems = evData || [];
    setEvidence(evidenceItems);

    // Generate signed URLs for viewing
    const urls: Record<string, string> = {};
    for (const ev of evidenceItems) {
      const path = extractPath(ev.file_url);
      if (path) {
        const { data: signed } = await supabase.storage.from("journal-evidence").createSignedUrl(path, 3600);
        if (signed?.signedUrl) urls[ev.id] = signed.signedUrl;
      }
    }
    setSignedUrls(urls);
    setLoading(false);
  };

  const extractPath = (url: string) => {
    const idx = url.indexOf("journal-evidence/");
    if (idx >= 0) return url.substring(idx + "journal-evidence/".length);
    return url;
  };

  const handleDelete = async () => {
    if (!entry) return;
    if (evidence.length > 0) {
      const paths = evidence.map(e => extractPath(e.file_url)).filter(Boolean);
      if (paths.length > 0) await supabase.storage.from("journal-evidence").remove(paths);
    }
    const { error } = await supabase.from("journal_entries").delete().eq("id", entry.id);
    if (error) toast({ title: "Error deleting entry", description: error.message, variant: "destructive" });
    else { toast({ title: "Entry deleted" }); navigate("/dashboard/journal"); }
  };

  const handleDownload = async (ev: Evidence) => {
    const path = extractPath(ev.file_url);
    const { data } = await supabase.storage.from("journal-evidence").download(path);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = ev.file_name;
      a.click();
      URL.revokeObjectURL(url);
    }
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

  if (!entry) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard/journal" className="inline-flex items-center gap-1.5 font-body text-sm text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>

        <div className="mb-6">
          <h1 className="font-heading text-2xl text-foreground mb-1">Journal Entry</h1>
        </div>

        {/* Metadata */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Date & Time</p>
              <p className="font-body text-sm text-foreground font-semibold">
                📅 {new Date(entry.entry_date).toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {entry.entry_time?.slice(0, 5)}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Created</p>
              <p className="font-body text-sm text-muted-foreground">{new Date(entry.created_at).toLocaleString("en-ZA")}</p>
            </div>
            {entry.location && (
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Location</p>
                <p className="font-body text-sm text-foreground">📍 {entry.location}</p>
              </div>
            )}
            {entry.witnesses && (
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Witnesses</p>
                <p className="font-body text-sm text-foreground">{entry.witnesses}</p>
              </div>
            )}
          </div>
        </div>

        {/* Incident Description */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Incident description</p>
          <p className="font-body text-xs text-muted-foreground mb-3">This is exactly what you wrote at the time. If you need to correct something, you can add a new entry with the updated information.</p>
          <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.incident_description}</p>
        </div>

        {/* Injuries / Damage */}
        {entry.injuries_damage && (
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Injuries or Damage</p>
            <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.injuries_damage}</p>
          </div>
        )}

        {/* Evidence */}
        {evidence.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Evidence</p>
            <p className="font-body text-xs text-muted-foreground mb-4">These files stay linked to this entry. You can download them for sharing with a lawyer, counsellor, or support service.</p>
            <div className="space-y-3">
              {evidence.map(ev => {
                const url = signedUrls[ev.id];
                return (
                  <div key={ev.id} className="border border-border rounded-lg p-3">
                    {/* Thumbnail for images */}
                    {ev.file_type === "photo" && url && (
                      <img src={url} alt={ev.file_name} className="w-full max-h-48 object-cover rounded-lg mb-3" />
                    )}
                    {ev.file_type === "video" && url && (
                      <video src={url} controls className="w-full max-h-48 rounded-lg mb-3" />
                    )}
                    {ev.file_type === "audio" && url && (
                      <audio src={url} controls className="w-full mb-3" />
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span>{ev.file_type === "photo" ? "📷" : ev.file_type === "video" ? "🎥" : ev.file_type === "audio" ? "🎤" : "📄"}</span>
                        <span className="font-body text-sm text-foreground truncate">{ev.file_name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">({formatFileSize(ev.file_size)})</span>
                      </div>
                      <div className="flex gap-2">
                        {url && (
                          <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors">
                            <Eye className="h-4 w-4" />
                          </a>
                        )}
                        <button onClick={() => handleDownload(ev)} className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to={`/dashboard/journal/export?entry=${entry.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors">
            <FileDown className="h-4 w-4" /> Export to PDF
          </Link>
          <button onClick={() => setShowDelete(true)} className="inline-flex items-center gap-2 px-5 py-2.5 border border-destructive text-destructive font-body font-medium text-sm rounded-lg hover:bg-destructive/10 transition-colors">
            <Trash2 className="h-4 w-4" /> Delete Entry
          </button>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-muted/50 rounded-xl border border-border p-5">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-heading text-sm text-foreground mb-2">Legal disclaimer</h3>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">
                My Safety Journal is a documentation tool to help you organise incidents and share information with people supporting you. It does not guarantee that any entry or file will be accepted as evidence in court.
              </p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed mt-2">
                Under South African law (including the Electronic Communications and Transactions Act), digital information can be used in legal processes if it is properly authenticated and presented by a legal professional. Always speak to a lawyer, Legal Aid South Africa (0800 110 110), or another qualified advisor before relying on journal entries in a case.
              </p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed mt-2">
                This tool does not replace: reporting to the police (10111), getting medical care, or speaking to a qualified attorney.
              </p>
            </div>
          </div>
        </div>

        {/* Delete confirmation */}
        {showDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDelete(false)}>
            <div className="bg-card rounded-xl border border-border p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="font-heading text-lg text-foreground mb-2">Delete this entry?</h3>
              <p className="font-body text-sm text-muted-foreground mb-6">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowDelete(false)} className="px-4 py-2 font-body text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 font-body text-sm font-bold text-destructive-foreground bg-destructive rounded-lg hover:opacity-90">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
