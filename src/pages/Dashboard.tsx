import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, BarChart3, CheckCircle2, ArrowRight, Heart, Users, BookOpen, Flag } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";
import BuyChecksModal from "@/components/BuyChecksModal";
import MyPayments from "@/components/dashboard/MyPayments";

interface SearchRecord {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_id: string;
}

const riskConfig: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High Risk", color: "hsl(var(--risk-danger))", bg: "hsl(var(--risk-danger) / 0.1)" },
  ORANGE: { label: "Moderate", color: "hsl(var(--risk-warning))", bg: "hsl(var(--risk-warning) / 0.1)" },
  YELLOW: { label: "Low Risk", color: "hsl(var(--risk-caution))", bg: "hsl(var(--risk-caution) / 0.1)" },
  GREEN: { label: "Clear", color: "hsl(var(--risk-safe))", bg: "hsl(var(--risk-safe) / 0.1)" },
};

export default function Dashboard() {
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

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) { fetchData(); }
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

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
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
      <div className="mb-6 sm:mb-8">
        <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Dashboard</p>
        <h1 className="font-heading text-2xl sm:text-3xl text-foreground">Welcome to your Safety Dashboard</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">From here you can document incidents, run safety checks and find help if you or someone you love is at risk.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <Link to="/dashboard/new-check" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-heading text-sm text-foreground">Run Safety Check</p>
            <p className="font-body text-xs text-muted-foreground">Check someone in under 60 seconds</p>
          </div>
        </Link>
        <Link to="/dashboard/journal/new" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-heading text-sm text-foreground">Document an Incident</p>
            <p className="font-body text-xs text-muted-foreground">Record what happened privately</p>
          </div>
        </Link>
        <Link to="/safety-tips#get-help" className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--risk-danger) / 0.1)' }}>
            <Flag className="h-5 w-5" style={{ color: 'hsl(var(--risk-danger))' }} />
          </div>
          <div>
            <p className="font-heading text-sm text-foreground">Get Help Now</p>
            <p className="font-body text-xs text-muted-foreground">Helplines and emergency resources</p>
          </div>
        </Link>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Your safety checks</span>
          </div>
          <p className="font-heading text-4xl text-foreground">{creditsRemaining ?? 0}</p>
          <p className="font-body text-sm text-muted-foreground mt-1">checks remaining</p>
          {(creditsRemaining ?? 0) === 0 && (
            <button onClick={() => setBuyModalOpen(true)} className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-primary text-primary-foreground font-body text-xs font-semibold rounded-lg hover:opacity-90 transition-colors">
              Buy More Checks
            </button>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Checks this month</span>
          </div>
          <p className="font-heading text-4xl text-foreground">{thisMonth.length}</p>
          <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(thisMonth.length * 20, 100)}%` }} />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Latest result</span>
          </div>
          {latestSearch ? (
            <>
              <span className="inline-block px-3 py-1 rounded-full font-mono text-xs font-semibold mb-2" style={{ color: latestRisk?.color, background: latestRisk?.bg }}>{latestRisk?.label}</span>
              <p className="font-body text-sm text-muted-foreground">Last: {latestSearch.search_name || "Unknown"} ({new Date(latestSearch.searched_at).toLocaleDateString("en-ZA")})</p>
            </>
          ) : (
            <p className="font-body text-sm text-muted-foreground">No checks yet</p>
          )}
        </div>
      </div>

      {/* My Payments section */}
      {user?.email && <MyPayments email={user.email} />}

      {/* Recent checks table */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 sm:mb-8">
        <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-base sm:text-lg text-foreground">Recent checks</h2>
          {searches.length > 0 && (
            <Link to="/dashboard/reports" className="font-body text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          )}
        </div>
        {searches.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading text-lg text-foreground mb-2">No safety checks yet</p>
            <p className="font-body text-sm text-muted-foreground mb-4 max-w-md mx-auto">When you run your first safety check, you'll see all your results here.</p>
            <Link to="/dashboard/new-check" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:opacity-90 transition-colors">
              <Shield className="h-4 w-4" /> Run your first safety check
            </Link>
          </div>
        ) : (
          <>
            <div className="sm:hidden divide-y divide-border">
              {searches.slice(0, 10).map((s) => {
                const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
                return (
                  <div key={s.id} className="px-4 py-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div><p className="font-body text-sm text-foreground font-medium">{s.search_name || "—"}</p><p className="font-body text-xs text-muted-foreground">{new Date(s.searched_at).toLocaleDateString("en-ZA")}</p></div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold" style={{ color: risk.color, background: risk.bg }}>{risk.label}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">{s.matches_found} match{s.matches_found !== 1 ? "es" : ""}</span>
                      <Link to={`/results?search_id=${s.search_id}`} className="font-body text-sm text-primary hover:underline">View report</Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-border">
                  <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Person</th>
                  <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Date</th>
                  <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Result</th>
                  <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Matches</th>
                  <th className="text-right px-6 py-3"></th>
                </tr></thead>
                <tbody>
                  {searches.slice(0, 10).map((s) => {
                    const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
                    return (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
                        <td className="px-6 py-4 font-body text-sm text-foreground font-medium">{s.search_name || "—"}</td>
                        <td className="px-6 py-4 font-body text-sm text-muted-foreground">{new Date(s.searched_at).toLocaleDateString("en-ZA")}</td>
                        <td className="px-6 py-4"><span className="inline-block px-3 py-1 rounded-full font-mono text-[10px] font-semibold" style={{ color: risk.color, background: risk.bg }}>{risk.label}</span></td>
                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{s.matches_found}</td>
                        <td className="px-6 py-4 text-right"><Link to={`/results?search_id=${s.search_id}`} className="font-body text-sm text-primary hover:underline">View report</Link></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Referral stats */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Referral Programme</span>
            <p className="font-heading text-lg text-foreground mt-1">You invited {referralCount} friend{referralCount !== 1 ? "s" : ""} · Earned {freeChecksEarned} free check{freeChecksEarned !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-3">For every 3 friends who sign up from your link, you earn 1 free safety check.</p>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((referralCount % 3) / 3) * 100}%` }} />
        </div>
        <p className="font-mono text-[10px] text-muted-foreground">{3 - (referralCount % 3)} more referral{3 - (referralCount % 3) !== 1 ? "s" : ""} until your next free check</p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        {(creditsRemaining ?? 0) > 0 ? (
          <Link to="/dashboard/new-check" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors shadow-sm">
            <Shield className="h-4 w-4" /> Run a new safety check
          </Link>
        ) : (
          <button onClick={() => setBuyModalOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors shadow-sm">
            <Shield className="h-4 w-4" /> Buy More Checks
          </button>
        )}
        <button onClick={() => setShareOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors">
          <Heart className="h-4 w-4" /> Invite a friend to RedFlaq
        </button>
      </div>

      <div className="mt-4 text-center">
        <a href="mailto:support@redflaq.com" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">Payment issue? Contact support@redflaq.com</a>
      </div>

      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
      <BuyChecksModal open={buyModalOpen} onOpenChange={setBuyModalOpen} />
    </DashboardLayout>
  );
}
