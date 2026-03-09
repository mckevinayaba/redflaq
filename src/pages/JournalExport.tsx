import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileDown, ArrowLeft, Loader2 } from "lucide-react";
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

export default function JournalExport() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exportType, setExportType] = useState<"all" | "range" | "single">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [includeDescriptions, setIncludeDescriptions] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeWitnesses, setIncludeWitnesses] = useState(true);
  const [includeDeclaration, setIncludeDeclaration] = useState(true);

  const singleEntryId = searchParams.get("entry");

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) fetchEntries();
  }, [user, authLoading]);

  useEffect(() => {
    if (singleEntryId) setExportType("single");
  }, [singleEntryId]);

  const fetchEntries = async () => {
    const { data } = await supabase.from("journal_entries").select("*").eq("user_id", user!.id).order("entry_date", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  const getFilteredEntries = () => {
    if (exportType === "single" && singleEntryId) return entries.filter(e => e.id === singleEntryId);
    if (exportType === "range" && fromDate && toDate) return entries.filter(e => e.entry_date >= fromDate && e.entry_date <= toDate);
    return entries;
  };

  const getUserName = () => {
    return user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  };

  const handleExport = async () => {
    setGenerating(true);
    const filtered = getFilteredEntries();
    if (filtered.length === 0) { toast({ title: "No entries to export", variant: "destructive" }); setGenerating(false); return; }

    // Dynamic import html2pdf
    const html2pdf = (await import("html2pdf.js")).default;

    const userName = getUserName();
    const exportDate = new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });
    const dateRange = exportType === "range" && fromDate && toDate
      ? `${new Date(fromDate).toLocaleDateString("en-ZA")} – ${new Date(toDate).toLocaleDateString("en-ZA")}`
      : exportType === "single" ? "Single Entry" : "All Entries";

    let html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #7C3AED;">
          <h1 style="font-size: 28px; color: #7C3AED; margin-bottom: 8px;">Safety Journal</h1>
          <p style="font-size: 14px; color: #666;">${userName}</p>
          <p style="font-size: 12px; color: #999;">${dateRange} · Exported ${exportDate}</p>
        </div>
    `;

    // Table of contents for multiple entries
    if (filtered.length > 1) {
      html += `<div style="margin-bottom: 30px;"><h2 style="font-size: 16px; color: #333; margin-bottom: 12px;">Contents</h2><ol style="font-size: 13px; color: #555; padding-left: 20px;">`;
      filtered.forEach((e, i) => {
        html += `<li style="margin-bottom: 4px;">${new Date(e.entry_date).toLocaleDateString("en-ZA")} at ${e.entry_time?.slice(0, 5)} ${e.location ? `— ${e.location}` : ""}</li>`;
      });
      html += `</ol></div><hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">`;
    }

    // Entries
    filtered.forEach((entry, i) => {
      html += `<div style="page-break-inside: avoid; margin-bottom: 30px; padding: 20px; border: 1px solid #e5e5e5; border-radius: 8px;">`;

      if (includeTimestamps) {
        html += `<div style="margin-bottom: 16px;">
          <p style="font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">
            📅 ${new Date(entry.entry_date).toLocaleDateString("en-ZA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${entry.entry_time?.slice(0, 5)}
          </p>
          ${entry.location ? `<p style="font-size: 13px; color: #666;">📍 ${entry.location}</p>` : ""}
        </div>`;
      }

      if (includeDescriptions) {
        html += `<div style="margin-bottom: 12px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 6px;">Incident Description</p>
          <p style="font-size: 14px; color: #333; line-height: 1.7; white-space: pre-wrap;">${entry.incident_description}</p>
        </div>`;
      }

      if (entry.injuries_damage) {
        html += `<div style="margin-bottom: 12px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 6px;">Injuries or Damage</p>
          <p style="font-size: 14px; color: #333; line-height: 1.7; white-space: pre-wrap;">${entry.injuries_damage}</p>
        </div>`;
      }

      if (includeWitnesses && entry.witnesses) {
        html += `<div style="margin-bottom: 12px;">
          <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #999; margin-bottom: 6px;">Witnesses</p>
          <p style="font-size: 14px; color: #333; line-height: 1.7;">${entry.witnesses}</p>
        </div>`;
      }

      html += `<p style="font-size: 10px; color: #bbb; margin-top: 12px;">Entry created: ${new Date(entry.created_at).toLocaleString("en-ZA")}</p>`;
      html += `</div>`;
    });

    // Declaration
    if (includeDeclaration) {
      html += `
        <div style="page-break-before: always; margin-top: 40px; padding: 24px; border: 2px solid #7C3AED; border-radius: 8px;">
          <h2 style="font-size: 16px; color: #7C3AED; margin-bottom: 12px;">Declaration</h2>
          <p style="font-size: 13px; color: #333; line-height: 1.8;">
            I, ${userName}, recorded these entries as honestly and accurately as I can. I created these entries myself on the dates and times shown. I understand that only a court can decide whether and how this information may be used as evidence.
          </p>
          <div style="margin-top: 24px; display: flex; justify-content: space-between;">
            <div>
              <p style="font-size: 12px; color: #999;">Signed:</p>
              <p style="font-size: 14px; font-weight: 700; color: #333;">${userName}</p>
            </div>
            <div>
              <p style="font-size: 12px; color: #999;">Date:</p>
              <p style="font-size: 14px; font-weight: 700; color: #333;">${exportDate}</p>
            </div>
          </div>
        </div>
      `;
    }

    html += `</div>`;

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    try {
      await (html2pdf() as any).set({
        margin: [10, 10, 10, 10],
        filename: `SafetyJournal_${userName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      }).from(container).save();
      toast({ title: "PDF exported successfully" });
    } catch (err) {
      toast({ title: "Export failed", description: "Please try again.", variant: "destructive" });
    }

    document.body.removeChild(container);
    setGenerating(false);
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

  const filtered = getFilteredEntries();

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        <Link to="/dashboard/journal" className="inline-flex items-center gap-1.5 font-body text-sm text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>

        <h1 className="font-heading text-2xl text-foreground mb-2">Export Journal Entries</h1>
        <p className="font-body text-sm text-muted-foreground mb-6">
          Create a PDF bundle of your entries to share with a lawyer, social worker, or trusted person. They can advise you on how to use this information.
        </p>

        <div className="space-y-6">
          {/* Selection */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-3">Select entries</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="exportType" value="all" checked={exportType === "all"} onChange={() => setExportType("all")} className="accent-primary" />
                <span className="font-body text-sm text-foreground">All Entries ({entries.length} total)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="exportType" value="range" checked={exportType === "range"} onChange={() => setExportType("range")} className="accent-primary" />
                <span className="font-body text-sm text-foreground">Date Range</span>
              </label>
              {exportType === "range" && (
                <div className="flex gap-3 ml-7">
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-foreground font-body text-sm" />
                  <span className="font-body text-sm text-muted-foreground self-center">to</span>
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-card text-foreground font-body text-sm" />
                </div>
              )}
              {singleEntryId && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="exportType" value="single" checked={exportType === "single"} onChange={() => setExportType("single")} className="accent-primary" />
                  <span className="font-body text-sm text-foreground">Selected Entry Only</span>
                </label>
              )}
            </div>
          </div>

          {/* Include options */}
          <div className="bg-card rounded-xl border border-border p-5">
            <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-3">Include in PDF</p>
            <div className="space-y-2.5">
              {[
                { label: "Full incident descriptions", state: includeDescriptions, setter: setIncludeDescriptions },
                { label: "Timestamps and locations", state: includeTimestamps, setter: setIncludeTimestamps },
                { label: "Witness information", state: includeWitnesses, setter: setIncludeWitnesses },
                { label: "Declaration statement", state: includeDeclaration, setter: setIncludeDeclaration },
              ].map(opt => (
                <label key={opt.label} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={opt.state} onChange={() => opt.setter(!opt.state)} className="accent-primary" />
                  <span className="font-body text-sm text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          <p className="font-body text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "entry" : "entries"} will be included in the export.
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleExport} disabled={generating || filtered.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors disabled:opacity-50">
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <><FileDown className="h-4 w-4" /> Generate PDF</>}
            </button>
            <button onClick={() => navigate("/dashboard/journal")}
              className="px-6 py-3 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
