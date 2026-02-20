import { useState, useRef } from "react";
import { Lock } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SearchOptionsSection = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [shakeConsent, setShakeConsent] = useState(false);
  const [showConsentHint, setShowConsentHint] = useState(false);
  const { ref, isVisible } = useScrollReveal();
  const consentRef = useRef<HTMLDivElement>(null);

  const provinces = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"];
  const searchReasons = ["Potential romantic partner", "Employee verification", "Childcare provider", "Tenant screening", "Business partner", "Other legitimate purpose"];

  const inputStyle: React.CSSProperties = {
    background: 'white', border: '1.5px solid #D6D3CD', padding: '14px 16px',
    fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#2D2235',
    borderRadius: 0, width: '100%', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B4453',
    display: 'block', marginBottom: 8,
  };

  const handleDisabledClick = () => {
    if (!consentChecked) {
      setShakeConsent(true);
      setShowConsentHint(true);
      setTimeout(() => setShakeConsent(false), 600);
      setTimeout(() => setShowConsentHint(false), 4000);
      consentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      <section id="search" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '80px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>
            Start Verifying
          </div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4vw, 52px)', maxWidth: 600, color: '#2D2235', marginBottom: 16,
          }}>
            Check a person using their full name and province.
          </h2>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', marginBottom: 48, maxWidth: 600 }}>
            We scan South African public‑record warning lists for possible matches. Results shown instantly.
          </p>

          {/* Search form */}
          <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: '40px 24px' }}>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 8 }}>
              Person Search
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginBottom: 32 }}>
              Results shown instantly and sent to your email. We're continuously improving accuracy, but no system can be perfect.
            </p>

            <div className="space-y-5">
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} placeholder="e.g. John David Mokoena" />
              </div>
              <div>
                <label style={labelStyle}>Province (Optional)</label>
                <select style={inputStyle}>
                  <option value="">Select province</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Age Range (Optional)</label>
                <select style={inputStyle}>
                  <option value="">Select age range</option>
                  <option value="18-25">18–25</option>
                  <option value="26-35">26–35</option>
                  <option value="36-45">36–45</option>
                  <option value="46-55">46–55</option>
                  <option value="56+">56+</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Reason for Search *</label>
                <select style={inputStyle}>
                  <option value="">Select reason</option>
                  {searchReasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 4, display: 'block' }}>
                  We ask this to comply with POPIA and protect everyone's rights
                </span>
              </div>

              {/* FIX 5: Consent ABOVE the CTA button */}
              <div
                ref={consentRef}
                className={`flex items-start gap-3 pt-4 rounded transition-all ${shakeConsent ? 'animate-shake' : ''}`}
                style={{
                  border: showConsentHint ? '1.5px solid #DC2626' : '1.5px solid transparent',
                  padding: showConsentHint ? '12px' : '12px',
                  background: showConsentHint ? '#FEF2F2' : 'transparent',
                }}
              >
                <Checkbox
                  id="consent"
                  checked={consentChecked}
                  onCheckedChange={(checked) => {
                    setConsentChecked(checked as boolean);
                    setShowConsentHint(false);
                  }}
                  className="mt-1"
                  style={{ accentColor: '#7C3AED' }}
                />
                <label htmlFor="consent" style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453',
                  lineHeight: 1.5, cursor: 'pointer',
                }}>
                  I confirm I have a legitimate reason to search this person and I agree to the{" "}
                  <a href="/terms" style={{ color: '#7C3AED', textDecoration: 'underline' }}>Terms of Service</a> and{" "}
                  <a href="/privacy" style={{ color: '#7C3AED', textDecoration: 'underline' }}>Privacy Policy</a>
                </label>
              </div>

              {showConsentHint && (
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#DC2626', marginTop: -8 }}>
                  ↑ Please confirm your reason and agree to the terms above to continue
                </p>
              )}

              {/* Submit */}
              <div onClick={!consentChecked ? handleDisabledClick : undefined}>
                <button
                  onClick={() => consentChecked && setIsPaymentModalOpen(true)}
                  disabled={!consentChecked}
                  style={{
                    width: '100%', background: consentChecked ? '#7C3AED' : '#9CA3AF', color: 'white',
                    padding: 18, fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700,
                    letterSpacing: '0.05em', border: 'none', cursor: consentChecked ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  }}
                  className={consentChecked ? 'hover:!bg-[#6D28D9]' : ''}
                >
                  <Lock style={{ width: 16, height: 16 }} />
                  Verify Someone Now — R99
                </button>
              </div>

              {/* Form meta */}
              <div className="flex flex-wrap gap-4 pt-2">
                {[["📧", "Results shown instantly & emailed"], ["⏱️", "Usually within minutes"], ["🔒", "Confidential use only"]].map(([icon, text]) => (
                  <span key={text} className="flex items-center gap-1.5" style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF',
                  }}>
                    {icon} {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType="single" />
    </>
  );
};

export default SearchOptionsSection;
