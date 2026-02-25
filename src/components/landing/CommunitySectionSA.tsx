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
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#1A1A1A', padding: '120px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div>
            <div className="section-tag" style={{ color: '#A78BFA', marginBottom: 16 }}>
              Built For South African Women
            </div>

            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(32px, 4.5vw, 56px)', color: 'white',
              lineHeight: 1.1, marginBottom: 20,
            }}>
              You're not paranoid.<br />
              You're <em style={{ fontStyle: 'italic', color: '#A78BFA' }}>prepared.</em>
            </h2>

            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 18,
              color: '#D1D5DB', lineHeight: 1.9, marginBottom: 32,
            }}>
              Before the spare key. Before moving in together. Before introducing
              him to your children. South African women are using RedFlaq to verify
              public records and make informed decisions about who to trust.
            </p>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => guardedAction()} style={{
                background: '#7C3AED', color: 'white', padding: '16px 36px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, border: 'none', cursor: 'pointer',
              }} className="hover:!bg-[#6D28D9] transition-all hover:-translate-y-0.5 hover:shadow-lg">
                Protect Yourself Now
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-2 hover:-translate-y-0.5 transition-all"
                style={{ background: 'transparent', border: '2px solid #A78BFA', color: '#A78BFA', padding: '16px 32px', fontFamily: "'Syne', sans-serif", fontWeight: 700, cursor: 'pointer' }}
              >
                <Heart className="h-4 w-4" /> Share RedFlaq
              </button>
            </div>
          </div>

          {/* Right — Image */}
          <div className={`organic-frame-2 organic-scroll-in ${isVisible ? 'visible' : ''}`} style={{ height: 550, transform: 'translateY(-30px)' }}>
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
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </section>
  );
};

export default CommunitySectionSA;
