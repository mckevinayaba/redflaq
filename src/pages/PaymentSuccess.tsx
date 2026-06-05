import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2, Shield, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { toast } from "sonner";

const PACKAGES: Record<string, { label: string; credits: number; price: number }> = {
  single: { label: "One Safety Check", credits: 1, price: 99 },
  triple: { label: "Safety Pack (3 Checks)", credits: 3, price: 249 },
  five: { label: "Family & Friends (5 Checks)", credits: 5, price: 399 },
};

function resolvePackage(searchParams: URLSearchParams) {
  const pkgType = searchParams.get("package_type");
  if (pkgType && PACKAGES[pkgType]) return PACKAGES[pkgType];
  const credits = parseInt(searchParams.get("credits") || "0", 10);
  if (credits === 5) return PACKAGES.five;
  if (credits === 3) return PACKAGES.triple;
  if (credits >= 1) return PACKAGES.single;
  return PACKAGES.single;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const paymentId = searchParams.get("payment_id");
  const paidEmail = searchParams.get("email");
  const pkg = resolvePackage(searchParams);
  const { credits, webhookDelayed } = useCredits(user?.email, user?.id);
  const [copied, setCopied] = useState(false);
  const [autoRedirected, setAutoRedirected] = useState(false);

  // Email mismatch: paid as one email, but signed in as another
  const emailMismatch =
    !!user?.email && !!paidEmail && user.email.toLowerCase() !== paidEmail.toLowerCase();

  // Auto-redirect signed-in users to Verify the moment credits land
  useEffect(() => {
    if (autoRedirected) return;
    if (authLoading) return;
    if (!user) return;
    if (emailMismatch) return;
    if (credits !== null && credits > 0) {
      setAutoRedirected(true);
      sessionStorage.removeItem("pendingSearch");
      const t = setTimeout(() => {
        navigate("/dashboard/new-check?from_payment=1", { replace: true });
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [authLoading, user, credits, emailMismatch, autoRedirected, navigate]);

  const handleStartCheck = () => {
    sessionStorage.removeItem("pendingSearch");
    if (!user) {
      const redirect = encodeURIComponent("/dashboard/new-check?from_payment=1");
      const emailParam = paidEmail ? `&email=${encodeURIComponent(paidEmail)}` : "";
      navigate(`/signup?redirect=${redirect}${emailParam}`);
    } else {
      navigate("/dashboard/new-check?from_payment=1");
    }
  };

  const copyRef = () => {
    if (paymentId) {
      navigator.clipboard.writeText(paymentId);
      setCopied(true);
      toast.success("Reference copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inter = { fontFamily: "'Inter', sans-serif" };
  const mono = { fontFamily: "'JetBrains Mono', monospace" };

  // States: confirming (signed in, no credits yet, webhook not flagged late),
  //         ready (credits landed), delayed (webhook took too long),
  //         signed-out, email-mismatch
  const isSignedIn = !!user;
  const hasCredits = credits !== null && credits > 0;
  const stillWaiting = isSignedIn && !hasCredits && !webhookDelayed && !emailMismatch;

  return (
    <div style={{ background: '#08080f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8, padding: '48px 40px' }}>
          {stillWaiting ? (
            <>
              <Loader2 size={48} style={{ color: '#6C35DE', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
              <h1 style={{ ...inter, fontSize: 24, fontWeight: 900, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.02em' }}>Payment received — preparing your check…</h1>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.6 }}>You'll be taken to Verify automatically in a few seconds.</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={56} style={{ color: '#27AE60', margin: '0 auto 24px' }} />
              <h1 style={{ ...inter, fontSize: 28, fontWeight: 900, color: '#ffffff', marginBottom: 12, letterSpacing: '-0.025em' }}>Payment Confirmed!</h1>
              <p style={{ ...inter, fontSize: 15, color: '#8b8b91', lineHeight: 1.6, marginBottom: 4 }}>
                {autoRedirected
                  ? "Taking you to Verify now…"
                  : "Your checks are ready. You can start verifying immediately."}
              </p>

              <div style={{ background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8, padding: '16px 20px', margin: '24px 0', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>Package</span>
                  <span style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{pkg.label}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>Checks Available</span>
                  <span style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#27AE60' }}>{pkg.credits}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>Amount Paid</span>
                  <span style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>R{pkg.price}.00</span>
                </div>
              </div>

              {paymentId && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                  <span style={{ ...mono, fontSize: 11, color: '#8b8b91' }}>Reference: {paymentId}</span>
                  <button onClick={copyRef} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {copied ? <Check size={12} style={{ color: '#27AE60' }} /> : <Copy size={12} style={{ color: '#8b8b91' }} />}
                    <span style={{ ...inter, fontSize: 10, color: '#8b8b91' }}>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              )}

              <button onClick={handleStartCheck} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#6C35DE', color: '#ffffff', padding: '14px 32px', ...inter, fontSize: 15, fontWeight: 700, border: 'none', borderRadius: 4, cursor: 'pointer', transition: 'opacity 0.2s' }}>
                {user ? "Start Verifying Now" : "Sign In to Access Your Checks"} <ArrowRight size={18} />
              </button>

              {!user && (
                <p style={{ ...inter, fontSize: 13, color: '#8b8b91', marginTop: 12 }}>
                  Sign in with <strong style={{ color: '#ffffff' }}>{paidEmail || "the email you used at checkout"}</strong> to unlock your checks.
                </p>
              )}

              {emailMismatch && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 8, textAlign: 'left' }}>
                  <p style={{ ...inter, fontSize: 12, color: '#ff8a7a', lineHeight: 1.5 }}>
                    <strong>Heads up:</strong> You paid as <strong>{paidEmail}</strong> but you're signed in as <strong>{user?.email}</strong>. Sign out and sign in with the email you paid with to access your checks, or contact support to merge them.
                  </p>
                </div>
              )}

              {webhookDelayed && !emailMismatch && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: 8 }}>
                  <p style={{ ...inter, fontSize: 12, color: '#D97706', lineHeight: 1.5 }}>
                    <strong>Note:</strong> Your payment was confirmed, but the credits are taking a little longer to land. They'll appear within a few minutes — refresh your dashboard if needed.
                  </p>
                </div>
              )}
            </>
          )}

          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Shield size={14} style={{ color: '#8b8b91' }} />
            <span style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>Secured by 256-bit encryption</span>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/" style={{ ...inter, fontSize: 14, color: '#6C35DE', textDecoration: 'none' }}>Back to Home</Link>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
