import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DisputeModal } from "@/components/DisputeModal";
import { Progress } from "@/components/ui/progress";
import IdentityMatchSelector from "@/components/IdentityMatchSelector";
import { calculateIdentityConfidence, getConfidenceLevel, type SearchInput, type PersonRecord } from "@/utils/identityConfidence";

interface WantedPerson {
  id: string;
  full_name: string;
  first_name: string;
  surname: string;
  charges: string;
  photo_url?: string;
  detail_page_url?: string;
  case_number?: string;
  police_station?: string;
  court_case_number?: string;
  legal_status?: string;
  province?: string;
  updated_at?: string;
  date_wanted?: string;
  court_name?: string;
  identity_confidence_score?: number;
  requires_human_verification?: boolean;
}

interface SearchResultData {
  searchId: string;
  searchType?: string;
  searchIdentifier?: string;
  fullName?: string;
  idNumber?: string;
  riskLevel: string;
  riskScore: number;
  isWanted: boolean;
  wantedPersonsCount: number;
  wantedPersons: WantedPerson[];
  searchedAt: string;
  hasMultipleMatches?: boolean;
}

const getConfidence = (person: WantedPerson, idNumber?: string) => {
  let score = 20; // name match base
  if (person.date_wanted) score += 15;
  if (person.province) score += 20;
  if (person.photo_url) score += 15;
  if (idNumber) score += 30;
  return Math.min(score, 100);
};

const getDaysAgo = (dateStr?: string) => {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const redactId = (id?: string) => {
  if (!id || id.length < 4) return id || "N/A";
  return "████████" + id.slice(-4);
};

const ResultsPageUpdated = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<SearchResultData | null>(null);
  const [disputeRecord, setDisputeRecord] = useState<WantedPerson | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<WantedPerson | null>(null);
  const [showMatchSelector, setShowMatchSelector] = useState(false);
  const searchId = searchParams.get("search_id");

  useEffect(() => {
    if (!searchId) {
      toast.error("Invalid search ID");
      navigate("/");
      return;
    }
    const storedResult = sessionStorage.getItem("searchResult");
    if (storedResult) {
      try {
        setResults(JSON.parse(storedResult));
      } catch {
        toast.error("Failed to load search results");
        navigate("/");
      }
    } else {
      setResults({
        searchId,
        fullName: sessionStorage.getItem("searchName") || "Test Person",
        idNumber: sessionStorage.getItem("searchIdNumber") || "",
        riskLevel: "GREEN",
        riskScore: 0,
        isWanted: false,
        wantedPersonsCount: 0,
        wantedPersons: [],
        searchedAt: new Date().toISOString(),
      });
    }
    setLoading(false);

    // Auto-show match selector for multiple matches
    const parsed = storedResult ? JSON.parse(storedResult) : null;
    if (parsed && parsed.hasMultipleMatches && parsed.wantedPersonsCount > 1) {
      setShowMatchSelector(true);
    }
  }, [searchId, navigate]);

  const handleDownload = async () => {
    const element = document.querySelector('.results-container') as HTMLElement;
    if (element) {
      const html2pdf = (await import('html2pdf.js')).default;
      html2pdf().set({
        margin: 10,
        filename: `redflaq-report-${results?.searchId}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      }).from(element).save();
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--purple-mid)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'var(--mid)' }}>Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const isMultiple = results.wantedPersonsCount > 1;
  const searchDate = new Date(results.searchedAt).toLocaleDateString('en-ZA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const searchTime = new Date(results.searchedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div className="results-container" style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 24 }}>
          SEARCH RESULTS · {(results.searchType || 'person').toUpperCase().replace('_', ' ')} · {searchDate} {searchTime}
        </p>

        {/* Identity Match Selector for multiple matches */}
        {showMatchSelector && isMultiple && !selectedMatch && (
          <IdentityMatchSelector
            matches={results.wantedPersons as unknown as PersonRecord[]}
            searchInput={{
              search_name: results.searchIdentifier || results.fullName || '',
              search_id: results.idNumber,
            }}
            onSelectMatch={(match) => {
              setSelectedMatch(match as unknown as WantedPerson);
              setShowMatchSelector(false);
            }}
            onNoneMatch={() => {
              setShowMatchSelector(false);
              toast.info("If none of these match, the person may not have public records.");
            }}
          />
        )}

        {/* Multiple Matches Warning (shown after selector dismissed) */}
        {isMultiple && !showMatchSelector && (
          <div style={{ background: '#FEF2F2', border: '2px solid #DC2626', padding: 32, marginBottom: 32 }}>
            <span style={{ fontSize: 40 }}>⚠️</span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#DC2626', margin: '12px 0' }}>
              Multiple Possible Matches Found
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'var(--mid)', lineHeight: 1.7, marginBottom: 20 }}>
              We found {results.wantedPersonsCount} people with this name in public records. South Africa has many people with identical names. You MUST verify which person matches who you are searching for before making any decisions.
            </p>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: '#DC2626', background: 'white', padding: 12, borderLeft: '3px solid #DC2626' }}>
              Using information about the wrong person is illegal. Verify identity carefully using date of birth, location, and case details.
            </div>
          </div>
        )}

        {/* Wanted Person Cards */}
        {results.isWanted && results.wantedPersons.map((person, idx) => {
          const confidence = getConfidence(person, results.idNumber);
          const daysAgo = getDaysAgo(person.updated_at);
          const isViolent = /murder|assault|rape|sexual|violence|attack|stab|shoot/i.test(person.charges);

          return (
            <div key={person.id}>
              {isMultiple && idx > 0 && (
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'var(--muted)', textAlign: 'center', margin: '24px 0' }}>
                  ── Not the same person ──
                </p>
              )}

              <div style={{ border: '1.5px solid var(--ink)', background: 'white', marginBottom: 24 }}>

                {/* Header */}
                <div style={{ padding: 32, borderBottom: '1.5px solid var(--cream)', position: 'relative' }}>
                  {isMultiple && (
                    <span style={{ position: 'absolute', top: 16, right: 16, background: 'var(--purple-mid)', color: 'white', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '4px 12px' }}>
                      MATCH {idx + 1} OF {results.wantedPersonsCount}
                    </span>
                  )}
                  <span style={{
                    display: 'inline-block', padding: '6px 16px', marginBottom: 16,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontWeight: 600,
                    background: person.legal_status === 'wanted' || !person.legal_status ? '#DC2626' : person.court_case_number ? '#EA580C' : '#CA8A04',
                    color: 'white',
                  }}>
                    {person.legal_status === 'wanted' || !person.legal_status ? 'ACTIVE WARRANT LISTED' : person.court_case_number ? 'COURT RECORD FOUND' : 'LEGAL NOTICE FOUND'}
                  </span>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 8 }}>
                    {person.full_name}
                  </h2>
                  {results.idNumber && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--muted)' }}>
                      ID: {redactId(results.idNumber)}
                    </p>
                  )}
                </div>

                {/* Photo & Details */}
                <div className="results-photo-grid" style={{ padding: 32, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32 }}>
                  <div>
                    {person.photo_url ? (
                      <>
                        <div style={{ width: 200, height: 200, border: '1.5px solid var(--cream)', overflow: 'hidden' }}>
                          <img src={person.photo_url} alt={person.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--muted)', display: 'block', marginTop: 8 }}>Photo source: SAPS database</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#EA580C', display: 'block', marginTop: 4 }}>Photos may be outdated. Do not rely on photo alone for identification.</span>
                      </>
                    ) : (
                      <div style={{ width: 200, height: 200, background: '#F5F5F4', border: '1.5px solid var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <span style={{ fontSize: 64, color: '#D1D5DB' }}>👤</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>No photo available</span>
                      </div>
                    )}
                  </div>

                  <div>
                    {[
                      { label: 'ALLEGED OFFENSE', value: person.charges, highlight: isViolent },
                      { label: 'POLICE STATION', value: person.police_station },
                      { label: 'PROVINCE', value: person.province },
                      { label: 'CASE NUMBER', value: person.case_number },
                      { label: 'COURT', value: person.court_name || person.court_case_number },
                    ].filter(d => d.value).map(d => (
                      <div key={d.label} style={{ marginBottom: 16 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>{d.label}</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: d.highlight ? '#DC2626' : 'var(--ink)', fontWeight: d.highlight ? 700 : 500 }}>{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What This Means */}
                <div style={{ padding: 32, background: '#FFFBEB', borderTop: '1.5px solid var(--cream)', borderBottom: '1.5px solid var(--cream)' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--gold)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⚠️ What This Means
                  </h3>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'var(--mid)', lineHeight: 1.7 }}>
                    An active arrest warrant is listed on the SAPS wanted persons database as of {person.updated_at ? new Date(person.updated_at).toLocaleDateString('en-ZA') : 'recently'}.
                  </p>
                  <div style={{ background: 'white', padding: 16, borderLeft: '3px solid #EA580C', marginTop: 16 }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>This Does NOT Confirm:</p>
                    <ul style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, listStyle: 'disc', paddingLeft: 20, margin: 0 }}>
                      <li>Whether this person is currently wanted</li>
                      <li>Whether they have been arrested</li>
                      <li>Current bail or custody status</li>
                      <li>Case progression or court dates</li>
                      <li>Any outcome or conviction</li>
                    </ul>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginTop: 12, fontStyle: 'italic' }}>
                    SAPS wanted lists are not updated in real-time. This listing may be outdated. The person may have been arrested, case may have progressed, or warrant may have been withdrawn.
                  </p>
                </div>

                {/* Verification Info */}
                <div style={{ padding: 32, background: '#EFF6FF', borderBottom: '1.5px solid var(--cream)' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    ✓ Verification Information
                  </h3>
                  <div className="results-verification-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {[
                      { label: 'SOURCE', value: 'South African Police Service' },
                      { label: 'LAST VERIFIED', value: person.updated_at ? `${new Date(person.updated_at).toLocaleDateString('en-ZA')} (${daysAgo} days ago)` : 'Recently' },
                      { label: 'RECORD ID', value: person.id.slice(0, 8) },
                    ].map(item => (
                      <div key={item.label}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B7280', display: 'block', marginBottom: 4 }}>{item.label}</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {daysAgo !== null && daysAgo > 7 && (
                    <div style={{ background: '#FEF2F2', padding: 12, borderLeft: '3px solid #DC2626', marginTop: 16 }}>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
                        ⚠️ This data is {daysAgo} days old and may be outdated. Verify current status with SAPS directly.
                      </span>
                    </div>
                  )}
                </div>

                {/* Identity Confidence */}
                <div style={{ padding: 32, borderBottom: '1.5px solid var(--cream)' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
                    Identity Verification Confidence
                  </h3>
                  <Progress
                    value={confidence}
                    className="h-3 mb-3"
                    style={{
                      background: 'var(--cream)',
                    }}
                  />
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 12,
                    color: confidence >= 71 ? 'var(--green)' : confidence >= 41 ? '#EA580C' : '#DC2626',
                  }}>
                    {confidence >= 71 ? '✓ HIGH CONFIDENCE — Strong identity indicators present' :
                     confidence >= 41 ? '⚠️ MEDIUM CONFIDENCE — Verify with additional data' :
                     '⚠️ LOW CONFIDENCE — Additional verification required'}
                  </p>
                  {confidence < 70 && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'var(--mid)', lineHeight: 1.6 }}>
                      This match is based on name only. South Africa has many people with identical names. DO NOT assume this is the correct person without verifying date of birth, location, and other details.
                    </p>
                  )}
                </div>

                {/* Contact Section */}
                <div style={{ padding: 32, background: '#F9FAFB' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
                    📞 For Current Case Status, Contact:
                  </h3>
                  <div className="results-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    <div style={{ background: 'white', padding: 20, border: '1.5px solid var(--cream)' }}>
                      <span style={{ fontSize: 24 }}>🚨</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginTop: 8 }}>EMERGENCY</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#DC2626', display: 'block' }}>10111</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#78716C' }}>SAPS Emergency</span>
                    </div>
                    <div style={{ background: 'white', padding: 20, border: '1.5px solid var(--cream)' }}>
                      <span style={{ fontSize: 24 }}>📞</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginTop: 8 }}>CRIME STOP</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--ink)', display: 'block' }}>08600 10111</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#78716C' }}>Anonymous Tips</span>
                    </div>
                    <div style={{ background: 'white', padding: 20, border: '1.5px solid var(--cream)' }}>
                      <span style={{ fontSize: 24 }}>🏢</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginTop: 8 }}>POLICE STATION</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--ink)', display: 'block' }}>{person.police_station || 'Contact local station'}</span>
                      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#78716C' }}>Contact for case details</span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C', marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--cream)' }}>
                    Do not confront this person. Do not meet them alone. Share this information with a trusted friend or family member immediately if you are concerned.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="results-actions" style={{ padding: 32, borderTop: '1.5px solid var(--ink)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <button onClick={handleDownload} style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Download Full Report
                  </button>
                  <button style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Report Case Update
                  </button>
                  <button onClick={() => { setDisputeRecord(person); setIsDisputeModalOpen(true); }} style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Challenge This Result
                  </button>
                </div>

                {/* Legal Footer */}
                <div style={{ padding: 32, background: '#FEF2F2', borderTop: '1.5px solid #DC2626' }}>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⚖️ Important Legal Notice
                  </h4>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'var(--mid)', lineHeight: 1.8 }}>
                    RedFlaq reports public records only. This is not a determination of guilt. Legal proceedings are ongoing until concluded by a court of law. Always verify current status with official sources before making any decisions.
                    <br /><br />
                    DO NOT use this information to harass, discriminate against, defame, or harm this person. Unlawful use of this information is prohibited and prosecutable under South African law.
                    <br /><br />
                    Under POPIA, this person has the right to challenge this information. If you are the subject of this search and believe it contains errors, click 'Challenge This Result' above.
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Multi-match verification helper */}
        {isMultiple && (
          <div style={{ background: 'var(--cream)', padding: 32, border: '1.5px solid var(--ink)', marginTop: 8 }}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
              How to Verify the Correct Person
            </h3>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'var(--mid)', lineHeight: 1.8 }}>
              {['Compare date of birth if known', 'Check police station location (does it match where they live/lived?)', 'Look at case dates (were they in that area at that time?)', 'Compare photos if available (note: photos may be old)', 'Check case number format and court references'].map(item => (
                <p key={item} style={{ marginBottom: 4 }}>✓ {item}</p>
              ))}
            </div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', marginTop: 16, letterSpacing: '0.05em' }}>
              IF YOU CANNOT VERIFY WITH CONFIDENCE, DO NOT USE THIS INFORMATION. CONTACT SAPS DIRECTLY OR REQUEST HUMAN VERIFICATION FROM REDFLAQ.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
              <button style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Request Human Verification - R49
              </button>
              <button style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                None of These Match
              </button>
            </div>
          </div>
        )}

        {/* Empty State — No matches */}
        {!results.isWanted && (
          <div style={{ border: '1.5px solid var(--ink)', background: 'var(--paper)', padding: 48, textAlign: 'center' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>✅</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--ink)', marginBottom: 12 }}>
              No Red Flags Found in Public Records
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'var(--mid)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 24px' }}>
              We searched SAPS wanted persons, court judgments, and government gazettes and found no criminal records, active warrants, or legal notices for this person as of {searchDate}.
            </p>

            <div style={{ background: 'white', border: '1.5px solid var(--cream)', padding: 24, textAlign: 'left', maxWidth: 520, margin: '0 auto 24px' }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#EA580C', marginBottom: 8 }}>
                This Does NOT Guarantee:
              </p>
              <ul style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, listStyle: 'disc', paddingLeft: 20, margin: '0 0 12px' }}>
                <li>No criminal history exists</li>
                <li>No unreported incidents occurred</li>
                <li>Complete safety or trustworthiness</li>
                <li>All public records were searched</li>
              </ul>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--mid)', marginTop: 12 }}>
                Public records are not comprehensive. They don't show sealed records, juvenile cases, recent crimes not yet in databases, protection orders, or private conduct. Always combine this search with your own judgment, references, and personal verification. If something feels wrong, trust that feeling.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={handleDownload} style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Download No-Record Certificate
              </button>
              <button onClick={() => {
                const paymentId = sessionStorage.getItem("currentPaymentId");
                navigate(paymentId ? `/search-form?payment_id=${paymentId}` : "/");
              }} style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Search Another Person
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .results-photo-grid { grid-template-columns: 1fr !important; }
          .results-photo-grid > div:first-child { display: flex; flex-direction: column; align-items: center; }
          .results-contact-grid { grid-template-columns: 1fr !important; }
          .results-actions { flex-direction: column; }
          .results-actions button { width: 100%; }
          .results-verification-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => { setIsDisputeModalOpen(false); setDisputeRecord(null); }}
        record={disputeRecord}
      />
    </div>
  );
};

export default ResultsPageUpdated;
