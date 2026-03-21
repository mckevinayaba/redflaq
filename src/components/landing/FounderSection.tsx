import { useScrollReveal } from "@/hooks/useScrollReveal";
import founderPhoto from "@/assets/mckevin-ayaba.png";

const FounderSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{
      background: '#F5F0EB',
      padding: '120px 24px',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#6B4EFF', marginBottom: 16 }}>
          Why I Built This
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 4vw, 44px)', color: '#1F1F1F', marginBottom: 48, letterSpacing: '-0.02em',
        }}>
          About the <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>Founder</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
          <div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: '#1F1F1F', marginBottom: 4 }}>
              McKevin Ayaba
            </h3>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: '#888888', marginBottom: 24 }}>
              FOUNDER, REDFLAQ · ECOSYSTEM BUILDER · JOHANNESBURG, SOUTH AFRICA
            </p>

            <blockquote style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 17, fontStyle: 'italic',
              lineHeight: 1.7, color: '#1F1F1F', borderLeft: '4px solid #6B4EFF',
              paddingLeft: 24, margin: '0 0 24px 0',
            }}>
              "I built RedFlaq after years of living in, working in, and building across South Africa. I've spent years in communities across this country. I've seen first-hand what happens when people — especially women — don't have access to basic safety information. RedFlaq exists because safety should never be a privilege. Public information should be accessible to everyone, not just HR departments with big budgets."
            </blockquote>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#888888' }}>
              — McKevin Ayaba, Founder
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div className={`organic-frame-3 organic-scroll-in ${isVisible ? 'visible' : ''} mx-auto md:mx-0`}
              style={{ width: '100%', maxWidth: 400, height: 'clamp(300px, 55vw, 480px)', position: 'relative', zIndex: 1 }}
            >
              <img src={founderPhoto} alt="McKevin Ayaba, Founder of RedFlaq" />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888888', marginBottom: 16 }}>
            Also founded by McKevin:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
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
                  color: '#6B4EFF', background: '#E9E3FF',
                  border: '1px solid #6B4EFF20',
                  padding: '6px 16px', borderRadius: 50, textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#D9D0FF'}
                onMouseLeave={e => e.currentTarget.style.background = '#E9E3FF'}
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
