import { useState } from "react";
import { Shield, Heart, Users } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CommunitySectionSA = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { ref, isVisible } = useScrollReveal();

  return (
    <>
      <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#FAF5FF', padding: '80px 60px', overflow: 'hidden' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* LEFT */}
          <div>
            <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 24 }}>
              Built For Women. Available To All.
            </div>

            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#2D2235',
              lineHeight: 1.15, marginBottom: 24,
            }}>
              Before you give him a spare key, give yourself{" "}
              <em style={{ fontStyle: 'italic', color: '#7C3AED' }}>clarity.</em>
            </h2>

            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 16,
              color: '#78716C', lineHeight: 1.8, marginBottom: 32,
            }}>
              RedFlaq was created in response to South Africa's GBV crisis.
              Women adopt this platform first because the cost of uncertainty is highest for them.
              Every search you do helps protect not just yourself but the next woman who asks the same question.
            </p>

            <button onClick={() => setIsPaymentModalOpen(true)} style={{
              background: '#7C3AED', color: 'white', padding: '16px 32px',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, border: 'none', cursor: 'pointer',
            }} className="hover:!bg-[#6D28D9] transition-colors">
              Protect Yourself Now — R149
            </button>
          </div>

          {/* RIGHT - Abstract icons grid instead of photos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '200px 200px', gap: 16, height: 416 }}>
            <div style={{ gridRow: '1 / 3', background: 'white', border: '1.5px solid #EDE9FE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <Shield className="h-20 w-20" style={{ color: '#7C3AED' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>PROTECT</span>
            </div>
            <div style={{ background: 'white', border: '1.5px solid #EDE9FE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Heart className="h-12 w-12" style={{ color: '#7C3AED' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>CARE</span>
            </div>
            <div style={{ background: 'white', border: '1.5px solid #EDE9FE', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Users className="h-12 w-12" style={{ color: '#7C3AED' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>COMMUNITY</span>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType="single" />
    </>
  );
};

export default CommunitySectionSA;
