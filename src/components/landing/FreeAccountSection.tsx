import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: "📝",
    title: "My Safety Journal",
    description: "A private, time-stamped journal where you can record incidents, worries and patterns. Add photos, videos or audio, and export your entries to share with a lawyer, social worker or trusted person. Only you can see your journal when logged in.",
  },
  {
    icon: "🔍",
    title: "Saved Checks",
    description: "Keep a history of everyone you have checked on RedFlaq. Re-download reports, show them to someone you trust, and track your own safety decisions over time.",
  },
  {
    icon: "🆘",
    title: "All Safety Resources",
    description: "Instant access to GBV helplines, provincial resources, protection order information and practical safety tips for dating, parenting, tenants, domestic workers and more in South Africa.",
  },
];

const FreeAccountSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F5F3FF', padding: '80px 24px' }} className="py-[60px] md:py-[80px]">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
          fontSize: 16,
          color: '#6B7280',
          textAlign: 'center',
          marginBottom: 48,
        }}>
          No credit card required. Always free.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: 40 }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: '#FFFFFF',
              borderRadius: 12,
              padding: 32,
              boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{f.icon}</span>
              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 18,
                color: '#1A1523',
                marginBottom: 12,
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                lineHeight: 1.7,
                color: '#4B4453',
              }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
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
      </div>
    </section>
  );
};

export default FreeAccountSection;
