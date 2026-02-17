import { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTAPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { ref, isVisible } = useScrollReveal();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{
        background: '#F7F4F0', borderTop: '1.5px solid #0D0B0E',
        padding: '120px 60px', textAlign: 'center', overflow: 'hidden', position: 'relative',
      }}>
        {/* Watermark */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          fontFamily: "'DM Serif Display', serif", fontSize: 200,
          color: '#EDE9E3', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap',
        }}>VERIFY</div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 1.1, color: '#0D0B0E', marginBottom: 24,
          }}>
            Before you trust,<br />
            <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>verify.</em>
          </h2>

          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 18, color: '#4B4453',
            lineHeight: 1.7, marginBottom: 48,
          }}>
            Clarity creates safety. Transparency builds trust. Every search you make helps protect not just yourself but the next person who asks the same question.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => setIsPaymentModalOpen(true)} className="btn-primary">
              Verify Someone Now — R99
            </button>
            <button onClick={() => scrollToSection('#how-it-works')} className="btn-secondary">
              See How It Works
            </button>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType="single" />
    </>
  );
};

export default FinalCTAPlinq;
