import { useAuthGuard } from "@/hooks/useAuthGuard";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const tiers = [
  {
    name: "Basic",
    price: "R99",
    features: ["Public Records Network", "60-second verification", "Results saved forever", "Basic PDF report"],
    highlight: false,
  },
  {
    name: "Standard",
    price: "R249",
    features: ["SAPS + SAFLII Court Records", "60-second verification", "Results saved forever", "Enhanced PDF report"],
    highlight: true,
  },
  {
    name: "Premium",
    price: "R399",
    features: ["SAPS + SAFLII + NRSO*", "60-second verification", "Results saved forever", "Comprehensive PDF report"],
    highlight: false,
  },
];

const PaidChecksSection = () => {
  const { guardedAction } = useAuthGuard();

  return (
    <section id="pricing" style={{ background: '#F5F0EB', padding: 'clamp(56px, 10vw, 100px) 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 20, justifyContent: 'center' }}>
          Pricing
        </div>

        <h2 style={{
          ...serif, fontSize: 'clamp(28px, 4vw, 40px)',
          color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 10,
          textAlign: 'center',
        }}>
          Pay only when you RedFlaq someone's{' '}
          <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>public record.</em>
        </h2>
        <p style={{ ...sans, fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 48, maxWidth: 520, margin: '0 auto 48px' }}>
          Everything else is free. Forever. No subscriptions. No hidden fees.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ marginBottom: 24 }}>
          {tiers.map((t) => (
            <div key={t.name} style={{
              background: 'white',
              border: t.highlight ? '2px solid #7C3AED' : '1px solid #E6E0DA',
              borderRadius: 20, padding: 32, textAlign: 'center',
              boxShadow: t.highlight ? '0 8px 32px rgba(124,58,237,0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
              position: 'relative',
            }}>
              {t.highlight && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#7C3AED', color: 'white', padding: '4px 16px', borderRadius: 50,
                  ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                }}>
                  MOST POPULAR
                </div>
              )}
              <p style={{ ...sans, fontWeight: 700, fontSize: 16, color: '#1F1F1F', marginBottom: 8, marginTop: t.highlight ? 8 : 0 }}>{t.name}</p>
              <p style={{ ...serif, fontSize: 40, color: '#7C3AED', marginBottom: 4 }}>{t.price}</p>
              <p style={{ ...mono, fontSize: 10, color: '#888', marginBottom: 24 }}>per RedFlaq</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {t.features.map((f) => (
                  <li key={f} style={{ ...sans, fontSize: 13, color: '#555', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => guardedAction()}
                style={{
                  ...sans, fontWeight: 700, fontSize: 14,
                  color: t.highlight ? 'white' : '#7C3AED',
                  background: t.highlight ? '#7C3AED' : 'transparent',
                  border: t.highlight ? 'none' : '1.5px solid #7C3AED',
                  padding: '12px 28px', borderRadius: 50, cursor: 'pointer',
                  width: '100%', transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Run RedFlaq
              </button>
            </div>
          ))}
        </div>

        <p style={{ ...sans, fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 8 }}>
          *NRSO access subject to government Phase 3 rollout
        </p>
        <p style={{ ...sans, fontSize: 13, color: '#555', textAlign: 'center' }}>
          All checks include access to your free Safety Base, Journal, and all tools.
        </p>
      </div>
    </section>
  );
};

export default PaidChecksSection;
