import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import HeroHormozi from "@/components/landing/HeroHormozi";
import TodaysSignal from "@/components/landing/TodaysSignal";
import ThreePillarSystem from "@/components/landing/ThreePillarSystem";
import GovDataSection from "@/components/landing/GovDataSection";
import TickerBar from "@/components/landing/TickerBar";
import HowItWorksPlinq from "@/components/landing/HowItWorksPlinq";
import SafetyBaseSection from "@/components/landing/SafetyBaseSection";
import PricingPlinq from "@/components/landing/PricingPlinq";
import TestimonialsSectionNew from "@/components/landing/TestimonialsSectionNew";
import WhyRedflaqSection from "@/components/landing/WhyRedflaqSection";
import AdvocacySection from "@/components/landing/AdvocacySection";
import FinalCTAPlinq from "@/components/landing/FinalCTAPlinq";
import FAQHormozi from "@/components/landing/FAQHormozi";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirmedBanner, setShowConfirmedBanner] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("referrer_id", ref);
    }
    if (params.get("confirmed") === "true") {
      setShowConfirmedBanner(true);
      const newParams = new URLSearchParams(params);
      newParams.delete("confirmed");
      setSearchParams(newParams, { replace: true });
      const timer = setTimeout(() => setShowConfirmedBanner(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F0EB', overflowX: 'hidden' }}>
      {showConfirmedBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: '#059669', padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
        }}>
          <Check size={18} style={{ color: '#fff', flexShrink: 0 }} />
          <span style={{ color: '#fff', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600 }}>
            Your email is confirmed! Sign in to start your first check.
          </span>
          <Link to="/signup?mode=signin" style={{
            background: '#fff', color: '#059669', padding: '6px 16px', borderRadius: 50,
            fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: "'Syne', sans-serif",
            marginLeft: 8, flexShrink: 0,
          }}>
            Sign In
          </Link>
          <button onClick={() => setShowConfirmedBanner(false)} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer', padding: 4, marginLeft: 4, flexShrink: 0,
          }}>
            <X size={16} />
          </button>
        </div>
      )}

      <NavbarPlinq />

      {/* 1. Hero — Brutal direct headline + CTAs */}
      <HeroHormozi />

      {/* 2. Today's Signal — featured editorial, drives daily return */}
      <TodaysSignal />

      {/* 3. Three-pillar behavioral system */}
      <ThreePillarSystem />

      {/* 4. Government data — GBVF national disaster stats */}
      <GovDataSection />

      {/* 5. Trust ticker */}
      <TickerBar />

      {/* 6. How it works — 3-step process */}
      <HowItWorksPlinq />

      {/* 7. Safety Base — free tools + paid checks */}
      <SafetyBaseSection />

      {/* 8. Pricing — pay per check */}
      <div id="pricing">
        <PricingPlinq />
      </div>

      {/* 9. Testimonials — editorial format */}
      <div id="testimonials">
        <TestimonialsSectionNew />
      </div>

      {/* 10. Why RedFlaq — mission */}
      <WhyRedflaqSection />

      {/* 11. Advocacy */}
      <AdvocacySection />

      {/* 12. Final CTA */}
      <FinalCTAPlinq />

      {/* 13. FAQ */}
      <FAQHormozi />

      {/* Footer */}
      <FooterPlinq />
      <PWAInstallBanner />
    </div>
  );
};

export default Index;
