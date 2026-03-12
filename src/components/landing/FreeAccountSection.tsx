import { useNavigate } from "react-router-dom";
import { BookOpen, ShieldCheck, HeartHandshake, Lock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: BookOpen,
    title: "My Safety Journal",
    description: "A private, time‑stamped journal where you can record incidents, worries and patterns. Add photos, videos or audio, and export your entries to share with a lawyer, social worker or trusted person. Only you can see your journal when logged in.",
  },
  {
    icon: ShieldCheck,
    title: "Saved Checks",
    description: "Keep a history of everyone you have checked on RedFlaq. Re‑download reports, show them to someone you trust, and track your own safety decisions over time.",
  },
  {
    icon: HeartHandshake,
    title: "All Safety Resources",
    description: "Instant access to GBV helplines, provincial resources, protection order information and practical safety tips for dating, parenting, tenants, domestic workers and more in South Africa.",
  },
];

const FreeAccountSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: '#E9E3FF' }}>
      <div className="py-12 md:py-20 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#6B4EFF', marginBottom: 16, textAlign: 'center' }}>Free Account</div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          color: '#1F1F1F',
          textAlign: 'center',
          marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          Create your free safety account
        </h2>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 15,
          color: '#555555',
          textAlign: 'center',
          maxWidth: 520,
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.7,
          marginBottom: 56,
        }}>
          No credit card required. Built for South African women and communities.
        </p>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 reveal-stagger ${isVisible ? 'visible' : ''}`} style={{ marginBottom: 40 }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="card-lift reveal-child"
                style={{
                  background: '#FFFFFF',
                  borderRadius: 18,
                  padding: '48px 32px',
                  border: '1px solid #E6E0DA',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div className="icon-hover" style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: '#F1ECFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <Icon size={24} color="#6B4EFF" strokeWidth={2} aria-label={f.title} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: '#1F1F1F',
                  marginBottom: 12,
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: '#555555',
                }}>
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <button
            onClick={() => navigate('/signup')}
            className="btn-scale"
            style={{
              background: '#6B4EFF',
              color: '#FFFFFF',
              padding: '16px 40px',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              borderRadius: 50,
              boxShadow: '0 4px 20px rgba(107,78,255,0.25)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#5539E8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6B4EFF'; }}
          >
            Sign Up Free
          </button>
        </div>

        {/* Trust line */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          maxWidth: 640, margin: '0 auto',
        }}>
          <Lock size={14} color="#888888" strokeWidth={2} style={{ flexShrink: 0 }} />
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 12,
            color: '#888888',
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            Your data is encrypted and private. RedFlaq never shares your journal or check history without your permission, except where required by South African law.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeAccountSection;
