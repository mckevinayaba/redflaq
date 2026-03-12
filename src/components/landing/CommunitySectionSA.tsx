import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Heart } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";
import groupImg from "@/assets/sa-women-group.jpg";

const CommunitySectionSA = () => {
  const { ref, isVisible } = useScrollReveal();
  const { guardedAction } = useAuthGuard();
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`} style={{
      background: '#F5F0EB',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-tag" style={{ color: '#6B4EFF', marginBottom: 16 }}>
              Built For South African Women
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(32px, 4.5vw, 56px)', color: '#1F1F1F',
              lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              You're not paranoid.<br />
              You're <em style={{ fontStyle: 'italic', color: '#6B4EFF' }}>prepared.</em>
            </h2>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 17,
              color: '#555555', lineHeight: 1.8, marginBottom: 36,
            }}>
              Before the spare key. Before moving in together. Before introducing
              him to your children. South African women are using RedFlaq to verify
              public records and make informed decisions about who to trust.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => guardedAction()} style={{
                background: '#6B4EFF', color: 'white', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                border: 'none', cursor: 'pointer', borderRadius: 50,
                boxShadow: '0 4px 20px rgba(107,78,255,0.25)', transition: 'all 0.25s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#5539E8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#6B4EFF'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Protect Yourself Now
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2"
                style={{
                  background: 'transparent', border: '2px solid #6B4EFF',
                  color: '#6B4EFF', padding: '16px 32px', fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 15, cursor: 'pointer', borderRadius: 50, transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E9E3FF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Heart className="h-4 w-4" /> Share RedFlaq
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className={`organic-frame-2 organic-scroll-in ${isVisible ? 'visible' : ''}`} style={{ height: 550 }}>
              <img
                src={groupImg}
                alt="Group of diverse South African women standing together confidently on a Johannesburg rooftop"
                loading="lazy"
                width="896"
                height="1152"
                style={{ filter: 'brightness(1.1) contrast(1.05)' }}
              />
            </div>
          </div>
        </div>
      </div>
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </section>
  );
};

export default CommunitySectionSA;
