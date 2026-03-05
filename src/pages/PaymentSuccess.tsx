import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const paymentId = searchParams.get("payment_id");
  const emailParam = searchParams.get("email");

  const [creditsReady, setCreditsReady] = useState(false);
  const pollCountRef = useRef(0);
  const maxPolls = 20; // 20 × 3s = 60s max wait

  const email = user?.email || emailParam;

  useEffect(() => {
    if (creditsReady) return;

    const checkCredits = async () => {
      // Check purchases table by email
      if (email) {
        const { data: purchases } = await supabase
          .from("purchases")
          .select("credits_remaining")
          .eq("email", email)
          .eq("status", "completed")
          .gt("credits_remaining", 0)
          .limit(1);

        if (purchases && purchases.length > 0) {
          setCreditsReady(true);
          return;
        }
      }

      // Check manual_payments by payment_id (works without auth)
      if (paymentId) {
        const { data: mp } = await supabase
          .from("manual_payments")
          .select("status, search_credits, credits_used")
          .eq("payment_id", paymentId)
          .eq("status", "verified")
          .limit(1);

        if (mp && mp.some(p => (p.search_credits || 0) - (p.credits_used || 0) > 0)) {
          setCreditsReady(true);
          return;
        }
      }
    };

    // Initial check
    checkCredits();

    // Poll every 3 seconds
    const interval = setInterval(() => {
      pollCountRef.current += 1;
      if (pollCountRef.current >= maxPolls) {
        clearInterval(interval);
        // After 60s, let user through anyway
        setCreditsReady(true);
        return;
      }
      checkCredits();
    }, 3000);

    return () => clearInterval(interval);
  }, [creditsReady, email, paymentId]);

  const handleStartCheck = () => {
    sessionStorage.removeItem("pendingSearch");
    navigate("/dashboard/new-check");
  };

  return (
    <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: '48px 40px' }}>
          <CheckCircle2 size={56} style={{ color: '#16A34A', margin: '0 auto 24px' }} />

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 12 }}>
            Payment Confirmed!
          </h1>

          {!creditsReady ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                <Loader2 size={20} style={{ color: '#7C3AED', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.6, margin: 0 }}>
                  Activating your credits…
                </p>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>
                This usually takes a few seconds. Please don't close this page.
              </p>
            </>
          ) : (
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.6, marginBottom: 8 }}>
              Your credits are ready. You can now run your safety check.
            </p>
          )}

          {paymentId && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF', marginBottom: 32, marginTop: 16 }}>
              Reference: {paymentId}
            </p>
          )}

          <button
            onClick={handleStartCheck}
            disabled={!creditsReady}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: creditsReady ? '#7C3AED' : '#C4B5FD', color: 'white', padding: '14px 32px',
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
              border: 'none', borderRadius: 4, cursor: creditsReady ? 'pointer' : 'not-allowed',
              opacity: creditsReady ? 1 : 0.7,
              transition: 'all 0.2s',
            }}
          >
            {creditsReady ? (
              <>Start Your Safety Check <ArrowRight size={18} /></>
            ) : (
              <>Processing… <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /></>
            )}
          </button>

          <div style={{ marginTop: 24 }}>
            <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#7C3AED' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
