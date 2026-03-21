import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Star, Lock, Shield } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

type PackageType = "single" | "3-pack" | "5-pack";

const PricingNew = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  const plans = [
    {
      name: "Single Check",
      subtitle: "Perfect for checking one person",
      price: "R50",
      period: "",
      features: [
        "1 complete background check",
        "All record types",
        "Instant results (60 seconds)",
        "Downloadable PDF report",
        "100% confidential",
        "Valid for 30 days",
      ],
      popular: false,
      buttonText: "Check Now",
      packageType: "single" as PackageType,
    },
    {
      name: "3-Pack",
      subtitle: "For checking multiple people",
      price: "R120",
      period: "",
      features: [
        "3 complete background checks",
        "All record types",
        "Instant results (60 seconds)",
        "Downloadable PDF reports",
        "100% confidential",
        "Valid for 60 days",
      ],
      popular: true,
      saveBadge: "Save R30 vs single checks",
      buttonText: "Get 3-Pack",
      packageType: "3-pack" as PackageType,
    },
    {
      name: "5-Pack",
      subtitle: "Best value for families & groups",
      price: "R180",
      period: "",
      features: [
        "5 complete background checks",
        "All record types",
        "Priority verification",
        "Downloadable PDF reports",
        "100% confidential",
        "Valid for 90 days",
      ],
      popular: false,
      saveBadge: "Best Value - Save R70!",
      buttonText: "Get 5-Pack",
      packageType: "5-pack" as PackageType,
    },
  ];

  return (
    <>
      <section id="pricing" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
            Choose Your Safety Plan
          </h2>
          <p className="text-xl text-gray-500 text-center mb-12">
            Clear pricing. No hidden fees. Instant access.
          </p>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-card rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow relative ${
                  plan.popular ? 'border-2 border-purple-600' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{plan.subtitle}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Save Badge */}
                {plan.saveBadge && (
                  <div className="bg-risk-green-light text-risk-green text-sm font-medium px-3 py-2 rounded-lg mb-6 text-center">
                    {plan.saveBadge}
                  </div>
                )}

                {/* Button */}
                <Button 
                  onClick={() => setSelectedPackage(plan.packageType)}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'border-purple-600 text-purple-600 hover:bg-purple-50'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>POPIA compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {selectedPackage && (
        <PaymentModal 
          isOpen={!!selectedPackage}
          onClose={() => setSelectedPackage(null)}
          packageType={selectedPackage}
        />
      )}
    </>
  );
};

export default PricingNew;
