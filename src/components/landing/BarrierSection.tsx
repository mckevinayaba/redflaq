import { useScrollReveal } from "@/hooks/useScrollReveal";

const BarrierSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { num: "01", icon: "💰", title: "Too Expensive", value: "Costly", desc: "Traditional checks are expensive, slow and built for companies, not for women and communities." },
    { num: "02", icon: "📋", title: "Too Bureaucratic", value: "Fingerprints", desc: "Police station visits. Physical forms. Systems designed for HR departments, not for women deciding who to trust." },
    { num: "03", icon: "⏱️", title: "Too Slow", value: "Days to Weeks", desc: "Traditional checks can take days to weeks. Too late when you need to decide today." },
  ];

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''}`}
      style={{ background: '#F7F4F0', padding: '48px 40px 56px', overflow: 'hidden', position: 'relative' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="section-tag" style={{ color: '#7C3AED' }}>
          Why No One Checked Before
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 56px)', color: '#2D2235',
          lineHeight: 1.1, maxWidth: 700, margin: '24px 0 40px',
        }}>
          Background checks existed. But they weren't built for <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>you.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: '#E8E4DF' }}>
          {cards.map(card => (
            <div key={card.num} className="transition-colors hover:bg-[#FAF5FF]" style={{ background: 'white', padding: 40 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF', letterSpacing: '0.1em', marginBottom: 24 }}>
                {card.num}
              </div>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{card.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#2D2235', marginBottom: 8 }}>
                {card.title}
              </div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: '#7C3AED', lineHeight: 1, marginBottom: 12 }}>
                {card.value}
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6" style={{ marginTop: 64 }}>
          <div style={{ flex: 1, height: 1, background: '#E8E4DF' }} />
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(24px, 3vw, 40px)', color: '#2D2235',
            textAlign: 'center', flex: 3,
          }}>
            RedFlaq makes it <em style={{ fontStyle: 'italic', color: '#7C3AED' }}>R99 and minutes.</em>
          </div>
          <div style={{ flex: 1, height: 1, background: '#E8E4DF' }} />
        </div>
      </div>
    </section>
  );
};

export default BarrierSection;
