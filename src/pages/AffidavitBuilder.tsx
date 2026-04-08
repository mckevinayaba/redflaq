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

  const labelCls = "font-mono text-[10px] tracking-wider uppercase block mb-2" + " " + "text-purple-400";
  const helperCls = "font-body text-xs block mb-2 text-gray-400";
  const inputCls = "w-full px-4 py-3 font-body text-sm focus:outline-none focus:ring-0 transition-all"
    + " bg-[#0d0d1a] text-[#d1d1d6] border border-white/10 focus:border-[#6C35DE]";

  if (authLoading) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: '#8b8b91', letterSpacing: '0.15em' }}>Legal Evidence</p>
          <h1 className="font-heading text-2xl sm:text-3xl mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em' }}>Affidavit Builder</h1>
          <p className="font-body text-sm max-w-xl" style={{ color: '#8b8b91', lineHeight: 1.7 }}>
            Build a correctly formatted South African affidavit draft — in your own words. Print and take to any police station, magistrate's court, or commissioner of oaths to sign and commission.
          </p>
        </div>

        {/* Info Banner */}
        <div className="p-4 mb-8" style={{ background: 'rgba(192,57,43,0.08)', borderLeft: '4px solid #C0392B', borderRadius: '0 8px 8px 0', border: '1px solid rgba(192,57,43,0.2)', borderLeftWidth: 4, borderLeftColor: '#C0392B' }}>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#C0392B' }} />
            <p className="font-body text-sm" style={{ color: '#d1d1d6', lineHeight: 1.7 }}>
              An affidavit only becomes legally binding when physically signed in the presence of a Commissioner of Oaths. This tool prepares your draft so you arrive ready with a properly structured document. You MUST bring your South African ID document when getting it commissioned.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Your Details */}
          <section className="p-6 rounded-lg" style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)' }}>
            <h2 className="font-heading text-lg mb-1" style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Your Details</h2>
            <p className="font-body text-xs mb-4" style={{ color: '#8b8b91' }}>This information will appear at the top of your affidavit.</p>
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
          <section className="p-6 rounded-lg" style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)' }}>
            <h2 className="font-heading text-lg mb-1" style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>What This Affidavit Is For</h2>
            <p className="font-body text-xs mb-4" style={{ color: '#8b8b91' }}>Help the commissioner and court understand the purpose.</p>
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
          <section className="p-6 rounded-lg" style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)' }}>
            <h2 className="font-heading text-lg mb-1" style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Import From My Safety Journal (Optional)</h2>
            <p className="font-body text-xs mb-4" style={{ color: '#8b8b91' }}>Pull entries from your journal to populate this affidavit automatically.</p>
            {loadingEntries ? (
              <p className="font-body text-sm" style={{ color: '#8b8b91' }}>Loading journal entries...</p>
            ) : journalEntries.length === 0 ? (
              <div className="rounded-lg p-6 text-center" style={{ background: '#0d0d1a', border: '1px dashed rgba(108,53,222,0.3)' }}>
                <p className="font-body text-sm" style={{ color: '#8b8b91' }}>No journal entries yet. You can write your statement from scratch below.</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto rounded-lg p-3" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#0d0d1a' }}>
                  {journalEntries.slice(0, 20).map(entry => (
                    <label key={entry.id} className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors" style={{ '--hover-bg': 'rgba(108,53,222,0.06)' } as React.CSSProperties}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(108,53,222,0.06)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <input type="checkbox" checked={selectedEntries.includes(entry.id)}
                        onChange={() => toggleEntry(entry.id)}
                        className="mt-1 h-4 w-4 rounded border-primary text-primary accent-primary" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-sm font-semibold" style={{ color: '#d1d1d6' }}>
                            {new Date(entry.entry_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {entry.statement_hash && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: 'rgba(39,174,96,0.12)', color: '#27AE60', border: '1px solid rgba(39,174,96,0.25)' }}>
                              <CheckCircle className="h-2.5 w-2.5" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="font-body text-xs line-clamp-1 mt-0.5" style={{ color: '#8b8b91' }}>
                          {entry.incident_description?.slice(0, 80)}...
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedEntries.length > 0 && (
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-body text-sm" style={{ color: '#8b8b91' }}>{selectedEntries.length} entries selected</span>
                    <button type="button" onClick={importSelectedEntries}
                      className="inline-flex items-center gap-2 px-4 py-2 font-body font-bold text-sm rounded" style={{ border: '1.5px solid #6C35DE', color: '#6C35DE', background: 'rgba(108,53,222,0.08)' }}>
                      Import Selected Journal Entries
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* Step 4: Statement */}
          <section className="p-6 rounded-lg" style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)' }}>
            <h2 className="font-heading text-lg mb-1" style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Your Statement</h2>
            <p className="font-body text-xs mb-4" style={{ color: '#8b8b91' }}>This is the core of your affidavit. Write in first person and be specific.</p>

            <div className="p-4 mb-4" style={{ background: 'rgba(108,53,222,0.06)', borderLeft: '3px solid #6C35DE', borderRadius: '0 8px 8px 0' }}>
              <p className="font-heading text-sm mb-2" style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>WRITING GUIDANCE FOR AFFIDAVITS</p>
              <ul className="font-body text-xs space-y-1" style={{ color: '#8b8b91' }}>
                <li>✓ Write in first person: 'I saw...', 'I experienced...'</li>
                <li>✓ Be specific: Include dates, times, locations, exact words</li>
                <li>✓ Be factual: Describe what you personally saw, heard, felt</li>
                <li>✓ Use plain language: No need for legal jargon</li>
                <li>✗ Avoid speculation: Only state what you know for certain</li>
                <li>✗ Avoid hearsay: Don't include 'someone told me that...'</li>
              </ul>
            </div>

            <label className="font-body text-sm block mb-2" style={{ color: '#d1d1d6' }}>
              I, {fullName || '[your full name]'}, hereby make oath/affirm and state as follows:
            </label>
            <textarea value={statementText} onChange={e => setStatementText(e.target.value)}
              rows={16}
              placeholder={"1. On [date] at approximately [time], at [location], the following incident occurred: [describe what happened]\n\n2. [Continue with numbered paragraphs]\n\n3. [Include all relevant details]"}
              className={`${inputCls} resize-y`} style={{ borderRadius: 10, minHeight: 300 }} />
            <p className="font-mono text-[10px] mt-1 text-right" style={{ color: '#8b8b91' }}>
              {statementText.split(/\s+/).filter(Boolean).length} words · {statementText.length} characters
            </p>
          </section>

          {/* Step 5: Relief Sought */}
          <section className="p-6 rounded-lg" style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)' }}>
            <h2 className="font-heading text-lg mb-1" style={{ color: '#ffffff', fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>What Are You Asking For?</h2>
            <p className="font-body text-xs mb-4" style={{ color: '#8b8b91' }}>What do you want the court, police, or authorities to do?</p>
            <div className="space-y-2">
              {RELIEF_OPTIONS.map(opt => (
                <label key={opt} className="flex items-start gap-3 cursor-pointer" style={{ minHeight: 44 }}>
                  <input type="checkbox" checked={reliefSought.includes(opt)}
                    onChange={() => setReliefSought(prev => prev.includes(opt) ? prev.filter(r => r !== opt) : [...prev, opt])}
                    className="mt-1 h-4 w-4 rounded accent-violet-500" style={{ accentColor: '#6C35DE' }} />
                  <span className="font-body text-sm" style={{ color: '#d1d1d6' }}>{opt}</span>
                </label>
              ))}
              <label className="flex items-start gap-3 cursor-pointer" style={{ minHeight: 44 }}>
                <input type="checkbox" checked={includeOther}
                  onChange={() => setIncludeOther(!includeOther)}
                  className="mt-1 h-4 w-4 rounded" style={{ accentColor: '#6C35DE' }} />
                <span className="font-body text-sm" style={{ color: '#d1d1d6' }}>Other (specify below)</span>
              </label>
              {includeOther && (
                <textarea value={otherRelief} onChange={e => setOtherRelief(e.target.value)} rows={2}
                  placeholder="e.g. Access to medical records, protection for witnesses"
                  className={`${inputCls} resize-y ml-7`} style={{ borderRadius: 10, width: 'calc(100% - 28px)' }} />
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
            <button type="button" onClick={handleGenerate}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-body font-bold text-sm rounded transition-opacity hover:opacity-90"
              style={{ background: '#6C35DE', color: '#ffffff', border: 'none', cursor: 'pointer' }}>
              <FileText className="h-4 w-4" /> Generate Affidavit PDF
            </button>
            <button type="button" onClick={handleSaveDraft} disabled={saving}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 font-body font-medium text-sm rounded transition-colors disabled:opacity-50"
              style={{ background: 'transparent', color: '#d1d1d6', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}>
              <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
