const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

const IsolationStatement = () => (
  <section style={{
    background: '#08080f',
    padding: '8rem 24px',
    textAlign: 'center',
  }}>
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{
        fontSize: 'clamp(36px, 6vw, 64px)',
        fontWeight: 900,
        lineHeight: 1.1,
        letterSpacing: '-0.03em',
      }}>
        <span style={{
          ...inter,
          display: 'block',
          color: '#C0392B',
          marginBottom: '0.15em',
        }}>
          9 women.
        </span>
        <span style={{
          ...inter,
          display: 'block',
          color: '#ffffff',
          marginBottom: '0.5em',
        }}>
          Every day.
        </span>
      </div>
      <p style={{
        ...inter,
        fontSize: 'clamp(16px, 2vw, 22px)',
        fontWeight: 400,
        color: '#8b8b91',
        lineHeight: 1.6,
        marginTop: '0.5em',
      }}>
        Most of them knew their killers.
      </p>
    </div>
  </section>
);

export default IsolationStatement;
