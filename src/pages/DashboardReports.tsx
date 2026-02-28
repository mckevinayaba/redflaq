import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Download, Filter, Shield, EyeOff, Lock } from "lucide-react";

interface SearchRecord {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_id: string;
  search_province: string | null;
  recommendation: string | null;
  hidden_from_dashboard?: boolean;
}

const riskConfig: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High Risk", color: "hsl(var(--risk-danger))", bg: "hsl(var(--risk-danger) / 0.1)" },
  ORANGE: { label: "Moderate", color: "hsl(var(--risk-warning))", bg: "hsl(var(--risk-warning) / 0.1)" },
  YELLOW: { label: "Low Risk", color: "hsl(var(--risk-caution))", bg: "hsl(var(--risk-caution) / 0.1)" },
  GREEN: { label: "Clear", color: "hsl(var(--risk-safe))", bg: "hsl(var(--risk-safe) / 0.1)" },
};

export default function DashboardReports() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) fetchSearches();
  }, [user, authLoading]);

  const fetchSearches = async () => {
    let query = supabase.from("searches").select("*").eq("user_id", user!.id).order("searched_at", { ascending: false });
    if (filterLevel) query = query.eq("risk_level", filterLevel);
    const { data } = await query;
    setSearches(data || []);
    setLoading(false);
  };

  useEffect(() => { if (user) { setLoading(true); fetchSearches(); } }, [filterLevel]);

  const hiddenCount = searches.filter((s: any) => s.hidden_from_dashboard).length;
  const visibleSearches = showHidden
    ? searches
    : searches.filter((s: any) => !s.hidden_from_dashboard);

  const handleShowHidden = () => {
    if (showHidden) {
      setShowHidden(false);
      return;
    }
    setPasswordPrompt(true);
  };

  const handlePasswordSubmit = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });
    if (error) {
      setPasswordError("Incorrect password. Please try again.");
      return;
    }
    setPasswordPrompt(false);
    setPassword("");
    setPasswordError("");
    setShowHidden(true);
  };

  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Reports</p>
      <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">My Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Filters</span>
            </div>
            <div className="space-y-3">
              <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1">Result level</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-lg font-body text-sm bg-background focus:outline-none focus:border-primary"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">All results</option>
                <option value="RED">High Risk</option>
                <option value="ORANGE">Moderate</option>
                <option value="YELLOW">Low Risk</option>
                <option value="GREEN">Clear</option>
              </select>
            </div>

            {/* Hidden checks toggle */}
            {hiddenCount > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={handleShowHidden}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-body text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <EyeOff className="h-4 w-4" />
                  {showHidden ? "Hide hidden checks" : `${hiddenCount} hidden check${hiddenCount !== 1 ? "s" : ""}`}
                </button>
              </div>
            )}
          </div>

          {/* Password prompt modal */}
          {passwordPrompt && (
            <div className="mt-4 bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="h-4 w-4 text-primary" />
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Verify identity</span>
              </div>
              <p className="font-body text-xs text-muted-foreground mb-3">
                Enter your password to view hidden checks.
              </p>
              <input
                type="password"
                className="w-full px-3 py-2 border border-border rounded-lg font-body text-sm bg-background focus:outline-none focus:border-primary mb-2"
                placeholder="Your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              />
              {passwordError && (
                <p className="font-body text-xs text-destructive mb-2">{passwordError}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handlePasswordSubmit}
                  className="flex-1 px-3 py-2 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90"
                >
                  Verify
                </button>
                <button
                  onClick={() => { setPasswordPrompt(false); setPassword(""); setPasswordError(""); }}
                  className="px-3 py-2 border border-border font-body text-sm rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reports */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-body text-muted-foreground">Loading reports…</p>
            </div>
          ) : visibleSearches.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center shadow-sm">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-heading text-lg text-foreground mb-2">No reports found</p>
              <p className="font-body text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Try changing your filters or running a new safety check if you haven't used RedFlaq in a while.
              </p>
              <Link
                to="/dashboard/new-check"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90"
              >
                <Shield className="h-4 w-4" /> Run a new safety check
              </Link>
            </div>
          ) : (
            visibleSearches.map((s) => {
              const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
              const isHidden = (s as any).hidden_from_dashboard;
              return (
                <div key={s.id} className={`bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow ${isHidden ? 'opacity-70 border-dashed' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-lg text-foreground">{s.search_name || "Unknown"}</h3>
                        {isHidden && <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                      </div>
                      <p className="font-body text-sm text-muted-foreground">
                        {new Date(s.searched_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                        {s.search_province && ` · ${s.search_province}`}
                      </p>
                    </div>
                    <span
                      className="inline-block px-3 py-1 rounded-full font-mono text-[10px] font-semibold"
                      style={{ color: risk.color, background: risk.bg }}
                    >
                      {risk.label}
                    </span>
                  </div>
                  {s.recommendation && (
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">{s.recommendation}</p>
                  )}
                  <div className="flex gap-3">
                    <Link
                      to={`/results?search_id=${s.search_id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-body font-medium text-sm rounded-lg hover:bg-primary/90"
                    >
                      View full report
                    </Link>
                    <button className="inline-flex items-center gap-2 px-4 py-2 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted">
                      <Download className="h-3.5 w-3.5" /> Download PDF
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
