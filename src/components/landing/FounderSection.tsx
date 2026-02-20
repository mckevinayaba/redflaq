import { useScrollReveal } from "@/hooks/useScrollReveal";

const FounderSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '60px 40px 80px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>
          Why I Built This
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 4vw, 44px)', color: '#2D2235', marginBottom: 40,
        }}>
          About the <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Founder</em>
        </h2>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Photo placeholder */}
          <div style={{
            width: 160, minWidth: 160, height: 160, borderRadius: '50%',
            background: '#EDE9FE', border: '3px solid #7C3AED',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, margin: '0 auto',
          }}>
            {/* PLACEHOLDER: Upload founder headshot here */}
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#7C3AED', textAlign: 'center', padding: 16 }}>
              Founder Photo
            </span>
          </div>

          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2235', marginBottom: 4 }}>
              McKevin Ayaba
            </h3>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: '#78716C', marginBottom: 20 }}>
              FOUNDER, REDFLAQ · ECOSYSTEM BUILDER · JOHANNESBURG, SOUTH AFRICA
            </p>

            <blockquote style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 17, fontStyle: 'italic',
              lineHeight: 1.7, color: '#2D2235', borderLeft: '4px solid #7C3AED',
              paddingLeft: 20, margin: '0 0 20px 0',
            }}>
              "I built RedFlaq after years of living in, working in, and building across South Africa. As the founder of the Africa Startup Ecosystem Builders Summit & Awards and Setup A Startup, I've spent years in communities across this country. I've seen first-hand what happens when people — especially women — don't have access to basic safety information. RedFlaq exists because safety should never be a privilege. Public information should be accessible to everyone, not just HR departments with big budgets."
            </blockquote>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#4B4453' }}>
              — McKevin Ayaba, Founder
            </p>
          </div>
        </div>

        {/* Also founded by */}
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12 }}>
            Also founded by McKevin:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "ASEB Summit & Awards", href: "https://www.aseb.africa" },
              { label: "Setup A Startup", href: "https://www.setupastartup.com" },
              { label: "KeaLeboga", href: "https://www.kealeboga.com" },
              { label: "Grieve.World", href: "https://www.grieve.world" },
            ].map(item => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
                  color: '#7C3AED', background: '#EDE9FE', padding: '6px 14px',
                  borderRadius: 999, textDecoration: 'none', transition: 'background 0.2s',
                }}
                className="hover:!bg-[#DDD6FE]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
