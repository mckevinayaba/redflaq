import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check, Shield, Heart } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";
import { supabase } from "@/integrations/supabase/client";

const HeroNew = () => {
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

  const valueProps = [
    { text: "Under 60 seconds - Instant results" },
    { text: "100% Confidential - Anonymous searches" },
    { text: "POPIA Compliant - Only public records" },
  ];

  return (
    <>
      <section className="pt-24 pb-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Shield className="h-4 w-4" />
                South Africa's First Instant Verification Platform
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Trusting relationships begin with{" "}
                <span className="text-purple-600">information.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl md:text-2xl font-medium text-gray-700">
                With a full name and ID number, verify legal risk signals before trust is given.
              </p>

              {/* Body Text */}
              <p className="text-lg text-gray-500">
                RedFlaq offers instant background verification so you can make informed decisions about who you let into your life. Whether romantic relationships, childcare, or business connections.
              </p>

              {/* Value Props */}
              <div className="space-y-3">
                {valueProps.map((prop, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">{prop.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setIsPaymentModalOpen(true)}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Check Risk Signals - R79
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 text-lg px-8 py-6 rounded-xl"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  See How It Works
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-100 to-pink-100">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Confident South African professional woman"
                  className="w-full h-[500px] object-cover"
                />
                
                {/* Floating Badge - Top */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Trusted by women across South Africa
                </div>
                
                {/* Floating Badge - Bottom */}
                <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-risk-red" />
                    <div>
                      <p className="font-semibold text-gray-900">Secure and reliable verification</p>
                      <p className="text-sm text-gray-500">Data protected and in compliance with POPIA</p>
                    </div>
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

export default HeroNew;
