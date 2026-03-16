import { useNavigate } from "react-router-dom";
import { BookOpen, ShieldCheck, HeartHandshake, Lock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: BookOpen,
    title: "My Safety Journal",
    description: "A private, time-stamped journal where you can record incidents, worries and patterns. Add photos, videos or audio, and export your entries to share with a lawyer, social worker or trusted person. Only you can see your journal when logged in.",
  },
  {
    icon: ShieldCheck,
    title: "Saved Checks",
    description: "Keep a history of everyone you have checked on RedFlaq. Re-download reports, show them to someone you trust, and track your own safety decisions over time.",
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
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: '#F3F0FF', borderTop: '1px solid #E6E0DA', borderBottom: '1px solid #E6E0DA' }}>
      <div className="py-16 md:py-24 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
          }}>Free Account</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 3.5vw, 44px)',
            color: '#1F1F1F', marginTop: 12, letterSpacing: '-0.02em',
          }}>
            Create your free safety account
          </h2>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#555555',
            marginTop: 12, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto',
          }}>
            No credit card required. Built for South African women and communities.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 reveal-stagger ${isVisible ? 'visible' : ''}`} style={{ marginBottom: 40 }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card-lift reveal-child" style={{
                background: '#FFFFFF', borderRadius: 8,
                padding: '32px 28px', border: '1px solid #E6E0DA',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8,
                  background: '#F1ECFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon size={20} color="#6B4EFF" strokeWidth={2} aria-label={f.title} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: 17, color: '#1F1F1F', marginBottom: 10,
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 13,
                  lineHeight: 1.7, color: '#555555',
                }}>
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: '#6B4EFF', color: '#FFFFFF',
              padding: '14px 36px', fontFamily: "'Syne', sans-serif",
              fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
              borderRadius: 4, transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#5539E8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6B4EFF'; }}
          >
            Sign Up Free
          </button>
        </div>

        <div className="flex items-center justify-center gap-2" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Lock size={13} color="#888888" style={{ flexShrink: 0 }} />
          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888', lineHeight: 1.6,
          }}>
            Your data is encrypted and private. RedFlaq never shares your journal or check history without your permission.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeAccountSection;
