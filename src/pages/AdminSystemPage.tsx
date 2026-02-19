import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Save, ShieldCheck, UserPlus, Trash2 } from "lucide-react";

interface StaffRow {
  user_id: string;
  role: string;
  full_name: string | null;
}

const roleBadge: Record<string, { label: string; cls: string }> = {
  owner: { label: "Owner", cls: "bg-primary/15 text-primary" },
  admin: { label: "Admin", cls: "bg-primary/15 text-primary" },
  support: { label: "Support", cls: "bg-amber-100 text-amber-700" },
};

export default function AdminSystemPage() {
  const { isOwner } = useUserRole();
  const { user } = useAuth();
  const { toast } = useToast();

  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Global settings
  const [supportEmail, setSupportEmail] = useState("");
  const [privacyUrl, setPrivacyUrl] = useState("");
  const [termsUrl, setTermsUrl] = useState("");
  const [origSettings, setOrigSettings] = useState({ supportEmail: "", privacyUrl: "", termsUrl: "" });
  const [savingSettings, setSavingSettings] = useState(false);

  // Invite
  const [inviteUserId, setInviteUserId] = useState("");
  const [inviteRole, setInviteRole] = useState("support");
  const [inviting, setInviting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    // Fetch staff (non-user roles)
    const { data: roles } = await supabase.from("user_roles").select("user_id, role").neq("role", "user");
    const userIds = (roles || []).map(r => r.user_id);

    let profileMap: Record<string, string | null> = {};
    if (userIds.length) {
      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      (profiles || []).forEach(p => { profileMap[p.user_id] = p.full_name; });
    }

    setStaff((roles || []).map(r => ({ ...r, full_name: profileMap[r.user_id] || null })));

    // Fetch global settings
    const settingKeys = ["support_email", "privacy_url", "terms_url"];
    const { data: settings } = await supabase.from("site_settings" as any).select("key, value").in("key", settingKeys);
    const sMap: Record<string, string> = {};
    (settings || []).forEach((s: any) => { sMap[s.key] = typeof s.value === "string" ? s.value : ""; });

    const se = sMap.support_email || "support@redflaq.com";
    const pu = sMap.privacy_url || "/privacy";
    const tu = sMap.terms_url || "/terms";
    setSupportEmail(se);
    setPrivacyUrl(pu);
    setTermsUrl(tu);
    setOrigSettings({ supportEmail: se, privacyUrl: pu, termsUrl: tu });
    setLoading(false);
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const updates: { key: string; value: string }[] = [];
    if (supportEmail !== origSettings.supportEmail) updates.push({ key: "support_email", value: supportEmail });
    if (privacyUrl !== origSettings.privacyUrl) updates.push({ key: "privacy_url", value: privacyUrl });
    if (termsUrl !== origSettings.termsUrl) updates.push({ key: "terms_url", value: termsUrl });

    for (const u of updates) {
      await supabase.from("site_settings" as any).upsert({ key: u.key, value: u.value, updated_at: new Date().toISOString() } as any, { onConflict: "key" });
    }

    setOrigSettings({ supportEmail, privacyUrl, termsUrl });
    setSavingSettings(false);
    toast({ title: "Settings saved" });
  };

  const handleInvite = async () => {
    if (!inviteUserId.trim()) return;
    setInviting(true);

    // Check if user exists in profiles
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("user_id", inviteUserId.trim()).maybeSingle();
    if (!profile) {
      toast({ title: "User not found", description: "No user with that ID exists.", variant: "destructive" });
      setInviting(false);
      return;
    }

    // Remove existing role and insert new one
    await supabase.from("user_roles").delete().eq("user_id", inviteUserId.trim());
    await supabase.from("user_roles").insert({ user_id: inviteUserId.trim(), role: inviteRole as any });

    toast({ title: `User assigned as ${inviteRole}` });
    setInviteUserId("");
    setInviting(false);
    fetchData();
  };

  const removeStaff = async (userId: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role: "user" as any });
    toast({ title: "Reverted to regular user" });
    fetchData();
  };

  const changeStaffRole = async (userId: string, newRole: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId);
    await supabase.from("user_roles").insert({ user_id: userId, role: newRole as any });
    toast({ title: `Role changed to ${newRole}` });
    fetchData();
  };

  const settingsChanged = supportEmail !== origSettings.supportEmail || privacyUrl !== origSettings.privacyUrl || termsUrl !== origSettings.termsUrl;

  if (!isOwner) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-heading text-xl text-foreground">Owner Access Only</h2>
            <p className="font-body text-sm text-muted-foreground mt-2">This page is restricted to the platform owner.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-3xl">
        <div>
          <h1 className="font-heading text-2xl text-foreground">System & Roles</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Manage staff access and global settings</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Staff list */}
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-heading text-lg text-foreground">Staff Members</h2>
              </div>
              <div className="divide-y divide-border">
                {staff.map(s => {
                  const badge = roleBadge[s.role] || roleBadge.support;
                  const isSelf = s.user_id === user?.id;
                  const isOwnerRole = s.role === "owner";
                  return (
                    <div key={s.user_id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-body font-bold text-sm text-primary">
                          {(s.full_name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-body text-sm font-medium text-foreground">{s.full_name || "Unnamed"}</p>
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] tracking-wider uppercase ${badge.cls}`}>{badge.label}</span>
                        </div>
                      </div>
                      {!isOwnerRole && !isSelf && (
                        <div className="flex items-center gap-2">
                          <select
                            value={s.role}
                            onChange={e => changeStaffRole(s.user_id, e.target.value)}
                            className="px-2 py-1 rounded border border-border bg-background font-body text-xs focus:outline-none"
                          >
                            <option value="support">Support</option>
                            <option value="admin">Admin</option>
                          </select>
                          <button onClick={() => removeStaff(s.user_id)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors" title="Remove staff access">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      {isOwnerRole && (
                        <span className="font-mono text-[10px] text-muted-foreground">Protected</span>
                      )}
                    </div>
                  );
                })}
                {staff.length === 0 && (
                  <div className="px-6 py-8 text-center font-body text-sm text-muted-foreground">No staff members yet</div>
                )}
              </div>
            </div>

            {/* Add staff */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-heading text-lg text-foreground mb-4">
                <UserPlus className="h-5 w-5 inline-block mr-2 text-primary" />
                Add Staff Member
              </h3>
              <p className="font-body text-xs text-muted-foreground mb-3">
                Enter the user ID of an existing RedFlaq user to grant them staff access.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={inviteUserId}
                  onChange={e => setInviteUserId(e.target.value)}
                  placeholder="User ID (UUID)"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="px-3 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none"
                >
                  <option value="support">Support</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={handleInvite}
                  disabled={inviting || !inviteUserId.trim()}
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-body text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {inviting ? "Adding..." : "Add"}
                </button>
              </div>
            </div>

            {/* Global settings */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg text-foreground">Global Settings</h3>
                <button
                  onClick={saveSettings}
                  disabled={!settingsChanged || savingSettings}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-body bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" /> {savingSettings ? "Saving..." : "Save"}
                </button>
              </div>

              {[
                { label: "Support Email", value: supportEmail, set: setSupportEmail, placeholder: "support@redflaq.com" },
                { label: "Privacy Policy URL", value: privacyUrl, set: setPrivacyUrl, placeholder: "/privacy" },
                { label: "Terms of Service URL", value: termsUrl, set: setTermsUrl, placeholder: "/terms" },
              ].map(field => (
                <div key={field.label}>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">{field.label}</label>
                  <input
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
