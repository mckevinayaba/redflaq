import { useState } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '@/integrations/supabase/client';
import { X, Building2, Smartphone, MessageCircle, CheckCircle2 } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType?: 'single' | '3-pack' | '5-pack';
}

export const PaymentModal = ({ isOpen, onClose, packageType = 'single' }: PaymentModalProps) => {
  const [email, setEmail] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(packageType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const packages = {
    single: { price: 50, credits: 1, label: 'R50 - 1 Search', type: 'single', savings: undefined },
    '3-pack': { price: 120, credits: 3, label: 'R120 - 3 Searches', savings: 'Save R30!', type: 'triple' },
    '5-pack': { price: 180, credits: 5, label: 'R180 - 5 Searches', savings: 'Save R70!', type: 'five' }
  };

  const currentPackage = packages[selectedPackage];

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('submit-payment', {
        body: {
          email,
          package_type: currentPackage.type
        }
      });

      if (error) throw error;

      if (data?.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
          setEmail('');
        }, 5000);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      alert('Submission failed. Please try again or contact us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-300">
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          {showSuccess ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">Payment Submission Received!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you! We'll verify your payment and email your search link to <strong>{email}</strong> within 5 minutes.
              </p>
              <p className="text-sm text-muted-foreground">Check your inbox (and spam folder)</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💜</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Payment</h2>
                <p className="text-3xl font-bold text-primary">R{currentPackage.price}.00</p>
                <p className="text-sm text-muted-foreground">{currentPackage.credits} Background Check{currentPackage.credits > 1 ? 's' : ''}</p>
              </div>

              <div className="border-t border-border my-6" />

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Choose your payment method:</h3>

                <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">Bank Transfer (EFT)</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Bank:</strong> FNB</p>
                        <p><strong>Account:</strong> 62XXXXXXXX</p>
                        <p><strong>Account Name:</strong> RedFlaq</p>
                        <p><strong>Branch Code:</strong> 250655</p>
                        <p className="text-primary font-semibold mt-2">Reference: Use your EMAIL as reference</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-border hover:border-primary rounded-lg p-4 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Smartphone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">Instant EFT</h4>
                      <p className="text-sm text-muted-foreground mb-2">Pay instantly with:</p>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-secondary rounded text-xs font-semibold">Zapper</span>
                        <span className="px-3 py-1 bg-secondary rounded text-xs font-semibold">SnapScan</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-border hover:border-primary rounded-lg p-4 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">WhatsApp Payment</h4>
                      <p className="text-sm text-muted-foreground mb-2">Send proof of payment</p>
                      <a
                        href="https://wa.me/27721234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors text-sm font-semibold"
                      >
                        <MessageCircle className="w-4 h-4" />
                        072 123 4567
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border my-6" />

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-background text-foreground"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">We'll send your search link here</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Select Package:
                  </label>
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
                        <span className="flex-1 text-sm font-medium text-foreground">
                          {packages[key].label}
                        </span>
                        {packages[key].savings && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                            {packages[key].savings}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !email}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : "I've Paid - Send Search Link"}
              </button>

              <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  ℹ️ We'll verify your payment and email your search link within <strong>5 minutes</strong>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
