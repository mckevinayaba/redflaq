import { useNavigate } from "react-router-dom";

const personas = [
  {
    icon: "👩",
    title: "WOMEN NAVIGATING GBVF RISKS",
    bullets: [
      "Dating app matches before meeting in person",
      "New romantic partners before getting serious",
      "Roommates before moving in together",
      "Anyone who makes you feel unsafe",
    ],
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "PARENTS PROTECTING CHILDREN",
    bullets: [
      "School transport drivers",
      "Nannies and childcare providers",
      "Sports coaches and tutors",
      "Children's partners",
    ],
  },
  {
    icon: "🏠",
    title: "TENANTS & LANDLORDS",
    bullets: [
      "Landlords before signing a lease",
      "Property managers and estate agents",
      "Roommates and flatmates",
      "Neighbors if you feel unsafe",
    ],
  },
  {
    icon: "💼",
    title: "EMPLOYERS & BUSINESSES",
    bullets: [
      "Domestic workers (cleaners, gardeners)",
      "Contractors and service providers",
      "Employees in sensitive roles",
      "In-home services",
    ],
  },
];

const WhoRedflaqHelps = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#FFFFFF', padding: '80px 24px' }} className="py-[60px] md:py-[80px]">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          color: '#1A1523',
          textAlign: 'center',
          marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          Who RedFlaq Helps
        </h2>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 16,
          color: '#6B7280',
          textAlign: 'center',
          marginBottom: 48,
        }}>
          Built for women facing GBVF. Engineered for everyone protecting loved ones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: 40 }}>
          {personas.map((p) => (
            <div key={p.title} style={{
              background: '#F9FAFB',
              borderRadius: 12,
              padding: 32,
              border: '1px solid #F3F4F6',
            }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{p.icon}</span>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: '#1A1523',
                marginBottom: 16,
                letterSpacing: '0.04em',
              }}>
                {p.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.bullets.map((b) => (
                  <li key={b} style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: '#4B4453',
                    paddingLeft: 20,
                    position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: '#7C3AED' }}>•</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/safety-tips')}
            style={{
              background: 'transparent',
              color: '#7C3AED',
              padding: '14px 36px',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              border: '2px solid #7C3AED',
              cursor: 'pointer',
              borderRadius: 50,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7C3AED'; }}
          >
            See All Safety Scenarios
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhoRedflaqHelps;
