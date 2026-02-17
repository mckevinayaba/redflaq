import { useState } from "react";
import { Check } from "lucide-react";
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
              South Africa's First Instant Verification Platform
            </div>

            {/* Headline */}
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(52px, 5vw, 76px)', lineHeight: 1.05,
              color: '#0D0B0E', marginTop: 32, marginBottom: 24,
            }}>
              Trusting relationships<br />begin with<br />
              <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>information.</em>
            </h1>

            {/* Subheadline */}
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 400,
              lineHeight: 1.6, color: '#4B4453', maxWidth: 480, marginBottom: 16,
            }}>
              With a full name and ID number, verify someone's criminal record before you trust them with your life.
            </p>

            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: '#4B4453', marginBottom: 32 }}>
              <strong>Not in weeks. In minutes. Not for thousands. For R99.</strong>
            </p>

            {/* Value props */}
            <div className="flex flex-wrap gap-4" style={{ marginBottom: 32 }}>
              {["Results in 2 to 5 minutes", "100% Confidential searches", "POPIA Compliant"].map(item => (
                <div key={item} className="flex items-center gap-2" style={{ fontSize: 16, color: '#4B4453' }}>
                  <Check className="h-5 w-5" style={{ color: '#7C3AED' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button onClick={() => setIsPaymentModalOpen(true)} className="hover:!bg-[#7C3AED] hover:!border-[#7C3AED] transition-colors" style={{
                background: '#0D0B0E', color: '#F7F4F0', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                border: '2px solid #0D0B0E', cursor: 'pointer',
              }}>
                Verify Someone Now — R99
              </button>
              <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="hover:!bg-[#0D0B0E] hover:!text-[#F7F4F0] transition-colors" style={{
                background: 'transparent', color: '#0D0B0E', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                border: '2px solid #0D0B0E', cursor: 'pointer',
              }}>
                See How It Works
              </button>
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-3" style={{ marginTop: 48 }}>
              <div style={{ width: 40, height: 1, background: '#9CA3AF' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF', letterSpacing: '0.05em' }}>
                POPIA COMPLIANT · GOVERNMENT SOURCES ONLY · 100% CONFIDENTIAL
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ background: '#0D0B0E', position: 'relative', overflow: 'hidden' }}>
            {/* Photo collage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '24px 24px 0', height: 320 }}>
              <div style={{ gridRow: '1', overflow: 'hidden' }}>
                <img src="https://images.unsplash.com/photo-1589156280159-27a852cc18c4?w=600&q=80" alt="South African woman" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 8 }}>
                <div style={{ overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=400&q=80" alt="Professional woman" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=400&q=80" alt="Confident woman" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }} />
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid #7C3AED', padding: 24 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#DDD6FE' }}>SOUTH AFRICAN REALITY</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: 'white', lineHeight: 1, margin: '8px 0' }}>1 in 3</div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Women have experienced lifetime physical violence from an intimate partner.
                </p>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                  SOURCE: STATS SA · DSTI 2024 GENDER REPORT
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: 24 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#DDD6FE' }}>PUBLIC DATABASE ACCESS</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: 'white', lineHeight: 1, margin: '8px 0' }}>R99</div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                  Instant access to verified public criminal records from government sources.
                </p>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>
                  SAPS · SAFLII · GOVERNMENT GAZETTE
                </div>
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
