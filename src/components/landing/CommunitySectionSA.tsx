import { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CommunitySectionSA = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { ref, isVisible } = useScrollReveal();

  return (
    <>
      <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#0D0B0E', padding: '80px 60px', overflow: 'hidden' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* LEFT */}
          <div>
            <div className="section-tag" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
              Built For Women. Available To All.
            </div>

            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(32px, 3.5vw, 48px)', color: 'white',
              lineHeight: 1.15, marginBottom: 24,
            }}>
              Before you give him a spare key, give yourself{" "}
              <em style={{ fontStyle: 'italic', color: '#DDD6FE' }}>clarity.</em>
            </h2>

            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 16,
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 32,
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

          {/* RIGHT - photo grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '220px 220px', gap: 8, height: 440 }}>
            <div className="group" style={{ gridRow: '1 / 3', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1589156280159-27a852cc18c4?w=600&q=80" alt="South African woman"
                className="transition-all duration-400 group-hover:grayscale-0 group-hover:brightness-100"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) brightness(0.8)' }} />
            </div>
            <div className="group" style={{ overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80" alt="Woman"
                className="transition-all duration-400 group-hover:grayscale-0 group-hover:brightness-100"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) brightness(0.8)' }} />
            </div>
            <div className="group" style={{ overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1611432579699-484f7990b127?w=400&q=80" alt="Professional woman"
                className="transition-all duration-400 group-hover:grayscale-0 group-hover:brightness-100"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%) brightness(0.8)' }} />
            </div>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType="single" />
    </>
  );
};

export default CommunitySectionSA;
