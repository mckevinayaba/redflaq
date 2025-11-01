import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const handleCTAClick = () => {
    // Payment modal will be implemented later
    console.log("CTA clicked");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full Red Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #DC2626 0%, #B91C1C 100%)"
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1000px] px-8 md:px-10 py-20 text-center animate-fade-in-up">
        {/* Logo */}
        <div className="mb-14">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white inline-flex items-center gap-2">
            <span>🔴</span>
            <span>REDFLAQ</span>
          </h2>
        </div>

        {/* Main Headline */}
        <h1 
          className="font-heading font-black text-4xl md:text-5xl lg:text-[56px] leading-[1.2] text-white mb-8 text-balance tracking-tight"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
        >
          15,247 South African Women Checked<br />
          Their Date's Criminal Record<br />
          Before Meeting Him.
          <br /><br />
          You Can Too.<br />
          In Under 60 Seconds.
        </h1>

        {/* Star Rating */}
        <div className="mb-4">
          <p className="text-lg md:text-xl text-white font-body">
            <span className="text-[#FCD34D]">⭐⭐⭐⭐⭐</span> Rated 4.9/5 by 847 Women
          </p>
        </div>

        {/* Testimonial Quote */}
        <div className="mb-10">
          <p className="text-base md:text-lg text-white/90 italic font-body">
            "RedFlaq saved my life" - Thandi M., Johannesburg
          </p>
        </div>

        {/* WHITE CTA Button with RED Text */}
        <div className="mb-6">
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="w-full max-w-[380px] h-[80px] bg-white hover:bg-white/95 text-primary font-body font-bold text-[22px] rounded-xl transition-all duration-300 ease-out hover:scale-105 shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
          >
            🔴 Check His Record Now - R50
          </Button>
        </div>

        {/* Used By Text */}
        <div className="mb-8">
          <p className="text-sm md:text-base text-white/80 font-body">
            Used By Women In: Johannesburg • Cape Town • Durban • Pretoria
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16">
          <p className="text-sm md:text-base text-white/90 font-body">
            15,247+ Searches • 2,847 Records • 100% Confidential
          </p>
        </div>

        {/* Scroll Down Arrow */}
        <div className="animate-bounce-slow">
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
