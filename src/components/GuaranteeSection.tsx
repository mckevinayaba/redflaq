import { useEffect, useRef, useState } from "react";
import { Shield, Lock, Zap, RefreshCw } from "lucide-react";

const GuaranteeSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20
    });
  };

  const guarantees = [
    {
      number: "01",
      title: "Money-Back Guarantee",
      description: "If you don't receive your report within 5 minutes, we'll refund 100% of your money. No questions asked. No hassle. Instant refund to your card.",
      icon: RefreshCw,
      direction: "left",
      border: "#059669"
    },
    {
      number: "02",
      title: "100% Legal & Compliant",
      description: "We only access public records that you have the legal right to view. Fully compliant with POPIA (Protection of Personal Information Act) and South African law.",
      icon: Lock,
      direction: "right",
      border: "#059669"
    },
    {
      number: "03",
      title: "Instant Results - Every Time",
      description: "Our system scans millions of records in under 60 seconds. No waiting days or weeks. You'll get your PDF report via email within 1 minute of payment confirmation.",
      icon: Zap,
      direction: "bottom",
      border: "#059669"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 px-8 overflow-hidden"
      style={{
        backgroundColor: "#8B5CF6"
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Shield Icon - Large and Animated */}
        <div className="flex justify-center mb-16">
          <div 
            className={`relative ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}
            style={{
              transform: `rotate(${mousePos.x * 0.5}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <div 
              className="absolute inset-0 blur-2xl"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                animation: 'pulse 3s ease-in-out infinite'
              }}
            />
            <Shield 
              className="w-32 h-32 md:w-40 md:h-40 text-white relative z-10"
              strokeWidth={1.5}
              style={{
                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                animation: 'heartbeat 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>

        {/* Heading */}
        <div className={`text-center mb-20 ${isVisible ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-white mb-6">
            Our Iron-Clad Guarantees
          </h2>
          <p className="font-body text-xl md:text-2xl text-white/90 max-w-[700px] mx-auto">
            We stand behind every search. Your safety and satisfaction are our #1 priority.
          </p>
        </div>

        {/* Guarantee Cards */}
        <div className="space-y-8">
          {guarantees.map((guarantee, index) => (
            <div
              key={index}
              className={`relative ${isVisible ? `animate-slide-in-${guarantee.direction}` : 'opacity-0'}`}
              style={{
                animationDelay: `${0.4 + index * 0.2}s`,
                transform: `translate(${mousePos.x * (index - 1) * 0.3}px, ${mousePos.y * (index - 1) * 0.3}px)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <div 
                className="bg-white rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start hover:-translate-y-2 transition-all duration-300"
                style={{
                  borderLeft: `6px solid ${guarantee.border}`,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                }}
              >
                {/* Number Badge */}
                <div 
                  className="relative flex-shrink-0"
                  style={{
                    transform: 'translateZ(20px)',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center relative group cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
                      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'rotate(360deg) scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
                    }}
                  >
                    <span className="font-heading font-black text-3xl md:text-4xl text-white">
                      {guarantee.number}
                    </span>
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.5), transparent)',
                        animation: 'spin 2s linear infinite'
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <guarantee.icon className="w-8 h-8" style={{ color: guarantee.border }} />
                    <h3 className="font-heading font-bold text-2xl md:text-3xl" style={{ color: '#7F1D1D' }}>
                      {guarantee.title}
                    </h3>
                  </div>
                  <p className="font-body text-lg leading-relaxed" style={{ color: '#991B1B' }}>
                    {guarantee.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Statement */}
        <div className={`mt-20 text-center ${isVisible ? 'animate-fade-in delay-1200' : 'opacity-0'}`}>
          <div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10 max-w-4xl mx-auto"
            style={{
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
          >
            <p className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
              ✓ 15,247 Successful Searches
            </p>
            <p className="font-body text-lg text-white/90">
              Not a single complaint. Not a single failed search. Not a single unsatisfied customer.
              <br />
              <strong className="text-white">That's our track record. That's our guarantee.</strong>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05); }
          50% { transform: scale(1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default GuaranteeSection;
