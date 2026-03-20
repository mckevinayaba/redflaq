const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const ProblemAgitation = () => {
  return (
    <section style={{ background: 'white', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Label */}
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
          THE TRUTH
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 32,
        }}>
          The Truth South Africa Isn't Ready to Hear
        </h2>

        <div style={{ ...font, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#555555', lineHeight: 1.85 }}>
          <p style={{ marginBottom: 8 }}>You were told:</p>
          <div style={{ marginBottom: 20, paddingLeft: 4 }}>
            <p>→ Meet in public places</p>
            <p>→ Share your location with a friend</p>
            <p>→ Tell someone where you'll be</p>
            <p>→ Trust your instincts</p>
          </div>
          <p style={{ fontWeight: 700, color: '#1F1F1F', marginBottom: 24, fontSize: 'clamp(15px, 2vw, 18px)' }}>
            And women still died.
          </p>
          <p style={{ marginBottom: 20 }}>Not because those behaviors don't work.</p>
          <div style={{ marginBottom: 24 }}>
            <p>But because they protect you from <strong>strangers</strong>.</p>
            <p style={{ color: '#888' }}>Not from the person you let into your life.</p>
            <p style={{ color: '#888' }}>Not from the person who seemed perfect for 3 months.</p>
            <p style={{ color: '#888' }}>Not from the person your family loves.</p>
            <p style={{ color: '#888' }}>Not from the person who has the spare key.</p>
          </div>

          {/* Stat callout */}
          <div style={{
            background: '#F5F0EB', borderRadius: 14, padding: 'clamp(16px, 3vw, 24px)',
            marginBottom: 28, border: '1px solid #E6E0DA',
          }}>
            <p style={{ fontWeight: 700, color: '#1F1F1F', fontSize: 'clamp(16px, 2.2vw, 20px)', marginBottom: 12 }}>
              73% of women killed by intimate partners knew their killer had a history of violence.
            </p>
            <p style={{ color: '#888' }}>But they never checked.</p>
            <p style={{ color: '#888' }}>Because no one told them they could.</p>
            <p style={{ color: '#888' }}>Because the tools didn't exist.</p>
            <p style={{ color: '#888' }}>Because awareness campaigns taught fear, not action.</p>
          </div>

          {/* Core statement */}
          <div style={{ borderLeft: '3px solid #7C3AED', paddingLeft: 20 }}>
            <p style={{ fontWeight: 700, color: '#1F1F1F', fontSize: 'clamp(16px, 2vw, 19px)', marginBottom: 6 }}>
              RedFlaq is not another awareness campaign.
            </p>
            <p style={{ fontWeight: 700, color: '#7C3AED', fontSize: 'clamp(16px, 2vw, 19px)' }}>
              RedFlaq is the action.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemAgitation;
