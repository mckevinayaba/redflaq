import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ShieldAlert } from "lucide-react";

const steps = [
  { num: "01", title: "You Provide Details", desc: "Enter their full name and province, and tell us why you're checking (dating, flat‑share, childcare, etc.)." },
  { num: "02", title: "We Scan Public Records", desc: "RedFlaq checks South African public‑record warning lists for possible matches on that name." },
  { num: "03", title: "You Get a Clear Safety Signal", desc: "See whether public records suggest high, moderate, low or no visible risk — with links to the original public record where possible." },
  { num: "04", title: "Download Your Report", desc: "Save a PDF to keep for yourself or share with someone you trust." },
];

const HowItWorksPlinq = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`} style={{ background: '#F5F0EB' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#6B4EFF', marginBottom: 16 }}>
          The Process
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 52px)',
          maxWidth: 500,
          color: '#1A1523',
          marginBottom: 20,
          letterSpacing: '-0.02em',
        }}>
          Fast. Simple. <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>Public‑record based.</em>
        </h2>

        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 15,
          color: '#6B7280',
          lineHeight: 1.7,
          maxWidth: 640,
          marginBottom: 56,
        }}>
          Trusting relationships begin with information. Here's how RedFlaq turns public‑record warning lists into a simple high/medium/low/clear safety signal.
        </p>

        {/* Timeline layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[12.5%] right-[12.5%] h-[2px]"
            style={{ background: 'linear-gradient(90deg, #E9E3FF, #6B4EFF, #E9E3FF)' }}
          />

          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                padding: '0 20px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Step circle */}
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#E9E3FF',
                border: '2px solid #6B4EFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                position: 'relative',
                zIndex: 2,
              }}>
                <span style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 24,
                  color: '#6B4EFF',
                  fontWeight: 700,
                }}>
                  {step.num}
                </span>
              </div>

              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: '#1A1523',
                marginBottom: 10,
              }}>
                {step.title}
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                color: '#6B7280',
                lineHeight: 1.65,
                maxWidth: 240,
                margin: '0 auto',
              }}>
                {step.desc}
              </p>

              {/* Vertical connector for mobile */}
              {i < steps.length - 1 && (
                <div className="md:hidden" style={{
                  width: 2,
                  height: 32,
                  background: '#E9E3FF',
                  margin: '16px auto',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer card */}
        <div style={{
          marginTop: 56,
          background: 'rgba(124, 58, 237, 0.04)',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          borderRadius: 12,
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          maxWidth: 640,
          margin: '56px auto 0',
        }}>
          <ShieldAlert style={{ width: 20, height: 20, color: '#7C3AED', flexShrink: 0, opacity: 0.7 }} />
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
            We never access private SAPS fingerprint or internal criminal record databases. RedFlaq only uses information that is already public.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPlinq;
