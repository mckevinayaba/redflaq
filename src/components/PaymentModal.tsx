import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
  const [cardError, setCardError] = useState("");

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

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || emailError) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsProcessing(true);
    setCardError("");
    
    // Simulate card payment (in production, PayPal Hosted Fields handles this)
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(() => {
        window.location.href = `/search-form?payment_id=demo-${Date.now()}`;
      }, 2000);
    }, 2000);
  };

  const handlePayPalClick = () => {
    if (!email || emailError) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate PayPal payment
    setTimeout(() => {
      setPaymentSuccess(true);
      setTimeout(() => {
        window.location.href = `/search-form?payment_id=demo-${Date.now()}`;
      }, 2000);
    }, 2000);
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
              className="card-field w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center text-gray-400 text-base"
            >
              <span>4111 1111 1111 1111</span>
            </div>
          </div>

          {/* Expiry and CVV Row */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <div 
                id="expiration-date"
                className="card-field w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center text-gray-400 text-base"
              >
                <span>MM/YY</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <div 
                id="cvv"
                className="card-field w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 flex items-center text-gray-400 text-base"
              >
                <span>123</span>
              </div>
            </div>
          </div>

          {/* Accepted Cards */}
          <div className="mb-6">
            <p className="text-xs text-gray-500">
              We accept all major cards: 💳 Visa • Mastercard • Amex • Discover
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
            disabled={isProcessing || !email || !!emailError}
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
              `Pay $${details.price.toFixed(2)} Now`
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* PayPal Alternative (Small, Secondary) */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 mb-3">
            Already have PayPal?
          </p>
          <Button
            onClick={handlePayPalClick}
            disabled={isProcessing || !email || !!emailError}
            className="w-3/5 h-11 bg-gray-400 hover:bg-gray-500 text-white font-medium text-sm rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
          >
            Pay with PayPal
          </Button>
        </div>

        {/* Trust Signals */}
        <div className="text-center pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 flex items-center justify-center gap-4 flex-wrap mb-2">
            <span>🔒 Secure Payment</span>
            <span>💳 All Cards Accepted</span>
            <span>✅ Money-Back Guarantee</span>
          </p>
          <p className="text-xs text-gray-300">
            Payments processed securely
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
