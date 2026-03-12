import { useNavigate } from "react-router-dom";
import { ShieldCheck, Users, Shield, Home, Briefcase, HandHeart } from "lucide-react";

const personas = [
  {
    icon: ShieldCheck,
    title: "Women navigating GBVF risks",
    prominent: true,
    bullets: [
      "Dating app matches before meeting in person",
      "New partners before getting serious or moving in",
      "Anyone whose behaviour is making you feel unsafe",
    ],
  },
  {
    icon: Users,
    title: "Parents protecting children",
    bullets: [
      "School transport and lift‑club drivers",
      "Nannies, au pairs and childcare providers",
      "Coaches, tutors and adults around your children",
    ],
  },
  {
    icon: Shield,
    title: "Protective family members",
    bullets: [
      "Verify caregivers around your children and elders",
      "Check partners entering your family's life",
      "Screen anyone around vulnerable family members",
      "Being protective isn't controlling when it's grounded in respect and information.",
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
      "Domestic workers and in‑home service providers",
      "Contractors working inside your home",
      "Staff in sensitive roles around people or money",
    ],
  },
  {
    icon: HandHeart,
    title: "Support for all",
    bullets: [
      "Whether you're a woman, man, queer person or child — abuse thrives in silence.",
      "My Safety Journal is private documentation for anyone who needs a record of what they're living through.",
      "You deserve to be taken seriously.",
    ],
  },
];

const WhoRedflaqHelps = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F5F0EB' }} className="py-12 md:py-20 px-6">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: '#1F1F1F',
          textAlign: 'center',
          marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          Trusting relationships begin with <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>information.</em>
        </h2>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 18,
          color: '#555555',
          textAlign: 'center',
          marginBottom: 56,
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          One safety tool for every trust decision you make.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ marginBottom: 40 }}>
          {personas.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: '48px 32px',
                  border: p.prominent ? '1.5px solid #6B4EFF40' : '1px solid #E6E0DA',
                  boxShadow: p.prominent ? '0 4px 32px rgba(107,78,255,0.08)' : '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,78,255,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = p.prominent ? '0 4px 32px rgba(107,78,255,0.08)' : '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: '#E9E3FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={24} color="#6B4EFF" aria-label={p.title} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: '#1F1F1F',
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
                      color: '#555555',
                      borderBottom: '1px solid #E6E0DA',
                      padding: '12px 0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}>
                      <span style={{ color: '#6B4EFF', flexShrink: 0, marginTop: 2 }}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom text */}
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: '#888888',
          textAlign: 'center',
          maxWidth: 700,
          margin: '0 auto 32px',
          lineHeight: 1.7,
        }}>
          Built in South Africa for South Africans. Grounded in GBVF realities. Powered by public‑record data. Designed to protect women and communities first.
        </p>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/safety-tips')}
            style={{
              background: 'transparent',
              color: '#6B4EFF',
              padding: '14px 36px',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              border: '2px solid #6B4EFF',
              cursor: 'pointer',
              borderRadius: 50,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6B4EFF'; e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B4EFF'; }}
          >
            See All Safety Scenarios
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhoRedflaqHelps;
