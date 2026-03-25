import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Shield, Users, Search, CreditCard, BarChart3,
  ArrowLeft, FileText, GitMerge, CheckCircle2, AlertTriangle
} from "lucide-react";

interface KPIs {
  totalUsers: number;
  newSignups7d: number;
  totalChecks: number;
  checksToday: number;
  revenueMonth: number;
}

interface UserRow {
  user_id: string;
  full_name: string | null;
  created_at: string;
}

interface CheckRow {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_province: string | null;
  search_id: string;
}

const riskPill: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High", color: "#7C3AED", bg: "#FAF5FF" },
  ORANGE: { label: "Moderate", color: "#D97706", bg: "#FFFBEB" },
  YELLOW: { label: "Low", color: "#CA8A04", bg: "#FEFCE8" },
  GREEN: { label: "Clear", color: "#16A34A", bg: "#F0FDF4" },
};

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPIs>({ totalUsers: 0, newSignups7d: 0, totalChecks: 0, checksToday: 0, revenueMonth: 0 });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [checks, setChecks] = useState<CheckRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) checkAdminAccess();
  }, [user, authLoading]);

  const checkAdminAccess = async () => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .in("role", ["admin", "owner"])
      .maybeSingle();
    if (!roleData) { navigate("/"); return; }
    setHasAccess(true);
    fetchAll();
  };

  const fetchAll = async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [profilesRes, checksRes, checksTodayRes, paymentsRes, recentUsersRes, recentChecksRes] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("searches").select("*", { count: "exact", head: true }),
      supabase.from("searches").select("*", { count: "exact", head: true }).gte("searched_at", startOfDay),
      supabase.from("purchases").select("amount").in("status", ["completed", "paid"]).gte("purchased_at", startOfMonth),
      supabase.from("profiles").select("user_id, full_name, created_at").order("created_at", { ascending: false }).limit(20),
      supabase.from("searches").select("*").order("searched_at", { ascending: false }).limit(50),
    ]);

    // Count new signups in last 7 days
    const { count: newSignups } = await supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo);

    const revenue = (paymentsRes.data || []).reduce((sum, p) => sum + Number(p.amount), 0);

    setKpis({
      totalUsers: profilesRes.count || 0,
      newSignups7d: newSignups || 0,
      totalChecks: checksRes.count || 0,
      checksToday: checksTodayRes.count || 0,
      revenueMonth: revenue,
    });
    setUsers(recentUsersRes.data || []);
    setChecks((recentChecksRes.data as CheckRow[]) || []);
    setLoading(false);
  };

  if (!hasAccess || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    { label: "Total Users", value: kpis.totalUsers, icon: Users, color: "text-primary" },
    { label: "New Signups (7d)", value: kpis.newSignups7d, icon: Users, color: "text-primary" },
    { label: "Total Checks", value: kpis.totalChecks, icon: Search, color: "text-primary" },
    { label: "Checks Today", value: kpis.checksToday, icon: BarChart3, color: "text-primary" },
    { label: "Revenue (Month)", value: `R${kpis.revenueMonth.toLocaleString()}`, icon: CreditCard, color: "text-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="font-heading text-xl text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/verify-payments" className="px-3 py-2 text-sm font-body border border-border rounded-lg hover:bg-muted flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Payments
            </Link>
            <Link to="/admin/import" className="px-3 py-2 text-sm font-body border border-border rounded-lg hover:bg-muted flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Import
            </Link>
            <Link to="/admin/merge-review" className="px-3 py-2 text-sm font-body border border-border rounded-lg hover:bg-muted flex items-center gap-1.5">
              <GitMerge className="h-3.5 w-3.5" /> Merge
            </Link>
            <Link to="/dashboard" className="px-3 py-2 text-sm font-body border border-border rounded-lg hover:bg-muted flex items-center gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {kpiCards.map((kpi) => (
            <div key={kpi.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{kpi.label}</span>
              </div>
              <p className="font-heading text-2xl text-foreground">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Checks table */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-heading text-lg text-foreground">Recent Safety Checks</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Date", "Person", "Province", "Result", "Matches"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{h}</th>
                  ))}
                  <th className="text-right px-5 py-3"></th>
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
              </tbody>
            </table>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-heading text-lg text-foreground">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Joined"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
                    <td className="px-5 py-3 font-body text-sm text-foreground font-medium">{u.full_name || "—"}</td>
                    <td className="px-5 py-3 font-body text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-ZA")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
