import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const handleCTAClick = () => {
    console.log("CTA clicked");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-28 px-8"
      style={{
        background: "linear-gradient(180deg, #8B5CF6 0%, #7C3AED 100%)"
      }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Animated Red Divider */}
        <div 
          className={`h-1 bg-[#8B5CF6] mx-auto mb-10 ${isVisible ? 'animate-expand-width' : 'w-0'}`}
          style={{
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.8)"
          }}
        />

        {/* Section Title with Glow */}
        <h2 
          className={`font-heading font-bold text-3xl md:text-[42px] text-center text-white mb-14 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ textShadow: "0 0 20px rgba(201, 60, 60, 0.5)" }}
        >
          THE TRUTH ABOUT DATING IN SOUTH AFRICA
        </h2>

        {/* Large Stat Callout - White Card */}
        <div 
          className={`bg-white border-l-8 border-[#8B5CF6] p-8 md:p-10 mb-10 rounded-lg ${isVisible ? 'animate-slide-in-right delay-200' : 'opacity-0'}`}
          style={{
            boxShadow: "0 20px 60px rgba(139, 92, 246, 0.25)"
          }}
        >
          <div className="border-l-8 border-[#8B5CF6] animate-pulse-border absolute left-0 top-0 bottom-0" />
          <h3 className="font-heading font-bold text-2xl md:text-4xl mb-4 leading-tight"
            style={{ color: "#6D28D9" }}>
            Every 4 Hours, A South African Woman Is Murdered By Her Partner.
          </h3>
          <p className="font-body text-base md:text-lg leading-relaxed"
            style={{ color: "#8B5CF6" }}>
            That's 6 women. Every single day. Most of them never knew about his past.
          </p>
        </div>

        {/* Opening Paragraphs */}
        <p className={`font-body text-lg text-white leading-[1.8] mb-6 ${isVisible ? 'animate-fade-in delay-400' : 'opacity-0'}`}>
          You met him on Tinder. He seems perfect. Great smile. Good job. Says all the right things.
        </p>

        <p className={`font-body text-lg text-white leading-[1.8] mb-10 ${isVisible ? 'animate-fade-in delay-600' : 'opacity-0'}`}>
          You're planning your first date. Maybe coffee. Maybe dinner. You're excited. A little nervous. But mostly... you trust him.
        </p>

        {/* Red Bullets with Sequential Fade */}
        <div className="space-y-4 mb-10">
          {[
            "She didn't know he had 3 domestic violence convictions.",
            "She didn't know he violated 2 protection orders from previous partners.",
            "She didn't know he spent 5 years in prison for assault.",
            "She didn't know he was released just 6 months ago."
          ].map((text, index) => (
            <p 
              key={index}
              className={`font-body text-lg text-white font-medium flex items-start gap-3 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${0.8 + index * 0.2}s` }}
            >
              <span className="flex-shrink-0 hover:animate-scale-pulse transition-transform cursor-default">💜</span>
              <span>{text}</span>
            </p>
          ))}
        </div>

        {/* Sub-heading */}
        <h3 className={`font-heading font-bold text-2xl md:text-[28px] text-white mt-10 mb-5 ${isVisible ? 'animate-slide-up delay-1500' : 'opacity-0'}`}>
          Because checking criminal records in South Africa was:
        </h3>

        {/* Bullet List */}
        <ul className="space-y-3 mb-10">
          {[
            { label: "EXPENSIVE", text: "(Traditional checks are expensive and built for companies)" },
            { label: "COMPLICATED", text: "(Requires fingerprints, police station visits, paperwork)" },
            { label: "SLOW", text: "(Takes 4 days to 3 weeks for results)" },
            { label: "INCOMPLETE", text: "(Sex offender registry is locked to the public)" },
            { label: "IMPOSSIBLE", text: "for regular women" }
          ].map((item, index) => (
            <li 
              key={index}
              className={`font-body text-lg text-white leading-[1.8] flex items-start gap-3 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${1.8 + index * 0.1}s` }}
            >
              <span className="text-[#8B5CF6] flex-shrink-0">•</span>
              <span><strong>{item.label}</strong> {item.text}</span>
            </li>
          ))}
        </ul>

        {/* Frosted Glass Scenario Box */}
        <div 
          className={`p-8 md:p-10 rounded-2xl mb-8 ${isVisible ? 'animate-slide-up delay-2000' : 'opacity-0'}`}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
          }}
        >
          <h4 className="font-heading font-bold text-xl md:text-2xl mb-4"
            style={{ color: "#6D28D9" }}>
            Here's What's Happening Right Now:
          </h4>
          <p className="font-body text-base md:text-lg leading-[1.8] mb-4"
            style={{ color: "#8B5CF6" }}>
            Right now, there's a man in your DMs. Maybe you've been talking for days. Maybe weeks. He's charming. Compliments you. Asks about your day.
          </p>
          <p className="font-body text-base md:text-lg leading-[1.8] mb-4"
            style={{ color: "#8B5CF6" }}>
            You've already planned where you'll meet. You've told yourself "He seems nice."
          </p>
          <p className="font-body text-base md:text-lg leading-[1.8]"
            style={{ color: "#8B5CF6" }}>
            But you haven't checked his record. Because you didn't know you could. Because it was too expensive. Too complicated. Too hard.
          </p>
        </div>

        {/* Emphasis Text */}
        <p className={`font-body text-lg md:text-xl font-bold text-white text-center mb-6 ${isVisible ? 'animate-fade-in delay-2000' : 'opacity-0'}`}>
          And by the time you find out... It might be too late.
        </p>

        {/* "Until now" with Glowing Animation */}
        <p className={`font-heading font-bold text-3xl md:text-[32px] text-white text-center mt-14 mb-8 animate-glow-white animate-scale-pulse ${isVisible ? 'animate-fade-in delay-2000' : 'opacity-0'}`}>
          Until now.
        </p>

        {/* CTA Button */}
        <div className={`flex justify-center ${isVisible ? 'animate-fade-in-scale delay-2000' : 'opacity-0'}`}>
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="w-full max-w-[380px] h-[80px] bg-white hover:bg-white/95 text-[#8B5CF6] font-body font-bold text-[22px] rounded-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 animate-pulse-glow"
          >
            💜 Check His Criminal Record - R50
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
