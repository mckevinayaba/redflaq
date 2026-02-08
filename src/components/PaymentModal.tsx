import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { X, Building2, Smartphone, MessageCircle, CheckCircle2, Copy } from 'lucide-react';
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
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const packages = {
    single: { price: 99, credits: 1, label: 'R99 - 1 Verification', type: 'single', savings: undefined },
    '3-pack': { price: 249, credits: 3, label: 'R249 - 3 Verifications', savings: 'Save R48!', type: 'triple' },
    '5-pack': { price: 399, credits: 5, label: 'R399 - 5 Verifications', savings: 'Save R96!', type: 'five' }
  };

  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText('62821074432');
    toast({
      title: 'Copied!',
      description: 'Account number copied to clipboard',
    });
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

      if (data?.success && data?.payment_id) {
        // Redirect to search form immediately
        navigate(`/search-form?payment_id=${data.payment_id}`);
        onClose();
        setEmail('');
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
            <div className="text-center py-12 px-6">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">✅ PAYMENT SUBMITTED</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for choosing RedFlaq!
              </p>
              
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <p className="font-semibold text-foreground mb-3">PAYMENT DETAILS:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Amount: <span className="text-foreground font-semibold">R{currentPackage.price}.00</span></p>
                  <p>Reference: <span className="text-foreground font-semibold">{email}</span></p>
                  <p>Account: <span className="text-foreground font-semibold">Setup A Startup (62821074432)</span></p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 mb-6 text-left">
                <p className="font-semibold text-foreground mb-3">NEXT STEPS:</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>1. We verify your payment (usually 2-5 minutes)</p>
                  <p>2. We email your search link to: <strong className="text-foreground">{email}</strong></p>
                  <p>3. Click the link to perform your background check</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Questions? WhatsApp us: <a href="https://wa.me/27663365296" className="text-primary hover:underline font-semibold">+27 66 336 5296</a>
              </p>

              <div className="text-xs text-muted-foreground border-t border-border pt-4">
                <p>🏢 Setup A Startup (Pty) Ltd</p>
                <p className="mt-1">💜 A RedFlaq Initiative</p>
              </div>
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
                <h3 className="font-semibold text-foreground mb-3">💳 BANK TRANSFER (EFT)</h3>

                <div className="border-2 border-primary rounded-lg p-5 bg-primary/5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-semibold text-foreground">FNB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account Name:</span>
                      <span className="font-semibold text-foreground">Setup A Startup</span>
                    </div>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-muted-foreground">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-lg">62821074432</span>
                        <button
                          onClick={copyAccountNumber}
                          className="p-1 hover:bg-secondary rounded transition-colors"
                          title="Copy account number"
                        >
                          <Copy className="w-4 h-4 text-primary" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Account Type:</span>
                      <span className="font-semibold text-foreground">Cheque</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Branch Code:</span>
                      <span className="font-semibold text-foreground">254005</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm font-semibold text-foreground mb-1">⚠️ IMPORTANT:</p>
                    <p className="text-sm text-muted-foreground">Reference: <span className="font-bold text-foreground">USE YOUR EMAIL ADDRESS</span></p>
                    <p className="text-xs text-muted-foreground mt-1">Example: yourname@gmail.com</p>
                  </div>
                </div>

                <div className="border-2 border-border hover:border-primary rounded-lg p-4 transition-colors">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-primary" />
                    ⚡ INSTANT EFT OPTIONS
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Pay instantly with:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Zapper</li>
                    <li>• SnapScan</li>
                    <li>• Bank app instant payment</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3 italic">Same details apply (use email as reference)</p>
                </div>

                <div className="border-2 border-border hover:border-primary rounded-lg p-4 transition-colors bg-[#25D366]/5">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    📱 WHATSAPP PAYMENT
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">Send proof of payment to:</p>
                  <a
                    href="https://wa.me/27663365296?text=Hi%20RedFlaq!%20I%27ve%20made%20a%20payment%20for%20a%20background%20check.%20Here%27s%20my%20proof%20of%20payment%20and%20email%20address."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors font-semibold shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Send Proof via WhatsApp
                  </a>
                  <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                    <p className="font-semibold text-foreground">Include:</p>
                    <p>✓ Proof of payment screenshot</p>
                    <p>✓ Your email address</p>
                    <p>✓ Package selected (R50/R120/R180)</p>
                  </div>
                </div>
                
                <div className="p-3 bg-secondary/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">
                    📱 After payment, contact us: <a href="https://wa.me/27663365296" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">+27 66 336 5296</a>
                  </p>
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
                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                {isSubmitting ? 'Submitting...' : "I've Paid - Send Me Link"}
              </button>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm text-muted-foreground text-center mb-3">
                  ✅ We verify payments within <strong className="text-foreground">5 minutes</strong> and email your search link
                </p>
                <div className="text-xs text-muted-foreground text-center border-t border-border pt-3">
                  <p className="font-semibold text-foreground">🏢 Setup A Startup (Pty) Ltd</p>
                  <p className="mt-1">Registered Business | Secure Processing</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
