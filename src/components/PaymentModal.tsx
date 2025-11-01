import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const paypalRef = useRef<HTMLDivElement>(null);

  const packageDetails = {
    single: { price: 3.00, searches: 1, title: "One-time payment • 1 background check" },
    "3-pack": { price: 8.00, searches: 3, title: "3 background checks (Save 11%)" },
    "5-pack": { price: 12.00, searches: 5, title: "5 background checks (Save 20%)" }
  };

  const details = packageDetails[packageType];

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

  useEffect(() => {
    if (!isOpen || !paypalRef.current || isProcessing) return;

    // PayPal SDK would be loaded here
    // For now, showing placeholder button
    // In production, you'd render PayPal Smart Payment Buttons here
    
  }, [isOpen, email, emailError, isProcessing]);

  const handlePayPalClick = () => {
    if (!email || emailError) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    // This would trigger PayPal checkout
    setIsProcessing(true);
    
    // Simulate payment (in production, PayPal SDK handles this)
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(() => {
        window.location.href = `/search-form?payment_id=demo-${Date.now()}`;
      }, 2000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.85)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="relative bg-white rounded-3xl p-8 md:p-12 w-full max-w-[500px] shadow-2xl animate-slide-up"
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
            ${details.price.toFixed(2)}
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
        <div className="mb-6">
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

        {/* PayPal Button Container */}
        <div className="mb-4">
          <div 
            ref={paypalRef}
            className="min-h-[60px] rounded-xl overflow-hidden"
          >
            {/* PayPal Smart Payment Buttons will render here */}
            {/* For demo purposes, showing a styled button */}
            <Button
              onClick={handlePayPalClick}
              disabled={!email || !!emailError}
              className="w-full h-14 bg-[#FFC439] hover:bg-[#FFB01F] text-gray-900 font-semibold text-base rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.633h8.42c2.82 0 4.78.657 5.835 1.955.78.962 1.097 2.14 1.016 3.456-.213 3.425-2.787 5.513-6.785 5.513H10.32a.77.77 0 0 0-.76.633l-.474 3.01a.77.77 0 0 1-.76.633H7.076z"/>
              </svg>
              Pay with PayPal
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mb-4">
          Or pay with card through PayPal
        </p>

        {/* Trust Signals */}
        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              🔒 Secure Payment
            </span>
            <span className="flex items-center gap-1">
              💳 All Cards Accepted
            </span>
            <span className="flex items-center gap-1">
              ✅ Money-Back Guarantee
            </span>
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
};
