import { useNavigate } from "react-router-dom";
import { FileText, Search, AlertCircle, Lock } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "My Safety Journal",
    description: "A private, time‑stamped journal where you can record incidents, worries and patterns. Add photos, videos or audio, and export your entries to share with a lawyer, social worker or trusted person. Only you can see your journal when logged in.",
  },
  {
    icon: Search,
    title: "Saved Checks",
    description: "Keep a history of everyone you have checked on RedFlaq. Re‑download reports, show them to someone you trust, and track your own safety decisions over time.",
  },
  {
    icon: AlertCircle,
    title: "All Safety Resources",
    description: "Instant access to GBV helplines, provincial resources, protection order information and practical safety tips for dating, parenting, tenants, domestic workers and more in South Africa.",
  },
];

const FreeAccountSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F5F3FF' }} className="py-12 md:py-20 px-6">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16, textAlign: 'center' }}>Free Account</div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          color: '#1A1523',
          textAlign: 'center',
          marginBottom: 12,
          letterSpacing: '-0.02em',
        }}>
          Create your free safety account
        </h2>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 15,
          color: '#6B7280',
          textAlign: 'center',
          maxWidth: 520,
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.7,
          marginBottom: 56,
        }}>
          No credit card required. Built for South African women and communities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ marginBottom: 40 }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
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
                  <Icon size={24} color="#7C3AED" aria-label={f.title} />
                </div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 20,
                  color: 'white',
                  marginBottom: 12,
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.7)',
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
            style={{
              background: '#7C3AED',
              color: '#FFFFFF',
              padding: '16px 40px',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              borderRadius: 50,
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Sign Up Free
          </button>
        </div>

        {/* Trust line */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          maxWidth: 640, margin: '0 auto',
        }}>
          <Lock size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 12,
            color: '#9CA3AF',
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
