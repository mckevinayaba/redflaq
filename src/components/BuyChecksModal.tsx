import { useState } from "react";
import { Shield, X } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

interface BuyChecksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PACKAGES = [
  { key: "single", label: "1 Safety Check", price: 99, credits: 1 },
  { key: "triple", label: "3 Safety Checks", price: 249, credits: 3, popular: true },
  { key: "five", label: "5 Safety Checks", price: 399, credits: 5 },
];

export default function BuyChecksModal({ open, onOpenChange }: BuyChecksModalProps) {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (!open) return null;

  const handleSelect = (key: string) => {
    setSelectedPkg(key);
    setPaymentOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="bg-card rounded-xl border border-border shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex items-center justify-between p-5 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg text-foreground">Buy More Checks</h2>
            </div>
            <button onClick={() => onOpenChange(false)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <div className="p-5 space-y-3">
            <p className="font-body text-sm text-muted-foreground mb-4">
              You have no checks remaining. Choose a package to continue protecting yourself.
            </p>

            {PACKAGES.map((pkg) => (
              <button
                key={pkg.key}
                onClick={() => handleSelect(pkg.key)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-primary ${
                  pkg.popular ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-base text-foreground">{pkg.label}</p>
                    {pkg.popular && (
                      <span className="font-mono text-[10px] tracking-wider text-primary uppercase">Most Popular</span>
                    )}
                  </div>
                  <p className="font-heading text-xl text-foreground">R{pkg.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedPkg && (
        <PaymentModal
          isOpen={paymentOpen}
          onClose={() => { setPaymentOpen(false); setSelectedPkg(null); }}
          packageType={selectedPkg}
        />
      )}
    </>
  );
}
