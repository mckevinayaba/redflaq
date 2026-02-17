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
      id: "single" as PackageType, label: "Single Search", title: "Pay As You Go",
      sub: "For verifying one person", price: "R99", period: "ONCE OFF · NO SUBSCRIPTION",
      features: ["Complete criminal record check", "SAPS, courts, gazette search", "Human-verified result", "PDF report with source links", "Valid for 30 days"],
      cta: "Search Now", highlight: false,
    },
    {
      id: "3-pack" as PackageType, label: "3-Search Pack", title: "3-Search Pack",
      sub: "Share with family or use over time", price: "R249", period: "R83 PER SEARCH",
      savings: "SAVE R48 vs individual searches",
      features: ["3 complete criminal checks", "All search types included", "Human-verified results", "PDF reports with source links", "Valid for 90 days", "Share credits with family"],
      cta: "Get Started", highlight: true,
    },
    {
      id: "5-pack" as PackageType, label: "5-Search Pack", title: "5-Search Pack",
      sub: "Best value for ongoing safety", price: "R399", period: "R80 PER SEARCH",
      savings: "SAVE R96 vs individual searches",
      features: ["5 complete criminal checks", "All search types included", "Priority human verification", "PDF reports with source links", "Valid for 6 months"],
      cta: "Get Started", highlight: false,
    },
  ];

  const handleOpenPayment = (packageType: PackageType) => {
    setSelectedPackage(packageType);
    setIsPaymentModalOpen(true);
  };

  const trustBadges = ["EFT and Card Payment", "POPIA Compliant", "Results via Email", "Money-Back Guarantee", "No Hidden Fees"];

  return (
    <>
      <section id="pricing" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#0D0B0E', padding: '120px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Pricing</div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(40px, 4vw, 56px)', color: 'white', lineHeight: 1.1, maxWidth: 600, marginBottom: 16,
          }}>
            Transparent pricing. No hidden fees.
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 500, lineHeight: 1.6, marginBottom: 64 }}>
            The same background checks corporations use. Now accessible to every South African.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: 'rgba(255,255,255,0.08)' }}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className="transition-colors"
                style={{
                  background: plan.highlight ? '#7C3AED' : '#0D0B0E',
                  padding: '48px 40px',
                }}
              >
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }}>
                  {plan.label}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: 'white', margin: '8px 0' }}>{plan.title}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: plan.highlight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)', marginBottom: 24 }}>{plan.sub}</div>

                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, color: 'white', lineHeight: 1 }}>{plan.price}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: plan.highlight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)', marginTop: 4, marginBottom: plan.savings ? 12 : 24 }}>
                  {plan.period}
                </div>

                {plan.savings && (
                  <span style={{
                    display: 'inline-block', background: 'rgba(21,128,61,0.2)', color: '#86efac',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '4px 10px', marginBottom: 24,
                  }}>
                    {plan.savings}
                  </span>
                )}

                <div className="space-y-0">
                  {plan.features.map(f => (
                    <div key={f} style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 14,
                      color: plan.highlight ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)',
                      borderBottom: '1px solid ' + (plan.highlight ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)'),
                      padding: '10px 0', display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <span style={{ color: plan.highlight ? 'white' : '#DDD6FE' }}>✓</span> {f}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleOpenPayment(plan.id)}
                  style={{
                    width: '100%', marginTop: 24, padding: 16,
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    border: plan.highlight ? '2px solid white' : '2px solid rgba(255,255,255,0.3)',
                    background: plan.highlight ? 'white' : 'transparent',
                    color: plan.highlight ? '#7C3AED' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  className={plan.highlight ? 'hover:!bg-[rgba(255,255,255,0.9)]' : 'hover:!bg-white hover:!text-[#0D0B0E]'}
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
                color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                <span style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white' }}>✓</span>
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
