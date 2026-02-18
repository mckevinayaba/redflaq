import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FinalCTAPlinq = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal();

  const handleVerify = () => {
    if (isAuthenticated) {
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/signup');
    }
  };

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{
      background: '#F7F4F0', borderTop: '1.5px solid #D6D3CD',
      padding: '100px 40px', textAlign: 'center', overflow: 'hidden', position: 'relative',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        fontFamily: "'DM Serif Display', serif", fontSize: 180,
        color: '#EDE9E3', pointerEvents: 'none', zIndex: 0, whiteSpace: 'nowrap',
      }}>VERIFY</div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1.1, color: '#2D2235', marginBottom: 20,
        }}>
          Before you trust,<br />
          <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>verify.</em>
        </h2>

        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#4B4453',
          lineHeight: 1.7, marginBottom: 40,
        }}>
          Clarity creates safety. Every search you make helps protect not just yourself but the next person who asks the same question.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={handleVerify} className="btn-primary hover:-translate-y-0.5 hover:shadow-lg transition-all">
            Verify Someone Now — R99
          </button>
          <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary hover:-translate-y-0.5 transition-all">
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTAPlinq;
