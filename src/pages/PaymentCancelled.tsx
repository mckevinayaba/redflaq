import { useState } from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft, Shield } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

export default function PaymentCancelled() {
  const [retryOpen, setRetryOpen] = useState(false);

  return (
    <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: '48px 40px' }}>
          <XCircle size={56} style={{ color: '#DC2626', margin: '0 auto 24px' }} />

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 12 }}>
            No payment was taken
          </h1>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.6, marginBottom: 32 }}>
            No worries — you weren't charged. You can try again whenever you're ready.
          </p>

          <button
            onClick={() => setRetryOpen(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#7C3AED', color: 'white', padding: '14px 32px',
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
              border: 'none', borderRadius: 4, cursor: 'pointer',
            }}
          >
            <Shield size={18} /> Try Again
          </button>

          <div style={{ marginTop: 16 }}>
            <Link to="/pricing" style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#7C3AED' }}>
              View pricing options
            </Link>
          </div>

          <div style={{ marginTop: 24 }}>
            <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C' }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      <PaymentModal isOpen={retryOpen} onClose={() => setRetryOpen(false)} selectedPackage="single" />
    </div>
  );
}
