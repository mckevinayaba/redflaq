import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";

const Hero = () => {
  const [statsCount, setStatsCount] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Counter animation for stats
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setStatsCount(prev => {
          if (prev >= 15247) {
            clearInterval(interval);
            return 15247;
          }
          return prev + Math.ceil((15247 - prev) / 20);
        });
      }, 30);
      return () => clearInterval(interval);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 z-0 animate-gradient"
        style={{
          background: "linear-gradient(180deg, #D35D5A 0%, #C9504D 50%, #B84542 100%)",
          backgroundSize: "200% 200%"
        }}
      />
      
      {/* Floating Particles */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            width: Math.random() * 6 + 4 + 'px',
            height: Math.random() * 6 + 4 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.2 + 0.1,
            animation: `float ${Math.random() * 20 + 20}s ease-in-out infinite`,
            animationDelay: Math.random() * 5 + 's'
          }}
        />
      ))}
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1000px] px-8 md:px-10 py-20 text-center">
        {/* Logo - Fade in from top */}
        <div className="mb-14 opacity-0 animate-fade-in-down delay-800">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white inline-flex items-center gap-2">
            <span>🔴</span>
            <span>REDFLAQ</span>
          </h2>
        </div>

        {/* Main Headline - Slide in from left with stagger */}
        <div className="mb-8 space-y-2">
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-[56px] leading-[1.2] text-white text-balance tracking-tight"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <span className="block opacity-0 animate-fade-in-left delay-1000">
              {statsCount.toLocaleString()} South African Women Checked
            </span>
            <span className="block opacity-0 animate-fade-in-left delay-1200">
              Their Date's Criminal Record
            </span>
            <span className="block opacity-0 animate-fade-in-left delay-1200">
              Before Meeting Him.
            </span>
            <span className="block mt-6 opacity-0 animate-fade-in-left delay-1200">
              You Can Too.
            </span>
            <span className="block opacity-0 animate-fade-in-left delay-1200">
              In Under 60 Seconds.
            </span>
          </h1>
        </div>

        {/* Star Rating - Scale in */}
        <div className="mb-4 opacity-0 animate-fade-in-scale delay-1500">
          <p className="text-lg md:text-xl text-white font-body">
            <span className="text-[#FCD34D]">⭐⭐⭐⭐⭐</span> Rated 4.9/5 by 847 Women
          </p>
        </div>

        {/* Testimonial Quote - Fade in */}
        <div className="mb-10 opacity-0 animate-fade-in delay-1800">
          <p className="text-base md:text-lg text-white/90 italic font-body">
            "RedFlaq saved my life" - Thandi M., Johannesburg
          </p>
        </div>

        {/* WHITE CTA Button with Pulsing Glow */}
        <div className="mb-6 opacity-0 animate-fade-in-scale delay-2000">
          <Button 
            onClick={() => setIsPaymentModalOpen(true)}
            size="lg"
            className="w-full max-w-[380px] h-[80px] bg-white hover:bg-white/95 text-primary font-body font-bold text-[22px] rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 animate-pulse-glow"
          >
            🔴 Check His Record Now - R50
          </Button>
        </div>
        
        <PaymentModal 
          isOpen={isPaymentModalOpen} 
          onClose={() => setIsPaymentModalOpen(false)}
          packageType="single"
        />

        {/* Used By Text */}
        <div className="mb-8 opacity-0 animate-fade-in delay-2500">
          <p className="text-sm md:text-base text-white/80 font-body">
            Used By Women In: Johannesburg • Cape Town • Durban • Pretoria
          </p>
        </div>

        {/* Trust Indicators - Animated counter */}
        <div className="mb-16 opacity-0 animate-count-up delay-2500">
          <p className="text-sm md:text-base text-white/90 font-body">
            {statsCount.toLocaleString()}+ Searches • 2,847 Records • 100% Confidential
          </p>
        </div>

        {/* Scroll Down Arrow */}
        <div className="animate-bounce-slow opacity-0 animate-fade-in delay-2500">
          <div className="flex flex-col items-center gap-2">
            <ChevronDown className="w-8 h-8 text-white/80" />
            <p className="text-xs md:text-sm text-white/80 font-body font-semibold tracking-wide">
              SCROLL DOWN
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
