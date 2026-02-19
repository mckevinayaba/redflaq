import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { FileText, Download, Filter, Shield } from "lucide-react";

interface SearchRecord {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_id: string;
  search_province: string | null;
  recommendation: string | null;
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
          </div>
        </div>

        {/* Reports */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-body text-muted-foreground">Loading reports…</p>
            </div>
          ) : searches.length === 0 ? (
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
            searches.map((s) => {
              const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
              return (
                <div key={s.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-lg text-foreground">{s.search_name || "Unknown"}</h3>
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
