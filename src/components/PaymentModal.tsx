import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/integrations/supabase/client';
import { X, Shield, Loader2, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType?: 'single' | '3-pack' | '5-pack';
}

export const PaymentModal = ({ isOpen, onClose, packageType = 'single' }: PaymentModalProps) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(packageType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRedirect, setShowRedirect] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setSelectedPackage(packageType);
  }, [packageType]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const packages = {
    single: { price: 99, credits: 1, label: 'R99 – 1 Safety Check', type: 'single', savings: undefined },
    '3-pack': { price: 249, credits: 3, label: 'R249 – 3 Safety Checks', savings: 'Save R48', type: 'triple' },
    '5-pack': { price: 399, credits: 5, label: 'R399 – 5 Safety Checks', savings: 'Save R96', type: 'five' },
  };

  const currentPackage = packages[selectedPackage];

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handlePay = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: 'Email required', description: 'Please enter a valid email address.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    setShowRedirect(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-yoco-checkout', {
        body: { email, package_type: currentPackage.type },
      });

      if (error) throw error;

      if (data?.redirectUrl) {
        // Brief pause to show redirect message
        setTimeout(() => {
          window.location.href = data.redirectUrl;
        }, 1500);
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setShowRedirect(false);
      toast({
        title: 'Payment error',
        description: 'Could not initiate payment. Please try again.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Redirect transition screen
  if (showRedirect) {
    return createPortal(
      <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.7)' }}>
        <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full p-10 text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-primary animate-pulse" />
          </div>
           <h3 className="text-xl font-bold text-foreground mb-3">Redirecting to Secure Payment</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            You are being securely redirected to our payment partner <strong className="text-foreground">Yoco</strong>. You will see <strong className="text-foreground">Setup A Startup (Pty) Ltd</strong> — this is RedFlaq's registered company.
          </p>
          <p className="text-sm font-semibold text-foreground mb-4">
            💳 Tip: On the payment screen, tap <strong>"Card"</strong> to pay with Visa, Mastercard or Amex.
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.7)' }}
      onClick={handleBackdropClick}
    >
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full" style={{ maxHeight: '90vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
        {/* Close button — always visible, cleared below navbar */}
        <button
          onClick={onClose}
          style={{ position: 'sticky', top: 0, zIndex: 10, float: 'right', margin: '12px 12px 0 0', width: 44, height: 44, minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(0,0,0,0.85)', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pt-4" style={{ clear: 'both' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Secure Checkout</h2>
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

          {/* Trust disclosure — above pay button */}
          <div className="mb-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex gap-2.5 items-start">
              <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                RedFlaq is proudly operated by <strong className="text-foreground">Setup A Startup (Pty) Ltd</strong>, a registered South African company. When you proceed to payment, you will see "Setup A Startup (Pty) Ltd" on the Yoco payment screen — this is correct and expected. Your payment is safe and secure.
              </p>
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
                <Lock className="w-5 h-5" />
                Pay Securely – R{currentPackage.price}
              </>
            )}
          </button>

          {/* Trust footer */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground text-center">
                256-bit encrypted · Secure checkout
              </p>
            </div>
            <div className="text-xs text-muted-foreground text-center border-t border-border pt-3">
              <p className="font-semibold text-foreground">🏢 RedFlaq by Setup A Startup (Pty) Ltd</p>
              <p className="mt-1">Registered Business · Secure Processing</p>
            </div>
          </div>

          {/* Cancel link — secondary exit */}
          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#9CA3AF', textDecoration: 'underline', padding: '8px 16px', minHeight: 44 }}
            >
              Cancel and go back
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
