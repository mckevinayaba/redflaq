import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Lock, Eye } from "lucide-react";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { Icon: Shield, title: "Public Records Only", desc: "We never create data. We surface what already exists in public‑record warning lists.", glow: 'rgba(124,58,237,0.2)' },
    { Icon: Lock, title: "POPIA‑Aware", desc: "Every search requires a legitimate purpose and consent. We minimise data and respect everyone's rights.", glow: 'rgba(168,85,247,0.2)' },
    { Icon: Eye, title: "Confidential Use", desc: "The person you check is not notified. Results are for your safety decisions, not public shaming.", glow: 'rgba(109,40,217,0.2)' },
  ];

  return (
    <section id="about" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '120px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(36px, 4vw, 48px)', color: '#1A1523', textAlign: 'center', marginBottom: 24, letterSpacing: '-0.02em' }}>
          Why RedFlaq <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Exists</em>
        </h2>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#6B7280', lineHeight: 1.8, textAlign: 'center', maxWidth: 640, margin: '0 auto 40px' }}>
          <p>South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every few hours. Many tragedies had warning signs in public records — but people couldn't access them easily.</p>
        </div>

        {/* Founder quote */}
        <div style={{ maxWidth: 700, margin: '0 auto 48px', borderLeft: '4px solid #7C3AED', paddingLeft: 24 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontStyle: 'italic', color: '#1A1523', lineHeight: 1.6 }}>
            "Traditional background check services exist, but they are slow, bureaucratic, and designed for businesses, not individuals. We built RedFlaq so women and communities can access key public‑record warnings quickly and affordably."
          </p>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: '#6B7280', marginTop: 12 }}>
            — McKevin Ayaba, Founder of RedFlaq
          </div>
        </div>

        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontStyle: 'italic', color: '#7C3AED', textAlign: 'center', marginBottom: 48 }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Principle cards — dark bento style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(card => (
            <div key={card.title} style={{
              background: 'linear-gradient(145deg, #0F0A1A, #1A1035)',
              border: '1px solid rgba(124,58,237,0.2)',
              padding: '32px 28px',
              borderRadius: 16,
              position: 'relative',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon glow */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 80, height: 80,
                background: `radial-gradient(circle, ${card.glow}, transparent 70%)`,
                filter: 'blur(20px)', pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <card.Icon style={{ width: 28, height: 28, color: '#A855F7', marginBottom: 16 }} />
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 10 }}>{card.title}</div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
