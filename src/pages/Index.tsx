import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import HeroPlinq from "@/components/landing/HeroPlinq";
import TickerBar from "@/components/landing/TickerBar";
import TrustBarPlinq from "@/components/landing/TrustBarPlinq";
import PhotoGrid from "@/components/landing/PhotoGrid";

import RealitySection from "@/components/landing/RealitySection";
import BarrierSection from "@/components/landing/BarrierSection";
import SearchOptionsSection from "@/components/landing/SearchOptionsSection";
import HowItWorksPlinq from "@/components/landing/HowItWorksPlinq";
import RiskLevelsSection from "@/components/landing/RiskLevelsSection";
import PricingPlinq from "@/components/landing/PricingPlinq";
import CommunitySectionSA from "@/components/landing/CommunitySectionSA";
import WhyRedflaqSection from "@/components/landing/WhyRedflaqSection";
import TestimonialsSectionNew from "@/components/landing/TestimonialsSectionNew";
import FAQPlinq from "@/components/landing/FAQPlinq";
import FinalCTAPlinq from "@/components/landing/FinalCTAPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import ShareSection from "@/components/landing/ShareSection";
import AdvocacySection from "@/components/landing/AdvocacySection";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirmedBanner, setShowConfirmedBanner] = useState(false);

  // Capture referral param & check for email confirmation redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("referrer_id", ref);
    }
    if (params.get("confirmed") === "true") {
      setShowConfirmedBanner(true);
      // Clean URL
      const newParams = new URLSearchParams(params);
      newParams.delete("confirmed");
      setSearchParams(newParams, { replace: true });
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => setShowConfirmedBanner(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F7F4F0', overflowX: 'hidden' }}>
      {/* Email confirmed banner */}
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
      <HeroPlinq />
      <TickerBar />
      <TrustBarPlinq />
      <PhotoGrid />
      <RealitySection />
      <BarrierSection />
      <SearchOptionsSection />
      <HowItWorksPlinq />
      <RiskLevelsSection />
      <PricingPlinq />

      {/* Social proof trust bar */}
      <div style={{
        width: '100%',
        background: 'linear-gradient(90deg, #7C3AED, #6D28D9, #7C3AED)',
        padding: '14px 20px',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)',
        }}>
          Trusted by women across South Africa <span style={{ opacity: 0.3, fontSize: 8, padding: '0 12px' }}>◆</span> No fingerprints. No waiting. No police station. Just clarity — in under 60 seconds.
        </span>
      </div>

      <div id="testimonials">
        <TestimonialsSectionNew />
      </div>
      <CommunitySectionSA />
      <WhyRedflaqSection />
      
      <FAQPlinq />
      <FinalCTAPlinq />
      <ShareSection />
      <AdvocacySection />
      <FooterPlinq />
      <PWAInstallBanner />
    </div>
  );
};

export default Index;
