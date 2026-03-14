import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft, FileDown, Trash2, Download, Eye, Scale, CheckCircle, Lock, Edit, MessageCircle } from "lucide-react";
import { getWhatsAppShareUrl, WHATSAPP_MESSAGES } from "@/constants/whatsapp";
import { useToast } from "@/hooks/use-toast";
import { generateVerificationCertificate } from "@/utils/pdfCertificate";

interface Evidence {
  id: string;
  file_type: string;
  file_url: string;
  file_name: string;
  file_size: number;
  file_hash?: string | null;
  uploaded_at?: string | null;
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
  const [entry, setEntry] = useState<any>(null);
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
    const evidenceItems = (evData || []) as Evidence[];
    setEvidence(evidenceItems);

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

  const handleDownloadCertificate = () => {
    if (!entry) return;
    generateVerificationCertificate({
      entry: {
        id: entry.id,
        entry_date: entry.entry_date,
        entry_time: entry.entry_time,
        incident_description: entry.incident_description,
        about_person: entry.about_person,
        abuse_types: entry.abuse_types,
        weapon_involved: entry.weapon_involved,
        weapon_description: entry.weapon_description,
        medical_attention: entry.medical_attention,
        medical_details: entry.medical_details,
        police_reported: entry.police_reported,
        police_case_number: entry.police_case_number,
        children_present: entry.children_present,
        location: entry.location,
        witnesses: entry.witnesses,
        injuries_damage: entry.injuries_damage,
        emotional_state: entry.emotional_state,
        statement_hash: entry.statement_hash,
        hash_generated_at: entry.hash_generated_at,
        created_at: entry.created_at,
      },
      evidence: evidence.map(ev => ({
        file_name: ev.file_name,
        file_type: ev.file_type,
        file_size: ev.file_size,
        file_hash: ev.file_hash,
        uploaded_at: ev.uploaded_at,
      })),
    });
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

  const isVerified = !!entry.statement_hash;

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
            {entry.about_person && (
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">About</p>
                <p className="font-body text-sm text-foreground">{entry.about_person}</p>
              </div>
            )}
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
          <p className="font-body text-xs text-muted-foreground mb-3">This is exactly what you wrote at the time.</p>
          <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.incident_description}</p>
        </div>

        {/* Enhanced fields display */}
        {(entry.abuse_types?.length > 0 || entry.weapon_involved || entry.medical_attention || entry.police_reported || entry.children_present || entry.emotional_state) && (
          <div className="bg-card rounded-xl border border-border p-5 mb-6 space-y-3">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Additional Details</p>
            {entry.abuse_types?.length > 0 && (
              <div>
                <span className="font-body text-xs text-muted-foreground">Type of abuse: </span>
                <span className="font-body text-sm text-foreground">{entry.abuse_types.join(" • ")}</span>
              </div>
            )}
            {entry.weapon_involved && (
              <div>
                <span className="font-body text-xs text-muted-foreground">Weapon involved: </span>
                <span className="font-body text-sm text-foreground">Yes{entry.weapon_description ? ` — ${entry.weapon_description}` : ''}</span>
              </div>
            )}
            {entry.medical_attention && (
              <div>
                <span className="font-body text-xs text-muted-foreground">Medical attention: </span>
                <span className="font-body text-sm text-foreground">Yes{entry.medical_details ? ` — ${entry.medical_details}` : ''}</span>
              </div>
            )}
            {entry.police_reported && (
              <div>
                <span className="font-body text-xs text-muted-foreground">Police report: </span>
                <span className="font-body text-sm text-foreground">Yes{entry.police_case_number ? ` — ${entry.police_case_number}` : ''}</span>
              </div>
            )}
            {entry.children_present && (
              <div>
                <span className="font-body text-xs text-muted-foreground">Children present: </span>
                <span className="font-body text-sm text-foreground">Yes</span>
              </div>
            )}
            {entry.emotional_state && (
              <div>
                <span className="font-body text-xs text-muted-foreground">Emotional state: </span>
                <span className="font-body text-sm text-foreground">{entry.emotional_state}</span>
              </div>
            )}
          </div>
        )}

        {/* Injuries / Damage */}
        {entry.injuries_damage && (
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Injuries or Damage</p>
            <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.injuries_damage}</p>
          </div>
        )}

        {/* Addendum */}
        {entry.addendum_notes && (
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Addendum</p>
            {entry.last_edited_at && (
              <p className="font-mono text-[10px] text-muted-foreground mb-2">Added: {new Date(entry.last_edited_at).toLocaleString('en-ZA')}</p>
            )}
            <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.addendum_notes}</p>
          </div>
        )}

        {/* Evidence */}
        {evidence.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-5 mb-6">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Evidence</p>
            <p className="font-body text-xs text-muted-foreground mb-4">These files stay linked to this entry.</p>
            <div className="space-y-3">
              {evidence.map(ev => {
                const url = signedUrls[ev.id];
                return (
                  <div key={ev.id} className="border border-border rounded-lg p-3">
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

        {/* Verification Certificate Section */}
        {isVerified && (
          <div className="mb-6 p-5" style={{ borderRadius: 14, background: '#F5F3FF', borderLeft: '4px solid #7C3AED' }}>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-mono text-[10px] tracking-wider uppercase text-primary font-bold mb-2">Verified Entry</p>
                <p className="font-body text-sm text-foreground mb-1">
                  This entry was verified and cryptographically locked on{' '}
                  {entry.hash_generated_at ? new Date(entry.hash_generated_at).toLocaleString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : 'N/A'}.
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Entry ID: {entry.id.slice(0, 8)}...{entry.id.slice(-4)}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground mb-3">
                  Hash: {entry.statement_hash?.slice(0, 16)}...{entry.statement_hash?.slice(-8)}
                </p>
                <button onClick={handleDownloadCertificate}
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary font-body font-bold text-sm rounded-lg hover:bg-primary/5 transition-colors">
                  <Download className="h-4 w-4" /> Download Verification Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link to={`/dashboard/journal/${entry.id}/edit`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors">
            <Edit className="h-4 w-4" /> Edit Entry
          </Link>
          <Link to={`/dashboard/journal/export?entry=${entry.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors">
            <FileDown className="h-4 w-4" /> Export to PDF
          </Link>
          <a
            href={getWhatsAppShareUrl(WHATSAPP_MESSAGES.journalShare)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border text-muted-foreground font-body font-medium text-xs rounded-lg hover:bg-muted transition-colors"
            style={{ textDecoration: 'none' }}
          >
            <MessageCircle className="h-3.5 w-3.5" style={{ color: '#25D366' }} /> Share with trusted person via WhatsApp
          </a>
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
                My Safety Journal is a documentation tool. It does not guarantee that any entry or file will be accepted as evidence in court. Under South African law (ECTA), digital records may be used if properly authenticated. Always consult Legal Aid SA (0800 110 110) or a qualified attorney.
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
