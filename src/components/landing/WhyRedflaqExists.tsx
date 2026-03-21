import { useScrollReveal } from "@/hooks/useScrollReveal";

const WhyRedflaqExists = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`reveal-section ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`}
      style={{ background: 'linear-gradient(180deg, #0F0A1A 0%, #1A1035 100%)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#A855F7', marginBottom: 16 }}>
          Why RedFlaq Exists
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 4vw, 48px)',
          lineHeight: 1.1,
          color: 'white',
          marginBottom: 56,
          letterSpacing: '-0.02em',
        }}>
          Information inequality costs <em style={{ color: '#A855F7', fontStyle: 'italic' }}>lives.</em>
        </h2>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12" style={{ marginBottom: 48 }}>
          {/* Left — context */}
          <div>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: 24,
            }}>
              South Africa has one of the highest GBVF rates globally. It has been declared a national crisis and a "second pandemic."
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                "40,000+ sexual offences reported annually (SAPS).",
                "Around 1 in 3 women experience intimate partner violence in their lifetime (Stats SA).",
                "Women, men, children and elders live with daily fear of violence in homes, taxis and communities.",
                "Many tragedies involved people who already had public‑record warnings — but those warnings were never seen because verification cost hundreds of rand and took weeks.",
              ].map((item) => (
                <li key={item} style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}>
                  <span style={{ color: '#EF4444', flexShrink: 0, fontSize: 18, lineHeight: 1, marginTop: 2 }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — solution */}
          <div>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: 12,
            }}>
              RedFlaq was co‑founded by GBV survivor and advocate Nthabiseng Montsho and technology entrepreneur McKevin Ayaba to close this information gap.
            </p>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.8)',
              marginBottom: 28,
            }}>
              We make public‑record safety signals accessible for individuals and communities, not just corporations:
            </p>

            {/* Comparison grid */}
            <div className="grid grid-cols-3 gap-4" style={{ marginBottom: 32 }}>
              {[
                { top: 'R99', bottom: 'Not R2,000+' },
                { top: '60 seconds', bottom: 'Not 2 weeks' },
                { top: 'Everyone', bottom: 'Not only HR departments' },
              ].map((c) => (
                <div key={c.top} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#A855F7', marginBottom: 6 }}>{c.top}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{c.bottom}</div>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 20,
              fontStyle: 'italic',
              color: '#A855F7',
              lineHeight: 1.5,
            }}>
              Because safety and information should never be a privilege.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqExists;
