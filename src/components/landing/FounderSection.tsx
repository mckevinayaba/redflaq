import { useScrollReveal } from "@/hooks/useScrollReveal";
import founderPhoto from "@/assets/mckevin-ayaba.png";

const FounderSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{
      background: 'linear-gradient(180deg, #0F0A1A 0%, #1A1035 100%)',
      padding: '120px 24px',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#A855F7', marginBottom: 16 }}>
          Why I Built This
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 4vw, 44px)', color: 'white', marginBottom: 48, letterSpacing: '-0.02em',
        }}>
          About the <em style={{ color: '#A855F7', fontStyle: 'italic' }}>Founder</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>
              McKevin Ayaba
            </h3>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
              FOUNDER, REDFLAQ · ECOSYSTEM BUILDER · JOHANNESBURG, SOUTH AFRICA
            </p>

            <blockquote style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 17, fontStyle: 'italic',
              lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', borderLeft: '4px solid #7C3AED',
              paddingLeft: 24, margin: '0 0 24px 0',
            }}>
              "I built RedFlaq after years of living in, working in, and building across South Africa. As the founder of the Africa Startup Ecosystem Builders Summit & Awards and Setup A Startup, I've spent years in communities across this country. I've seen first-hand what happens when people — especially women — don't have access to basic safety information. RedFlaq exists because safety should never be a privilege. Public information should be accessible to everyone, not just HR departments with big budgets."
            </blockquote>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
              — McKevin Ayaba, Founder
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: -8,
              borderRadius: '45% 55% 60% 40% / 50% 50% 50% 50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)',
              filter: 'blur(16px)', zIndex: 0,
            }} />
            <div className={`organic-frame-3 organic-scroll-in ${isVisible ? 'visible' : ''} mx-auto md:mx-0`}
              style={{ width: '100%', maxWidth: 400, height: 480, position: 'relative', zIndex: 1 }}
            >
              <img src={founderPhoto} alt="McKevin Ayaba, Founder of RedFlaq" />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
            Also founded by McKevin:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: "ASEB Summit & Awards", href: "https://www.asebsummit.com" },
              { label: "ASEB Society", href: "https://www.aseb.africa" },
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
                  color: '#A855F7', background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  padding: '6px 16px', borderRadius: 50, textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(168,85,247,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'}
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
