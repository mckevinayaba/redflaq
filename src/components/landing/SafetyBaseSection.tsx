import { useNavigate } from "react-router-dom";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const freeFeatures = [
  { label: "My Safety Journal", desc: "Court-admissible timestamped entries" },
  { label: "Protection Order Guide", desc: "Step-by-step legal process" },
  { label: "Affidavit Builder", desc: "Generate court statements" },
  { label: "Safety Resources", desc: "GBV hotlines, Thuthuzela Care Centres" },
  { label: "Saved Checks", desc: "Full verification history" },
  { label: "Red Flag Quiz", desc: "Behavioral pattern detection" },
];

const comingSoon = [
  { label: "Behavioral Signal Assessment", desc: "Pattern detection — coming soon" },
  { label: "Habit Dashboard", desc: "Daily safety practice — coming soon" },
];

const paidTiers = [
  { price: "R99", label: "1 Safety Check" },
  { price: "R249", label: "3 Safety Checks" },
  { price: "R399", label: "5 Safety Checks" },
];

const SafetyBaseSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F0EBE5', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left */}
          <div>
            <p style={{ ...mono, fontSize: 10, color: '#7C3AED', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>
              YOUR FREE SAFETY BASE
            </p>
            <h2 style={{
              ...serif, fontSize: 'clamp(28px, 4vw, 44px)', color: '#1F1F1F',
              lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 16,
            }}>
              Everything You Get.{' '}
              <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Free. Forever.</em>
            </h2>
            <p style={{ ...sans, fontSize: 15, color: '#555', lineHeight: 1.75, marginBottom: 36, maxWidth: 460 }}>
              Your Safety Base is your permanent, private record-keeping and safety system. Create it free. Use it always.
            </p>

            {/* Free features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {freeFeatures.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ ...sans, fontSize: 14, fontWeight: 700, color: '#1F1F1F' }}>{f.label}</span>
                    <span style={{ ...sans, fontSize: 13, color: '#888', marginLeft: 6 }}>{f.desc}</span>
                  </div>
                </div>
              ))}

              {/* Coming soon features */}
              {comingSoon.map(f => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: 0.55 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', border: '1.5px dashed #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <span style={{ fontSize: 8, color: '#7C3AED', fontWeight: 700 }}>→</span>
                  </div>
                  <div>
                    <span style={{ ...sans, fontSize: 14, fontWeight: 700, color: '#4B4453' }}>{f.label}</span>
                    <span style={{ ...sans, fontSize: 12, color: '#999', marginLeft: 6 }}>{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/signup')}
              style={{
                ...sans, fontWeight: 700, fontSize: 15, color: 'white',
                background: '#7C3AED', border: 'none', padding: '14px 32px',
                borderRadius: 50, cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Create Free Safety Base
            </button>
          </div>

          {/* Right — paid tier card */}
          <div style={{ background: '#1F1523', borderRadius: 16, padding: '40px 36px' }}>
            <p style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>
              YOU ONLY PAY WHEN YOU VERIFY SOMEONE
            </p>
            <h3 style={{ ...serif, fontSize: 'clamp(22px, 3vw, 30px)', color: '#FAFAF9', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 28 }}>
              Pay per check.<br />No subscription.
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {paidTiers.map((t, i) => (
                <div
                  key={t.price}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    background: i === 1 ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
                    border: i === 1 ? '1px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                  }}
                >
                  <span style={{ ...sans, fontSize: 14, fontWeight: 700, color: '#FAFAF9' }}>{t.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {i === 1 && (
                      <span style={{ ...mono, fontSize: 9, color: '#C4B5FD', background: 'rgba(124,58,237,0.3)', padding: '2px 8px', borderRadius: 50, fontWeight: 700 }}>
                        MOST POPULAR
                      </span>
                    )}
                    <span style={{ ...sans, fontSize: 18, fontWeight: 800, color: '#FAFAF9' }}>{t.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/search-form')}
              style={{
                ...sans, fontWeight: 700, fontSize: 14, color: 'white', width: '100%',
                background: '#B52020', border: 'none', padding: '14px 24px',
                borderRadius: 50, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(181,32,32,0.3)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Run a Check
            </button>

            <p style={{ ...sans, fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 12, textAlign: 'center', lineHeight: 1.5 }}>
              Verified public records · POPIA compliant · Secure via Yoco
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyBaseSection;
