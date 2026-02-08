import NavbarPlinq from "@/components/landing/NavbarPlinq";
import HeroPlinq from "@/components/landing/HeroPlinq";
import TrustBarPlinq from "@/components/landing/TrustBarPlinq";
import RealitySection from "@/components/landing/RealitySection";
import SearchOptionsSection from "@/components/landing/SearchOptionsSection";
import HowItWorksPlinq from "@/components/landing/HowItWorksPlinq";
import RiskLevelsSection from "@/components/landing/RiskLevelsSection";
import PricingPlinq from "@/components/landing/PricingPlinq";
import WhyRedflaqSection from "@/components/landing/WhyRedflaqSection";
import FAQPlinq from "@/components/landing/FAQPlinq";
import FinalCTAPlinq from "@/components/landing/FinalCTAPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavbarPlinq />
      <HeroPlinq />
      <TrustBarPlinq />
      <RealitySection />
      <SearchOptionsSection />
      <HowItWorksPlinq />
      <RiskLevelsSection />
      <PricingPlinq />
      <WhyRedflaqSection />
      <FAQPlinq />
      <FinalCTAPlinq />
      <FooterPlinq />
    </div>
  );
};

export default Index;
