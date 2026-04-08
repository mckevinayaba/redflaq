import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

// SVG icon components — monochrome purple stroke, no fill
const SignalsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const SafetyBaseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const RunCheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const JournalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const AffidavitIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <polyline points="9 15 12 18 15 15"/>
  </svg>
);

const ResourcesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    width: 60, height: 60, flexShrink: 0,
    background: '#0d0d1a',
    border: '1px solid rgba(108,53,222,0.25)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: 24,
  }}>
    {children}
  </div>
);

const products = [
  {
    icon: <SignalsIcon />,
    title: "Signals",
    desc: "Daily behavioral truth. Pattern recognition. No comfort. Just clarity.",
    href: '/signals',
    badge: null,
  },
  {
    icon: <SafetyBaseIcon />,
    title: "Safety Base",
    desc: "Your free permanent safety system. Journal, tools, resources — yours forever.",
    href: '/signup',
    badge: "Free",
  },
  {
    icon: <RunCheckIcon />,
    title: "Run a Check",
    desc: "Public criminal records in 60 seconds. From R99. Before trust is given.",
    href: '/search-form',
    badge: "From R99",
  },
  {
    icon: <JournalIcon />,
    title: "Safety Journal",
    desc: "Timestamped, encrypted, court-admissible. Document before it escalates.",
    href: '/dashboard/journal',
    badge: "Free",
  },
  {
    icon: <AffidavitIcon />,
    title: "Affidavit Builder",
    desc: "Generate court-ready statements from your journal entries in minutes.",
    href: '/dashboard/affidavit',
    badge: "Free",
  },
  {
    icon: <ResourcesIcon />,
    title: "Resources",
    desc: "GBV hotlines, Thuthuzela Care Centres, legal aid — all in one place.",
    href: '/safety-tips',
    badge: "Free",
  },
];

const ProductGrid = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#08080f', padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 44px)',
            fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 12,
          }}>
            <span style={{ ...inter, color: '#ffffff' }}>Everything in your </span>
            <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Safety Base</span>
          </h2>
          <p style={{ ...inter, fontSize: 15, color: '#8b8b91', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            One platform. Six tools. Built for the moment before it becomes a crisis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.title}
              onClick={() => navigate(p.href)}
              style={{
                background: '#111118',
                border: '1px solid rgba(108,53,222,0.25)',
                borderRadius: 8,
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              {p.badge && (
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'rgba(108,53,222,0.15)',
                  border: '1px solid rgba(108,53,222,0.3)',
                  borderRadius: 4, padding: '3px 10px',
                }}>
                  <span style={{ ...inter, fontSize: 10, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.06em' }}>
                    {p.badge}
                  </span>
                </div>
              )}
              <IconContainer>{p.icon}</IconContainer>
              <h3 style={{ ...inter, fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
                {p.title}
              </h3>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.75, flex: 1 }}>
                {p.desc}
              </p>
              <div style={{ marginTop: 20 }}>
                <span style={{ ...inter, fontSize: 13, fontWeight: 600, color: '#6C35DE' }}>
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
