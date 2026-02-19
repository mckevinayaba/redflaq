import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { User, Mail, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DashboardAccount() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ full_name: string | null; created_at: string } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) {
      supabase.from("profiles").select("full_name, created_at").eq("user_id", user.id).maybeSingle()
        .then(({ data }) => setProfile(data));
    }
  }, [user, authLoading]);

  const handleResetPassword = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent a password reset link." });
    }
  };

  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Account</p>
      <h1 className="font-heading text-3xl text-foreground mb-8">Account & Billing</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="font-heading text-lg text-foreground mb-4">Profile</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Name</p>
                <p className="font-body text-sm text-foreground">{profile?.full_name || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Email</p>
                <p className="font-body text-sm text-foreground">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Member since</p>
                <p className="font-body text-sm text-foreground">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="font-heading text-lg text-foreground mb-4">Security</h2>
          <button
            onClick={handleResetPassword}
            className="px-5 py-2.5 border border-border text-foreground font-body font-medium text-sm rounded-lg hover:bg-muted transition-colors"
          >
            Reset password
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
