import { useScrollReveal } from "@/hooks/useScrollReveal";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { icon: "🛡️", title: "Public Records Only", desc: "We never create data. We surface what already exists in government databases." },
    { icon: "🔒", title: "POPIA Compliant", desc: "Every search requires explicit consent and a legitimate stated purpose. Your rights protected." },
    { icon: "✓", title: "Human Verified", desc: "No automated flags. Every result reviewed by a human before delivery to ensure accuracy." },
  ];

  return (
    <section id="about" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', padding: '120px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="flex justify-center mb-8">
          <span style={{ background: 'white', color: '#7C3AED', padding: '6px 16px', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 12 }}>OUR STORY</span>
        </div>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(40px, 4vw, 56px)', color: 'white', textAlign: 'center', marginBottom: 48 }}>
          Why RedFlaq Exists
        </h2>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, color: 'white', maxWidth: 800, margin: '0 auto', lineHeight: 1.8 }} className="space-y-6">
          <p>South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every 6 hours. Over 40,000 sexual offences are reported yearly.</p>
          <p>Many of these tragedies had warning signs. Public criminal records. Court cases. Protection orders. Information that existed in government databases that nobody could access.</p>
          <p>Why? Because traditional bundled background checks cost R2,000–R5,000+, required fingerprints at a police station, and took days to weeks. They were designed for corporations verifying employees, not for women making decisions about who to trust.</p>
        </div>

        {/* Founder quote */}
        <div style={{ maxWidth: 800, margin: '40px auto', borderLeft: '4px solid rgba(255,255,255,0.4)', paddingLeft: 24 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontStyle: 'italic', color: 'white', lineHeight: 1.6 }}>
            "Traditional background check services exist, but they are slow, bureaucratic, and designed for businesses, not individuals. I built RedFlaq for instant access—women should be able to know if someone they are close to has a history of violence or fraud. At R99."
          </p>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginTop: 16 }}>
            — McKevin Ayaba, Founder of RedFlaq
          </div>
        </div>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, color: 'white', maxWidth: 800, margin: '32px auto 0', lineHeight: 1.8 }}>
          <p>RedFlaq searches SAPS, court records, and government gazettes—the same public databases corporations use for employee screening. We made them searchable by anyone for R99 in minutes, not weeks.</p>
        </div>

        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontStyle: 'italic', color: 'white', textAlign: 'center', marginTop: 40 }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-6" style={{ maxWidth: 900, margin: '48px auto 0' }}>
          {cards.map(card => (
            <div key={card.title} style={{ border: '1px solid rgba(255,255,255,0.2)', padding: 32, background: 'rgba(255,255,255,0.05)', flex: 1 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{card.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 8 }}>{card.title}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 48 }}>
          Sources: SAPS Crime Statistics · DSTI/Stats SA 2024 Gender Report · MRC National Femicide Study
        </p>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
