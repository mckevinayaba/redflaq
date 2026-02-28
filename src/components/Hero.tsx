import { Button } from "@/components/ui/button";
import RedFlaqLogo from "@/components/RedFlaqLogo";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentModal } from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [actualRecordCount, setActualRecordCount] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real record count from database
  useEffect(() => {
    const fetchRecordCount = async () => {
      try {
        const { count, error } = await supabase
          .from('wanted_persons')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true);

        if (!error && count !== null) {
          setActualRecordCount(count);
        }
      } catch (err) {
        console.error('Error fetching record count:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecordCount();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div 
        className="absolute inset-0 z-0 animate-gradient"
        style={{
          background: "linear-gradient(180deg, #A78BFA 0%, #8B5CF6 50%, #7C3AED 100%)",
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
        {/* Setup A Startup Badge */}
        <div className="mb-4 opacity-0 animate-fade-in-down delay-600">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
            🏢 A Setup A Startup Initiative
          </span>
        </div>

        {/* Logo - Fade in from top */}
        <div className="mb-14 opacity-0 animate-fade-in-down delay-800">
          <RedFlaqLogo size="lg" />
        </div>

        {/* Main Headline - Updated copy */}
        <div className="mb-8 space-y-2">
          <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-[56px] leading-[1.2] text-white text-balance tracking-tight"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <span className="block opacity-0 animate-fade-in-left delay-1000">
              Trust Should Never Be a Gamble
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 opacity-0 animate-fade-in-left delay-1200 mt-6 font-body">
            RedFlaq helps you identify verified legal risk signals before trust is given. 
            Make informed decisions with instant access to public records, warrants, and court cases.
          </p>
        </div>

        {/* Value Props */}
        <div className="mb-8 opacity-0 animate-fade-in delay-1400">
          <div className="flex flex-wrap justify-center gap-4 text-white font-semibold">
            <span className="bg-white/10 px-4 py-2 rounded-full">✓ Fast - Results in under 60 seconds</span>
            <span className="bg-white/10 px-4 py-2 rounded-full">✓ Confidential - Searches are anonymous</span>
            <span className="bg-white/10 px-4 py-2 rounded-full">✓ Verified - Only public official records</span>
          </div>
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

        {/* Payment Trust Section */}
        <div className="mb-10 opacity-0 animate-fade-in delay-2000 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-white font-semibold mb-3">💳 PAYMENT OPTIONS</p>
          <div className="text-white/90 text-sm space-y-1">
            <p>✓ Bank Transfer (EFT)</p>
            <p>✓ Instant EFT (Zapper, SnapScan)</p>
            <p>✓ WhatsApp Payment</p>
          </div>
          <p className="text-white font-semibold mt-4 text-sm">💜 Fast verification - Get your search link within 5 minutes</p>
        </div>

        {/* WHITE CTA Button with Pulsing Glow */}
        <div className="mb-6 opacity-0 animate-fade-in-scale delay-2000">
          <Button 
            onClick={() => {
              console.log("CTA button clicked, opening modal");
              setIsPaymentModalOpen(true);
            }}
            size="lg"
            className="w-full max-w-[380px] h-[80px] bg-white hover:bg-white/95 text-primary font-body font-bold text-[22px] rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 animate-pulse-glow"
          >
            💜 Check Risk Signals Now - R50
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

        {/* Real Stats - Honest numbers */}
        <div className="mb-16 opacity-0 animate-fade-in delay-2500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white">
                {isLoading ? "..." : actualRecordCount}
              </p>
              <p className="text-xs text-white/80">Active Legal Records</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white">&lt;60 sec</p>
              <p className="text-xs text-white/80">Average Search Time</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white">100%</p>
              <p className="text-xs text-white/80">Public Record Sources</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-2xl md:text-3xl font-bold text-white">POPIA</p>
              <p className="text-xs text-white/80">Compliant</p>
            </div>
          </div>
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
