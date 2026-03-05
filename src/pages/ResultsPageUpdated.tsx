import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DisputeModal } from "@/components/DisputeModal";
import { Progress } from "@/components/ui/progress";
import IdentityMatchSelector from "@/components/IdentityMatchSelector";
import { type PersonRecord } from "@/utils/identityConfidence";
import { supabase } from "@/integrations/supabase/client";
import ShareInviteModal from "@/components/ShareInviteModal";
import ShareControlsModal from "@/components/ShareControlsModal";
import PostReportGuidance from "@/components/PostReportGuidance";
import GetHelpModal from "@/components/GetHelpModal";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import Footer from "@/components/Footer";
import { ArrowLeft, Plus } from "lucide-react";

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
      return { color: 'hsl(var(--purple))', bg: 'hsl(var(--purple-50))', label: 'SERIOUS RED FLAG', icon: '🟣', borderClass: 'border-purple-600' };
    case 'ORANGE':
      return { color: 'hsl(var(--gold))', bg: 'hsl(var(--purple-50))', label: 'MEDIUM RISK', icon: '🟠', borderClass: 'border-orange-500' };
    case 'YELLOW':
      return { color: '#CA8A04', bg: '#FEFCE8', label: 'ELEVATED', icon: '🟡', borderClass: 'border-yellow-500' };
    default:
      return { color: 'hsl(var(--muted-foreground))', bg: 'hsl(var(--background))', label: 'NO PUBLIC RED FLAGS', icon: '—', borderClass: 'border-border' };
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
        title: 'We did not find matching public‑record warnings for this name in the sources we currently check. This does not guarantee safety. Read the critical warning below before proceeding.',
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
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const searchId = searchParams.get("search_id");

  useEffect(() => {
    if (!searchId) {
      toast.error("Invalid search ID");
      navigate("/");
      return;
    }

    const fetchResults = async () => {
      try {
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
            riskScore: (data as any).risk_score ?? (data.is_wanted ? 100 : 0),
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-body text-base text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  // CRITICAL FIX: A result is only "clear" if ZERO records found AND risk level is GREEN
  // Never show clear when ANY records exist, even with low confidence
  const hasRecords = results.wantedPersonsCount > 0 || results.wantedPersons.length > 0;
  const isClear = !hasRecords && results.riskLevel === 'GREEN';
  const isUncertainMatch = hasRecords && results.wantedPersons.every(p => (p.confidence || 20) < 50);
  const isMultiple = results.wantedPersonsCount > 1;
  const searchDate = new Date(results.searchedAt).toLocaleDateString('en-ZA', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const searchTime = new Date(results.searchedAt).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });

  // Override risk badge: if records exist but riskLevel is GREEN, force to YELLOW
  const effectiveRiskLevel = (hasRecords && results.riskLevel === 'GREEN') ? 'YELLOW' : results.riskLevel;
  const riskBadge = isUncertainMatch
    ? { color: '#CA8A04', bg: '#FEFCE8', label: 'UNCERTAIN MATCH', icon: '⚠️', borderClass: 'border-yellow-500' }
    : getRiskBadge(effectiveRiskLevel);
  const riskExplainer = isUncertainMatch
    ? {
        title: 'We found records linked to a similar name, but we cannot confirm this is the same person. Match confidence is low — verify carefully before making any decisions.',
        triggers: [
          'Name similarity match only — no ID or additional data confirmed',
          'This could be a different person with the same or similar name',
          results.wantedPersonsCount > 1 ? `${results.wantedPersonsCount} possible matches found` : 'Single low-confidence match found',
        ].filter(Boolean),
        action: 'DO NOT assume this is the same person. Verify with date of birth, location, and case details. If unsure, request Human Verification or contact SAPS directly.',
      }
    : getRiskExplainer(effectiveRiskLevel, results.wantedPersons);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <NavbarPlinq />
      {/* Spacer for fixed navbar */}
      <div style={{ height: 80 }} />

      {/* Back to Dashboard bar */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-[900px] mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-body font-semibold text-muted-foreground hover:text-foreground transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard/new-check')}
            className="flex items-center gap-2 text-sm font-body font-semibold text-primary hover:text-primary/80 transition-colors"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Plus className="h-4 w-4" /> Run Another Check
          </button>
        </div>
      </div>

      {/* Top bar */}
      <div className="bg-foreground text-background">
        <div className="max-w-[900px] mx-auto px-6 py-3 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase opacity-70">
            RedFlaq · Search Report
          </span>
          <span className="font-mono text-[10px] tracking-[0.1em] opacity-50">
            {searchDate} · {searchTime}
          </span>
        </div>
      </div>

      <div className="results-container max-w-[900px] mx-auto px-6 pt-10 pb-20 flex-1">

        {/* ─── RISK LEVEL HEADER ─── */}
        <div
          className="border-2 overflow-hidden mb-8"
          style={{ borderColor: riskBadge.color }}
        >
          {/* Colored top strip */}
          <div className="px-8 py-3" style={{ background: riskBadge.color }}>
            <span className="font-mono text-[11px] tracking-[0.15em] text-white font-bold">
              {riskBadge.label}
            </span>
          </div>

          <div className="p-8 bg-card">
            {/* Name */}
            <h1 className="font-heading text-3xl sm:text-4xl text-foreground mb-3 leading-tight">
              {results.fullName || results.searchIdentifier}
            </h1>

            {/* Explainer */}
            <p className="font-body text-[15px] leading-relaxed text-muted-foreground mb-6 max-w-2xl">
              {riskExplainer.title}
            </p>

            {/* Triggers */}
            <div className="mb-6">
              <p className="font-mono text-[10px] tracking-[0.12em] text-muted-foreground mb-2 uppercase">What triggered this</p>
              <ul className="space-y-1.5">
                {riskExplainer.triggers.map((t, i) => (
                  <li key={i} className="font-body text-sm text-foreground flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: riskBadge.color }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action box */}
            <div className="border-l-[3px] pl-5 py-3" style={{ borderColor: riskBadge.color, background: `${riskBadge.color}08` }}>
              <p className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground mb-1 uppercase">What you should do</p>
              <p className="font-body text-sm font-semibold text-foreground leading-relaxed">{riskExplainer.action}</p>
            </div>

            <p className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground mt-5 opacity-70">
              RedFlaq uses South African public‑record warning lists. It is not a full SAPS criminal record.
            </p>
          </div>
        </div>

        {/* ─── GET HELP BUTTON ─── */}
        {results.riskLevel === 'RED' ? (
          <button
            onClick={() => setHelpModalOpen(true)}
            className="w-full py-5 bg-destructive text-destructive-foreground border-none font-body text-lg font-bold cursor-pointer mb-8 animate-pulse"
          >
            🆘 Get Help Now — Speak to Someone
          </button>
        ) : (
          <button
            onClick={() => setHelpModalOpen(true)}
            className="w-full py-4 bg-primary text-primary-foreground border-none font-body text-base font-semibold cursor-pointer mb-8 hover:bg-primary/90 transition-colors"
          >
            Need Support? View Resources
          </button>
        )}

        <GetHelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} riskLevel={results.riskLevel} />

        {/* ─── WHAT THIS MEANS — GUIDED SECTION ─── */}
        <div className="bg-card border border-border overflow-hidden mb-8">
          <div className="px-8 py-3 bg-muted border-b border-border">
            <h3 className="font-heading text-lg text-foreground m-0">What This Means & What To Do Next</h3>
          </div>
          <div className="p-8">
            {/* CLEAR — only when truly zero records */}
            {isClear && !hasRecords && (
              <div className="space-y-4">
                <p className="font-body text-[15px] leading-relaxed text-foreground">
                  <strong>No Records Found:</strong> We searched South African criminal databases and found no warrants, court cases, or criminal records.
                </p>
                <p className="font-body text-[15px] leading-relaxed text-foreground">
                  <strong>Remember:</strong> This doesn't guarantee safety. Most harmful people have no criminal record.
                </p>
                <div>
                  <p className="font-body text-[15px] font-bold text-foreground mb-2">Next Steps:</p>
                  <ul className="space-y-2 pl-5 list-disc font-body text-sm text-muted-foreground leading-relaxed">
                    <li>Trust your instincts — if something feels off, it probably is</li>
                    <li>Ask for references from mutual contacts</li>
                    <li>Meet in public places for first meetings</li>
                    <li>Tell someone where you're going and when you'll be back</li>
                    <li>Keep your phone charged and accessible</li>
                  </ul>
                </div>
              </div>
            )}

            {/* UNCERTAIN MATCH */}
            {isUncertainMatch && (
              <div className="space-y-4">
                <p className="font-body text-[15px] leading-relaxed text-orange-700 font-semibold">
                  ⚠️ UNCERTAIN MATCH — Cannot Confirm Identity
                </p>
                <p className="font-body text-[15px] leading-relaxed text-foreground">
                  We found someone with a similar name in our database, but match confidence is low. We <strong>cannot confirm</strong> if this is the same person you searched for.
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <p className="font-body text-sm font-bold text-orange-800 mb-2">⚠️ CRITICAL:</p>
                  <ul className="space-y-1.5 pl-5 list-disc font-body text-sm text-orange-700 leading-relaxed">
                    <li>This <strong>MIGHT</strong> be the person you're checking</li>
                    <li>This <strong>MIGHT</strong> be a different person with a similar name</li>
                    <li>DO NOT assume either way without verification</li>
                  </ul>
                </div>
                <div>
                  <p className="font-body text-[15px] font-bold text-foreground mb-2">Next Steps:</p>
                  <ul className="space-y-2 pl-5 list-disc font-body text-sm text-muted-foreground leading-relaxed">
                    <li>Verify with additional information (full legal name, date of birth, ID number)</li>
                    <li>Contact SAPS directly for official confirmation</li>
                    <li>If this IS the person: treat as a serious warning and prioritise safety</li>
                    <li>If this is NOT the person: a clear result still doesn't guarantee safety</li>
                    <li><strong>Protection orders are FREE:</strong> If you feel threatened, apply at any Magistrate's Court — no cost, no lawyer needed.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* YELLOW */}
            {results.riskLevel === 'YELLOW' && (
              <div className="space-y-4">
                <p className="font-body text-[15px] leading-relaxed text-foreground">
                  <strong>Minor Concerns Found:</strong> We found some records, but they appear to be minor or older offenses.
                </p>
                <div>
                  <p className="font-body text-[15px] font-bold text-foreground mb-2">Next Steps:</p>
                  <ul className="space-y-2 pl-5 list-disc font-body text-sm text-muted-foreground leading-relaxed">
                    <li>Review the details carefully — consider type and timing of offense</li>
                    <li>Use extra caution in initial interactions</li>
                    <li>Meet only in public places</li>
                    <li>Tell someone where you're going</li>
                    <li>If this is for employment or roommate situation, consider asking about these records directly</li>
                  </ul>
                </div>
              </div>
            )}

            {/* ORANGE */}
            {results.riskLevel === 'ORANGE' && (
              <div className="space-y-4">
                <p className="font-body text-[15px] leading-relaxed text-foreground">
                  <strong>Concerning Records Found:</strong> We found records that warrant serious caution.
                </p>
                <div>
                  <p className="font-body text-[15px] font-bold text-foreground mb-2">Next Steps:</p>
                  <ul className="space-y-2 pl-5 list-disc font-body text-sm text-muted-foreground leading-relaxed">
                    <li>Review all details carefully before making any decisions</li>
                    <li>If this is for dating: reconsider meeting this person</li>
                    <li>If this is for employment/roommate: seek alternative options if possible</li>
                    <li>If you must proceed: only meet in very public places, tell multiple people</li>
                    <li>Consider reaching out to a support service for advice (click "Get Help" above)</li>
                    <li><strong>Protection orders are FREE:</strong> If you feel threatened, you can apply for a protection order at any Magistrate's Court in South Africa at no cost. You do not need a lawyer. Court staff will help you complete the forms.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* RED */}
            {results.riskLevel === 'RED' && results.wantedPersonsCount > 0 && (
              <div className="space-y-4">
                <p className="font-body text-[15px] leading-relaxed text-destructive font-semibold">
                  ⚠️ HIGH RISK — Serious Safety Concerns: We found records showing patterns of violence, domestic abuse, or serious crimes.
                </p>
                <div>
                  <p className="font-body text-[15px] font-bold text-foreground mb-2">Immediate Actions:</p>
                  <ul className="space-y-2 pl-5 list-disc font-body text-sm text-foreground leading-relaxed">
                    <li><strong>Do NOT meet this person alone or in private</strong></li>
                    <li>If already in contact: end communication safely</li>
                    <li>If you feel threatened: call 10111 or 0800 428 428 immediately</li>
                    <li><strong>FREE Protection Orders:</strong> Apply at any Magistrate's Court — no cost, no lawyer needed. The court can issue an emergency protection order the same day if you're in immediate danger.</li>
                    <li>Tell trusted friends/family about the situation</li>
                    <li>Save all communications as evidence</li>
                    <li>Click "Get Help Now" above to speak with a GBV counselor</li>
                  </ul>
                </div>
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 mt-2">
                  <p className="font-body text-[15px] font-bold text-destructive leading-relaxed m-0">
                    Your safety is more important than any relationship, job, or living situation. There are people ready to help you. You don't have to face this alone.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── CRITICAL WARNING (CLEAR only) ─── */}
        {isClear && (
          <div className="border-2 border-yellow-500 bg-yellow-50 overflow-hidden mb-8">
            <div className="bg-yellow-500 px-8 py-3 flex items-center gap-3">
              <span className="text-white text-lg">⚠️</span>
              <span className="font-body text-sm font-bold text-white tracking-wide uppercase">
                Critical Warning — Read Before Proceeding
              </span>
            </div>
            <div className="p-8 space-y-4">
              <p className="font-body text-[15px] leading-relaxed text-yellow-900 font-semibold">
                No public records found does NOT mean this person is safe.
              </p>
              <p className="font-body text-sm leading-relaxed text-yellow-800">
                In South Africa, only 8% of rape cases result in convictions. Most people who cause harm have never been arrested or convicted.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/60 p-4 border border-yellow-200">
                  <p className="font-mono text-[10px] tracking-[0.1em] text-yellow-700 uppercase mb-2 font-bold">A clear result means</p>
                  <p className="font-body text-sm text-yellow-800 leading-relaxed">
                    We found no criminal records, warrants, or court cases in the South African public databases we searched.
                  </p>
                </div>
                <div className="bg-white/60 p-4 border border-yellow-200">
                  <p className="font-mono text-[10px] tracking-[0.1em] text-yellow-700 uppercase mb-2 font-bold">It does NOT mean</p>
                  <p className="font-body text-sm text-yellow-800 leading-relaxed">
                    This person has never hurt anyone, has no history of abuse, or is guaranteed to be safe.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-yellow-300">
                <p className="font-body text-sm font-bold text-yellow-900 leading-relaxed">
                  Always: Trust your instincts. Ask for references. Meet in public places. Tell someone where you're going.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── EMPTY STATE (CLEAR) ─── */}
        {isClear && (
          <div className="bg-card border border-border overflow-hidden mb-8">
            <div className="p-8 text-center">
              <div className="bg-muted border border-border p-5 max-w-lg mx-auto mb-6">
                <p className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase mb-2 font-bold">This does not guarantee</p>
                <ul className="font-body text-sm text-muted-foreground leading-relaxed space-y-1.5 text-left pl-5 list-disc">
                  <li>No criminal history exists</li>
                  <li>No unreported incidents occurred</li>
                  <li>Complete safety or trustworthiness</li>
                  <li>All public records were searched</li>
                </ul>
                <p className="font-body text-xs text-muted-foreground mt-4 text-left leading-relaxed">
                  Public records are not comprehensive. They don't show sealed records, juvenile cases, recent crimes not yet in databases, protection orders, or private conduct. Always combine this search with your own judgment, references, and personal verification.
                </p>
              </div>

              {/* PDF disclaimer */}
              <p className="font-body text-xs text-muted-foreground max-w-lg mx-auto mb-4 leading-relaxed">
                This report shows public records searched. It is NOT a certificate of safety or character reference. Do not use it to prove someone is "safe" or "cleared."
              </p>
              <button
                onClick={handleDownload}
                className="bg-foreground text-background px-7 py-3.5 font-body text-sm font-bold border-none cursor-pointer hover:opacity-90 transition-opacity"
              >
                Download Search Results (PDF)
              </button>
            </div>
          </div>
        )}

        {/* ─── IDENTITY MATCH SELECTOR ─── */}
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

        {/* ─── MULTIPLE MATCHES WARNING ─── */}
        {isMultiple && !showMatchSelector && (
          <div className="border-2 border-destructive bg-destructive/5 overflow-hidden mb-8">
            <div className="bg-destructive px-8 py-3">
              <span className="font-body text-sm font-bold text-white">⚠️ Multiple Possible Matches Found</span>
            </div>
            <div className="p-8">
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-5">
                We found {results.wantedPersonsCount} people with this name in public records. South Africa has many people with identical names. You MUST verify which person matches who you are searching for before making any decisions.
              </p>
              <div className="bg-destructive/10 border-l-4 border-destructive p-4 mb-6">
                <p className="font-body text-sm font-bold text-destructive">
                  Using information about the wrong person is illegal under POPIA. Verify identity carefully using date of birth, location, and case details.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
                <p className="font-body text-base font-bold text-blue-800 mb-3">How to Verify the Correct Person</p>
                {['Compare date of birth if known', 'Check police station location (does it match where they live?)', 'Look at case dates (were they in that area at that time?)', 'Compare photos if available (note: photos may be old)', 'Review case details and offense descriptions'].map(item => (
                  <p key={item} className="font-body text-sm text-blue-700 leading-relaxed py-0.5">✓ {item}</p>
                ))}
                <p className="font-mono text-[11px] text-destructive font-bold mt-4 tracking-wide">
                  IF YOU CANNOT VERIFY WITH CONFIDENCE, DO NOT USE THIS INFORMATION
                </p>
              </div>

              <button
                onClick={() => navigate("/dashboard/new-check")}
                className="border-2 border-foreground bg-transparent text-foreground px-6 py-3.5 font-body text-sm font-semibold cursor-pointer hover:bg-foreground hover:text-background transition-colors"
              >
                None of These Match
              </button>
            </div>
          </div>
        )}

        {/* ─── WANTED PERSON CARDS ─── */}
        {hasRecords && results.wantedPersons.map((person, idx) => {
          const confidence = getConfidence(person);
          const daysAgo = getDaysAgo(person.updated_at);
          const isViolent = /murder|assault|rape|sexual|violence|attack|stab|shoot/i.test(person.charges);
          const offenseCategories = person.offense_categories_derived || person.offense_categories || [];
          const officialUrl = getOfficialSourceUrl(person);
          const sourceLabel = getSourceLabel(person);
          const trustBadge = getSourceTrustBadge(person);

          return (
            <div key={person.id} className="mb-8">
              {isMultiple && idx > 0 && (
                <p className="font-body text-xs text-muted-foreground text-center my-6">── Not the same person ──</p>
              )}

              <div className="border border-foreground bg-card overflow-hidden">
                {/* Card Header */}
                <div className="p-8 border-b border-border relative">
                  {isMultiple && (
                    <span className="absolute top-4 right-4 bg-primary text-primary-foreground font-mono text-[10px] px-3 py-1 tracking-wide">
                      MATCH {idx + 1} OF {results.wantedPersonsCount}
                    </span>
                  )}
                  <span
                    className="inline-block px-4 py-1.5 mb-4 font-mono text-[11px] tracking-[0.1em] uppercase font-semibold text-white"
                    style={{
                      background: person.source_dataset === 'saflii' ? '#1E40AF' : isViolent ? 'hsl(var(--purple))' : person.legal_status === 'wanted' || !person.legal_status ? 'hsl(var(--gold))' : 'hsl(var(--muted-foreground))',
                    }}
                  >
                    {person.source_dataset === 'saflii' ? `⚖️ COURT JUDGMENT — ${person.charges}` : person.legal_status === 'wanted' || !person.legal_status ? `WANTED — ${person.charges}` : person.court_case_number ? 'COURT RECORD FOUND' : 'LEGAL NOTICE FOUND'}
                  </span>
                  <h2 className="font-heading text-3xl text-foreground leading-tight mb-2">
                    {person.full_name}
                  </h2>
                  {person.aliases && person.aliases.length > 0 && (
                    <p className="font-body text-xs text-muted-foreground mb-1">Also known as: {person.aliases.join(', ')}</p>
                  )}
                  {results.idNumber && (
                    <p className="font-body text-sm text-muted-foreground">ID: {redactId(results.idNumber)}</p>
                  )}
                </div>

                {/* Trust Badge & Tags */}
                <div className="px-8 py-3 border-b border-border flex flex-wrap gap-2 items-center bg-muted/50">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] tracking-wide font-bold border"
                    style={{ background: `${trustBadge.color}10`, color: trustBadge.color, borderColor: `${trustBadge.color}30` }}
                  >
                    {trustBadge.icon} {trustBadge.label} · TRUST: {trustBadge.level}
                  </span>
                  {offenseCategories.map((cat, i) => (
                    <span key={i} className={`inline-block px-3 py-1 font-mono text-[11px] font-semibold ${isViolent ? 'bg-purple-100 text-purple-700' : 'bg-yellow-50 text-yellow-800'}`}>
                      {cat}
                    </span>
                  ))}
                </div>

                {/* Photo & Details Grid */}
                <div className="results-photo-grid p-8 grid grid-cols-[200px_1fr] gap-8">
                  <div>
                    {person.photo_url ? (
                      <>
                        <div className="w-[200px] h-[200px] border border-border overflow-hidden">
                          <img src={person.photo_url} alt={person.full_name} className="w-full h-full object-cover grayscale-[40%]" />
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground block mt-2">Source: {sourceLabel}</span>
                        <span className="font-mono text-[10px] text-orange-600 block mt-1">Photos may be outdated. Do not rely on photo alone.</span>
                      </>
                    ) : (
                      <div className="w-[200px] h-[200px] bg-muted border border-border flex items-center justify-center flex-col">
                        <span className="text-6xl text-muted-foreground/30">👤</span>
                        <span className="font-mono text-[11px] text-muted-foreground mt-2">No photo</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
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
                      <div key={d.label}>
                        <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-muted-foreground block mb-1">{d.label}</span>
                        <span className={`font-body text-[15px] ${d.highlight ? 'text-destructive font-bold' : 'text-foreground font-medium'}`}>{d.value}</span>
                      </div>
                    ))}
                    {officialUrl && (
                      <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-xs text-blue-600 underline mt-2">
                        🔗 View on official source →
                      </a>
                    )}
                  </div>
                </div>

                {/* What This Means (per-card) */}
                <div className={`p-8 border-t border-b border-border ${person.source_dataset === 'saflii' ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                  <h3 className={`font-body text-base font-bold mb-3 flex items-center gap-2 ${person.source_dataset === 'saflii' ? 'text-blue-800' : 'text-yellow-800'}`}>
                    {person.source_dataset === 'saflii' ? '⚖️ What This Means' : '⚠️ What This Means'}
                  </h3>
                  <p className="font-body text-[15px] text-muted-foreground leading-relaxed">
                    {person.source_dataset === 'saflii'
                      ? `A criminal court judgment was found on SAFLII involving a person with this name. The judgment is from ${(person as any).saflii_court_code ? `the ${person.court_name}` : 'a South African High Court'}${(person as any).saflii_year ? ` (${(person as any).saflii_year})` : ''}. This is a public court record — not a RedFlaq determination.`
                      : person.source_dataset === 'za_fic_sanctions'
                        ? `This person appears on the FIC sanctions list. This indicates they are subject to financial restrictions or watchlist monitoring as of ${person.updated_at ? new Date(person.updated_at).toLocaleDateString('en-ZA') : 'recently'}.`
                        : `An active arrest warrant is listed on the SAPS wanted persons database as of ${person.updated_at ? new Date(person.updated_at).toLocaleDateString('en-ZA') : 'recently'}.`
                    }
                  </p>
                  {person.source_dataset === 'saflii' && (
                    <div className="bg-white border-l-[3px] border-blue-700 p-4 mt-4">
                      <p className="font-body text-sm font-bold text-blue-800 mb-2">Important Limitations:</p>
                      <ul className="font-body text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                        <li>Only High Court and above — most GBV cases start in Magistrate Courts (not on SAFLII)</li>
                        <li>Not every conviction produces a written judgment</li>
                        <li>Name-only matching means this may be a different person</li>
                        <li>Courts may anonymise parties in certain cases</li>
                      </ul>
                    </div>
                  )}
                  <div className="bg-white border-l-[3px] border-orange-500 p-4 mt-4">
                    <p className="font-body text-sm font-bold text-destructive mb-2">This Does NOT Confirm:</p>
                    <ul className="font-body text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-1">
                      <li>Whether this person is currently wanted or sanctioned</li>
                      <li>Whether they have been arrested or cleared</li>
                      <li>Current bail, custody, or legal status</li>
                      <li>Case progression, court dates, or outcomes</li>
                      <li>Any conviction — only allegations</li>
                    </ul>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mt-3 italic">
                    Public records are not updated in real-time. This listing may be outdated.
                  </p>
                </div>

                {/* Verification Grid */}
                <div className="p-8 bg-blue-50 border-b border-border">
                  <h3 className="font-body text-base font-bold text-blue-800 flex items-center gap-2 mb-4">✓ Verification Information</h3>
                  <div className="results-verification-grid grid grid-cols-2 gap-5">
                    {[
                      { label: 'SOURCE', value: sourceLabel },
                      { label: 'LAST VERIFIED', value: person.updated_at ? `${new Date(person.updated_at).toLocaleDateString('en-ZA')} (${daysAgo} days ago)` : 'Recently' },
                      { label: 'MATCH TYPE', value: person.match_type?.replace(/_/g, ' ').toUpperCase() || 'NAME MATCH' },
                      { label: 'CONFIDENCE', value: `${confidence}%` },
                      { label: 'RECORD ID', value: person.id.slice(0, 8) },
                    ].map(item => (
                      <div key={item.label}>
                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground block mb-1">{item.label}</span>
                        <span className="font-body text-sm text-foreground font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {daysAgo !== null && daysAgo > 7 && (
                    <div className="bg-destructive/10 border-l-[3px] border-destructive p-3 mt-4">
                      <span className="font-body text-xs text-destructive font-semibold">
                        ⚠️ This data is {daysAgo} days old and may be outdated. Verify current status with SAPS directly.
                      </span>
                    </div>
                  )}
                </div>

                {/* Identity Confidence */}
                <div className="p-8 border-b border-border">
                  <h3 className="font-body text-base font-bold text-foreground mb-4">Identity Verification Confidence</h3>
                  <Progress value={confidence} className="h-3 mb-3" />
                  <p className={`font-body text-sm font-semibold mb-3 ${confidence >= 71 ? 'text-green-700' : confidence >= 41 ? 'text-orange-600' : 'text-destructive'}`}>
                    {confidence >= 71 ? '✓ HIGH CONFIDENCE — Strong identity indicators present' :
                     confidence >= 41 ? '⚠️ MEDIUM CONFIDENCE — Verify with additional data' :
                     '⚠️ LOW CONFIDENCE — Additional verification required'}
                  </p>
                  {confidence < 70 && (
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      This match is based on name only. South Africa has many people with identical names. DO NOT assume this is the correct person without verifying date of birth, location, and other details.
                    </p>
                  )}
                </div>

                {/* Safety First */}
                <div className="p-8 bg-purple-50 border-b border-border border-l-4 border-l-primary">
                  <h3 className="font-body text-base font-bold text-primary flex items-center gap-2 mb-3">💜 Safety First</h3>
                  <ul className="font-body text-sm text-muted-foreground leading-relaxed space-y-2">
                    <li>❌ Do NOT confront this person yourself</li>
                    <li>❌ Do NOT meet them alone or in a private location</li>
                    <li>✅ Share this report with a trusted friend or family member</li>
                    <li>✅ If you feel unsafe, call SAPS on <strong>10111</strong> immediately</li>
                    <li>✅ For non-emergency tips, call Crime Stop on <strong>08600 10111</strong></li>
                    <li>✅ Verify current case status with your local police station</li>
                  </ul>
                </div>

                {/* Emergency Contacts */}
                <div className="p-8 bg-muted border-b border-border">
                  <h3 className="font-body text-base font-bold text-foreground mb-4">📞 For Current Case Status, Contact:</h3>
                  <div className="results-contact-grid grid grid-cols-3 gap-4">
                    {[
                      { emoji: '🚨', label: 'EMERGENCY', value: '10111', sub: 'SAPS Emergency', isRed: true },
                      { emoji: '📞', label: 'CRIME STOP', value: '08600 10111', sub: 'Anonymous Tips', isRed: false },
                      { emoji: '🏢', label: 'POLICE STATION', value: person.police_station || 'Contact local station', sub: 'Contact for case details', isRed: false },
                    ].map(c => (
                      <div key={c.label} className="bg-card p-5 border border-border">
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="font-mono text-[10px] uppercase text-muted-foreground block mt-2">{c.label}</span>
                        <span className={`font-body text-lg font-bold block ${c.isRed ? 'text-destructive' : 'text-foreground'}`}>{c.value}</span>
                        <span className="font-body text-xs text-muted-foreground">{c.sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="results-actions p-8 border-t border-foreground flex gap-4 flex-wrap">
                  <button onClick={handleDownload} className="bg-foreground text-background px-7 py-3.5 font-body text-sm font-bold border-none cursor-pointer hover:opacity-90 transition-opacity">
                    Download Full Report
                  </button>
                  <button onClick={() => { setDisputeRecord(person); setIsDisputeModalOpen(true); }} className="border-2 border-foreground bg-transparent text-foreground px-7 py-3.5 font-body text-sm font-bold cursor-pointer hover:bg-foreground hover:text-background transition-colors">
                    Challenge This Result
                  </button>
                  {officialUrl && (
                    <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="border-2 border-foreground bg-transparent text-foreground px-7 py-3.5 font-body text-sm font-bold cursor-pointer no-underline inline-block hover:bg-foreground hover:text-background transition-colors">
                      View Official Source
                    </a>
                  )}
                </div>

                {/* Legal Footer */}
                <div className="p-8 bg-destructive/5 border-t-2 border-destructive">
                  <h4 className="font-body text-sm font-bold text-destructive mb-3 flex items-center gap-2">⚖️ Important Legal Notice</h4>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    RedFlaq reports public records only, sourced from SAPS wanted persons lists, SAFLII court judgments, and FIC sanctions data via OpenSanctions. This is not a determination of guilt. Legal proceedings are ongoing until concluded by a court of law. Always verify current status with official sources before making any decisions.
                    <br /><br />
                    DO NOT use this information to harass, discriminate against, defame, or harm this person. Unlawful use of this information is prohibited and prosecutable under South African law, including under POPIA and the Harassment Act.
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
          <div className="bg-muted border border-foreground p-8 mt-2 mb-8">
            <h3 className="font-body text-lg font-bold text-foreground mb-4">How to Verify the Correct Person</h3>
            <div className="font-body text-[15px] text-muted-foreground leading-relaxed space-y-1">
              {['Compare date of birth if known', 'Check police station location (does it match where they live/lived?)', 'Look at case dates (were they in that area at that time?)', 'Compare photos if available (note: photos may be old)', 'Check case number format and court references'].map(item => (
                <p key={item}>✓ {item}</p>
              ))}
            </div>
            <p className="font-mono text-[11px] text-muted-foreground mt-4 tracking-wide">
              IF YOU CANNOT VERIFY WITH CONFIDENCE, DO NOT USE THIS INFORMATION. CONTACT SAPS DIRECTLY OR REQUEST HUMAN VERIFICATION FROM REDFLAQ.
            </p>
          </div>
        )}

        {/* Post-report guidance */}
        <PostReportGuidance riskLevel={results.riskLevel} />

        {/* ─── FOOTER ACTIONS ─── */}
        <div className="mt-10 pt-8 border-t border-border">
          <div className="flex gap-4 justify-center flex-wrap mb-6">
            <button
              onClick={() => navigate("/dashboard/new-check")}
              className="bg-primary text-primary-foreground px-7 py-3.5 font-body text-sm font-bold border-none cursor-pointer hover:bg-primary/90 transition-colors"
            >
              Run another safety check
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border-2 border-foreground bg-transparent text-foreground px-7 py-3.5 font-body text-sm font-bold cursor-pointer hover:bg-foreground hover:text-background transition-colors"
            >
              Back to Dashboard
            </button>
          </div>

          <p className="text-center font-body text-xs text-muted-foreground mb-3">
            If this helped you, you can{" "}
            <button
              onClick={() => setShareOpen(true)}
              className="bg-none border-none cursor-pointer font-body text-xs font-bold text-primary underline p-0"
            >
              share RedFlaq with another woman who needs it
            </button>.
          </p>
          <p className="text-center font-body text-xs text-muted-foreground leading-relaxed mb-3">
            Need to read this privately?{" "}
            <button
              onClick={() => toast.success("We've resent your results to your email. Check your inbox.")}
              className="bg-none border-none cursor-pointer font-body text-xs text-primary underline p-0"
            >
              We can email your results instead.
            </button>
          </p>
          <p className="text-center font-body text-[11px] text-muted-foreground leading-relaxed max-w-lg mx-auto mb-4">
            RedFlaq is a support tool, not a replacement for police, social workers or legal advice. If you are in immediate danger, contact emergency services or trusted support organisations.
          </p>
          <div className="text-center">
            <a href="/" className="font-body text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Back to redflaq.com homepage
            </a>
          </div>
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
      <Footer />
    </div>
  );
};

export default ResultsPageUpdated;
