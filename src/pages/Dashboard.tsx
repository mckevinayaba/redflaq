import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ShareInviteModal from "@/components/ShareInviteModal";
import BuyChecksModal from "@/components/BuyChecksModal";
import MyPayments from "@/components/dashboard/MyPayments";
import MobileHome from "@/components/mobile/screens/MobileHome";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

interface SearchRecord {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_id: string;
}

const riskConfig: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High Risk", color: "#C0392B", bg: "rgba(192,57,43,0.12)" },
  ORANGE: { label: "Moderate", color: "#E67E22", bg: "rgba(230,126,34,0.12)" },
  YELLOW: { label: "Low Risk", color: "#F1C40F", bg: "rgba(241,196,15,0.12)" },
  GREEN: { label: "Clear", color: "#27AE60", bg: "rgba(39,174,96,0.12)" },
};

const card: React.CSSProperties = {
  background: '#111118',
  border: '1px solid rgba(108,53,222,0.25)',
  borderRadius: 8,
  padding: '24px',
};

const DAILY_PROMPTS = [
  "You already know the answer. You just don't like it.",
  "Awareness didn't save 9 women yesterday. Action might save 1 today.",
  "Stop calling it fate. It's a pattern. And patterns can be checked.",
  "The most dangerous thing you'll do today is trust someone you haven't verified.",
  "In South Africa, knowing is not the problem. Doing nothing with what you know — that is.",
  "Your instincts are not paranoia. They are data.",
  "Before You Trust, RedFlaq First.",
  "A protection order means nothing if you don't know one exists.",
  "He told you who he was. You explained it away. Stop explaining.",
  "Document today. Decide tomorrow. But start.",
];

export default function Dashboard() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileHome />;

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { credits: creditsRemaining } = useCredits(user?.email, user?.id);
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [freeChecksEarned, setFreeChecksEarned] = useState(0);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [recentJournal, setRecentJournal] = useState<{ id: string; entry_date: string; incident_description: string }[]>([]);
  const [patternAlert, setPatternAlert] = useState<{ text: string; count: number } | null>(null);

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyPrompt = DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) { fetchData(); detectPatterns(); }
  }, [user, authLoading]);

  const fetchData = async () => {
    const [{ data: profileData }, { data: searchData }, { data: referralData }, { data: journalData }] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("user_id", user!.id).maybeSingle(),
      supabase.from("searches").select("*").eq("user_id", user!.id).order("searched_at", { ascending: false }).limit(20),
      supabase.from("referrals").select("id, status").eq("referrer_user_id", user!.id),
      supabase.from("journal_entries").select("id, entry_date, incident_description").eq("user_id", user!.id).order("entry_date", { ascending: false }).limit(3),
    ]);
    setProfile(profileData);
    setSearches(searchData || []);
    setRecentJournal(journalData || []);
    const refs = referralData || [];
    const converted = refs.filter(r => r.status === "signed_up" || r.status === "paid");
    setReferralCount(converted.length);
    setFreeChecksEarned(Math.floor(converted.length / 3));
    setLoading(false);
  };

  const detectPatterns = async () => {
    if (!user) return;
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    const { data: checkins } = await supabase
      .from("habit_checkins")
      .select("responses")
      .eq("user_id", user.id)
      .gte("checkin_date", weekAgo);
    if (!checkins || checkins.length < 3) return;

    const promptCounts: Record<string, { text: string; count: number }> = {};
    const PROMPT_LABELS: Record<string, string> = {
      isolation: "Someone limiting who you see or talk to",
      guilt: "Being made to feel guilty for normal actions",
      tracking: "Location monitoring or phone surveillance",
      belittling: "Being mocked, criticised, or made to feel small",
      safe: "Not feeling physically safe",
    };

    for (const checkin of checkins) {
      const responses = checkin.responses as any[];
      if (!Array.isArray(responses)) continue;
      for (const r of responses) {
        const flagged = r.id === "safe" ? r.answer === false : r.answer === true;
        if (flagged) {
          if (!promptCounts[r.id]) promptCounts[r.id] = { text: PROMPT_LABELS[r.id] || r.text, count: 0 };
          promptCounts[r.id].count++;
        }
      }
    }

    const worst = Object.values(promptCounts).sort((a, b) => b.count - a.count)[0];
    if (worst && worst.count >= 3) {
      setPatternAlert(worst);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: 28, height: 28, border: '3px solid rgba(108,53,222,0.2)', borderTopColor: '#6C35DE', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </DashboardLayout>
    );
  }

  const thisMonth = searches.filter(s => {
    const d = new Date(s.searched_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const latestSearch = searches[0];
  const latestRisk = latestSearch ? riskConfig[latestSearch.risk_level] || riskConfig.GREEN : null;

  const firstName = profile?.full_name?.split(" ")[0]
    || user?.user_metadata?.full_name?.split(" ")[0]
    || user?.email?.split("@")[0]
    || "";

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
          Safety Base Dashboard
        </p>
        <h1 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 8 }}>
          Welcome back{firstName ? `, ${firstName}` : ''}.
        </h1>
        {/* Daily confrontation prompt */}
        <p style={{ ...inter, fontSize: 15, color: '#d1d1d6', lineHeight: 1.6, marginBottom: 16, fontStyle: 'italic' }}>
          {dailyPrompt}
        </p>
        {/* Brand line */}
        <div style={{ borderLeft: '3px solid #6C35DE', paddingLeft: 12 }}>
          <p style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#6C35DE' }}>
            Before You Trust, RedFlaq First.
          </p>
        </div>
      </div>

      {/* Pattern Alert */}
      {patternAlert && (
        <div style={{
          ...card,
          borderLeft: '4px solid #C0392B',
          borderColor: 'rgba(192,57,43,0.4)',
          marginBottom: 20,
          background: 'rgba(192,57,43,0.06)',
        }}>
          <p style={{ ...mono, fontSize: 10, color: '#C0392B', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
            ⚠ Pattern Detected
          </p>
          <p style={{ ...inter, fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            {patternAlert.text} — flagged {patternAlert.count} of the last 7 days.
          </p>
          <p style={{ ...inter, fontSize: 14, color: '#d1d1d6', lineHeight: 1.7, marginBottom: 12 }}>
            This is not a bad week. This is a pattern. Document it now.
          </p>
          <Link to="/dashboard/journal/new" style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#C0392B', textDecoration: 'none' }}>
            Document this pattern →
          </Link>
        </div>
      )}

      {/* "Not Ready to Leave Yet?" box */}
      <div style={{
        ...card,
        borderLeft: '4px solid #6C35DE',
        marginBottom: 28,
      }}>
        <h3 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
          Not Ready to Leave Yet?
        </h3>
        <p style={{ ...inter, fontSize: 14, color: '#d1d1d6', lineHeight: 1.7 }}>
          That's not a question we judge. You're not staying because you love him.
          You're staying because leaving feels more dangerous than the danger you already know.
          Start documenting. Not for the court. For the version of you who will be ready.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginBottom: 28 }}>
        <Link to="/dashboard/new-check" style={{
          ...card, display: 'flex', alignItems: 'center', gap: 14,
          textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>
          <div>
            <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Run Safety Check</p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>Check someone in under 60 seconds</p>
          </div>
        </Link>
        <Link to="/dashboard/journal/new" style={{
          ...card, display: 'flex', alignItems: 'center', gap: 14,
          textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
          </div>
          <div>
            <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Document an Incident</p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>Record what happened privately</p>
          </div>
        </Link>
        <Link to="/safety-tips#get-help" style={{
          ...card, display: 'flex', alignItems: 'center', gap: 14,
          textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
          borderColor: 'rgba(192,57,43,0.25)',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C0392B'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(192,57,43,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <div>
            <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Get Help Now</p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>Helplines and emergency resources</p>
          </div>
        </Link>
        <Link to="/dashboard/habit" style={{
          ...card, display: 'flex', alignItems: 'center', gap: 14,
          textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          </div>
          <div>
            <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Safety Habits</p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>Build your daily safety ritual</p>
          </div>
        </Link>
        <Link to="/dashboard/saved-signals" style={{
          ...card, display: 'flex', alignItems: 'center', gap: 14,
          textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
          </div>
          <div>
            <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>Saved Signals</p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>Articles you bookmarked</p>
          </div>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" style={{ marginBottom: 28 }}>
        {/* Credits */}
        <div style={{ ...card, borderLeft: '3px solid #6C35DE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(108,53,222,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Your safety checks</span>
          </div>
          <p style={{ ...inter, fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
            {creditsRemaining ?? 0}
          </p>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>checks remaining</p>
          {(creditsRemaining ?? 0) === 0 && (
            <button
              onClick={() => setBuyModalOpen(true)}
              style={{ ...inter, fontSize: 12, fontWeight: 700, color: '#ffffff', background: '#6C35DE', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', marginTop: 10 }}
            >
              Buy More Checks
            </button>
          )}
        </div>

        {/* Checks this month */}
        <div style={{ ...card, borderLeft: '3px solid #6C35DE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(108,53,222,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
            </div>
            <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Checks this month</span>
          </div>
          <p style={{ ...inter, fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 12 }}>
            {thisMonth.length}
          </p>
          <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#6C35DE', borderRadius: 4, width: `${Math.min(thisMonth.length * 20, 100)}%`, transition: 'width 0.6s' }} />
          </div>
        </div>

        {/* Latest result */}
        <div style={{ ...card, borderLeft: '3px solid #6C35DE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(108,53,222,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Latest result</span>
          </div>
          {latestSearch ? (
            <>
              <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 4, ...mono, fontSize: 11, fontWeight: 700, color: latestRisk?.color, background: latestRisk?.bg, marginBottom: 8 }}>
                {latestRisk?.label}
              </span>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>
                {latestSearch.search_name || "Unknown"} · {new Date(latestSearch.searched_at).toLocaleDateString("en-ZA")}
              </p>
            </>
          ) : (
            <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>No checks yet</p>
          )}
        </div>
      </div>

      {/* My Payments section */}
      {user?.email && <MyPayments email={user.email} />}

      {/* Recent Journal Entries */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Recent Journal Entries</h2>
          {recentJournal.length > 0 && (
            <Link to="/dashboard/journal" style={{ ...inter, fontSize: 13, color: '#6C35DE', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all →
            </Link>
          )}
        </div>
        {recentJournal.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 16 }}>No journal entries yet. Document your first incident.</p>
            <Link to="/dashboard/journal/new" style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff', background: '#6C35DE', padding: '10px 20px', borderRadius: 4, textDecoration: 'none' }}>
              Create First Entry
            </Link>
          </div>
        ) : (
          <div>
            {recentJournal.map((j, i) => (
              <Link
                key={j.id}
                to={`/dashboard/journal/${j.id}`}
                style={{
                  display: 'block', padding: '14px 0',
                  borderBottom: i < recentJournal.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  textDecoration: 'none', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,53,222,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <p style={{ ...mono, fontSize: 10, color: '#6C35DE', marginBottom: 4 }}>
                  {new Date(j.entry_date).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
                </p>
                <p style={{ ...inter, fontSize: 14, color: '#d1d1d6', lineHeight: 1.5 }}>
                  {j.incident_description.slice(0, 100)}{j.incident_description.length > 100 ? "..." : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Checks */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Recent Checks</h2>
          {searches.length > 0 && (
            <Link to="/dashboard/reports" style={{ ...inter, fontSize: 13, color: '#6C35DE', textDecoration: 'none' }}>
              View all →
            </Link>
          )}
        </div>
        {searches.length === 0 ? (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <p style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>No safety checks yet</p>
            <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 20, maxWidth: 420, margin: '0 auto 20px' }}>
              When you run your first safety check, you'll see all your results here.
            </p>
            <Link to="/dashboard/new-check" style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#6C35DE', padding: '12px 24px', borderRadius: 4, textDecoration: 'none' }}>
              Run your first safety check
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile view */}
            <div className="sm:hidden">
              {searches.slice(0, 10).map((s) => {
                const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
                return (
                  <div key={s.id} style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <p style={{ ...inter, fontSize: 14, fontWeight: 600, color: '#ffffff' }}>{s.search_name || "—"}</p>
                        <p style={{ ...mono, fontSize: 11, color: '#8b8b91' }}>{new Date(s.searched_at).toLocaleDateString("en-ZA")}</p>
                      </div>
                      <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: risk.color, background: risk.bg, padding: '3px 10px', borderRadius: 4 }}>{risk.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ ...mono, fontSize: 11, color: '#8b8b91' }}>{s.matches_found} match{s.matches_found !== 1 ? "es" : ""}</span>
                      <Link to={`/results?search_id=${s.search_id}`} style={{ ...inter, fontSize: 13, color: '#6C35DE', textDecoration: 'none' }}>View →</Link>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Person', 'Date', 'Result', 'Matches', ''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0 16px 12px', ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {searches.slice(0, 10).map((s) => {
                    const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
                    return (
                      <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(108,53,222,0.04)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', ...inter, fontSize: 14, color: '#ffffff', fontWeight: 600 }}>{s.search_name || "—"}</td>
                        <td style={{ padding: '14px 16px', ...mono, fontSize: 12, color: '#8b8b91' }}>{new Date(s.searched_at).toLocaleDateString("en-ZA")}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: risk.color, background: risk.bg, padding: '3px 10px', borderRadius: 4 }}>{risk.label}</span>
                        </td>
                        <td style={{ padding: '14px 16px', ...mono, fontSize: 13, color: '#8b8b91' }}>{s.matches_found}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' as const }}>
                          <Link to={`/results?search_id=${s.search_id}`} style={{ ...inter, fontSize: 13, color: '#6C35DE', textDecoration: 'none' }}>View →</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Referral */}
      <div style={{ ...card, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(108,53,222,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div>
            <p style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Referral Programme</p>
            <p style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginTop: 2 }}>
              You invited {referralCount} friend{referralCount !== 1 ? "s" : ""} · Earned {freeChecksEarned} free check{freeChecksEarned !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', marginBottom: 12 }}>
          For every 3 friends who sign up from your link, you earn 1 free safety check.
        </p>
        <div style={{ height: 4, width: '100%', background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', background: '#6C35DE', borderRadius: 4, width: `${((referralCount % 3) / 3) * 100}%`, transition: 'width 0.6s' }} />
        </div>
        <p style={{ ...mono, fontSize: 10, color: '#8b8b91' }}>
          {3 - (referralCount % 3)} more referral{3 - (referralCount % 3) !== 1 ? "s" : ""} until your next free check
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        {(creditsRemaining ?? 0) > 0 ? (
          <Link to="/dashboard/new-check" style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#6C35DE', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Run a new safety check
          </Link>
        ) : (
          <button onClick={() => setBuyModalOpen(true)} style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#6C35DE', padding: '12px 24px', borderRadius: 4, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            Buy More Checks
          </button>
        )}
        <button onClick={() => setShareOpen(true)} style={{ ...inter, fontSize: 14, fontWeight: 600, color: '#d1d1d6', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', padding: '12px 24px', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          Invite a friend to RedFlaq
        </button>
      </div>

      <div style={{ textAlign: 'center' }}>
        <a href="mailto:support@redflaq.com" style={{ ...inter, fontSize: 12, color: '#8b8b91', textDecoration: 'none' }}>
          Payment issue? Contact support@redflaq.com
        </a>
      </div>

      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
      <BuyChecksModal open={buyModalOpen} onOpenChange={setBuyModalOpen} />
    </DashboardLayout>
  );
}
