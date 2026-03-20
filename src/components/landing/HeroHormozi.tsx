import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const HeroHormozi = () => {
  const navigate = useNavigate();
  const { guardedAction } = useAuthGuard();

  return (
    <section style={{ background: '#F5F0EB', paddingTop: 120, paddingBottom: 60 }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        {/* Lead-in */}
        <p style={{
          ...font, fontSize: 'clamp(15px, 2.5vw, 18px)', color: '#1F1F1F',
          fontWeight: 500, marginBottom: 28, letterSpacing: '0.01em',
        }}>
          Before you trust, RedFlaq First.
        </p>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.12)',
          padding: '8px 18px', borderRadius: 50, marginBottom: 32,
        }}>
          <span style={{ ...mono, fontSize: 10, fontWeight: 600, color: '#7C3AED', letterSpacing: '0.08em', lineHeight: 1.4, textAlign: 'center' as const }}>
            Built in South Africa for people facing GBV and violence — and anyone protecting their loved ones.
          </span>
        </div>

        {/* Main headline */}
        <h1 style={{
          ...font, fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 28,
        }}>
          November 2025: The South African government declared Gender-Based Violence{' '}
          <span style={{ color: '#7C3AED' }}>a national disaster.</span>
        </h1>

        <div style={{
          ...font, fontSize: 'clamp(15px, 2vw, 18px)', color: '#555555',
          lineHeight: 1.75, marginBottom: 32,
        }}>
          <p style={{ marginBottom: 20 }}>
            Not because women don't know it's dangerous.
          </p>
          <p style={{ fontWeight: 600, color: '#1F1F1F' }}>
            But because knowing hasn't changed behavior.
          </p>
        </div>

        {/* Subheadline — uncomfortable truth */}
        <div style={{
          background: 'white', border: '1px solid #E6E0DA',
          borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)',
          marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{ ...font, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#555555', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 12 }}>Meeting in a public place didn't stop it.</p>
            <p style={{ marginBottom: 12 }}>Sharing your location didn't stop it.</p>
            <p style={{ marginBottom: 20 }}>A good first impression didn't stop it.</p>
            <p style={{ marginBottom: 12 }}>The danger doesn't reveal itself on the first date.</p>
            <p style={{ marginBottom: 4 }}>It reveals itself at Month 3. Month 6. Month 9.</p>
            <p style={{ marginBottom: 4, color: '#888' }}>When you're already emotionally invested.</p>
            <p style={{ marginBottom: 4, color: '#888' }}>When you're already financially entangled.</p>
            <p style={{ marginBottom: 16, color: '#888' }}>When you're already isolated from support.</p>
            <p style={{ fontWeight: 700, color: '#1F1F1F', fontSize: 'clamp(15px, 2vw, 17px)' }}>
              Most harm comes from someone you trusted.
            </p>
          </div>
        </div>

        {/* Core statement */}
        <div style={{
          borderLeft: '3px solid #7C3AED', paddingLeft: 20,
          marginBottom: 36,
        }}>
          <p style={{
            ...font, fontSize: 'clamp(16px, 2.2vw, 20px)', fontWeight: 700,
            color: '#1F1F1F', lineHeight: 1.6, marginBottom: 8,
          }}>
            RedFlaq exists for one moment: Before that trust is given.
          </p>
          <p style={{
            ...font, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#555555', lineHeight: 1.6,
          }}>
            And for every moment after: When something feels wrong but you can't prove it yet.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...font, fontWeight: 700, fontSize: 16, color: 'white',
              background: '#7C3AED', border: 'none', padding: '16px 36px',
              borderRadius: 50, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              width: '100%', maxWidth: 420, textAlign: 'center' as const,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(124,58,237,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.3)'; }}
          >
            Create Your Free Safety Base
          </button>
          <p style={{ ...font, fontSize: 12, color: '#888', maxWidth: 420, lineHeight: 1.5 }}>
            100% free account. No credit card required. Pay only when you verify someone's criminal record (from R99).
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works-hormozi');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              ...font, fontWeight: 600, fontSize: 14, color: '#7C3AED',
              background: 'transparent', border: '1.5px solid #7C3AED',
              padding: '12px 28px', borderRadius: 50, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroHormozi;
