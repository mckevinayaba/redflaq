import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  ArrowLeft, Shield, UserX, UserCheck, Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserRow {
  user_id: string;
  full_name: string | null;
  created_at: string;
  status: string;
  email?: string;
  role?: string;
  checks_count?: number;
}

const roleBadge: Record<string, { label: string; cls: string }> = {
  owner: { label: "Owner", cls: "text-primary border border-primary/30" },
  admin: { label: "Admin", cls: "text-primary border border-primary/30" },
  support: { label: "Support", cls: "bg-amber-100 text-amber-700" },
  user: { label: "User", cls: "bg-muted text-muted-foreground" },
};

const statusBadge: Record<string, { label: string; cls: string }> = {
  active: { label: "Active", cls: "text-green-700 bg-green-50" },
  suspended: { label: "Suspended", cls: "text-red-700 bg-red-50" },
};

export default function AdminUsersPage() {
  const { isOwner, isAdmin } = useUserRole();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [userChecks, setUserChecks] = useState<any[]>([]);
  const [changingRole, setChangingRole] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    // Fetch profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, created_at, status")
      .order("created_at", { ascending: false });

    // Fetch roles
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");

    // Fetch check counts per user
    const { data: searches } = await supabase.from("searches").select("user_id").not("user_id", "is", null);

    const checkCounts: Record<string, number> = {};
    (searches || []).forEach(s => {
      if (s.user_id) checkCounts[s.user_id] = (checkCounts[s.user_id] || 0) + 1;
    });

    const roleMap: Record<string, string> = {};
    (roles || []).forEach(r => { roleMap[r.user_id] = r.role; });

    const enriched: UserRow[] = (profiles || []).map(p => ({
      ...p,
      role: roleMap[p.user_id] || "user",
      checks_count: checkCounts[p.user_id] || 0,
    }));

    setUsers(enriched);
    setLoading(false);
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (u.full_name || "").toLowerCase().includes(q) || (u.role || "").includes(q);
  });

  const openDetail = async (user: UserRow) => {
    setSelectedUser(user);
    const { data } = await supabase
      .from("searches")
      .select("*")
      .eq("user_id", user.user_id)
      .order("searched_at", { ascending: false })
      .limit(20);
    setUserChecks(data || []);
  };

  const toggleStatus = async (user: UserRow) => {
    const newStatus = user.status === "active" ? "suspended" : "active";
    await supabase.from("profiles").update({ status: newStatus }).eq("user_id", user.user_id);
    toast({ title: `User ${newStatus === "active" ? "reactivated" : "suspended"}` });
    setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null);
    fetchUsers();
  };

  const changeRole = async (userId: string, newRole: string) => {
    setChangingRole(true);
    // Delete existing role then insert new one
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role: newRole as any });
    toast({ title: `Role updated to ${newRole}` });
    setChangingRole(false);
    setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
    fetchUsers();
  };

  // Detail view
  if (selectedUser) {
    const rb = roleBadge[selectedUser.role || "user"] || roleBadge.user;
    const sb = statusBadge[selectedUser.status] || statusBadge.active;
    return (
      <AdminLayout>
        <div className="space-y-6">
          <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 font-body text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to Users
          </button>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl text-foreground">{selectedUser.full_name || "Unnamed"}</h2>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Joined {new Date(selectedUser.created_at).toLocaleDateString("en-ZA")}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] tracking-wider uppercase ${rb.cls}`}>{rb.label}</span>
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] tracking-wider uppercase ${sb.cls}`}>{sb.label}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {isAdmin && (
                  <button
                    onClick={() => toggleStatus(selectedUser)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-lg border transition-colors ${
                      selectedUser.status === "active"
                        ? "border-red-200 text-red-700 hover:bg-red-50"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                  >
                    {selectedUser.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    {selectedUser.status === "active" ? "Suspend" : "Reactivate"}
                  </button>
                )}
              </div>
            </div>

            {/* Role management – owner only */}
            {isOwner && selectedUser.role !== "owner" && (
              <div className="mt-6 pt-4 border-t border-border">
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">Change Role</p>
                <div className="flex flex-wrap gap-2">
                  {["user", "support", "admin"].map(r => (
                    <button
                      key={r}
                      disabled={changingRole || selectedUser.role === r}
                      onClick={() => changeRole(selectedUser.user_id, r)}
                      className={`px-3 py-1.5 text-sm font-body rounded-lg border transition-colors ${
                        selectedUser.role === r
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User's checks */}
          <div className="bg-card rounded-xl border border-border shadow-sm">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-lg text-foreground">Recent Checks ({userChecks.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["Date", "Person", "Province", "Result", "Matches"].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userChecks.map((c: any) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-body text-sm text-muted-foreground">{new Date(c.searched_at).toLocaleDateString("en-ZA")}</td>
                      <td className="px-5 py-3 font-body text-sm text-foreground font-medium">{c.search_name || "—"}</td>
                      <td className="px-5 py-3 font-body text-sm text-muted-foreground">{c.search_province || "—"}</td>
                      <td className="px-5 py-3">
                        <span className="font-mono text-[10px] font-semibold">{c.risk_level}</span>
                      </td>
                      <td className="px-5 py-3 font-mono text-sm text-muted-foreground">{c.matches_found}</td>
                    </tr>
                  ))}
                  {userChecks.length === 0 && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center font-body text-sm text-muted-foreground">No checks found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
            <h1 className="font-heading text-2xl text-foreground">Users</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">{users.length} total users</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or role..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
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
                  {["Name", "Role", "Joined", "Checks", "Status", ""].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-mono text-[9px] tracking-wider text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const rb = roleBadge[u.role || "user"] || roleBadge.user;
                  const sb = statusBadge[u.status] || statusBadge.active;
                  return (
                    <tr key={u.user_id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-body text-sm text-foreground font-medium">{u.full_name || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] tracking-wider uppercase ${rb.cls}`}>{rb.label}</span>
                      </td>
                      <td className="px-5 py-3 font-body text-sm text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-ZA")}</td>
                      <td className="px-5 py-3 font-mono text-sm text-muted-foreground">{u.checks_count}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] tracking-wider uppercase ${sb.cls}`}>{sb.label}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => openDetail(u)} className="font-body text-sm text-primary hover:underline">View</button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center font-body text-sm text-muted-foreground">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
