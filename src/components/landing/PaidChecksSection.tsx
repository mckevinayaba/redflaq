import { useAuthGuard } from "@/hooks/useAuthGuard";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const tiers = [
  {
    name: "Basic",
    price: "R99",
    features: ["SAPS Wanted Lists", "60-second verification", "Results saved forever", "Basic PDF report"],
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
    <section id="pricing" style={{ background: '#F5F0EB', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 16, textAlign: 'center' as const }}>
          PRICING
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 10,
          textAlign: 'center' as const,
        }}>
          You Only Pay When You Verify Someone's Public Record
        </h2>
        <p style={{ ...font, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#555', textAlign: 'center' as const, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          Everything else is free. Forever. No subscriptions. No hidden fees.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" style={{ marginBottom: 24 }}>
          {tiers.map((t) => (
            <div key={t.name} style={{
              background: 'white',
              border: t.highlight ? '2px solid #7C3AED' : '1px solid #E6E0DA',
              borderRadius: 18, padding: 28, textAlign: 'center' as const,
              boxShadow: t.highlight ? '0 8px 32px rgba(124,58,237,0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
              position: 'relative' as const,
            }}>
              {t.highlight && (
                <div style={{
                  position: 'absolute' as const, top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#7C3AED', color: 'white', padding: '4px 16px', borderRadius: 50,
                  ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                }}>
                  MOST POPULAR
                </div>
              )}
              <p style={{ ...font, fontWeight: 700, fontSize: 16, color: '#1F1F1F', marginBottom: 8, marginTop: t.highlight ? 8 : 0 }}>{t.name}</p>
              <p style={{ ...font, fontWeight: 800, fontSize: 36, color: '#7C3AED', marginBottom: 4 }}>{t.price}</p>
              <p style={{ ...mono, fontSize: 10, color: '#888', marginBottom: 20 }}>per check</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {t.features.map((f) => (
                  <li key={f} style={{ ...font, fontSize: 13, color: '#555', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                    <span style={{ color: '#16A34A', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => guardedAction()}
                style={{
                  ...font, fontWeight: 700, fontSize: 14,
                  color: t.highlight ? 'white' : '#7C3AED',
                  background: t.highlight ? '#7C3AED' : 'transparent',
                  border: t.highlight ? 'none' : '1.5px solid #7C3AED',
                  padding: '12px 28px', borderRadius: 50, cursor: 'pointer',
                  width: '100%', transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Run Check
              </button>
            </div>
          ))}
        </div>

        <p style={{ ...font, fontSize: 12, color: '#888', textAlign: 'center' as const, marginBottom: 8 }}>
          *NRSO access subject to government Phase 3 rollout
        </p>
        <p style={{ ...font, fontSize: 13, color: '#555', textAlign: 'center' as const }}>
          All checks include access to your free Safety Base, Journal, and all tools.
        </p>
      </div>
    </section>
  );
};

export default PaidChecksSection;
