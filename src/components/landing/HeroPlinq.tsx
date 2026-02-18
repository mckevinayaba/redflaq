import { useState } from "react";
import { Check, Shield, Heart, Eye } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const HeroPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <>
      <section className="relative min-h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg, #FAF5FF 0%, #F7F4F0 60%)' }}>
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* LEFT COLUMN */}
          <div style={{ padding: '140px 60px 80px' }}>
            {/* Badge */}
            <div style={{
              border: '1px solid #7C3AED', padding: '6px 12px',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED',
            }}>
              <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#7C3AED', display: 'inline-block' }} />
              South Africa's Instant Public‑Record Safety Check
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(52px, 5vw, 76px)', lineHeight: 1.05,
              color: '#2D2235', marginTop: 32, marginBottom: 24,
            }}>
              Trusting relationships<br />begin with<br />
              <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>information.</em>
            </h1>

            {/* Subheadline */}
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 400,
              lineHeight: 1.6, color: '#4B4453', maxWidth: 480, marginBottom: 16,
            }}>
              With a full name and province, RedFlaq scans South African public‑record warning lists so you can spot serious red flags before you let someone into your life or business.
            </p>

            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', marginBottom: 32, maxWidth: 480 }}>
              Not a full criminal record check. A fast public‑record safety check with detailed, downloadable reports.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap gap-4" style={{ marginBottom: 32 }}>
              {["Results in minutes", "Public records only", "100% Confidential", "POPIA‑aware use"].map(item => (
                <div key={item} className="flex items-center gap-2" style={{ fontSize: 16, color: '#4B4453' }}>
                  <Check className="h-5 w-5" style={{ color: '#7C3AED' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setIsPaymentModalOpen(true)} className="hover:opacity-90 transition-opacity" style={{
                background: '#7C3AED', color: '#FFFFFF', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                border: '2px solid #7C3AED', cursor: 'pointer',
              }}>
                Verify Someone Now — R149
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:!bg-[#7C3AED] hover:!text-white hover:!border-[#7C3AED] transition-colors" style={{
                background: 'transparent', color: '#7C3AED', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                border: '2px solid #7C3AED', cursor: 'pointer',
              }}>
                See How It Works
              </button>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-3" style={{ marginTop: 48 }}>
              <div style={{ width: 40, height: 1, background: '#9CA3AF' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF', letterSpacing: '0.05em' }}>
                FOR YOUR PROTECTION · NOT FOR HARASSMENT OR REVENGE · POPIA‑AWARE
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN — Abstract icons instead of photos */}
          <div style={{ background: '#FAF5FF', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 48 }}>
            {/* Abstract icon grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Shield className="h-12 w-12" style={{ color: '#7C3AED' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>PROTECTION</span>
              </div>
              <div style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Heart className="h-12 w-12" style={{ color: '#7C3AED' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>SAFETY</span>
              </div>
              <div style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Eye className="h-12 w-12" style={{ color: '#7C3AED' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>AWARENESS</span>
              </div>
              <div style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <Check className="h-12 w-12" style={{ color: '#7C3AED' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>VERIFICATION</span>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: 24 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>SOUTH AFRICAN REALITY</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: '#2D2235', lineHeight: 1, margin: '8px 0' }}>1 in 3</div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.5 }}>
                  Women have experienced lifetime physical violence from an intimate partner.
                </p>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 8 }}>
                  SOURCE: STATS SA · DSTI 2024 GENDER REPORT
                </div>
              </div>

              <div style={{ background: '#7C3AED', padding: 24 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>PUBLIC‑RECORD SAFETY CHECK</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: 'white', lineHeight: 1, margin: '8px 0' }}>R149</div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                  Scan public SAPS wanted and SA sanctions lists. Not a full criminal record check.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType="single" />
    </>
  );
};

export default HeroPlinq;
