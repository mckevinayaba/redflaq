import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const FinalCTAHonest = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <>
      <section className="relative py-24 bg-primary overflow-hidden">
        {/* Diagonal pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `repeating-linear-gradient(
                135deg,
                transparent,
                transparent 40px,
                rgba(255,255,255,0.1) 40px,
                rgba(255,255,255,0.1) 80px
              )`
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Make an Informed Decision?
            </h2>
            
            <p className="text-xl text-primary-foreground/80 mb-8">
              Clarity creates safety. Transparency builds trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={() => setIsPaymentModalOpen(true)}
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 rounded-xl shadow-lg group"
              >
                Start Verification — R99
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-xl"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/80 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>2-5 min results</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>100% confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Human-verified</span>
              </div>
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

export default FinalCTAHonest;
