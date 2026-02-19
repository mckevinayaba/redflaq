import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

export const StickyElements = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitCountdown, setExitCountdown] = useState({ minutes: 5, seconds: 0 });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Header scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header after hero (800px)
      if (currentScrollY > 800) {
        // Hide on scroll down, show on scroll up
        if (currentScrollY > lastScrollY) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }
      } else {
        setShowHeader(false);
      }
      
      // Show floating CTA after 50% scroll
      const scrollPercent = (currentScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setShowFloatingCTA(scrollPercent > 50);
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Exit intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [showExitIntent]);

  // Exit intent countdown
  useEffect(() => {
    if (!showExitIntent) return;

    const timer = setInterval(() => {
      setExitCountdown(prev => {
        if (prev.seconds === 0) {
          if (prev.minutes === 0) {
            clearInterval(timer);
            return prev;
          }
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return { minutes: prev.minutes, seconds: prev.seconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showExitIntent]);

  const handleCTAClick = () => {
    setShowExitIntent(false);
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      {/* Sticky Header (Desktop) */}
      <div
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          showHeader ? 'translate-y-0' : '-translate-y-full'
        }`}
        style={{
          backgroundColor: 'rgba(139, 92, 246, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
            <span>💜</span>
            <span>REDFLAQ</span>
          </h2>
          <Button
            onClick={handleCTAClick}
            className="bg-white hover:bg-white/90 text-[#8B5CF6] font-bold"
          >
            Check Now - R99
          </Button>
        </div>
      </div>

      {/* Sticky Bottom Bar (Mobile) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        style={{ backgroundColor: '#6D28D9' }}
      >
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex-1 text-white text-sm font-body">
            <strong>15,247 Women Checked.</strong>
            <br />
            Will You?
          </div>
          <Button
            onClick={handleCTAClick}
            className="bg-white hover:bg-white/90 text-[#8B5CF6] font-bold whitespace-nowrap text-sm px-4"
          >
            💜 Get Your Report Now - R99
          </Button>
        </div>
      </div>

      {/* Floating CTA (Desktop) */}
      {showFloatingCTA && (
        <button
          onClick={handleCTAClick}
          className="hidden md:flex fixed right-6 bottom-6 z-50 w-20 h-20 rounded-full items-center justify-center text-white font-bold text-sm shadow-2xl animate-pulse-glow hover:scale-110 transition-transform"
          style={{ backgroundColor: '#8B5CF6' }}
        >
          Check Now
        </button>
      )}

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
          style={{ backgroundColor: 'rgba(109, 40, 217, 0.95)' }}
          onClick={() => setShowExitIntent(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md mx-4 relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h3 className="font-heading font-black text-3xl mb-4 text-[#8B5CF6]">
                WAIT! Get R10 OFF
              </h3>
              <p className="text-gray-700 mb-6">
                Use code <strong className="text-primary">SAFE10</strong> at checkout
              </p>

              <div className="flex justify-center gap-2 mb-6">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="text-4xl font-black text-[#8B5CF6]">
                    {String(exitCountdown.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">MINUTES</div>
                </div>
                <div className="flex items-center text-3xl font-black text-[#8B5CF6]">:</div>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="text-4xl font-black text-[#8B5CF6]">
                    {String(exitCountdown.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">SECONDS</div>
                </div>
              </div>

              <Button
                onClick={handleCTAClick}
                className="w-full h-14 text-lg bg-[#8B5CF6] hover:bg-[#7C3AED]"
              >
                Claim My Discount
              </Button>
            </div>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        packageType="single"
      />
    </>
  );
};
