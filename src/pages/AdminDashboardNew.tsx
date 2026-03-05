import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Users, Search, BarChart3, CreditCard, TrendingUp, AlertTriangle, Mail,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
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

const riskPill: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High", color: "#DC2626", bg: "#FEF2F2" },
  ORANGE: { label: "Moderate", color: "#EA580C", bg: "#FFF7ED" },
  YELLOW: { label: "Low", color: "#CA8A04", bg: "#FEFCE8" },
  GREEN: { label: "Clear", color: "#16A34A", bg: "#F0FDF4" },
};

export default function AdminDashboardNew() {
  const [kpis, setKpis] = useState<KPIs>({ totalUsers: 0, newSignups7d: 0, activeUsersMonth: 0, totalChecks: 0, checksToday: 0, revenueMonth: 0, revenueAllTime: 0 });
  const [checks, setChecks] = useState<CheckRow[]>([]);
  const [dailyChecks, setDailyChecks] = useState<DailyCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingPayments, setPendingPayments] = useState(0);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [profilesRes, checksRes, checksTodayRes, paymentsRes, recentChecksRes, newSignupsRes, last30Checks, pendingRes, allPaymentsRes, allPurchasesRes] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("searches").select("*", { count: "exact", head: true }),
      supabase.from("searches").select("*", { count: "exact", head: true }).gte("searched_at", startOfDay),
      supabase.from("manual_payments").select("amount").eq("status", "verified").gte("created_at", startOfMonth),
      supabase.from("searches").select("*").order("searched_at", { ascending: false }).limit(10),
      supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo),
      supabase.from("searches").select("searched_at").gte("searched_at", thirtyDaysAgo).order("searched_at", { ascending: true }),
      supabase.from("manual_payments").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("manual_payments").select("amount").eq("status", "verified"),
      supabase.from("purchases").select("amount").eq("status", "completed"),
    ]);

    // Active users this month (distinct user_ids who ran checks)
    const { data: activeData } = await supabase.from("searches").select("user_id").gte("searched_at", startOfMonth).not("user_id", "is", null);
    const uniqueActive = new Set((activeData || []).map(r => r.user_id)).size;

    const revenue = (paymentsRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);
    const allTimeManual = (allPaymentsRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);
    const allTimePurchases = (allPurchasesRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);
    const allTimeRevenue = allTimeManual + allTimePurchases;

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
    { label: "New Signups (7d)", value: kpis.newSignups7d, icon: TrendingUp },
    { label: "Active This Month", value: kpis.activeUsersMonth, icon: Users },
    { label: "Total Checks", value: kpis.totalChecks, icon: Search },
    { label: "Checks Today", value: kpis.checksToday, icon: BarChart3 },
    { label: "Revenue (Month)", value: `R${kpis.revenueMonth.toLocaleString()}`, icon: CreditCard },
    { label: "Revenue (All Time)", value: `R${kpis.revenueAllTime.toLocaleString()}`, icon: CreditCard },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl text-foreground">Dashboard</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Overview of RedFlaq platform activity</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Alert banners */}
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
                <p className="font-body text-xs text-muted-foreground">Transactional emails (payment confirmations, search results, welcome) are being sent via Resend.</p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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

            {/* Checks per day chart */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <h2 className="font-heading text-lg text-foreground mb-4">Checks per Day (Last 30 Days)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyChecks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontFamily: "'Syne', sans-serif", fontSize: 13 }}
                  />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent checks table */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-heading text-base sm:text-lg text-foreground">Latest Safety Checks</h2>
                <Link to="/admin/checks" className="font-body text-sm text-primary hover:underline">View all →</Link>
              </div>
              {/* Mobile card view */}
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
              {/* Desktop table view */}
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
