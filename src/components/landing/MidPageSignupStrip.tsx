import { useNavigate } from "react-router-dom";

const MidPageSignupStrip = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      background: '#6B4EFF',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 'clamp(20px, 2.5vw, 28px)',
        color: '#FFFFFF',
        marginBottom: 24,
        lineHeight: 1.3,
      }}>
        Before you trust, set up your safety base. Sign up free in under 60 seconds.
      </p>
      <button
        onClick={() => navigate('/signup')}
        style={{
          background: '#FFFFFF',
          color: '#6B4EFF',
          padding: '14px 36px',
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 15,
          border: 'none',
          cursor: 'pointer',
          borderRadius: 50,
          transition: 'all 0.25s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        Sign Up Free
      </button>
    </section>
  );
};

export default MidPageSignupStrip;
