import NavbarHonest from "@/components/landing/NavbarHonest";
import HeroHonest from "@/components/landing/HeroHonest";
import HowItWorksHonest from "@/components/landing/HowItWorksHonest";
import WhatWeSearchHonest from "@/components/landing/WhatWeSearchHonest";
import PricingHonest from "@/components/landing/PricingHonest";
import FAQHonest from "@/components/landing/FAQHonest";
import FinalCTAHonest from "@/components/landing/FinalCTAHonest";
import FooterHonest from "@/components/landing/FooterHonest";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavbarHonest />
      <HeroHonest />
      <HowItWorksHonest />
      <section id="what-we-search">
        <WhatWeSearchHonest />
      </section>
      <PricingHonest />
      <FAQHonest />
      <FinalCTAHonest />
      <FooterHonest />
    </div>
  );
};

export default Index;
