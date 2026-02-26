import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: '48px 40px' }}>
          <CheckCircle2 size={56} style={{ color: '#16A34A', margin: '0 auto 24px' }} />

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 12 }}>
            Payment Confirmed!
          </h1>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.6, marginBottom: 8 }}>
            Your credits are ready. You can now run your safety check.
          </p>

          {paymentId && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF', marginBottom: 32 }}>
              Reference: {paymentId}
            </p>
          )}

          {sessionId && !paymentId && (
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF', marginBottom: 32 }}>
              Session: {sessionId.slice(0, 20)}…
            </p>
          )}

          <Link
            to="/dashboard/new-check"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#7C3AED', color: 'white', padding: '14px 32px',
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
              textDecoration: 'none', borderRadius: 4,
            }}
            className="hover:!bg-[#6D28D9] transition-colors"
          >
            Start Your Safety Check <ArrowRight size={18} />
          </Link>

          <div style={{ marginTop: 24 }}>
            <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#7C3AED' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
