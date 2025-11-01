import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<"single" | "3-pack" | "5-pack">("single");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const pricingPlans = [
    {
      name: "Single Check",
      price: 50,
      description: "Perfect for checking one person",
      features: [
        "1 complete background check",
        "Full criminal record report",
        "Instant results (60 seconds)",
        "100% confidential search",
        "PDF report via email"
      ],
      popular: false,
      savings: null
    },
    {
      name: "3-Search Pack",
      price: 120,
      originalPrice: 150,
      description: "Most popular - Save R30",
      features: [
        "3 complete background checks",
        "Use anytime (no expiry)",
        "Full criminal record reports",
        "Priority processing",
        "PDF reports via email",
        "🎁 BONUS: Safety tips guide",
        "🎁 BONUS: Red flag checklist"
      ],
      popular: true,
      savings: 30
    },
    {
      name: "5-Search Pack",
      price: 180,
      originalPrice: 250,
      description: "Best value - Save R70",
      features: [
        "5 complete background checks",
        "Use anytime (no expiry)",
        "Full criminal record reports",
        "VIP priority processing",
        "PDF reports via email",
        "🎁 BONUS: Safety tips guide",
        "🎁 BONUS: Red flag checklist",
        "🎁 BONUS: Personal safety plan template"
      ],
      popular: false,
      savings: 70
    }
  ];

  const handlePurchase = (plan: string) => {
    if (plan === "Single Check") {
      setSelectedPackage("single");
    } else if (plan === "3-Search Pack") {
      setSelectedPackage("3-pack");
    } else if (plan === "5-Search Pack") {
      setSelectedPackage("5-pack");
    }
    setIsPaymentModalOpen(true);
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-28 px-8 relative overflow-hidden"
      style={{
        backgroundColor: "#993D3B",
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )
        `
      }}
    >
      {/* Animated scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)',
          animation: 'scanline 10s linear infinite'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className={`font-heading font-black text-4xl md:text-5xl lg:text-[56px] text-white mb-6 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            Choose Your Safety Plan
          </h2>
          <p className={`font-body text-xl md:text-2xl text-white/80 max-w-[700px] mx-auto ${isVisible ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
            One search could save your life. Three searches could save your friends too.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 perspective-1000">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: plan.popular ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div 
                  className={`absolute -top-6 left-1/2 -translate-x-1/2 z-20 ${isVisible ? 'animate-bounce-slow' : 'opacity-0'}`}
                  style={{ animationDelay: '0.8s' }}
                >
                  <div 
                    className="px-6 py-2 rounded-full flex items-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                      boxShadow: '0 10px 40px rgba(252, 211, 77, 0.4)'
                    }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="font-heading font-bold text-sm text-white">MOST POPULAR</span>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              {/* Pulsing spotlight for popular card */}
              {plan.popular && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(252, 211, 77, 0.2) 0%, transparent 70%)',
                    animation: 'pulse 3s ease-in-out infinite'
                  }}
                />
              )}

              {/* Card */}
              <div
                className={`relative bg-white rounded-3xl p-8 md:p-10 transition-all duration-500 ${
                  isVisible ? 'animate-flip-in' : 'opacity-0'
                } ${
                  hoveredCard === index ? 'shadow-2xl' : 'shadow-xl'
                }`}
                style={{
                  animationDelay: `${index * 0.3}s`,
                  border: plan.popular ? '3px solid #FCD34D' : '1px solid rgba(127, 29, 29, 0.1)',
                  boxShadow: plan.popular 
                    ? '0 30px 80px rgba(252, 211, 77, 0.3), 0 0 0 1px rgba(252, 211, 77, 0.5)' 
                    : '0 20px 60px rgba(0, 0, 0, 0.2)',
                  transform: hoveredCard === index 
                    ? 'translateY(-20px) translateZ(50px)' 
                    : hoveredCard !== null && hoveredCard !== index 
                    ? 'scale(0.95)' 
                    : 'translateY(0) translateZ(0)',
                  opacity: hoveredCard !== null && hoveredCard !== index ? 0.7 : 1,
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Plan Name */}
                <h3 className="font-heading font-bold text-2xl md:text-3xl mb-2" style={{ color: '#7F1D1D' }}>
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="font-body text-base mb-6" style={{ color: '#991B1B' }}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="font-heading text-2xl line-through"
                        style={{ color: '#DC2626', opacity: 0.5 }}
                      >
                        R{plan.originalPrice}
                      </span>
                      {plan.savings && (
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: '#059669' }}
                        >
                          SAVE R{plan.savings}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-black text-5xl md:text-6xl" style={{ 
                      color: '#DC2626',
                      transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                      display: 'inline-block'
                    }}>
                      R{plan.price}
                    </span>
                    {plan.name !== "Single Check" && (
                      <span className="font-body text-lg" style={{ color: '#991B1B' }}>
                        / {plan.name.includes("3") ? "3" : "5"} checks
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li 
                      key={fIndex}
                      className={`flex items-start gap-3 transition-all duration-300 ${
                        hoveredCard === index && feature.includes('🎁') ? 'translate-x-2' : 'translate-x-0'
                      }`}
                      style={{
                        backgroundColor: feature.includes('🎁') && hoveredCard === index 
                          ? 'rgba(252, 211, 77, 0.2)' 
                          : 'transparent',
                        padding: feature.includes('🎁') ? '8px' : '0',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {feature.includes('🎁') ? (
                        <span 
                          className="text-xl"
                          style={{
                            display: 'inline-block',
                            transform: hoveredCard === index ? 'rotate(360deg)' : 'rotate(0deg)',
                            transition: 'transform 0.6s ease'
                          }}
                        >
                          🎁
                        </span>
                      ) : (
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#059669' }} />
                      )}
                      <span className="font-body text-base" style={{ color: '#374151' }}>
                        {feature.replace('🎁 BONUS: ', '')}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => handlePurchase(plan.name)}
                  className={`w-full h-14 font-body font-bold text-lg rounded-xl transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white' 
                      : 'bg-white hover:bg-[#FEE2E2] text-[#DC2626] border-2 border-[#DC2626]'
                  }`}
                  style={{
                    boxShadow: hoveredCard === index 
                      ? `0 20px 40px ${plan.popular ? 'rgba(220, 38, 38, 0.5)' : 'rgba(220, 38, 38, 0.3)'}` 
                      : `0 8px 20px ${plan.popular ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)'}`,
                    transform: hoveredCard === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {plan.popular ? '🔴 Get This Pack Now' : 'Select This Plan'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Note */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-fade-in delay-1500' : 'opacity-0'}`}>
          <p className="font-body text-lg text-white/80 mb-4">
            💳 Secure payment via Stripe • 🔒 Bank-level encryption • ✅ Instant delivery
          </p>
          <p className="font-body text-base text-white/60">
            All plans include money-back guarantee if no report within 5 minutes
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100px); }
        }
        
        @keyframes flip-in {
          from {
            opacity: 0;
            transform: perspective(1000px) rotateY(90deg);
          }
          to {
            opacity: 1;
            transform: perspective(1000px) rotateY(0);
          }
        }
        
        .animate-flip-in {
          animation: flip-in 0.8s ease-out forwards;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        packageType={selectedPackage}
      />
    </section>
  );
};

export default PricingSection;
