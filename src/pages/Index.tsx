import Navbar from "@/components/landing/Navbar";
import HeroNew from "@/components/landing/HeroNew";
import StatsBar from "@/components/landing/StatsBar";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import RiskLevelsSection from "@/components/landing/RiskLevelsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingNew from "@/components/landing/PricingNew";
import WhyRedflaqSection from "@/components/landing/WhyRedflaqSection";
import FAQNew from "@/components/landing/FAQNew";
import FinalCTA from "@/components/landing/FinalCTA";
import FooterNew from "@/components/landing/FooterNew";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroNew />
      <StatsBar />
      <ProblemSection />
      <SolutionSection />
      <RiskLevelsSection />
      <TestimonialsSection />
      <PricingNew />
      <WhyRedflaqSection />
      <FAQNew />
      <FinalCTA />
      <FooterNew />
    </main>
  );
};

export default Index;
