import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CheckShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const IconContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    width: 60, height: 60, flexShrink: 0,
    background: '#0d0d1a',
    border: '1px solid rgba(108,53,222,0.25)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {children}
  </div>
);

const steps = [
  {
    number: "STEP 1",
    title: "See the Signal",
    desc: "Recognize the behavioral pattern before it has a name. RedFlaq Signals trains your instincts daily with real pattern analysis.",
    icon: <EyeIcon />,
    href: '/signals',
  },
  {
    number: "STEP 2",
    title: "Name the Pattern",
    desc: "Denial runs on unnamed behavior. Once you can name isolation, financial control, or intimidation — the hold weakens.",
    icon: <MessageIcon />,
    href: '/signals',
  },
  {
    number: "STEP 3",
    title: "Document Quietly",
    desc: "My Safety Journal creates timestamped, court-admissible records before you decide what to do with them. Start now. Decide later.",
    icon: <DocumentIcon />,
    href: '/dashboard/journal',
  },
  {
    number: "STEP 4",
    title: "Verify the Facts",
    desc: "Public criminal records, SAPS wanted lists, court history. Checkable in 60 seconds. R99. Before trust is given.",
    icon: <SearchIcon />,
    href: '/search-form',
  },
  {
    number: "STEP 5",
    title: "Act Earlier",
    desc: "You don't need certainty to take a step. The documentation, the verification, the pattern — all of it is yours to use when you're ready.",
    icon: <CheckShieldIcon />,
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
              <IconContainer>{step.icon}</IconContainer>
              <p style={{ ...inter, fontSize: 11, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginTop: 20, marginBottom: 8 }}>
                {step.number}
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
