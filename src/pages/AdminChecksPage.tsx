import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";

interface CheckRow {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_province: string | null;
  search_id: string;
  user_id: string | null;
  search_dob: string | null;
  search_id_number: string | null;
  search_case_number: string | null;
  search_strategies: string[] | null;
  recommendation: string | null;
  results: any;
  payment_id: string | null;
}

const riskPill: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High", color: "#DC2626", bg: "#FEF2F2" },
  ORANGE: { label: "Moderate", color: "#EA580C", bg: "#FFF7ED" },
  YELLOW: { label: "Low", color: "#CA8A04", bg: "#FEFCE8" },
  GREEN: { label: "Clear", color: "#16A34A", bg: "#F0FDF4" },
};

export default function AdminChecksPage() {
  const [checks, setChecks] = useState<CheckRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCheck, setSelectedCheck] = useState<CheckRow | null>(null);

  // Filters
  const [filterRisk, setFilterRisk] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  useEffect(() => { fetchChecks(); }, []);

  const fetchChecks = async () => {
    let q = supabase
      .from("searches")
      .select("*")
      .order("searched_at", { ascending: false })
      .limit(200);

    const { data } = await q;
    setChecks((data as CheckRow[]) || []);
    setLoading(false);
  };

  const filtered = checks.filter(c => {
    if (filterRisk && c.risk_level !== filterRisk) return false;
    if (filterSearch) {
      const q = filterSearch.toLowerCase();
      if (!(c.search_name || "").toLowerCase().includes(q) && !(c.search_province || "").toLowerCase().includes(q)) return false;
    }
    if (filterDateFrom && c.searched_at < filterDateFrom) return false;
    if (filterDateTo && c.searched_at > filterDateTo + "T23:59:59") return false;
    return true;
  });

  const exportCSV = () => {
    const header = "Date,Person,Province,Result,Matches\n";
    const rows = filtered.map(c =>
      `${new Date(c.searched_at).toLocaleDateString("en-ZA")},${(c.search_name || "").replace(/,/g, "")},${c.search_province || ""},${c.risk_level},${c.matches_found}`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "safety-checks.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // Detail view
  if (selectedCheck) {
    const pill = riskPill[selectedCheck.risk_level] || riskPill.GREEN;
    const results = Array.isArray(selectedCheck.results) ? selectedCheck.results : [];
    return (
      <AdminLayout>
        <div className="space-y-6">
          <button onClick={() => setSelectedCheck(null)} className="flex items-center gap-2 font-body text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Checks
          </button>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl text-foreground">Check Detail</h2>
              <span className="inline-block px-3 py-1 rounded-full font-mono text-xs font-semibold" style={{ color: pill.color, background: pill.bg }}>
                {pill.label} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Person", value: selectedCheck.search_name || "—" },
                { label: "Province", value: selectedCheck.search_province || "—" },
                { label: "Date", value: new Date(selectedCheck.searched_at).toLocaleString("en-ZA") },
                { label: "DOB", value: selectedCheck.search_dob || "—" },
                { label: "ID Number", value: selectedCheck.search_id_number || "—" },
                { label: "Case Number", value: selectedCheck.search_case_number || "—" },
                { label: "Matches Found", value: String(selectedCheck.matches_found) },
                { label: "Payment ID", value: selectedCheck.payment_id || "—" },
                { label: "Strategies", value: (selectedCheck.search_strategies || []).join(", ") || "—" },
              ].map(item => (
                <div key={item.label}>
                  <p className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{item.label}</p>
                  <p className="font-body text-sm text-foreground mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {selectedCheck.recommendation && (
              <div className="pt-4 border-t border-border">
                <p className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase mb-1">Recommendation</p>
                <p className="font-body text-sm text-foreground">{selectedCheck.recommendation}</p>
              </div>
            )}
          </div>

          {/* Matched records */}
          {results.length > 0 && (
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border">
                <h3 className="font-heading text-lg text-foreground">Matched Records ({results.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {results.map((r: any, i: number) => (
                  <div key={i} className="px-6 py-4">
                    <p className="font-body text-sm font-medium text-foreground">{r.full_name || r.name || "Unknown"}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{r.charges || r.offense || "—"}</p>
                    {r.province && <p className="font-mono text-[10px] text-muted-foreground mt-1">{r.province}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  // List view
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-foreground">Safety Checks</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{filtered.length} checks shown</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 text-sm font-body border border-border rounded-lg hover:bg-muted transition-colors">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              placeholder="Search name or province..."
              className="pl-10 pr-4 py-2 rounded-lg border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-56"
            />
          </div>
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Results</option>
            <option value="RED">High Risk</option>
            <option value="ORANGE">Moderate</option>
            <option value="YELLOW">Low Risk</option>
            <option value="GREEN">Clear</option>
          </select>
          <input
            type="date"
            value={filterDateFrom}
            onChange={e => setFilterDateFrom(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="From"
          />
          <input
            type="date"
            value={filterDateTo}
            onChange={e => setFilterDateTo(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="To"
          />
          {(filterSearch || filterRisk || filterDateFrom || filterDateTo) && (
            <button
              onClick={() => { setFilterSearch(""); setFilterRisk(""); setFilterDateFrom(""); setFilterDateTo(""); }}
              className="font-body text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Person", "Province", "Result", "Matches", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  const pill = riskPill[c.risk_level] || riskPill.GREEN;
                  return (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-body text-sm text-muted-foreground">{new Date(c.searched_at).toLocaleDateString("en-ZA")}</td>
                      <td className="px-5 py-3 font-body text-sm text-foreground font-medium">{c.search_name || "—"}</td>
                      <td className="px-5 py-3 font-body text-sm text-muted-foreground">{c.search_province || "—"}</td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold" style={{ color: pill.color, background: pill.bg }}>
                          {pill.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-sm text-muted-foreground">{c.matches_found}</td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => setSelectedCheck(c)} className="font-body text-sm text-primary hover:underline">View</button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center font-body text-sm text-muted-foreground">No checks found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
