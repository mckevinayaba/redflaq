import { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCountUp } from "@/hooks/useCountUp";

const HeroPlinq = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { count: statTwo, ref: statTwoRef } = useCountUp(40000, 2000);

  const handleVerify = () => {
    if (isAuthenticated) {
      navigate('/dashboard/new-check');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative overflow-hidden" style={{ background: '#F7F4F0', minHeight: '100vh' }}>
      <div className="grid lg:grid-cols-2 min-h-screen max-w-[1280px] mx-auto">
        {/* LEFT COLUMN */}
        <div className="pt-24 px-5 pb-10 lg:pt-40 lg:px-10 lg:pb-20">
          <div style={{
            background: '#FAF5FF', border: '1px solid #EDE9FE', padding: '6px 14px',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600,
            color: '#7C3AED', marginBottom: 32,
          }}>
            💜 Built for South African women facing GBV. Available to all.
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.05,
            color: '#2D2235', marginBottom: 24,
          }} className="text-[36px] sm:text-[44px] lg:text-[56px] xl:text-[72px]">
            Before you give him a spare key,<br />
            give yourself <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>clarity.</em>
          </h1>

          <p style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 400,
            lineHeight: 1.7, color: '#4B4453', maxWidth: 480, marginBottom: 12,
          }} className="text-base lg:text-lg">
            RedFlaq searches South African criminal records so you can make informed decisions about who to trust with your life, home, or business. Instant. Confidential. R99.
          </p>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginBottom: 32, maxWidth: 480, lineHeight: 1.6 }}>
            Not a full criminal record check. A fast public‑record safety check with a clear report in under 60 seconds.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2" style={{ marginBottom: 36 }}>
            {["Results in under 60 seconds", "Public records only", "100% confidential", "POPIA‑aware use"].map(item => (
              <div key={item} className="flex items-center gap-2" style={{ fontSize: 14, color: '#4B4453' }}>
                <Check className="h-4 w-4" style={{ color: '#7C3AED' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleVerify}
              className="hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                background: '#7C3AED', color: '#FFFFFF', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                border: '2px solid #7C3AED', cursor: 'pointer',
              }}
            >
              Verify Someone Now — R99
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:!bg-[#7C3AED] hover:!text-white transition-all hover:-translate-y-0.5"
              style={{
                background: 'transparent', color: '#7C3AED', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                border: '2px solid #7C3AED', cursor: 'pointer',
              }}
            >
              See How It Works
            </button>
          </div>

          {!isAuthenticated && (
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginTop: 24 }}>
              Already have an account?{" "}
              <button
                onClick={() => navigate('/signup?mode=signin')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#7C3AED', textDecoration: 'underline', padding: 0 }}
              >
                Log in here
              </button>
            </p>
          )}

          <div className="flex items-center gap-3" style={{ marginTop: isAuthenticated ? 48 : 24 }}>
            <div style={{ width: 32, height: 1, background: '#D6D3CD' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', letterSpacing: '0.08em' }}>
              FOR YOUR PROTECTION · NOT FOR HARASSMENT OR REVENGE
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN — GBV Stat Cards */}
        <div className="flex flex-col justify-center px-5 pb-20 gap-4 lg:px-10 lg:pt-28 lg:pb-20">
          <div className="scroll-reveal visible" style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: '36px 32px' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED', marginBottom: 8 }}>
              SOUTH AFRICAN REALITY
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: '#2D2235', lineHeight: 1 }}>
              1 in <span style={{ color: '#7C3AED' }}>3</span>
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#4B4453', lineHeight: 1.6, marginTop: 12 }}>
              South African women experience gender‑based violence in the hands of an intimate partner during their lifetime.
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9CA3AF', marginTop: 12 }}>
              SOURCE: STATS SA · DSTI 2024 GENDER REPORT
            </div>
          </div>

          <div ref={statTwoRef} className="scroll-reveal visible" style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: '36px 32px' }}>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: '#7C3AED', lineHeight: 1 }}>
              {statTwo > 0 ? statTwo.toLocaleString() : '40,000'}+
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#4B4453', lineHeight: 1.6, marginTop: 12 }}>
              Sexual offences reported every year. Many offenders had prior warnings in public records.
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9CA3AF', marginTop: 12 }}>
              SOURCE: SAPS ANNUAL CRIME STATISTICS
            </div>
          </div>

          <div style={{ background: '#7C3AED', padding: '28px 32px' }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: 'white', lineHeight: 1.5, fontStyle: 'italic' }}>
              We built RedFlaq so women and communities can access key public‑record warnings quickly and affordably.
            </p>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 12, fontWeight: 600 }}>
              — McKevin Ayaba, Founder of RedFlaq
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPlinq;
