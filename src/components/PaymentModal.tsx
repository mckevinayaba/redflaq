import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType?: "single" | "3-pack" | "5-pack";
}

export const PaymentModal = ({ isOpen, onClose, packageType = "single" }: PaymentModalProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardError, setCardError] = useState("");
  const [currentPurchaseId, setCurrentPurchaseId] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [cardFieldsReady, setCardFieldsReady] = useState(false);
  const cardFieldsRef = useRef<any>(null);

  const packageDetails = {
    single: { price: 50, searches: 1, title: "One-time payment • 1 background check", type: "single" },
    "3-pack": { price: 120, searches: 3, title: "3 background checks (Save 20%)", type: "triple" },
    "5-pack": { price: 180, searches: 5, title: "5 background checks (Save 25%)", type: "five" }
  };

  const details = packageDetails[packageType];

  // Load PayPal SDK with Hosted Fields
  useEffect(() => {
    if (!isOpen) return;

    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test';
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons,hosted-fields&currency=ZAR`;
    script.async = true;
    
    script.onload = () => {
      console.log('PayPal SDK loaded');
      setSdkLoaded(true);
    };
    
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      setCardError('Failed to load payment system. Please refresh and try again.');
    };

    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[src*="paypal.com/sdk"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
      setSdkLoaded(false);
      setCardFieldsReady(false);
      if (cardFieldsRef.current) {
        cardFieldsRef.current = null;
      }
    };
  }, [isOpen]);

  // Initialize PayPal Hosted Fields
  useEffect(() => {
    if (!sdkLoaded || !window.paypal || cardFieldsReady) return;

    const initializeHostedFields = async () => {
      try {
        console.log('Initializing PayPal Hosted Fields...');
        
        const cardFields = window.paypal.HostedFields.render({
          createOrder: async () => {
            // This will be called when user submits the form
            try {
              const { data, error } = await supabase.functions.invoke('process-payment', {
                body: {
                  action: 'create-order',
                  data: {
                    email: email,
                    packageType: details.type
                  }
                }
              });

              if (error) throw error;
              if (!data.success) throw new Error(data.error || 'Failed to create order');

              setCurrentPurchaseId(data.purchaseId);
              return data.orderID;
            } catch (err: any) {
              console.error('Create order error:', err);
              throw err;
            }
          },
          styles: {
            'input': {
              'font-size': '16px',
              'color': '#1f2937',
              'font-family': 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            },
            '.invalid': {
              'color': '#ef4444'
            },
            '.valid': {
              'color': '#10b981'
            }
          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '4111 1111 1111 1111'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: 'MM/YY'
            }
          }
        });

        cardFields.on('cardTypeChange', (event: any) => {
          if (event.cards.length === 1) {
            console.log('Card type:', event.cards[0].type);
          }
        });

        cardFields.on('validityChange', (event: any) => {
          const field = event.fields[event.emittedBy];
          if (field && !field.isPotentiallyValid) {
            setCardError('Please check your card details');
          } else {
            setCardError('');
          }
        });

        cardFieldsRef.current = cardFields;
        setCardFieldsReady(true);
        console.log('PayPal Hosted Fields initialized successfully');
      } catch (error) {
        console.error('Failed to initialize PayPal Hosted Fields:', error);
        setCardError('Failed to initialize payment fields. Please refresh the page.');
      }
    };

    initializeHostedFields();
  }, [sdkLoaded, email, details.type]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || emailError) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!cardFieldsRef.current) {
      setCardError('Payment system not ready. Please wait a moment and try again.');
      return;
    }
    
    setIsProcessing(true);
    setCardError("");
    
    try {
      console.log('Submitting card payment...');
      
      // Submit the card fields - this triggers createOrder and tokenizes the card
      const { orderId } = await cardFieldsRef.current.submit({
        contingencies: ['SCA_WHEN_REQUIRED']
      });

      console.log('Order created:', orderId);

      // Now capture the payment
      const captureResponse = await supabase.functions.invoke('process-payment', {
        body: {
          action: 'capture-order',
          data: {
            orderID: orderId
          }
        }
      });

      if (captureResponse.error) throw captureResponse.error;
      if (!captureResponse.data.success) throw new Error(captureResponse.data.error || 'Payment capture failed');

      console.log('Payment captured successfully');
      setPaymentSuccess(true);
      
      setTimeout(() => {
        window.location.href = `/search-form?purchase_id=${captureResponse.data.purchaseId}`;
      }, 2000);

    } catch (error: any) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      if (error.message) {
        if (error.message.includes('INSTRUMENT_DECLINED')) {
          errorMessage = 'Your card was declined. Please try a different card.';
        } else if (error.message.includes('invalid')) {
          errorMessage = 'Please check your card details and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setCardError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handlePayPalClick = async () => {
    if (!email || emailError) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsProcessing(true);
    setCardError("");
    
    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          action: 'create-order',
          data: {
            email: email,
            packageType: details.type
          }
        }
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Payment failed');

      setCurrentPurchaseId(data.purchaseId);

      // Open PayPal in a new window
      window.open(`https://www.paypal.com/checkoutnow?token=${data.orderID}`, '_blank');
      
      // Note: In production, you'd use PayPal SDK buttons for proper integration
      alert('PayPal integration in progress. This is a demo - redirecting to search form.');
      
      setTimeout(() => {
        window.location.href = `/search-form?purchase_id=${data.purchaseId}`;
      }, 2000);

    } catch (error: any) {
      console.error('PayPal error:', error);
      setCardError(error.message || 'PayPal payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  console.log("PaymentModal render, isOpen:", isOpen);
  
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center p-4 py-8 md:py-12 animate-fade-in"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="relative bg-white rounded-3xl p-6 md:p-8 w-full max-w-[500px] max-h-[90vh] overflow-y-auto scroll-smooth shadow-2xl animate-slide-up"
        style={{ 
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
          animation: "slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:scale-110 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isProcessing && !paymentSuccess && (
          <div className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center z-10">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg font-semibold text-gray-900">Processing your payment...</p>
          </div>
        )}

        {paymentSuccess && (
          <div className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-scale-in">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xl font-bold text-gray-900">Payment Successful!</p>
            <p className="text-sm text-gray-600 mt-2">Redirecting to search form...</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary mb-2 font-heading">
            🔴 Complete Your Payment
          </h2>
          <div className="text-6xl font-bold text-gray-900 my-4 font-heading">
            R{details.price.toFixed(2)}
          </div>
          <p className="text-sm text-gray-500">
            {details.title}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* What's Included */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">What's Included:</h3>
          <ul className="space-y-2">
            {[
              "Instant criminal record search (60 seconds)",
              "Full PDF report via email",
              "Color-coded risk assessment (Red/Orange/Yellow/Green)",
              "100% anonymous search (he won't know)",
              "Money-back guarantee if no report in 5 minutes"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Email Input */}
        <div className="mb-8">
          <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
            Your Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            className={`w-full px-4 py-3.5 border-2 rounded-xl text-base transition-colors duration-200 ${
              emailError 
                ? "border-red-500 focus:border-red-500" 
                : "border-gray-200 focus:border-primary"
            } focus:outline-none`}
            required
          />
          {emailError && (
            <p className="text-sm text-red-600 mt-1">{emailError}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            We'll send your PDF report here within 60 seconds
          </p>
        </div>

        {/* Card Payment Section (Primary) */}
        <form onSubmit={handleCardPayment} className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4">
            Payment Method
          </h3>

          {/* Card Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <div 
              id="card-number"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white transition-colors duration-200 hover:border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              style={{ minHeight: '50px' }}
            />
            {!cardFieldsReady && (
              <div className="text-xs text-gray-400 mt-1">Loading payment fields...</div>
            )}
          </div>

          {/* Expiry and CVV Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div 
                id="expiration-date"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white transition-colors duration-200 hover:border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                style={{ minHeight: '50px' }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div 
                id="cvv"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white transition-colors duration-200 hover:border-gray-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                style={{ minHeight: '50px' }}
              />
            </div>
          </div>

          {/* Accepted Cards & Security */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2 mb-1">
              💳 Visa • Mastercard • Amex • Discover
            </p>
            <p className="text-xs text-gray-400 text-center">
              🔒 Secure payment • Card details encrypted
            </p>
          </div>

          {cardError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{cardError}</p>
            </div>
          )}

          {/* Primary Payment Button */}
          <button
            type="submit"
            disabled={isProcessing || !email || !!emailError || !cardFieldsReady}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:scale-[1.02] shadow-lg"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : paymentSuccess ? (
              '✓ Payment Successful!'
            ) : (
              `Pay R${details.price.toFixed(2)} Now`
            )}
          </button>
        </form>


        {/* Trust Signals */}
        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-4 flex-wrap mb-2">
            <span>🔒 Bank-Level Security</span>
            <span>💳 All Cards Accepted</span>
            <span>✅ Money-Back Guarantee</span>
          </p>
          <p className="text-xs text-gray-300">
            Powered by PayPal • PCI-DSS Compliant
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
};
