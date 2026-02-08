import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const FinalCTA = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-purple-600">
        <div className="container mx-auto px-4 text-center">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Ready to Make Informed Decisions?
          </h2>
          
          <p className="text-xl text-white/90 mb-4">
            Clarity creates safety. Transparency builds trust.
          </p>
          
          <p className="text-lg text-white/80 mb-8">
            Start your first search in under 60 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Button 
              onClick={() => setIsPaymentModalOpen(true)}
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-lg"
            >
              Check Risk Signals Now
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Instant results</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>100% confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Money-back guarantee</span>
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

export default FinalCTA;
