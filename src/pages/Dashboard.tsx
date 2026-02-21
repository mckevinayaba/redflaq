import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, BarChart3, CheckCircle2, ArrowRight, Heart } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";

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
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signup");
      return;
    }
    if (user) {
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    const [{ data: profileData }, { data: searchData }] = await Promise.all([
      supabase.from("profiles").select("full_name").eq("user_id", user!.id).maybeSingle(),
      supabase.from("searches").select("*").eq("user_id", user!.id).order("searched_at", { ascending: false }).limit(20),
    ]);
    setProfile(profileData);
    setSearches(searchData || []);
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

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Dashboard</p>
        <h1 className="font-heading text-2xl sm:text-3xl text-foreground">Welcome back, {firstName}</h1>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {/* Total checks */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Your safety checks</span>
          </div>
          <p className="font-heading text-4xl text-foreground">{searches.length}</p>
          <p className="font-body text-sm text-muted-foreground mt-1">since you joined RedFlaq</p>
        </div>

        {/* This month */}
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

        {/* Latest result */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Latest result</span>
          </div>
          {latestSearch ? (
            <>
              <span
                className="inline-block px-3 py-1 rounded-full font-mono text-xs font-semibold mb-2"
                style={{ color: latestRisk?.color, background: latestRisk?.bg }}
              >
                {latestRisk?.label}
              </span>
              <p className="font-body text-sm text-muted-foreground">
                Last: {latestSearch.search_name || "Unknown"} ({new Date(latestSearch.searched_at).toLocaleDateString("en-ZA")})
              </p>
            </>
          ) : (
            <p className="font-body text-sm text-muted-foreground">No checks yet</p>
          )}
        </div>
      </div>

      {/* Recent checks table */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 sm:mb-8">
        <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-heading text-base sm:text-lg text-foreground">Recent checks</h2>
          {searches.length > 0 && (
            <Link to="/dashboard/reports" className="font-body text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        {searches.length === 0 ? (
          <div className="px-6 py-12 text-center">
          <Shield className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-heading text-lg text-foreground mb-2">No safety checks yet</p>
            <p className="font-body text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              When you run your first safety check, you'll see all your results here — with dates, risk levels and downloadable reports.
            </p>
            <Link
              to="/dashboard/new-check"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:opacity-90 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Run your first safety check
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="sm:hidden divide-y divide-border">
              {searches.slice(0, 10).map((s) => {
                const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
                return (
                  <div key={s.id} className="px-4 py-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-body text-sm text-foreground font-medium">{s.search_name || "—"}</p>
                        <p className="font-body text-xs text-muted-foreground">{new Date(s.searched_at).toLocaleDateString("en-ZA")}</p>
                      </div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold" style={{ color: risk.color, background: risk.bg }}>
                        {risk.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">{s.matches_found} match{s.matches_found !== 1 ? "es" : ""}</span>
                      <Link to={`/results?search_id=${s.search_id}`} className="font-body text-sm text-primary hover:underline">View report</Link>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Desktop table view */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Person</th>
                    <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Date</th>
                    <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Result</th>
                    <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Matches</th>
                    <th className="text-right px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {searches.slice(0, 10).map((s) => {
                    const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
                    return (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
                        <td className="px-6 py-4 font-body text-sm text-foreground font-medium">{s.search_name || "—"}</td>
                        <td className="px-6 py-4 font-body text-sm text-muted-foreground">{new Date(s.searched_at).toLocaleDateString("en-ZA")}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 rounded-full font-mono text-[10px] font-semibold" style={{ color: risk.color, background: risk.bg }}>
                            {risk.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{s.matches_found}</td>
                        <td className="px-6 py-4 text-right">
                          <Link to={`/results?search_id=${s.search_id}`} className="font-body text-sm text-primary hover:underline">View report</Link>
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

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4">
        <Link
          to="/dashboard/new-check"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-colors shadow-sm"
        >
          <Shield className="h-4 w-4" />
          Run a new safety check
        </Link>
        <button
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors"
        >
          <Heart className="h-4 w-4" />
          Invite a friend to RedFlaq
        </button>
      </div>

      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </DashboardLayout>
  );
}
