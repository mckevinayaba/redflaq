/**
 * ═══════════════════════════════════════════════════════════════════
 * AFFIDAVIT BUILDER — COURT DOCUMENT GENERATOR
 * ═══════════════════════════════════════════════════════════════════
 *
 * Generates a draft affidavit PDF in the format required by South
 * African Magistrate's Courts, primarily for Domestic Violence Act
 * (Act 116 of 1998) protection order applications.
 *
 * Users can link their journal entries as supporting evidence.
 * The generated PDF is marked "DRAFT" and must be commissioned
 * by a Commissioner of Oaths to become legally binding.
 *
 * POPIA COMPLIANCE:
 * - Draft data stored per-user with strict RLS
 * - PDF generated client-side (no server-side document storage)
 * - User controls all personal information included
 * ═══════════════════════════════════════════════════════════════════
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Info, CheckCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateAffidavitPDF } from "@/utils/pdfAffidavit";

const PURPOSE_OPTIONS = [
  "Application for protection order under the Domestic Violence Act",
  "Reporting abuse or assault to SAPS",
  "Evidence for criminal court proceedings",
  "Evidence for family court proceedings",
  "Employer or workplace complaint",
  "Landlord or tenant dispute",
  "Other legal matter",
];

const RELATIONSHIP_OPTIONS = [
  "Current intimate partner (boyfriend/girlfriend/spouse)",
  "Former intimate partner (ex-boyfriend/ex-girlfriend/ex-spouse)",
  "Family member (parent/sibling/child/relative)",
  "Landlord or property owner",
  "Employer or supervisor",
  "Colleague or co-worker",
  "Neighbour",
  "Stranger",
  "Other",
];

const RELIEF_OPTIONS = [
  "Protection order under the Domestic Violence Act 116 of 1998",
  "Criminal charges to be laid against the perpetrator",
  "Child protection order or custody/access restrictions",
  "Eviction or removal of perpetrator from shared residence",
  "Return of property or belongings",
  "Restraining order (no contact/harassment)",
  "Police investigation and prosecution",
];

export default function AffidavitBuilder() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1
  const [fullName, setFullName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2
  const [purpose, setPurpose] = useState("");
  const [aboutPerson, setAboutPerson] = useState("");
  const [relationship, setRelationship] = useState("");

  // Step 3
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // Step 4
  const [statementText, setStatementText] = useState("");

  // Step 5
  const [reliefSought, setReliefSought] = useState<string[]>([]);
  const [otherRelief, setOtherRelief] = useState("");
  const [includeOther, setIncludeOther] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) {
      // Pre-fill name from profile
      const name = user.user_metadata?.full_name || "";
      setFullName(name);
      fetchJournalEntries();
    }
  }, [user, authLoading]);

  const fetchJournalEntries = async () => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", user!.id)
      .order("entry_date", { ascending: false });
    setJournalEntries(data || []);
    setLoadingEntries(false);
  };

  const toggleEntry = (id: string) => {
    setSelectedEntries(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const importSelectedEntries = () => {
    const selected = journalEntries.filter(e => selectedEntries.includes(e.id));
    const sorted = [...selected].sort((a, b) => `${a.entry_date}${a.entry_time}`.localeCompare(`${b.entry_date}${b.entry_time}`));
    const paragraphs = sorted.map((e, idx) => {
      const date = new Date(e.entry_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
      const time = e.entry_time?.slice(0, 5) || '';
      return `On ${date} at approximately ${time}${e.location ? `, at ${e.location}` : ''}, the following occurred:\n${e.incident_description}`;
    });
    setStatementText(prev => prev ? `${prev}\n\n${paragraphs.join('\n\n')}` : paragraphs.join('\n\n'));
    toast({ title: `${selected.length} entries imported` });
  };

  const handleGenerate = () => {
    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      toast({ title: "Full legal name required", description: "Enter at least 2 names.", variant: "destructive" }); return;
    }
    if (!address.trim() || address.trim().length < 15) {
      toast({ title: "Address required", description: "Enter your full residential address.", variant: "destructive" }); return;
    }
    if (!purpose) {
      toast({ title: "Purpose required", variant: "destructive" }); return;
    }
    if (!statementText.trim() || statementText.trim().length < 100) {
      toast({ title: "Statement too short", description: "Min 100 characters required.", variant: "destructive" }); return;
    }
    if (idNumber && !/^\d{13}$/.test(idNumber)) {
      toast({ title: "Invalid ID number", description: "SA ID must be 13 digits.", variant: "destructive" }); return;
    }

    const allRelief = [...reliefSought];
    generateAffidavitPDF({
      fullName: fullName.trim(),
      idNumber: idNumber || undefined,
      address: address.trim(),
      phone: phone.trim() || undefined,
      purpose,
      aboutPerson: aboutPerson.trim() || undefined,
      relationship: relationship || undefined,
      statementText: statementText.trim(),
      reliefSought: allRelief,
      otherRelief: includeOther ? otherRelief.trim() : undefined,
    });

    toast({ title: "Affidavit generated ✓", description: "Print and take to any Commissioner of Oaths." });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    const { error } = await supabase.from("affidavit_drafts").insert({
      user_id: user!.id,
      full_name: fullName.trim(),
      id_number: idNumber || null,
      residential_address: address.trim(),
      telephone_number: phone.trim() || null,
      purpose: purpose || 'Draft',
      about_person: aboutPerson.trim() || null,
      relationship_to_person: relationship || null,
      statement_text: statementText.trim() || 'Draft statement',
      relief_sought: reliefSought.length > 0 ? reliefSought : null,
      related_entry_ids: selectedEntries.length > 0 ? selectedEntries : null,
    } as any);

    if (error) {
      toast({ title: "Error saving draft", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Draft saved ✓" });
    }
    setSaving(false);
  };

  const labelCls = "font-mono text-[11px] tracking-wider uppercase block mb-2";
  const helperCls = "font-body text-xs block mb-2";
  const inputCls = "w-full px-4 py-3 bg-white text-foreground font-body text-sm border border-border shadow-sm focus:outline-none focus:ring-0 transition-all";

  if (authLoading) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Legal Tools</p>
          <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Affidavit Builder</h1>
          <p className="font-body text-sm text-muted-foreground max-w-xl">
            Build a correctly formatted South African affidavit draft — in your own words. Print and take to any police station, magistrate's court, or commissioner of oaths to sign and commission.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8" style={{ borderRadius: '0 12px 12px 0' }}>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="font-body text-sm text-blue-800">
              An affidavit only becomes legally binding when physically signed in the presence of a Commissioner of Oaths. This tool prepares your draft so you arrive ready with a properly structured document. You MUST bring your South African ID document when getting it commissioned.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1: Your Details */}
          <section>
            <h2 className="font-heading text-lg text-foreground mb-1">Your Details</h2>
            <p className="font-body text-xs text-muted-foreground mb-4">This information will appear at the top of your affidavit.</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={{ color: '#5B21B6' }}>Full Legal Name *</label>
                <span className={helperCls} style={{ color: '#64748B' }}>Use your full name exactly as it appears on your SA ID document.</span>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Nthabiseng Kholofelo Montsho" className={inputCls} style={{ borderRadius: 10 }} />
              </div>
              <div>
                <label className={labelCls} style={{ color: '#5B21B6' }}>SA ID Number (Optional)</label>
                <span className={helperCls} style={{ color: '#64748B' }}>Including your ID number strengthens the affidavit.</span>
                <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 13))}
                  placeholder="e.g. 8501015800083" className={inputCls} style={{ borderRadius: 10 }} />
              </div>
              <div>
                <label className={labelCls} style={{ color: '#5B21B6' }}>Residential Address *</label>
                <span className={helperCls} style={{ color: '#64748B' }}>Your current physical address.</span>
                <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3}
                  placeholder="Street address, suburb, city, postal code"
                  className={`${inputCls} resize-y`} style={{ borderRadius: 10 }} />
              </div>
              <div>
                <label className={labelCls} style={{ color: '#5B21B6' }}>Contact Number (Optional)</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 071 234 5678" className={inputCls} style={{ borderRadius: 10 }} />
              </div>
            </div>
          </section>

          {/* Step 2: Purpose */}
          <section>
            <h2 className="font-heading text-lg text-foreground mb-1">What This Affidavit Is For</h2>
            <p className="font-body text-xs text-muted-foreground mb-4">Help the commissioner and court understand the purpose.</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls} style={{ color: '#5B21B6' }}>Purpose *</label>
                <select value={purpose} onChange={e => setPurpose(e.target.value)}
                  className={inputCls} style={{ borderRadius: 10 }}>
                  <option value="">Select purpose...</option>
                  {PURPOSE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls} style={{ color: '#5B21B6' }}>Who Is This About? (Optional)</label>
                <input type="text" value={aboutPerson} onChange={e => setAboutPerson(e.target.value)}
                  placeholder="e.g. Thabo Mokwena, my former partner" className={inputCls} style={{ borderRadius: 10 }} />
              </div>
              <div>
                <label className={labelCls} style={{ color: '#5B21B6' }}>Their Relationship to You (Optional)</label>
                <select value={relationship} onChange={e => setRelationship(e.target.value)}
                  className={inputCls} style={{ borderRadius: 10 }}>
                  <option value="">Select relationship...</option>
                  {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Step 3: Import from Journal */}
          <section>
            <h2 className="font-heading text-lg text-foreground mb-1">Import From My Safety Journal (Optional)</h2>
            <p className="font-body text-xs text-muted-foreground mb-4">Pull entries from your journal to populate this affidavit automatically.</p>
            {loadingEntries ? (
              <p className="font-body text-sm text-muted-foreground">Loading journal entries...</p>
            ) : journalEntries.length === 0 ? (
              <div className="bg-muted/50 rounded-xl p-6 text-center">
                <p className="font-body text-sm text-muted-foreground">No journal entries yet. You can write your statement from scratch below.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-xl p-3">
                  {journalEntries.slice(0, 20).map(entry => (
                    <label key={entry.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input type="checkbox" checked={selectedEntries.includes(entry.id)}
                        onChange={() => toggleEntry(entry.id)}
                        className="mt-1 h-4 w-4 rounded border-primary text-primary accent-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-sm font-semibold text-foreground">
                            {new Date(entry.entry_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {entry.statement_hash && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-green-50 text-green-700">
                              <CheckCircle className="h-2.5 w-2.5" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {entry.incident_description?.slice(0, 80)}...
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedEntries.length > 0 && (
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-body text-sm text-muted-foreground">{selectedEntries.length} entries selected</span>
                    <button type="button" onClick={importSelectedEntries}
                      className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary font-body font-bold text-sm rounded-lg hover:bg-primary/5">
                      Import Selected Journal Entries
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Step 4: Statement */}
          <section>
            <h2 className="font-heading text-lg text-foreground mb-1">Your Statement</h2>
            <p className="font-body text-xs text-muted-foreground mb-4">This is the core of your affidavit. Write in first person and be specific.</p>

            <div className="bg-primary/5 border-l-4 border-primary p-4 mb-4" style={{ borderRadius: '0 12px 12px 0' }}>
              <p className="font-heading text-sm text-foreground mb-2">WRITING GUIDANCE FOR AFFIDAVITS</p>
              <ul className="font-body text-xs text-muted-foreground space-y-1">
                <li>✓ Write in first person: 'I saw...', 'I experienced...'</li>
                <li>✓ Be specific: Include dates, times, locations, exact words</li>
                <li>✓ Be factual: Describe what you personally saw, heard, felt</li>
                <li>✓ Use plain language: No need for legal jargon</li>
                <li>✗ Avoid speculation: Only state what you know for certain</li>
                <li>✗ Avoid hearsay: Don't include 'someone told me that...'</li>
              </ul>
            </div>

            <label className="font-body text-sm text-foreground block mb-2">
              I, {fullName || '[your full name]'}, hereby make oath/affirm and state as follows:
            </label>
            <textarea value={statementText} onChange={e => setStatementText(e.target.value)}
              rows={16}
              placeholder={"1. On [date] at approximately [time], at [location], the following incident occurred: [describe what happened]\n\n2. [Continue with numbered paragraphs]\n\n3. [Include all relevant details]"}
              className={`${inputCls} resize-y`} style={{ borderRadius: 10, minHeight: 300 }} />
            <p className="font-mono text-[10px] text-muted-foreground mt-1 text-right">
              {statementText.split(/\s+/).filter(Boolean).length} words · {statementText.length} characters
            </p>
          </section>

          {/* Step 5: Relief Sought */}
          <section>
            <h2 className="font-heading text-lg text-foreground mb-1">What Are You Asking For?</h2>
            <p className="font-body text-xs text-muted-foreground mb-4">What do you want the court, police, or authorities to do?</p>
            <div className="space-y-2">
              {RELIEF_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 cursor-pointer" style={{ minHeight: 44 }}>
                  <input type="checkbox" checked={reliefSought.includes(opt)}
                    onChange={() => setReliefSought(prev => prev.includes(opt) ? prev.filter(r => r !== opt) : [...prev, opt])}
                    className="mt-1 h-4 w-4 rounded border-primary text-primary accent-primary" />
                  <span className="font-body text-sm text-foreground">{opt}</span>
                </label>
              ))}
              <label className="flex items-start gap-3 cursor-pointer" style={{ minHeight: 44 }}>
                <input type="checkbox" checked={includeOther}
                  onChange={() => setIncludeOther(!includeOther)}
                  className="mt-1 h-4 w-4 rounded border-primary text-primary accent-primary" />
                <span className="font-body text-sm text-foreground">Other (specify below)</span>
              </label>
              {includeOther && (
                <textarea value={otherRelief} onChange={e => setOtherRelief(e.target.value)} rows={2}
                  placeholder="e.g. Access to medical records, protection for witnesses"
                  className={`${inputCls} resize-y ml-7`} style={{ borderRadius: 10, width: 'calc(100% - 28px)' }} />
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-8">
            <button type="button" onClick={handleGenerate}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors">
              <FileText className="h-4 w-4" /> Generate Affidavit PDF
            </button>
            <button type="button" onClick={handleSaveDraft} disabled={saving}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors disabled:opacity-50">
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
