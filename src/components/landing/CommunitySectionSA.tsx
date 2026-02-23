import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Heart } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";

const CommunitySectionSA = () => {
  const { ref, isVisible } = useScrollReveal();
  const { guardedAction } = useAuthGuard();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#FAF5FF', padding: '40px 40px 48px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <div className="section-tag justify-center" style={{ color: '#7C3AED', marginBottom: 24 }}>
          Built For Women. Available To All.
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 3.5vw, 44px)', color: '#2D2235',
          lineHeight: 1.15, marginBottom: 20,
        }}>
          Before you give him a spare key, give yourself{" "}
          <em style={{ fontStyle: 'italic', color: '#7C3AED' }}>clarity.</em>
        </h2>

        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 15,
          color: '#78716C', lineHeight: 1.8, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px',
        }}>
          Built for women facing GBV first, but useful for anyone: flat‑mates, landlords, childcare providers, employers and more.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => guardedAction()} style={{
            background: '#7C3AED', color: 'white', padding: '16px 32px',
            fontFamily: "'Syne', sans-serif", fontWeight: 700, border: 'none', cursor: 'pointer',
          }} className="hover:!bg-[#6D28D9] transition-all hover:-translate-y-0.5 hover:shadow-lg">
            Run a Safety Check — R99
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all"
            style={{ background: 'transparent', border: '2px solid #7C3AED', color: '#7C3AED', padding: '16px 32px', fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: 'pointer' }}
          >
            <Heart className="h-4 w-4" /> Share RedFlaq
          </button>
        </div>
      </div>
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </section>
  );
};

export default CommunitySectionSA;
