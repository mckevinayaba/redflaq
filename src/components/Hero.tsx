import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  const handleCTAClick = () => {
    // Payment modal will be implemented later
    console.log("CTA clicked");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #FFFFFF 100%)"
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1200px] px-8 md:px-10 py-20 text-center animate-fade-in-up">
        {/* Logo */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary inline-flex items-center gap-2">
            <span className="text-primary">🔴</span>
            <span className="text-primary">REDFLAQ</span>
          </h2>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading font-black text-4xl md:text-5xl lg:text-[56px] leading-[1.2] text-white mb-8 text-balance tracking-tight">
          15,247 South African Women Checked<br />
          Their Date's Criminal Record<br />
          Before Meeting Him.
          <br /><br />
          <span className="text-white">You Can Too.</span><br />
          <span className="text-white">In Under 60 Seconds.</span>
        </h1>

        {/* Star Rating */}
        <div className="mb-4">
          <p className="text-lg md:text-xl text-accent font-body">
            ⭐⭐⭐⭐⭐ Rated 4.9/5 by 847 Women
          </p>
        </div>

        {/* Testimonial Quote */}
        <div className="mb-10">
          <p className="text-base md:text-lg text-white/80 italic font-body">
            "RedFlaq saved my life" - Thandi M., Johannesburg
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-6">
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="w-full max-w-[340px] h-[70px] bg-primary hover:bg-brand-red-dark text-white font-body font-bold text-xl rounded-lg transition-all duration-300 hover:scale-105 shadow-[0_8px_20px_rgba(220,38,38,0.3)]"
          >
            🔴 Check His Record Now - R50
          </Button>
        </div>

        {/* Used By Text */}
        <div className="mb-8">
          <p className="text-sm md:text-base text-white/60 font-body">
            Used By Women In: Johannesburg • Cape Town • Durban • Pretoria
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mb-16">
          <p className="text-sm md:text-base text-white/80 font-body">
            15,247+ Searches • 2,847 Records • 100% Confidential
          </p>
        </div>

        {/* Scroll Down Arrow */}
        <div className="animate-bounce-slow">
          <div className="flex flex-col items-center gap-2">
            <ChevronDown className="w-8 h-8 text-accent" />
            <p className="text-xs md:text-sm text-accent font-body font-semibold tracking-wide">
              SCROLL TO DISCOVER WHY 15,247 WOMEN TRUST REDFLAQ
            </p>
            <ChevronDown className="w-8 h-8 text-accent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
