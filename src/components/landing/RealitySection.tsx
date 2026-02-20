import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";

const RealitySection = () => {
  const { ref, isVisible } = useScrollReveal();
  // Start from 35000 so the counter never shows misleadingly low numbers
  const { count: statTwo, ref: statRef } = useCountUp(40000, 2000);

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '40px 40px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 32 }}>
          The South African Reality
        </div>

        <div style={{ border: '1.5px solid #D6D3CD' }}>
          <div style={{ borderBottom: '1.5px solid #D6D3CD', padding: '40px 48px' }}>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.1, color: '#2D2235',
            }}>
              Violence rarely begins<br />
              with <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>violence.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderBottom: '1.5px solid #D6D3CD' }}>
            <div style={{ padding: '36px 48px', borderRight: '1.5px solid #D6D3CD' }}>
              {/* FIX 3: Do NOT animate this ratio — fade it in directly */}
              <div
                className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, color: '#2D2235', lineHeight: 1 }}
              >
                1 in <span style={{ color: '#7C3AED' }}>3</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#2D2235', margin: '12px 0 8px' }}>
                Women experience gender‑based violence in the hands of an intimate partner during their lifetime
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9CA3AF', marginTop: 12 }}>
                STATS SA · DSTI 2024 GENDER REPORT
              </div>
            </div>

            <div ref={statRef} style={{ padding: '36px 48px' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 56, lineHeight: 1 }}>
                {/* FIX 3: Start display from 35000 minimum so no misleading low numbers show */}
                <span style={{ color: '#7C3AED' }}>{statTwo >= 35000 ? statTwo.toLocaleString() : '40,000'}+</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#2D2235', margin: '12px 0 8px' }}>
                Sexual offences reported annually
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#9CA3AF', marginTop: 12 }}>
                SAPS ANNUAL CRIME STATISTICS
              </div>
            </div>
          </div>

          <div style={{ padding: '40px 48px', background: '#FAF5FF', position: 'relative' }}>
            <span style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 100, lineHeight: 0.6,
              color: '#EDE9FE', position: 'absolute', top: 24, left: 36,
            }}>"</span>
            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(18px, 2vw, 24px)', fontStyle: 'italic',
              lineHeight: 1.5, color: '#2D2235', maxWidth: 700, marginLeft: 56,
            }}>
              It begins with information people didn't have. Patterns they couldn't verify. Warnings they were never shown. RedFlaq exists to close that gap.
            </p>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600,
              color: '#78716C', marginTop: 16, marginLeft: 56,
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
