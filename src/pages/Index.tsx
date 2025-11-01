import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import SocialProofSection from "@/components/SocialProofSection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <SocialProofSection />
      {/* Additional sections will be added here */}
    </main>
  );
};

export default Index;
