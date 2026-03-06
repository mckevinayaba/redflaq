import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2, Shield, Copy, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const paymentId = searchParams.get("payment_id");
  const pkg = resolvePackage(searchParams);
  const [showReady, setShowReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartCheck = () => {
    sessionStorage.removeItem("pendingSearch");
    if (!user) {
      navigate("/signup?redirect=/dashboard/new-check");
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

  return (
    <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: '48px 40px' }}>
          {!showReady ? (
            <>
              <Loader2 size={48} style={{ color: '#7C3AED', margin: '0 auto 20px', animation: 'spin 1s linear infinite' }} />
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#2D2235', marginBottom: 8 }}>Confirming your payment securely…</h1>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.6 }}>This takes just a moment.</p>
            </>
          ) : (
            <>
              <CheckCircle2 size={56} style={{ color: '#16A34A', margin: '0 auto 24px' }} />
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 12 }}>Payment Confirmed!</h1>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.6, marginBottom: 4 }}>Your checks are ready. You can start verifying immediately.</p>

              <div style={{ background: '#F3F0FF', border: '1px solid #DDD6FE', borderRadius: 8, padding: '16px 20px', margin: '24px 0', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>Package</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#2D2235' }}>{pkg.label}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>Checks Available</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#16A34A' }}>{pkg.credits}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>Amount Paid</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#2D2235' }}>R{pkg.price}.00</span>
                </div>
              </div>

              {paymentId && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF' }}>Reference: {paymentId}</span>
                  <button onClick={copyRef} style={{ background: 'none', border: '1px solid #D1D5DB', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {copied ? <Check size={12} style={{ color: '#16A34A' }} /> : <Copy size={12} style={{ color: '#9CA3AF' }} />}
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, color: '#9CA3AF' }}>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              )}

              <button onClick={handleStartCheck} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7C3AED', color: 'white', padding: '14px 32px', fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, border: 'none', borderRadius: 4, cursor: 'pointer', transition: 'all 0.2s' }}>
                {user ? "Start Verifying Now" : "Sign In to Access Your Checks"} <ArrowRight size={18} />
              </button>

              {!user && (
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C', marginTop: 12 }}>Sign in to access your purchased checks.</p>
              )}

              <div style={{ marginTop: 16, padding: '12px 16px', background: '#FEF3C7', borderRadius: 8 }}>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>
                  <strong>Note:</strong> Your payment was confirmed. If your checks haven't appeared yet, they'll be added within 30 seconds. Refresh your dashboard if needed.
                </p>
              </div>
            </>
          )}

          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Shield size={14} style={{ color: '#9CA3AF' }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#9CA3AF' }}>Secured by 256-bit encryption</span>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#7C3AED' }}>Back to Home</Link>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
