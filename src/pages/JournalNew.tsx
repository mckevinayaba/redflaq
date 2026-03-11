import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Save, X, Upload, Trash2, Lock, LogOut as QuickExitIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MIME_MAP: Record<string, string> = {
  "image/jpeg": "photo", "image/png": "photo", "image/gif": "photo", "image/webp": "photo",
  "video/mp4": "video", "video/quicktime": "video",
  "audio/mpeg": "audio", "audio/mp4": "audio", "audio/x-m4a": "audio",
  "application/pdf": "document",
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILES = 10;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function JournalNew() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0]
    || user?.email?.split("@")[0]
    || "Your";

  const now = new Date();
  const [entryDate, setEntryDate] = useState(now.toISOString().split("T")[0]);
  const [entryTime, setEntryTime] = useState(now.toTimeString().slice(0, 5));
  const [subjectPerson, setSubjectPerson] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [witnesses, setWitnesses] = useState("");
  const [injuries, setInjuries] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) navigate("/signup");
  }, [user, authLoading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleQuickExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleQuickExit = () => {
    window.location.href = "https://www.google.com";
  };

  const handleFileAdd = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles: File[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      if (!MIME_MAP[f.type]) { toast({ title: "Unsupported file type", description: `${f.name} is not a supported file type.`, variant: "destructive" }); continue; }
      if (f.size > MAX_FILE_SIZE) { toast({ title: "File too large", description: `${f.name} exceeds the 50MB limit.`, variant: "destructive" }); continue; }
      validFiles.push(f);
    }
    const total = files.length + validFiles.length;
    if (total > MAX_FILES) {
      toast({ title: "Too many files", description: `Maximum ${MAX_FILES} files per entry.`, variant: "destructive" });
      validFiles.splice(MAX_FILES - files.length);
    }
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { toast({ title: "Required", description: "Please describe what happened.", variant: "destructive" }); return; }

    const selectedDate = new Date(entryDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selectedDate > today) { toast({ title: "Date warning", description: "The date cannot be in the future.", variant: "destructive" }); return; }

    setSaving(true);

    const { data: entry, error: entryErr } = await supabase.from("journal_entries").insert({
      user_id: user!.id,
      entry_date: entryDate,
      entry_time: entryTime + ":00",
      incident_description: description.trim(),
      location: location.trim() || null,
      witnesses: witnesses.trim() || null,
      injuries_damage: injuries.trim() || null,
      subject_person: subjectPerson.trim() || null,
    } as any).select().single();

    if (entryErr || !entry) {
      toast({ title: "Error saving entry", description: entryErr?.message || "Unknown error", variant: "destructive" });
      setSaving(false);
      return;
    }

    if (files.length > 0) {
      setUploading(true);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop();
        const uniqueName = `${crypto.randomUUID()}.${ext}`;
        const path = `${user!.id}/${(entry as any).id}/${uniqueName}`;

        setUploadProgress(Math.round(((i) / files.length) * 100));

        const { error: uploadErr } = await supabase.storage.from("journal-evidence").upload(path, file);
        if (uploadErr) {
          toast({ title: "Upload failed", description: `${file.name}: ${uploadErr.message}`, variant: "destructive" });
          continue;
        }

        const { data: urlData } = supabase.storage.from("journal-evidence").getPublicUrl(path);

        await supabase.from("journal_evidence").insert({
          entry_id: (entry as any).id,
          file_type: MIME_MAP[file.type] || "document",
          file_url: urlData.publicUrl || path,
          file_name: file.name,
          file_size: file.size,
        });
      }
      setUploadProgress(100);
      setUploading(false);
    }

    toast({ title: "Journal entry saved successfully" });
    navigate(`/dashboard/journal/${(entry as any).id}`);
    setSaving(false);
  };

  const labelCls = "font-mono text-[11px] tracking-wider uppercase block mb-2" as const;
  const helperCls = "font-body text-xs block mb-2" as const;
  const inputCls = "w-full px-4 py-3 bg-white text-foreground font-body text-sm border border-border shadow-sm focus:outline-none focus:ring-0 transition-all" as const;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">New Entry</p>
          <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">{firstName}'s Safety Journal</h1>
          <p className="font-body text-sm text-muted-foreground">
            What you write here is private. Only you can see it when logged in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: '#5B21B6' }}>Date</label>
              <span className={helperCls} style={{ color: '#64748B' }}>When did this happen?</span>
              <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)}
                className={inputCls} style={{ borderRadius: 10 }} />
            </div>
            <div>
              <label className={labelCls} style={{ color: '#5B21B6' }}>Time</label>
              <span className={helperCls} style={{ color: '#64748B' }}>Approximate time</span>
              <input type="time" value={entryTime} onChange={e => setEntryTime(e.target.value)}
                className={inputCls} style={{ borderRadius: 10 }} />
            </div>
          </div>

          {/* Who Is This About */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Who Is This About? (Optional)</label>
            <span className={helperCls} style={{ color: '#64748B' }}>Name or description of the person involved — e.g. their first name, 'my landlord', 'my ex-partner'. This is for your reference only.</span>
            <input type="text" value={subjectPerson} onChange={e => setSubjectPerson(e.target.value)}
              placeholder="e.g. Thabo, my ex, my landlord John"
              className={inputCls} style={{ borderRadius: 10 }} />
          </div>

          {/* What Happened */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>What Happened? *</label>
            <span className={helperCls} style={{ color: '#64748B' }}>Describe the incident in detail. Include what was said or done, how it made you feel, and anything that worried you.</span>
            <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 5000))}
              rows={8} placeholder="Write what happened..."
              className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
            <p className="font-mono text-[10px] text-muted-foreground mt-1 text-right">{description.length} / 5000 characters</p>
          </div>

          {/* Location */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Location (Optional)</label>
            <span className={helperCls} style={{ color: '#64748B' }}>Where did this happen? (Home, workplace, street name, etc.)</span>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Home, Sandton City"
              className={inputCls} style={{ borderRadius: 10 }} />
          </div>

          {/* Witnesses */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Witnesses (Optional)</label>
            <span className={helperCls} style={{ color: '#64748B' }}>Names or descriptions of people who saw or heard what happened.</span>
            <textarea value={witnesses} onChange={e => setWitnesses(e.target.value)} rows={3} placeholder="e.g. My neighbour Thandi was in the next room"
              className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
          </div>

          {/* Injuries or Damage */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Injuries or Damage (Optional)</label>
            <span className={helperCls} style={{ color: '#64748B' }}>Describe any physical harm, threats, or damage to property.</span>
            <textarea value={injuries} onChange={e => setInjuries(e.target.value)} rows={3} placeholder="e.g. Bruise on left arm, broken phone screen"
              className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
          </div>

          {/* Evidence Upload */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Evidence (Optional)</label>
            <span className={helperCls} style={{ color: '#64748B' }}>Upload photos, videos, audio or documents that relate to this incident.</span>
            <div
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-primary"); }}
              onDragLeave={e => e.currentTarget.classList.remove("border-primary")}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("border-primary"); handleFileAdd(e.dataTransfer.files); }}
              className="border-2 border-dashed border-border p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-white"
              style={{ borderRadius: 14 }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-body text-sm text-foreground mb-1">Drag and drop files or click to browse</p>
              <p className="font-body text-xs text-muted-foreground">JPG, PNG, MP4, MOV, MP3, M4A, PDF · Max 50MB per file · Up to 10 files</p>
            </div>
            <input id="file-input" type="file" multiple accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/quicktime,audio/mpeg,audio/mp4,audio/x-m4a,application/pdf"
              onChange={e => handleFileAdd(e.target.files)} className="hidden" />

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-sm">{MIME_MAP[f.type] === "photo" ? "📷" : MIME_MAP[f.type] === "video" ? "🎥" : MIME_MAP[f.type] === "audio" ? "🎤" : "📄"}</span>
                      <span className="font-body text-sm text-foreground truncate">{f.name}</span>
                      <span className="font-mono text-[10px] text-muted-foreground flex-shrink-0">({formatFileSize(f.size)})</span>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {uploading && (
              <div className="mt-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground mt-1">Uploading files... {uploadProgress}%</p>
              </div>
            )}
          </div>

          {/* Privacy & Safety Notice */}
          <div className="bg-primary/5 border border-primary/20 p-5" style={{ borderRadius: 14 }}>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-sm text-foreground mb-2">Privacy & Safety</h3>
                <ul className="font-body text-xs text-muted-foreground space-y-1.5">
                  <li>• Entries are stored securely in the cloud.</li>
                  <li>• Only you can access your journal when logged in.</li>
                  <li>• If someone unsafe has access to your phone, use the Quick Exit button to close this page fast.</li>
                </ul>
                <button type="button" onClick={handleQuickExit}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground font-body font-bold text-xs rounded-lg hover:opacity-90 transition-colors">
                  <QuickExitIcon className="h-3.5 w-3.5" /> Quick Exit
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors disabled:opacity-50">
              <Lock className="h-4 w-4" /> {saving ? "Saving..." : "Save Entry"}
            </button>
            <button type="button" onClick={() => navigate("/dashboard/journal")}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
