import { useState, useRef } from "react";
import { Lock, Mail, Clock, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const SearchOptionsSection = () => {
  const [consentChecked, setConsentChecked] = useState(false);
  const [shakeConsent, setShakeConsent] = useState(false);
  const [showConsentHint, setShowConsentHint] = useState(false);
  const { ref, isVisible } = useScrollReveal();
  const consentRef = useRef<HTMLDivElement>(null);
  const { guardedAction } = useAuthGuard();
  const nameRef = useRef<HTMLInputElement>(null);

  const provinces = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"];
  const searchReasons = ["Potential romantic partner", "Employee verification", "Childcare provider", "Tenant screening", "Business partner", "Other legitimate purpose"];

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(124,58,237,0.25)',
    padding: '14px 16px',
    fontFamily: "'Syne', sans-serif",
    fontSize: 15,
    color: 'white',
    borderRadius: 12,
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    display: 'block',
    marginBottom: 8,
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
    <section id="search" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''} py-12 md:py-20 px-5`} style={{ background: '#F5F0EB' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>
          Start Verifying
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 52px)',
          maxWidth: 600,
          color: '#1A1523',
          marginBottom: 16,
          letterSpacing: '-0.02em',
        }}>
          Check a person using their full name and province.
        </h2>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#6B7280', marginBottom: 48, maxWidth: 600, lineHeight: 1.7 }}>
          We scan South African public‑record warning lists for possible matches. Results shown instantly.
        </p>

        {/* Dark form card */}
        <div style={{
          background: 'linear-gradient(145deg, #0F0A1A, #1A1035)',
          border: '1px solid rgba(124, 58, 237, 0.25)',
          borderRadius: 24,
          padding: '48px 32px',
          boxShadow: '0 8px 48px rgba(124, 58, 237, 0.1), 0 0 0 1px rgba(124,58,237,0.08)',
        }}>
          <h3 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            color: 'white',
            marginBottom: 8,
          }}>
            Person Search
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 36 }}>
            Results shown instantly and sent to your email. We're continuously improving accuracy, but no system can be perfect.
          </p>

          <div className="space-y-5">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input
                ref={nameRef}
                style={inputStyle}
                placeholder="e.g. John David Mokoena"
                onFocus={e => e.currentTarget.style.borderColor = '#7C3AED'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Province (Optional)</label>
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = '#7C3AED'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'}
              >
                <option value="">Select province</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Age Range (Optional)</label>
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = '#7C3AED'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'}
              >
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
              <select
                style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = '#7C3AED'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'}
              >
                <option value="">Select reason</option>
                {searchReasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, display: 'block' }}>
                We ask this to comply with POPIA and protect everyone's rights
              </span>
            </div>

            {/* Consent */}
            <div
              ref={consentRef}
              className={`flex items-start gap-3 pt-4 rounded-lg transition-all ${shakeConsent ? 'animate-shake' : ''}`}
              style={{
                border: showConsentHint ? '1.5px solid #DC2626' : '1.5px solid transparent',
                padding: 12,
                background: showConsentHint ? 'rgba(220,38,38,0.08)' : 'transparent',
                borderRadius: 12,
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
                fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.5, cursor: 'pointer',
              }}>
                I confirm I have a legitimate reason to search this person and I agree to the{" "}
                <a href="/terms" style={{ color: '#A855F7', textDecoration: 'underline' }}>Terms of Service</a> and{" "}
                <a href="/privacy" style={{ color: '#A855F7', textDecoration: 'underline' }}>Privacy Policy</a>
              </label>
            </div>

            {showConsentHint && (
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#EF4444', marginTop: -8 }}>
                ↑ Please confirm your reason and agree to the terms above to continue
              </p>
            )}

            {/* Submit */}
            <div onClick={!consentChecked ? handleDisabledClick : undefined}>
              <button
                onClick={() => consentChecked && guardedAction(nameRef.current?.value || "")}
                disabled={!consentChecked}
                style={{
                  width: '100%',
                  background: consentChecked ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: 20,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  border: 'none',
                  cursor: consentChecked ? 'pointer' : 'not-allowed',
                  borderRadius: 50,
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  boxShadow: consentChecked ? '0 4px 24px rgba(124,58,237,0.35)' : 'none',
                }}
              >
                <Lock style={{ width: 16, height: 16 }} />
                Verify Someone Now — R99
              </button>
            </div>

            {/* Form meta — icon chips */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { Icon: Mail, text: "Results shown instantly & emailed" },
                { Icon: Clock, text: "Usually within minutes" },
                { Icon: ShieldCheck, text: "Confidential use only" },
              ].map(({ Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5" style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.35)',
                }}>
                  <Icon style={{ width: 13, height: 13 }} /> {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchOptionsSection;
