import { Button } from "@/components/ui/button";

const ProblemSection = () => {
  const handleCTAClick = () => {
    console.log("CTA clicked");
  };

  return (
    <section className="bg-white py-24 md:py-28 px-8">
      <div className="max-w-[900px] mx-auto">
        {/* Red Divider */}
        <div className="w-[100px] h-1 bg-primary mx-auto mb-10" />

        {/* Section Title */}
        <h2 className="font-heading font-bold text-3xl md:text-[42px] text-center text-foreground mb-14">
          THE TRUTH ABOUT DATING IN SOUTH AFRICA
        </h2>

        {/* Large Stat Callout */}
        <div className="bg-brand-red-light border-l-8 border-primary p-8 md:p-10 mb-10">
          <h3 className="font-heading font-bold text-2xl md:text-4xl text-primary mb-4 leading-tight">
            Every 4 Hours, A South African Woman Is Murdered By Her Partner.
          </h3>
          <p className="font-body text-base md:text-lg text-gray-dark leading-relaxed">
            That's 6 women. Every single day. Most of them never knew about his past.
          </p>
        </div>

        {/* Opening Paragraph */}
        <p className="font-body text-lg text-gray-dark leading-[1.8] mb-6">
          You met him on Tinder. He seems perfect. Great smile. Good job. Says all the right things.
        </p>

        <p className="font-body text-lg text-gray-dark leading-[1.8] mb-10">
          You're planning your first date. Maybe coffee. Maybe dinner. You're excited. A little nervous. But mostly... you trust him.
        </p>

        {/* Red X Bullets */}
        <div className="space-y-4 mb-10">
          <p className="font-body text-lg text-primary font-medium flex items-start gap-3">
            <span className="flex-shrink-0">❌</span>
            <span>She didn't know he had 3 domestic violence convictions.</span>
          </p>
          <p className="font-body text-lg text-primary font-medium flex items-start gap-3">
            <span className="flex-shrink-0">❌</span>
            <span>She didn't know he violated 2 protection orders from previous partners.</span>
          </p>
          <p className="font-body text-lg text-primary font-medium flex items-start gap-3">
            <span className="flex-shrink-0">❌</span>
            <span>She didn't know he spent 5 years in prison for assault.</span>
          </p>
          <p className="font-body text-lg text-primary font-medium flex items-start gap-3">
            <span className="flex-shrink-0">❌</span>
            <span>She didn't know he was released just 6 months ago.</span>
          </p>
        </div>

        {/* Sub-heading */}
        <h3 className="font-heading font-bold text-2xl md:text-[28px] text-foreground mt-10 mb-5">
          Because checking criminal records in South Africa was:
        </h3>

        {/* Bullet List */}
        <ul className="space-y-3 mb-10">
          <li className="font-body text-lg text-gray-dark leading-[1.8] flex items-start gap-3">
            <span className="text-primary flex-shrink-0">•</span>
            <span><strong>EXPENSIVE</strong> (R500-R5,000 for official background checks)</span>
          </li>
          <li className="font-body text-lg text-gray-dark leading-[1.8] flex items-start gap-3">
            <span className="text-primary flex-shrink-0">•</span>
            <span><strong>COMPLICATED</strong> (Requires fingerprints, police station visits, paperwork)</span>
          </li>
          <li className="font-body text-lg text-gray-dark leading-[1.8] flex items-start gap-3">
            <span className="text-primary flex-shrink-0">•</span>
            <span><strong>SLOW</strong> (Takes 4 days to 3 weeks for results)</span>
          </li>
          <li className="font-body text-lg text-gray-dark leading-[1.8] flex items-start gap-3">
            <span className="text-primary flex-shrink-0">•</span>
            <span><strong>INCOMPLETE</strong> (Sex offender registry is locked to the public)</span>
          </li>
          <li className="font-body text-lg text-gray-dark leading-[1.8] flex items-start gap-3">
            <span className="text-primary flex-shrink-0">•</span>
            <span><strong>IMPOSSIBLE</strong> for regular women</span>
          </li>
        </ul>

        {/* Callout Box */}
        <div className="bg-muted p-8 md:p-10 rounded-lg mb-8">
          <h4 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-4">
            Here's What's Happening Right Now:
          </h4>
          <p className="font-body text-base md:text-lg text-foreground leading-[1.8] mb-4">
            Right now, there's a man in your DMs. Maybe you've been talking for days. Maybe weeks. He's charming. Compliments you. Asks about your day.
          </p>
          <p className="font-body text-base md:text-lg text-foreground leading-[1.8] mb-4">
            You've already planned where you'll meet. You've told yourself "He seems nice."
          </p>
          <p className="font-body text-base md:text-lg text-foreground leading-[1.8]">
            But you haven't checked his record. Because you didn't know you could. Because it was too expensive. Too complicated. Too hard.
          </p>
        </div>

        {/* Emphasis Text */}
        <p className="font-body text-lg md:text-xl font-bold text-primary text-center mb-6">
          And by the time you find out... It might be too late.
        </p>

        {/* Section Ending */}
        <p className="font-heading font-bold text-3xl md:text-[32px] text-primary text-center mt-14 mb-8">
          Until now.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleCTAClick}
            size="lg"
            className="w-full max-w-[380px] h-[80px] bg-primary hover:bg-brand-red-dark text-white font-body font-bold text-[22px] rounded-xl transition-all duration-300 ease-out hover:scale-105 shadow-[0_8px_30px_rgba(220,38,38,0.15)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.25)]"
          >
            🔴 Check His Criminal Record - R50
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
