import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Lock, Eye } from "lucide-react";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { Icon: Shield, title: "Public Records Only", desc: "We never create data. We surface what already exists in public‑record warning lists." },
    { Icon: Lock, title: "POPIA‑Aware", desc: "Every search requires a legitimate purpose and consent. We minimise data and respect everyone's rights." },
    { Icon: Eye, title: "Confidential Use", desc: "The person you check is not notified. Results are for your safety decisions, not public shaming." },
  ];

  return (
    <section id="about" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{
      background: 'linear-gradient(180deg, #F3F0FF 0%, #EDE9FE 50%, #F7F4F0 100%)',
      padding: '100px 24px 120px',
      marginTop: 0,
    }}>
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

        {/* Principle cards — white elevated style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(card => (
            <div key={card.title} style={{
              background: '#FFFFFF',
              border: '1px solid rgba(124,58,237,0.12)',
              padding: '36px 28px',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.08)';
              }}
            >
              {/* Icon on purple-tinted circle */}
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: 'rgba(124,58,237,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <card.Icon style={{ width: 24, height: 24, color: '#7C3AED' }} />
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: '#1A1523', marginBottom: 10 }}>{card.title}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#6B7280', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
