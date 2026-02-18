import { useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type PackageType = "single" | "3-pack" | "5-pack";

const PricingPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("3-pack");
  const { ref, isVisible } = useScrollReveal();

  const plans = [
    {
      id: "single" as PackageType, label: "One Safety Check", title: "One Safety Check",
      sub: "Best for one‑off peace of mind", price: "R149", period: "ONCE OFF · NO SUBSCRIPTION",
      features: ["1 detailed safety report", "Uses South African public records", "Downloadable PDF report", "Results shown instantly"],
      cta: "Get 1 Check", highlight: false,
    },
    {
      id: "3-pack" as PackageType, label: "Safety Pack", title: "Safety Pack (3 Checks)",
      sub: "Ideal for dating or flat‑sharing", price: "R299", period: "R100 PER CHECK",
      savings: "SAVE R148 vs individual checks",
      features: ["3 public‑record safety reports", "Use over 90 days", "Downloadable PDFs for each search", "Results shown instantly"],
      cta: "Get 3 Checks", highlight: true,
    },
    {
      id: "5-pack" as PackageType, label: "Family & Friends", title: "Family & Friends (5 Checks)",
      sub: "Best for family and close circle", price: "R499", period: "R100 PER CHECK",
      savings: "SAVE R246 vs individual checks",
      features: ["5 public‑record safety reports", "Use over 6 months", "Downloadable PDFs for each search", "Results shown instantly"],
      cta: "Get 5 Checks", highlight: false,
    },
  ];

  const handleOpenPayment = (packageType: PackageType) => {
    setSelectedPackage(packageType);
    setIsPaymentModalOpen(true);
  };

  const trustBadges = ["EFT and Card Payment", "POPIA‑Aware", "Instant Results", "No Hidden Fees"];

  return (
    <>
      <section id="pricing" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '120px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>Pricing</div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(40px, 4vw, 56px)', color: '#2D2235', lineHeight: 1.1, maxWidth: 600, marginBottom: 16,
          }}>
            Choose your safety plan
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, color: '#78716C', maxWidth: 560, lineHeight: 1.6, marginBottom: 64 }}>
            Each safety check uses South African public‑record warning lists to highlight possible red flags. It does not provide a full SAPS criminal record.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: '#E8E4DF' }}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className="transition-colors"
                style={{
                  background: plan.highlight ? '#7C3AED' : 'white',
                  padding: '48px 40px',
                }}
              >
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#9CA3AF' }}>
                  {plan.label}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: plan.highlight ? 'white' : '#2D2235', margin: '8px 0' }}>{plan.title}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#78716C', marginBottom: 24 }}>{plan.sub}</div>

                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, color: plan.highlight ? 'white' : '#2D2235', lineHeight: 1 }}>{plan.price}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.6)' : '#9CA3AF', marginTop: 4, marginBottom: plan.savings ? 12 : 24 }}>
                  {plan.period}
                </div>

                {plan.savings && (
                  <span style={{
                    display: 'inline-block', background: plan.highlight ? 'rgba(255,255,255,0.15)' : '#F0FDF4', color: plan.highlight ? 'white' : '#16A34A',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '4px 10px', marginBottom: 24,
                  }}>
                    {plan.savings}
                  </span>
                )}

                <div className="space-y-0">
                  {plan.features.map(f => (
                    <div key={f} style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 14,
                      color: plan.highlight ? 'rgba(255,255,255,0.85)' : '#4B4453',
                      borderBottom: '1px solid ' + (plan.highlight ? 'rgba(255,255,255,0.15)' : '#E8E4DF'),
                      padding: '10px 0', display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ color: plan.highlight ? 'white' : '#7C3AED' }}>✓</span> {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleOpenPayment(plan.id)}
                  style={{
                    width: '100%', marginTop: 24, padding: 16,
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    border: plan.highlight ? '2px solid white' : '2px solid #7C3AED',
                    background: plan.highlight ? 'white' : 'transparent',
                    color: plan.highlight ? '#7C3AED' : '#7C3AED',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  className={plan.highlight ? 'hover:!bg-[rgba(255,255,255,0.9)]' : 'hover:!bg-[#7C3AED] hover:!text-white'}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-8 mt-10">
            {trustBadges.map(badge => (
              <span key={badge} className="flex items-center gap-2" style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                <span style={{ width: 16, height: 16, background: '#EDE9FE', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#7C3AED' }}>✓</span>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType={selectedPackage} />
    </>
  );
};

export default PricingPlinq;
