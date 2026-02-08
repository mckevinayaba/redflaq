import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Heart, Shield } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";

const HeroPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchCount, setSearchCount] = useState(1247);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('manual_payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verified');
      if (count) setSearchCount(count + 1200);
    };
    fetchCount();
  }, []);

  return (
    <>
      <section className="relative pt-[120px] pb-20 overflow-hidden" style={{ background: 'linear-gradient(180deg, hsl(270 100% 98%) 0%, hsl(0 0% 100%) 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column - Content (55%) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                💜 Trusted by women across South Africa
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[72px] font-bold text-foreground leading-[1.1] tracking-tight">
                Trusting relationships begin with{" "}
                <span className="text-primary">information.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                With a full name and ID number, verify legal risk signals before trust is given.
              </p>

              {/* Body text */}
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                RedFlaq searches South African government records so you can make informed decisions about who enters your life. Whether romantic relationships, childcare, or business connections.
              </p>

              {/* Value props */}
              <div className="flex flex-wrap gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>Results in 2-5 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>100% Confidential searches</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>POPIA Compliant</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all font-semibold"
                >
                  Check Risk Signals — R99
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary hover:bg-primary/5 text-lg px-8 py-6 rounded-full"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See How It Works
                </Button>
              </div>
            </div>

            {/* Right Column - Visual (45%) */}
            <div className="lg:col-span-5 relative">
              {/* Main Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, hsl(270 100% 95%) 0%, hsl(330 100% 95%) 100%)' }}>
                {/* Placeholder for South African women photo */}
                <div className="aspect-[4/5] flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                      <Shield className="w-16 h-16 text-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      [Photo: Two South African women, diverse, confident, smiling]
                    </p>
                  </div>
                </div>

                {/* Floating badge - top right */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg" style={{ background: 'linear-gradient(135deg, hsl(262 83% 58%) 0%, hsl(330 80% 60%) 100%)' }}>
                  Over {searchCount.toLocaleString()} searches performed
                </div>
              </div>

              {/* Trust badge - bottom */}
              <div className="absolute -bottom-4 left-4 right-4 bg-background rounded-2xl p-4 shadow-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Secure and reliable verification</p>
                    <p className="text-sm text-muted-foreground">POPIA compliant</p>
                  </div>
                </div>
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

export default HeroPlinq;
