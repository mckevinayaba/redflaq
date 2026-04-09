import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const steps = [
  {
    number: "01",
    title: "See the Signal",
    desc: "Recognize the behavioral pattern before it has a name. RedFlaq Signals trains your instincts daily with real pattern analysis.",
    href: '/signals',
  },
  {
    number: "02",
    title: "Name the Pattern",
    desc: "Denial runs on unnamed behavior. Once you can name isolation, financial control, or intimidation — the hold weakens.",
    href: '/signals',
  },
  {
    number: "03",
    title: "Document Quietly",
    desc: "My Safety Journal creates timestamped, court-admissible records before you decide what to do with them. Start now. Decide later.",
    href: '/dashboard/journal',
  },
  {
    number: "04",
    title: "Verify the Facts",
    desc: "Public criminal records, SAPS wanted lists, court history. Checkable in 60 seconds. R99. Before trust is given.",
    href: '/search-form',
  },
  {
    number: "05",
    title: "Act Earlier",
    desc: "You don't need certainty to take a step. The documentation, the verification, the pattern — all of it is yours to use when you're ready.",
    href: '/signup',
  },
];

const MethodSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#08080f', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            <span style={{ ...inter, color: '#ffffff' }}>The RedFlaq </span>
            <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Method</span>
          </h2>
          <p style={{ ...inter, fontSize: 16, color: '#8b8b91', maxWidth: 600, margin: '0 auto', lineHeight: 1.75 }}>
            See the pattern. Name it. Document it. Verify it. Act before it becomes evidence.
          </p>
        </div>

        {/* Steps grid */}
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              onClick={() => navigate(step.href)}
              style={{
                background: '#111118',
                border: '1px solid rgba(108,53,222,0.25)',
                borderRadius: 8,
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{
                fontSize: 72,
                fontWeight: 800,
                color: '#5a1a1a',
                lineHeight: 1,
                marginBottom: 16,
                fontFamily: "'Inter', sans-serif",
              }}>
                {step.number}
              </div>
              <p style={{ ...inter, fontSize: 11, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
                STEP {step.number}
              </p>
              <h3 style={{ ...inter, fontSize: 20, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 }}>
                {step.title}
              </h3>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.75 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodSection;
