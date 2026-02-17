import { useScrollReveal } from "@/hooks/useScrollReveal";

const BarrierSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { num: "01", icon: "💰", title: "Too Expensive", value: "R5,000", desc: "The cost of a traditional corporate background check. Out of reach for most South Africans making personal safety decisions." },
    { num: "02", icon: "📋", title: "Too Bureaucratic", value: "Fingerprints", desc: "Police station visits. Physical forms. Systems designed for HR departments, not for women deciding who to trust." },
    { num: "03", icon: "⏱️", title: "Too Slow", value: "3 Weeks", desc: "The average wait for traditional results. Too late when you need to make a decision today." },
  ];

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''}`}
      style={{ background: '#0D0B0E', padding: '120px 60px', overflow: 'hidden', position: 'relative' }}
    >
      {/* Background watermark */}
      <div style={{
        position: 'absolute', inset: 0,
        fontFamily: "'DM Serif Display', serif", fontSize: 200,
        color: 'rgba(255,255,255,0.025)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none', whiteSpace: 'nowrap',
      }}>BLOCKED</div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="section-tag" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Why No One Checked Before
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 56px)', color: 'white',
          lineHeight: 1.1, maxWidth: 700, margin: '40px 0 64px',
        }}>
          Background checks existed. But they weren't built for you.
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 1, background: 'rgba(255,255,255,0.1)' }}>
          {cards.map(card => (
            <div key={card.num} className="transition-colors hover:bg-[rgba(124,58,237,0.15)]" style={{ background: '#0D0B0E', padding: 40 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: 24 }}>
                {card.num}
              </div>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{card.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>
                {card.title}
              </div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: '#DDD6FE', lineHeight: 1, marginBottom: 12 }}>
                {card.value}
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Solution bar */}
        <div className="flex items-center gap-6" style={{ marginTop: 64 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(24px, 3vw, 40px)', color: 'white',
            textAlign: 'center', flex: 3,
          }}>
            RedFlaq makes it <em style={{ fontStyle: 'italic', color: '#DDD6FE' }}>R99 and 5 minutes.</em>
          </div>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
        </div>
      </div>
    </section>
  );
};

export default BarrierSection;
