import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const TrappedUserSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      background: '#0d0d1a',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>

        <h2 style={{
          fontSize: 'clamp(26px, 4vw, 44px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 20,
        }}>
          <span style={{ ...inter, color: '#ffffff' }}>Not Ready to </span>
          <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Leave Yet?</span>
        </h2>

        <p style={{
          ...inter,
          fontSize: 'clamp(15px, 1.8vw, 18px)',
          color: '#d1d1d6',
          lineHeight: 1.85,
          maxWidth: 680,
          margin: '0 auto 36px',
          fontWeight: 400,
        }}>
          That's not a question we judge. But here's what we know: you're not staying
          because you love him. You're staying because leaving feels more dangerous
          than the danger you already know. That's not weakness — that's South Africa.
          Start documenting. Not for the court. For the version of you who will be ready.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={() => navigate('/dashboard/journal')}
            style={{
              ...inter, fontWeight: 700, fontSize: 16, color: 'white',
              background: '#6C35DE', border: 'none', padding: '16px 40px',
              borderRadius: 4, cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#7B42EE'}
            onMouseLeave={e => e.currentTarget.style.background = '#6C35DE'}
          >
            Start Your Safety Journal
          </button>
        </div>

        {/* Viral sharing CTA */}
        <p style={{
          ...inter,
          fontSize: 16,
          fontWeight: 600,
          color: '#6C35DE',
          cursor: 'pointer',
          display: 'inline-block',
        }}
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'RedFlaq', text: 'Before you trust, RedFlaq first.', url: 'https://redflaq.com' });
            } else {
              navigator.clipboard.writeText('https://redflaq.com');
            }
          }}
        >
          Send this to someone who needs it.
        </p>
      </div>
    </section>
  );
};

export default TrappedUserSection;
