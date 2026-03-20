import { Heart, Users, Shield, Home, Briefcase, HandHeart } from "lucide-react";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

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
    <section id="who-redflaq-helps" style={{ background: 'white', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
          WHO THIS IS FOR
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 40,
        }}>
          One Safety Tool for Every Trust Decision You Make
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {tiles.map((t) => (
            <div key={t.title} style={{
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 14, padding: 24,
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'rgba(124,58,237,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                {t.icon}
              </div>
              <h3 style={{ ...font, fontWeight: 700, fontSize: 15, color: '#1F1F1F', marginBottom: 6 }}>{t.title}</h3>
              <p style={{ ...font, fontSize: 13, color: '#888', lineHeight: 1.55 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesBrief;
