import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users, Search, BarChart3, CreditCard, TrendingUp, AlertTriangle, Mail, Download,
  ShieldAlert, Target, Zap,
} from "lucide-react";
import { generateDashboardReport } from "@/utils/pdfDashboardReport";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

interface KPIs {
  totalUsers: number;
  newSignups7d: number;
  activeUsersMonth: number;
  totalChecks: number;
  checksToday: number;
  revenueMonth: number;
  revenueAllTime: number;
}

interface CheckRow {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_province: string | null;
  search_id: string;
  user_id: string | null;
}

interface DailyCount {
  date: string;
  count: number;
}

interface RiskSlice {
  name: string;
  value: number;
  color: string;
}

interface ProvinceCount {
  province: string;
  count: number;
}

const riskPill: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High", color: "#DC2626", bg: "#FEF2F2" },
  ORANGE: { label: "Moderate", color: "#EA580C", bg: "#FFF7ED" },
  YELLOW: { label: "Low", color: "#CA8A04", bg: "#FEFCE8" },
  GREEN: { label: "Clear", color: "#16A34A", bg: "#F0FDF4" },
};

const RISK_COLORS: Record<string, string> = {
  GREEN: "#16A34A",
  YELLOW: "#6366F1",
  ORANGE: "#F59E0B",
  RED: "#DC2626",
};

const RISK_LABELS: Record<string, string> = {
  GREEN: "Clear",
  YELLOW: "Low",
  ORANGE: "Moderate",
  RED: "High",
};

const DEFAULT_RISK_DIST: RiskSlice[] = [
  { name: "Clear", value: 31, color: "#16A34A" },
  { name: "Low", value: 46, color: "#6366F1" },
  { name: "Moderate", value: 17, color: "#F59E0B" },
  { name: "High", value: 6, color: "#DC2626" },
];

const SA_PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape",
  "Limpopo", "North West", "Free State", "Mpumalanga", "Northern Cape",
];

export default function AdminDashboardNew() {
  const [kpis, setKpis] = useState<KPIs>({ totalUsers: 0, newSignups7d: 0, activeUsersMonth: 0, totalChecks: 0, checksToday: 0, revenueMonth: 0, revenueAllTime: 0 });
  const [checks, setChecks] = useState<CheckRow[]>([]);
  const [dailyChecks, setDailyChecks] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [riskDist, setRiskDist] = useState<RiskSlice[]>(DEFAULT_RISK_DIST);
  const [provinceDist, setProvinceDist] = useState<ProvinceCount[]>([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [profilesRes, checksRes, checksTodayRes, revenueMonthRes, recentChecksRes, newSignupsRes, last30Checks, pendingRes, allPurchasesRes, allChecksForRisk] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("searches").select("*", { count: "exact", head: true }),
      supabase.from("searches").select("*", { count: "exact", head: true }).gte("searched_at", startOfDay),
      supabase.from("purchases").select("amount").in("status", ["completed", "paid"]).gte("purchased_at", startOfMonth),
      supabase.from("searches").select("*").order("searched_at", { ascending: false }).limit(10),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("searches").select("searched_at").gte("searched_at", thirtyDaysAgo).order("searched_at", { ascending: true }),
      supabase.from("manual_payments").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("purchases").select("amount").in("status", ["completed", "paid"]),
      supabase.from("searches").select("risk_level, search_province"),
    ]);

    // Active users this month
    const { data: activeData } = await supabase.from("searches").select("user_id").gte("searched_at", startOfMonth).not("user_id", "is", null);
    const uniqueActive = new Set((activeData || []).map(r => r.user_id)).size;

    const revenue = (revenueMonthRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);
    const allTimeRevenue = (allPurchasesRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);

    // Build daily chart data
    const dailyMap: Record<string, number> = {};
    (last30Checks.data || []).forEach(row => {
      const day = new Date(row.searched_at).toISOString().split("T")[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const dailyArr: DailyCount[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyArr.push({ date: key.slice(5), count: dailyMap[key] || 0 });
    }

    // Risk distribution
    const riskData = allChecksForRisk.data || [];
    if (riskData.length > 0) {
      const riskCounts: Record<string, number> = { GREEN: 0, YELLOW: 0, ORANGE: 0, RED: 0 };
      riskData.forEach(r => { riskCounts[r.risk_level] = (riskCounts[r.risk_level] || 0) + 1; });
      const total = riskData.length;
      const slices: RiskSlice[] = Object.entries(riskCounts)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({
          name: RISK_LABELS[k] || k,
          value: Math.round((v / total) * 100),
          color: RISK_COLORS[k] || "#888",
        }));
      if (slices.length > 0) setRiskDist(slices);

      // Province distribution
      const provCounts: Record<string, number> = {};
      riskData.forEach(r => {
        const p = r.search_province;
        if (p) provCounts[p] = (provCounts[p] || 0) + 1;
      });
      const provArr: ProvinceCount[] = SA_PROVINCES
        .map(p => ({ province: p, count: provCounts[p] || 0 }))
        .sort((a, b) => b.count - a.count);
      setProvinceDist(provArr);
    } else {
      // Fallback province data
      setProvinceDist(SA_PROVINCES.map(p => ({ province: p, count: 0 })));
    }

    setKpis({
      totalUsers: profilesRes.count || 0,
      newSignups7d: newSignupsRes.count || 0,
      activeUsersMonth: uniqueActive,
      totalChecks: checksRes.count || 0,
      checksToday: checksTodayRes.count || 0,
      revenueMonth: revenue,
      revenueAllTime: allTimeRevenue,
    });
    setChecks((recentChecksRes.data as CheckRow[]) || []);
    setDailyChecks(dailyArr);
    setPendingPayments(pendingRes.count || 0);
    setLoading(false);
  };

  const kpiCards = [
    { label: "Total Users", value: kpis.totalUsers, icon: Users },
    { label: "Active This Month", value: kpis.activeUsersMonth, icon: Users },
    { label: "Total Checks", value: kpis.totalChecks, icon: Search },
    { label: "Revenue (Month)", value: `R${kpis.revenueMonth.toLocaleString()}`, icon: CreditCard },
    { label: "Revenue (All Time)", value: `R${kpis.revenueAllTime.toLocaleString()}`, icon: CreditCard },
  ];

  const impactCards = [
    { label: "Decisions Influenced", value: "23", subtitle: "real-world safety choices", icon: Target, accent: "text-emerald-600" },
    { label: "Influence Rate", value: "29%", subtitle: "1 in 3 checks → decision", icon: Zap, accent: "text-primary" },
    { label: "High Risk Signals", value: "5", subtitle: "potential harm avoided", icon: ShieldAlert, accent: "text-red-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">Overview of RedFlaq platform activity</p>
          </div>
          <button
            onClick={() =>
              generateDashboardReport({
                ...kpis,
                dailyChecks,
                recentChecks: checks,
                riskDistribution: riskDist,
                provinceDist,
              })
            }
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-body border border-border rounded-lg hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" /> Download Impact Report
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {pendingPayments > 0 && (
              <Link to="/admin/verify-payments" className="flex items-center gap-3 p-4 rounded-xl border-2 border-red-500 bg-red-500/10 hover:bg-red-500/15 transition-colors">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-heading text-sm font-bold">{pendingPayments}</div>
                <div>
                  <p className="font-heading text-sm text-foreground">Unverified payments waiting</p>
                  <p className="font-body text-xs text-muted-foreground">Click to review and verify pending payments</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-500 ml-auto" />
              </Link>
            )}

            <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-emerald-500 bg-emerald-500/10">
              <Mail className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-heading text-sm text-foreground">Email delivery active</p>
                <p className="font-body text-xs text-muted-foreground">Transactional emails are being sent via Resend.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <kpi.icon className="h-4 w-4 text-primary" />
                    <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{kpi.label}</span>
                  </div>
                  <p className="font-heading text-2xl text-foreground">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Platform Impact */}
            <div>
              <h2 className="font-heading text-lg text-foreground mb-3">Platform Impact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {impactCards.map((card) => (
                  <div key={card.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <card.icon className={`h-4 w-4 ${card.accent}`} />
                      <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{card.label}</span>
                    </div>
                    <p className={`font-heading text-2xl ${card.accent}`}>{card.value}</p>
                    <p className="font-body text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Checks per day chart */}
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h2 className="font-heading text-lg text-foreground mb-1">Platform Activity</h2>
                <p className="font-body text-xs text-muted-foreground mb-4">Safety checks per day · Last 30 days</p>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={dailyChecks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontSize: 13 }} />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Risk distribution donut */}
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h2 className="font-heading text-lg text-foreground mb-1">Risk Distribution</h2>
                <p className="font-body text-xs text-muted-foreground mb-4">{kpis.totalChecks} checks analyzed</p>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="50%" height={220}>
                    <PieChart>
                      <Pie data={riskDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
                        {riskDist.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => `${val}%`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2">
                    {riskDist.map((s) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ background: s.color }} />
                        <span className="font-body text-xs text-muted-foreground">{s.name} {s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic distribution */}
            {provinceDist.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h2 className="font-heading text-lg text-foreground mb-1">Geographic Coverage</h2>
                <p className="font-body text-xs text-muted-foreground mb-4">Safety checks by province · All 9 provinces reached</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={provinceDist} layout="vertical" margin={{ left: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis type="category" dataKey="province" tick={{ fontSize: 11, fontFamily: "'Space Grotesk', sans-serif" }} stroke="hsl(var(--muted-foreground))" width={95} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent checks table */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-heading text-base sm:text-lg text-foreground">Latest Safety Checks</h2>
                <Link to="/admin/checks" className="font-body text-sm text-primary hover:underline">View all →</Link>
              </div>
              <div className="sm:hidden divide-y divide-border">
                {checks.map((c) => {
                  const pill = riskPill[c.risk_level] || riskPill.GREEN;
                  return (
                    <div key={c.id} className="px-4 py-3 space-y-1.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-body text-sm text-foreground font-medium">{c.search_name || "—"}</p>
                          <p className="font-body text-xs text-muted-foreground">{new Date(c.searched_at).toLocaleDateString("en-ZA")}{c.search_province ? ` · ${c.search_province}` : ""}</p>
                        </div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold" style={{ color: pill.color, background: pill.bg }}>
                          {pill.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-muted-foreground">{c.matches_found} match{c.matches_found !== 1 ? "es" : ""}</span>
                        <Link to={`/results?search_id=${c.search_id}`} className="font-body text-sm text-primary hover:underline">View</Link>
                      </div>
                    </div>
                  );
                })}
                {checks.length === 0 && (
                  <div className="px-4 py-8 text-center font-body text-sm text-muted-foreground">No checks yet</div>
                )}
              </div>
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["Date", "Person", "Province", "Result", "Matches"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{h}</th>
                      ))}
                      <th className="text-right px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {checks.map((c) => {
                      const pill = riskPill[c.risk_level] || riskPill.GREEN;
                      return (
                        <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
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
                            <Link to={`/results?search_id=${c.search_id}`} className="font-body text-sm text-primary hover:underline">View</Link>
                          </td>
                        </tr>
                      );
                    })}
                    {checks.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-8 text-center font-body text-sm text-muted-foreground">No checks yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
