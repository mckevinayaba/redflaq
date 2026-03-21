import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, Lock } from "lucide-react";

type PackageType = "single" | "3-pack" | "5-pack";

const PricingPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("single");
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
      <section id="pricing" ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`} style={{ background: '#F5F0EB' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: '#6B4EFF', marginBottom: 16 }}>Pricing</div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4vw, 52px)', color: '#1A1523', lineHeight: 1.08, maxWidth: 500, marginBottom: 16, letterSpacing: '-0.02em',
          }}>
            Choose your <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>safety plan</em>
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#6B7280', maxWidth: 520, lineHeight: 1.7, marginBottom: 16 }}>
            Traditional checks are expensive, slow and built for companies, not for women or communities trying to stay safe. RedFlaq makes it R99 and under a minute.
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#9CA3AF', maxWidth: 520, lineHeight: 1.5, marginBottom: 56 }}>
            Each safety check uses South African public‑record warning lists to highlight possible red flags. It does not provide a full SAPS criminal record.
          </p>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch reveal-stagger ${isVisible ? 'visible' : ''}`}>
            {plans.map(plan => {
              const bg = plan.highlight
                ? '#E9E3FF'
                : '#FFFFFF';
              const textColor = '#1F1F1F';
              const mutedColor = '#888888';

              return (
                <div
                  key={plan.id}
                  className={`reveal-child ${plan.highlight ? 'pricing-glow' : 'card-lift'}`}
                  style={{
                    background: bg,
                    padding: '48px 32px',
                    position: 'relative',
                    borderRadius: 20,
                    border: plan.highlight
                      ? '1.5px solid #6B4EFF40'
                      : '1px solid #E6E0DA',
                    boxShadow: plan.highlight
                      ? '0 8px 48px rgba(107,78,255,0.1)'
                      : '0 2px 8px rgba(0,0,0,0.05)',
                    transform: plan.highlight ? 'scale(1.03)' : 'none',
                    zIndex: plan.highlight ? 2 : 1,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    if (!plan.highlight) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,78,255,0.1)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!plan.highlight) {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    }
                  }}
                >
                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                      background: '#F59E0B', color: '#FFFFFF', fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', padding: '6px 18px',
                      borderRadius: 50,
                    }}>
                      {plan.badge}
                    </div>
                  )}

                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: mutedColor }}>
                    {plan.label}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: textColor, margin: '8px 0' }}>{plan.title}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: mutedColor, marginBottom: 24 }}>{plan.sub}</div>

                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: textColor, lineHeight: 1 }}>{plan.price}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: mutedColor, marginTop: 4 }}>{plan.period}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: mutedColor, marginTop: 4, marginBottom: plan.savings ? 12 : 24 }}>{plan.validity}</div>

                  {plan.savings && (
                    <span style={{
                      display: 'inline-block', background: 'rgba(22,163,106,0.08)', color: '#16A34A',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '4px 12px', borderRadius: 6, marginBottom: 24,
                    }}>
                      {plan.savings}
                    </span>
                  )}

                  <div className="space-y-0">
                    {plan.features.map(f => (
                      <div key={f} style={{
                        fontFamily: "'Syne', sans-serif", fontSize: 13,
                        color: '#555555',
                        borderBottom: '1px solid #E6E0DA',
                        padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <Check style={{ width: 14, height: 14, color: '#6B4EFF', flexShrink: 0 }} /> {f}
                      </div>
                    ))}
                  </div>

                  {'shareNote' in plan && plan.shareNote && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: mutedColor, marginTop: 8, lineHeight: 1.5 }}>
                      {plan.shareNote}
                    </p>
                  )}

                  <button
                    onClick={() => handleOpenPayment(plan.id)}
                    className="btn-scale"
                    style={{
                      width: '100%', marginTop: 28, padding: 16,
                      fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                      border: 'none',
                      background: '#6B4EFF',
                      color: '#FFFFFF',
                      cursor: 'pointer', transition: 'all 0.25s ease',
                      borderRadius: 50,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#5539E8';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#6B4EFF';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap justify-center gap-4" style={{ marginTop: 40 }}>
            {["No subscription", "No recurring charges", "Pay once, use when needed"].map(text => (
              <span key={text} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555',
                background: '#FFFFFF', border: '1px solid #E6E0DA',
                padding: '8px 16px', borderRadius: 50,
              }}>
                <Check style={{ width: 13, height: 13, color: '#6B4EFF' }} /> {text}
              </span>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF',
            }}>
              <Lock style={{ width: 13, height: 13 }} /> Secure Checkout
            </span>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType={selectedPackage} />
    </>
  );
};

export default PricingPlinq;
