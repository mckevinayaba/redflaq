import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Lock, Shield, UserCheck } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

type PackageType = "single" | "3-pack" | "5-pack";

const PricingHonest = () => {
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);

  const plans = [
    {
      name: "Single Verification",
      subtitle: "Check one person",
      price: "R99",
      priceNote: "Human-verified",
      features: [
        "Complete public record search",
        "Human verification included",
        "Source links provided",
        "PDF report via email",
        "Challenge incorrect results",
      ],
      popular: false,
      buttonText: "Start Verification",
      packageType: "single" as PackageType,
    },
    {
      name: "3-Pack",
      subtitle: "Multiple verifications",
      price: "R249",
      priceNote: "R83 each",
      features: [
        "3 complete verifications",
        "Human verification included",
        "Source links provided",
        "PDF reports via email",
        "Valid for 60 days",
      ],
      popular: true,
      saveBadge: "Save R48",
      buttonText: "Get 3-Pack",
      packageType: "3-pack" as PackageType,
    },
    {
      name: "5-Pack",
      subtitle: "Best value for groups",
      price: "R399",
      priceNote: "R80 each",
      features: [
        "5 complete verifications",
        "Priority verification queue",
        "Source links provided",
        "PDF reports via email",
        "Valid for 90 days",
      ],
      popular: false,
      saveBadge: "Save R96",
      buttonText: "Get 5-Pack",
      packageType: "5-pack" as PackageType,
    },
  ];

  return (
    <>
      <section id="pricing" className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              PRICING
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Why R99 per search? Because we verify every result manually to ensure accuracy.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative bg-card rounded-2xl p-8 border-2 transition-all hover:shadow-lg ${
                  plan.popular 
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.subtitle}</p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm ml-2">{plan.priceNote}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-risk-green flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Save Badge */}
                {plan.saveBadge && (
                  <div className="bg-risk-green/10 text-risk-green text-sm font-medium px-3 py-2 rounded-lg mb-6 text-center">
                    {plan.saveBadge}
                  </div>
                )}

                {/* Button */}
                <Button 
                  onClick={() => setSelectedPackage(plan.packageType)}
                  className={`w-full py-6 ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                      : 'bg-card border-2 border-primary text-primary hover:bg-primary/5'
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          {/* Why this price */}
          <div className="max-w-3xl mx-auto bg-card rounded-2xl p-8 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Why does verification cost R99?</h4>
                <p className="text-muted-foreground text-sm">
                  Unlike automated systems that risk false positives, we have real people verify every match. 
                  This takes time and expertise. We'd rather charge fairly for accurate results than offer 
                  cheap automated reports that could flag the wrong person.
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span className="text-sm">Secure payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm">POPIA compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span className="text-sm">Challenge incorrect results</span>
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

export default PricingHonest;
