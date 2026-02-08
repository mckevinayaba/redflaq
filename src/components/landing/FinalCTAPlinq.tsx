import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const FinalCTAPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 md:py-24" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(263 70% 50%) 100%)' }}>
        <div className="max-w-[900px] mx-auto px-6 text-center text-white">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Make Informed Decisions?
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-white/90 mb-4">
            Clarity creates safety. Transparency builds trust.
          </p>

          {/* Body */}
          <p className="text-lg text-white/80 mb-8">
            Start your first search in under 5 minutes.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={() => setIsPaymentModalOpen(true)}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
          >
            Check Risk Signals Now — R99
          </Button>

          {/* Trust signals */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/80">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Results in 2-5 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>POPIA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        packageType="single"
      />
    </>
  );
};

export default FinalCTAPlinq;
