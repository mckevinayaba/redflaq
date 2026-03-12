import { useScrollReveal } from "@/hooks/useScrollReveal";
import coffeeImg from "@/assets/sa-women-coffee.jpg";
import motherImg from "@/assets/sa-mother-child.jpg";
import professionalImg from "@/assets/sa-professional-woman.jpg";

const PhotoGrid = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`} style={{ background: '#F5F0EB' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-[38%_32%_28%] gap-5 md:gap-6 items-start">
          {/* Column 1 — Text */}
          <div className="flex flex-col justify-center pr-4" style={{ paddingTop: 24 }}>
            <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 24 }}>
              Real Stories
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: '#1A1523',
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: '-0.01em',
            }}>
              Real South African Women.<br />
              Real Safety Decisions.
            </h2>
            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 16,
              color: '#6B7280',
              lineHeight: 1.75,
              maxWidth: 400,
            }}>
              Every day, women across Johannesburg, Cape Town, Durban, and
              Pretoria use RedFlaq to verify before they trust. These are their
              stories of preparation, not paranoia.
            </p>
            <div style={{ marginTop: 36 }}>
              <button
                onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'transparent',
                  border: '2px solid #7C3AED',
                  color: '#7C3AED',
                  padding: '14px 32px',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  borderRadius: 50,
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#7C3AED';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#7C3AED';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Read Their Stories →
              </button>
            </div>
          </div>

          {/* Column 2 — Large photo with gradient overlay */}
          <div style={{ position: 'relative' }}>
            <div
              className={`organic-frame-2 organic-scroll-in ${isVisible ? 'visible' : ''}`}
              style={{ height: 520, position: 'relative' }}
            >
              <img
                src={coffeeImg}
                alt="Two diverse South African women sharing a supportive conversation at a coffee shop"
                loading="lazy"
                width="768"
                height="1024"
              />
              {/* Bottom gradient overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to top, rgba(124,58,237,0.15), transparent)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Column 3 — Two stacked photos, offset for asymmetry */}
          <div className="flex flex-col gap-5" style={{ paddingTop: 48 }}>
            <div
              className={`organic-frame-3 organic-scroll-in ${isVisible ? 'visible' : ''}`}
              style={{ height: 260, position: 'relative' }}
            >
              <img
                src={motherImg}
                alt="South African mother holding her child protectively in a bright home"
                loading="lazy"
                width="768"
                height="512"
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: 'linear-gradient(to top, rgba(124,58,237,0.12), transparent)',
                pointerEvents: 'none',
              }} />
            </div>
            <div
              className={`organic-frame-1 organic-scroll-in ${isVisible ? 'visible' : ''}`}
              style={{ height: 220, position: 'relative' }}
            >
              <img
                src={professionalImg}
                alt="Young professional South African woman with urban Johannesburg backdrop"
                loading="lazy"
                width="768"
                height="512"
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: 'linear-gradient(to top, rgba(124,58,237,0.12), transparent)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGrid;
