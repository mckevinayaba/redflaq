import { Check, Clock, Shield, FileText, Lock } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const HeroPlinq = () => {
  const { guardedAction } = useAuthGuard();

  const handleVerify = () => {
    guardedAction();
  };

  return (
    <>
      <section style={{ background: '#0F0A1A', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle gradient accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
          background: 'radial-gradient(ellipse at 80% 50%, rgba(107,78,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '140px 24px 80px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            {/* Overline */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(107,78,255,0.15)', border: '1px solid rgba(107,78,255,0.3)',
              padding: '6px 16px', borderRadius: 4, marginBottom: 32,
            }}>
              <Shield size={14} style={{ color: '#A78BFA' }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A78BFA',
              }}>
                South Africa's Public Record Safety Check
              </span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(36px, 5vw, 64px)',
              lineHeight: 1.08,
              color: '#FFFFFF',
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}>
              Before you trust, <br />
              <span style={{ color: '#A78BFA' }}>verify.</span>
            </h1>

            {/* Subheading */}
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(16px, 1.8vw, 20px)',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 40,
            }}>
              RedFlaq searches South African public-record warning lists so you can make informed decisions about who to trust with your life, home, or business. Instant. Confidential. R99.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4" style={{ marginBottom: 32 }}>
              <button
                onClick={handleVerify}
                style={{
                  background: '#6B4EFF', color: '#FFFFFF',
                  padding: '16px 36px', fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
                  borderRadius: 4, transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#5539E8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#6B4EFF'; }}
              >
                Verify Someone Now — R99
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'transparent', color: 'rgba(255,255,255,0.8)',
                  padding: '16px 36px', fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 15,
                  border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
                  borderRadius: 4, transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              >
                See How It Works
              </button>
            </div>

            {/* Disclaimer */}
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 13,
              color: 'rgba(255,255,255,0.4)', maxWidth: 500, lineHeight: 1.6,
            }}>
              Not a full criminal record check. A fast public-record safety check with a clear report in under 60 seconds.
            </p>

            {/* Login link */}
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 20 }}>
              Already have an account?{" "}
              <button
                onClick={() => {
                  sessionStorage.setItem("fromCTA", "true");
                  window.location.href = '/signup?mode=signin';
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#A78BFA', textDecoration: 'underline', padding: 0 }}
              >
                Log in here
              </button>
            </p>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div style={{
        background: '#FFFFFF', borderBottom: '1px solid #E6E0DA',
        padding: '20px 24px',
      }}>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {[
            { icon: Clock, text: "Under 60 seconds" },
            { icon: FileText, text: "Public records only" },
            { icon: Lock, text: "100% confidential" },
            { icon: Shield, text: "POPIA-aware" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={14} style={{ color: '#6B4EFF' }} />
              <span style={{
                fontFamily: "'Syne', sans-serif", fontSize: 13,
                fontWeight: 500, color: '#555555',
              }}>{text}</span>
            </div>
          ))}
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            fontWeight: 700, color: '#6B4EFF',
          }}>
            R99 per check
          </span>
        </div>
      </div>
    </>
  );
};

export default HeroPlinq;
