import { useEffect } from "react";
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
import FounderSection from "@/components/landing/FounderSection";
import TestimonialsSectionNew from "@/components/landing/TestimonialsSectionNew";
import FAQPlinq from "@/components/landing/FAQPlinq";
import FinalCTAPlinq from "@/components/landing/FinalCTAPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import ShareSection from "@/components/landing/ShareSection";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

const Index = () => {
  // Capture referral param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("referrer_id", ref);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F7F4F0' }}>
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
        width: '100%', background: '#7C3AED', padding: '14px 20px', textAlign: 'center',
        borderTop: '2px solid #6D28D9', borderBottom: '2px solid #6D28D9',
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)',
        }}>
          🛡️ 1,000+ checks done · No fingerprints. No waiting. No police station. Just clarity — in under 60 seconds.
        </span>
      </div>

      <div id="testimonials">
        <TestimonialsSectionNew />
      </div>
      <CommunitySectionSA />
      <WhyRedflaqSection />
      <FounderSection />
      <FAQPlinq />
      <FinalCTAPlinq />
      <ShareSection />
      <FooterPlinq />
      <PWAInstallBanner />
    </div>
  );
};

export default Index;
