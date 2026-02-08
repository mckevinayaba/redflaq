import { useState } from "react";
import { Check, Star, Lock, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentModal } from "@/components/PaymentModal";

type PackageType = "single" | "3-pack" | "5-pack";

const PricingPlinq = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageType>("3-pack");

  const plans = [
    {
      id: "single" as PackageType,
      name: "Single Search",
      description: "For verifying one person",
      price: 99,
      period: "one-time",
      features: [
        "Complete background check",
        "All record types",
        "Human-verified results",
        "PDF report with sources",
        "Valid for 30 days",
      ],
      popular: false,
    },
    {
      id: "3-pack" as PackageType,
      name: "3-Search Pack",
      description: "For ongoing peace of mind",
      price: 249,
      period: "save R48",
      features: [
        "3 complete checks",
        "All record types",
        "Human-verified",
        "PDF reports",
        "Valid for 90 days",
        "Share with family",
      ],
      popular: true,
    },
    {
      id: "5-pack" as PackageType,
      name: "5-Search Pack",
      description: "For families & groups",
      price: 399,
      period: "save R96",
      features: [
        "5 complete checks",
        "All record types",
        "Priority verification",
        "PDF reports",
        "Valid for 6 months",
        "Bulk discount",
      ],
      popular: false,
    },
  ];

  const handleOpenPayment = (packageType: PackageType) => {
    setSelectedPackage(packageType);
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <section id="pricing" className="py-24 md:py-32 bg-background">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Transparent Pricing. No Hidden Fees.
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that protects you best
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? 'border-2 border-primary bg-gradient-to-b from-accent to-background shadow-xl'
                    : 'border border-border bg-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      <Star className="w-4 h-4" /> BEST VALUE
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-2xl font-medium text-muted-foreground">R</span>
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mt-1">{plan.period}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleOpenPayment(plan.id)}
                  className={`w-full h-12 font-semibold rounded-xl ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      : 'bg-background border-2 border-primary text-primary hover:bg-primary/5'
                  }`}
                >
                  {plan.popular ? 'Get Started' : 'Check Now'}
                </Button>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>EFT & Card Accepted</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>POPIA Compliant</span>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        packageType={selectedPackage}
      />
    </>
  );
};

export default PricingPlinq;
