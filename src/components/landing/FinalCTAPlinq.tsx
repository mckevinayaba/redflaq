import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Heart } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";
import skylineImg from "@/assets/joburg-skyline-dusk.jpg";

const FinalCTAPlinq = () => {
  const { guardedAction } = useAuthGuard();
  const { ref, isVisible } = useScrollReveal();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ position: 'relative', overflow: 'hidden', minHeight: 500 }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: `url(${skylineImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(180deg, rgba(15,10,26,0.85), rgba(26,16,53,0.9))' }} />
      <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '120px 24px' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.08, color: 'white', marginBottom: 20, letterSpacing: '-0.02em' }}>
          Before you trust,<br /><em style={{ fontStyle: 'italic' }}>verify.</em>
        </h2>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 40 }}>
          Clarity creates safety. Every search you make helps protect not just yourself but the next person who asks the same question.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => guardedAction()} style={{ background: 'white', color: '#7C3AED', padding: '18px 48px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer', borderRadius: 50, transition: 'all 0.25s ease', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)'; }}
          >
            Start Your First Check
          </button>
          <button onClick={() => setShareOpen(true)} className="inline-flex items-center gap-2" style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', color: 'white', padding: '18px 32px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, cursor: 'pointer', borderRadius: 50, transition: 'all 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Heart className="h-4 w-4" /> Share RedFlaq
          </button>
        </div>
      </div>
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </section>
  );
};

export default FinalCTAPlinq;
