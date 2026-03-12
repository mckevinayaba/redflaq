import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { AlertTriangle, TrendingUp } from "lucide-react";

const RealitySection = () => {
  const { ref, isVisible } = useScrollReveal();
  const { count: statTwo, ref: statRef } = useCountUp(40000, 2000);

  return (
    <section
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`}
      style={{ background: '#F5F0EB' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#6B4EFF', marginBottom: 40 }}>
          The South African Reality
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 56px)',
          lineHeight: 1.08,
          color: '#1F1F1F',
          marginBottom: 56,
          letterSpacing: '-0.02em',
        }}>
          Violence rarely begins<br />
          with <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>violence.</em>
        </h2>

        {/* Bento grid stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginBottom: 48 }}>
          {/* Stat 1 — 1 in 3 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E6E0DA',
            borderRadius: 20,
            padding: '44px 44px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <AlertTriangle style={{ width: 24, height: 24, color: '#EF4444', marginBottom: 16, opacity: 0.8 }} />
              <div
                className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 64,
                  color: '#1F1F1F',
                  lineHeight: 1,
                  marginBottom: 16,
                }}
              >
                1 in <span style={{ color: '#6B4EFF' }}>3</span>
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: '#555555',
                lineHeight: 1.6,
                maxWidth: 380,
                marginBottom: 16,
              }}>
                Women experience gender‑based violence in the hands of an intimate partner during their lifetime
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: '#888888',
                letterSpacing: '0.1em',
              }}>
                STATS SA · DSTI 2024 GENDER REPORT
              </span>
            </div>
          </div>

          {/* Stat 2 — 40,000+ */}
          <div ref={statRef} style={{
            background: '#FFFFFF',
            border: '1px solid #E6E0DA',
            borderRadius: 20,
            padding: '44px 44px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <TrendingUp style={{ width: 24, height: 24, color: '#6B4EFF', marginBottom: 16, opacity: 0.8 }} />
              <div style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 64,
                lineHeight: 1,
                marginBottom: 16,
              }}>
                <span style={{ color: '#6B4EFF' }}>
                  {statTwo >= 35000 ? statTwo.toLocaleString() : '40,000'}+
                </span>
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: '#555555',
                lineHeight: 1.6,
                maxWidth: 380,
                marginBottom: 16,
              }}>
                Sexual offences reported annually
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: '#888888',
                letterSpacing: '0.1em',
              }}>
                SAPS ANNUAL CRIME STATISTICS
              </span>
            </div>
          </div>
        </div>

        {/* Founder quote */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E6E0DA',
          borderLeft: '4px solid #6B4EFF',
          borderRadius: 16,
          padding: '40px 48px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'relative',
        }}>
          <span style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 80,
            lineHeight: 0.5,
            color: '#6B4EFF15',
            position: 'absolute',
            top: 28,
            left: 32,
          }}>"</span>
          <p style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(18px, 2vw, 24px)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: '#1F1F1F',
            maxWidth: 700,
            marginLeft: 40,
          }}>
            It begins with information people didn't have. Patterns they couldn't verify. Warnings they were never shown. RedFlaq exists to close that gap.
          </p>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: '#888888',
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
