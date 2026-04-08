import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const card: React.CSSProperties = {
  background: '#111118',
  border: '1px solid rgba(108,53,222,0.25)',
  borderRadius: 8,
  padding: '24px',
  marginBottom: 16,
};

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
      <div style={{ marginBottom: 28 }}>
        <p style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
          Account
        </p>
        <h1 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em' }}>
          Account & Billing
        </h1>
      </div>

      <div style={{ maxWidth: 560 }}>
        {/* Profile */}
        <div style={card}>
          <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 20 }}>Profile</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>,
                label: "Full name",
                value: profile?.full_name || "—",
                note: "This name is for your account only and does not appear in any reports.",
              },
              {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
                label: "Email",
                value: user?.email || "—",
                note: "We use this email to send your reports and important security updates.",
              },
              {
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
                label: "Member since",
                value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" }) : "—",
                note: null,
              },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ marginTop: 2, flexShrink: 0 }}>{row.icon}</span>
                <div>
                  <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 4 }}>{row.label}</p>
                  <p style={{ ...inter, fontSize: 14, color: '#ffffff' }}>{row.value}</p>
                  {row.note && <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 4 }}>{row.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div style={card}>
          <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Security</h2>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', marginBottom: 16 }}>Choose a strong password you don't use anywhere else.</p>
          <button
            onClick={handleResetPassword}
            style={{
              ...inter, fontSize: 13, fontWeight: 600, color: '#d1d1d6',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '10px 18px', borderRadius: 4, cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,53,222,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
          >
            Reset password
          </button>
        </div>

        {/* Delete account */}
        <div style={{
          ...card,
          border: '1px solid rgba(192,57,43,0.3)',
          borderLeft: '3px solid rgba(192,57,43,0.6)',
          marginBottom: 0,
        }}>
          <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Delete my account</h2>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 16 }}>
            If you delete your account, you will lose access to your reports and history. We will keep only the information we must retain for legal or financial reasons.
          </p>
          <button
            onClick={() => window.location.href = "mailto:support@redflaq.com?subject=Account%20Deletion%20Request"}
            style={{
              ...inter, fontSize: 13, fontWeight: 600, color: '#C0392B',
              background: 'rgba(192,57,43,0.08)',
              border: '1px solid rgba(192,57,43,0.3)',
              padding: '10px 18px', borderRadius: 4, cursor: 'pointer',
            }}
          >
            Request account deletion
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
