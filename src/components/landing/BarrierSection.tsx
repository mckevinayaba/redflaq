import { useScrollReveal } from "@/hooks/useScrollReveal";
import { DollarSign, ClipboardList, Clock, ArrowRight } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const BarrierSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { guardedAction } = useAuthGuard();

  const cards = [
    {
      num: "01",
      Icon: DollarSign,
      title: "Too Expensive",
      oldWay: "R500+",
      redflaq: "R99",
      desc: "Traditional checks are expensive, slow and built for companies, not for women and communities.",
    },
    {
      num: "02",
      Icon: ClipboardList,
      title: "Too Bureaucratic",
      oldWay: "Fingerprints",
      redflaq: "Online",
      desc: "Police station visits. Physical forms. Systems designed for HR departments, not for women deciding who to trust.",
    },
    {
      num: "03",
      Icon: Clock,
      title: "Too Slow",
      oldWay: "Days–Weeks",
      redflaq: "<60 Seconds",
      desc: "Traditional checks can take days to weeks. Too late when you need to decide today.",
    },
  ];

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`}
      style={{
        background: 'linear-gradient(180deg, #110D1F 0%, #0F0A1A 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="section-tag" style={{ color: '#A855F7', marginBottom: 24 }}>
          Why No One Checked Before
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 56px)',
          color: 'white',
          lineHeight: 1.08,
          maxWidth: 700,
          margin: '0 0 56px',
          letterSpacing: '-0.02em',
        }}>
          Background checks existed. But they weren't built for <em style={{ color: '#A855F7', fontStyle: 'italic' }}>you.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(card => (
            <div
              key={card.num}
              style={{
                background: 'rgba(124, 58, 237, 0.06)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: 20,
                padding: '40px 32px',
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.1em',
                marginBottom: 20,
              }}>
                {card.num}
              </div>

              <card.Icon style={{ width: 28, height: 28, color: '#EF4444', marginBottom: 20, opacity: 0.8 }} />

              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: 'white',
                marginBottom: 16,
              }}>
                {card.title}
              </div>

              {/* Old vs RedFlaq comparison */}
              <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#EF4444',
                  background: 'rgba(239,68,68,0.1)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  textDecoration: 'line-through',
                }}>
                  {card.oldWay}
                </span>
                <ArrowRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  color: '#A855F7',
                  background: 'rgba(168,85,247,0.15)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontWeight: 700,
                }}>
                  {card.redflaq}
                </span>
              </div>

              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.65,
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{
          marginTop: 64,
          background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
          borderRadius: 20,
          padding: '48px 40px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(24px, 3vw, 40px)',
            color: 'white',
            marginBottom: 24,
          }}>
            Traditional checks are costly, take days, and come with too much bureaucracy. RedFlaq does it for <em style={{ fontStyle: 'italic' }}>R99 in under 60 seconds.</em>
          </p>
          <button
            onClick={() => guardedAction()}
            style={{
              background: 'white',
              color: '#7C3AED',
              padding: '16px 40px',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              border: 'none',
              cursor: 'pointer',
              borderRadius: 50,
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
            }}
          >
            Verify Someone Now — R99
          </button>
        </div>
      </div>
    </section>
  );
};

export default BarrierSection;
