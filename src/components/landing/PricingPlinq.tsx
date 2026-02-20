import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type PackageType = "single" | "3-pack" | "5-pack";

const PricingPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("3-pack");
  const { ref, isVisible } = useScrollReveal();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: "single" as PackageType, label: "One Safety Check", title: "One Safety Check",
      sub: "Best for one‑off peace of mind", price: "R99", period: "ONCE OFF",
      validity: "Valid for 30 days",
      features: ["1 detailed safety report", "Uses South African public records", "Downloadable PDF report", "Results shown instantly"],
      cta: "Get 1 Check", highlight: false, badge: null,
    },
    {
      id: "3-pack" as PackageType, label: "Safety Pack", title: "Safety Pack (3 Checks)",
      sub: "Ideal for dating or flat‑sharing", price: "R249", period: "R83 PER CHECK",
      savings: "SAVE R48", validity: "Valid for 90 days",
      features: ["3 public‑record safety reports", "Use over 90 days", "Downloadable PDFs", "Results shown instantly"],
      cta: "Get 3 Checks", highlight: true, badge: "MOST POPULAR",
    },
    {
      id: "5-pack" as PackageType, label: "Family & Friends", title: "Family & Friends (5 Checks)",
      sub: "Share with trusted people", price: "R399", period: "R80 PER CHECK",
      savings: "SAVE R96", validity: "Valid for 6 months",
      shareNote: "Transfer unused checks to family or friends via your account",
      features: ["5 public‑record safety reports", "Use over 6 months", "Downloadable PDFs", "Share with trusted people"],
      cta: "Get 5 Checks", highlight: false, badge: null,
    },
  ];

  const handleOpenPayment = (packageType: PackageType) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }
    setSelectedPackage(packageType);
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <section id="pricing" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '48px 40px 56px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>Pricing</div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4vw, 52px)', color: '#2D2235', lineHeight: 1.1, maxWidth: 500, marginBottom: 16,
          }}>
            Choose your <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>safety plan</em>
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', maxWidth: 520, lineHeight: 1.6, marginBottom: 16 }}>
            Traditional checks are expensive, slow and built for companies, not for women or communities trying to stay safe. RedFlaq makes it R99 and under a minute.
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#9CA3AF', maxWidth: 520, lineHeight: 1.5, marginBottom: 56 }}>
            Each safety check uses South African public‑record warning lists to highlight possible red flags. It does not provide a full SAPS criminal record.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: '#E8E4DF' }}>
            {plans.map(plan => (
              <div key={plan.id} style={{ background: plan.highlight ? '#7C3AED' : 'white', padding: '48px 36px', position: 'relative' }}>
                {/* Badge */}
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-50%)',
                    background: '#F59E0B', color: '#FFFFFF', fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', padding: '5px 16px',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#9CA3AF' }}>
                  {plan.label}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: plan.highlight ? 'white' : '#2D2235', margin: '8px 0' }}>{plan.title}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#78716C', marginBottom: 24 }}>{plan.sub}</div>

                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: plan.highlight ? 'white' : '#2D2235', lineHeight: 1 }}>{plan.price}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.5)' : '#9CA3AF', marginTop: 4 }}>
                  {plan.period}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#78716C', marginTop: 4, marginBottom: plan.savings ? 12 : 24 }}>
                  {plan.validity}
                </div>

                {plan.savings && (
                  <span style={{
                    display: 'inline-block', background: plan.highlight ? 'rgba(255,255,255,0.15)' : '#F0FDF4', color: plan.highlight ? 'white' : '#16A34A',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '4px 10px', marginBottom: 24,
                  }}>
                    {plan.savings}
                  </span>
                )}

                <div className="space-y-0">
                  {plan.features.map(f => (
                    <div key={f} style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 13,
                      color: plan.highlight ? 'rgba(255,255,255,0.85)' : '#4B4453',
                      borderBottom: '1px solid ' + (plan.highlight ? 'rgba(255,255,255,0.12)' : '#EDE9FE'),
                      padding: '10px 0', display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ color: plan.highlight ? 'white' : '#7C3AED' }}>✓</span> {f}
                    </div>
                  ))}
                </div>

                {/* Share note for Family plan */}
                {'shareNote' in plan && plan.shareNote && (
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#9CA3AF', marginTop: 8, lineHeight: 1.5 }}>
                    {plan.shareNote}
                  </p>
                )}

                <button
                  onClick={() => handleOpenPayment(plan.id)}
                  style={{
                    width: '100%', marginTop: 24, padding: 14,
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                    border: plan.highlight ? '2px solid white' : '2px solid #7C3AED',
                    background: plan.highlight ? 'white' : 'transparent',
                    color: '#7C3AED', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  className={plan.highlight ? 'hover:!bg-[rgba(255,255,255,0.9)]' : 'hover:!bg-[#7C3AED] hover:!text-white'}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* No subscription line */}
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453', textAlign: 'center', marginTop: 24 }}>
            No subscription. No recurring charges. Pay once, use when you need it.
          </p>

          {/* Paystack badge placeholder */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF',
              border: '1px solid #E8E4DF', padding: '8px 16px', background: 'white',
            }}>
              🔒 Secure Checkout · Paystack (Coming Soon)
            </span>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType={selectedPackage} />
    </>
  );
};

export default PricingPlinq;
