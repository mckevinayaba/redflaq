import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DisputeModal } from "@/components/DisputeModal";
import SafetyWinScreen from "@/components/SafetyWinScreen";
import { Progress } from "@/components/ui/progress";
import IdentityMatchSelector from "@/components/IdentityMatchSelector";
import { type PersonRecord } from "@/utils/identityConfidence";
import { supabase } from "@/integrations/supabase/client";
import ShareInviteModal from "@/components/ShareInviteModal";
import ShareControlsModal from "@/components/ShareControlsModal";

interface WantedPerson {
  id: string;
  full_name: string;
  first_name: string;
  surname: string;
  charges: string;
  photo_url?: string;
  detail_page_url?: string;
  source_url?: string;
  source_urls?: string[];
  case_number?: string;
  police_station?: string;
  court_case_number?: string;
  court_name?: string;
  legal_status?: string;
  province?: string;
  updated_at?: string;
  date_wanted?: string;
  identity_confidence_score?: number;
  requires_human_verification?: boolean;
  gender?: string;
  year_of_birth?: number;
  offense_categories?: string[];
  offense_categories_derived?: string[];
  source_dataset?: string;
  aliases?: string[];
  confidence?: number;
  match_type?: string;
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
  recommendation?: string;
}

const getConfidence = (person: WantedPerson) => {
  return person.confidence || 20;
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

const getOfficialSourceUrl = (person: WantedPerson): string | null => {
  if (person.detail_page_url) return person.detail_page_url;
  if (person.source_url && person.source_url !== 'https://www.saps.gov.za/crimestop/wanted/list.php') return person.source_url;
  if (person.source_urls && person.source_urls.length > 0) return person.source_urls[0];
  if (person.source_dataset === 'za_wanted') return 'https://www.saps.gov.za/crimestop/wanted/list.php';
  return null;
};

const getSourceLabel = (person: WantedPerson): string => {
  if (person.source_dataset === 'za_wanted') return 'SAPS Wanted Persons';
  if (person.source_dataset === 'za_fic_sanctions') return 'FIC Sanctions List';
  if (person.source_dataset === 'saflii') return 'SAFLII Court Judgment';
  if (person.source_dataset === 'gazette') return 'Government Gazette — Financial Court Order';
  return 'South African Public Records';
};

const getSourceTrustBadge = (person: WantedPerson): { icon: string; label: string; level: string; color: string } => {
  if (person.source_dataset === 'za_wanted') return { icon: '🚔', label: 'Official SAPS Database', level: 'HIGH', color: '#DC2626' };
  if (person.source_dataset === 'za_fic_sanctions') return { icon: '💰', label: 'FIC Sanctions — Government', level: 'HIGH', color: '#DC2626' };
  if (person.source_dataset === 'saflii') return { icon: '⚖️', label: 'Court Record — SAFLII', level: 'MEDIUM', color: '#1E40AF' };
  if (person.source_dataset === 'gazette') return { icon: '📰', label: 'Government Gazette', level: 'MEDIUM', color: '#D97706' };
  return { icon: '📋', label: 'Public Record', level: 'STANDARD', color: '#6B7280' };
};

const getRiskBadge = (riskLevel: string) => {
  switch (riskLevel) {
    case 'RED':
      return { color: '#7C3AED', bg: '#FAF5FF', label: 'SERIOUS RED FLAG', icon: '🟣' };
    case 'ORANGE':
      return { color: '#D97706', bg: '#FFFBEB', label: 'MEDIUM RISK', icon: '🟠' };
    case 'YELLOW':
      return { color: '#CA8A04', bg: '#FEFCE8', label: 'ELEVATED', icon: '🟡' };
    default:
      return { color: '#6B7280', bg: '#F9FAFB', label: 'NO PUBLIC RED FLAGS', icon: '✅' };
  }
};

const getRiskExplainer = (riskLevel: string, persons: WantedPerson[]) => {
  const hasViolent = persons.some(p => /murder|assault|rape|sexual|violence|attack|stab|shoot|firearm/i.test(p.charges));
  const hasSanctions = persons.some(p => p.source_dataset === 'za_fic_sanctions');
  
  switch (riskLevel) {
    case 'RED':
      return {
        title: 'We found public‑record warnings linked to this name that suggest a serious safety concern. Carefully consider your next steps and prioritise your safety.',
        triggers: [
          hasViolent ? 'Active warrant for violent crime (assault, murder, sexual offense, or firearms)' : null,
          hasSanctions ? 'Listed on FIC financial sanctions list' : null,
          'Strong match confidence to this individual',
        ].filter(Boolean),
        action: 'Safety first: Do NOT meet this person alone. Do NOT confront them. Share this report with a trusted person. If you feel unsafe, call SAPS on 10111 or Crime Stop on 08600 10111.',
      };
    case 'ORANGE':
      return {
        title: 'We found some public‑record warnings linked to this name. They may or may not be current, but they are important context for your decision.',
        triggers: [
          'Active warrant or legal notice found in public records',
          persons.length > 1 ? 'Multiple possible matches — verify identity carefully' : null,
          hasSanctions ? 'Listed on FIC sanctions/watchlist' : null,
        ].filter(Boolean),
        action: 'Proceed with caution. Verify the identity carefully using date of birth and location. Consider meeting in a public place and informing someone of your plans.',
      };
    case 'YELLOW':
      return {
        title: 'We found limited or lower‑level public‑record information linked to this name. It does not eliminate risk, but there are no serious warnings in our sources.',
        triggers: [
          'A possible match was found but confidence is low',
          'Name may match multiple people in the database',
        ],
        action: 'This may not be the same person. Verify with additional information before making decisions. Contact SAPS for official confirmation.',
      };
    default:
      return {
        title: 'We did not find matching public‑record warnings for this name in the sources we currently check. This does not guarantee safety, but no visible red flags were found.',
        triggers: ['No active warrants, sanctions, or legal notices found in searched databases'],
        action: 'A clean result does not mean "no criminal record" — it means no match in these public sources. Always trust your instincts and take normal precautions.',
      };
  }
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
  const [shareOpen, setShareOpen] = useState(false);
  const [shareControlsOpen, setShareControlsOpen] = useState(false);
  const [pendingDownload, setPendingDownload] = useState(false);
  const searchId = searchParams.get("search_id");

  useEffect(() => {
    if (!searchId) {
      toast.error("Invalid search ID");
      navigate("/");
      return;
    }

    const fetchResults = async () => {
      try {
        // Fetch from database
        const { data, error } = await supabase
          .from('searches')
          .select('*')
          .eq('search_id', searchId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const parsedResults = data.results as unknown as WantedPerson[];
          setResults({
            searchId: data.search_id,
            fullName: data.search_name || '',
            idNumber: data.search_id_number || '',
            riskLevel: data.risk_level,
            riskScore: data.is_wanted ? 100 : 0,
            isWanted: data.is_wanted,
            wantedPersonsCount: data.matches_found,
            wantedPersons: parsedResults || [],
            searchedAt: data.searched_at,
            hasMultipleMatches: data.matches_found > 1,
            recommendation: data.recommendation || undefined,
          });

          if (data.matches_found > 1) {
            setShowMatchSelector(true);
          }
        } else {
          // Fallback: check sessionStorage for just-completed searches
          const storedResult = sessionStorage.getItem("searchResult");
          if (storedResult) {
            const parsed = JSON.parse(storedResult);
            setResults(parsed);
            if (parsed.hasMultipleMatches && parsed.wantedPersonsCount > 1) {
              setShowMatchSelector(true);
            }
            sessionStorage.removeItem("searchResult");
          } else {
            toast.error("Search not found. It may have expired.");
            navigate("/");
            return;
          }
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
        toast.error("Failed to load search results");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchId, navigate]);

  const doDownload = async () => {
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

  const handleDownload = () => {
    setShareControlsOpen(true);
    setPendingDownload(true);
  };

  const handleShareControlsAgree = () => {
    if (pendingDownload) {
      doDownload();
      setPendingDownload(false);
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
  const riskBadge = getRiskBadge(results.riskLevel);
  const riskExplainer = getRiskExplainer(results.riskLevel, results.wantedPersons);

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div className="results-container" style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: 24 }}>
          SEARCH RESULTS · {(results.searchType || 'person').toUpperCase().replace('_', ' ')} · {searchDate} {searchTime}
        </p>

        {/* Risk Level Summary */}
        <div style={{ background: riskBadge.bg, border: `2px solid ${riskBadge.color}`, padding: 32, marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 32 }}>{riskBadge.icon}</span>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, letterSpacing: '0.1em', color: riskBadge.color, fontWeight: 700 }}>{riskBadge.label}</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: 'var(--ink)', margin: '4px 0 0' }}>
                {results.fullName || results.searchIdentifier}
              </h2>
            </div>
          </div>

          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: riskBadge.color, marginBottom: 12 }}>
            {riskExplainer.title}
          </h3>
          
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 8 }}>WHAT TRIGGERED THIS:</p>
            <ul style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, listStyle: 'disc', paddingLeft: 20, margin: 0 }}>
              {riskExplainer.triggers.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div style={{ background: 'white', padding: 16, borderLeft: `3px solid ${riskBadge.color}` }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: 'var(--muted)', marginBottom: 4 }}>WHAT YOU SHOULD DO:</p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{riskExplainer.action}</p>
          </div>

          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)', marginTop: 16 }}>
            RedFlaq uses South African public‑record warning lists. It is not a full SAPS criminal record.
          </p>
        </div>

        {/* Safety Win Screen for clear/low risk results */}
        <SafetyWinScreen riskLevel={results.riskLevel} onClose={() => {}} />

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

        {/* Multiple Matches Warning */}
        {isMultiple && !showMatchSelector && (
          <div style={{ background: '#FEF2F2', border: '2px solid #DC2626', padding: 32, marginBottom: 32 }}>
            <span style={{ fontSize: 40 }}>⚠️</span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#DC2626', margin: '12px 0' }}>
              Multiple Possible Matches Found
            </h2>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'var(--mid)', lineHeight: 1.7, marginBottom: 20 }}>
              We found {results.wantedPersonsCount} people with this name in public records. South Africa has many people with identical names. You MUST verify which person matches who you are searching for before making any decisions.
            </p>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: '#DC2626', background: 'white', padding: 16, borderLeft: '4px solid #DC2626', marginBottom: 24 }}>
              Using information about the wrong person is illegal under POPIA. Verify identity carefully using date of birth, location, and case details.
            </div>

            {/* Verification Checklist */}
            <div style={{ background: '#EFF6FF', padding: 24, border: '1.5px solid #3B82F6', marginBottom: 24 }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#1E40AF', marginBottom: 12 }}>
                How to Verify the Correct Person
              </p>
              {['Compare date of birth if known', 'Check police station location (does it match where they live?)', 'Look at case dates (were they in that area at that time?)', 'Compare photos if available (note: photos may be old)', 'Review case details and offense descriptions'].map(item => (
                <p key={item} style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#4B4453', lineHeight: 2 }}>✓ {item}</p>
              ))}
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#DC2626', fontWeight: 600, marginTop: 16, letterSpacing: '0.05em' }}>
                IF YOU CANNOT VERIFY WITH CONFIDENCE, DO NOT USE THIS INFORMATION
              </p>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate("/dashboard/new-check")}
                style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 24px', fontFamily: "'Syne', sans-serif", fontWeight: 600, cursor: 'pointer' }}
              >
                None of These Match
              </button>
            </div>
          </div>
        )}

        {/* Wanted Person Cards */}
        {results.isWanted && results.wantedPersons.map((person, idx) => {
          const confidence = getConfidence(person);
          const daysAgo = getDaysAgo(person.updated_at);
          const isViolent = /murder|assault|rape|sexual|violence|attack|stab|shoot/i.test(person.charges);
          const offenseCategories = person.offense_categories_derived || person.offense_categories || [];
          const officialUrl = getOfficialSourceUrl(person);
          const sourceLabel = getSourceLabel(person);
          const trustBadge = getSourceTrustBadge(person);

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
                    <span style={{ position: 'absolute', top: 16, right: 16, background: '#7C3AED', color: 'white', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '4px 12px' }}>
                      MATCH {idx + 1} OF {results.wantedPersonsCount}
                    </span>
                  )}
                  <span style={{
                    display: 'inline-block', padding: '6px 16px', marginBottom: 16,
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontWeight: 600,
                    background: person.source_dataset === 'saflii' ? '#1E40AF' : isViolent ? '#7C3AED' : person.legal_status === 'wanted' || !person.legal_status ? '#D97706' : '#6B7280',
                    color: 'white',
                  }}>
                    {person.source_dataset === 'saflii' ? `⚖️ COURT JUDGMENT FOUND — ${person.charges}` : person.legal_status === 'wanted' || !person.legal_status ? `WANTED — ${person.charges}` : person.court_case_number ? 'COURT RECORD FOUND' : 'LEGAL NOTICE FOUND'}
                  </span>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 8 }}>
                    {person.full_name}
                  </h2>
                  {person.aliases && person.aliases.length > 0 && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
                      Also known as: {person.aliases.join(', ')}
                    </p>
                  )}
                  {results.idNumber && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--muted)' }}>
                      ID: {redactId(results.idNumber)}
                    </p>
                  )}
                </div>

                {/* Trust Badge */}
                <div style={{ padding: '12px 32px', borderBottom: '1.5px solid var(--cream)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em',
                    background: `${trustBadge.color}10`, color: trustBadge.color, fontWeight: 700, border: `1px solid ${trustBadge.color}30`,
                  }}>
                    {trustBadge.icon} {trustBadge.label} · TRUST: {trustBadge.level}
                  </span>

                  {/* Crime Type Tags */}
                  {offenseCategories.map((cat, i) => (
                    <span key={i} style={{
                      display: 'inline-block', padding: '4px 12px',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                      background: isViolent ? '#F3E8FF' : '#FEF3C7',
                      color: isViolent ? '#6D28D9' : '#92400E',
                      fontWeight: 600,
                    }}>
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Photo & Details */}
                <div className="results-photo-grid" style={{ padding: 32, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32 }}>
                  <div>
                    {person.photo_url ? (
                      <>
                        <div style={{ width: 200, height: 200, border: '1.5px solid var(--cream)', overflow: 'hidden' }}>
                          <img src={person.photo_url} alt={person.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(40%)' }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--muted)', display: 'block', marginTop: 8 }}>Photo source: {sourceLabel}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#EA580C', display: 'block', marginTop: 4 }}>Photos may be outdated. Do not rely on photo alone.</span>
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
                      { label: 'GENDER', value: person.gender ? person.gender.charAt(0).toUpperCase() + person.gender.slice(1) : null },
                      { label: 'YEAR OF BIRTH', value: person.year_of_birth ? String(person.year_of_birth) : null },
                      { label: 'POLICE STATION', value: person.police_station },
                      { label: 'PROVINCE', value: person.province },
                      { label: 'CASE NUMBER', value: person.case_number },
                      { label: 'COURT', value: person.court_name || person.court_case_number },
                      { label: 'DATE LISTED', value: person.date_wanted ? new Date(person.date_wanted).toLocaleDateString('en-ZA') : null },
                      { label: 'DATA SOURCE', value: sourceLabel },
                    ].filter(d => d.value).map(d => (
                      <div key={d.label} style={{ marginBottom: 16 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: 4 }}>{d.label}</span>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: d.highlight ? '#DC2626' : 'var(--ink)', fontWeight: d.highlight ? 700 : 500 }}>{d.value}</span>
                      </div>
                    ))}

                    {/* View on official source link */}
                    {officialUrl && (
                      <div style={{ marginTop: 8 }}>
                        <a
                          href={officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
                            color: '#2563EB', textDecoration: 'underline',
                          }}
                        >
                          🔗 View on official source →
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* What This Means */}
                <div style={{ padding: 32, background: person.source_dataset === 'saflii' ? '#EFF6FF' : '#FFFBEB', borderTop: '1.5px solid var(--cream)', borderBottom: '1.5px solid var(--cream)' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: person.source_dataset === 'saflii' ? '#1E40AF' : 'var(--gold)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {person.source_dataset === 'saflii' ? '⚖️ What This Means' : '⚠️ What This Means'}
                  </h3>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'var(--mid)', lineHeight: 1.7 }}>
                    {person.source_dataset === 'saflii'
                      ? `A criminal court judgment was found on SAFLII (Southern African Legal Information Institute) involving a person with this name. The judgment is from ${(person as any).saflii_court_code ? `the ${person.court_name}` : 'a South African High Court'}${(person as any).saflii_year ? ` (${(person as any).saflii_year})` : ''}. This is a public court record — not a RedFlaq determination.`
                      : person.source_dataset === 'za_fic_sanctions' 
                        ? `This person appears on the Financial Intelligence Centre (FIC) sanctions list. This indicates they are subject to financial restrictions or watchlist monitoring as of ${person.updated_at ? new Date(person.updated_at).toLocaleDateString('en-ZA') : 'recently'}.`
                        : `An active arrest warrant is listed on the SAPS wanted persons database as of ${person.updated_at ? new Date(person.updated_at).toLocaleDateString('en-ZA') : 'recently'}.`
                    }
                  </p>
                  {person.source_dataset === 'saflii' && (
                    <div style={{ background: 'white', padding: 16, borderLeft: '3px solid #1E40AF', marginTop: 16 }}>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#1E40AF', marginBottom: 8 }}>Important Limitations:</p>
                      <ul style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, listStyle: 'disc', paddingLeft: 20, margin: 0 }}>
                        <li>Only High Court and above — most GBV cases start in Magistrate Courts (not on SAFLII)</li>
                        <li>Not every conviction produces a written judgment</li>
                        <li>Name-only matching means this may be a different person with the same name</li>
                        <li>Courts may anonymise parties in certain cases</li>
                      </ul>
                    </div>
                  )}
                  <div style={{ background: 'white', padding: 16, borderLeft: '3px solid #EA580C', marginTop: 16 }}>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>This Does NOT Confirm:</p>
                    <ul style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, listStyle: 'disc', paddingLeft: 20, margin: 0 }}>
                      <li>Whether this person is currently wanted or sanctioned</li>
                      <li>Whether they have been arrested or cleared</li>
                      <li>Current bail, custody, or legal status</li>
                      <li>Case progression, court dates, or outcomes</li>
                      <li>Any conviction — only allegations</li>
                    </ul>
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginTop: 12, fontStyle: 'italic' }}>
                    Public records are not updated in real-time. This listing may be outdated. The person may have been arrested, case may have progressed, or warrant may have been withdrawn.
                  </p>
                </div>

                {/* Verification Info */}
                <div style={{ padding: 32, background: '#EFF6FF', borderBottom: '1.5px solid var(--cream)' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    ✓ Verification Information
                  </h3>
                  <div className="results-verification-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {[
                      { label: 'SOURCE', value: sourceLabel },
                      { label: 'LAST VERIFIED', value: person.updated_at ? `${new Date(person.updated_at).toLocaleDateString('en-ZA')} (${daysAgo} days ago)` : 'Recently' },
                      { label: 'MATCH TYPE', value: person.match_type?.replace(/_/g, ' ').toUpperCase() || 'NAME MATCH' },
                      { label: 'CONFIDENCE', value: `${confidence}%` },
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
                    style={{ background: 'var(--cream)' }}
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

                {/* Safety Warning */}
                <div style={{ padding: 32, background: '#FAF5FF', borderBottom: '1.5px solid var(--cream)', borderLeft: '4px solid #7C3AED' }}>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    💜 Safety First
                  </h3>
                  <ul style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'var(--mid)', lineHeight: 1.8, listStyle: 'none', padding: 0, margin: 0 }}>
                    <li>❌ Do NOT confront this person yourself</li>
                    <li>❌ Do NOT meet them alone or in a private location</li>
                    <li>✅ Share this report with a trusted friend or family member</li>
                    <li>✅ If you feel unsafe, call SAPS on <strong>10111</strong> immediately</li>
                    <li>✅ For non-emergency tips, call Crime Stop on <strong>08600 10111</strong></li>
                    <li>✅ Verify current case status with your local police station</li>
                  </ul>
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
                </div>

                {/* Action Buttons */}
                <div className="results-actions" style={{ padding: 32, borderTop: '1.5px solid var(--ink)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <button onClick={handleDownload} style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Download Full Report
                  </button>
                  <button onClick={() => { setDisputeRecord(person); setIsDisputeModalOpen(true); }} style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                    Challenge This Result
                  </button>
                  {officialUrl && (
                    <a href={officialUrl} target="_blank" rel="noopener noreferrer" style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}>
                      View Official Source
                    </a>
                  )}
                </div>

                {/* Legal Footer */}
                <div style={{ padding: 32, background: '#FEF2F2', borderTop: '1.5px solid #DC2626' }}>
                  <h4 style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                    ⚖️ Important Legal Notice
                  </h4>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'var(--mid)', lineHeight: 1.8 }}>
                    RedFlaq reports public records only, sourced from SAPS wanted persons lists, SAFLII court judgments, and FIC sanctions data via OpenSanctions. This is not a determination of guilt. Legal proceedings are ongoing until concluded by a court of law. Always verify current status with official sources before making any decisions.
                    <br /><br />
                    DO NOT use this information to harass, discriminate against, defame, or harm this person. Unlawful use of this information is prohibited and prosecutable under South African law, including under POPIA (Protection of Personal Information Act) and the Harassment Act.
                    <br /><br />
                    RedFlaq is not a replacement for SAPS, the courts, or any official authority. We provide no guarantee of completeness — records may be missing, outdated, or belong to a different person with the same name.
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
          </div>
        )}

        {/* Empty State */}
        {!results.isWanted && (
          <div style={{ border: '1.5px solid var(--ink)', background: 'var(--paper)', padding: 48, textAlign: 'center' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>✅</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--ink)', marginBottom: 12 }}>
              No public red flags found
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'var(--mid)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 24px' }}>
              We searched the South African SAPS wanted persons list, SAFLII court judgments, and FIC sanctions list and found no matches for this name as of {searchDate}. This does not mean "no criminal record" — only that no match was found in these specific public sources.
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
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 32 }}>
          <button
            onClick={() => navigate("/dashboard/new-check")}
            style={{ background: '#7C3AED', color: 'white', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer' }}
          >
            Run another safety check
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '14px 28px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            Back to Dashboard
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>
          If this helped you, you can{" "}
          <button
            onClick={() => setShareOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#7C3AED', textDecoration: 'underline', padding: 0 }}
          >
            share RedFlaq with another woman who needs it
          </button>.
        </p>
        <p style={{ textAlign: 'center', marginTop: 16, fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#78716C', lineHeight: 1.7, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
          RedFlaq is a support tool, not a replacement for police, social workers or legal advice. If you are in immediate danger, contact emergency services or trusted support organisations.
        </p>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}
          >
            ← Back to redflaq.com homepage
          </a>
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .results-photo-grid { grid-template-columns: 1fr !important; }
          .results-photo-grid > div:first-child { display: flex; flex-direction: column; align-items: center; }
          .results-contact-grid { grid-template-columns: 1fr !important; }
          .results-actions { flex-direction: column; }
          .results-actions button, .results-actions a { width: 100%; text-align: center; }
          .results-verification-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <ShareControlsModal
        open={shareControlsOpen}
        onClose={() => { setShareControlsOpen(false); setPendingDownload(false); }}
        onAgree={handleShareControlsAgree}
      />

      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />

      <DisputeModal
        isOpen={isDisputeModalOpen}
        onClose={() => { setIsDisputeModalOpen(false); setDisputeRecord(null); }}
        record={disputeRecord}
      />
    </div>
  );
};

export default ResultsPageUpdated;
