import { useNavigate } from "react-router-dom";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const pillars = [
  {
    number: "01",
    title: "Verify Before Trust",
    body: "Check their criminal record in 60 seconds. SAPS wanted lists, court judgments, protection orders. Public record verification.",
    cta: "Run a Check — R99",
    href: "/search-form",
    ctaStyle: "red" as const,
    accent: "#B52020",
  },
  {
    number: "02",
    title: "Document Before Doubt Fades",
    body: "My Safety Journal creates timestamped, court-admissible evidence. Start documenting before it escalates.",
    cta: "Open My Journal",
    href: "/dashboard/journal",
    ctaStyle: "purple" as const,
    accent: "#7C3AED",
  },
  {
    number: "03",
    title: "Build Habits Before Crisis",
    body: "Signals teaches red flags daily. Behavioral patterns show over time. Make safety practice, not panic response.",
    cta: "Read Today's Signal",
    href: "/signals",
    ctaStyle: "purple" as const,
    accent: "#7C3AED",
  },
];

const ThreePillarSystem = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F5F0EB', padding: '72px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ ...mono, fontSize: 10, color: '#7C3AED', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>
            THE SYSTEM
          </p>
          <h2 style={{
            ...serif, fontSize: 'clamp(28px, 4vw, 44px)', color: '#1F1F1F',
            lineHeight: 1.1, letterSpacing: '-0.02em', maxWidth: 680, margin: '0 auto',
          }}>
            Before You Trust, RedFlaq First.<br />
            <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>In Three Steps.</em>
          </h2>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.number}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E8E2DC',
                borderRadius: 16,
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              {/* Number */}
              <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: p.accent, letterSpacing: '0.1em', marginBottom: 20, opacity: 0.6 }}>
                {p.number}
              </span>

              {/* Title */}
              <h3 style={{ ...serif, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 16 }}>
                {p.title}
              </h3>

              {/* Body */}
              <p style={{ ...sans, fontSize: 15, color: '#555555', lineHeight: 1.75, marginBottom: 28, flex: 1 }}>
                {p.body}
              </p>

              {/* CTA */}
              <button
                onClick={() => navigate(p.href)}
                style={{
                  ...sans, fontWeight: 700, fontSize: 13, color: 'white',
                  background: p.ctaStyle === 'red' ? '#B52020' : '#7C3AED',
                  border: 'none', padding: '12px 24px', borderRadius: 50, cursor: 'pointer',
                  alignSelf: 'flex-start',
                  boxShadow: p.ctaStyle === 'red' ? '0 2px 12px rgba(181,32,32,0.2)' : '0 2px 12px rgba(124,58,237,0.2)',
                  transition: 'transform 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.background = p.ctaStyle === 'red' ? '#991B1B' : '#6D28D9'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = p.ctaStyle === 'red' ? '#B52020' : '#7C3AED'; }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreePillarSystem;
