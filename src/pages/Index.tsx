import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import HeroPlinq from "@/components/landing/HeroPlinq";
import HomepageDemo from "@/components/landing/HomepageDemo";
import WhoRedflaqHelps from "@/components/landing/WhoRedflaqHelps";
import HowItWorksPlinq from "@/components/landing/HowItWorksPlinq";
import RiskLevelsSection from "@/components/landing/RiskLevelsSection";
import FreeAccountSection from "@/components/landing/FreeAccountSection";
import ProtectionOrdersSection from "@/components/landing/ProtectionOrdersSection";
import SearchOptionsSection from "@/components/landing/SearchOptionsSection";
import PricingPlinq from "@/components/landing/PricingPlinq";
import TestimonialsSectionNew from "@/components/landing/TestimonialsSectionNew";
import WhyRedflaqSection from "@/components/landing/WhyRedflaqSection";
import FAQPlinq from "@/components/landing/FAQPlinq";
import FinalCTAPlinq from "@/components/landing/FinalCTAPlinq";
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
    <div className="min-h-screen" style={{ background: '#FFFFFF', overflowX: 'hidden' }}>
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

      {/* 1. Hero */}
      <HeroPlinq />

      {/* 2. Live Demo */}
      <HomepageDemo />

      {/* 3. Who RedFlaq Helps */}
      <WhoRedflaqHelps />

      {/* 4. How It Works */}
      <div id="how-it-works">
        <HowItWorksPlinq />
      </div>

      {/* 5. Risk Levels */}
      <RiskLevelsSection />

      {/* 6. Free Safety Account */}
      <FreeAccountSection />

      {/* 7. Protection Orders */}
      <ProtectionOrdersSection />

      {/* 8. Search Form */}
      <SearchOptionsSection />

      {/* 9. Pricing */}
      <div id="pricing">
        <PricingPlinq />
      </div>

      {/* 10. Testimonials */}
      <div id="testimonials">
        <TestimonialsSectionNew />
      </div>

      {/* 11. Why RedFlaq / Team */}
      <WhyRedflaqSection />

      {/* 12. FAQ */}
      <FAQPlinq />

      {/* 13. Final CTA */}
      <FinalCTAPlinq />

      {/* 14. Footer */}
      <FooterPlinq />
      <PWAInstallBanner />
    </div>
  );
};

export default Index;
