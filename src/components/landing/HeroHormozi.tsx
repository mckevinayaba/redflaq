import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-sa-woman.jpg";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const HeroHormozi = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#08080f', paddingTop: 68, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 80px', width: '100%' }}>
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] items-center" style={{ gap: 'clamp(3rem, 6vw, 6rem)' }}>

          {/* Left — Copy */}
          <div>
            {/* Platform badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.25)',
              padding: '6px 16px', borderRadius: 4, marginBottom: 36,
            }}>
              <span style={{ ...inter, fontSize: 11, fontWeight: 600, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                South Africa's Safety Platform
              </span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: 28,
            }}>
              <span style={{ ...inter }}>South Africa Does Not Have</span>
              <br />
              <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>
                an Awareness Problem.
              </span>
              <br />
              <span style={{ ...inter }}>
                It Has a{' '}
                <span style={{ color: '#C0392B' }}>Denial</span>
                {' '}Problem.
              </span>
            </h1>

            {/* Subtitle */}
            <p style={{
              ...inter,
              fontSize: 'clamp(15px, 1.8vw, 18px)',
              fontWeight: 400,
              color: '#d1d1d6',
              lineHeight: 1.75,
              marginBottom: 20,
              maxWidth: 540,
            }}>
              You already know something is off. You've been explaining it away for weeks.
              This is the moment before the explanation. Before trust becomes regret.
            </p>

            {/* Brand signature */}
            <p style={{
              ...inter,
              fontSize: 'clamp(14px, 1.5vw, 17px)',
              fontWeight: 700,
              color: '#6C35DE',
              borderLeft: '3px solid #6C35DE',
              paddingLeft: 14,
              lineHeight: 1.5,
              marginBottom: 40,
            }}>
              Before You Trust, RedFlaq First.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', marginBottom: 24 }}>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  ...inter, fontWeight: 700, fontSize: 16, color: 'white',
                  background: '#6C35DE', border: 'none', padding: '16px 36px',
                  borderRadius: 4, cursor: 'pointer',
                  transition: 'background 0.2s',
                  width: '100%', maxWidth: 380,
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#7B42EE'}
                onMouseLeave={e => e.currentTarget.style.background = '#6C35DE'}
              >
                Create Free Safety Base
              </button>
              <button
                onClick={() => navigate('/signals')}
                style={{
                  ...inter, fontWeight: 600, fontSize: 15, color: 'rgba(255,255,255,0.75)',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '14px 32px',
                  borderRadius: 4, cursor: 'pointer',
                  transition: 'border-color 0.2s, color 0.2s',
                  width: '100%', maxWidth: 380,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >
                Read Today's Signal
              </button>
            </div>

            <p style={{ ...inter, fontSize: 14, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)', maxWidth: 380, lineHeight: 1.6 }}>
              She almost didn't check. She checked anyway. Something came up.
            </p>
          </div>

          {/* Right — existing hero image */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: 520,
              height: 'clamp(400px, 55vw, 600px)',
              borderRadius: 8,
              overflow: 'hidden',
            }}>
              <img
                src={heroImg}
                alt="South African woman looking with clarity and resolve"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center top',
                  display: 'block',
                }}
                loading="eager"
              />
              {/* Subtle dark overlay — left-to-right so text doesn't compete */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to right, rgba(8,8,15,0.3) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroHormozi;
