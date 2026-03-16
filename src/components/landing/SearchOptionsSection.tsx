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
    background: '#FFFFFF', border: '1px solid #E6E0DA',
    padding: '12px 16px', fontFamily: "'Syne', sans-serif", fontSize: 15,
    color: '#1F1F1F', borderRadius: 6, width: '100%', outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888888',
    display: 'block', marginBottom: 6,
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
    <section id="search" ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E0DA' }}>
      <div className="py-16 md:py-24 px-6" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
          }}>Start Verifying</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 4vw, 40px)', color: '#1F1F1F',
            marginTop: 12, letterSpacing: '-0.02em',
          }}>
            Check a person using their full name and province.
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', marginTop: 8, lineHeight: 1.7 }}>
            We scan South African public-record warning lists for possible matches. Results shown instantly.
          </p>
        </div>

        <div style={{
          background: '#FAFAF8', border: '1px solid #E6E0DA',
          borderRadius: 8, padding: '36px 28px',
        }}>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1F1F1F', marginBottom: 6 }}>
            Person Search
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#888888', marginBottom: 28 }}>
            Results shown instantly and sent to your email. We're continuously improving accuracy, but no system can be perfect.
          </p>

          <div className="space-y-4">
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input ref={nameRef} style={inputStyle} placeholder="e.g. John David Mokoena"
                onFocus={e => e.currentTarget.style.borderColor = '#6B4EFF'}
                onBlur={e => e.currentTarget.style.borderColor = '#E6E0DA'}
              />
            </div>
            <div>
              <label style={labelStyle}>Province (Optional)</label>
              <select style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = '#6B4EFF'}
                onBlur={e => e.currentTarget.style.borderColor = '#E6E0DA'}
              >
                <option value="">Select province</option>
                {provinces.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Age Range (Optional)</label>
              <select style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = '#6B4EFF'}
                onBlur={e => e.currentTarget.style.borderColor = '#E6E0DA'}
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
              <select style={{ ...inputStyle, appearance: 'none' }}
                onFocus={e => e.currentTarget.style.borderColor = '#6B4EFF'}
                onBlur={e => e.currentTarget.style.borderColor = '#E6E0DA'}
              >
                <option value="">Select reason</option>
                {searchReasons.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888888', marginTop: 4, display: 'block' }}>
                We ask this to comply with POPIA and protect everyone's rights
              </span>
            </div>

            {/* Consent */}
            <div ref={consentRef} className={`flex items-start gap-3 pt-3 rounded transition-all ${shakeConsent ? 'animate-shake' : ''}`}
              style={{
                border: showConsentHint ? '1px solid #DC2626' : '1px solid transparent',
                padding: 10, background: showConsentHint ? 'rgba(220,38,38,0.06)' : 'transparent',
                borderRadius: 6,
              }}
            >
              <Checkbox id="consent" checked={consentChecked}
                onCheckedChange={(checked) => { setConsentChecked(checked as boolean); setShowConsentHint(false); }}
                className="mt-1" style={{ accentColor: '#6B4EFF' }}
              />
              <label htmlFor="consent" style={{
                fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555', lineHeight: 1.5, cursor: 'pointer',
              }}>
                I confirm I have a legitimate reason to search this person and I agree to the{" "}
                <a href="/terms" style={{ color: '#6B4EFF', textDecoration: 'underline' }}>Terms of Service</a> and{" "}
                <a href="/privacy" style={{ color: '#6B4EFF', textDecoration: 'underline' }}>Privacy Policy</a>
              </label>
            </div>

            {showConsentHint && (
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#EF4444', marginTop: -4 }}>
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
                  background: consentChecked ? '#6B4EFF' : '#E6E0DA',
                  color: consentChecked ? 'white' : '#888888',
                  padding: 16, fontFamily: "'Syne', sans-serif", fontSize: 15,
                  fontWeight: 700, border: 'none',
                  cursor: consentChecked ? 'pointer' : 'not-allowed',
                  borderRadius: 4, transition: 'all 0.2s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                <Lock style={{ width: 16, height: 16 }} />
                Verify Someone Now — R99
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {[
                { Icon: Mail, text: "Results shown instantly & emailed" },
                { Icon: Clock, text: "Usually within minutes" },
                { Icon: ShieldCheck, text: "Confidential use only" },
              ].map(({ Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5" style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#888888',
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
