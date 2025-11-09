import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, Shield } from "lucide-react";

const SolutionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const steps = [
    {
      number: "1",
      title: "Enter His Name + ID Number",
      description: "Just his basic info. Takes 15 seconds.",
      icon: "📝"
    },
    {
      number: "2",
      title: "Pay R50 (Instant & Secure)",
      description: "One-time payment. All major cards accepted.",
      icon: "💳"
    },
    {
      number: "3",
      title: "Get Full Report in 60 Seconds",
      description: "Criminal record, court cases, protection orders.",
      icon: "📋"
    }
  ];

  const riskLevels = [
    {
      level: "HIGH RISK",
      color: "#FEE2E2",
      border: "#DC2626",
      icon: <AlertTriangle className="w-8 h-8" style={{ color: "#C93C3C" }} />,
      description: "Multiple convictions, violent history, active warrants"
    },
    {
      level: "MODERATE RISK",
      color: "#FFF7ED",
      border: "#8B5CF6",
      icon: <AlertTriangle className="w-8 h-8" style={{ color: "#8B5CF6" }} />,
      description: "Past convictions, protection orders, suspicious patterns"
    },
    {
      level: "LOW RISK",
      color: "#FEF3C7",
      border: "#F59E0B",
      icon: <Clock className="w-8 h-8" style={{ color: "#F59E0B" }} />,
      description: "Minor offenses, no violence, old records"
    },
    {
      level: "CLEAR",
      color: "#D1FAE5",
      border: "#059669",
      icon: <CheckCircle2 className="w-8 h-8" style={{ color: "#059669" }} />,
      description: "No criminal record found in our database"
    }
  ];

  const features = [
    "✅ Criminal convictions (all courts)",
    "✅ Domestic violence cases",
    "✅ Protection orders (active & violated)",
    "✅ Sexual offense allegations",
    "✅ Assault & battery charges",
    "✅ Fraud & theft convictions",
    "✅ Court case history (10 years)",
    "✅ Warrant status",
    "✅ 100% confidential search"
  ];

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-28 px-8 relative overflow-hidden"
      style={{
        backgroundColor: "#8B5CF6",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
      }}
    >
      <div className="max-w-[1100px] mx-auto">
        {/* INTRODUCING Badge */}
        <div className={`flex justify-center mb-8 ${isVisible ? 'animate-slide-in-down' : 'opacity-0'}`}>
          <div
            className="bg-white px-6 py-2 rounded-full font-heading font-bold text-primary text-sm tracking-wide hover:rotate-2 transition-transform duration-300 cursor-default"
            style={{ boxShadow: "0 8px 20px rgba(153,61,59,0.25)" }}
          >
            INTRODUCING
          </div>
        </div>

        {/* Main Heading - Animated Word by Word */}
        <div className="text-center mb-16">
          <h2 className="font-heading font-black text-white text-4xl md:text-5xl lg:text-[52px] leading-tight mb-4">
            <span className={`inline-block ${isVisible ? 'animate-slide-in-left delay-200' : 'opacity-0'}`}>
              RedFlaq
            </span>{" "}
            <span className={`inline-block ${isVisible ? 'animate-slide-in-right delay-400' : 'opacity-0'}`}>
              Background
            </span>{" "}
            <span className={`inline-block ${isVisible ? 'animate-slide-up delay-600' : 'opacity-0'}`}>
              Check
            </span>
            <span className={`inline-block ml-1 ${isVisible ? 'animate-fade-in-scale delay-800' : 'opacity-0'}`}>
              ™
            </span>
          </h2>
          <p className={`font-body text-lg md:text-xl text-white/90 max-w-[700px] mx-auto ${isVisible ? 'animate-fade-in delay-1000' : 'opacity-0'}`}>
            The first affordable, instant criminal record check designed specifically for South African women.
          </p>
        </div>

        {/* HOW IT WORKS - 3 Step Cards */}
        <div className="mb-20">
          <h3 className={`font-heading font-bold text-3xl text-white text-center mb-12 ${isVisible ? 'animate-slide-up delay-1000' : 'opacity-0'}`}>
            How It Works (Under 60 Seconds)
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-20 left-[33%] w-[34%] h-0.5 bg-white/30">
              <div 
                className={`h-full bg-white ${isVisible ? 'animate-expand-line' : 'w-0'}`}
                style={{ animationDelay: '1.5s', animationDuration: '1s' }}
              />
            </div>
            <div className="hidden md:block absolute top-20 right-[0%] w-[34%] h-0.5 bg-white/30">
              <div 
                className={`h-full bg-white ${isVisible ? 'animate-expand-line' : 'w-0'}`}
                style={{ animationDelay: '1.8s', animationDuration: '1s' }}
              />
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 hover:-translate-y-3 transition-all duration-300 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{
                  boxShadow: "0 20px 50px rgba(153,61,59,0.25)",
                  animationDelay: `${1.2 + index * 0.3}s`
                }}
              >
                {/* Number Badge */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-full bg-primary flex items-center justify-center font-heading font-black text-white text-2xl"
                    style={{ boxShadow: "0 4px 15px rgba(201,80,77,0.4)" }}
                  >
                    {step.number}
                  </div>
                </div>
                
                {/* Icon */}
                <div className="text-5xl text-center mb-4">{step.icon}</div>
                
                {/* Title */}
                <h4 className="font-heading font-bold text-xl text-[#6D28D9] text-center mb-3">
                  {step.title}
                </h4>
                
                {/* Description */}
                <p className="font-body text-base text-[#8B5CF6] text-center">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RISK LEVEL CARDS */}
        <div className="mb-20">
          <h3 className={`font-heading font-bold text-3xl text-white text-center mb-12 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            What Your Report Reveals
          </h3>
          
          <div className="overflow-x-auto pb-4 -mx-8 px-8">
            <div className="flex md:grid md:grid-cols-4 gap-6 min-w-max md:min-w-0">
              {riskLevels.map((risk, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[280px] md:w-auto rounded-2xl p-6 border-4 hover:scale-105 hover:shadow-2xl transition-all duration-300 ${isVisible ? 'animate-flip-in' : 'opacity-0'}`}
                  style={{
                    backgroundColor: risk.color,
                    borderColor: risk.border,
                    boxShadow: `0 10px 30px ${risk.border}40`,
                    animationDelay: `${2 + index * 0.2}s`
                  }}
                >
                  <div className="flex justify-center mb-4 animate-scale-pulse" style={{ animationDuration: '2s' }}>
                    {risk.icon}
                  </div>
                  <h4 className="font-heading font-bold text-lg text-center mb-3" style={{ color: risk.border }}>
                    {risk.level}
                  </h4>
                  <p className="font-body text-sm text-center" style={{ color: "#6D28D9" }}>
                    {risk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WHAT YOU GET - Feature List */}
        <div className={`bg-white rounded-2xl p-8 md:p-10 max-w-[700px] mx-auto ${isVisible ? 'animate-slide-up delay-2000' : 'opacity-0'}`}
          style={{ boxShadow: "0 20px 60px rgba(153,61,59,0.25)" }}>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Shield className="w-10 h-10 text-primary" />
            <h3 className="font-heading font-bold text-3xl text-[#6D28D9] text-center">
              What You Get
            </h3>
          </div>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`font-body text-lg text-[#8B5CF6] hover:bg-[#F5F3FF] p-3 rounded-lg transition-all duration-200 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: `${2.2 + index * 0.1}s` }}
              >
                {feature}
              </div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 border-t-2 border-[#E8C5C4]">
            <p className="font-heading font-bold text-2xl text-center text-primary mb-4">
              All This. Just R50.
            </p>
            <Button
              size="lg"
              className="w-full h-[70px] bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-body font-bold text-xl rounded-xl transition-all duration-300 ease-out hover:scale-105 animate-pulse-glow"
            >
              💜 Get Your Report Now - R50
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
