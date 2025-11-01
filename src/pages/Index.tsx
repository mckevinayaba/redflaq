import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import SocialProofSection from "@/components/SocialProofSection";
import PricingSection from "@/components/PricingSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import UrgencySection from "@/components/UrgencySection";
import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import { StickyElements } from "@/components/StickyElements";

const Index = () => {
  return (
    <main className="min-h-screen">
      <StickyElements />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <SocialProofSection />
      <PricingSection />
      <GuaranteeSection />
      <UrgencySection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
};

export default Index;
