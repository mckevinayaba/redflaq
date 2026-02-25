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
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 500,
      }}
    >
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url(${skylineImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'rgba(13, 11, 14, 0.75)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 700, margin: '0 auto',
        textAlign: 'center',
        padding: '100px 40px',
      }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.1, color: 'white', marginBottom: 20,
        }}>
          Before you trust,<br />
          <em style={{ fontStyle: 'italic' }}>verify.</em>
        </h2>

        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.8)',
          lineHeight: 1.7, marginBottom: 40,
        }}>
          Clarity creates safety. Every search you make helps protect not just yourself but the next person who asks the same question.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => guardedAction()}
            className="hover:-translate-y-0.5 hover:shadow-lg transition-all"
            style={{
              background: 'white', color: '#0D0B0E', padding: '18px 48px',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18,
              border: 'none', cursor: 'pointer',
            }}
          >
            Start Your First Check
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            style={{
              background: 'transparent', border: '2px solid rgba(255,255,255,0.6)',
              color: 'white', padding: '18px 32px',
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16,
              cursor: 'pointer',
            }}
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
