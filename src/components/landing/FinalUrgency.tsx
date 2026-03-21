import { useNavigate } from "react-router-dom";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const FinalUrgency = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: 'white', padding: 'clamp(56px, 10vw, 100px) 20px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 20, justifyContent: 'center' }}>
          Before It's Too Late
        </div>

        <h2 style={{
          ...serif, fontSize: 'clamp(28px, 4.5vw, 44px)',
          color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 28,
        }}>
          Right now, a South African woman is trusting someone she{' '}
          <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>shouldn't.</em>
        </h2>

        <div style={{
          ...sans, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#555',
          lineHeight: 1.8, textAlign: 'left', maxWidth: 600, margin: '0 auto',
          marginBottom: 36,
        }}>
          <p style={{ marginBottom: 8 }}>She didn't RedFlaq.</p>
          <p style={{ marginBottom: 8 }}>She thought she was being careful.</p>
          <p style={{ marginBottom: 8 }}>She met him in public. She shared her location.</p>
          <p style={{ marginBottom: 20 }}>She told her friends where she'd be.</p>
          <p style={{ marginBottom: 4, color: '#888' }}>And in 3 months, 6 months, 9 months — when his true behavior reveals itself — she'll wish she had RedFlaq'd him on Day 1.</p>
          <div style={{ marginTop: 24 }}>
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
          <p style={{ ...serif, fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#7C3AED', fontStyle: 'italic', marginBottom: 8 }}>
            Before you trust, RedFlaq first.
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...sans, fontWeight: 700, fontSize: 17, color: 'white',
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
          <p style={{ ...sans, fontSize: 12, color: '#888', maxWidth: 360, lineHeight: 1.5 }}>
            No credit card required. 100% free forever. Pay only when you verify someone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalUrgency;
