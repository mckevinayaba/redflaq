import { Check } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import heroImage from "@/assets/hero-sa-woman.jpg";

const HeroPlinq = () => {
  const { guardedAction } = useAuthGuard();
  const { count: statTwo, ref: statTwoRef } = useCountUp(40000, 2000);

  const handleVerify = () => {
    guardedAction();
  };

  return (
    <section className="relative overflow-hidden" style={{ background: '#F7F4F0', minHeight: '100vh' }}>
      <div className="grid lg:grid-cols-[55%_45%] min-h-screen max-w-[1280px] mx-auto">
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
          }} className="text-[36px] sm:text-[44px] lg:text-[56px] xl:text-[82px]">
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

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginTop: 24 }}>
            Already have an account?{" "}
            <button
              onClick={() => {
                sessionStorage.setItem("fromCTA", "true");
                window.location.href = '/signup?mode=signin';
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#7C3AED', textDecoration: 'underline', padding: 0 }}
            >
              Log in here
            </button>
          </p>

          <div className="flex items-center gap-3" style={{ marginTop: 24 }}>
            <div style={{ width: 32, height: 1, background: '#D6D3CD' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', letterSpacing: '0.08em' }}>
              FOR YOUR PROTECTION · NOT FOR HARASSMENT OR REVENGE
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN — Hero Photo + Stats */}
        <div className="flex flex-col justify-center items-center px-5 pb-20 gap-6 lg:px-10 lg:pt-28 lg:pb-20">
          {/* Organic framed hero photo */}
          <div className="organic-frame-1 organic-scroll-in visible w-full" style={{ maxWidth: 420, height: 500 }}>
            <img
              src={heroImage}
              alt="South African woman looking thoughtfully out of a Johannesburg apartment window"
              loading="eager"
              width="896"
              height="1152"
            />
          </div>

          {/* Compact stat + quote below image */}
          <div ref={statTwoRef} className="w-full" style={{ maxWidth: 420 }}>
            <div style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: '24px 24px' }}>
              <div className="flex items-baseline gap-4 mb-2">
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: '#7C3AED', lineHeight: 1 }}>
                  {statTwo > 0 ? statTwo.toLocaleString() : '40,000'}+
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9CA3AF', letterSpacing: '0.08em' }}>
                  SEXUAL OFFENCES / YEAR
                </span>
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453', lineHeight: 1.6 }}>
                Many offenders had prior warnings in public records.
              </p>
            </div>
          </div>

          <div style={{ background: '#7C3AED', padding: '20px 24px', maxWidth: 420 }} className="w-full">
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: 'white', lineHeight: 1.5, fontStyle: 'italic' }}>
              We built RedFlaq so women and communities can access key public‑record warnings quickly and affordably.
            </p>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 8, fontWeight: 600 }}>
              — McKevin Ayaba, Founder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPlinq;
