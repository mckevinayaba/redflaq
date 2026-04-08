import { useState } from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft, Shield } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

export default function PaymentCancelled() {
  const [retryOpen, setRetryOpen] = useState(false);

  const inter = { fontFamily: "'Inter', sans-serif" };

  return (
    <div style={{ background: '#08080f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8, padding: '48px 40px' }}>
          <XCircle size={56} style={{ color: '#C0392B', margin: '0 auto 24px' }} />

          <h1 style={{ ...inter, fontSize: 28, fontWeight: 900, color: '#ffffff', marginBottom: 12, letterSpacing: '-0.025em' }}>
            No payment was taken
          </h1>

          <p style={{ ...inter, fontSize: 15, color: '#8b8b91', lineHeight: 1.6, marginBottom: 32 }}>
            No worries — you weren't charged. You can try again whenever you're ready.
          </p>

          <button
            onClick={() => setRetryOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#6C35DE', color: '#ffffff', padding: '14px 32px',
              ...inter, fontSize: 15, fontWeight: 700,
              border: 'none', borderRadius: 4, cursor: 'pointer',
            }}
          >
            <Shield size={18} /> Try Again
          </button>

          <div style={{ marginTop: 16 }}>
            <Link to="/pricing" style={{ ...inter, fontSize: 14, color: '#6C35DE', textDecoration: 'none' }}>
              View pricing options
            </Link>
          </div>

          <div style={{ marginTop: 24 }}>
            <Link to="/" style={{ ...inter, fontSize: 14, color: '#8b8b91', textDecoration: 'none' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <PaymentModal isOpen={retryOpen} onClose={() => setRetryOpen(false)} packageType="single" />
    </div>
  );
}
