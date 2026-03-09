import { useNavigate } from "react-router-dom";
import { Users, Heart, Home, Briefcase } from "lucide-react";

const personas = [
  {
    icon: Users,
    title: "Women navigating GBVF risks",
    bullets: [
      "Dating app matches before meeting in person",
      "New partners before getting serious or moving in",
      "Anyone whose behaviour is making you feel unsafe",
    ],
  },
  {
    icon: Heart,
    title: "Parents protecting children",
    bullets: [
      "School transport and lift-club drivers",
      "Nannies, au pairs and childcare providers",
      "Coaches, tutors and adults around your children",
    ],
  },
  {
    icon: Home,
    title: "Tenants & landlords",
    bullets: [
      "Landlords and property managers before you sign",
      "Tenants before you hand over keys",
      "Flatmates in shared accommodation",
    ],
  },
  {
    icon: Briefcase,
    title: "Employers & households",
    bullets: [
      "Domestic workers and in-home service providers",
      "Contractors working inside your home",
      "Staff in sensitive roles around people or money",
    ],
  },
];

const WhoRedflaqHelps = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F7F4F0' }} className="py-12 md:py-20 px-6">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: '#111827',
          textAlign: 'center',
          marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          Who RedFlaq Helps
        </h2>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 18,
          color: '#4B5563',
          textAlign: 'center',
          marginBottom: 56,
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Built for women facing GBVF. Engineered for everyone protecting loved ones in South Africa.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginBottom: 40 }}>
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                style={{
                  background: 'linear-gradient(145deg, #0F0A1A, #1A1035)',
                  borderRadius: 20,
                  padding: '48px 32px',
                  border: '1px solid rgba(124,58,237,0.2)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: '#EDE9FE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={24} color="#7C3AED" aria-label={p.title} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: 'white',
                  marginBottom: 20,
                }}>
                  {p.title}
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {p.bullets.map((b) => (
                    <li key={b} style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 13,
                      lineHeight: 1.6,
                      color: 'rgba(255,255,255,0.8)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      padding: '12px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}>
                      <span style={{ color: '#A855F7', flexShrink: 0 }}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
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
