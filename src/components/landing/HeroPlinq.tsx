import { Check } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import heroImage from "@/assets/hero-sa-woman.jpg";

const HeroPlinq = () => {
  const { guardedAction } = useAuthGuard();
  const { count: statTwo, ref: statTwoRef } = useCountUp(40000, 900);

  const handleVerify = () => {
    guardedAction();
  };

  return (
    <section className="relative overflow-hidden" style={{ background: '#F5F0EB', minHeight: '100vh' }}>
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '30%',
          width: '70%',
          height: '80%',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(107,78,255,0.06) 0%, rgba(233,227,255,0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="grid lg:grid-cols-[55%_45%] min-h-screen max-w-[1280px] mx-auto relative z-10">
        {/* LEFT COLUMN */}
        <div className="hero-stagger pt-24 px-5 pb-10 lg:pt-40 lg:px-10 lg:pb-20" style={{ maxWidth: 640 }}>
          {/* Tagline above pill */}
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            color: '#6B4EFF',
            marginBottom: 12,
            letterSpacing: '-0.01em',
            lineHeight: 1.2,
          }}>
            Before you trust, RedFlaq First.
          </p>

          {/* Positioning pill */}
          <div style={{
            background: '#E9E3FF',
            border: '1px solid #6B4EFF20',
            padding: '10px 20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            borderRadius: 24,
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: '#6B4EFF',
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
            <span style={{ fontSize: 14, flexShrink: 0 }}>♡</span>
            <span>Built in South Africa for people facing GBV and violence —<br />and anyone protecting their loved ones.</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.02,
            color: '#1F1F1F',
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }} className="text-[38px] sm:text-[48px] lg:text-[60px] xl:text-[72px]">
            Before you give him a spare key,<br />
            give yourself <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>clarity.</em>
          </h1>

          <p style={{
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.15,
            color: '#1F1F1F',
            marginBottom: 20,
            letterSpacing: '-0.01em',
          }} className="text-[22px] sm:text-[26px] lg:text-[32px] xl:text-[36px]">
            Before you trust anyone with your home, children, or safety — check public records first.
          </p>

          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 400,
            lineHeight: 1.7,
            color: '#555555',
            maxWidth: 500,
            marginBottom: 16,
            fontSize: 17,
          }}>
            RedFlaq searches South African public-record warning lists so you can make informed decisions about who to trust with your life, home, or business. Instant. Confidential. R99.
          </p>

          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: '#888888',
            marginBottom: 36,
            maxWidth: 500,
            lineHeight: 1.6,
          }}>
            Not a full criminal record check. A fast public‑record safety check with a clear report in under 60 seconds.
          </p>

          {/* Value props */}
          <div className="flex flex-wrap gap-x-6 gap-y-3" style={{ marginBottom: 40 }}>
            {["Results in under 60 seconds", "Public records only", "100% confidential", "POPIA‑aware use"].map(item => (
              <div key={item} className="flex items-center gap-2" style={{ fontSize: 14, color: '#555555', fontFamily: "'Syne', sans-serif" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#E9E3FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Check className="h-3 w-3" style={{ color: '#6B4EFF' }} />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleVerify}
              className="btn-scale"
              style={{
                background: '#6B4EFF',
                color: '#FFFFFF',
                padding: '18px 40px',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: 'pointer',
                borderRadius: 50,
                boxShadow: '0 4px 20px rgba(107, 78, 255, 0.25)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#5539E8';
                e.currentTarget.style.boxShadow = '0 6px 28px rgba(107, 78, 255, 0.35)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#6B4EFF';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(107, 78, 255, 0.25)';
              }}
            >
              Verify Someone Now — R99
            </button>
            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-scale"
              style={{
                background: 'transparent',
                color: '#6B4EFF',
                padding: '18px 40px',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                border: '2px solid #6B4EFF',
                cursor: 'pointer',
                borderRadius: 50,
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#6B4EFF';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6B4EFF';
              }}
            >
              See How It Works
            </button>
          </div>

          {/* Free account nudge */}
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: '#555555',
            marginTop: 12,
            lineHeight: '20px',
            textAlign: 'center',
            maxWidth: 500,
          }}>
            Create a free safety account to save checks and use My Safety Journal. No card required.
          </p>

          {/* Login link */}
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#888888', marginTop: 28 }}>
            Already have an account?{" "}
            <button
              onClick={() => {
                sessionStorage.setItem("fromCTA", "true");
                window.location.href = '/signup?mode=signin';
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#6B4EFF', textDecoration: 'underline', padding: 0 }}
            >
              Log in here
            </button>
          </p>

          {/* Disclaimer */}
          <div className="flex items-center gap-3" style={{ marginTop: 28 }}>
            <div style={{ width: 32, height: 1, background: '#E6E0DA' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888888', letterSpacing: '0.08em' }}>
              FOR YOUR PROTECTION · NOT FOR HARASSMENT OR REVENGE
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="hero-stagger flex flex-col justify-center items-center px-5 pb-20 gap-6 lg:px-10 lg:pt-28 lg:pb-20">
          <div style={{ position: 'relative', maxWidth: 420, width: '100%' }}>
            <div style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '40% 60% 55% 45% / 45% 55% 45% 55%',
              background: 'linear-gradient(135deg, rgba(107,78,255,0.15), rgba(233,227,255,0.2), rgba(107,78,255,0.1))',
              filter: 'blur(16px)',
              zIndex: 0,
            }} />
            <div
              className="organic-frame-1 organic-scroll-in visible w-full"
              style={{ height: 500, position: 'relative', zIndex: 1 }}
            >
              <img
                src={heroImage}
                alt="South African woman looking thoughtfully out of a Johannesburg apartment window"
                loading="eager"
                width="896"
                height="1152"
              />
            </div>
          </div>

          <div ref={statTwoRef} className="w-full" style={{ maxWidth: 420 }}>
            <div className="card-lift" style={{
              background: '#FFFFFF',
              border: '1px solid #E6E0DA',
              padding: '28px 28px',
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <div className="flex items-baseline gap-4 mb-2">
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 44,
                  color: '#6B4EFF',
                  lineHeight: 1,
                }}>
                  {statTwo > 0 ? statTwo.toLocaleString() : '40,000'}+
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  color: '#888888',
                  letterSpacing: '0.08em',
                }}>
                  SEXUAL OFFENCES / YEAR
                </span>
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 13,
                color: '#555555',
                lineHeight: 1.6,
              }}>
                Many offenders had prior warnings in public records.
              </p>
            </div>
          </div>

          <div className="card-lift w-full" style={{
            background: '#6B4EFF',
            padding: '24px 28px',
            maxWidth: 420,
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(107,78,255,0.15)',
          }}>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 17,
              color: 'white',
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}>
              We built RedFlaq so women and communities can access key public‑record warnings quickly and affordably.
            </p>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 12,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 10,
              fontWeight: 600,
            }}>
              — RedFlaq Founding Team
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPlinq;
