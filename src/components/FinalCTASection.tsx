import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Lock, CheckCircle2 } from "lucide-react";

const FinalCTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCTAClick = () => {
    console.log("Final CTA clicked");
  };

  const guarantees = [
    { icon: Shield, text: "Money-Back Guarantee" },
    { icon: Clock, text: "Results in 60 Seconds" },
    { icon: Lock, text: "100% Anonymous" },
    { icon: CheckCircle2, text: "Legal & Secure" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 px-8 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #E8C5C4 0%, #F2E3E2 100%)"
      }}
    >
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: Math.random() * 8 + 4 + 'px',
            height: Math.random() * 8 + 4 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            backgroundColor: '#C9504D',
            opacity: Math.random() * 0.2 + 0.1,
            animation: `float ${Math.random() * 20 + 20}s ease-in-out infinite`,
            animationDelay: Math.random() * 5 + 's'
          }}
        />
      ))}

      <div className="max-w-[1000px] mx-auto text-center relative z-10">
        {/* Main Headline */}
        <div className={`mb-12 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="font-heading font-black text-4xl md:text-5xl lg:text-[56px] leading-[1.1] mb-6" style={{ color: '#993D3B' }}>
            <span className="block">Don't Meet Him</span>
            <span className="block">Until You Know</span>
            <span className="block">Who He Really Is.</span>
          </h2>
        </div>

        {/* Subheading */}
        <div className={`mb-10 ${isVisible ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
          <p className="font-body text-xl md:text-2xl leading-relaxed max-w-[700px] mx-auto" style={{ color: '#A94442' }}>
            15,247 South African women have already checked their date's criminal record.
            <br />
            <strong style={{ color: '#993D3B' }}>You're 60 seconds away from peace of mind.</strong>
          </p>
        </div>

        {/* Large CTA Button */}
        <div className={`mb-12 ${isVisible ? 'animate-fade-in-scale delay-400' : 'opacity-0'}`}>
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="w-full max-w-[420px] h-[90px] bg-white hover:bg-white/95 font-body font-bold text-[24px] rounded-2xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-2 animate-pulse-glow"
            style={{ 
              color: '#C9504D',
              boxShadow: '0 20px 60px rgba(153,61,59,0.3)'
            }}
          >
            🔴 Check His Record Now - R50
          </Button>
        </div>

        {/* Guarantees Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 ${isVisible ? 'animate-fade-in delay-600' : 'opacity-0'}`}>
          {guarantees.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 hover:-translate-y-2 transition-all duration-300"
              style={{ 
                boxShadow: '0 10px 30px rgba(153,61,59,0.15)',
                border: '2px solid #E8C5C4'
              }}
            >
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E8C5C4' }}
              >
                <item.icon className="w-7 h-7" style={{ color: '#C9504D' }} />
              </div>
              <p className="font-body font-bold text-sm md:text-base text-center" style={{ color: '#993D3B' }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Urgency Message */}
        <div className={`bg-white rounded-2xl p-8 md:p-10 max-w-[700px] mx-auto ${isVisible ? 'animate-fade-in delay-800' : 'opacity-0'}`}
          style={{ 
            boxShadow: '0 20px 60px rgba(153,61,59,0.25)',
            border: '3px solid #C9504D'
          }}
        >
          <p className="font-heading font-bold text-2xl md:text-3xl mb-4" style={{ color: '#C9504D' }}>
            ⚠️ Don't Wait Until It's Too Late
          </p>
          <p className="font-body text-lg leading-relaxed" style={{ color: '#A94442' }}>
            Every day you wait is another day you're taking a risk. In the time it takes you to read this, 
            you could have already checked his record and made an informed decision about your safety. 
            <br /><br />
            <strong style={{ color: '#993D3B' }}>
              The best time to check was before your first date. The second best time is right now.
            </strong>
          </p>
        </div>

        {/* Final Stats */}
        <div className={`mt-16 ${isVisible ? 'animate-fade-in delay-1000' : 'opacity-0'}`}>
          <p className="font-body text-base text-center" style={{ color: '#A94442' }}>
            <strong style={{ color: '#993D3B' }}>Trusted by 15,247+ women</strong> across South Africa
            <br />
            ⭐⭐⭐⭐⭐ Rated 4.9/5 by 847 verified users
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
