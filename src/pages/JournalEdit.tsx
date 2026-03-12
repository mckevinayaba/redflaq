import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ArrowLeft, Lock, Save, Stethoscope, Users, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateStatementHash } from "@/utils/hashUtils";

const ABUSE_TYPES = [
  "Physical violence (hitting, kicking, choking, pushing)",
  "Sexual violence or assault",
  "Emotional or psychological abuse",
  "Verbal abuse or threats",
  "Economic abuse (controlling money, stopping you from working)",
  "Property damage (breaking belongings, destroying documents)",
  "Stalking or harassment",
  "Other",
];

const EMOTIONAL_OPTIONS = [
  "Scared", "Confused", "In shock", "Angry", "Ashamed", "Numb",
  "In pain", "Unsafe", "Calm but worried", "Helpless", "Other",
];

const MIME_MAP: Record<string, string> = {
  "image/jpeg": "photo", "image/png": "photo", "image/gif": "photo", "image/webp": "photo",
  "video/mp4": "video", "video/quicktime": "video",
  "audio/mpeg": "audio", "audio/mp4": "audio", "audio/x-m4a": "audio",
  "application/pdf": "document",
};

export default function JournalEdit() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [aboutPerson, setAboutPerson] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [witnesses, setWitnesses] = useState("");
  const [injuries, setInjuries] = useState("");
  const [abuseTypes, setAbuseTypes] = useState<string[]>([]);
  const [weaponInvolved, setWeaponInvolved] = useState(false);
  const [weaponDescription, setWeaponDescription] = useState("");
  const [medicalAttention, setMedicalAttention] = useState(false);
  const [medicalDetails, setMedicalDetails] = useState("");
  const [policeReported, setPoliceReported] = useState(false);
  const [policeCaseNumber, setPoliceCaseNumber] = useState("");
  const [childrenPresent, setChildrenPresent] = useState(false);
  const [emotionalState, setEmotionalState] = useState<string[]>([]);
  const [addendumNotes, setAddendumNotes] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entryTime, setEntryTime] = useState("");

  const isLocked = entry?.statement_locked === true;

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user && id) fetchEntry();
  }, [user, authLoading, id]);

  const fetchEntry = async () => {
    const { data, error } = await supabase.from("journal_entries").select("*").eq("id", id!).single();
    if (error || !data) { toast({ title: "Entry not found", variant: "destructive" }); navigate("/dashboard/journal"); return; }
    setEntry(data);
    setAboutPerson((data as any).about_person || "");
    setDescription((data as any).incident_description || "");
    setLocation((data as any).location || "");
    setWitnesses((data as any).witnesses || "");
    setInjuries((data as any).injuries_damage || "");
    setAbuseTypes((data as any).abuse_types || []);
    setWeaponInvolved(!!(data as any).weapon_involved);
    setWeaponDescription((data as any).weapon_description || "");
    setMedicalAttention(!!(data as any).medical_attention);
    setMedicalDetails((data as any).medical_details || "");
    setPoliceReported(!!(data as any).police_reported);
    setPoliceCaseNumber((data as any).police_case_number || "");
    setChildrenPresent(!!(data as any).children_present);
    setEmotionalState((data as any).emotional_state ? (data as any).emotional_state.split(", ") : []);
    setAddendumNotes((data as any).addendum_notes || "");
    setEntryDate((data as any).entry_date || "");
    setEntryTime((data as any).entry_time?.slice(0, 5) || "");
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    const updateData: any = {
      about_person: aboutPerson.trim() || null,
      subject_person: aboutPerson.trim() || null,
      location: location.trim() || null,
      witnesses: witnesses.trim() || null,
      injuries_damage: injuries.trim() || null,
      abuse_types: abuseTypes.length > 0 ? abuseTypes : null,
      weapon_involved: weaponInvolved || null,
      weapon_description: weaponInvolved ? weaponDescription.trim() || null : null,
      medical_attention: medicalAttention || null,
      medical_details: medicalAttention ? medicalDetails.trim() || null : null,
      police_reported: policeReported || null,
      police_case_number: policeReported ? policeCaseNumber.trim() || null : null,
      children_present: childrenPresent || null,
      emotional_state: emotionalState.length > 0 ? emotionalState.join(", ") : null,
      addendum_notes: addendumNotes.trim() || null,
      last_edited_at: new Date().toISOString(),
    };

    if (!isLocked) {
      updateData.incident_description = description.trim();
      updateData.entry_date = entryDate;
      updateData.entry_time = entryTime + ":00";
    }

    const { error } = await supabase.from("journal_entries").update(updateData).eq("id", id!);
    if (error) {
      toast({ title: "Error updating entry", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    toast({ title: isLocked ? "Supplementary details updated ✓" : "Entry updated successfully" });
    navigate(`/dashboard/journal/${id}`);
    setSaving(false);
  };

  const handleVerify = async () => {
    if (!entry) return;
    setSaving(true);
    try {
      const hashHex = await generateStatementHash({
        incident_description: entry.incident_description,
        entry_date: entry.entry_date,
        entry_time: entry.entry_time,
        user_id: entry.user_id,
        created_at: entry.created_at,
      });
      await supabase.rpc('lock_journal_entry_statement', {
        entry_id: entry.id,
        computed_hash: hashHex,
      });
      toast({ title: "Entry verified ✓", description: "Statement is now cryptographically locked." });
      navigate(`/dashboard/journal/${id}`);
    } catch (err) {
      toast({ title: "Verification failed", variant: "destructive" });
    }
    setSaving(false);
  };

  const labelCls = "font-mono text-[11px] tracking-wider uppercase block mb-2";
  const helperCls = "font-body text-xs block mb-2";
  const inputCls = "w-full px-4 py-3 bg-white text-foreground font-body text-sm border border-border shadow-sm focus:outline-none focus:ring-0 transition-all";
  const disabledCls = "w-full px-4 py-3 bg-muted text-muted-foreground font-body text-sm border border-border shadow-sm cursor-not-allowed";

  const ToggleSwitch = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}
        style={{ minWidth: 44, minHeight: 44, padding: '9px 0' }}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      <span className="font-body text-sm text-foreground">{label}</span>
    </div>
  );

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
      <div className="max-w-2xl mx-auto">
        <Link to={`/dashboard/journal/${id}`} className="inline-flex items-center gap-1.5 font-body text-sm text-primary hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Entry
        </Link>

        <div className="mb-6">
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Edit Entry</p>
          <h1 className="font-heading text-2xl text-foreground mb-2">Edit Journal Entry</h1>
        </div>

        {isLocked && (
          <div className="bg-primary/5 border border-primary/20 p-5 mb-6" style={{ borderRadius: 14 }}>
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-heading text-sm text-foreground mb-1">This entry has been verified</h3>
                <p className="font-body text-xs text-muted-foreground">
                  The original statement is locked and cannot be edited. You can update supplementary details (medical records, police case numbers, evidence files) below.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: '#5B21B6' }}>Date</label>
              <input type="date" value={entryDate} onChange={e => setEntryDate(e.target.value)}
                className={isLocked ? disabledCls : inputCls} style={{ borderRadius: 10 }} disabled={isLocked} />
            </div>
            <div>
              <label className={labelCls} style={{ color: '#5B21B6' }}>Time</label>
              <input type="time" value={entryTime} onChange={e => setEntryTime(e.target.value)}
                className={isLocked ? disabledCls : inputCls} style={{ borderRadius: 10 }} disabled={isLocked} />
            </div>
          </div>

          {/* About Person */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Who Is This About? (Optional)</label>
            <input type="text" value={aboutPerson} onChange={e => setAboutPerson(e.target.value.slice(0, 100))}
              placeholder="e.g. Thabo, my ex" className={inputCls} style={{ borderRadius: 10 }} />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>What Happened? *</label>
            {isLocked ? (
              <div className={disabledCls} style={{ borderRadius: 10, minHeight: 120, whiteSpace: 'pre-wrap' }}>{description}</div>
            ) : (
              <textarea value={description} onChange={e => setDescription(e.target.value.slice(0, 5000))}
                rows={8} className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
            )}
          </div>

          {/* Abuse Types */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Type of Abuse (Optional)</label>
            <div className="space-y-2">
              {ABUSE_TYPES.map(type => (
                <label key={type} className="flex items-start gap-3 cursor-pointer" style={{ minHeight: 44 }}>
                  <input type="checkbox" checked={abuseTypes.includes(type)} onChange={() => setAbuseTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])}
                    className="mt-1 h-4 w-4 rounded border-primary text-primary accent-primary" />
                  <span className="font-body text-sm text-foreground">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Weapon */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Was a Weapon Involved?</label>
            <ToggleSwitch checked={weaponInvolved} onChange={setWeaponInvolved} label={weaponInvolved ? "Yes" : "No"} />
            {weaponInvolved && (
              <div className="mt-3">
                <input type="text" value={weaponDescription} onChange={e => setWeaponDescription(e.target.value)}
                  placeholder="e.g. Kitchen knife" className={inputCls} style={{ borderRadius: 10 }} />
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Location (Optional)</label>
            <input type="text" value={location} onChange={e => setLocation(e.target.value)}
              className={inputCls} style={{ borderRadius: 10 }} />
          </div>

          {/* Witnesses */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Witnesses (Optional)</label>
            <textarea value={witnesses} onChange={e => setWitnesses(e.target.value)} rows={3}
              className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
          </div>

          {/* Injuries */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Injuries or Damage (Optional)</label>
            <textarea value={injuries} onChange={e => setInjuries(e.target.value)} rows={3}
              className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
          </div>

          {/* Medical */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Medical Attention</label>
            <ToggleSwitch checked={medicalAttention} onChange={setMedicalAttention} label={medicalAttention ? "Yes" : "No"} />
            {medicalAttention && (
              <div className="mt-3">
                <input type="text" value={medicalDetails} onChange={e => setMedicalDetails(e.target.value)}
                  placeholder="e.g. Karl Bremer Hospital" className={inputCls} style={{ borderRadius: 10 }} />
              </div>
            )}
            <div className="flex items-start gap-2 mt-2">
              <Stethoscope className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="font-body text-xs" style={{ color: '#64748B' }}>Medical reports (J88 forms) are strong evidence in court.</span>
            </div>
          </div>

          {/* Police */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Police Report</label>
            <ToggleSwitch checked={policeReported} onChange={setPoliceReported} label={policeReported ? "Yes" : "No"} />
            {policeReported && (
              <div className="mt-3">
                <input type="text" value={policeCaseNumber} onChange={e => setPoliceCaseNumber(e.target.value)}
                  placeholder="e.g. CAS 123/05/2026" className={inputCls} style={{ borderRadius: 10 }} />
              </div>
            )}
          </div>

          {/* Children Present */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>Children Present</label>
            <ToggleSwitch checked={childrenPresent} onChange={setChildrenPresent} label={childrenPresent ? "Yes" : "No"} />
            <div className="flex items-start gap-2 mt-2">
              <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="font-body text-xs" style={{ color: '#64748B' }}>Courts treat incidents involving children as more urgent.</span>
            </div>
          </div>

          {/* Emotional State */}
          <div>
            <label className={labelCls} style={{ color: '#5B21B6' }}>How Were You Feeling?</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONAL_OPTIONS.map(emotion => (
                <button key={emotion} type="button" onClick={() => setEmotionalState(prev => prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion])}
                  className={`px-4 py-2 rounded-full font-body text-sm border transition-colors ${
                    emotionalState.includes(emotion)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white text-foreground border-border hover:border-primary/50'
                  }`} style={{ minHeight: 44 }}>
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* Addendum (locked entries only) */}
          {isLocked && (
            <div>
              <label className={labelCls} style={{ color: '#5B21B6' }}>Additional Information (Addendum)</label>
              <span className={helperCls} style={{ color: '#64748B' }}>Use this if you want to add details discovered after the original entry was verified (e.g. medical reports received later, police case number obtained).</span>
              <textarea value={addendumNotes} onChange={e => setAddendumNotes(e.target.value)} rows={4}
                placeholder="Add new information..."
                className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
              {entry?.last_edited_at && (
                <p className="font-mono text-[10px] text-muted-foreground mt-1">
                  Last updated: {new Date(entry.last_edited_at).toLocaleString('en-ZA')}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="button" onClick={handleSave} disabled={saving}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
            </button>
            {!isLocked && (
              <button type="button" onClick={handleVerify} disabled={saving}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border-2 border-primary text-primary font-body font-bold text-sm rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50">
                <Lock className="h-4 w-4" /> Verify Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
