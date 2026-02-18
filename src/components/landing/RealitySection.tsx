import { useScrollReveal } from "@/hooks/useScrollReveal";

const RealitySection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '120px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 40 }}>
          The South African Reality
        </div>

        <div style={{ border: '1.5px solid #D6D3CD' }}>
          <div style={{ borderBottom: '1.5px solid #D6D3CD', padding: 48 }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(40px, 4vw, 60px)', lineHeight: 1.1, color: '#2D2235',
            }}>
              Violence rarely begins<br />
              with <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>violence.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1.5px solid #D6D3CD' }}>
            <div style={{ padding: '40px 48px', borderRight: '1.5px solid #D6D3CD' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, color: '#2D2235', lineHeight: 1 }}>
                1 in <span style={{ color: '#7C3AED' }}>3</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#2D2235', margin: '12px 0 8px' }}>
                South African women have experienced lifetime physical violence
              </div>
              <p style={{ fontSize: 14, color: '#78716C', lineHeight: 1.6 }}>
                Most will never know their partner had a history in public records.
              </p>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 12 }}>
                DSTI / STATS SA · 2024 GENDER REPORT
              </div>
            </div>

            <div style={{ padding: '40px 48px' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, lineHeight: 1 }}>
                <span style={{ color: '#7C3AED' }}>40,000+</span>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#2D2235', margin: '12px 0 8px' }}>
                Sexual offences reported annually
              </div>
              <p style={{ fontSize: 14, color: '#78716C', lineHeight: 1.6 }}>
                Thousands of perpetrators had prior public‑record warnings that were never checked.
              </p>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 12 }}>
                SAPS CRIME STATISTICS · ANNUAL REPORT
              </div>
            </div>
          </div>

          <div style={{ padding: 48, background: '#FAF5FF', position: 'relative' }}>
            <span style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 120, lineHeight: 0.6,
              color: '#EDE9FE', position: 'absolute', top: 32, left: 40,
            }}>"</span>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(20px, 2.5vw, 28px)', fontStyle: 'italic',
              lineHeight: 1.5, color: '#2D2235', maxWidth: 800, marginLeft: 60,
            }}>
              It begins with information people didn't have. Patterns they couldn't verify. Warnings they were never shown. RedFlaq exists to close that gap.
            </p>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
              color: '#78716C', marginTop: 20, marginLeft: 60,
            }}>
              — McKevin Ayaba, Founder of RedFlaq
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealitySection;
