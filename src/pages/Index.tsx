import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import HeroHormozi from "@/components/landing/HeroHormozi";
import GovDataSection from "@/components/landing/GovDataSection";
import TickerBar from "@/components/landing/TickerBar";
import HomepageDemo from "@/components/landing/HomepageDemo";

import BarrierSection from "@/components/landing/BarrierSection";
import SolutionHormozi from "@/components/landing/SolutionHormozi";
import HowItWorksPlinq from "@/components/landing/HowItWorksPlinq";
import RiskLevelsSection from "@/components/landing/RiskLevelsSection";
import StatsBar from "@/components/landing/StatsBar";
import PhotoGrid from "@/components/landing/PhotoGrid";
import ValueStack from "@/components/landing/ValueStack";
import PaidChecksSection from "@/components/landing/PaidChecksSection";
import TestimonialsSectionNew from "@/components/landing/TestimonialsSectionNew";
import IndustriesBrief from "@/components/landing/IndustriesBrief";
import CommunityImageStrip from "@/components/landing/CommunityImageStrip";
import WhyRedflaqSection from "@/components/landing/WhyRedflaqSection";
import FinalUrgency from "@/components/landing/FinalUrgency";
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

      {/* 1. Hero — Editorial hook + hero image */}
      <HeroHormozi />

      {/* 2. Government data — Classified as a national disaster */}
      <GovDataSection />

      {/* 3. Trust ticker */}
      <TickerBar />

      {/* 3. Interactive demo */}
      <HomepageDemo />


      {/* 5. Barriers — Why no one checked before */}
      <BarrierSection />

      {/* 6. Solution pillars */}
      <SolutionHormozi />

      {/* 7. How it works — 4-step timeline */}
      <HowItWorksPlinq />

      {/* 8. Risk levels — What your report reveals */}
      <RiskLevelsSection />

      {/* 9. Trust stats bar */}
      <StatsBar />

      {/* 10. Real SA women photos */}
      <PhotoGrid />

      {/* 11. Value stack — FREE tier explosion */}
      <ValueStack />

      {/* 12. Paid checks pricing */}
      <PaidChecksSection />

      {/* 13. Testimonials */}
      <div id="testimonials">
        <TestimonialsSectionNew />
      </div>

      {/* 14. Who this is for */}
      <IndustriesBrief />

      {/* 15. Community photos */}
      <CommunityImageStrip />

      {/* 16. Why RedFlaq Exists — Team */}
      <WhyRedflaqSection />

      {/* 17. Final urgency + CTA */}
      <FinalUrgency />

      {/* 18. FAQ */}
      <FAQHormozi />

      {/* Footer */}
      <FooterPlinq />
      <PWAInstallBanner />
    </div>
  );
};

export default Index;
