import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

const ProtectionSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      background: '#0d0d1a',
      padding: '80px 24px',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <p style={{
          ...inter,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase' as const,
          color: '#6C35DE',
          marginBottom: 24,
        }}>
          THIS IS NOT JUST ABOUT YOU
        </p>

        <h2 style={{
          ...inter,
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1.15,
          marginBottom: 28,
        }}>
          You are not protecting yourself.<br />
          You are protecting every woman<br />
          who trusts the next person he meets.
        </h2>

        <p style={{
          ...inter,
          fontSize: 16,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.75,
          maxWidth: 540,
          margin: '0 auto 20px',
        }}>
          Every check you run. Every pattern you name. Every journal entry you make.
          It builds a South Africa where the next woman has more to go on than her instincts alone.
        </p>

        <p style={{
          ...inter,
          fontSize: 15,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.75,
          maxWidth: 540,
          margin: '0 auto 36px',
        }}>
          Every woman who checked and stayed silent still changed the data.
          Every pattern named makes the next woman's search faster.
          This is not individual safety. This is infrastructure.{' '}
          <span style={{ color: '#6C35DE', fontWeight: 700 }}>Before You Trust, RedFlaq First.</span>
        </p>

        <button
          onClick={() => navigate('/signup')}
          style={{
            ...inter,
            fontWeight: 700,
            fontSize: 15,
            color: '#ffffff',
            background: '#6C35DE',
            border: 'none',
            padding: '14px 32px',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#7B42EE'}
          onMouseLeave={e => e.currentTarget.style.background = '#6C35DE'}
        >
          Create Free Safety Base
        </button>
      </div>
    </section>
  );
};

export default ProtectionSection;
