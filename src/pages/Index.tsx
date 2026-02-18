import NavbarPlinq from "@/components/landing/NavbarPlinq";
import HeroPlinq from "@/components/landing/HeroPlinq";
import TickerBar from "@/components/landing/TickerBar";
import TrustBarPlinq from "@/components/landing/TrustBarPlinq";

import RealitySection from "@/components/landing/RealitySection";
import BarrierSection from "@/components/landing/BarrierSection";
import SearchOptionsSection from "@/components/landing/SearchOptionsSection";
import HowItWorksPlinq from "@/components/landing/HowItWorksPlinq";
import RiskLevelsSection from "@/components/landing/RiskLevelsSection";
import PricingPlinq from "@/components/landing/PricingPlinq";
import CommunitySectionSA from "@/components/landing/CommunitySectionSA";
import WhyRedflaqSection from "@/components/landing/WhyRedflaqSection";
import FAQPlinq from "@/components/landing/FAQPlinq";
import FinalCTAPlinq from "@/components/landing/FinalCTAPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: '#F7F4F0' }}>
      <NavbarPlinq />
      <HeroPlinq />
      <TickerBar />
      <TrustBarPlinq />
      
      <RealitySection />
      <BarrierSection />
      <SearchOptionsSection />
      <HowItWorksPlinq />
      <RiskLevelsSection />
      <PricingPlinq />
      <CommunitySectionSA />
      <WhyRedflaqSection />
      <FAQPlinq />
      <FinalCTAPlinq />
      <FooterPlinq />
    </div>
  );
};

export default Index;
