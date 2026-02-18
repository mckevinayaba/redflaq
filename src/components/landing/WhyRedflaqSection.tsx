import { useScrollReveal } from "@/hooks/useScrollReveal";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { icon: "🛡️", title: "Public Records Only", desc: "We never create data. We surface what already exists in public‑record warning lists and government‑published information." },
    { icon: "🔒", title: "POPIA‑Aware", desc: "Every search requires a legitimate purpose and consent statement. We minimise data, protect your information, and respect everyone's rights." },
    { icon: "✓", title: "Confidential Use", desc: "Searches are private. The person you check is not notified. Results are for your own safety decisions, not for public shaming or harassment." },
  ];

  return (
    <section id="about" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '120px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="flex justify-center mb-8">
          <span style={{ background: '#7C3AED', color: 'white', padding: '6px 16px', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12 }}>OUR STORY</span>
        </div>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(40px, 4vw, 56px)', color: '#2D2235', textAlign: 'center', marginBottom: 48 }}>
          Why RedFlaq Exists
        </h2>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, color: '#4B4453', maxWidth: 800, margin: '0 auto', lineHeight: 1.8 }} className="space-y-6">
          <p>South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every few hours. Tens of thousands of sexual offences are reported each year.</p>
          <p>Many of these tragedies had warning signs: public wanted notices, sanctions, and other public‑record warnings. The information existed, but ordinary people couldn't access it easily or quickly.</p>
          <p>Traditional background checks can be expensive, slow, and built for employers, not for women, families, or communities deciding who to trust. RedFlaq exists to make key public‑record warnings easier to search so more people can make informed safety decisions.</p>
        </div>

        {/* Founder quote */}
        <div style={{ maxWidth: 800, margin: '40px auto', borderLeft: '4px solid #7C3AED', paddingLeft: 24 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontStyle: 'italic', color: '#2D2235', lineHeight: 1.6 }}>
            "Traditional background check services exist, but they are slow, bureaucratic, and designed for businesses, not individuals. I built RedFlaq so women and communities can access key public‑record warnings quickly and affordably."
          </p>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: '#78716C', marginTop: 16 }}>
            — McKevin Ayaba, Founder of RedFlaq
          </div>
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, color: '#4B4453', maxWidth: 800, margin: '32px auto 0', lineHeight: 1.8 }}>
          <p>RedFlaq uses South African public‑record warning lists and other public information to make serious risks easier to spot — in minutes, not weeks.</p>
        </div>

        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontStyle: 'italic', color: '#7C3AED', textAlign: 'center', marginTop: 40 }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6" style={{ maxWidth: 900, margin: '48px auto 0' }}>
          {cards.map(card => (
            <div key={card.title} style={{ border: '1.5px solid #EDE9FE', padding: 32, background: 'white', flex: 1 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#2D2235', marginBottom: 8 }}>{card.title}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 48 }}>
          Sources: SAPS Crime Statistics · DSTI/Stats SA 2024 Gender Report · MRC National Femicide Study
        </p>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
