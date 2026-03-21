import { Heart, Users, Shield, Home, Briefcase, HandHeart } from "lucide-react";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };

const tiles = [
  { icon: <Heart size={22} color="#7C3AED" />, title: "Women Navigating GBVF Risks", desc: "Before the first date. When something feels wrong. When you need proof." },
  { icon: <Users size={22} color="#7C3AED" />, title: "Parents Protecting Children", desc: "Before the babysitter. Before the tutor. Before the coach. Before trust." },
  { icon: <Shield size={22} color="#7C3AED" />, title: "Protective Family Members", desc: "Sister's new boyfriend. Daughter's roommate. Son's business partner. Check first." },
  { icon: <Home size={22} color="#7C3AED" />, title: "Tenants & Landlords", desc: "Who's moving in? Who owns this property? Verify before signing." },
  { icon: <Briefcase size={22} color="#7C3AED" />, title: "Employers & Households", desc: "Domestic workers. Contractors. Caregivers. Service providers. Know who enters your home." },
  { icon: <HandHeart size={22} color="#7C3AED" />, title: "Support for All", desc: "Friends. Family. Community. Anyone making trust decisions deserves this tool." },
];

const IndustriesBrief = () => {
  return (
    <section id="who-redflaq-helps" style={{ background: 'white', padding: 'clamp(56px, 10vw, 100px) 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 20 }}>
          Who This Is For
        </div>

        <h2 style={{
          ...serif, fontSize: 'clamp(28px, 4.5vw, 44px)',
          color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16,
          maxWidth: 600,
        }}>
          One safety tool for every trust decision{' '}
          <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>you make.</em>
        </h2>
        <p style={{ ...sans, fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 48, maxWidth: 560 }}>
          Whether you're dating, hiring, renting, or protecting someone you love — RedFlaq gives you the information you need before you give your trust.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {tiles.map((t) => (
            <div key={t.title} style={{
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 16, padding: 28,
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(124,58,237,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                {t.icon}
              </div>
              <h3 style={{ ...sans, fontWeight: 700, fontSize: 16, color: '#1F1F1F', marginBottom: 8 }}>{t.title}</h3>
              <p style={{ ...sans, fontSize: 13, color: '#888', lineHeight: 1.6 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesBrief;
