import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Heart } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";

const FinalCTAPlinq = () => {
  const { guardedAction } = useAuthGuard();
  const { ref, isVisible } = useScrollReveal();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{
      background: '#0F0A1A', position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '40%', height: '100%',
        background: 'radial-gradient(ellipse at 80% 50%, rgba(107,78,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="py-16 md:py-24 px-6" style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 5vw, 56px)',
          lineHeight: 1.08, color: 'white', marginBottom: 20, letterSpacing: '-0.02em',
        }}>
          Before you trust,<br /><em style={{ fontStyle: 'italic', color: '#A78BFA' }}>verify.</em>
        </h2>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 16,
          color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 40,
        }}>
          Clarity creates safety. Every search you make helps protect not just yourself but the next person who asks the same question.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={() => guardedAction()} style={{
            background: '#6B4EFF', color: 'white',
            padding: '16px 40px', fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer',
            borderRadius: 4, transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#5539E8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6B4EFF'; }}
          >
            Start Your First Check
          </button>
          <button onClick={() => setShareOpen(true)} className="inline-flex items-center gap-2" style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.8)',
            padding: '16px 32px', fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: 15, cursor: 'pointer', borderRadius: 4,
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
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
