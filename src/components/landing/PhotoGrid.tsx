import { useScrollReveal } from "@/hooks/useScrollReveal";
import coffeeImg from "@/assets/sa-women-coffee.jpg";
import motherImg from "@/assets/sa-mother-child.jpg";
import professionalImg from "@/assets/sa-professional-woman.jpg";

const PhotoGrid = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''}`}
      style={{ background: '#FDFCFA', padding: '100px 60px', maxWidth: 1200, margin: '0 auto' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[40%_30%_30%] gap-6 md:gap-8">
        {/* Column 1 — Text */}
        <div className="flex flex-col justify-center">
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: '#0D0B0E',
            lineHeight: 1.2,
            marginBottom: 20,
          }}>
            Real South African Women.<br />
            Real Safety Decisions.
          </h2>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 17,
            color: '#78716C',
            lineHeight: 1.8,
          }}>
            Every day, women across Johannesburg, Cape Town, Durban, and
            Pretoria use RedFlaq to verify before they trust. These are their
            stories of preparation, not paranoia.
          </p>
          <div style={{ marginTop: 32 }}>
            <button
              onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover:bg-[#0D0B0E] hover:text-white transition-all hover:-translate-y-0.5"
              style={{
                background: 'transparent',
                border: '2px solid #0D0B0E',
                color: '#0D0B0E',
                padding: '14px 28px',
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Read Their Stories →
            </button>
          </div>
        </div>

        {/* Column 2 — Large photo */}
        <div className={`organic-frame-2 organic-scroll-in ${isVisible ? 'visible' : ''}`} style={{ height: 500 }}>
          <img
            src={coffeeImg}
            alt="Two diverse South African women sharing a supportive conversation at a coffee shop"
            loading="lazy"
            width="768"
            height="1024"
          />
        </div>

        {/* Column 3 — Two stacked photos */}
        <div className="flex flex-col gap-5">
          <div className={`organic-frame-3 organic-scroll-in ${isVisible ? 'visible' : ''}`} style={{ height: 240 }}>
            <img
              src={motherImg}
              alt="South African mother holding her child protectively in a bright home"
              loading="lazy"
              width="768"
              height="512"
            />
          </div>
          <div className={`organic-frame-1 organic-scroll-in ${isVisible ? 'visible' : ''}`} style={{ height: 240 }}>
            <img
              src={professionalImg}
              alt="Young professional South African woman with urban Johannesburg backdrop"
              loading="lazy"
              width="768"
              height="512"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoGrid;
