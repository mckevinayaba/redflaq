import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Download } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend,
} from "recharts";

interface DailyPoint { date: string; count: number }
interface RevenuePoint { date: string; amount: number }

const COLORS = ["hsl(262,83%,58%)", "hsl(32,91%,37%)", "hsl(142,67%,28%)", "hsl(0,69%,42%)", "hsl(230,100%,27%)"];

export default function AdminAnalyticsPage() {
  const [signups, setSignups] = useState<DailyPoint[]>([]);
  const [checks, setChecks] = useState<DailyPoint[]>([]);
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [riskBreakdown, setRiskBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => { fetchAll(); }, [range]);

  const fetchAll = async () => {
    setLoading(true);
    const now = new Date();
    const since = new Date(now.getTime() - range * 24 * 60 * 60 * 1000).toISOString();

    const [profilesRes, searchesRes, paymentsRes] = await Promise.all([
      supabase.from("profiles").select("created_at").gte("created_at", since).order("created_at", { ascending: true }),
      supabase.from("searches").select("searched_at, risk_level").gte("searched_at", since).order("searched_at", { ascending: true }),
      supabase.from("manual_payments").select("created_at, amount").eq("status", "verified").gte("created_at", since).order("created_at", { ascending: true }),
    ]);

    // Build daily maps
    const buildDaily = (rows: any[], dateField: string): DailyPoint[] => {
      const map: Record<string, number> = {};
      (rows || []).forEach(r => {
        const day = new Date(r[dateField]).toISOString().split("T")[0];
        map[day] = (map[day] || 0) + 1;
      });
      const arr: DailyPoint[] = [];
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split("T")[0];
        arr.push({ date: key.slice(5), count: map[key] || 0 });
      }
      return arr;
    };

    const buildRevenue = (rows: any[]): RevenuePoint[] => {
      const map: Record<string, number> = {};
      (rows || []).forEach(r => {
        const day = new Date(r.created_at).toISOString().split("T")[0];
        map[day] = (map[day] || 0) + Number(r.amount);
      });
      const arr: RevenuePoint[] = [];
      for (let i = range - 1; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().split("T")[0];
        arr.push({ date: key.slice(5), amount: map[key] || 0 });
      }
      return arr;
    };

    // Risk breakdown
    const riskMap: Record<string, number> = {};
    (searchesRes.data || []).forEach((s: any) => {
      const level = s.risk_level || "GREEN";
      riskMap[level] = (riskMap[level] || 0) + 1;
    });
    const riskLabels: Record<string, string> = { RED: "High Risk", ORANGE: "Moderate", YELLOW: "Low Risk", GREEN: "Clear" };

    setSignups(buildDaily(profilesRes.data || [], "created_at"));
    setChecks(buildDaily(searchesRes.data || [], "searched_at"));
    setRevenue(buildRevenue(paymentsRes.data || []));
    setRiskBreakdown(Object.entries(riskMap).map(([k, v]) => ({ name: riskLabels[k] || k, value: v })));
    setLoading(false);
  };

  const exportCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(","), ...data.map(r => keys.map(k => r[k]).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const chartTooltipStyle = {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: 8,
    fontFamily: "'Syne', sans-serif",
    fontSize: 13,
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-foreground">Analytics & Reports</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">Platform performance overview</p>
          </div>
          <select
            value={range}
            onChange={e => setRange(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Signups chart */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg text-foreground">Signups per Day</h2>
                <button onClick={() => exportCSV(signups, "signups.csv")} className="flex items-center gap-1 text-sm font-body text-primary hover:underline">
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={signups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Checks chart */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg text-foreground">Checks per Day</h2>
                <button onClick={() => exportCSV(checks, "checks.csv")} className="flex items-center gap-1 text-sm font-body text-primary hover:underline">
                  <Download className="h-3.5 w-3.5" /> CSV
                </button>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={checks}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue chart */}
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg text-foreground">Revenue per Day (R)</h2>
                  <button onClick={() => exportCSV(revenue, "revenue.csv")} className="flex items-center gap-1 text-sm font-body text-primary hover:underline">
                    <Download className="h-3.5 w-3.5" /> CSV
                  </button>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="amount" fill="hsl(142,67%,28%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Risk breakdown pie */}
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h2 className="font-heading text-lg text-foreground mb-4">Check Results Breakdown</h2>
                {riskBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={riskBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {riskBreakdown.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Legend wrapperStyle={{ fontFamily: "'Syne', sans-serif", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="font-body text-sm text-muted-foreground text-center py-10">No data for this period</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
