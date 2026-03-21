import { useNavigate } from "react-router-dom";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const steps = [
  {
    num: "01",
    title: "Create Your Free Safety Base",
    desc: "30 seconds. No credit card. Email and password. That's it. Unlock everything free immediately.",
  },
  {
    num: "02",
    title: "Use It Daily OR When You Need It",
    desc: "Daily: Check in with Habit. Learn red flags. Build your safety ritual. When Needed: Verify someone's public record (from R99). 60 seconds to results.",
  },
  {
    num: "03",
    title: "Document Everything",
    desc: "Safety Journal saves it all. Timestamped. Encrypted. Court-ready. Your evidence, your control.",
  },
];

const HowItWorksHormozi = () => {
  const navigate = useNavigate();

  return (
    <section id="how-it-works-hormozi" style={{ background: '#F5F0EB', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
          HOW IT WORKS
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 40,
        }}>
          Three Steps. Zero Risk. Complete Protection.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {steps.map((s) => (
            <div key={s.num} style={{
              display: 'flex', gap: 20, alignItems: 'flex-start',
              background: 'white', border: '1px solid #E6E0DA',
              borderRadius: 16, padding: 'clamp(20px, 3vw, 28px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'rgba(124,58,237,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...mono, fontSize: 16, fontWeight: 700, color: '#7C3AED',
              }}>
                {s.num}
              </div>
              <div>
                <h3 style={{ ...font, fontWeight: 700, fontSize: 'clamp(15px, 2vw, 18px)', color: '#1F1F1F', marginBottom: 6 }}>
                  {s.title}
                </h3>
                <p style={{ ...font, fontSize: 14, color: '#555555', lineHeight: 1.65 }}>
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...font, fontWeight: 700, fontSize: 15, color: 'white',
              background: '#7C3AED', border: 'none', padding: '14px 32px',
              borderRadius: 50, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Get Started Free — No Credit Card Required
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHormozi;
