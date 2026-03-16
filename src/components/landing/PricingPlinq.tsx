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
      sub: "Best for one-off peace of mind", price: "R99", period: "ONCE OFF",
      validity: "Valid for 30 days",
      features: ["1 detailed safety report", "Uses South African public records", "Downloadable PDF report", "Results shown instantly"],
      cta: "Get 1 Check", highlight: false, badge: null,
    },
    {
      id: "3-pack" as PackageType, label: "Safety Pack", title: "Safety Pack (3 Checks)",
      sub: "Ideal for dating or flat-sharing", price: "R249", period: "R83 PER CHECK",
      savings: "SAVE R48", validity: "Valid for 90 days",
      features: ["3 public-record safety reports", "Use over 90 days", "Downloadable PDFs", "Results shown instantly"],
      cta: "Get 3 Checks", highlight: true, badge: "MOST POPULAR",
    },
    {
      id: "5-pack" as PackageType, label: "Family & Friends", title: "Family & Friends (5 Checks)",
      sub: "Share with trusted people", price: "R399", period: "R80 PER CHECK",
      savings: "SAVE R96", validity: "Valid for 6 months",
      shareNote: "Transfer unused checks to family or friends via your account",
      features: ["5 public-record safety reports", "Use over 6 months", "Downloadable PDFs", "Share with trusted people"],
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
      <section id="pricing" ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E0DA' }}>
        <div className="py-16 md:py-24 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
            }}>Pricing</span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(28px, 4vw, 44px)', color: '#1F1F1F',
              marginTop: 12, letterSpacing: '-0.02em',
            }}>
              Choose your <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>safety plan</em>
            </h2>
          </div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', maxWidth: 520, margin: '0 auto 12px', lineHeight: 1.7, textAlign: 'center' }}>
            Traditional checks are expensive, slow and built for companies, not for women or communities trying to stay safe. RedFlaq makes it R99 and under a minute.
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888', maxWidth: 520, margin: '0 auto 56px', lineHeight: 1.5, textAlign: 'center' }}>
            Each safety check uses South African public-record warning lists to highlight possible red flags. It does not provide a full SAPS criminal record.
          </p>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch reveal-stagger ${isVisible ? 'visible' : ''}`} style={{ border: '1px solid #E6E0DA', borderRadius: 8, overflow: 'hidden' }}>
            {plans.map((plan, idx) => (
              <div
                key={plan.id}
                className="reveal-child"
                style={{
                  background: plan.highlight ? '#F8F5FF' : '#FFFFFF',
                  padding: '40px 28px',
                  position: 'relative',
                  borderRight: idx < plans.length - 1 ? '1px solid #E6E0DA' : 'none',
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    background: '#6B4EFF', color: '#FFFFFF',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    fontWeight: 700, letterSpacing: '0.12em',
                    padding: '6px 0', textAlign: 'center',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <div style={{ marginTop: plan.badge ? 20 : 0 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888' }}>
                    {plan.label}
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#1F1F1F', margin: '8px 0' }}>{plan.title}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#888888', marginBottom: 20 }}>{plan.sub}</div>

                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: '#1F1F1F', lineHeight: 1 }}>{plan.price}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#888888', marginTop: 4 }}>{plan.period}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888888', marginTop: 4, marginBottom: plan.savings ? 12 : 20 }}>{plan.validity}</div>

                  {plan.savings && (
                    <span style={{
                      display: 'inline-block', background: 'rgba(22,163,106,0.08)', color: '#16A34A',
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '4px 12px', borderRadius: 4, marginBottom: 20,
                    }}>
                      {plan.savings}
                    </span>
                  )}

                  <div>
                    {plan.features.map(f => (
                      <div key={f} style={{
                        fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555',
                        borderBottom: '1px solid #E6E0DA', padding: '10px 0',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <Check style={{ width: 14, height: 14, color: '#6B4EFF', flexShrink: 0 }} /> {f}
                      </div>
                    ))}
                  </div>

                  {'shareNote' in plan && plan.shareNote && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: '#888888', marginTop: 8, lineHeight: 1.5 }}>
                      {plan.shareNote}
                    </p>
                  )}

                  <button
                    onClick={() => handleOpenPayment(plan.id)}
                    style={{
                      width: '100%', marginTop: 24, padding: 14,
                      fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                      border: 'none', background: '#6B4EFF', color: '#FFFFFF',
                      cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#5539E8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#6B4EFF'; }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4" style={{ marginTop: 32 }}>
            {["No subscription", "No recurring charges", "Pay once, use when needed"].map(text => (
              <span key={text} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555',
                background: '#FAFAF8', border: '1px solid #E6E0DA',
                padding: '8px 14px', borderRadius: 4,
              }}>
                <Check style={{ width: 13, height: 13, color: '#6B4EFF' }} /> {text}
              </span>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#888888',
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
