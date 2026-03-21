import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Clock, Eye, ChevronRight } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";

const HeroHonest = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    const fetchRecordCount = async () => {
      const { count } = await supabase
        .from('wanted_persons')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (count) setRecordCount(count);
    };
    fetchRecordCount();
  }, []);

  return (
    <>
      <section className="relative pt-28 pb-20 bg-background overflow-hidden">
        {/* Diagonal accent */}
        <div 
          className="absolute top-0 right-0 w-1/3 h-full bg-primary/5"
          style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
            {/* Left Column - Content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Rotating text accent */}
              <div className="hidden lg:block absolute -left-16 top-32 text-primary/10 font-heading font-bold text-8xl tracking-tighter" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                VERIFY
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                <Shield className="h-4 w-4" />
                Public Record Verification
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                Before You Trust Someone New,{" "}
                <span className="text-primary relative">
                  Verify What's Already Public.
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                RedFlaq searches South African government records so you can make 
                informed decisions about who you let into your life.
              </p>

              {/* Process summary */}
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>2-5 min verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>Human-verified results</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>POPIA compliant</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all group"
                >
                  Start Verification — R99
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-foreground/20 text-foreground hover:bg-foreground/5 text-lg px-8 py-6 rounded-xl"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  How It Works
                </Button>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="lg:col-span-5 relative">
              {/* Offset background layer */}
              <div className="absolute -top-4 -left-4 right-4 bottom-4 bg-primary/10 rounded-2xl" />
              
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-xl">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                  
                  <div>
                    <p className="text-5xl font-bold text-foreground font-heading">{recordCount}</p>
                    <p className="text-muted-foreground mt-2">Active Legal Records</p>
                  </div>
                  
                  <div className="pt-4 border-t border-border space-y-3 text-left">
                    <p className="text-sm font-semibold text-foreground">What We Search:</p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        SAPS Wanted Persons Database
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Public Court Judgments (SAFLII)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Government Gazette Notices
                      </li>
                    </ul>
                  </div>
                  
                  <p className="text-xs text-muted-foreground pt-4 border-t border-border">
                    All sources are publicly accessible government records
                  </p>
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

export default HeroHonest;
