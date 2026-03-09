import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { AlertTriangle, TrendingUp } from "lucide-react";

const RealitySection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { count: statTwo, ref: statRef } = useCountUp(40000, 2000);

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''}`}
      className="py-12 md:py-20 px-6"
      style={{ background: 'linear-gradient(180deg, #0F0A1A 0%, #1A1035 100%)' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#A855F7', marginBottom: 40 }}>
          The South African Reality
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 56px)',
          lineHeight: 1.08,
          color: 'white',
          marginBottom: 56,
          letterSpacing: '-0.02em',
        }}>
          Violence rarely begins<br />
          with <em style={{ color: '#A855F7', fontStyle: 'italic' }}>violence.</em>
        </h2>

        {/* Bento grid stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginBottom: 48 }}>
          {/* Stat 1 — 1 in 3 */}
          <div style={{
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: 20,
            padding: '44px 44px',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 120, height: 120,
              background: 'radial-gradient(circle, rgba(220,38,38,0.15), transparent 70%)',
              filter: 'blur(24px)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <AlertTriangle style={{ width: 24, height: 24, color: '#EF4444', marginBottom: 16, opacity: 0.8 }} />
              <div
                className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 64,
                  color: 'white',
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                1 in <span style={{ color: '#A855F7' }}>3</span>
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6,
                maxWidth: 380,
                marginBottom: 16,
              }}>
                Women experience gender‑based violence in the hands of an intimate partner during their lifetime
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.1em',
              }}>
                STATS SA · DSTI 2024 GENDER REPORT
              </span>
            </div>
          </div>

          {/* Stat 2 — 40,000+ */}
          <div ref={statRef} style={{
            background: 'rgba(124, 58, 237, 0.08)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
            borderRadius: 20,
            padding: '44px 44px',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 120, height: 120,
              background: 'radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)',
              filter: 'blur(24px)', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <TrendingUp style={{ width: 24, height: 24, color: '#A855F7', marginBottom: 16, opacity: 0.8 }} />
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 64,
                lineHeight: 1,
                marginBottom: 16,
              }}>
                <span style={{
                  color: '#A855F7',
                  textShadow: '0 0 24px rgba(168,85,247,0.3)',
                }}>
                  {statTwo >= 35000 ? statTwo.toLocaleString() : '40,000'}+
                </span>
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.8)',
                lineHeight: 1.6,
                maxWidth: 380,
                marginBottom: 16,
              }}>
                Sexual offences reported annually
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.1em',
              }}>
                SAPS ANNUAL CRIME STATISTICS
              </span>
            </div>
          </div>
        </div>

        {/* Founder quote — glassmorphism pull-quote */}
        <div style={{
          background: 'rgba(124, 58, 237, 0.06)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          borderLeft: '4px solid #7C3AED',
          borderRadius: 16,
          padding: '40px 48px',
          position: 'relative',
        }}>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 80,
            lineHeight: 0.5,
            color: 'rgba(168,85,247,0.15)',
            position: 'absolute',
            top: 28,
            left: 32,
          }}>"</span>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(18px, 2vw, 24px)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.9)',
            maxWidth: 700,
            marginLeft: 40,
          }}>
            It begins with information people didn't have. Patterns they couldn't verify. Warnings they were never shown. RedFlaq exists to close that gap.
          </p>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.45)',
            marginTop: 20,
            marginLeft: 40,
          }}>
            — McKevin Ayaba, Founder of RedFlaq
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealitySection;
