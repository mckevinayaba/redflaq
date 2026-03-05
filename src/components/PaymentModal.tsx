import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/integrations/supabase/client';
import { X, Shield, Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType?: 'single' | '3-pack' | '5-pack';
}

export const PaymentModal = ({ isOpen, onClose, packageType = 'single' }: PaymentModalProps) => {
  const [email, setEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(packageType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSelectedPackage(packageType);
  }, [packageType]);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'payfast'>('stripe');
  const { toast } = useToast();

  const packages = {
    single: { price: 99, credits: 1, label: 'R99 – 1 Safety Check', type: 'single', savings: undefined },
    '3-pack': { price: 249, credits: 3, label: 'R249 – 3 Safety Checks', savings: 'Save R48', type: 'triple' },
    '5-pack': { price: 399, credits: 5, label: 'R399 – 5 Safety Checks', savings: 'Save R96', type: 'five' },
  };

  const currentPackage = packages[selectedPackage];

  const handlePay = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: 'Email required', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === 'stripe') {
        const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
          body: { email, package_type: currentPackage.type },
        });

        if (error) throw error;

        if (data?.url) {
          window.open(data.url, '_blank');
          toast({ title: 'Checkout opened', description: 'Stripe checkout opened in a new tab.' });
          onClose();
        } else {
          throw new Error('No checkout URL returned');
        }
      } else {
        const { data, error } = await supabase.functions.invoke('create-payfast-payment', {
          body: { email, package_type: currentPackage.type },
        });

        if (error) throw error;

        if (data?.redirect_url) {
          window.open(data.redirect_url, '_blank');
          toast({ title: 'Checkout opened', description: 'PayFast checkout opened in a new tab.' });
          onClose();
        } else {
          throw new Error('No redirect URL returned');
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      toast({
        title: 'Payment error',
        description: 'Could not initiate payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300">
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Payment</h2>
            <p className="text-3xl font-bold text-primary">R{currentPackage.price}.00</p>
            <p className="text-sm text-muted-foreground">
              {currentPackage.credits} Safety Check{currentPackage.credits > 1 ? 's' : ''}
            </p>
          </div>

          <div className="border-t border-border my-6" />

          {/* Package selector */}
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">Select Package:</label>
            <div className="space-y-2">
              {(Object.keys(packages) as Array<keyof typeof packages>).map((key) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedPackage === key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="package"
                    value={key}
                    checked={selectedPackage === key}
                    onChange={(e) => setSelectedPackage(e.target.value as typeof selectedPackage)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="flex-1 text-sm font-medium text-foreground">{packages[key].label}</span>
                  {packages[key].savings && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                      {packages[key].savings}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Email input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">Your Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-background text-foreground"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Your receipt and search link will be sent here</p>
          </div>

          {/* Payment method selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">Payment Method:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('stripe')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                  paymentMethod === 'stripe'
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Card (Stripe)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('payfast')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                  paymentMethod === 'payfast'
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                <Shield className="w-4 h-4" />
                PayFast (EFT)
              </button>
            </div>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={isSubmitting || !email}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                {paymentMethod === 'stripe' ? <CreditCard className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                Pay Securely{paymentMethod === 'stripe' ? ' with Stripe' : ' with PayFast'}
              </>
            )}
          </button>

          {/* Trust footer */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm text-muted-foreground text-center mb-3">
              🔒 You'll be redirected to {paymentMethod === 'stripe' ? "Stripe's" : "PayFast's"} secure checkout page
            </p>
            <div className="text-xs text-muted-foreground text-center border-t border-border pt-3">
              <p className="font-semibold text-foreground">🏢 Setup A Startup (Pty) Ltd</p>
              <p className="mt-1">Registered Business · Secure Processing</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
