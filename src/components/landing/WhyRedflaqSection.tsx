import { useScrollReveal } from "@/hooks/useScrollReveal";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { icon: "🛡️", title: "Public Records Only", desc: "We never create data. We surface what already exists in public‑record warning lists." },
    { icon: "🔒", title: "POPIA‑Aware", desc: "Every search requires a legitimate purpose and consent. We minimise data and respect everyone's rights." },
    { icon: "✓", title: "Confidential Use", desc: "The person you check is not notified. Results are for your safety decisions, not public shaming." },
  ];

  return (
    <section id="about" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '100px 40px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(36px, 4vw, 48px)', color: '#2D2235', textAlign: 'center', marginBottom: 40 }}>
          Why RedFlaq <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Exists</em>
        </h2>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, color: '#4B4453', lineHeight: 1.8 }} className="space-y-5">
          <p>South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every few hours. Tens of thousands of sexual offences are reported each year.</p>
          <p>Many of these tragedies had warning signs in public records. The information existed, but ordinary people couldn't access it easily or quickly.</p>
          <p>Traditional background checks are expensive, slow and built for companies — not for women or communities trying to stay safe. RedFlaq makes it R99 and under a minute.</p>
        </div>

        {/* Founder quote */}
        <div style={{ maxWidth: 700, margin: '40px auto', borderLeft: '4px solid #7C3AED', paddingLeft: 24 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontStyle: 'italic', color: '#2D2235', lineHeight: 1.6 }}>
            "Traditional background check services exist, but they are slow, bureaucratic, and designed for businesses, not individuals. We built RedFlaq so women and communities can access key public‑record warnings quickly and affordably."
          </p>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: '#78716C', marginTop: 12 }}>
            — Founder, RedFlaq
          </div>
        </div>

        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontStyle: 'italic', color: '#7C3AED', textAlign: 'center', marginTop: 40 }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Principle cards */}
        <div className="flex flex-col md:flex-row gap-4" style={{ marginTop: 40 }}>
          {cards.map(card => (
            <div key={card.title} style={{ border: '1.5px solid #EDE9FE', padding: 28, background: 'white', flex: 1 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: '#2D2235', marginBottom: 8 }}>{card.title}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
