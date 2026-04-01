import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-sa-woman.jpg";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const HeroHormozi = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F5F0EB', paddingTop: 100, paddingBottom: 0 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-8 md:gap-12 items-center">
          {/* Left — Copy */}
          <div style={{ paddingBottom: 60 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)',
              padding: '6px 16px', borderRadius: 50, marginBottom: 28,
            }}>
              <span style={{ ...mono, fontSize: 10, fontWeight: 500, color: '#7C3AED', letterSpacing: '0.08em' }}>
                SOUTH AFRICA'S SAFETY PLATFORM
              </span>
            </div>

            {/* Headline — brutal, direct, multi-line */}
            <h1 style={{
              ...serif, fontSize: 'clamp(26px, 4.5vw, 48px)',
              color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 28,
            }}>
              You Checked the Restaurant Reviews.<br />
              You Shared Your Location.<br />
              You Told a Friend Where You'd Be.
              <br /><br />
              You Think That Makes You{' '}
              <em style={{ fontStyle: 'italic' }}>Safe.</em>
              <br />
              <span style={{ color: '#B52020' }}>It Doesn't.</span>
            </h1>

            {/* Subheadline */}
            <div style={{ marginBottom: 32, maxWidth: 520 }}>
              <p style={{
                ...sans, fontSize: 'clamp(15px, 1.8vw, 17px)', color: '#1F1F1F',
                lineHeight: 1.7, marginBottom: 12, fontWeight: 600,
              }}>
                73% of South African women killed by intimate partners knew their killer had a history of violence.
              </p>
              <p style={{
                ...sans, fontSize: 'clamp(14px, 1.5vw, 15px)', color: '#555555',
                lineHeight: 1.75, marginBottom: 16,
              }}>
                Public record. Checkable. Before trust was given.
              </p>
              <p style={{
                ...sans, fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#1F1F1F',
                lineHeight: 1.6, fontWeight: 700,
              }}>
                Before you trust, RedFlaq first.
              </p>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
              {/* Primary — Purple */}
              <button
                onClick={() => navigate('/signup')}
                style={{
                  ...sans, fontWeight: 700, fontSize: 16, color: 'white',
                  background: '#7C3AED', border: 'none', padding: '16px 36px',
                  borderRadius: 50, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  width: '100%', maxWidth: 380, textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.3)'; }}
              >
                Create Free Safety Base
              </button>

              {/* Secondary — Red */}
              <button
                onClick={() => navigate('/search-form')}
                style={{
                  ...sans, fontWeight: 700, fontSize: 15, color: 'white',
                  background: '#B52020', border: 'none', padding: '14px 32px',
                  borderRadius: 50, cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(181,32,32,0.25)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  width: '100%', maxWidth: 380, textAlign: 'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(181,32,32,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(181,32,32,0.25)'; }}
              >
                Run a Check — R99
              </button>

              {/* Tertiary — link */}
              <button
                onClick={() => navigate('/signals')}
                style={{
                  ...sans, fontWeight: 600, fontSize: 13, color: '#7C3AED',
                  background: 'transparent', border: 'none', padding: '8px 0',
                  cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3,
                }}
              >
                Read Today's Signal →
              </button>
            </div>

            <p style={{ ...sans, fontSize: 12, color: '#888', marginTop: 12, maxWidth: 380, lineHeight: 1.5 }}>
              100% free account. No credit card. Pay only when you RedFlaq someone's public record.
            </p>
          </div>

          {/* Right — Hero Image */}
          <div style={{ position: 'relative' }}>
            <div style={{
              borderRadius: '40% 60% 55% 45% / 55% 45% 60% 40%',
              overflow: 'hidden',
              aspectRatio: '4/5',
              boxShadow: '0 20px 60px rgba(124,58,237,0.15)',
            }}>
              <img
                src={heroImg}
                alt="South African woman looking confidently into the distance"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHormozi;
