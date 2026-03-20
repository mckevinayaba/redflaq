import { useNavigate } from "react-router-dom";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const FinalUrgency = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: 'white', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' as const }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 20 }}>
          BEFORE IT'S TOO LATE
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 28,
        }}>
          Right Now, a South African Woman Is Trusting Someone She Shouldn't
        </h2>

        <div style={{
          ...font, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#555555',
          lineHeight: 1.8, textAlign: 'left' as const, maxWidth: 600, margin: '0 auto',
          marginBottom: 36,
        }}>
          <p style={{ marginBottom: 8 }}>She didn't check.</p>
          <p style={{ marginBottom: 8 }}>She thought she was being careful.</p>
          <p style={{ marginBottom: 8 }}>She met him in public. She shared her location.</p>
          <p style={{ marginBottom: 20 }}>She told her friends where she'd be.</p>
          <p style={{ marginBottom: 4, color: '#888' }}>And in 3 months, 6 months, 9 months — when his true behavior reveals itself — she'll wish she had verified him on Day 1.</p>
          <div style={{ marginTop: 24, marginBottom: 4 }}>
            <p style={{ fontWeight: 600, color: '#1F1F1F' }}>Don't be her.</p>
            <p style={{ fontWeight: 600, color: '#1F1F1F' }}>Don't let your sister be her.</p>
            <p style={{ fontWeight: 600, color: '#1F1F1F' }}>Don't let your daughter be her.</p>
            <p style={{ fontWeight: 600, color: '#1F1F1F' }}>Don't let your friend be her.</p>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #E6E0DA', paddingTop: 28,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <p style={{ ...font, fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 700, color: '#7C3AED', marginBottom: 8 }}>
            Before you trust, RedFlaq first.
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...font, fontWeight: 700, fontSize: 17, color: 'white',
              background: '#7C3AED', border: 'none', padding: '18px 44px',
              borderRadius: 50, cursor: 'pointer',
              boxShadow: '0 6px 28px rgba(124,58,237,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 36px rgba(124,58,237,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.35)'; }}
          >
            Create Your Free Safety Base Now
          </button>
          <p style={{ ...font, fontSize: 12, color: '#888', maxWidth: 360, lineHeight: 1.5 }}>
            No credit card required. 100% free forever. Pay only when you verify someone.
          </p>
          <p style={{ ...font, fontSize: 11, color: '#aaa' }}>
            You can delete your account anytime. Your data, your control.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalUrgency;
