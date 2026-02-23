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
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{
      background: '#F7F4F0', borderTop: '1.5px solid #D6D3CD',
      padding: '48px 40px 56px', textAlign: 'center', overflow: 'hidden', position: 'relative',
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
          <button onClick={() => guardedAction()} className="btn-primary hover:-translate-y-0.5 hover:shadow-lg transition-all">
            Run a Safety Check — R99
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="btn-secondary hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
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
