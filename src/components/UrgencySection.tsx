import { useEffect, useRef, useState } from "react";
import { Clock, Users, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/PaymentModal";

const UrgencySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ minutes: 14, seconds: 59 });
  const [searchesLeft, setSearchesLeft] = useState(147);
  const [recentSearch, setRecentSearch] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  // Countdown timer
  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            return { minutes: 14, seconds: 59 }; // Reset
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: prev.minutes, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Searches left counter
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setSearchesLeft(prev => {
        const newVal = prev - Math.floor(Math.random() * 3) - 1;
        return newVal < 80 ? 147 : newVal;
      });
    }, Math.random() * 8000 + 12000);

    return () => clearInterval(interval);
  }, [isVisible]);

  // Recent search animation
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setRecentSearch(prev => prev + 1);
    }, Math.random() * 10000 + 15000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const handleUrgentCTA = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-24 md:py-32 px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #B84542 0%, #993D3B 100%)',
        animation: isVisible ? 'pulseOpacity 4s ease-in-out infinite' : 'none'
      }}
    >
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Pulsing Clock Icon */}
        <div className="flex justify-center mb-12">
          <div className={`relative ${isVisible ? 'animate-scale-pulse' : 'opacity-0'}`}>
            <div 
              className="absolute inset-0 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.5) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
            <Clock 
              className="w-24 h-24 md:w-32 md:h-32 text-white relative z-10"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(239, 68, 68, 0.8))',
                animation: 'spin 3s linear infinite'
              }}
            />
          </div>
        </div>

        {/* Main Headline */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="font-heading font-black text-4xl md:text-5xl lg:text-[56px] text-white mb-6 leading-tight">
            <span className="block">Limited Availability</span>
            <span className="block" style={{ 
              textShadow: '0 0 40px rgba(239, 68, 68, 0.8)',
              animation: 'pulseGlow 2s ease-in-out infinite'
            }}>
              Act Now Before It's Too Late
            </span>
          </h2>
          <p className="font-body text-xl md:text-2xl text-white/90 max-w-[700px] mx-auto">
            Our system can only process a limited number of searches per day.
            <br />
            <strong className="text-white">Don't miss your window.</strong>
          </p>
        </div>

        {/* Countdown Timer */}
        <div 
          className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 ${isVisible ? 'animate-fade-in delay-400' : 'opacity-0'}`}
          style={{
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="text-center mb-8">
            <p className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
              🔴 This Offer Expires In:
            </p>
            <p className="font-body text-base text-white/80">
              Pricing returns to R300 after timer ends
            </p>
          </div>

          {/* Timer Display */}
          <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
            {/* Minutes */}
            <div className="relative">
              <div 
                className="bg-white rounded-2xl p-6 md:p-8"
                style={{
                  boxShadow: '0 20px 60px rgba(220, 38, 38, 0.4), inset 0 0 60px rgba(220, 38, 38, 0.2)'
                }}
              >
                <div 
                  className="font-heading font-black text-5xl md:text-7xl text-center"
                  style={{ 
                    color: '#DC2626',
                    textShadow: '0 0 30px rgba(220, 38, 38, 0.5)',
                    transform: timeLeft.minutes !== Math.floor(timeLeft.minutes) ? 'rotateX(90deg)' : 'rotateX(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
              </div>
              <p className="font-body text-sm text-white/80 text-center mt-3">MINUTES</p>
            </div>

            {/* Colon */}
            <div className="font-heading font-black text-5xl md:text-7xl text-white animate-pulse">:</div>

            {/* Seconds */}
            <div className="relative">
              <div 
                className="bg-white rounded-2xl p-6 md:p-8"
                style={{
                  boxShadow: '0 20px 60px rgba(220, 38, 38, 0.4), inset 0 0 60px rgba(220, 38, 38, 0.2)'
                }}
              >
                <div 
                  className="font-heading font-black text-5xl md:text-7xl text-center"
                  style={{ 
                    color: '#DC2626',
                    textShadow: '0 0 30px rgba(220, 38, 38, 0.5)',
                    animation: 'flipDigit 0.6s ease-in-out'
                  }}
                  key={timeLeft.seconds}
                >
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
              <p className="font-body text-sm text-white/80 text-center mt-3">SECONDS</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="font-body text-sm text-white/80">
                <TrendingDown className="w-4 h-4 inline mr-2" />
                Searches Remaining Today
              </span>
              <span 
                className={`font-heading font-bold text-lg ${searchesLeft < 100 ? 'text-yellow-400 animate-pulse' : 'text-white'}`}
                style={{
                  animation: searchesLeft < 100 ? 'shake 0.5s ease-in-out' : 'none'
                }}
                key={searchesLeft}
              >
                {searchesLeft} left
              </span>
            </div>
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(searchesLeft / 147) * 100}%`,
                  background: searchesLeft < 100 
                    ? 'linear-gradient(90deg, #F59E0B 0%, #DC2626 100%)' 
                    : 'linear-gradient(90deg, #DC2626 0%, #EF4444 100%)',
                  boxShadow: '0 0 20px rgba(220, 38, 38, 0.6)',
                  animation: searchesLeft < 100 ? 'pulse 1.5s ease-in-out infinite' : 'none'
                }}
              />
            </div>
          </div>

          {/* Live Activity */}
          {recentSearch > 0 && (
            <div 
              className="bg-white/10 rounded-xl p-4 animate-slide-in-right"
              style={{ borderLeft: '4px solid #FCD34D' }}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-yellow-400 animate-pulse" />
                <p className="font-body text-sm text-white">
                  <strong>Someone in Johannesburg</strong> just completed a search • <span className="text-white/80">2 min ago</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Urgent CTA */}
        <div className={`text-center ${isVisible ? 'animate-fade-in-scale delay-800' : 'opacity-0'}`}>
          <Button
            onClick={handleUrgentCTA}
            size="lg"
            className="w-full max-w-[500px] h-[90px] bg-white hover:bg-white/95 font-body font-bold text-[24px] rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              color: '#DC2626',
              boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7)',
              animation: 'ripplePulse 2s ease-in-out infinite'
            }}
          >
            🔴 Secure My Spot - Check Now
          </Button>
          <p className="font-body text-base text-white/80 mt-6">
            ⚡ Instant access • 🔒 100% secure • ✅ Money-back guarantee
          </p>
        </div>

        {/* Capacity Alert */}
        <div className={`mt-12 ${isVisible ? 'animate-fade-in delay-1000' : 'opacity-0'}`}>
          <div 
            className="bg-red-900/50 backdrop-blur-sm rounded-2xl p-6 text-center"
            style={{
              border: '2px solid rgba(252, 211, 77, 0.5)',
              boxShadow: '0 10px 40px rgba(220, 38, 38, 0.3)'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <span 
                className="inline-block px-4 py-1 rounded-full font-heading font-bold text-sm animate-pulse"
                style={{ backgroundColor: '#FCD34D', color: '#7F1D1D' }}
              >
                LIMITED CAPACITY
              </span>
            </div>
            <p className="font-body text-lg text-white">
              System capacity: <strong className="text-yellow-400">87% utilized</strong> • Only accepting new searches for the next <strong>{timeLeft.minutes}</strong> minutes
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulseOpacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.95; }
        }
        
        @keyframes pulseGlow {
          0%, 100% { 
            text-shadow: 0 0 40px rgba(239, 68, 68, 0.8);
          }
          50% { 
            text-shadow: 0 0 60px rgba(239, 68, 68, 1), 0 0 80px rgba(239, 68, 68, 0.5);
          }
        }
        
        @keyframes flipDigit {
          0% {
            transform: rotateX(0deg);
          }
          50% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes ripplePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
      `}</style>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        packageType="single"
      />
    </section>
  );
};

export default UrgencySection;
