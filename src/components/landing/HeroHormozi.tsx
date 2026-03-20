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

            <h1 style={{
              ...serif, fontSize: 'clamp(32px, 5.5vw, 56px)',
              color: '#1F1F1F', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 24,
            }}>
              Before you give him a spare key, give yourself{' '}
              <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>clarity.</em>
            </h1>

            <p style={{
              ...sans, fontSize: 'clamp(15px, 2vw, 18px)', color: '#555555',
              lineHeight: 1.75, marginBottom: 12, maxWidth: 520,
            }}>
              November 2025: The South African government declared Gender-Based Violence a national disaster.
            </p>
            <p style={{
              ...sans, fontSize: 'clamp(14px, 1.6vw, 16px)', color: '#888',
              lineHeight: 1.7, marginBottom: 28, maxWidth: 520,
            }}>
              Not because women don't know it's dangerous. But because knowing hasn't changed behavior. RedFlaq exists for one moment: <strong style={{ color: '#1F1F1F' }}>before that trust is given.</strong>
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
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
                Create Your Free Safety Base
              </button>
              <p style={{ ...sans, fontSize: 12, color: '#888', maxWidth: 380, lineHeight: 1.5 }}>
                100% free account. No credit card. Pay only when you verify someone's public record (from R99).
              </p>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  ...sans, fontWeight: 600, fontSize: 14, color: '#7C3AED',
                  background: 'transparent', border: '1.5px solid #7C3AED',
                  padding: '12px 28px', borderRadius: 50, cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                See How It Works
              </button>
            </div>
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

            {/* Floating stat card */}
            <div style={{
              position: 'absolute', bottom: 32, left: -20,
              background: 'white', border: '1px solid #E6E0DA',
              borderRadius: 16, padding: '16px 22px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              maxWidth: 220,
            }}>
              <p style={{ ...serif, fontSize: 32, color: '#DC2626', marginBottom: 2 }}>42,289</p>
              <p style={{ ...sans, fontSize: 12, color: '#555', lineHeight: 1.4, marginBottom: 4 }}>
                sexual offences reported in South Africa (2023/24)
              </p>
              <p style={{ ...mono, fontSize: 9, color: '#aaa' }}>
                Source: SAPS Annual Crime Statistics
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHormozi;
